// PRD §6.6 — Education (compact, de-emphasized)
export function Education() {
  return (
    <section id="education" className="section-compact">
      <div className="content-width flex flex-wrap items-baseline justify-between gap-4">
        <p className="text-base">
          <span className="font-medium">UMass Amherst</span>
          <span className="text-muted"> — BS Mechanical Engineering</span>
        </p>
        <p className="text-sm text-muted">
          Harvard Business School Core · MIT Design Thinking · YC Product School
        </p>
      </div>
    </section>
  );
}
