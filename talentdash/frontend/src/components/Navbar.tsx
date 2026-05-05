"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Salaries" },
  { href: "/compare", label: "Compare" },
];

export function Navbar() {
  const path = usePathname();
  return (
    <nav className="sticky top-0 z-50 border-b" style={{ background: "#0a0a0f", borderColor: "#1e1e2e" }}>
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight" style={{ fontFamily: "'Syne', sans-serif", color: "#6ee7b7" }}>
            TalentDash
          </span>
          <span className="text-xs px-2 py-0.5 rounded" style={{ background: "rgba(110,231,183,0.1)", color: "#6ee7b7", fontFamily: "'JetBrains Mono', monospace" }}>
            BETA
          </span>
        </Link>
        <div className="flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-4 py-1.5 rounded text-sm font-medium transition-colors"
              style={{
                color: path === l.href ? "#6ee7b7" : "#94a3b8",
                background: path === l.href ? "rgba(110,231,183,0.08)" : "transparent",
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
