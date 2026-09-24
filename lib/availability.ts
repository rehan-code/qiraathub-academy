/**
 * Timezone-aware availability helpers shared by the booking UI and the
 * booking API. Everything here is pure and dependency-free (uses `Intl`),
 * so it runs identically in the browser and on the server.
 */

export interface AvailabilityWindow {
  /** Days of the week in the teacher's timezone. 0 = Sunday … 6 = Saturday. */
  days: number[];
  /** Window start, "HH:mm" 24-hour, in the teacher's timezone (inclusive). */
  start: string;
  /** Window end, "HH:mm" 24-hour, in the teacher's timezone (exclusive). "24:00" is allowed. */
  end: string;
}

/** An absolute time range expressed as ISO-8601 strings. */
export interface TimeRange {
  start: string;
  end: string;
}

export interface CalendarDate {
  year: number;
  /** 1–12 */
  month: number;
  /** 1–31 */
  day: number;
}

export interface ZonedParts extends CalendarDate {
  hour: number;
  minute: number;
  second: number;
  /** 0 = Sunday … 6 = Saturday */
  weekday: number;
}

export const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];
export const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MINUTE_MS = 60_000;
const DAY_MS = 86_400_000;

const WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

const partsFormatterCache = new Map<string, Intl.DateTimeFormat>();

function getPartsFormatter(timeZone: string): Intl.DateTimeFormat {
  let formatter = partsFormatterCache.get(timeZone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      weekday: "short",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    partsFormatterCache.set(timeZone, formatter);
  }
  return formatter;
}

export function isValidTimeZone(timeZone: unknown): timeZone is string {
  if (typeof timeZone !== "string" || !timeZone) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone }).format(new Date());
    return true;
  } catch {
    return false;
  }
}

/** Wall-clock parts of an instant in the given timezone. */
export function getZonedParts(date: Date, timeZone: string): ZonedParts {
  const parts = getPartsFormatter(timeZone).formatToParts(date);
  const lookup: Record<string, string> = {};
  for (const part of parts) {
    if (part.type !== "literal") lookup[part.type] = part.value;
  }
  return {
    year: Number(lookup.year),
    month: Number(lookup.month),
    day: Number(lookup.day),
    hour: Number(lookup.hour) % 24,
    minute: Number(lookup.minute),
    second: Number(lookup.second),
    weekday: WEEKDAY_INDEX[lookup.weekday] ?? 0,
  };
}

/** Offset of `timeZone` from UTC at the given instant, in milliseconds (positive east of UTC). */
export function getTimeZoneOffsetMs(timeZone: string, date: Date): number {
  const p = getZonedParts(date, timeZone);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  const wholeSeconds = date.getTime() - date.getUTCMilliseconds();
  return asUtc - wholeSeconds;
}

/**
 * Convert a wall-clock time in `timeZone` to an absolute instant.
 * Day/hour overflow is allowed (e.g. day + 1, hour 24) and rolls over naturally.
 */
export function zonedTimeToUtc(
  timeZone: string,
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
): Date {
  const wall = Date.UTC(year, month - 1, day, hour, minute, 0, 0);
  const firstGuess = getTimeZoneOffsetMs(timeZone, new Date(wall));
  const utc = wall - firstGuess;
  const secondGuess = getTimeZoneOffsetMs(timeZone, new Date(utc));
  return new Date(firstGuess === secondGuess ? utc : wall - secondGuess);
}

export function parseHHmm(value: string): { hours: number; minutes: number } {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) throw new Error(`Invalid time "${value}", expected HH:mm`);
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours < 0 || hours > 24 || minutes < 0 || minutes > 59 || (hours === 24 && minutes !== 0)) {
    throw new Error(`Invalid time "${value}"`);
  }
  return { hours, minutes };
}

export function rangesOverlap(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
  return aStart < bEnd && bStart < aEnd;
}

export function toDateKey(date: CalendarDate): string {
  const mm = String(date.month).padStart(2, "0");
  const dd = String(date.day).padStart(2, "0");
  return `${date.year}-${mm}-${dd}`;
}

/** Calendar date of a JS Date using its *local* getters (what a date picker hands back). */
export function localCalendarDate(date: Date): CalendarDate {
  return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
}

interface WindowInstant {
  start: number;
  end: number;
}

/**
 * Expand the teacher's availability windows into absolute [start, end) ranges
 * for every teacher-local calendar day that overlaps [rangeStart, rangeEnd).
 */
