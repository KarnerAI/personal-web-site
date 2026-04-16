// Minimal sticky header with smooth-scroll anchors (PRD §6).
// TODO: hide-on-scroll-down behavior if desired, mobile drawer nav.
const NAV = [
  { href: "#career", label: "Career" },
  { href: "#entrepreneurship", label: "Entrepreneurship" },
  { href: "#side-projects", label: "Projects" },
  { href: "#beyond-work", label: "Beyond Work" },
  { href: "#contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[color-mix(in_srgb,var(--background)_85%,transparent)] border-b border-[var(--border)]">
      <nav className="content-width flex items-center justify-between h-14">
        <a href="#hero" className="font-medium tracking-tight">
          Hussain Alam
        </a>
        <ul className="hidden md:flex gap-6 text-sm text-muted">
          {NAV.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="hover:text-foreground transition-colors">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
