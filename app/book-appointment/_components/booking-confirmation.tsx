"use client";

import { CalendarDays, Check, Clock, ExternalLink, Mail, Video } from "lucide-react";
import { getTeacherShortName, type Teacher } from "@/data/teachers";
import {
  formatDateInZone,
  formatTimeInZone,
  getTimeZoneAbbreviation,
  type TimeRange,
} from "@/lib/availability";
import { TeacherAvatar } from "./teacher-avatar";
import type { Course } from "./types";

interface BookingConfirmationProps {
  teacher: Teacher;
  course: Course;
  slot: TimeRange;
  viewerTimeZone: string;
  email: string;
  meetingLink?: string;
  onBookAnother: () => void;
}

export function BookingConfirmation({
  teacher,
  course,
  slot,
  viewerTimeZone,
  email,
  meetingLink,
  onBookAnother,
}: BookingConfirmationProps) {
  const start = new Date(slot.start);
  const end = new Date(slot.end);
  const teacherFirstName = getTeacherShortName(teacher);

  return (
    <div className="mx-auto max-w-xl">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
        <div className="flex flex-col items-center bg-gradient-to-b from-theme_secondary to-[#0f2a35] px-6 py-10 text-center text-white">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-theme_primary shadow-lg shadow-black/20">
            <Check className="h-8 w-8 text-slate-900" strokeWidth={3} />
          </span>
          <h1 className="mt-5 text-2xl font-bold">You&apos;re booked!</h1>
          <p className="mt-2 max-w-sm text-sm text-white/75">
            A confirmation with your calendar invite{meetingLink ? " and Google Meet link" : ""} is on its way
            to <span className="font-medium text-white">{email}</span>.
          </p>
        </div>

        <div className="space-y-5 px-6 py-6">
          <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
            <TeacherAvatar teacher={teacher} size="lg" />
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{course.name}</p>
              <p className="truncate font-semibold text-slate-900">{teacher.name}</p>
              <p className="truncate text-sm text-slate-500">{teacher.title}</p>
            </div>
          </div>

          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="flex gap-3">
              <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Date</dt>
                <dd className="text-sm font-medium text-slate-900">{formatDateInZone(start, viewerTimeZone)}</dd>
              </div>
            </div>
            <div className="flex gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Time</dt>
                <dd className="text-sm font-medium text-slate-900">
                  {formatTimeInZone(start, viewerTimeZone)} – {formatTimeInZone(end, viewerTimeZone)}{" "}
                  <span className="text-xs font-normal text-slate-500">
                    {getTimeZoneAbbreviation(viewerTimeZone, start)}
                  </span>
                </dd>
                <dd className="text-xs text-slate-500">
                  {formatTimeInZone(start, teacher.timeZone)} {getTimeZoneAbbreviation(teacher.timeZone, start)} for{" "}
                  {teacherFirstName}
                </dd>
              </div>
            </div>
          </dl>

          <div className="flex flex-col gap-2 sm:flex-row">
            {meetingLink && (
              <a
                href={meetingLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50"
              >
                <Video className="h-4 w-4" />
                Google Meet link
                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
              </a>
            )}
            <button
              type="button"
              onClick={onBookAnother}
              className="inline-flex flex-1 items-center justify-center rounded-xl bg-theme_primary px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition-colors hover:bg-yellow-400"
            >
              Book another class
            </button>
          </div>

          <p className="flex items-start gap-1.5 text-xs text-slate-500">
            <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Didn&apos;t get the email? Check your spam folder or contact us and we&apos;ll resend it.
          </p>
        </div>
      </div>
    </div>
  );
}