function expandWindows(
  availability: AvailabilityWindow[],
  teacherTimeZone: string,
  rangeStart: number,
  rangeEnd: number,
): WindowInstant[] {
  const first = getZonedParts(new Date(rangeStart), teacherTimeZone);
  const last = getZonedParts(new Date(rangeEnd - 1), teacherTimeZone);
  // Walk one teacher-local day earlier too, so windows that end at 24:00 are included.
  let cursor = Date.UTC(first.year, first.month - 1, first.day - 1);
  const stop = Date.UTC(last.year, last.month - 1, last.day);

  const result: WindowInstant[] = [];
  for (; cursor <= stop; cursor += DAY_MS) {
    const d = new Date(cursor);
    const year = d.getUTCFullYear();
    const month = d.getUTCMonth() + 1;
    const day = d.getUTCDate();
    const weekday = d.getUTCDay();

    for (const window of availability) {
      if (!window.days.includes(weekday)) continue;
      const s = parseHHmm(window.start);
      const e = parseHHmm(window.end);
      const start = zonedTimeToUtc(teacherTimeZone, year, month, day, s.hours, s.minutes).getTime();
      const end = zonedTimeToUtc(teacherTimeZone, year, month, day, e.hours, e.minutes).getTime();
      if (end <= start) continue;
      if (!rangesOverlap(start, end, rangeStart, rangeEnd)) continue;
      result.push({ start, end });
    }
  }
  return result;
}

export interface SlotOptions {
  availability: AvailabilityWindow[];
  teacherTimeZone: string;
  /** The calendar day, as seen by the viewer, to list slots for. */
  date: CalendarDate;
  viewerTimeZone: string;
  durationMinutes: number;
  /** Gap between consecutive slot starts. Defaults to 60 minutes. */
  stepMinutes?: number;
  /** Slots starting before now + minNoticeMinutes are hidden. Defaults to 60. */
  minNoticeMinutes?: number;
  now?: Date;
  /** Already-booked ranges to exclude. */
  busy?: TimeRange[];
}

/**
 * All bookable slots, as absolute ranges, that *start* on the viewer's chosen
 * calendar day. Slots are aligned to the teacher's window start times.
 */
export function getSlotsForDate(options: SlotOptions): TimeRange[] {
  const {
    availability,
    teacherTimeZone,
    date,
    viewerTimeZone,
    durationMinutes,
    stepMinutes = 60,
    minNoticeMinutes = 60,
    now = new Date(),
    busy = [],
  } = options;

  const dayStart = zonedTimeToUtc(viewerTimeZone, date.year, date.month, date.day).getTime();
  const dayEnd = zonedTimeToUtc(viewerTimeZone, date.year, date.month, date.day + 1).getTime();
  const earliest = now.getTime() + minNoticeMinutes * MINUTE_MS;
  const durationMs = durationMinutes * MINUTE_MS;
  const stepMs = stepMinutes * MINUTE_MS;
  const busyRanges = busy.map((b) => ({ start: Date.parse(b.start), end: Date.parse(b.end) }));

  const seen = new Set<number>();
  const slots: TimeRange[] = [];

  for (const window of expandWindows(availability, teacherTimeZone, dayStart, dayEnd)) {
    for (let start = window.start; start + durationMs <= window.end; start += stepMs) {
      if (start < dayStart || start >= dayEnd) continue;
      if (start < earliest) continue;
      if (seen.has(start)) continue;
      const end = start + durationMs;
      if (busyRanges.some((b) => rangesOverlap(start, end, b.start, b.end))) continue;
      seen.add(start);
      slots.push({ start: new Date(start).toISOString(), end: new Date(end).toISOString() });
    }
  }

  slots.sort((a, b) => Date.parse(a.start) - Date.parse(b.start));
  return slots;
}

export interface AvailabilityCheck {
  availability: AvailabilityWindow[];
  teacherTimeZone: string;
  start: Date;
  end: Date;
  /** When set, `start` must sit on a step boundary measured from the window start. */
  stepMinutes?: number;
}

/** Server-side guard: is [start, end) fully inside one of the teacher's windows? */
export function isWithinAvailability(check: AvailabilityCheck): boolean {
  const { availability, teacherTimeZone, start, end, stepMinutes } = check;
  const startMs = start.getTime();
  const endMs = end.getTime();
  if (!(endMs > startMs)) return false;

  return expandWindows(availability, teacherTimeZone, startMs, endMs).some((window) => {
    if (startMs < window.start || endMs > window.end) return false;
    if (stepMinutes && (startMs - window.start) % (stepMinutes * MINUTE_MS) !== 0) return false;
    return true;
  });
}

/* ------------------------------------------------------------------ */
/* Formatting helpers                                                  */
/* ------------------------------------------------------------------ */

const TIME_ZONE_ABBREVIATIONS: Record<string, string> = {
  "Africa/Lagos": "WAT",
};

/** Short label such as "WAT", "EDT" or "GMT+5:30". */
export function getTimeZoneAbbreviation(timeZone: string, date: Date = new Date()): string {
  if (TIME_ZONE_ABBREVIATIONS[timeZone]) return TIME_ZONE_ABBREVIATIONS[timeZone];
  try {
    const part = new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "short" })
      .formatToParts(date)
      .find((p) => p.type === "timeZoneName");
    return part?.value ?? timeZone;
  } catch {
    return timeZone;
  }
}

