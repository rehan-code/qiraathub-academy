import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { summary, description, startTime, endTime, attendeeEmail } = data;
    
    // Set up OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    
    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });
    
    // Create Google Calendar API client
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    
    // Create a new event with Google Meet
    const event = await calendar.events.insert({
      calendarId: 'primary',
      conferenceDataVersion: 1,
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
        attendees: [
          { email: attendeeEmail },
        ],
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
    
    // Return the meeting details
    return NextResponse.json({
      success: true,
      meeting: {
        id: event.data.id,
        meetLink: event.data.hangoutLink,
        eventLink: event.data.htmlLink,
      },
    });
  } catch (error: any) {
    console.error('Error creating Google Meet:', error);
    return NextResponse.json(
      { error: 'Failed to create Google Meet' },
      { status: 500 }
    );
  }
}
