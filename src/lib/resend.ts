import { Resend } from "resend";

/**
 * Lazy Resend client — instantiated on first use.
 * Keeps `next build` working without RESEND_API_KEY set.
 * Requires RESEND_API_KEY in .env.local at runtime (see .env.local.example).
 */
let client: Resend | null = null;

export function getResend(): Resend {
  if (!client) {
    const key = process.env.RESEND_API_KEY;
    if (!key) {
      throw new Error("RESEND_API_KEY is not set");
    }
    client = new Resend(key);
  }
  return client;
}
