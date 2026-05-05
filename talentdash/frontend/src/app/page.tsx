"use client";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Link from "next/link";
import { getSalaries, getCompanies, formatINR, type Salary } from "@/lib/api";
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
        <div className="flex flex-col items-center text-center pt-8 pb-20 relative">
          {/* Subtle Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/5 blur-[120px] pointer-events-none" />

          {/* Hero Content */}
          <section className="space-y-5 max-w-4xl relative z-10">
            <div className="space-y-3">
              <h1 className="text-5xl sm:text-6xl font-bold leading-[1.05] tracking-tight text-white font-display px-4">
                Understand what <span className="text-indigo-400">engineers</span> <br className="hidden sm:block" /> are really paid.
              </h1>
              <p className="text-gray-400 text-lg sm:text-xl max-w-xl mx-auto leading-relaxed px-6 opacity-75">
                Structured by level. Comparable by design. The most accurate real-time compensation breakdowns for India's tech ecosystem.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
              <button
                onClick={scrollToTable}
                className="w-full sm:w-auto px-10 py-3 rounded-xl font-bold text-sm text-white bg-indigo-500 hover:bg-indigo-400 transition-all active:scale-[0.98] shadow-xl shadow-indigo-500/10"
              >
                Browse Salaries
              </button>
              <Link 
                href="/submit"
                className="w-full sm:w-auto px-10 py-3 rounded-xl font-bold text-sm text-gray-300 border border-white/5 hover:bg-white/5 transition-all active:scale-[0.98]"
              >
                Submit Salary
              </Link>
            </div>

            <div className="flex items-center justify-center gap-12 sm:gap-24 pt-6 mt-6 border-t border-white/5">
              {[
                { value: `${meta.total || "500"}+`, label: "Records" },
                { value: "L3 → L8", label: "Levels" },
                { value: "Verified", label: "Market Data" },
              ].map((stat) => (
                <div key={stat.label} className="space-y-0.5">
                  <div className="text-white font-bold text-2xl sm:text-3xl tracking-tight leading-none">{stat.value}</div>
                  <div className="text-gray-600 text-[10px] uppercase font-bold tracking-[0.25em]">{stat.label}</div>
                </div>
              ))}
            </div>
          </section>
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
