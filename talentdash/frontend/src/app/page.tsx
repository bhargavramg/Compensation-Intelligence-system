"use client";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Link from "next/link";
import { getSalaries, getCompanies, formatINR, type Salary } from "@/lib/api";
import { LevelBadge } from "@/components/LevelBadge";
import { Search, MapPin, Briefcase, TrendingUp, Database, Building2, ChevronRight, ArrowRight, PlusCircle, Target, Trophy, Info } from "lucide-react";

const LEVELS = ["L3","L4","L5","L6","L7","SDE1","SDE2","SDE3","Senior","Staff","Principal","E3","E4","E5","E6","E7","Director"];
const LOCATIONS = ["Bangalore", "Hyderabad", "Pune", "Remote", "Gurgaon"];

const COMPANY_COLORS: Record<string, string> = {
  google: "#4285F4", microsoft: "#00A4EF", amazon: "#FF9900", meta: "#0866FF",
  flipkart: "#F9A825", swiggy: "#FC8019", razorpay: "#2D81FF", zepto: "#9C27B0",
  meesho: "#F43B96", phonepe: "#5F259F", cred: "#1A1A1A", groww: "#00D09C",
  zomato: "#E23744", paytm: "#00BAF2", infosys: "#0070C0", wipro: "#344899",
  tcs: "#C00000", hcl: "#0076C0", netflix: "#E50914", uber: "#000000",
  ola: "#343434", byju: "#00A0E3", unacademy: "#08BD80", atlassian: "#0052CC",
  salesforce: "#00A1E0",
};

