import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const body = await req.json();

  const saved = await prisma.contactForm.create({
    data: {
      name: body.name,
      email: body.email,
      phone: body.phone ?? null,
      subject: body.subject ?? null,
      message: body.message,
      inquiryType: body.inquiry_type ?? "general",
    }
  });

  try {
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT ?? 587),
        secure: false,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      });
      const from = process.env.SMTP_FROM || "no-reply@localhost";
      await transporter.sendMail({
        from, to: "hello@solisespresso.com",
        subject: `New Contact Form: ${body.subject || body.inquiry_type || "General"}`,
        text: `Name: ${body.name}
Email: ${body.email}
Phone: ${body.phone || "Not provided"}
Inquiry: ${body.inquiry_type}

${body.message}`
      });
      await transporter.sendMail({
        from, to: body.email,
        subject: "Thank you for contacting Solis Espresso",
        text: `Hi ${body.name},

Thanks for reaching out. We'll reply within 24 hours.

— Solis Espresso`
      });
    }
  } catch (e) {
    console.error("Email error", e);
  }

  return NextResponse.json({ ok: true, id: saved.id });
}
