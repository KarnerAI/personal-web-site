"use client";

// Contact — Option B · "Two-column form + sidebar"
// Ported from public/contact-comparison.html (#b).
// Left: form (Name + Email in a row, Company/role, Message). Right: sidebar
// (Location · Response time · Elsewhere). Submit POSTs JSON to /api/contact;
// success/error displayed inline under the submit button.

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema, type ContactFormValues } from "@/lib/contact-schema";

type SendState =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "ok" }
  | { kind: "err"; message: string };

export function Contact() {
  const [state, setState] = useState<SendState>({ kind: "idle" });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: "", email: "", companyOrRole: "", message: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website: "" }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setState({ kind: "err", message: data.error ?? "Something went wrong." });
        return;
      }
      setState({ kind: "ok" });
      reset();
    } catch {
      setState({ kind: "err", message: "Network error — please try again." });
    }
  });

  const inputCls =
    "font-sans text-[15px] px-3.5 py-3 border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)] transition-colors";
  const labelCls =
    "font-mono text-xs uppercase tracking-wider text-muted mb-1.5 block";

  return (
    <section id="contact" className="section">
      <div className="content-width">
        <p className="text-xs font-mono uppercase tracking-widest text-[var(--accent)] mb-3">
          Contact
        </p>
        <h2 className="font-serif text-5xl md:text-6xl tracking-tight mb-2">
          Get in touch.
        </h2>
        <p className="text-muted mb-10">Long-form on the left, fast lane on the right.</p>

        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr] items-start">
          {/* Form */}
          <form
            onSubmit={onSubmit}
            noValidate
            className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-8 md:px-10 md:py-9"
          >
            <h3 className="font-serif text-3xl mb-5">Send a message</h3>

            {/* Honeypot — hidden from users, bots fill it */}
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
              name="website"
              className="hidden"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col">
                <label htmlFor="contact-name" className={labelCls}>Name</label>
                <input
                  id="contact-name"
                  type="text"
                  placeholder="Your name"
                  className={inputCls}
                  aria-invalid={!!errors.name}
                  {...register("name")}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-[var(--accent)]">{errors.name.message}</p>
                )}
              </div>
              <div className="flex flex-col">
                <label htmlFor="contact-email" className={labelCls}>Email</label>
                <input
                  id="contact-email"
                  type="email"
                  placeholder="you@company.com"
                  className={inputCls}
                  aria-invalid={!!errors.email}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-[var(--accent)]">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col mb-4">
              <label htmlFor="contact-co" className={labelCls}>Company or role</label>
              <input
                id="contact-co"
                type="text"
                placeholder="Optional"
                className={inputCls}
                {...register("companyOrRole")}
              />
            </div>

            <div className="flex flex-col mb-5">
              <label htmlFor="contact-msg" className={labelCls}>Message</label>
              <textarea
                id="contact-msg"
                placeholder="What’s on your mind?"
                className={[inputCls, "min-h-[120px] resize-y"].join(" ")}
                aria-invalid={!!errors.message}
                {...register("message")}
              />
              {errors.message && (
                <p className="mt-1 text-xs text-[var(--accent)]">{errors.message.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || state.kind === "sending"}
              className="bg-[var(--accent)] text-[var(--accent-fg)] font-medium text-[15px] px-6 py-3.5 rounded-lg transition-[transform,filter] hover:-translate-y-[1px] hover:brightness-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {state.kind === "sending" ? "Sending…" : "Send message →"}
            </button>

            {state.kind === "ok" && (
              <p className="mt-3 text-sm text-emerald-700">
                Thanks — message sent. I&rsquo;ll reply within 48 hours.
              </p>
            )}
            {state.kind === "err" && (
              <p className="mt-3 text-sm text-[var(--accent)]">{state.message}</p>
            )}
          </form>

          {/* Sidebar */}
          <div className="flex flex-col gap-5">
            <Card title="Location">
              <p className="font-serif text-[26px] leading-tight">New York, NY</p>
              <p className="text-sm text-muted">America/New_York</p>
            </Card>
            <Card title="Response time">
              <p className="font-serif text-[26px] leading-tight">~48 hours</p>
              <p className="text-sm text-muted">Faster if it&rsquo;s product-related.</p>
            </Card>
            <Card title="Elsewhere">
              <div className="flex flex-col gap-2.5">
                <SocialRow
                  label="LinkedIn"
                  handle="/in/hussainalam"
                  href="https://www.linkedin.com/in/hussainalam"
                />
                <SocialRow
                  label="Email"
                  handle="hi@hussainalam.com"
                  href="mailto:hi@hussainalam.com"
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-6 py-5">
      <h4 className="font-mono uppercase tracking-widest text-[11px] text-[var(--accent)] mb-2.5">
        {title}
      </h4>
      {children}
    </div>
  );
}

function SocialRow({
  label,
  handle,
  href,
}: {
  label: string;
  handle: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      className="flex items-center justify-between px-4 py-3 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--foreground)] hover:border-[var(--accent)] transition-colors"
    >
      <span>{label}</span>
      <span className="font-mono text-xs text-muted">{handle}</span>
    </a>
  );
}
