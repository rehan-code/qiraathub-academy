import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import ical from 'ical-generator';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { date, time, course, duration, email, name } = data;
    
    // Parse time string to extract hours and minutes
    const timeRegex = /(\d+)(?::(\d+))?\s*(am|pm)/i;
    const match = time.match(timeRegex);
    
    if (!match) {
      throw new Error('Invalid time format');
    }
    
    let hours = parseInt(match[1]);
    const minutes = match[2] ? parseInt(match[2]) : 0;
    const period = match[3].toLowerCase();
    
    // Convert to 24-hour format
    if (period === 'pm' && hours < 12) {
      hours += 12;
    } else if (period === 'am' && hours === 12) {
      hours = 0;
    }
    
    // Create start and end times for the event
    const startTime = new Date(date);
    startTime.setHours(hours, minutes, 0, 0);
    
    const endTime = new Date(startTime);
    endTime.setTime(startTime.getTime() + (duration * 60 * 60 * 1000));
    
    // Create Google Meet link
    let meetingLink = '';
    const teacherEmail = process.env.TEACHER_EMAIL || '';
    console.log('URL:', process.env.URL);
    try {
      const meetResponse = await fetch(`${process.env.URL || 'http://localhost:3000'}/api/create-google-meet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summary: `QiraatHub Academy - ${course}`,
          description: `${course} class with QiraatHub Academy.${name ? ` This session has been scheduled for ${name}.` : ''}`,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          attendeeEmail: email,
          teacherEmail: teacherEmail,
        }),
      });
      
      const meetData = await meetResponse.json();
      if (meetData.success) {
        meetingLink = meetData.meeting.meetLink;
        console.log('Google Meet created successfully:', meetingLink);
        console.log('Go', meetData.meeting.eventLink);
      }
    } catch (error) {
      console.error('Error creating Google Meet:', error);
      // Continue with booking process even if meeting creation fails
    }
    
    // Create calendar event
    const calendar = ical({
      prodId: { company: 'qiraathub.com', product: 'QiraatHub Academy Class' },
      name: 'QiraatHub Academy Class',
    });
    
    // Set method using the setter instead of constructor
    // calendar.method(ICalCalendarMethod.REQUEST);
    
    // Create the event with basic properties first
    const event = calendar.createEvent({
      start: startTime,
      end: endTime,
      summary: `QiraatHub Academy - ${course}`,
      description: `Your ${course} class has been scheduled.${meetingLink ? `\n\nJoin Google Meet: ${meetingLink}` : ''}`,
      location: '',
      organizer: {
        name: 'QiraatHub Academy',
        email: process.env.EMAIL_USER || 'info@qiraathub.com',
      },
      // Add attendees (student and teacher) with basic properties
      attendees: [
        {
          name: name || email,
          email: email,
        },
        ...(teacherEmail ? [{
          name: 'Teacher',
          email: teacherEmail,
        }] : []),
      ]
    });
    
    // Set additional properties using method calls instead of constructor
    // event.stamp(new Date());
    // event.created(new Date());
    // event.lastModified(new Date());
    // event.status(ICalEventStatus.CONFIRMED);
    // event.sequence(0);
    // event.transparency(ICalEventTransparency.OPAQUE); // Same as Google's TRANSP:OPAQUE
    
    // Add URL to the event if meeting link is available
    if (meetingLink) {
      event.url(meetingLink);
      
      // Add X-properties for better Google Meet integration
      event.x({
        'X-GOOGLE-CONFERENCE': meetingLink,
        'X-MICROSOFT-SKYPETEAMSMEETINGURL': meetingLink,
        'X-MICROSOFT-DONOTFORWARD': 'FALSE'
      });
    }
    
    // Configure email transporter for Hostinger
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.hostinger.com', // Hostinger SMTP server
      port: parseInt(process.env.EMAIL_PORT || '465'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    
    // Prepare meeting link HTML for email
    const meetingLinkHtml = meetingLink 
      ? `<p><strong>Google Meet Link:</strong> <a href="${meetingLink}" style="color: #2563eb; text-decoration: underline;">${meetingLink}</a></p>` 
      : '';

    // Send email with calendar invite to the student
    await transporter.sendMail({
      from: `"QiraatHub Academy" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Class Scheduled: ${course}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Your Class is Scheduled!</h2>
          <p>Dear Student,</p>
          <p>Your class has been successfully scheduled. Here are the details:</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Course:</strong> ${course}</p>
            <p><strong>Date:</strong> ${new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p><strong>Duration:</strong> ${duration} ${duration === 1 ? 'hour' : 'hours'}</p>
            ${meetingLinkHtml}
          </div>
          <p>We've attached a calendar invite to this email. You can add it to your calendar to receive a reminder.</p>
          <p>If you need to reschedule or cancel, please contact us at ${process.env.EMAIL_USER}.</p>
          <p>We look forward to seeing you!</p>
          <p>Best regards,<br>QiraatHub Academy Team</p>
        </div>
      `,
      icalEvent: {
        filename: 'class-invitation.ics',
        method: 'REQUEST',
        content: calendar.toString(),
      },
    });
    
    // Send notification email to admin and teacher
    const recipients = teacherEmail
      ? [process.env.EMAIL_USER, teacherEmail].filter(Boolean).join(', ')
      : process.env.EMAIL_USER;

    await transporter.sendMail({
      from: `"QiraatHub Academy" <${process.env.EMAIL_USER}>`,
      to: recipients,
      subject: `New Class Scheduled: ${course}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Class Scheduled</h2>
          <p>A new class has been scheduled. Here are the details:</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Student:</strong> ${name ? `${name} (${email})` : email}</p>
            <p><strong>Course:</strong> ${course}</p>
            <p><strong>Date:</strong> ${new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p><strong>Duration:</strong> ${duration} ${duration === 1 ? 'hour' : 'hours'}</p>
            ${meetingLinkHtml}
          </div>
          <p>This is an automated notification.</p>
        </div>
      `,
      icalEvent: {
        filename: 'class-invitation.ics',
        method: 'REQUEST',
        content: calendar.toString(),
      },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error booking class:', error);
    return NextResponse.json({ error: 'Failed to book class' }, { status: 500 });
  }
}
