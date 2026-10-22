// Footer (theme B, v7): copyright left, a mono "Built with" note right.
export function Footer() {
  return (
    <footer className="theme-b site-footer">
      <div className="wrap">
        <p>© {new Date().getFullYear()} Hussain Alam</p>
        <p>Built with Next.js</p>
      </div>
    </footer>
  );
}
