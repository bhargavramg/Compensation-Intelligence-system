const getApiUrl = () => {
  const url = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001";
  return url.endsWith("/") ? url.slice(0, -1) : url;
};

const API = getApiUrl();

export interface Salary {
  id: string;
  company: string;
  role: string;
  level: string;
  location: string;
  experience_years: number;
  base_salary: number;
  bonus: number;
  stock: number;
  total_compensation: number;
  confidence_score: number;
  created_at: string;
}

export interface SalaryListResponse {
  data: Salary[];
  meta: { total: number; page: number; limit: number; pages: number };
}

export interface CompanyResponse {
  company: string;
  total_entries: number;
  median_compensation: number;
  level_distribution: { level: string; count: number }[];
  level_averages: { level: string; avg_compensation: number; count: number }[];
  salaries: Salary[];
}

export interface CompareResponse {
  salary1: Salary;
  salary2: Salary;
  diff: {
    base_salary: number;
    bonus: number;
    stock: number;
    total_compensation: number;
    level_diff: number;
    level_direction: string;
  };
}

export async function getSalaries(params: Record<string, string> = {}): Promise<SalaryListResponse> {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${API}/salaries${qs ? `?${qs}` : ""}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch salaries");
  return res.json();
}

export async function getCompany(company: string): Promise<CompanyResponse> {
  const res = await fetch(`${API}/company/${encodeURIComponent(company)}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Company not found");
  return res.json();
}

export async function getCompare(id1: string, id2: string): Promise<CompareResponse> {
  const res = await fetch(`${API}/compare?salaryId1=${id1}&salaryId2=${id2}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Compare failed");
  return res.json();
}

export async function getCompanies(): Promise<{ data: { company: string; count: number; avg_compensation: number }[] }> {
  const res = await fetch(`${API}/companies`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch companies");
  return res.json();
}

export async function submitSalary(data: any): Promise<any> {
  const res = await fetch(`${API}/ingest-salary`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to submit salary");
  }
  return res.json();
}

export function formatINR(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
}


export function levelColor(level: string): string {
  const map: Record<string, string> = {
    L3: "#6ee7b7", SDE1: "#6ee7b7", IC3: "#6ee7b7", E3: "#6ee7b7",
    L4: "#34d399", SDE2: "#34d399", IC4: "#34d399", E4: "#34d399",
    L5: "#10b981", SDE3: "#10b981", Senior: "#10b981", IC5: "#10b981", E5: "#10b981",
    L6: "#f59e0b", Staff: "#f59e0b", IC6: "#f59e0b", E6: "#f59e0b",
    L7: "#ef4444", Principal: "#ef4444", E7: "#ef4444",
    Director: "#8b5cf6",
  };
  return map[level] || "#94a3b8";
}
