"use client";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Link from "next/link";
import { getSalaries, getCompanies, getBenchmark, formatINR, type Salary, type BenchmarkResponse } from "@/lib/api";
import { LevelBadge } from "@/components/LevelBadge";
import { Search, MapPin, Briefcase, TrendingUp, Database, Building2, ChevronRight, ArrowRight, PlusCircle, Target, Trophy, Info } from "lucide-react";

const LEVELS = ["L3","L4","L5","L6","L7","SDE1","SDE2","SDE3","Senior","Staff","Principal","E3","E4","E5","E6","E7","Director"];
const LOCATIONS = ["Bangalore", "Hyderabad", "Pune", "Remote", "Gurgaon"];

const COMPANY_DOMAINS: Record<string, string> = {
  google: "google.com", microsoft: "microsoft.com", amazon: "amazon.com", meta: "meta.com",
  flipkart: "flipkart.com", swiggy: "swiggy.com", razorpay: "razorpay.com", zepto: "zepto.com",
  meesho: "meesho.com", phonepe: "phonepe.com", cred: "cred.club", groww: "groww.in",
  zomato: "zomato.com", paytm: "paytm.com", infosys: "infosys.com", wipro: "wipro.com",
  tcs: "tcs.com", hcl: "hcltech.com", netflix: "netflix.com", uber: "uber.com",
  ola: "olacabs.com", byju: "byjus.com", unacademy: "unacademy.com", atlassian: "atlassian.com",
  salesforce: "salesforce.com", stripe: "stripe.com", nvidia: "nvidia.com", adobe: "adobe.com",
  postman: "postman.com", browserstack: "browserstack.com", coinbase: "coinbase.com",
  intuit: "intuit.com", walmart: "walmart.com", cisco: "cisco.com", vmware: "vmware.com",
  servicenow: "servicenow.com", paypal: "paypal.com", zoho: "zoho.com",
  freshworks: "freshworks.com", accenture: "accenture.com", cognizant: "cognizant.com",
  thoughtworks: "thoughtworks.com", "goldman sachs": "goldmansachs.com", "morgan stanley": "morganstanley.com"
};

const COMPANY_COLORS: Record<string, string> = {
  google: "#4285F4", microsoft: "#00A4EF", amazon: "#FF9900", meta: "#0866FF",
  flipkart: "#F9A825", swiggy: "#FC8019", razorpay: "#2D81FF", zepto: "#9C27B0",
  meesho: "#F43B96", phonepe: "#5F259F", cred: "#1A1A1A", groww: "#00D09C",
  zomato: "#E23744", paytm: "#00BAF2",
};

