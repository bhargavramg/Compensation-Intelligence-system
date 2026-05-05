import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "PayLevel — Compensation Intelligence",
  description: "Level-based compensation data for Indian tech.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-bg text-text">
        <div className="flex min-h-screen">
          <Sidebar totalSalaries={44} />
          <main className="flex-1 overflow-x-hidden bg-bg/50">
            {children}
            <footer className="py-8 px-10 text-center">
               <p className="text-[10px] text-text-muted uppercase tracking-[0.2em] font-medium">
                Built for the comp intelligence trial · Levels normalized · 44 salaries indexed
               </p>
            </footer>
          </main>
        </div>
      </body>
    </html>
  );
}
