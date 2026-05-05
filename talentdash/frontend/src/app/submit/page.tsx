"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, AlertCircle } from "lucide-react";
import { submitSalary } from "@/lib/api";

const STEPS = ["Company", "Compensation", "Review"];
const LEVELS = ["L3", "L4", "L5", "L6", "L7", "L8"];
const CITIES = ["Bangalore", "Hyderabad", "Pune", "Remote", "Gurgaon", "Mumbai", "Noida", "Chennai"];

export default function SubmitSalaryPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    company: "",
    role: "",
    level_standardized: "L4",
    location: "",
    experience_years: "",
    base_salary: "",
    bonus: "",
    stock: "",
  });

  const updateForm = (key: string, val: any) => setFormData(prev => ({ ...prev, [key]: val }));

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      await submitSalary({
        ...formData,
        experience_years: parseInt(formData.experience_years as string),
        base_salary: parseFloat(formData.base_salary as string),
        bonus: parseFloat(formData.bonus as string || "0"),
        stock: parseFloat(formData.stock as string || "0"),
      });
      setSuccess(true);
      setTimeout(() => router.push("/"), 2000);
    } catch (err: any) {
      setError(err.message || "Failed to submit. Please check your data.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-8">
        <div className="text-center space-y-4 animate-fade-in">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={32} strokeWidth={3} />
          </div>
          <h1 className="text-3xl font-bold text-white">Salary Submitted!</h1>
          <p className="text-gray-400">Thank you for contributing to the community. Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans">
      <div className="max-w-2xl mx-auto px-6 py-12 space-y-12 animate-fade-in">
        
        {/* Header */}
        <div className="space-y-6">
          <Link href="/" className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-white transition-colors">
            <ArrowLeft size={14} /> Back to salaries
          </Link>
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold text-white tracking-tight font-display">Submit your salary</h1>
            <p className="text-gray-500 text-sm">Anonymous • Takes 2 minutes • Helps the community</p>
          </div>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${step === i + 1 ? 'bg-indigo-500 text-white' : 'bg-[#1a1a1a] text-gray-600'}`}>
                {i + 1}
              </div>
              <span className={step === i + 1 ? 'text-white' : 'text-gray-600'}>{s}</span>
              {i < STEPS.length - 1 && <div className="w-12 h-[1px] bg-[#222]" />}
            </div>
          ))}
        </div>

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {/* Step 1: Company & Role */}
        {step === 1 && (
          <div className="space-y-8">
            <div className="p-8 rounded-2xl border bg-[#111] border-[#1e1e1e] space-y-8">
              <div className="space-y-6">
                <label className="block space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Company & Role</span>
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-gray-400 uppercase">Company Name</span>
                      <input 
                        type="text" 
                        placeholder="e.g. Google, Flipkart, Razorpay" 
                        className="w-full bg-[#161616] border border-[#222] rounded-xl px-4 py-3.5 text-sm outline-none focus:border-indigo-500/50 transition-all text-white placeholder:text-gray-700"
                        value={formData.company}
                        onChange={e => updateForm('company', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-gray-400 uppercase">Job Title / Role</span>
                      <input 
                        type="text" 
                        placeholder="e.g. Software Engineer, Data Scientist" 
                        className="w-full bg-[#161616] border border-[#222] rounded-xl px-4 py-3.5 text-sm outline-none focus:border-indigo-500/50 transition-all text-white placeholder:text-gray-700"
                        value={formData.role}
                        onChange={e => updateForm('role', e.target.value)}
                      />
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <div className="p-8 rounded-2xl border bg-[#111] border-[#1e1e1e] space-y-6">
              <div className="space-y-4">
                <span className="text-[11px] font-bold text-gray-400 uppercase">Level</span>
                <div className="flex gap-3">
                  {LEVELS.map(l => (
                    <button 
                      key={l}
                      onClick={() => updateForm('level_standardized', l)}
                      className={`flex-1 py-3 rounded-xl border text-xs font-bold transition-all ${formData.level_standardized === l ? 'bg-white text-black border-white' : 'bg-[#161616] text-gray-500 border-[#222] hover:border-gray-700'}`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-gray-600">Not sure? Pick the level closest to your designation band.</p>
              </div>
            </div>

            <div className="p-8 rounded-2xl border bg-[#111] border-[#1e1e1e] space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-gray-400 uppercase">City</span>
                  <select 
                    className="w-full bg-[#161616] border border-[#222] rounded-xl px-4 py-3.5 text-sm outline-none focus:border-indigo-500/50 appearance-none text-white"
                    value={formData.location}
                    onChange={e => updateForm('location', e.target.value)}
                  >
                    <option value="">Select city</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-gray-400 uppercase">Years of Experience</span>
                  <input 
                    type="number" 
                    placeholder="e.g. 4" 
                    className="w-full bg-[#161616] border border-[#222] rounded-xl px-4 py-3.5 text-sm outline-none focus:border-indigo-500/50 text-white placeholder:text-gray-700"
                    value={formData.experience_years}
                    onChange={e => updateForm('experience_years', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button 
              onClick={() => setStep(2)}
              disabled={!formData.company || !formData.role || !formData.location || !formData.experience_years}
              className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              Continue to compensation <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* Step 2: Compensation */}
        {step === 2 && (
          <div className="space-y-8 animate-fade-in">
            <div className="p-8 rounded-2xl border bg-[#111] border-[#1e1e1e] space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-gray-400 uppercase">Base Salary (per year)</span>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-mono">₹</span>
                    <input 
                      type="number" 
                      placeholder="e.g. 2400000" 
                      className="w-full bg-[#161616] border border-[#222] rounded-xl pl-8 pr-4 py-3.5 text-sm outline-none focus:border-indigo-500/50 text-white placeholder:text-gray-700"
                      value={formData.base_salary}
                      onChange={e => updateForm('base_salary', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-gray-400 uppercase">Bonus (yearly average)</span>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-mono">₹</span>
                    <input 
                      type="number" 
                      placeholder="e.g. 200000" 
                      className="w-full bg-[#161616] border border-[#222] rounded-xl pl-8 pr-4 py-3.5 text-sm outline-none focus:border-indigo-500/50 text-white placeholder:text-gray-700"
                      value={formData.bonus}
                      onChange={e => updateForm('bonus', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-gray-400 uppercase">Stock / Equity (per year)</span>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-mono">₹</span>
                    <input 
                      type="number" 
                      placeholder="e.g. 400000" 
                      className="w-full bg-[#161616] border border-[#222] rounded-xl pl-8 pr-4 py-3.5 text-sm outline-none focus:border-indigo-500/50 text-white placeholder:text-gray-700"
                      value={formData.stock}
                      onChange={e => updateForm('stock', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setStep(1)}
                className="flex-1 bg-[#1a1a1a] hover:bg-[#222] text-white font-bold py-4 rounded-2xl transition-all"
              >
                Go Back
              </button>
              <button 
                onClick={() => setStep(3)}
                disabled={!formData.base_salary}
                className="flex-[2] bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-50 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                Review details <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="space-y-8 animate-fade-in">
            <div className="p-8 rounded-2xl border bg-[#111] border-[#1e1e1e] space-y-8">
              <div className="grid grid-cols-2 gap-y-8">
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Company</div>
                  <div className="text-white font-bold">{formData.company}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Role</div>
                  <div className="text-white font-bold">{formData.role}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Level</div>
                  <div className="text-white font-bold">{formData.level_standardized}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Location</div>
                  <div className="text-white font-bold">{formData.location}</div>
                </div>
                <div className="col-span-2 pt-6 border-t border-[#1e1e1e] space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Base Salary</span>
                    <span className="font-mono text-white text-lg">{parseInt(formData.base_salary).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Compensation</span>
                    <span className="font-mono text-indigo-400 text-2xl font-bold">
                      ₹{(
                        parseInt(formData.base_salary || "0") + 
                        parseInt(formData.bonus || "0") + 
                        parseInt(formData.stock || "0")
                      ).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setStep(2)}
                className="flex-1 bg-[#1a1a1a] hover:bg-[#222] text-white font-bold py-4 rounded-2xl transition-all"
              >
                Edit
              </button>
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="flex-[2] bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                {loading ? 'Submitting...' : 'Confirm & Submit'} <Check size={18} />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
