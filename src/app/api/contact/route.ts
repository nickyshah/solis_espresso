import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";
import { contactRateLimiter, withRateLimit } from "@/lib/rate-limiter";

// Input validation and sanitization functions
function sanitizeString(input: string): string {
  return input.trim().replace(/<script[^>]*>.*?<\/script>/gi, '').replace(/<[^>]*>/g, '');
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d\s\-\(\)]{7,15}$/;
  return phoneRegex.test(phone);
}

async function handlePOST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }
    
    // Validate field lengths
    if (body.name.length > 100 || body.email.length > 255 || body.message.length > 2000) {
      return NextResponse.json(
        { error: "Input exceeds maximum length" },
        { status: 400 }
      );
    }
    
    // Validate email format
    if (!validateEmail(body.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }
    
    // Validate phone if provided
    if (body.phone && !validatePhone(body.phone)) {
      return NextResponse.json(
        { error: "Invalid phone format" },
        { status: 400 }
      );
    }
    
    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeString(body.name),
      email: sanitizeString(body.email.toLowerCase()),
      phone: body.phone ? sanitizeString(body.phone) : null,
      subject: body.subject ? sanitizeString(body.subject) : null,
      message: sanitizeString(body.message),
      inquiry_type: body.inquiry_type && ['general', 'catering', 'events', 'feedback'].includes(body.inquiry_type) 
        ? body.inquiry_type : 'general'
    };

    // Save submission in DB
    const saved = await prisma.contactForm.create({
      data: {
        name: sanitizedData.name,
        email: sanitizedData.email,
        phone: sanitizedData.phone,
        subject: sanitizedData.subject,
        message: sanitizedData.message,
        inquiryType: sanitizedData.inquiry_type,
      },
    });

    // Send emails
    try {
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT ?? 587),
        secure: false,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });

      const from = process.env.SMTP_FROM || "info@solisespresso.com";
  const toCafe = process.env.CONTACT_EMAIL || "info@solisespresso.com";

      // 📩 Email 1 → Notification to café
      await transporter.sendMail({
        from,
        to: toCafe,
        replyTo: sanitizedData.email,
        subject: `New Contact Form: ${sanitizedData.subject || sanitizedData.inquiry_type || "General"}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #fffaf5; border: 1px solid #f4b942; border-radius: 12px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #2B3A4D, #3B4A5D); padding: 16px; text-align: center;">
              <h2 style="color: #F4B942; margin: 0;">📬 New Contact Form Submission</h2>
            </div>
            <div style="padding: 20px; color: #2B3A4D; font-size: 15px;">
              <p><strong>Name:</strong> ${sanitizedData.name}</p>
              <p><strong>Email:</strong> ${sanitizedData.email}</p>
              <p><strong>Phone:</strong> ${sanitizedData.phone || "Not provided"}</p>
              <p><strong>Inquiry Type:</strong> ${sanitizedData.inquiry_type || "General"}</p>
              <p><strong>Subject:</strong> ${sanitizedData.subject || "Not provided"}</p>
              <hr style="margin: 16px 0; border: none; border-top: 1px solid #eee;" />
              <p style="white-space: pre-line;">${sanitizedData.message}</p>
            </div>
          </div>
        `,
      });

      // 📩 Email 2 → Auto-reply to customer
      await transporter.sendMail({
        from: toCafe,
        to: sanitizedData.email,
        replyTo: toCafe,
        subject: "Thank you for contacting Solis Espresso ☕",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #fffaf5; border-radius: 12px; overflow: hidden; border: 1px solid #f4b942;">
            <div style="background: linear-gradient(135deg, #2B3A4D, #3B4A5D); padding: 24px; text-align: center;">
              <h1 style="color: #F4B942; margin: 0; font-size: 28px;">Solis Espresso</h1>
              <p style="color: #ffffff; margin: 4px 0 0;">Artisanal Coffee • North Sydney</p>
            </div>
            <div style="padding: 24px; color: #2B3A4D; font-size: 16px; line-height: 1.6;">
              <p>Hi <strong>${sanitizedData.name}</strong>,</p>
              <p>Thanks for reaching out to <strong>Solis Espresso</strong>! ☕<br/>
              We've received your message and one of our team members will get back to you within <strong>24 hours</strong>.</p>
              <p>In the meantime, we’d love to see you at our café:</p>
              <div style="background: #faf6f0; padding: 16px; border-radius: 8px; margin: 16px 0; border: 1px solid #f4b942;">
                <p style="margin: 4px 0;">📍 Shop 3, 77 Berry Street, North Sydney NSW 2060 Australia</p>
                <p style="margin: 4px 0;">⏰ Mon–Fri: 6AM–3:30PM, Sat–Sun: Closed</p>
              </div>
              <p style="margin: 16px 0;">Follow us on social media:</p>
              <div style="text-align: center; margin-bottom: 24px;">
                <a href="https://instagram.com/solisespresso" style="margin: 0 8px;">
                  <img src="https://cdn-icons-png.flaticon.com/512/1384/1384063.png" alt="Instagram" width="28" />
                </a>
                <a href="https://facebook.com/solisespresso" style="margin: 0 8px;">
                  <img src="https://cdn-icons-png.flaticon.com/512/1384/1384053.png" alt="Facebook" width="28" />
                </a>
                <a href="https://x.com/solisespresso" style="margin: 0 8px;">
                  <img src="https://cdn-icons-png.flaticon.com/512/5968/5968830.png" alt="X" width="28" />
                </a>
              </div>
              <p>Warm regards,<br/>The Solis Espresso Team<br/><a href="mailto:info@solisespresso.com">info@solisespresso.com</a></p>
            </div>
          </div>
        `,
      });
    }
  } catch (e) {
    console.error("Email error", e);
  }

    return NextResponse.json({ ok: true, id: saved.id });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Apply rate limiting to the POST handler
export const POST = withRateLimit(contactRateLimiter, handlePOST);
