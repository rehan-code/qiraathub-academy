import { NextResponse } from 'next/server';
import { getCalendarClient } from '@/lib/server/google-calendar';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { summary, description, startTime, endTime, attendeeEmail, teacherEmail } = data;

    const calendar = getCalendarClient();

    // Every booking lives on the academy calendar with the student and the
    // teacher as attendees; /api/availability reads these back to find clashes.
    const attendees = [attendeeEmail, teacherEmail]
      .filter((email): email is string => typeof email === 'string' && email.trim().length > 0)
      .map((email) => ({ email, responseStatus: 'accepted' }));

    const event = await calendar.events.insert({
      calendarId: 'primary',
      conferenceDataVersion: 1,
      sendUpdates: 'none', // Prevent Google from sending emails
      requestBody: {
        summary,
        description,
        start: {
          dateTime: startTime,
          timeZone: 'UTC',
        },
        end: {
          dateTime: endTime,
          timeZone: 'UTC',
        },
        attendees,
        conferenceData: {
          createRequest: {
            requestId: `qiraathub-${Date.now()}`,
            conferenceSolutionKey: {
              type: 'hangoutsMeet',
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      meeting: {
        id: event.data.id,
        meetLink: event.data.hangoutLink,
        eventLink: event.data.htmlLink,
      },
    });
  } catch (error) {
    console.error('Error creating Google Meet:', error);
    return NextResponse.json(
      { error: 'Failed to create Google Meet' },
      { status: 500 }
    );
  }
}
