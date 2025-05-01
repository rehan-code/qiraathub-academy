import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import ical from 'ical-generator';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { date, time, course, duration, email } = data;
    
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
    
    // Create calendar event
    const calendar = ical({
      domain: 'qiraathub.com',
      name: 'QiraatHub Academy Class',
    });
    
    calendar.createEvent({
      start: startTime,
      end: endTime,
      summary: `QiraatHub Academy - ${course}`,
      description: `Your ${course} class has been scheduled.`,
      location: 'Online',
      organizer: {
        name: 'QiraatHub Academy',
        email: process.env.EMAIL_USER || 'info@qiraathub.com',
      },
    });
    
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
    
    // Send email with calendar invite
    await transporter.sendMail({
      from: `"QiraatHub Academy" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Class Confirmation: ${course}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Your Class is Confirmed!</h2>
          <p>Dear Student,</p>
          <p>Your class has been successfully booked. Here are the details:</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Course:</strong> ${course}</p>
            <p><strong>Date:</strong> ${new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p><strong>Duration:</strong> ${duration} ${duration === 1 ? 'hour' : 'hours'}</p>
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
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error booking class:', error);
    return NextResponse.json({ error: 'Failed to book class' }, { status: 500 });
  }
}
