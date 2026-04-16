// PRD §6.8 — Footer
export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] py-8">
      <div className="content-width flex flex-wrap items-center justify-between gap-4 text-sm text-muted">
        <p>© {new Date().getFullYear()} Hussain Alam</p>
        <p>Built with Next.js</p>
      </div>
    </footer>
  );
}
