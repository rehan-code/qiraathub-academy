import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, subject, message } = data;
    
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
    
    // Send email to admin
    await transporter.sendMail({
      from: `"QiraatHub Academy Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Contact Form Submission</h2>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <div style="background-color: white; padding: 10px; border-radius: 5px; margin-top: 5px;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          <p>This is an automated notification from your qiraathub-academy web contact form.</p>
        </div>
      `,
      replyTo: email,
    });
    
    // Send confirmation email to the user
    await transporter.sendMail({
      from: `"QiraatHub Academy" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Thank you for contacting QiraatHub Academy`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Thank You for Contacting Us</h2>
          <p>Dear ${name},</p>
          <p>Thank you for reaching out to QiraatHub Academy. We have received your message regarding "${subject}".</p>
          <p>Our team will review your inquiry and get back to you as soon as possible.</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Your message:</strong></p>
            <div style="background-color: white; padding: 10px; border-radius: 5px; margin-top: 5px;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          <p>Best regards,<br>QiraatHub Academy Team</p>
        </div>
      `,
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending contact form:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
