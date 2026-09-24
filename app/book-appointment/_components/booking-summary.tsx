"use client";

import type { ComponentType, ReactNode } from "react";
import { BookOpen, CalendarDays, Clock, GraduationCap, Loader2, Mail, ShieldCheck } from "lucide-react";
import type { Teacher } from "@/data/teachers";
import {
  formatDateInZone,
  formatTimeInZone,
  getTimeZoneAbbreviation,
  type TimeRange,
} from "@/lib/availability";
import { cn } from "@/lib/utils";
import { TeacherAvatar } from "./teacher-avatar";
import type { Course } from "./types";

interface BookingSummaryProps {
  course: Course;
  teacher: Teacher | undefined;
  slot: TimeRange | null;
  viewerTimeZone: string;
  email: string;
  name: string;
  onEmailChange: (value: string) => void;
  onNameChange: (value: string) => void;
  /** When false the student is signed in and their details are filled automatically. */
  showContactFields: boolean;
  emailValid: boolean;
  isBooking: boolean;
  onSubmit: () => void;
}

export function BookingSummary({
  course,
  teacher,
  slot,
  viewerTimeZone,
  email,
  name,
  onEmailChange,
  onNameChange,
  showContactFields,
  emailValid,
  isBooking,
  onSubmit,
}: BookingSummaryProps) {
  const canSubmit = Boolean(teacher && slot && emailValid) && !isBooking;
  const start = slot ? new Date(slot.start) : null;
  const end = slot ? new Date(slot.end) : null;
  const teacherFirstName = teacher?.name.split(" ")[0];

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (canSubmit) onSubmit();
      }}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="bg-theme_secondary px-5 py-4 text-white">
        <h2 className="text-base font-semibold">Your booking</h2>
        <p className="text-xs text-white/70">Review the details, then confirm.</p>
      </div>

      <div className="divide-y divide-slate-100 px-5">
        <Row icon={BookOpen} label="Course">
          <span className="font-medium text-slate-900">{course.name}</span>
          <span className="ml-2 text-xs text-slate-500">
            {course.duration} {course.duration === 1 ? "hour" : "hours"}
          </span>
        </Row>

        <Row icon={GraduationCap} label="Teacher">
          {teacher ? (
            <span className="flex items-center gap-2.5">
              <TeacherAvatar teacher={teacher} size="sm" />
              <span className="min-w-0">
                <span className="block truncate font-medium text-slate-900">{teacher.name}</span>
                <span className="block truncate text-xs text-slate-500">{teacher.title}</span>
              </span>
            </span>
          ) : (
            <Placeholder>Choose a teacher</Placeholder>
          )}
        </Row>

        <Row icon={CalendarDays} label="Date & time">
          {start && end && teacher ? (
            <>
              <span className="block font-medium text-slate-900">{formatDateInZone(start, viewerTimeZone)}</span>
              <span className="block text-sm text-slate-700">
                {formatTimeInZone(start, viewerTimeZone)} – {formatTimeInZone(end, viewerTimeZone)}{" "}
                <span className="text-xs text-slate-500">{getTimeZoneAbbreviation(viewerTimeZone, start)}</span>
              </span>
              <span className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                <Clock className="h-3 w-3" />
                {formatTimeInZone(start, teacher.timeZone)} {getTimeZoneAbbreviation(teacher.timeZone, start)} for{" "}
                {teacherFirstName}
              </span>
            </>
          ) : (
            <Placeholder>{teacher ? "Pick a time" : "Pick a date and time"}</Placeholder>
          )}
        </Row>

        {showContactFields ? (
          <div className="space-y-3 py-4">
            <Field label="Your name" optional>
              <input
                type="text"
                value={name}
                onChange={(event) => onNameChange(event.target.value)}
                placeholder="Full name"
                autoComplete="name"
                className={inputClass}
              />
            </Field>
            <Field label="Email address">
              <input
                type="email"
                value={email}
                onChange={(event) => onEmailChange(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
                className={inputClass}
              />
            </Field>
          </div>
        ) : (
          <Row icon={Mail} label="Booking as">
            <span className="block truncate font-medium text-slate-900">{name || email}</span>
            {name && <span className="block truncate text-xs text-slate-500">{email}</span>}
          </Row>
        )}
      </div>

      <div className="space-y-3 border-t border-slate-100 bg-slate-50/60 px-5 py-4">
        <button
          type="submit"
          disabled={!canSubmit}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-xl bg-theme_primary px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition-all",
            "hover:bg-yellow-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme_primary/60 focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none",
          )}
        >
          {isBooking ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Booking…
            </>
          ) : (
            "Confirm booking"
          )}
        </button>
        <p className="flex items-start gap-1.5 text-[11px] leading-relaxed text-slate-500">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
          You&apos;ll receive a confirmation email with a calendar invite and Google Meet link. No payment is
          taken now.
        </p>
      </div>
    </form>
  );
}

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-theme_secondary focus:outline-none focus:ring-2 focus:ring-theme_secondary/20";

interface RowProps {
  icon: ComponentType<{ className?: string }>;
  label: string;
  children: ReactNode;
}

function Row({ icon: Icon, label, children }: RowProps) {
  return (
    <div className="flex gap-3 py-4">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
        <div className="mt-1 text-sm">{children}</div>
      </div>
    </div>
  );
}

function Placeholder({ children }: { children: ReactNode }) {
  return <span className="text-slate-400">{children}</span>;
}

function Field({ label, optional, children }: { label: string; optional?: boolean; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 flex items-center justify-between text-xs font-medium text-slate-700">
        {label}
        {optional && <span className="font-normal text-slate-400">Optional</span>}
      </span>
      {children}
    </label>
  );
}
