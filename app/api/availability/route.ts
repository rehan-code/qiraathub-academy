import { NextResponse } from "next/server";
import { getTeacher } from "@/data/teachers";
import { getTeacherContact } from "@/lib/server/teacher-contacts";
import { getTeacherBusyRanges } from "@/lib/server/google-calendar";

export const dynamic = "force-dynamic";

const MAX_RANGE_DAYS = 93;

/**
 * GET /api/availability?teacherId=…&from=ISO&to=ISO
 *
 * Returns the ranges in which the teacher is already booked, so the client
 * can hide those slots. The teacher's working hours themselves are public
 * (see data/teachers.ts) and are applied on the client.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const teacherId = searchParams.get("teacherId") ?? "";
  const teacher = getTeacher(teacherId);
  if (!teacher) {
    return NextResponse.json({ error: "Unknown teacher" }, { status: 404 });
  }

  const from = new Date(searchParams.get("from") ?? "");
  const to = new Date(searchParams.get("to") ?? "");
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || to <= from) {
    return NextResponse.json({ error: "Invalid date range" }, { status: 400 });
  }
  if (to.getTime() - from.getTime() > MAX_RANGE_DAYS * 86_400_000) {
    return NextResponse.json({ error: "Date range too large" }, { status: 400 });
  }

  const contact = getTeacherContact(teacher.id);
  const headers = { "Cache-Control": "no-store" };

  try {
    const busy = await getTeacherBusyRanges(contact?.email ?? "", from, to);
    return NextResponse.json({ busy, degraded: false }, { headers });
  } catch (error) {
    console.error("Failed to load teacher availability from Google Calendar:", error);
    // Degrade gracefully: show working hours only. The booking route re-checks conflicts.
    return NextResponse.json({ busy: [], degraded: true }, { headers });
  }
}
