"use client";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Link from "next/link";
import { getSalaries, getCompanies, formatINR, type Salary } from "@/lib/api";
import { LevelBadge } from "@/components/LevelBadge";
import { Search, MapPin, Briefcase, TrendingUp, Database, Building2, ChevronRight, ArrowRight, PlusCircle, Target, Trophy, Info, Sparkles, ShieldCheck, BarChart3, Fingerprint, ArrowUpRight } from "lucide-react";

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

const LOGO_COMPANIES = ["google", "microsoft", "amazon", "razorpay", "flipkart", "swiggy", "zomato", "phonepe", "cred", "meesho"];

function LogoCloud() {
  return (
    <div className="w-full py-12 border-y border-white/5 bg-white/[0.01]">
      <div className="max-w-[1200px] mx-auto px-12">
        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em] text-center mb-8">
          Trusted by engineers from top-tier tech companies
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-10 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
           {LOGO_COMPANIES.map(name => (
             <div key={name} className="flex items-center gap-2">
               <CompanyLogo name={name} />
               <span className="text-sm font-bold text-white lowercase tracking-tighter">
                 {name}
               </span>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}

function LiveBenchmarkDemo() {
  const [val, setVal] = useState(45);
  const [level, setLevel] = useState("L4");

  useEffect(() => {
    const interval = setInterval(() => {
      setVal(prev => (prev > 85 ? 40 : prev + 1));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel p-8 shadow-glow-indigo animate-fade-in space-y-6 relative overflow-hidden group">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 blur-[60px] rounded-full group-hover:bg-indigo-500/20 transition-all duration-700" />
      
      <div className="space-y-1 relative z-10">
        <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
           <Sparkles size={12} className="animate-pulse" /> Live Benchmark Demo
        </div>
        <h4 className="text-white font-bold text-lg">See where you stand</h4>
      </div>

      <div className="space-y-5 relative z-10">
        <div className="grid grid-cols-2 gap-4">
           <div className="space-y-2">
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Target Level</span>
              <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-bold">
                 {level}
              </div>
           </div>
           <div className="space-y-2">
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Total Comp</span>
              <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-mono font-bold">
                 ₹{val}L
              </div>
           </div>
        </div>

        <div className="space-y-3 pt-2">
           <div className="flex justify-between items-end">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Percentile Rank</span>
              <span className="text-2xl font-bold text-indigo-400 font-mono">{(val * 1.8).toFixed(1)}%</span>
           </div>
           <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-300 ease-out"
                style={{ width: `${Math.min(val * 1.8, 100)}%` }}
              />
           </div>
        </div>

        <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 space-y-2">
           <p className="text-[11px] text-gray-300 font-medium">
             You are earning more than <span className="text-white font-bold">{(val * 1.8).toFixed(0)}%</span> of engineers at this level in India.
           </p>
           <div className="flex gap-4 pt-2 border-t border-indigo-500/10">
              <div className="space-y-0.5">
                <p className="text-[8px] text-gray-500 uppercase font-bold">Market Median</p>
                <p className="text-[10px] text-white font-bold">₹38.5L</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-[8px] text-gray-500 uppercase font-bold">Top 10%</p>
                <p className="text-[10px] text-emerald-400 font-bold">₹72.0L</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function FeatureSection() {
  const features = [
    {
      title: "Global Intelligence",
      desc: "Access a verified dataset of 5,000+ records across top product companies in India.",
      icon: Database,
      color: "text-blue-400",
      bg: "bg-blue-400/5",
    },
    {
      title: "Company Deep-Dives",
      desc: "Analyze level-wise compensation structures for firms like Swiggy, Cred, and Razorpay.",
      icon: BarChart3,
      color: "text-emerald-400",
      bg: "bg-emerald-400/5",
    },
    {
      title: "Precise Benchmarking",
      desc: "Understand exactly where you sit in the market with percentile-based distribution analysis.",
      icon: Target,
      color: "text-indigo-400",
      bg: "bg-indigo-400/5",
    }
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12">
      {features.map(f => (
        <div key={f.title} className="glass-panel p-8 space-y-6 group hover:border-white/10 transition-all duration-500">
           <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center ${f.color} group-hover:scale-110 transition-transform duration-500`}>
             <f.icon size={24} />
           </div>
           <div className="space-y-3">
             <h4 className="text-white font-bold text-lg">{f.title}</h4>
             <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
           </div>
           <div className="pt-4 flex items-center gap-2 text-[10px] font-bold text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
             Explore Feature <ArrowUpRight size={14} />
           </div>
        </div>
      ))}
    </section>
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
      .then(res => setCompanies(res.data))
      .catch(console.error);
  }, []);

  const setFilter = (key: string, val: string) =>
    setFilters((prev) => ({ ...prev, [key]: val }));

  return (
    <div className="min-h-screen bg-mesh relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-grid-premium animate-grid pointer-events-none opacity-40" />
      
      <div className="max-w-[1200px] mx-auto px-12 pt-6 pb-12 space-y-12 relative z-10 animate-fade-in">

        {/* 2-Column Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start pt-8 pb-16">
          
          {/* Left: Content */}
          <section className="lg:col-span-7 space-y-8 pt-4">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/[0.03] border border-white/10 rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                 <Fingerprint size={12} className="text-indigo-400" /> Verified Market Data
              </div>
              <h1 className="text-5xl sm:text-7xl font-extrabold leading-[1.05] tracking-tight text-white font-display">
                See what top engineers <br />
                <span className="text-gradient-indigo">ACTUALLY</span> earn.
              </h1>
              <p className="text-gray-400 text-lg sm:text-2xl max-w-xl leading-relaxed font-medium">
                The definitive compensation platform for India's tech ecosystem. Real data. Real levels. Total transparency.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={scrollToTable}
                className="w-full sm:w-auto px-10 py-4 rounded-xl font-bold text-base text-white bg-indigo-500 hover:bg-indigo-400 transition-all active:scale-[0.98] shadow-2xl shadow-indigo-500/20 flex items-center justify-center gap-2 group"
              >
                Browse Salaries <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <Link 
                href="/compare"
                className="w-full sm:w-auto px-10 py-4 rounded-xl font-bold text-base text-gray-300 border border-white/5 hover:bg-white/5 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                Compare Your Salary <ChevronRight size={18} />
              </Link>
            </div>

            <div className="flex items-center gap-12 pt-6">
              <div className="flex -space-x-3">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="w-10 h-10 rounded-full border-2 border-bg bg-surface-muted flex items-center justify-center text-[10px] font-bold text-white">
                      {String.fromCharCode(64 + i)}
                   </div>
                 ))}
                 <div className="w-10 h-10 rounded-full border-2 border-bg bg-indigo-500 flex items-center justify-center text-[10px] font-bold text-white">
                    +5k
                 </div>
              </div>
              <p className="text-sm text-gray-500 font-medium">
                Joined by <span className="text-white font-bold">5,000+</span> engineers <br />
                sharing verified compensation data.
              </p>
            </div>
          </section>

          {/* Right: Live Interactive Demo */}
          <div className="lg:col-span-5 relative">
             <LiveBenchmarkDemo />
             {/* Decorative Background Elements */}
             <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-500/5 blur-[100px] pointer-events-none" />
          </div>
        </div>

        {/* Social Proof Logo Cloud */}
        <LogoCloud />

        {/* Feature Intelligence Section */}
        <section className="py-12 space-y-12">
          <div className="text-center space-y-4">
             <h2 className="text-3xl sm:text-5xl font-bold text-white font-display tracking-tight">Market Intelligence, Simplified.</h2>
             <p className="text-gray-500 text-lg max-w-2xl mx-auto">From raw data entries to company-wide benchmarks, we give you the tools to negotiate with authority.</p>
          </div>
          <FeatureSection />
        </section>

        {/* Data Table Section */}
        <section ref={tableRef} className="space-y-8 pt-20 border-t border-white/5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-4">
            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-emerald-400/10 border border-emerald-400/20 rounded text-[9px] font-bold text-emerald-400 uppercase tracking-widest">
                 <ShieldCheck size={10} /> Verified Data
              </div>
              <h2 className="text-white font-bold text-3xl tracking-tight">Raw Intelligence</h2>
              <p className="text-gray-500 text-base font-medium">Recent verified compensation entries across the ecosystem.</p>
            </div>
            <div className="flex items-center gap-4 glass-panel px-6 py-4">
               <div className="text-center border-r border-white/10 pr-6">
                 <div className="text-white font-bold text-2xl font-mono">{meta.total}</div>
                 <div className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Records</div>
               </div>
               <div className="text-center">
                 <div className="text-white font-bold text-2xl font-mono">{salaries.length > 0 ? formatINR(Math.max(...salaries.map(s => s.total_compensation))) : "—"}</div>
                 <div className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Max TC</div>
               </div>
            </div>
          </div>

          {/* Table Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-2 glass-panel">
            <div className="sm:col-span-1 flex items-center gap-3 px-4 rounded-xl bg-white/[0.02] border border-white/5 focus-within:border-indigo-500/30 transition-all">
              <Search size={16} className="text-gray-600" />
              <input
                type="text"
                placeholder="Search company..."
                className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-gray-700 font-medium"
                value={filters.company}
                onChange={(e) => setFilter("company", e.target.value)}
              />
            </div>
            <div className="sm:col-span-1 flex items-center gap-3 px-4 rounded-xl bg-white/[0.02] border border-white/5 focus-within:border-indigo-500/30 transition-all">
              <Briefcase size={16} className="text-gray-600" />
              <input
                type="text"
                placeholder="Search role..."
                className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-gray-700 font-medium"
                value={filters.role}
                onChange={(e) => setFilter("role", e.target.value)}
              />
            </div>
            <select
              className="px-4 py-3 rounded-xl bg-white/[0.02] border border-white/5 text-sm text-gray-400 outline-none focus:border-indigo-500/30 appearance-none font-medium cursor-pointer"
              value={filters.level}
              onChange={(e) => setFilter("level", e.target.value)}
            >
              <option value="">All Levels</option>
              {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <select
              className="px-4 py-3 rounded-xl bg-white/[0.02] border border-white/5 text-sm text-gray-400 outline-none focus:border-indigo-500/30 appearance-none font-medium cursor-pointer"
              value={filters.location}
              onChange={(e) => setFilter("location", e.target.value)}
            >
              <option value="">All Locations</option>
              {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          {/* Table */}
          <div className="glass-panel overflow-hidden">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/5">
                  {["Company", "Role", "Level", "Location", "Exp", "Base", "Bonus", "Stock", "Total"].map(h => (
                    <th key={h} className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {salaries.map((s) => (
                  <tr key={s.id} className="hover:bg-white/[0.03] transition-all duration-300 group cursor-pointer">
                    <td className="px-6 py-5">
                      <Link href={`/company/${s.company}`} className="flex items-center gap-3">
                        <CompanyLogo name={s.company} />
                        <span className="font-bold text-white group-hover:text-indigo-400 transition-colors">
                          {s.company.charAt(0).toUpperCase() + s.company.slice(1)}
                        </span>
                      </Link>
                    </td>
                    <td className="px-6 py-5 text-gray-400 font-medium">{s.role}</td>
                    <td className="px-6 py-5"><LevelBadge level={s.level} /></td>
                    <td className="px-6 py-5 text-gray-500 text-xs">
                      <div className="flex items-center gap-2 font-semibold">
                        <MapPin size={12} className="text-gray-700" /> {s.location}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-gray-400 font-mono text-xs">{s.experience_years}y</td>
                    <td className="px-6 py-5 text-gray-400 font-mono text-xs text-right">{formatINR(s.base_salary)}</td>
                    <td className="px-6 py-5 text-gray-400 font-mono text-xs text-right">{s.bonus > 0 ? formatINR(s.bonus) : "—"}</td>
                    <td className="px-6 py-5 text-gray-400 font-mono text-xs text-right">{s.stock > 0 ? formatINR(s.stock) : "—"}</td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="font-bold font-mono text-sm text-indigo-400">
                          {formatINR(s.total_compensation)}
                        </span>
                        <ArrowUpRight size={12} className="text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
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
