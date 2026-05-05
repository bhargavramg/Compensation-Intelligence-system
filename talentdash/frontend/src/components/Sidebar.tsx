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
    <aside className="w-64 h-screen sticky top-0 bg-[#0d0d0d] border-r border-white/5 flex flex-col p-6">
      <div className="flex items-center gap-3 mb-12">
        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
          <LayoutDashboard size={18} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-base font-bold leading-none tracking-tight text-white">PayLevel</h1>
          <p className="text-[9px] text-gray-500 uppercase tracking-widest mt-1">Market Intel</p>
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
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                isActive ? "bg-white/5 text-indigo-400 border border-white/5" : "text-gray-500 hover:text-white hover:bg-white/5"
              )}
            >
              <link.icon size={16} strokeWidth={isActive ? 2.5 : 2} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-6">
        <Link 
          href="/submit"
          className="w-full bg-indigo-500 hover:bg-indigo-400 text-white py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-indigo-500/10"
        >
          <PlusCircle size={16} strokeWidth={2.5} />
          Submit salary
        </Link>
        
        <div className="text-center">
          <p className="text-[10px] text-gray-600 uppercase tracking-[0.2em] font-bold">
            {totalSalaries} indexed
          </p>
        </div>
      </div>
    </aside>

  );
}
