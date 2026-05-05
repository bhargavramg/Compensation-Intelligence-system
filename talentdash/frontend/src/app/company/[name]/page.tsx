"use client";
import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getCompany, formatINR, levelColor, type CompanyResponse, type Salary } from "@/lib/api";
import { LevelBadge } from "@/components/LevelBadge";
import { Building2, TrendingUp, Users, MapPin, ChevronDown, Filter, ArrowLeft } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function CompanyPage() {
  const { name } = useParams<{ name: string }>();
  const [data, setData] = useState<CompanyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getCompany(decodeURIComponent(name))
      .then(setData)
      .catch(() => setError("Company not found"))
      .finally(() => setLoading(false));
  }, [name]);

  const chartData = useMemo(() => {
    if (!data) return [];
    return data.level_averages.map(lvl => ({
      level: lvl.level,
      avg: lvl.avg_compensation / 100000,
      rawAvg: lvl.avg_compensation
    })).sort((a, b) => a.avg - b.avg);
  }, [data]);

  const pStats = useMemo(() => {
    if (!data || data.salaries.length === 0) return { p75: 0, p90: 0 };
    const sorted = [...data.salaries].sort((a, b) => a.total_compensation - b.total_compensation);
    const p75 = sorted[Math.floor(sorted.length * 0.75)].total_compensation;
    const p90 = sorted[Math.floor(sorted.length * 0.9)]?.total_compensation || p75;
    return { p75, p90 };
  }, [data]);

  if (loading) return <div className="p-10 animate-pulse text-text-muted">Loading analytics...</div>;
  if (error || !data) return <div className="p-10 text-red-400">{error}</div>;

  const displayName = data.company.charAt(0).toUpperCase() + data.company.slice(1);
  const locations = new Set(data.salaries.map(s => s.location)).size;

  return (
    <div className="min-h-screen bg-grid">
      <div className="p-10 max-w-7xl mx-auto space-y-10 animate-fade-in">
        <section className="space-y-6">
          <Link 
            href="/company" 
            className="inline-flex items-center gap-2 text-xs font-bold text-text-muted hover:text-white transition-colors group mb-4"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Companies
          </Link>

          <div className="flex items-center justify-between">
             <div className="space-y-4">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-[10px] font-bold text-accent uppercase tracking-widest">
                  <Building2 size={12} />
                  Company Intelligence
               </div>
               <h1 className="text-6xl font-extrabold font-display leading-[1.1]">
                  {displayName}
               </h1>
             </div>
             
             <div className="flex gap-2 p-1 bg-surface border border-border rounded-xl">
                <div className="px-4 py-2 text-xs font-bold bg-surface-muted rounded-lg flex items-center gap-2">
                  Select company
                  <div className="bg-accent/10 text-accent px-2 py-0.5 rounded border border-accent/20">{displayName} ({data.total_entries})</div>
                  <ChevronDown size={14} className="text-text-muted" />
                </div>
             </div>
          </div>
        </section>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6">
          {[
            { label: "Records", value: data.total_entries, sub: `${locations} locations`, icon: Users },
            { label: "Median TC", value: formatINR(data.median_compensation), sub: "middle of pack", icon: TrendingUp, accent: true },
            { label: "P75 TC", value: formatINR(pStats.p75), sub: "top 25%", icon: TrendingUp },
            { label: "P90 TC", value: formatINR(pStats.p90), sub: "top 10%", icon: TrendingUp },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">{stat.label}</span>
                <stat.icon size={16} className="text-text-muted" />
              </div>
              <div className="space-y-1">
                <div className={`text-3xl font-bold font-mono tracking-tight ${stat.accent ? "text-accent" : ""}`}>{stat.value}</div>
                <p className="text-[11px] text-text-dim">{stat.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Bar Chart Section */}
          <div className="col-span-2 glass-card p-8">
             <div className="space-y-1 mb-8">
               <h2 className="text-sm font-bold flex items-center gap-2">
                 <TrendingUp size={16} className="text-accent" />
                 Compensation by Level
               </h2>
               <p className="text-xs text-text-muted">Median total compensation across standardized levels</p>
             </div>
             
             <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                   <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                   <XAxis 
                     dataKey="level" 
                     stroke="#4b5563" 
                     fontSize={11} 
                     tickLine={false} 
                     axisLine={false}
                     dy={10}
                   />
                   <YAxis 
                     stroke="#4b5563" 
                     fontSize={10} 
                     tickLine={false} 
                     axisLine={false}
                     unit="L"
                   />
                   <Tooltip 
                      cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const d = payload[0].payload;
                          return (
                            <div className="bg-surface border border-border p-3 rounded-lg shadow-2xl">
                              <p className="text-xs font-bold text-accent mb-1">{d.level} Median</p>
                              <p className="text-sm font-mono font-bold">{formatINR(d.rawAvg)}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                   />
                   <Bar dataKey="avg" radius={[4, 4, 0, 0]} barSize={60}>
                      {chartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.level === "L6" ? "#fbbf24" : entry.level === "L5" ? "#a78bfa" : entry.level === "L4" ? "#34d399" : "#60a5fa"} 
                        />
                      ))}
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
             </div>
          </div>

          {/* Level Distribution Sidebar */}
          <div className="glass-card p-8">
             <div className="space-y-1 mb-8">
               <h2 className="text-sm font-bold flex items-center gap-2">
                 <Users size={16} className="text-accent" />
                 Level Distribution
               </h2>
               <p className="text-xs text-text-muted">How many at each level</p>
             </div>

             <div className="space-y-4">
                {data.level_distribution.map((ld) => {
                  const avg = data.level_averages.find(la => la.level === ld.level);
                  return (
                    <div key={ld.level} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                         <LevelBadge level={ld.level} />
                         <span className="text-[11px] text-text-dim">{ld.count} {ld.count === 1 ? "record" : "records"}</span>
                      </div>
                      <div className="text-xs font-mono font-bold group-hover:text-accent transition-colors">
                         {avg ? formatINR(avg.avg_compensation) : "—"}
                      </div>
                    </div>
                  );
                })}
             </div>
          </div>
        </div>

        {/* Table Title */}
        <div className="flex items-center gap-4">
           <h2 className="text-lg font-bold font-display">{displayName} · All Records</h2>
        </div>

        {/* Detailed Table */}
        <div className="glass-card overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-muted/50">
                <th className="table-header">Role</th>
                <th className="table-header">Level</th>
                <th className="table-header">Location</th>
                <th className="table-header">Exp</th>
                <th className="table-header text-right">Base</th>
                <th className="table-header text-right">Bonus</th>
                <th className="table-header text-right">Stock/yr</th>
                <th className="table-header text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.salaries.map((s) => (
                <tr key={s.id} className="hover:bg-surface-muted/50 transition-colors group">
                  <td className="table-cell font-bold text-white group-hover:text-accent transition-colors">{s.role}</td>
                  <td className="table-cell"><LevelBadge level={s.level} /></td>
                  <td className="table-cell text-text-dim">{s.location}</td>
                  <td className="table-cell font-mono font-bold text-white">{s.experience_years}y</td>
                  <td className="table-cell text-right font-mono text-text-dim">{formatINR(s.base_salary)}</td>
                  <td className="table-cell text-right font-mono text-text-dim">{s.bonus > 0 ? formatINR(s.bonus) : "₹0.0L"}</td>
                  <td className="table-cell text-right font-mono text-text-dim">{s.stock > 0 ? formatINR(s.stock) : "₹0.0L"}</td>
                  <td className="table-cell text-right">
                     <div className="flex flex-col items-end">
                        <span className="text-accent font-bold font-mono text-sm">{formatINR(s.total_compensation)}</span>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
