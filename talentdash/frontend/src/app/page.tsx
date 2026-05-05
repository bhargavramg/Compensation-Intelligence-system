"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { getSalaries, formatINR, type Salary } from "@/lib/api";
import { LevelBadge } from "@/components/LevelBadge";
import { Search, MapPin, Briefcase, ChevronDown, Filter, Info, TrendingUp, Database, Building2, Sparkles } from "lucide-react";
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const LEVELS = ["L3","L4","L5","L6","L7","SDE1","SDE2","SDE3","Senior","Staff","Principal","E3","E4","E5","E6","E7","Director"];
const LOCATIONS = ["Bangalore", "Hyderabad", "Pune", "Remote", "Gurgaon"];

export default function SalariesPage() {
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ company: "", role: "", level: "", location: "" });
  const [sort, setSort] = useState<"asc" | "desc">("desc");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { sort };
      if (filters.company) params.company = filters.company;
      if (filters.role) params.role = filters.role;
      if (filters.level) params.level = filters.level;
      if (filters.location) params.location = filters.location;
      const res = await getSalaries(params);
      setSalaries(res.data);
      setMeta(res.meta);
    } catch {
      setSalaries([]);
    } finally {
      setLoading(false);
    }
  }, [filters, sort]);

  useEffect(() => {
    const t = setTimeout(fetchData, 300);
    return () => clearTimeout(t);
  }, [fetchData]);

  const setFilter = (key: string, val: string) =>
    setFilters((prev) => ({ ...prev, [key]: val }));

  const chartData = useMemo(() => {
    return salaries.map(s => ({
      x: s.experience_years,
      y: s.total_compensation / 100000, // In Lakhs for chart axis
      rawY: s.total_compensation,
      level: s.level,
      company: s.company,
      role: s.role
    }));
  }, [salaries]);

  const stats = useMemo(() => {
    if (salaries.length === 0) return { median: 0, p90: 0, companies: 0 };
    const sorted = [...salaries].sort((a, b) => a.total_compensation - b.total_compensation);
    const median = sorted[Math.floor(sorted.length / 2)].total_compensation;
    const p90 = sorted[Math.floor(sorted.length * 0.9)]?.total_compensation || median;
    const companies = new Set(salaries.map(s => s.company)).size;
    return { median, p90, companies };
  }, [salaries]);

  const levelColorMap: Record<string, string> = {
    L3: "#6ee7b7", L4: "#34d399", L5: "#10b981", L6: "#f59e0b", L7: "#ef4444"
  };

  return (
    <div className="min-h-screen bg-grid">
      <div className="p-10 max-w-7xl mx-auto space-y-12 animate-fade-in">
        {/* Hero */}
        <section className="space-y-4 pt-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black border border-white/10 rounded-lg text-[11px] font-bold text-white/90">
             <Sparkles size={14} className="text-emerald-500 fill-emerald-500/20" />
             India Tech · Standardized Levels
          </div>
          <h1 className="text-[72px] font-extrabold font-display leading-[1.1] tracking-tight">
            Compensation, <span className="text-gradient-emerald">structured by</span> <br />
            <span className="text-gradient-cyan">level.</span>
          </h1>
          <p className="text-text-dim text-xl max-w-2xl leading-relaxed">
            Same role ≠ same pay. PayLevel normalizes every salary to L3–L8 bands so you can compare offers like-for-like across companies.
          </p>
        </section>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6">
          {[
            { label: "Records", value: meta.total, sub: "filtered results", icon: Database },
            { label: "Companies", value: stats.companies, sub: "in current view", icon: Building2 },
            { label: "Median TC", value: formatINR(stats.median), sub: "across filters", icon: TrendingUp },
            { label: "P90 TC", value: formatINR(stats.p90), sub: "top 10%", icon: TrendingUp },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-6 space-y-3 hover:border-accent/30 transition-all group">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted group-hover:text-accent transition-colors">{stat.label}</span>
                <stat.icon size={16} className="text-text-muted group-hover:text-accent transition-colors" />
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold font-mono tracking-tight">{stat.value}</div>
                <p className="text-[11px] text-text-dim">{stat.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Chart Section */}
        <div className="glass-card p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
               <h2 className="text-sm font-bold flex items-center gap-2">
                 <TrendingUp size={16} className="text-accent" />
                 Compensation vs Experience
               </h2>
               <p className="text-xs text-text-muted">Each dot is one salary record. Hover for details.</p>
            </div>
            <div className="flex gap-4">
               {Object.entries(levelColorMap).map(([lvl, color]) => (
                 <div key={lvl} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                    <span className="text-[10px] font-bold text-text-muted">{lvl}</span>
                 </div>
               ))}
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                <XAxis 
                  type="number" 
                  dataKey="x" 
                  name="Experience" 
                  unit="y" 
                  stroke="#4b5563" 
                  fontSize={10} 
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  type="number" 
                  dataKey="y" 
                  name="Total TC" 
                  unit="L" 
                  stroke="#4b5563" 
                  fontSize={10} 
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-surface border border-border p-3 rounded-lg shadow-2xl">
                          <p className="text-xs font-bold text-accent mb-1">{data.company} · {data.role}</p>
                          <p className="text-[10px] text-text-muted">{data.level} · {data.x}y exp</p>
                          <p className="text-sm font-mono font-bold mt-2">{formatINR(data.rawY)}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter data={chartData}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={levelColorMap[entry.level] || "#4b5563"} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="flex gap-4 items-center bg-surface-muted/50 p-2 rounded-xl border border-border">
          <div className="flex-1 flex items-center gap-2 px-4 bg-surface border border-border rounded-lg group focus-within:border-accent/50 transition-all">
            <Search size={16} className="text-text-muted group-focus-within:text-accent" />
            <input 
              type="text" 
              placeholder="Company (e.g. Google)" 
              className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-text-muted"
              value={filters.company}
              onChange={(e) => setFilter("company", e.target.value)}
            />
          </div>
          <div className="flex-1 flex items-center gap-2 px-4 bg-surface border border-border rounded-lg group focus-within:border-accent/50 transition-all">
            <Briefcase size={16} className="text-text-muted group-focus-within:text-accent" />
            <input 
              type="text" 
              placeholder="Role (e.g. SDE)" 
              className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-text-muted"
              value={filters.role}
              onChange={(e) => setFilter("role", e.target.value)}
            />
          </div>
          <select 
            className="bg-surface border border-border rounded-lg py-3 px-4 text-sm outline-none focus:border-accent/50 appearance-none min-w-[140px]"
            value={filters.level}
            onChange={(e) => setFilter("level", e.target.value)}
          >
            <option value="">All Levels</option>
            {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <select 
            className="bg-surface border border-border rounded-lg py-3 px-4 text-sm outline-none focus:border-accent/50 appearance-none min-w-[140px]"
            value={filters.location}
            onChange={(e) => setFilter("location", e.target.value)}
          >
            <option value="">All Locations</option>
            {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="glass-card overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-muted/50">
                <th className="table-header w-12"><input type="checkbox" className="accent-accent" /></th>
                <th className="table-header">Company</th>
                <th className="table-header">Role</th>
                <th className="table-header">Level</th>
                <th className="table-header">Location</th>
                <th className="table-header">Exp</th>
                <th className="table-header text-right">Base</th>
                <th className="table-header text-right">Bonus</th>
                <th className="table-header text-right">Stock/yr</th>
                <th className="table-header text-right">Total Comp</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                     <td colSpan={10} className="py-6 px-6 border-b border-border/50">
                        <div className="h-4 bg-surface-muted rounded w-full"></div>
                     </td>
                  </tr>
                ))
              ) : salaries.map((s) => (
                <tr key={s.id} className="hover:bg-surface-muted/50 transition-colors group">
                  <td className="table-cell"><input type="checkbox" className="accent-accent" /></td>
                  <td className="table-cell font-bold text-white group-hover:text-accent transition-colors">
                    <Link href={`/company/${s.company}`}>{s.company.charAt(0).toUpperCase() + s.company.slice(1)}</Link>
                  </td>
                  <td className="table-cell text-text-dim">{s.role}</td>
                  <td className="table-cell"><LevelBadge level={s.level} /></td>
                  <td className="table-cell text-text-dim flex items-center gap-1.5 whitespace-nowrap">
                    <MapPin size={12} className="text-text-muted" /> {s.location}
                  </td>
                  <td className="table-cell font-mono font-bold text-white">{s.experience_years}y</td>
                  <td className="table-cell text-right font-mono text-text-dim">{formatINR(s.base_salary)}</td>
                  <td className="table-cell text-right font-mono text-text-dim">{s.bonus > 0 ? formatINR(s.bonus) : "₹0.0L"}</td>
                  <td className="table-cell text-right font-mono text-text-dim">{s.stock > 0 ? formatINR(s.stock) : "₹0.0L"}</td>
                  <td className="table-cell text-right">
                     <div className="flex flex-col items-end">
                        <span className="text-accent font-bold font-mono text-base">{formatINR(s.total_compensation)}</span>
                        <span className="text-[9px] text-text-muted font-mono tracking-tighter">₹{s.total_compensation.toLocaleString("en-IN")}</span>
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
