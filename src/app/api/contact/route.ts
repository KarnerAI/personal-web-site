import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getResend } from "@/lib/resend";

// Basic schema — mirrors Contact.tsx form fields (PRD §6.7).
const contactSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(200),
  companyOrRole: z.string().max(200).optional(),
  message: z.string().min(1).max(5000),
  // Honeypot: if filled, silently drop.
  website: z.string().max(0).optional(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  // Honeypot — pretend it succeeded, don't send.
  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  const { name, email, companyOrRole, message } = parsed.data;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL;

  if (!from || !to || !process.env.RESEND_API_KEY) {
    // Fail loudly in logs, generic message to client.
    console.error("Contact form env vars missing");
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }

  const { error } = await getResend().emails.send({
    from,
    to,
    replyTo: email,
    subject: `Website contact from ${name}`,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      companyOrRole ? `Company/Role: ${companyOrRole}` : null,
      "",
      message,
    ]
      .filter(Boolean)
      .join("\n"),
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
