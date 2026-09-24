"use client";

import { useState, type ComponentType, type KeyboardEvent, type MouseEvent } from "react";
import { CalendarClock, Check, ChevronDown, Clock, MapPin, Sparkles } from "lucide-react";
import { getTeacherShortName, type Teacher } from "@/data/teachers";
import {
  describeAvailability,
  describeAvailabilityInZone,
  formatTimeInZone,
  getTimeZoneAbbreviation,
} from "@/lib/availability";
import { cn } from "@/lib/utils";
import { TeacherAvatar } from "./teacher-avatar";

interface TeacherCardProps {
  teacher: Teacher;
  selected: boolean;
  onSelect: () => void;
  /** Current time, or null before the page has mounted (avoids hydration drift). */
  now: Date | null;
  /** Timezone the student is viewing in; availability is shown in this zone. */
  viewerTimeZone: string;
}

export function TeacherCard({ teacher, selected, onSelect, now, viewerTimeZone }: TeacherCardProps) {
  const [expanded, setExpanded] = useState(false);
  const firstName = getTeacherShortName(teacher);
  const localTime = now
    ? `${formatTimeInZone(now, teacher.timeZone)} ${getTimeZoneAbbreviation(teacher.timeZone, now)}`
    : "—";
  const teacherLocalAvailability = describeAvailability(teacher.availability, teacher.timeZone);
  // Until the page mounts we don't know the viewer's zone, so fall back to the teacher's.
  const availability = now
    ? describeAvailabilityInZone(teacher.availability, teacher.timeZone, viewerTimeZone, now)
    : teacherLocalAvailability;
  const showTeacherLocal = now !== null && viewerTimeZone !== teacher.timeZone;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect();
    }
  };

  const toggleBio = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setExpanded((value) => !value);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      className={cn(
        "group relative cursor-pointer rounded-2xl border bg-white p-5 text-left outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-theme_primary/60",
        selected
          ? "border-theme_primary shadow-md ring-2 ring-theme_primary/30"
          : "border-slate-200 hover:border-slate-300 hover:shadow-md",
      )}
    >
      <div className="flex items-start gap-4">
        <TeacherAvatar teacher={teacher} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-base font-semibold leading-snug text-slate-900">{teacher.name}</h3>
              <p className="mt-0.5 text-sm text-slate-500">{teacher.title}</p>
            </div>
            <span
              aria-hidden
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors",
                selected
                  ? "border-theme_primary bg-theme_primary text-white"
                  : "border-slate-300 text-transparent group-hover:border-slate-400",
              )}
            >
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
            </span>
          </div>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-slate-100 pt-4">
        <Fact icon={Clock} label="Local time" value={localTime} />
        <Fact icon={MapPin} label="Based in" value={teacher.location} />
        <Fact
          icon={CalendarClock}
          label="Available (your time)"
          value={availability}
          hint={showTeacherLocal ? teacherLocalAvailability.map((line) => `${line} for ${firstName}`) : undefined}
          className="col-span-2"
        />
      </dl>

      <button
        type="button"
        onClick={toggleBio}
        aria-expanded={expanded}
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-theme_secondary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme_primary/60 rounded"
      >
        {expanded ? "Hide profile" : `About ${firstName}`}
        <ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} />
      </button>

      {expanded && (
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-600">
          <p>{teacher.bio}</p>
          {teacher.highlights.length > 0 && (
            <ul className="space-y-1.5">
              {teacher.highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-2">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-theme_primary" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

interface FactProps {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string | string[];
  /** Muted secondary line(s) under the value. */
  hint?: string[];
  className?: string;
}

function Fact({ icon: Icon, label, value, hint, className }: FactProps) {
  const values = Array.isArray(value) ? value : [value];
  return (
    <div className={cn("flex items-start gap-2", className)}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
      <div className="min-w-0">
        <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</dt>
        {values.map((line) => (
          <dd key={line} className="text-sm font-medium text-slate-800">
            {line}
          </dd>
        ))}
        {hint?.map((line) => (
          <dd key={line} className="text-xs text-slate-400">
            {line}
          </dd>
        ))}
      </div>
    </div>
  );
}
