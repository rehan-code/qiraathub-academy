"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import DatePicker from "react-datepicker";
import { addDays, format, startOfDay } from "date-fns";
import { useUser } from "@clerk/nextjs";
import { ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker.css";

import { getTeacher, getTeacherShortName, teachers } from "@/data/teachers";
import {
  formatDateInZone,
  formatTimeInZone,
  getSlotsForDate,
  localCalendarDate,
  toDateKey,
  type TimeRange,
} from "@/lib/availability";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { StepSection } from "./_components/step-section";
import { TeacherCard } from "./_components/teacher-card";
import { TimeSlotPicker } from "./_components/time-slot-picker";
import { BookingSummary } from "./_components/booking-summary";
import { BookingConfirmation } from "./_components/booking-confirmation";
import type { Course } from "./_components/types";

const SLOT_STEP_MINUTES = 60;
const MIN_NOTICE_MINUTES = 60;
const BOOKING_WINDOW_DAYS = 60;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TRIAL_COURSE: Course = {
  id: 1,
  name: "Trial / Evaluation Class",
  duration: 1,
  blurb: "Meet your teacher and find your level",
};

const MEMBER_COURSES: Course[] = [
  { id: 2, name: "Quran Reading", duration: 1, blurb: "Fluent, accurate recitation" },
  { id: 3, name: "Tajweed", duration: 1, blurb: "Rules of beautiful recitation" },
  { id: 4, name: "Hifz Program", duration: 1, blurb: "Guided memorisation" },
  { id: 5, name: "Islamic Studies", duration: 1, blurb: "Foundations of the faith" },
];

interface BusyInfo {
  busy: TimeRange[];
  degraded: boolean;
}

interface Confirmation {
  teacherId: string;
  course: Course;
  slot: TimeRange;
  email: string;
  meetingLink?: string;
}

/** Current time, refreshed every `intervalMs`. Null until mounted so SSR and client markup match. */
function useNow(intervalMs: number): Date | null {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);
  return now;
}

