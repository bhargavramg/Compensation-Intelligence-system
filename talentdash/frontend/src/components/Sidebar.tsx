"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Building2, GitCompare, PlusCircle, Database } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const links = [
  { href: "/", label: "Salaries", icon: Database },
  { href: "/company", label: "Company", icon: Building2 },
  { href: "/compare", label: "Compare", icon: GitCompare },
];

export function Sidebar({ totalSalaries = 0 }: { totalSalaries?: number }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen sticky top-0 bg-surface border-r border-border flex flex-col p-4">
      <div className="flex items-center gap-3 px-4 mb-10">
        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-bg shadow-lg shadow-accent/20">
          <LayoutDashboard size={20} weight="bold" />
        </div>
        <div>
          <h1 className="text-lg font-bold leading-none font-display tracking-tight text-white">PayLevel</h1>
          <p className="text-[10px] text-text-muted uppercase tracking-widest mt-1">Comp Intelligence</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "nav-item",
                isActive ? "nav-item-active" : "nav-item-inactive"
              )}
            >
              <link.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              {link.label}
              {isActive && link.label === "Compare" && (
                <span className="ml-auto text-[10px] bg-accent/20 px-1.5 py-0.5 rounded border border-accent/30 font-bold">2/2</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4">
        <button className="w-full bg-accent hover:bg-accent/90 text-bg py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
          <PlusCircle size={18} strokeWidth={3} />
          Submit salary
        </button>
        
        <div className="px-4 py-2">
          <p className="text-[10px] text-text-muted uppercase tracking-widest text-center">
            {totalSalaries} salaries indexed
          </p>
        </div>
      </div>
    </aside>
  );
}
