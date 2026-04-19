import { z } from "zod";

// Shared client/server validation for the contact form.
// Server route (src/app/api/contact/route.ts) has its own nearly-identical schema
// plus a honeypot field; this one is just for the client form.
export const contactFormSchema = z.object({
  name: z.string().min(1, "Please enter your name").max(200),
  email: z.string().email("Please enter a valid email").max(200),
  companyOrRole: z.string().max(200).optional().or(z.literal("")),
  message: z.string().min(1, "Please write a message").max(5000),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
