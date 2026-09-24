import { ALL_DAYS, type AvailabilityWindow } from "@/lib/availability";

/**
 * Public teacher profiles used by the booking page.
 *
 * This file is imported by client components, so keep it free of private
 * contact details. Emails / phone numbers live in `lib/server/teacher-contacts.ts`.
 *
 * Availability windows are expressed in the teacher's own timezone; the
 * booking UI converts them to whatever timezone the student is in.
 */
export interface Teacher {
  id: string;
  name: string;
  title: string;
  bio: string;
  /** Short facts shown on the card, e.g. "10+ years teaching". */
  highlights: string[];
  specialties: string[];
  languages: string[];
  /** Where the teacher is based, for display. */
  location: string;
  /** IANA timezone id, e.g. "Africa/Lagos". */
  timeZone: string;
  availability: AvailabilityWindow[];
  /** Optional portrait under /public. Initials are used when omitted. */
  image?: string;
}

export const teachers: Teacher[] = [
  {
    id: "muhammad-eleshin",
    name: "Muhammad Abdulwahab Eleshin",
    title: "Qur’an & Qira’at Tutor",
    bio:
      "Muhammad Abdulwahab Eleshin is a qualified Qur’an and Qira’at instructor with over 10 years of teaching experience. " +
      "He holds Ijāzāt in all ten canonical Qira’at and specializes in helping students develop a strong foundation in Qur’an recitation, Tajweed, memorization, and the sciences of Qira’at. " +
      "He teaches Qur’an reading, Tajweed, Hifz, the Qira’at, and the study of Shāṭibiyyah, providing instruction in both Arabic and English. " +
      "Over the years, he has trained more than 10 Huffāẓ in different Qira’at.",
    highlights: [
      "10+ years of teaching experience",
      "Ijāzāt in all ten canonical Qira’at",
      "Trained more than 10 Huffāẓ",
    ],
    specialties: ["Qur’an Reading", "Tajweed", "Hifz", "The Ten Qira’at", "Shāṭibiyyah"],
    languages: ["Arabic", "English"],
    location: "Nigeria",
    timeZone: "Africa/Lagos",
    // Available every day, 6:00 AM – 12:00 PM West Africa Time (UTC+1).
    availability: [{ days: ALL_DAYS, start: "06:00", end: "12:00" }],
  },
  {
    // The academy's original instructor. Notifications go to TEACHER_EMAIL.
    // TODO: replace the placeholder name, title and bio with the real profile.
    id: "academy-instructor",
    name: "QiraatHub Academy Instructor",
    title: "Qur’an & Tajweed Teacher",
    bio:
      "A certified QiraatHub Academy instructor offering structured one-on-one Qur’an reading, Tajweed and Hifz classes for students of all levels.",
    highlights: ["Certified QiraatHub instructor", "Structured, level-based lessons"],
    specialties: ["Qur’an Reading", "Tajweed", "Hifz"],
    languages: ["English"],
    location: "United States",
    timeZone: "America/New_York",
    // Matches the academy's original booking hours: every day, 9:00 AM – 9:00 PM Eastern.
    availability: [{ days: ALL_DAYS, start: "09:00", end: "21:00" }],
  },
];

export function getTeacher(id: string | null | undefined): Teacher | undefined {
  if (!id) return undefined;
  return teachers.find((teacher) => teacher.id === id);
}

export function getTeacherInitials(teacher: Pick<Teacher, "name">): string {
  return teacher.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
