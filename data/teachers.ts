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
  /** How the UI refers to the teacher in sentences ("About Muhammad"). Defaults to the first name. */
  shortName?: string;
  title: string;
  bio: string;
  /** Short facts shown on the card, e.g. "10+ years teaching". */
  highlights: string[];
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
    location: "Nigeria",
    timeZone: "Africa/Lagos",
    // Available every day, 6:00 AM – 12:00 PM West Africa Time (UTC+1).
    availability: [{ days: ALL_DAYS, start: "06:00", end: "12:00" }],
  },
  {
    id: "sohaib-mohamed",
    name: "Sohaib Mohamed",
    title: "Qur’an & Qira’at Instructor",
    bio:
      "Sohaib Mohamed is a Qur’an and Qira’at instructor from Cairo with a decade of teaching experience. " +
      "He holds Ijāzāt in the ten Qira’at through both Shāṭibiyyah and Ṭayyibah, as well as in the major Tajweed and Qira’at poems, and has recited the entire Qur’an to seven teachers from Egypt and Syria. " +
      "He teaches Qur’an reading, Tajweed, the Qira’at, and Arabic for non-native speakers, and has granted Ijāzāt to students in the USA, UK, Canada, and Australia with lessons delivered fully in English. " +
      "He is a graduate of the Faculty of Holy Qur’an and Its Sciences at Tanta University.",
    highlights: [
      "10 years of teaching experience",
      "Ijāzāt in the ten Qira’at (Shāṭibiyyah & Ṭayyibah)",
      "Has granted Ijāzāt to students in the USA, UK, Canada & Australia",
    ],
    location: "Egypt",
    timeZone: "Africa/Cairo",
    // Available every day, 9:00 AM – 9:00 PM Egypt time (UTC+2, UTC+3 in summer).
    availability: [{ days: ALL_DAYS, start: "09:00", end: "21:00" }],
  },
  {
    // The academy's own instructor. Notifications go to TEACHER_EMAIL.
    id: "academy-instructor",
    name: "QiraatHub Academy Instructor",
    shortName: "the instructor",
    title: "Qur’an & Tajweed Teacher",
    bio:
      "An additional instructor provided directly by QiraatHub Academy. Choose this option if you would like your classes during North American daytime hours, and the academy will take care of the rest.",
    highlights: ["Provided by QiraatHub Academy"],
    location: "Canada",
    timeZone: "America/Toronto",
    // Matches the academy's original booking hours: every day, 9:00 AM – 9:00 PM Eastern.
    availability: [{ days: ALL_DAYS, start: "09:00", end: "21:00" }],
  },
];

export function getTeacher(id: string | null | undefined): Teacher | undefined {
  if (!id) return undefined;
  return teachers.find((teacher) => teacher.id === id);
}

export function getTeacherShortName(teacher: Pick<Teacher, "name" | "shortName">): string {
  return teacher.shortName ?? teacher.name.split(/\s+/)[0];
}

export function getTeacherInitials(teacher: Pick<Teacher, "name">): string {
  return teacher.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