/** "GMT+1", "GMT-4", "GMT+5:30" */
export function getUtcOffsetLabel(timeZone: string, date: Date = new Date()): string {
  const offsetMinutes = Math.round(getTimeZoneOffsetMs(timeZone, date) / MINUTE_MS);
  if (offsetMinutes === 0) return "GMT";
  const sign = offsetMinutes > 0 ? "+" : "-";
  const abs = Math.abs(offsetMinutes);
  const hours = Math.floor(abs / 60);
  const minutes = abs % 60;
  return `GMT${sign}${hours}${minutes ? `:${String(minutes).padStart(2, "0")}` : ""}`;
}

/** "Lagos", "New York" — a friendly city name derived from an IANA id. */
export function getTimeZoneCity(timeZone: string): string {
  const last = timeZone.split("/").pop() ?? timeZone;
  return last.replace(/_/g, " ");
}

export function formatTimeInZone(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-US", { timeZone, hour: "numeric", minute: "2-digit" }).format(date);
}

export function formatDateInZone(date: Date, timeZone: string, style: "full" | "long" | "medium" = "full"): string {
  return new Intl.DateTimeFormat("en-US", { timeZone, dateStyle: style }).format(date);
}

/** "Tuesday, September 22, 2026 at 3:00 PM (EDT)" */
export function formatDateTimeInZone(date: Date, timeZone: string): string {
  const text = new Intl.DateTimeFormat("en-US", { timeZone, dateStyle: "full", timeStyle: "short" }).format(date);
  return `${text} (${getTimeZoneAbbreviation(timeZone, date)})`;
}

/** Format "HH:mm" (teacher-local) as "5:00 AM". */
export function formatClockTime(value: string): string {
  const { hours, minutes } = parseHHmm(value);
  const h24 = hours % 24;
  const period = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(minutes).padStart(2, "0")} ${period}`;
}

/** "Every day", "Mon – Fri", "Sat, Sun", "Mon – Wed, Fri" */
export function formatDays(days: number[]): string {
  const unique = Array.from(new Set(days)).sort((a, b) => a - b);
  if (unique.length === 7) return "Every day";
  if (unique.length === 0) return "No days";

  const groups: string[] = [];
  let runStart = unique[0];
  let prev = unique[0];
  const flush = () => {
    if (runStart === prev) groups.push(DAY_LABELS[runStart]);
    else if (prev - runStart === 1) groups.push(`${DAY_LABELS[runStart]}, ${DAY_LABELS[prev]}`);
    else groups.push(`${DAY_LABELS[runStart]} – ${DAY_LABELS[prev]}`);
  };
  for (let i = 1; i < unique.length; i++) {
    if (unique[i] === prev + 1) {
      prev = unique[i];
    } else {
      flush();
      runStart = unique[i];
      prev = unique[i];
    }
  }
  flush();
  return groups.join(", ");
}

/** Human summary of a teacher's windows in the teacher's own timezone, e.g. "Every day · 6:00 AM – 12:00 PM WAT". */
export function describeAvailability(availability: AvailabilityWindow[], timeZone: string): string[] {
  const label = getTimeZoneAbbreviation(timeZone);
  return availability.map(
    (w) => `${formatDays(w.days)} · ${formatClockTime(w.start)} – ${formatClockTime(w.end)} ${label}`,
  );
}

/**
 * The same summary converted into the viewer's timezone, e.g. a 6:00 AM – 12:00 PM WAT
 * window reads "Every day · 10:00 PM – 4:00 AM PDT" in Los Angeles. Weekdays are shifted
 * when the window starts on a different calendar day for the viewer. `reference` fixes
 * which UTC offsets apply (daylight saving), and defaults to now.
 */
export function describeAvailabilityInZone(
  availability: AvailabilityWindow[],
  teacherTimeZone: string,
  viewerTimeZone: string,
  reference: Date = new Date(),
): string[] {
  const label = getTimeZoneAbbreviation(viewerTimeZone, reference);
  const today = getZonedParts(reference, teacherTimeZone);
  const teacherWeekday = new Date(Date.UTC(today.year, today.month - 1, today.day)).getUTCDay();

  return availability.map((w) => {
    const s = parseHHmm(w.start);
    const e = parseHHmm(w.end);
    const start = zonedTimeToUtc(teacherTimeZone, today.year, today.month, today.day, s.hours, s.minutes);
    const end = zonedTimeToUtc(teacherTimeZone, today.year, today.month, today.day, e.hours, e.minutes);

    // How many calendar days the window start moves for the viewer: -1, 0 or +1.
    const viewerWeekday = getZonedParts(start, viewerTimeZone).weekday;
    let shift = viewerWeekday - teacherWeekday;
    if (shift > 1) shift -= 7;
    if (shift < -1) shift += 7;
    const days = w.days.map((day) => (day + shift + 7) % 7);

    return `${formatDays(days)} · ${formatTimeInZone(start, viewerTimeZone)} – ${formatTimeInZone(end, viewerTimeZone)} ${label}`;
  });
}
