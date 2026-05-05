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

  useEffect(() => {
    if (!benchmark.tc || isNaN(parseFloat(benchmark.tc))) {
      setPercentile(null);
      return;
    }
    const userTC = parseFloat(benchmark.tc) * 100000;
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
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-[1200px] mx-auto px-12 py-12 space-y-12 animate-fade-in">

        {/* Hero & Benchmark Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left: Hero Content */}
          <section className="lg:col-span-7 space-y-8 pt-2">
            <div className="space-y-4">
              <h1 className="text-[48px] font-bold leading-[1.15] tracking-tight text-white font-display">
                Know what <span className="text-indigo-400">engineers</span><br />
                actually make.
              </h1>
              <p className="text-gray-300 text-lg max-w-md leading-relaxed opacity-90">
                Structured by level. Comparable by design. Real TC breakdowns for India's tech ecosystem.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={scrollToTable}
                className="px-6 py-2.5 rounded-lg font-bold text-sm text-white bg-indigo-500 hover:bg-indigo-400 transition-all active:scale-[0.98] shadow-lg shadow-indigo-500/20"
              >
                Browse Salaries
              </button>
              <Link 
                href="/submit"
                className="px-6 py-2.5 rounded-lg font-bold text-sm text-gray-300 border border-white/10 hover:bg-white/5 transition-all active:scale-[0.98]"
              >
                Submit Salary
              </Link>
            </div>

            <div className="flex items-center gap-10 pt-4 border-t border-white/5">
              {[
                { value: `${meta.total || "500"}+`, label: "Records" },
                { value: "L3 → L8", label: "Levels" },
                { value: "100%", label: "Verified" },
              ].map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <div className="text-white font-bold text-xl tracking-tight">{stat.value}</div>
                  <div className="text-gray-500 text-[10px] uppercase font-bold tracking-[0.15em]">{stat.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Right: Benchmark Card */}
          <div className="lg:col-span-5">
            <div className="bg-[#111] border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/50 space-y-6">
              <div className="space-y-1">
                <h3 className="text-white font-bold text-base flex items-center gap-2">
                  <Trophy size={16} className="text-indigo-400" />
                  Quick Benchmark
                </h3>
                <p className="text-gray-500 text-xs font-medium">Compare your TC with the market.</p>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Level</span>
                    <select 
                      className="w-full bg-[#161616] border border-white/5 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500/30 transition-all"
                      value={benchmark.level}
                      onChange={e => setBenchmark(prev => ({ ...prev, level: e.target.value }))}
                    >
                      {LEVELS.slice(0, 6).map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">TC (Lakhs)</span>
                    <input 
                      type="number" 
                      placeholder="e.g. 24"
                      className="w-full bg-[#161616] border border-white/5 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500/30 transition-all placeholder:text-gray-700"
                      value={benchmark.tc}
                      onChange={e => setBenchmark(prev => ({ ...prev, tc: e.target.value }))}
                    />
                  </div>
                </div>

                {percentile !== null ? (
                  <div className="pt-2 space-y-4 animate-in fade-in slide-in-from-bottom-1 duration-300">
                    <div className="space-y-2.5">
                      <div className="flex justify-between text-[11px] font-bold">
                        <span className="text-gray-500 uppercase tracking-wider">Market Percentile</span>
                        <span className={percentile > 70 ? 'text-emerald-400' : 'text-indigo-400'}>{percentile}%</span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-500 transition-all duration-700 ease-out" 
                          style={{ width: `${percentile}%`, backgroundColor: percentile > 70 ? '#10b981' : '#6366f1' }}
                        />
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex gap-3 items-start">
                       <Info size={14} className="text-gray-400 shrink-0 mt-0.5" />
                       <p className="text-[12px] text-gray-300 leading-normal">
                         You earn more than <span className="font-bold text-white">{percentile}%</span> of {benchmark.level} engineers. 
                         <span className="block mt-1 text-gray-500 text-[11px]">
                           {percentile > 80 ? "Top-tier compensation." : percentile < 30 ? "Room for growth." : "Balanced market pay."}
                         </span>
                       </p>
                    </div>
                  </div>
                ) : (
                  <div className="pt-6 pb-2 text-center opacity-40">
                     <Target size={20} className="mx-auto text-gray-500 mb-2" />
                     <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Enter details to see rank</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Company Grid Section */}
        <section className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-white font-bold text-xl tracking-tight">Market Coverage</h2>
              <p className="text-gray-500 text-sm font-medium">Real data from 47 top-tier firms.</p>
            </div>
            <Link href="/company" className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-white transition-all uppercase tracking-widest">
              View all <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {companies.map((c) => (
              <Link
                key={c.company}
                href={`/company/${c.company}`}
                className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-[#111] border border-white/5 hover:border-white/10 hover:bg-[#141414] transition-all group"
              >
                <CompanyInitial name={c.company} />
                <div className="min-w-0">
                  <div className="text-white font-bold text-sm truncate group-hover:text-indigo-400 transition-colors">
                    {c.company.charAt(0).toUpperCase() + c.company.slice(1)}
                  </div>
                  <div className="text-gray-500 text-[11px] font-medium">{c.count} records</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Data Table Section */}
        <section ref={tableRef} className="space-y-6 pt-8">
          <div className="flex items-center justify-between border-b border-white/5 pb-6">
            <div className="space-y-1">
              <h2 className="text-white font-bold text-xl tracking-tight">Raw Intelligence</h2>
              <p className="text-gray-500 text-sm font-medium">Recent verified compensation entries.</p>
            </div>
            <div className="text-right">
              <div className="text-white font-bold text-xl font-mono">{meta.total}</div>
              <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Data Points</div>
            </div>
          </div>

          {/* Table Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-1 flex items-center gap-2 px-4 rounded-xl bg-[#111] border border-white/5 focus-within:border-indigo-500/30 transition-all">
              <Search size={14} className="text-gray-600" />
              <input
                type="text"
                placeholder="Company"
                className="w-full bg-transparent py-2.5 text-sm text-white outline-none placeholder:text-gray-700"
                value={filters.company}
                onChange={(e) => setFilter("company", e.target.value)}
              />
            </div>
            <div className="sm:col-span-1 flex items-center gap-2 px-4 rounded-xl bg-[#111] border border-white/5 focus-within:border-indigo-500/30 transition-all">
              <Briefcase size={14} className="text-gray-600" />
              <input
                type="text"
                placeholder="Role"
                className="w-full bg-transparent py-2.5 text-sm text-white outline-none placeholder:text-gray-700"
                value={filters.role}
                onChange={(e) => setFilter("role", e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2.5 rounded-xl bg-[#111] border border-white/5 text-sm text-gray-400 outline-none focus:border-indigo-500/30 appearance-none"
              value={filters.level}
              onChange={(e) => setFilter("level", e.target.value)}
            >
              <option value="">All Levels</option>
              {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <select
              className="px-4 py-2.5 rounded-xl bg-[#111] border border-white/5 text-sm text-gray-400 outline-none focus:border-indigo-500/30 appearance-none"
              value={filters.location}
              onChange={(e) => setFilter("location", e.target.value)}
            >
              <option value="">All Locations</option>
              {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-white/5 overflow-hidden bg-[#0d0d0d]">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-[#111] border-b border-white/5">
                  {["Company", "Role", "Level", "Location", "Exp", "Base", "Bonus", "Stock", "Total"].map(h => (
                    <th key={h} className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {salaries.map((s) => (
                  <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <Link href={`/company/${s.company}`} className="flex items-center gap-3 group">
                        <CompanyInitial name={s.company} />
                        <span className="font-bold text-white group-hover:text-indigo-400 transition-colors">
                          {s.company.charAt(0).toUpperCase() + s.company.slice(1)}
                        </span>
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-gray-400 max-w-[140px] truncate">{s.role}</td>
                    <td className="px-5 py-4"><LevelBadge level={s.level} /></td>
                    <td className="px-5 py-4 text-gray-500 text-xs">
                      <div className="flex items-center gap-1.5 font-medium">
                        <MapPin size={12} className="text-gray-700" /> {s.location}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-400 font-mono text-xs">{s.experience_years}y</td>
                    <td className="px-5 py-4 text-gray-400 font-mono text-xs text-right">{formatINR(s.base_salary)}</td>
                    <td className="px-5 py-4 text-gray-400 font-mono text-xs text-right">{s.bonus > 0 ? formatINR(s.bonus) : "—"}</td>
                    <td className="px-5 py-4 text-gray-400 font-mono text-xs text-right">{s.stock > 0 ? formatINR(s.stock) : "—"}</td>
                    <td className="px-5 py-4 text-right">
                      <span className="font-bold font-mono text-sm text-indigo-400">
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
