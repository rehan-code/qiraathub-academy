/**
 * SERVER ONLY. Private contact details for each teacher, keyed by the ids in
 * `data/teachers.ts`. Never import this from a client component: anything
 * imported there ends up in the public JavaScript bundle.
 */
export interface TeacherContact {
  email: string;
  whatsapp?: string;
}

const contacts: Record<string, TeacherContact> = {
  "muhammad-eleshin": {
    email: process.env.TEACHER_ELESHIN_EMAIL || "muhammadeleshin@gmail.com",
    whatsapp: "+234 908 140 7116",
  },
  "academy-instructor": {
    email: process.env.TEACHER_EMAIL || "",
  },
};

export function getTeacherContact(teacherId: string): TeacherContact | undefined {
  return contacts[teacherId];
}
