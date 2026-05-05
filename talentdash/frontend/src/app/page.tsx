"use client";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Link from "next/link";
import { getSalaries, getCompanies, formatINR, type Salary } from "@/lib/api";
import { LevelBadge } from "@/components/LevelBadge";
import { Search, MapPin, Briefcase, TrendingUp, Database, Building2, ChevronRight, ArrowRight } from "lucide-react";

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

  return (
    <div className="min-h-screen" style={{ background: "#0a0a0a" }}>
      <div className="max-w-5xl mx-auto px-8 py-16 space-y-16 animate-fade-in">

        {/* Hero Section */}
        <section className="text-center space-y-6 pt-8">
          <h1 className="text-[64px] font-extrabold leading-[1.1] tracking-tight text-white font-display">
            Know what{" "}
            <span style={{ color: "#818cf8" }}>engineers</span>
            {" "}actually make
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
            Structured by level. Comparable by design. Real TC breakdowns<br />
            — not vague ranges — for India's tech ecosystem.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={scrollToTable}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ background: "#6366f1" }}
            >
              Browse Salaries <ArrowRight size={16} />
            </button>
            <button className="px-6 py-3 rounded-lg font-semibold text-gray-300 hover:text-white transition-colors">
              Submit Your Salary
            </button>
          </div>

          {/* Stat Pills */}
          <div className="flex items-center justify-center gap-4 pt-4">
            {[
              { value: `${meta.total || "39"}+`, label: "Salary records" },
              { value: "L3 → L8", label: "Level system" },
              { value: "3-part", label: "TC breakdown" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="px-5 py-3 rounded-xl text-center border"
                style={{ background: "#141414", borderColor: "#2a2a2a" }}
              >
                <div className="text-white font-bold text-lg">{stat.value}</div>
                <div className="text-gray-500 text-xs mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Browse by Company */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-bold text-lg">Browse by company</h2>
            <Link
              href="/company"
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
            >
              View all <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {companies.length === 0
              ? [...Array(8)].map((_, i) => (
                  <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: "#141414" }} />
                ))
              : companies.map((c) => (
                  <Link
                    key={c.company}
                    href={`/company/${c.company}`}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all hover:border-gray-600 group"
                    style={{ background: "#111111", borderColor: "#222222" }}
                  >
                    <CompanyInitial name={c.company} />
                    <div className="min-w-0">
                      <div className="text-white font-semibold text-sm truncate group-hover:text-indigo-400 transition-colors">
                        {c.company.charAt(0).toUpperCase() + c.company.slice(1)}
                      </div>
                      <div className="text-gray-500 text-xs">{c.count} records</div>
                    </div>
                  </Link>
                ))}
          </div>
        </section>

        {/* Salary Table (shown on Browse click or by default) */}
        <section ref={tableRef} className="space-y-4 pt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-bold text-lg">All Salary Records</h2>
            <span className="text-gray-500 text-sm">{meta.total} results</span>
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <div className="flex-1 flex items-center gap-2 px-4 rounded-lg border" style={{ background: "#111111", borderColor: "#222222" }}>
              <Search size={14} className="text-gray-500" />
              <input
                type="text"
                placeholder="Company"
                className="w-full bg-transparent py-2.5 text-sm outline-none text-white placeholder:text-gray-600"
                value={filters.company}
                onChange={(e) => setFilter("company", e.target.value)}
              />
            </div>
            <div className="flex-1 flex items-center gap-2 px-4 rounded-lg border" style={{ background: "#111111", borderColor: "#222222" }}>
              <Briefcase size={14} className="text-gray-500" />
              <input
                type="text"
                placeholder="Role"
                className="w-full bg-transparent py-2.5 text-sm outline-none text-white placeholder:text-gray-600"
                value={filters.role}
                onChange={(e) => setFilter("role", e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2.5 rounded-lg border text-sm outline-none text-gray-300 appearance-none"
              style={{ background: "#111111", borderColor: "#222222" }}
              value={filters.level}
              onChange={(e) => setFilter("level", e.target.value)}
            >
              <option value="">All Levels</option>
              {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <select
              className="px-4 py-2.5 rounded-lg border text-sm outline-none text-gray-300 appearance-none"
              style={{ background: "#111111", borderColor: "#222222" }}
              value={filters.location}
              onChange={(e) => setFilter("location", e.target.value)}
            >
              <option value="">All Locations</option>
              {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          {/* Table */}
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: "#1e1e1e" }}>
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr style={{ background: "#111111" }}>
                  {["Company", "Role", "Level", "Location", "Exp", "Base", "Bonus", "Stock/yr", "Total"].map(h => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 border-b" style={{ borderColor: "#1e1e1e" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(6)].map((_, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #1a1a1a" }}>
                      <td colSpan={9} className="px-4 py-4">
                        <div className="h-3 rounded animate-pulse" style={{ background: "#1a1a1a" }} />
                      </td>
                    </tr>
                  ))
                ) : salaries.map((s) => (
                  <tr
                    key={s.id}
                    className="group transition-colors"
                    style={{ borderBottom: "1px solid #1a1a1a" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#111111")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <td className="px-4 py-3">
                      <Link href={`/company/${s.company}`} className="flex items-center gap-2 group/link">
                        <CompanyInitial name={s.company} />
                        <span className="font-semibold text-white group-hover/link:text-indigo-400 transition-colors">
                          {s.company.charAt(0).toUpperCase() + s.company.slice(1)}
                        </span>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-400 max-w-[180px] truncate">{s.role}</td>
                    <td className="px-4 py-3"><LevelBadge level={s.level} /></td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      <div className="flex items-center gap-1">
                        <MapPin size={11} /> {s.location}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">{s.experience_years}y</td>
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs text-right">{formatINR(s.base_salary)}</td>
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs text-right">{s.bonus > 0 ? formatINR(s.bonus) : "—"}</td>
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs text-right">{s.stock > 0 ? formatINR(s.stock) : "—"}</td>
                    <td className="px-4 py-3 text-right">
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
