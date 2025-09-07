import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const body = await req.json();

  // Save submission in DB
  const saved = await prisma.contactForm.create({
    data: {
      name: body.name,
      email: body.email,
      phone: body.phone ?? null,
      subject: body.subject ?? null,
      message: body.message,
      inquiryType: body.inquiry_type ?? "general",
    },
  });

  try {
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT ?? 587),
        secure: false,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });

      const from = process.env.SMTP_FROM || "hello@solis.com.au";
      const toCafe = process.env.CONTACT_EMAIL || "hello@solis.com.au";

      // 📩 Email 1 → Notification to café
      await transporter.sendMail({
        from,
        to: toCafe,
        replyTo: body.email,
        subject: `New Contact Form: ${body.subject || body.inquiry_type || "General"}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #fffaf5; border: 1px solid #f4b942; border-radius: 12px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #2B3A4D, #3B4A5D); padding: 16px; text-align: center;">
              <h2 style="color: #F4B942; margin: 0;">📬 New Contact Form Submission</h2>
            </div>
            <div style="padding: 20px; color: #2B3A4D; font-size: 15px;">
              <p><strong>Name:</strong> ${body.name}</p>
              <p><strong>Email:</strong> ${body.email}</p>
              <p><strong>Phone:</strong> ${body.phone || "Not provided"}</p>
              <p><strong>Inquiry Type:</strong> ${body.inquiry_type || "General"}</p>
              <p><strong>Subject:</strong> ${body.subject || "Not provided"}</p>
              <hr style="margin: 16px 0; border: none; border-top: 1px solid #eee;" />
              <p style="white-space: pre-line;">${body.message}</p>
            </div>
          </div>
        `,
      });

      // 📩 Email 2 → Auto-reply to customer
      await transporter.sendMail({
        from: toCafe,
        to: body.email,
        replyTo: toCafe,
        subject: "Thank you for contacting Solis Espresso ☕",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #fffaf5; border-radius: 12px; overflow: hidden; border: 1px solid #f4b942;">
            <div style="background: linear-gradient(135deg, #2B3A4D, #3B4A5D); padding: 24px; text-align: center;">
              <h1 style="color: #F4B942; margin: 0; font-size: 28px;">Solis Espresso</h1>
              <p style="color: #ffffff; margin: 4px 0 0;">Artisanal Coffee • North Sydney</p>
            </div>
            <div style="padding: 24px; color: #2B3A4D; font-size: 16px; line-height: 1.6;">
              <p>Hi <strong>${body.name}</strong>,</p>
              <p>Thanks for reaching out to <strong>Solis Espresso</strong>! ☕<br/>
              We've received your message and one of our team members will get back to you within <strong>24 hours</strong>.</p>
              <p>In the meantime, we’d love to see you at our café:</p>
              <div style="background: #faf6f0; padding: 16px; border-radius: 8px; margin: 16px 0; border: 1px solid #f4b942;">
                <p style="margin: 4px 0;">📍 123 Coffee Street, North Sydney, NSW 2060</p>
                <p style="margin: 4px 0;">📞 (555) 123-COFFEE</p>
                <p style="margin: 4px 0;">⏰ Mon–Fri: 7AM–7PM, Sat: 8AM–8PM, Sun: 8AM–6PM</p>
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
              <p>Warm regards,<br/>The Solis Espresso Team<br/><a href="mailto:hello@solis.com.au">hello@solis.com.au</a></p>
            </div>
          </div>
        `,
      });
    }
  } catch (e) {
    console.error("Email error", e);
  }

  return NextResponse.json({ ok: true, id: saved.id });
}
