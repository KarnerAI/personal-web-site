// PRD §6.1 — Hero / About
// TODO: headshot, name, one-liner (PRD §8), subline, intro paragraph, quote, contact chips.
export function Hero() {
  return (
    <section id="hero" className="section">
      <div className="content-width">
        <p className="text-sm uppercase tracking-widest text-muted">Hero</p>
        <h1 className="font-serif text-5xl mt-4">Hey 👋 I&apos;m Hussain Alam</h1>
        <p className="mt-4 text-lg text-muted">
          Product Strategist &amp; Builder — 12+ years across Fortune 100 growth and early-stage startups. Based in NYC.
        </p>
      </div>
    </section>
  );
}