function CompanyInitial({ name }: { name: string }) {
  const color = COMPANY_COLORS[name.toLowerCase()] || "#10b981";
  return (
    <div
      className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
      style={{ backgroundColor: color }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

export default function SalariesPage() {
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [companies, setCompanies] = useState<{ company: string; count: number; avg_compensation: number }[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ company: "", role: "", level: "", location: "" });
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const tableRef = useRef<HTMLElement>(null);

  // Benchmarking state
  const [benchmark, setBenchmark] = useState({ level: "L4", tc: "" });
  const [percentile, setPercentile] = useState<number | null>(null);

  const scrollToTable = () => {
    tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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

  useEffect(() => {
    getCompanies()
      .then(res => setCompanies(res.data.slice(0, 8)))
      .catch(console.error);
  }, []);

  const setFilter = (key: string, val: string) =>
    setFilters((prev) => ({ ...prev, [key]: val }));

  const stats = useMemo(() => {
    if (salaries.length === 0) return { median: 0, p90: 0, companies: 0 };
    const sorted = [...salaries].sort((a, b) => a.total_compensation - b.total_compensation);
    const median = sorted[Math.floor(sorted.length / 2)].total_compensation;
    const p90 = sorted[Math.floor(sorted.length * 0.9)]?.total_compensation || median;
    const uniqueCompanies = new Set(salaries.map(s => s.company)).size;
    return { median, p90, companies: uniqueCompanies };
  }, [salaries]);

  // Benchmarking logic
  useEffect(() => {
    if (!benchmark.tc || isNaN(parseFloat(benchmark.tc))) {
      setPercentile(null);
      return;
    }
    const userTC = parseFloat(benchmark.tc) * 100000; // Assuming input in Lakhs
    const relevantSalaries = salaries.filter(s => s.level === benchmark.level);
    if (relevantSalaries.length === 0) {
      setPercentile(null);
      return;
    }
    const countLower = relevantSalaries.filter(s => s.total_compensation <= userTC).length;
    const p = (countLower / relevantSalaries.length) * 100;
    setPercentile(Math.round(p));
  }, [benchmark, salaries]);

  return (
    <div className="min-h-screen pb-20" style={{ background: "#0a0a0a" }}>
      <div className="max-w-5xl mx-auto px-8 py-16 space-y-24 animate-fade-in">

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center pt-8">
          <section className="lg:col-span-3 space-y-8">
            <div className="space-y-6">
              <h1 className="text-[64px] font-extrabold leading-[1.1] tracking-tight text-white font-display">
                Know what{" "}
                <span style={{ color: "#818cf8" }}>engineers</span>
                {" "}actually make
              </h1>
              <p className="text-gray-400 text-lg max-w-xl leading-relaxed">
                Structured by level. Comparable by design. Real TC breakdowns
                — not vague ranges — for India's tech ecosystem.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={scrollToTable}
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ background: "#6366f1" }}
              >
                Browse Salaries <ArrowRight size={16} />
              </button>
              <Link 
                href="/submit"
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all hover:bg-white/10 active:scale-[0.98] border border-white/10"
              >
                <PlusCircle size={16} /> Submit Salary
              </Link>
            </div>

            <div className="flex items-center gap-6 pt-4">
              {[
                { value: `${meta.total || "72"}+`, label: "Records" },
                { value: "L3 → L8", label: "Levels" },
                { value: "100%", label: "Verified" },
              ].map((stat) => (
                <div key={stat.label} className="space-y-0.5">
                  <div className="text-white font-bold text-xl">{stat.value}</div>
                  <div className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Inventive Benchmarking Widget */}
          <div className="lg:col-span-2">
            <div className="glass-card p-8 rounded-3xl border relative overflow-hidden group" style={{ background: "#111", borderColor: "#222" }}>
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <Target size={120} className="text-indigo-500" />
              </div>
              
              <div className="relative space-y-6">
                <div className="space-y-1">
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <Trophy size={18} className="text-yellow-500" />
                    Quick Benchmark
                  </h3>
                  <p className="text-gray-500 text-xs">See where you stand in the current market.</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Level</span>
                      <select 
                        className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-indigo-500/50"
                        value={benchmark.level}
                        onChange={e => setBenchmark(prev => ({ ...prev, level: e.target.value }))}
                      >
                        {LEVELS.slice(0, 6).map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Your TC (Lakhs)</span>
                      <input 
                        type="number" 
                        placeholder="e.g. 24"
                        className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-indigo-500/50 placeholder:text-gray-700"
                        value={benchmark.tc}
                        onChange={e => setBenchmark(prev => ({ ...prev, tc: e.target.value }))}
                      />
                    </div>
                  </div>

                  {percentile !== null ? (
                    <div className="pt-4 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                          <span className="text-gray-500">Market Percentile</span>
                          <span className={percentile > 70 ? 'text-emerald-400' : 'text-indigo-400'}>{percentile}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#1a1a1a] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-500 transition-all duration-1000 ease-out" 
                            style={{ width: `${percentile}%`, backgroundColor: percentile > 70 ? '#10b981' : '#6366f1' }}
                          />
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex gap-3">
                         <Info size={14} className="text-indigo-400 shrink-0 mt-0.5" />
                         <p className="text-[11px] text-indigo-200 leading-relaxed">
                           You earn more than <span className="font-bold">{percentile}%</span> of {benchmark.level} engineers in our database. 
                           {percentile > 80 ? " You are in the top bracket!" : percentile < 30 ? " You might be underpaid." : " You are within market average."}
                         </p>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-8 text-center space-y-2 opacity-30">
                       <Target size={24} className="mx-auto text-gray-500" />
                       <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Enter data to benchmark</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Browse by Company */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-white font-bold text-xl tracking-tight">Browse by company</h2>
              <p className="text-gray-500 text-sm">Explore compensation structures at top tech firms.</p>
            </div>
            <Link
              href="/company"
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
            >
              View all <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {companies.length === 0
              ? [...Array(8)].map((_, i) => (
                  <div key={i} className="h-20 rounded-2xl animate-pulse" style={{ background: "#111" }} />
                ))
              : companies.map((c) => (
                  <Link
                    key={c.company}
                    href={`/company/${c.company}`}
                    className="flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all hover:border-indigo-500/50 hover:bg-[#141414] group"
                    style={{ background: "#111", borderColor: "#222" }}
                  >
                    <CompanyInitial name={c.company} />
                    <div className="min-w-0">
                      <div className="text-white font-bold text-sm truncate group-hover:text-indigo-400 transition-colors">
                        {c.company.charAt(0).toUpperCase() + c.company.slice(1)}
                      </div>
                      <div className="text-gray-500 text-[11px] font-medium">{c.count} verified records</div>
                    </div>
                  </Link>
                ))}
          </div>
        </section>

        {/* Salary Table */}
        <section ref={tableRef} className="space-y-6 pt-12">
          <div className="flex items-center justify-between border-b border-[#1a1a1a] pb-6">
            <div className="space-y-1">
              <h2 className="text-white font-bold text-xl tracking-tight">Market Intelligence</h2>
              <p className="text-gray-500 text-sm">Real-time compensation data from the community.</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-white font-mono font-bold text-lg">{meta.total}</span>
              <span className="text-[10px] text-gray-600 uppercase font-bold tracking-widest">Total Records</span>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="flex-[2] min-w-[200px] flex items-center gap-2 px-4 rounded-xl border transition-all focus-within:border-indigo-500/50" style={{ background: "#111", borderColor: "#222" }}>
              <Search size={14} className="text-gray-600" />
              <input
                type="text"
                placeholder="Search company..."
                className="w-full bg-transparent py-3 text-sm outline-none text-white placeholder:text-gray-700"
                value={filters.company}
                onChange={(e) => setFilter("company", e.target.value)}
              />
            </div>
            <div className="flex-[1.5] min-w-[150px] flex items-center gap-2 px-4 rounded-xl border transition-all focus-within:border-indigo-500/50" style={{ background: "#111", borderColor: "#222" }}>
              <Briefcase size={14} className="text-gray-600" />
              <input
                type="text"
                placeholder="Role"
                className="w-full bg-transparent py-3 text-sm outline-none text-white placeholder:text-gray-700"
                value={filters.role}
                onChange={(e) => setFilter("role", e.target.value)}
              />
            </div>
            <select
              className="flex-1 px-4 py-3 rounded-xl border text-sm outline-none text-gray-400 appearance-none bg-[#111] border-[#222] focus:border-indigo-500/50"
              value={filters.level}
              onChange={(e) => setFilter("level", e.target.value)}
            >
              <option value="">All Levels</option>
              {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <select
              className="flex-1 px-4 py-3 rounded-xl border text-sm outline-none text-gray-400 appearance-none bg-[#111] border-[#222] focus:border-indigo-500/50"
              value={filters.location}
              onChange={(e) => setFilter("location", e.target.value)}
            >
              <option value="">All Locations</option>
              {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          {/* Table */}
          <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "#1a1a1a" }}>
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr style={{ background: "#111" }}>
                  {["Company", "Role", "Level", "Location", "Exp", "Base", "Bonus", "Stock/yr", "Total"].map(h => (
                    <th key={h} className="px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 border-b" style={{ borderColor: "#1a1a1a" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(6)].map((_, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #141414" }}>
                      <td colSpan={9} className="px-5 py-6">
                        <div className="h-3 rounded-full animate-pulse" style={{ background: "#141414" }} />
                      </td>
                    </tr>
                  ))
                ) : salaries.map((s) => (
                  <tr
                    key={s.id}
                    className="group transition-all hover:bg-[#111]"
                    style={{ borderBottom: "1px solid #141414" }}
                  >
                    <td className="px-5 py-4">
                      <Link href={`/company/${s.company}`} className="flex items-center gap-3 group/link">
                        <CompanyInitial name={s.company} />
                        <span className="font-bold text-white group-hover/link:text-indigo-400 transition-colors">
                          {s.company.charAt(0).toUpperCase() + s.company.slice(1)}
                        </span>
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-gray-400 max-w-[160px] truncate">{s.role}</td>
                    <td className="px-5 py-4"><LevelBadge level={s.level} /></td>
                    <td className="px-5 py-4 text-gray-500 text-[11px] font-medium">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={12} className="text-gray-600" /> {s.location}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-400 font-mono text-xs">{s.experience_years}y</td>
                    <td className="px-5 py-4 text-gray-400 font-mono text-xs text-right">{formatINR(s.base_salary)}</td>
                    <td className="px-5 py-4 text-gray-400 font-mono text-xs text-right">{s.bonus > 0 ? formatINR(s.bonus) : "—"}</td>
                    <td className="px-5 py-4 text-gray-400 font-mono text-xs text-right">{s.stock > 0 ? formatINR(s.stock) : "—"}</td>
                    <td className="px-5 py-4 text-right">
                      <span className="font-bold font-mono text-sm" style={{ color: "#818cf8" }}>
                        {formatINR(s.total_compensation)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  );
}
