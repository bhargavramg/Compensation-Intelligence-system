"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getCompanies, formatINR } from "@/lib/api";
import { Building2, Search, TrendingUp, Users, Sparkles } from "lucide-react";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<{ company: string; count: number; avg_compensation: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getCompanies()
      .then((res) => {
        const sorted = res.data.sort((a, b) => b.avg_compensation - a.avg_compensation);
        setCompanies(sorted);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = companies.filter(c => 
    c.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-grid">
      <div className="p-10 max-w-7xl mx-auto space-y-12 animate-fade-in">
        <section className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black border border-white/10 rounded-lg text-[11px] font-bold text-white/90">
             <Sparkles size={14} className="text-emerald-500 fill-emerald-500/20" />
             Market Explorer
          </div>
          <h1 className="text-6xl font-extrabold font-display leading-[1.1] tracking-tight">
            Explore <span className="text-gradient-emerald">Companies.</span>
          </h1>
          <p className="text-text-dim text-lg max-w-2xl leading-relaxed">
            Compare compensation structures across the top tech companies in India. Select a company to see detailed level-based analytics.
          </p>
        </section>

        <div className="flex items-center gap-2 px-4 bg-surface border border-border rounded-xl group focus-within:border-accent/50 transition-all max-w-md">
          <Search size={18} className="text-text-muted group-focus-within:text-accent" />
          <input 
            type="text" 
            placeholder="Search companies..." 
            className="w-full bg-transparent py-4 text-sm outline-none placeholder:text-text-muted"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-3 gap-6">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="glass-card h-40 animate-pulse bg-surface-muted/50" />
            ))
          ) : filtered.map((c) => (
            <Link 
              key={c.company} 
              href={`/company/${c.company}`}
              className="glass-card p-6 space-y-6 hover:border-accent/50 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                 <Building2 size={80} />
              </div>
              
              <div className="space-y-1">
                 <h3 className="text-2xl font-bold font-display group-hover:text-accent transition-colors">
                   {c.company.charAt(0).toUpperCase() + c.company.slice(1)}
                 </h3>
                 <div className="flex items-center gap-2 text-text-dim text-xs">
                    <Users size={12} />
                    {c.count} records indexed
                 </div>
              </div>

              <div className="space-y-1 pt-4 border-t border-border/50">
                 <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Average TC</div>
                 <div className="text-xl font-bold font-mono text-white group-hover:text-accent transition-colors">
                    {formatINR(c.avg_compensation)}
                 </div>
              </div>
              
              <div className="flex items-center gap-1 text-[10px] font-bold text-accent opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                 VIEW ANALYTICS <TrendingUp size={12} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
