/**
 * SERVER ONLY. Thin wrapper around the academy's Google Calendar, used to
 * create Meet links and to find out when a teacher is already booked.
 */
import { google, type calendar_v3 } from "googleapis";
import type { TimeRange } from "@/lib/availability";

export function getCalendarClient(): calendar_v3.Calendar {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  );
  oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
  return google.calendar({ version: "v3", auth: oauth2Client });
}

export function isCalendarConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN,
  );
}

/**
 * Ranges during which the teacher already has a class, taken from the
 * academy calendar (every booking is created there with the teacher as an
 * attendee). Throws if the calendar cannot be reached; callers decide how
 * to degrade.
 */
export async function getTeacherBusyRanges(
  teacherEmail: string,
  from: Date,
  to: Date,
): Promise<TimeRange[]> {
  if (!teacherEmail || !isCalendarConfigured()) return [];

  const calendar = getCalendarClient();
  const wanted = teacherEmail.trim().toLowerCase();
  const busy: TimeRange[] = [];
  let pageToken: string | undefined;

  do {
    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: from.toISOString(),
      timeMax: to.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
      maxResults: 2500,
      showDeleted: false,
      pageToken,
    });

    for (const event of response.data.items ?? []) {
      if (event.status === "cancelled") continue;
      const start = event.start?.dateTime;
      const end = event.end?.dateTime;
      if (!start || !end) continue; // all-day events are not classes
      const attendees = event.attendees ?? [];
      const involvesTeacher =
        attendees.some((a) => a.email?.toLowerCase() === wanted) ||
        event.organizer?.email?.toLowerCase() === wanted;
      if (!involvesTeacher) continue;
      busy.push({ start, end });
    }

    pageToken = response.data.nextPageToken ?? undefined;
  } while (pageToken);

  return busy;
}