export default function BookClassPage() {
  const { toast } = useToast();
  const { isLoaded, isSignedIn, user } = useUser();
  const now = useNow(60_000);
  const ready = now !== null;

  const courses = useMemo(() => (isSignedIn ? [TRIAL_COURSE, ...MEMBER_COURSES] : [TRIAL_COURSE]), [isSignedIn]);

  const [viewerTimeZone, setViewerTimeZone] = useState("UTC");
  const [selectedCourseId, setSelectedCourseId] = useState(TRIAL_COURSE.id);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(
    teachers.length === 1 ? teachers[0].id : null,
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeRange | null>(null);
  const [busyByTeacher, setBusyByTeacher] = useState<Record<string, BusyInfo>>({});
  const [busyLoading, setBusyLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const summaryRef = useRef<HTMLElement>(null);
  const [summaryInView, setSummaryInView] = useState(false);

  // Hide the mobile jump bar while the summary itself is on screen.
  useEffect(() => {
    const node = summaryRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setSummaryInView(entry.isIntersecting), {
      threshold: 0.25,
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [confirmation]);

  const selectedCourse = courses.find((course) => course.id === selectedCourseId) ?? TRIAL_COURSE;
  const selectedTeacher = getTeacher(selectedTeacherId);
  const busyInfo = selectedTeacherId ? busyByTeacher[selectedTeacherId] : undefined;

  // Detect the student's timezone once on the client.
  useEffect(() => {
    try {
      const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (detected) setViewerTimeZone(detected);
    } catch {
      // keep UTC
    }
  }, []);

  // Pre-fill contact details for signed-in students.
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    if (user?.primaryEmailAddress) setEmail(user.primaryEmailAddress.emailAddress);
    if (user?.fullName) setName(user.fullName);
  }, [isLoaded, isSignedIn, user]);

  // If the course list shrinks (sign-out), fall back to the trial class.
  useEffect(() => {
    if (!courses.some((course) => course.id === selectedCourseId)) {
      setSelectedCourseId(TRIAL_COURSE.id);
    }
  }, [courses, selectedCourseId]);

  // Load the teacher's existing bookings so taken slots are hidden.
  useEffect(() => {
    if (!ready || !selectedTeacherId || busyByTeacher[selectedTeacherId]) return;
    const teacherId = selectedTeacherId;
    const controller = new AbortController();
    const from = addDays(startOfDay(new Date()), -1);
    const to = addDays(from, BOOKING_WINDOW_DAYS + 3);

    setBusyLoading(true);
    fetch(
      `/api/availability?teacherId=${encodeURIComponent(teacherId)}&from=${from.toISOString()}&to=${to.toISOString()}`,
      { signal: controller.signal },
    )
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error(`HTTP ${response.status}`))))
      .then((data: Partial<BusyInfo>) => {
        setBusyByTeacher((previous) => ({
          ...previous,
          [teacherId]: { busy: data.busy ?? [], degraded: Boolean(data.degraded) },
        }));
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        console.error("Failed to load availability:", error);
        setBusyByTeacher((previous) => ({ ...previous, [teacherId]: { busy: [], degraded: true } }));
      })
      .finally(() => {
        if (!controller.signal.aborted) setBusyLoading(false);
      });

    return () => controller.abort();
  }, [ready, selectedTeacherId, busyByTeacher]);

  const todayStart = useMemo(() => startOfDay(now ?? new Date()), [now]);
  const maxDate = useMemo(() => addDays(todayStart, BOOKING_WINDOW_DAYS), [todayStart]);

  const slotsFor = useCallback(
    (date: Date): TimeRange[] => {
      if (!ready || !selectedTeacher) return [];
      return getSlotsForDate({
        availability: selectedTeacher.availability,
        teacherTimeZone: selectedTeacher.timeZone,
        date: localCalendarDate(date),
        viewerTimeZone,
        durationMinutes: selectedCourse.duration * 60,
        stepMinutes: SLOT_STEP_MINUTES,
        minNoticeMinutes: MIN_NOTICE_MINUTES,
        now: now ?? new Date(),
        busy: busyInfo?.busy ?? [],
      });
    },
    [ready, selectedTeacher, viewerTimeZone, selectedCourse.duration, now, busyInfo],
  );

  // Which days in the booking window have at least one open slot.
  const availableDateKeys = useMemo(() => {
    const keys = new Set<string>();
    if (!ready || !selectedTeacher) return keys;
    for (let offset = 0; offset <= BOOKING_WINDOW_DAYS; offset++) {
      const date = addDays(todayStart, offset);
      if (slotsFor(date).length > 0) keys.add(toDateKey(localCalendarDate(date)));
    }
    return keys;
  }, [ready, selectedTeacher, todayStart, slotsFor]);

  const isDateAvailable = useCallback(
    (date: Date) => availableDateKeys.has(toDateKey(localCalendarDate(date))),
    [availableDateKeys],
  );

  const findNextAvailable = useCallback(
    (after: Date | null): Date | null => {
      const from = after ? addDays(startOfDay(after), 1) : todayStart;
      for (let date = from; date <= maxDate; date = addDays(date, 1)) {
        if (isDateAvailable(date)) return date;
      }
      return null;
    },
    [todayStart, maxDate, isDateAvailable],
  );

  const firstAvailableDate = useMemo(() => findNextAvailable(null), [findNextAvailable]);

  // Keep the selected date on a day that actually has open slots.
  useEffect(() => {
    if (!ready || !selectedTeacher || busyLoading) return;
    if (selectedDate && isDateAvailable(selectedDate)) return;
    if (firstAvailableDate) setSelectedDate(firstAvailableDate);
  }, [ready, selectedTeacher, busyLoading, selectedDate, isDateAvailable, firstAvailableDate]);

  const slots = useMemo(() => (selectedDate ? slotsFor(selectedDate) : []), [selectedDate, slotsFor]);
  const nextAvailableDate = useMemo(() => findNextAvailable(selectedDate), [findNextAvailable, selectedDate]);

  // A slot chosen earlier may have disappeared (booked meanwhile, timezone changed…).
  const activeSlot = selectedSlot && slots.some((slot) => slot.start === selectedSlot.start) ? selectedSlot : null;
  const emailValid = EMAIL_REGEX.test(email.trim());

  const handleCourseChange = (courseId: number) => {
    setSelectedCourseId(courseId);
    setSelectedSlot(null);
  };

  const handleTeacherSelect = (teacherId: string) => {
    setSelectedTeacherId(teacherId);
    setSelectedSlot(null);
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleTimeZoneChange = (timeZone: string) => {
    setViewerTimeZone(timeZone);
    setSelectedSlot(null);
  };

  const handleSubmit = async () => {
    if (!selectedTeacher || !activeSlot) return;
    if (!emailValid) {
      toast({ title: "Check your email address", description: "Please enter a valid email.", variant: "destructive" });
      return;
    }

    const teacherId = selectedTeacher.id;
    const slot = activeSlot;
    setIsBooking(true);
    try {
      const response = await fetch("/api/book-class", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacherId,
          course: selectedCourse.name,
          duration: selectedCourse.duration,
          startTime: slot.start,
          timeZone: viewerTimeZone,
          email: email.trim(),
          name: name.trim(),
        }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 409) {
          // Someone else took the slot: drop the cache so it reloads.
          setBusyByTeacher((previous) => {
            const next = { ...previous };
            delete next[teacherId];
            return next;
          });
          setSelectedSlot(null);
        }
        throw new Error(data.error || "We couldn't complete your booking. Please try again.");
      }

      setBusyByTeacher((previous) => ({
        ...previous,
        [teacherId]: {
          busy: [...(previous[teacherId]?.busy ?? []), slot],
          degraded: previous[teacherId]?.degraded ?? false,
        },
      }));
      setSelectedSlot(null);
      setConfirmation({
        teacherId,
        course: selectedCourse,
        slot,
        email: email.trim(),
        meetingLink: data.booking?.meetingLink || undefined,
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Error booking class:", error);
      toast({
        title: "Booking failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
  };

  const confirmedTeacher = confirmation ? getTeacher(confirmation.teacherId) : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white">
      <div className="container mx-auto max-w-6xl px-4 py-10 lg:py-14">
        {confirmation && confirmedTeacher ? (
          <BookingConfirmation
            teacher={confirmedTeacher}
            course={confirmation.course}
            slot={confirmation.slot}
            viewerTimeZone={viewerTimeZone}
            email={confirmation.email}
            meetingLink={confirmation.meetingLink}
            onBookAnother={() => setConfirmation(null)}
          />
        ) : (
          <>
            <header className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Book a class</h1>
            </header>

            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8">
              <div className="space-y-6">
                {/* Step 1: course */}
                <StepSection step={1} title="Choose a course" done={Boolean(selectedCourse)}>
                  <div className="flex flex-wrap gap-2">
                    {courses.map((course) => {
                      const selected = course.id === selectedCourse.id;
                      return (
                        <button
                          key={course.id}
                          type="button"
                          onClick={() => handleCourseChange(course.id)}
                          aria-pressed={selected}
                          className={cn(
                            "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme_primary/60",
                            selected
                              ? "border-theme_secondary bg-theme_secondary text-white shadow-sm"
                              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
                          )}
                        >
                          {course.name}
                          <span className={cn("ml-2 text-xs", selected ? "text-white/70" : "text-slate-400")}>
                            {course.duration}h
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-3 text-sm text-slate-500">
                    {selectedCourse.blurb}
                    {isLoaded && !isSignedIn && (
                      <>
                        {" "}
                        · Regular classes unlock after you{" "}
                        <Link
                          href="/sign-in"
                          className="font-medium text-theme_secondary underline underline-offset-2 hover:text-theme_secondary/80"
                        >
                          sign in
                        </Link>
                        .
                      </>
                    )}
                  </p>
                </StepSection>

                {/* Step 2: teacher */}
                <StepSection
                  step={2}
                  title="Choose a teacher"
                  description="Each teacher sets their own hours. Pick whoever suits your schedule."
                  done={Boolean(selectedTeacher)}
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    {teachers.map((teacher) => (
                      <TeacherCard
                        key={teacher.id}
                        teacher={teacher}
                        selected={teacher.id === selectedTeacherId}
                        onSelect={() => handleTeacherSelect(teacher.id)}
                        now={now}
                        viewerTimeZone={viewerTimeZone}
                      />
                    ))}
                  </div>
                </StepSection>

                {/* Step 3: date & time */}
                <StepSection
                  step={3}
                  title="Pick a date and time"
                  description={
                    selectedTeacher
                      ? `Showing ${getTeacherShortName(selectedTeacher)}'s open times for the next ${BOOKING_WINDOW_DAYS} days.`
                      : "Choose a teacher first to see their open times."
                  }
                  done={Boolean(activeSlot)}
                  disabled={!selectedTeacher}
                >
                  <div className="grid gap-6 md:grid-cols-[300px_minmax(0,1fr)]">
                    <div className="qh-calendar rounded-2xl border border-slate-200 bg-white p-3 sm:p-4">
                      <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        inline
                        minDate={todayStart}
                        maxDate={maxDate}
                        filterDate={isDateAvailable}
                        renderCustomHeader={({
                          monthDate,
                          decreaseMonth,
                          increaseMonth,
                          prevMonthButtonDisabled,
                          nextMonthButtonDisabled,
                        }) => (
                          <div className="flex items-center justify-between px-1">
                            <button
                              type="button"
                              onClick={decreaseMonth}
                              disabled={prevMonthButtonDisabled}
                              aria-label="Previous month"
                              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </button>
                            <span className="text-sm font-semibold text-slate-900">
                              {format(monthDate, "MMMM yyyy")}
                            </span>
                            <button
                              type="button"
                              onClick={increaseMonth}
                              disabled={nextMonthButtonDisabled}
                              aria-label="Next month"
                              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      />
                    </div>

                    {selectedTeacher ? (
                      <TimeSlotPicker
                        date={selectedDate}
                        slots={slots}
                        selectedStart={activeSlot?.start ?? null}
                        onSelect={setSelectedSlot}
                        viewerTimeZone={viewerTimeZone}
                        onTimeZoneChange={handleTimeZoneChange}
                        teacher={selectedTeacher}
                        loading={busyLoading}
                        nextAvailableDate={nextAvailableDate}
                        onJumpToDate={handleDateChange}
                      />
                    ) : (
                      <div className="flex min-h-[220px] items-center justify-center rounded-xl border border-dashed border-slate-200 text-sm text-slate-400">
                        Choose a teacher to see open times
                      </div>
                    )}
                  </div>
                </StepSection>
              </div>

              <aside ref={summaryRef} className="scroll-mt-6 lg:sticky lg:top-6">
                <BookingSummary
                  course={selectedCourse}
                  teacher={selectedTeacher}
                  slot={activeSlot}
                  viewerTimeZone={viewerTimeZone}
                  email={email}
                  name={name}
                  onEmailChange={setEmail}
                  onNameChange={setName}
                  showContactFields={!isSignedIn}
                  emailValid={emailValid}
                  isBooking={isBooking}
                  onSubmit={handleSubmit}
                />
              </aside>
            </div>

            {/* Mobile: quick jump to the summary once a time is chosen. */}
            {activeSlot && !summaryInView && (
              <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 p-3 lg:hidden">
                <button
                  type="button"
                  onClick={() => summaryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
                  className="pointer-events-auto mx-auto flex w-full max-w-md items-center justify-between gap-3 rounded-2xl bg-theme_secondary px-4 py-3 text-left text-white shadow-xl shadow-slate-900/20 transition-transform active:scale-[0.98]"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">
                      {formatDateInZone(new Date(activeSlot.start), viewerTimeZone, "medium")} ·{" "}
                      {formatTimeInZone(new Date(activeSlot.start), viewerTimeZone)}
                    </span>
                    <span className="block text-xs text-white/70">Review and confirm your booking</span>
                  </span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-theme_primary text-slate-900">
                    <ArrowDown className="h-4 w-4" />
                  </span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <Toaster />
    </div>
  );
}
