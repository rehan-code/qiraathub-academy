"use client";

import { useMemo, type ComponentType } from "react";
import { format } from "date-fns";
import { CalendarX2, Moon, Sun, Sunrise } from "lucide-react";
import type { Teacher } from "@/data/teachers";
import {
  formatTimeInZone,
  getTimeZoneAbbreviation,
  getZonedParts,
  type TimeRange,
} from "@/lib/availability";
import { cn } from "@/lib/utils";
import { TimeZoneSelect } from "./time-zone-select";

interface TimeSlotPickerProps {
  date: Date | null;
  slots: TimeRange[];
  selectedStart: string | null;
  onSelect: (slot: TimeRange) => void;
  viewerTimeZone: string;
  onTimeZoneChange: (timeZone: string) => void;
  teacher: Teacher;
  loading: boolean;
  /** True when live calendar data could not be loaded and only working hours are shown. */
  degraded: boolean;
  nextAvailableDate: Date | null;
  onJumpToDate: (date: Date) => void;
}

interface Period {
  label: string;
  icon: ComponentType<{ className?: string }>;
  matches: (hour: number) => boolean;
}

const PERIODS: Period[] = [
  { label: "Morning", icon: Sunrise, matches: (hour) => hour < 12 },
  { label: "Afternoon", icon: Sun, matches: (hour) => hour >= 12 && hour < 17 },
  { label: "Evening", icon: Moon, matches: (hour) => hour >= 17 },
];

export function TimeSlotPicker({
  date,
  slots,
  selectedStart,
  onSelect,
  viewerTimeZone,
  onTimeZoneChange,
  teacher,
  loading,
  degraded,
  nextAvailableDate,
  onJumpToDate,
}: TimeSlotPickerProps) {
  const groups = useMemo(() => {
    return PERIODS.map((period) => ({
      ...period,
      slots: slots.filter((slot) => period.matches(getZonedParts(new Date(slot.start), viewerTimeZone).hour)),
    })).filter((group) => group.slots.length > 0);
  }, [slots, viewerTimeZone]);

  const viewerLabel = getTimeZoneAbbreviation(viewerTimeZone);
  const teacherLabel = getTimeZoneAbbreviation(teacher.timeZone);
  const teacherFirstName = teacher.name.split(" ")[0];

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-slate-900">{date ? format(date, "EEEE, MMMM d") : "Pick a date"}</p>
          <p className="mt-0.5 text-xs text-slate-500">
            {loading
              ? "Checking the calendar…"
              : `${slots.length} open ${slots.length === 1 ? "time" : "times"} · shown in ${viewerLabel}`}
          </p>
        </div>
        <TimeZoneSelect value={viewerTimeZone} onChange={onTimeZoneChange} />
      </div>

      {degraded && !loading && (
        <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Showing regular hours. Your slot will be confirmed when you book.
        </p>
      )}

      <div className="mt-4 flex-1">
        {loading ? (
          <SlotSkeleton />
        ) : slots.length === 0 ? (
          <EmptyState
            date={date}
            nextAvailableDate={nextAvailableDate}
            onJumpToDate={onJumpToDate}
            teacherFirstName={teacherFirstName}
          />
        ) : (
          <div className="space-y-5">
            {groups.map((group) => (
              <div key={group.label}>
                <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  <group.icon className="h-3.5 w-3.5" />
                  {group.label}
                </div>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {group.slots.map((slot) => {
                    const start = new Date(slot.start);
                    const isSelected = slot.start === selectedStart;
                    const teacherTime = `${formatTimeInZone(start, teacher.timeZone)} ${teacherLabel}`;
                    return (
                      <button
                        key={slot.start}
                        type="button"
                        onClick={() => onSelect(slot)}
                        aria-pressed={isSelected}
                        title={`${teacherTime} for ${teacherFirstName}`}
                        className={cn(
                          "rounded-xl border px-2 py-2.5 text-sm font-medium tabular-nums transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme_primary/60",
                          isSelected
                            ? "border-theme_secondary bg-theme_secondary text-white shadow-md shadow-theme_secondary/20"
                            : "border-slate-200 bg-white text-slate-700 hover:border-theme_secondary/40 hover:bg-slate-50",
                        )}
                      >
                        {formatTimeInZone(start, viewerTimeZone)}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SlotSkeleton() {
  return (
    <div className="space-y-5" aria-hidden>
      <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="h-10 animate-pulse rounded-xl bg-slate-100" />
        ))}
      </div>
    </div>
  );
}

interface EmptyStateProps {
  date: Date | null;
  nextAvailableDate: Date | null;
  onJumpToDate: (date: Date) => void;
  teacherFirstName: string;
}

function EmptyState({ date, nextAvailableDate, onJumpToDate, teacherFirstName }: EmptyStateProps) {
  return (
    <div className="flex h-full min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-10 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm">
        <CalendarX2 className="h-5 w-5 text-slate-400" />
      </span>
      <p className="mt-4 text-sm font-semibold text-slate-800">
        {date ? `No open times on ${format(date, "MMMM d")}` : "Pick a date to see times"}
      </p>
      <p className="mt-1 max-w-xs text-xs text-slate-500">
        {teacherFirstName} is fully booked or not available on this day.
      </p>
      {nextAvailableDate && (
        <button
          type="button"
          onClick={() => onJumpToDate(nextAvailableDate)}
          className="mt-4 rounded-full bg-theme_secondary px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-theme_secondary/90"
        >
          Jump to {format(nextAvailableDate, "EEE, MMM d")}
        </button>
      )}
    </div>
  );
}
