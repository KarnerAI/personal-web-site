// PRD §6.7 — Get in Touch
// TODO: React Hook Form + Zod, POST to /api/contact, success/error states,
// LinkedIn secondary CTA, honeypot field.
export function Contact() {
  return (
    <section id="contact" className="section">
      <div className="content-width max-w-xl mx-auto">
        <h2 className="text-3xl font-semibold text-center">Get in Touch</h2>
        <p className="mt-2 text-muted text-center">
          Currently open to product leadership roles. Also happy to talk with founders and investors.
        </p>
        <p className="mt-8 text-center text-sm text-muted">Form goes here.</p>
      </div>
    </section>
  );
}
