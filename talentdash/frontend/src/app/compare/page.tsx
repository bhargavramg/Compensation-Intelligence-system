"use client";
import { useState, useEffect } from "react";
import { getSalaries, getCompare, formatINR, type Salary, type CompareResponse } from "@/lib/api";
import { LevelBadge } from "@/components/LevelBadge";
import { GitCompare, TrendingUp, AlertCircle, MapPin, Building2, Briefcase, Info } from "lucide-react";

function DiffCard({ label, value, sub }: { label: string, value: number, sub: string }) {
  const isPositive = value > 0;
  const isZero = value === 0;
  
  return (
    <div className="glass-card p-6 flex flex-col gap-2">
       <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{label}</span>
       <div className={`text-2xl font-bold font-mono ${isZero ? "text-text-muted" : isPositive ? "text-accent" : "text-red-400"}`}>
          {isZero ? "" : isPositive ? "+" : "-"}{formatINR(Math.abs(value))}
       </div>
       <p className="text-[10px] text-text-dim">{sub}</p>
    </div>
  );
}

export default function ComparePage() {
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [id1, setId1] = useState("");
  const [id2, setId2] = useState("");
  const [result, setResult] = useState<CompareResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getSalaries({ limit: "100" }).then((r) => setSalaries(r.data));
  }, []);

  const handleCompare = async (val1: string, val2: string) => {
    if (!val1 || !val2) return;
    setLoading(true);
    setError("");
    try {
      const res = await getCompare(val1, val2);
      setResult(res);
    } catch {
      setError("Failed to fetch comparison");
    } finally {
      setLoading(false);
    }
  };

  const label = (s: Salary) =>
    `${s.company.charAt(0).toUpperCase() + s.company.slice(1)} · ${s.level} · ${s.role} · ${formatINR(s.total_compensation)}`;

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-10 animate-fade-in">
      <section className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-[10px] font-bold text-accent uppercase tracking-widest">
           <GitCompare size={12} />
           Offer Analysis
        </div>
        <h1 className="text-6xl font-extrabold font-display leading-[1.1]">
          Compensation, <span className="text-accent">structured by level.</span>
        </h1>
        <p className="text-text-dim text-lg max-w-2xl leading-relaxed">
          Same role ≠ same pay. PayLevel normalizes every salary to L3–L8 bands so you can compare offers like-for-like across companies.
        </p>
      </section>

      {/* Selectors Section */}
      <div className="grid grid-cols-2 gap-6 bg-surface-muted/50 p-6 rounded-2xl border border-border">
         {[
           { id: id1, setter: setId1, label: "SALARY A" },
           { id: id2, setter: setId2, label: "SALARY B" }
         ].map((sel, idx) => (
           <div key={idx} className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-2">{sel.label}</label>
              <select
                value={sel.id}
                onChange={(e) => {
                  sel.setter(e.target.value);
                  if (idx === 0) handleCompare(e.target.value, id2);
                  else handleCompare(id1, e.target.value);
                }}
                className="w-full bg-surface border border-border rounded-xl p-3 text-sm outline-none focus:border-accent/50 appearance-none"
              >
                <option value="">Select a salary...</option>
                {salaries.map((s) => <option key={s.id} value={s.id}>{label(s)}</option>)}
              </select>
           </div>
         ))}
      </div>

      {result && (
        <div className="space-y-10">
          <div className="grid grid-cols-2 gap-6">
             {[result.salary1, result.salary2].map((s, i) => (
               <div key={i} className="glass-card p-8 space-y-6 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-accent opacity-20 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-start justify-between">
                     <div className="space-y-1">
                        <span className="bg-surface-muted text-[10px] font-bold px-2 py-0.5 rounded border border-border">{i === 0 ? "A" : "B"}</span>
                        <h3 className="text-3xl font-bold font-display">{s.company.charAt(0).toUpperCase() + s.company.slice(1)}</h3>
                        <p className="text-text-dim flex items-center gap-2 text-sm">
                           {s.role} · {s.location} · {s.experience_years}y exp
                        </p>
                     </div>
                     <LevelBadge level={s.level} />
                  </div>

                  <div className="space-y-4">
                     {[
                       { label: "Base", val: s.base_salary },
                       { label: "Bonus", val: s.bonus },
                       { label: "Stock / yr", val: s.stock },
                     ].map(row => (
                       <div key={row.label} className="flex justify-between items-center text-sm border-b border-border/50 pb-2">
                          <span className="text-text-muted">{row.label}</span>
                          <span className="font-mono text-white font-bold">{formatINR(row.val)}</span>
                       </div>
                     ))}
                     <div className="flex justify-between items-center pt-2">
                        <span className="text-text-muted font-bold">Total Comp</span>
                        <span className="text-2xl font-mono text-accent font-bold">{formatINR(s.total_compensation)}</span>
                     </div>
                  </div>
               </div>
             ))}
          </div>

          {/* Delta Section */}
          <div className="space-y-6">
             <div className="flex items-center gap-3">
                <GitCompare size={20} className="text-accent" />
                <h2 className="text-xl font-bold font-display">Delta (B — A)</h2>
                <p className="text-sm text-text-muted">How much more (or less) does B pay vs A</p>
             </div>

             <div className="grid grid-cols-5 gap-4">
                <DiffCard label="Base" value={result.diff.base_salary} sub="annual difference" />
                <DiffCard label="Bonus" value={result.diff.bonus} sub="annual difference" />
                <DiffCard label="Stock/yr" value={result.diff.stock} sub="annual difference" />
                
                <div className="glass-card p-6 border-accent/40 bg-accent/5 flex flex-col gap-2 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-2 opacity-10">
                      <TrendingUp size={40} className="text-accent" />
                   </div>
                   <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Total</span>
                   <div className={`text-2xl font-bold font-mono ${result.diff.total_compensation >= 0 ? "text-accent" : "text-red-400"}`}>
                      {result.diff.total_compensation >= 0 ? "+" : "-"}{formatINR(Math.abs(result.diff.total_compensation))}
                   </div>
                   <p className="text-[10px] text-text-dim">comp difference</p>
                </div>

                <div className="glass-card p-6 flex flex-col gap-2">
                   <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Level Diff</span>
                   <div className="text-2xl font-bold font-mono text-red-400">
                      {result.diff.level_diff > 0 ? "+" : ""}{result.diff.level_diff} band{Math.abs(result.diff.level_diff) !== 1 ? "s" : ""}
                   </div>
                   <p className="text-[10px] text-text-dim">{result.salary1.level} → {result.salary2.level}</p>
                </div>
             </div>

             <div className="bg-accent/5 border border-accent/20 p-4 rounded-xl flex items-center gap-3">
                <Info size={16} className="text-accent" />
                <p className="text-sm">
                   B pays <span className="text-accent font-bold">{formatINR(Math.abs(result.diff.total_compensation))}</span> ({((Math.abs(result.diff.total_compensation) / result.salary1.total_compensation) * 100).toFixed(1)}%) {result.diff.total_compensation >= 0 ? "more" : "less"} than A.
                </p>
             </div>
          </div>
        </div>
      )}

      {loading && <p className="text-text-muted animate-pulse">Running comparison...</p>}
      {error && <p className="text-red-400">{error}</p>}
    </div>
  );
}