function CompanyLogo({ name }: { name: string }) {
  const [error, setError] = useState(false);
  const domain = COMPANY_DOMAINS[name.toLowerCase()];
  
  // Generate a consistent color based on the name
  const getDynamicColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = hash % 360;
    return `hsl(${h}, 70%, 45%)`;
  };

  const color = COMPANY_COLORS[name.toLowerCase()] || getDynamicColor(name);

  if (domain && !error) {
    return (
      <div className="w-8 h-8 rounded-lg bg-white overflow-hidden flex items-center justify-center border border-white/10 flex-shrink-0 shadow-sm">
        <img 
          src={`https://logo.clearbit.com/${domain}`} 
          alt={name}
          className="w-6 h-6 object-contain"
          onError={() => setError(true)}
        />
      </div>
    );
  }

  return (
    <div
      className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm"
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
      .then(res => setCompanies(res.data))
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

  const [benchmarkResult, setBenchmarkResult] = useState<BenchmarkResponse | null>(null);

  useEffect(() => {
    if (!benchmark.tc || isNaN(parseFloat(benchmark.tc)) || parseFloat(benchmark.tc) <= 0) {
      setBenchmarkResult(null);
      return;
    }
    const t = setTimeout(() => {
      getBenchmark(benchmark.tc, benchmark.level)
        .then(setBenchmarkResult)
        .catch(() => setBenchmarkResult(null));
    }, 500);
    return () => clearTimeout(t);
  }, [benchmark.tc, benchmark.level]);

  const getInsight = (p: number) => {
    if (p >= 95) return { text: `Top 5% compensation at ${benchmark.level}`, color: "text-emerald-400", sub: "Exceptional market positioning." };
    if (p >= 75) return { text: `Above ${p}% of ${benchmark.level} engineers`, color: "text-indigo-400", sub: "Strong market standing." };
    if (p >= 40) return { text: "Around market average", color: "text-gray-300", sub: "Aligned with most peers." };
    return { text: "Below market median", color: "text-amber-400", sub: "High potential for salary growth." };
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-[1200px] mx-auto px-12 py-12 space-y-12 animate-fade-in">

        {/* Hero & Benchmark Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left: Hero Content */}
          <section className="lg:col-span-7 space-y-8 pt-2">
            <div className="space-y-5">
              <h1 className="text-[42px] sm:text-[48px] font-semibold leading-[1.1] tracking-tight text-white font-display max-w-2xl">
                Understand what <span className="text-indigo-400">engineers</span> are really paid.
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
                <p className="text-gray-500 text-xs font-medium">Professional market intelligence engine.</p>
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
                      {LEVELS.slice(0, 10).map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Your TC (Lakhs)</span>
                    <input 
                      type="number" 
                      placeholder="e.g. 24"
                      className="w-full bg-[#161616] border border-white/5 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500/30 transition-all placeholder:text-gray-700"
                      value={benchmark.tc}
                      onChange={e => setBenchmark(prev => ({ ...prev, tc: e.target.value }))}
                    />
                  </div>
                </div>

                {benchmarkResult ? (
                  <div className="pt-2 space-y-6 animate-in fade-in slide-in-from-bottom-1 duration-300">
                    {benchmarkResult.error ? (
                      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex gap-3">
                         <Info size={16} className="text-amber-500 shrink-0 mt-0.5" />
                         <p className="text-xs text-amber-200 leading-normal">{benchmarkResult.message}</p>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-3">
                          <div className="flex justify-between text-[11px] font-bold">
                            <span className="text-gray-500 uppercase tracking-wider">Market Rank</span>
                            <span className={benchmarkResult.percentile > 70 ? 'text-emerald-400' : 'text-indigo-400'}>
                              {benchmarkResult.percentile === 99 ? "Top 1%" : `${benchmarkResult.percentile}th Percentile`}
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-indigo-500 transition-all duration-1000 ease-out" 
                              style={{ width: `${benchmarkResult.percentile}%`, backgroundColor: benchmarkResult.percentile > 70 ? '#10b981' : '#6366f1' }}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-2">
                           <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-3">
                              <div className="space-y-1">
                                <p className={`text-sm font-bold ${getInsight(benchmarkResult.percentile).color}`}>
                                  {getInsight(benchmarkResult.percentile).text}
                                </p>
                                <p className="text-[11px] text-gray-500 font-medium">
                                  {getInsight(benchmarkResult.percentile).sub}
                                </p>
                              </div>
                              
                              <div className="pt-3 border-t border-white/5 grid grid-cols-3 gap-2">
                                <div className="space-y-1">
                                  <p className="text-[9px] text-gray-600 uppercase font-bold tracking-tighter">Median</p>
                                  <p className="text-[12px] text-white font-mono font-bold">{formatINR(benchmarkResult.metrics.p50)}</p>
                                </div>
                                <div className="space-y-1 border-x border-white/5 px-2">
                                  <p className="text-[9px] text-gray-600 uppercase font-bold tracking-tighter">Top 25%</p>
                                  <p className="text-[12px] text-white font-mono font-bold">{formatINR(benchmarkResult.metrics.p75)}</p>
                                </div>
                                <div className="space-y-1 pl-2">
                                  <p className="text-[9px] text-gray-600 uppercase font-bold tracking-tighter">Top 10%</p>
                                  <p className="text-[12px] text-white font-mono font-bold">{formatINR(benchmarkResult.metrics.p90)}</p>
                                </div>
                              </div>
                           </div>
                        </div>
                      </>
                    )}
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
                        <CompanyLogo name={s.company} />
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
