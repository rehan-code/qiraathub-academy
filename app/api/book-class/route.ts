import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import ical from "ical-generator";
import { getTeacher } from "@/data/teachers";
import { getTeacherContact } from "@/lib/server/teacher-contacts";
import { getTeacherBusyRanges } from "@/lib/server/google-calendar";
import {
  formatDateTimeInZone,
  isValidTimeZone,
  isWithinAvailability,
  rangesOverlap,
} from "@/lib/availability";

const SLOT_STEP_MINUTES = 60;
const MAX_DURATION_HOURS = 3;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function badRequest(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid request body");
  }

  const teacherId = typeof body.teacherId === "string" ? body.teacherId : "";
  const course = typeof body.course === "string" ? body.course.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const durationHours = Number(body.duration);
  const startTime = typeof body.startTime === "string" ? body.startTime : "";
  const viewerTimeZone = isValidTimeZone(body.timeZone) ? body.timeZone : "UTC";

  const teacher = getTeacher(teacherId);
  if (!teacher) return badRequest("Please choose a teacher.");
  if (!course) return badRequest("Please choose a course.");
  if (!EMAIL_REGEX.test(email)) return badRequest("Please enter a valid email address.");
  if (!Number.isFinite(durationHours) || durationHours <= 0 || durationHours > MAX_DURATION_HOURS) {
    return badRequest("Invalid class duration.");
  }

  const start = new Date(startTime);
  if (Number.isNaN(start.getTime())) return badRequest("Invalid start time.");
  const end = new Date(start.getTime() + durationHours * 60 * 60 * 1000);
  if (start.getTime() < Date.now()) return badRequest("That time has already passed. Please pick another slot.");

  const withinHours = isWithinAvailability({
    availability: teacher.availability,
    teacherTimeZone: teacher.timeZone,
    start,
    end,
    stepMinutes: SLOT_STEP_MINUTES,
  });
  if (!withinHours) {
    return badRequest(`${teacher.name} is not available at that time. Please pick another slot.`);
  }

  const contact = getTeacherContact(teacher.id);
  const teacherEmail = contact?.email ?? "";

  // Reject double bookings. If the calendar cannot be reached we still book,
  // since the admin notification lets staff resolve any clash by hand.
  try {
    const busy = await getTeacherBusyRanges(teacherEmail, start, end);
    const clash = busy.some((b) =>
      rangesOverlap(start.getTime(), end.getTime(), Date.parse(b.start), Date.parse(b.end)),
    );
    if (clash) {
      return badRequest("That slot was just taken. Please choose another time.", 409);
    }
  } catch (error) {
    console.error("Could not verify teacher availability against the calendar:", error);
  }

  try {
    const studentLabel = name || email;
    const studentWhen = formatDateTimeInZone(start, viewerTimeZone);
    const teacherWhen = formatDateTimeInZone(start, teacher.timeZone);
    const durationLabel = `${durationHours} ${durationHours === 1 ? "hour" : "hours"}`;
    const summary = `QiraatHub Academy - ${course}`;

    // Create the Google Meet link via the existing endpoint.
    let meetingLink = "";
    try {
      const meetResponse = await fetch(`${process.env.URL || "http://localhost:3000"}/api/create-google-meet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          summary,
          description: `${course} class with ${teacher.name} at QiraatHub Academy. This session has been scheduled for ${studentLabel}.`,
          startTime: start.toISOString(),
          endTime: end.toISOString(),
          attendeeEmail: email,
          teacherEmail,
        }),
      });
      const meetData = await meetResponse.json();
      if (meetData.success) {
        meetingLink = meetData.meeting.meetLink ?? "";
        console.log("Google Meet created successfully:", meetingLink);
      }
    } catch (error) {
      console.error("Error creating Google Meet:", error);
      // Continue with the booking even if the meeting link could not be created.
    }

    // Calendar invite attached to both emails.
    const calendar = ical({
      prodId: { company: "qiraathub.com", product: "QiraatHub Academy Class" },
      name: "QiraatHub Academy Class",
    });

    const event = calendar.createEvent({
      start,
      end,
      summary,
      description:
        `Your ${course} class with ${teacher.name} has been scheduled.` +
        (meetingLink ? `\n\nJoin Google Meet: ${meetingLink}` : ""),
      location: meetingLink || "Online",
      organizer: {
        name: "QiraatHub Academy",
        email: process.env.EMAIL_USER || "info@qiraathub.com",
      },
      attendees: [
        { name: studentLabel, email },
        ...(teacherEmail ? [{ name: teacher.name, email: teacherEmail }] : []),
      ],
    });

    if (meetingLink) {
      event.url(meetingLink);
      event.x({
        "X-GOOGLE-CONFERENCE": meetingLink,
        "X-MICROSOFT-SKYPETEAMSMEETINGURL": meetingLink,
        "X-MICROSOFT-DONOTFORWARD": "FALSE",
      });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.hostinger.com",
      port: parseInt(process.env.EMAIL_PORT || "465"),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const meetingLinkHtml = meetingLink
      ? `<p><strong>Google Meet Link:</strong> <a href="${meetingLink}" style="color: #2563eb; text-decoration: underline;">${meetingLink}</a></p>`
      : "";
    const icalAttachment = {
      filename: "class-invitation.ics",
      method: "REQUEST" as const,
      content: calendar.toString(),
    };

    // Confirmation to the student.
    await transporter.sendMail({
      from: `"QiraatHub Academy" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Class Scheduled: ${course} with ${teacher.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #163846;">Your Class is Scheduled!</h2>
          <p>Dear ${escapeHtml(name || "Student")},</p>
          <p>Your class has been successfully scheduled. Here are the details:</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Course:</strong> ${escapeHtml(course)}</p>
            <p><strong>Teacher:</strong> ${escapeHtml(teacher.name)}, ${escapeHtml(teacher.title)}</p>
            <p><strong>When:</strong> ${escapeHtml(studentWhen)}</p>
            <p><strong>Duration:</strong> ${durationLabel}</p>
            ${meetingLinkHtml}
          </div>
          <p style="color: #6b7280; font-size: 13px;">Times are shown in your timezone (${escapeHtml(viewerTimeZone)}). For your teacher this is ${escapeHtml(teacherWhen)}.</p>
          <p>We've attached a calendar invite to this email. You can add it to your calendar to receive a reminder.</p>
          <p>If you need to reschedule or cancel, please contact us at ${process.env.EMAIL_USER}.</p>
          <p>We look forward to seeing you!</p>
          <p>Best regards,<br>QiraatHub Academy Team</p>
        </div>
      `,
      icalEvent: icalAttachment,
    });

    // Notification to the academy and the teacher.
    const recipients = [process.env.EMAIL_USER, teacherEmail].filter(Boolean).join(", ");
    await transporter.sendMail({
      from: `"QiraatHub Academy" <${process.env.EMAIL_USER}>`,
      to: recipients,
      subject: `New Class Scheduled: ${course} with ${teacher.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #163846;">New Class Scheduled</h2>
          <p>A new class has been scheduled. Here are the details:</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Student:</strong> ${escapeHtml(name ? `${name} (${email})` : email)}</p>
            <p><strong>Teacher:</strong> ${escapeHtml(teacher.name)}${teacherEmail ? ` (${escapeHtml(teacherEmail)})` : ""}${contact?.whatsapp ? ` · WhatsApp ${escapeHtml(contact.whatsapp)}` : ""}</p>
            <p><strong>Course:</strong> ${escapeHtml(course)}</p>
            <p><strong>Teacher's local time:</strong> ${escapeHtml(teacherWhen)}</p>
            <p><strong>Student's local time:</strong> ${escapeHtml(studentWhen)}</p>
            <p><strong>Duration:</strong> ${durationLabel}</p>
            ${meetingLinkHtml}
          </div>
          <p>This is an automated notification.</p>
        </div>
      `,
      icalEvent: icalAttachment,
    });

    return NextResponse.json({
      success: true,
      booking: {
        teacherId: teacher.id,
        course,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        meetingLink,
      },
    });
  } catch (error) {
    console.error("Error booking class:", error);
    return NextResponse.json({ error: "Failed to book class" }, { status: 500 });
  }
}
