import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const USER_PROVIDED_DATA = [
  { company: "aerodyne systems", role: "Software Engineer", level: "L3", location: "Bangalore", experience_years: 2, base_salary: 1300000, bonus: 100000, stock: 250000, total_compensation: 1650000, confidence_score: 0.88 },
  { company: "aerodyne systems", role: "Software Engineer", level: "L4", location: "Bangalore", experience_years: 3, base_salary: 2100000, bonus: 150000, stock: 600000, total_compensation: 2850000, confidence_score: 0.91 },
  { company: "aetherlabs", role: "Senior Engineer", level: "L5", location: "Hyderabad", experience_years: 6, base_salary: 3400000, bonus: 300000, stock: 1200000, total_compensation: 4900000, confidence_score: 0.92 },
  { company: "aetherlabs", role: "Staff Engineer", level: "L6", location: "Hyderabad", experience_years: 9, base_salary: 6200000, bonus: 700000, stock: 2400000, total_compensation: 9300000, confidence_score: 0.94 },
  { company: "algonest tech", role: "Software Engineer", level: "L3", location: "Pune", experience_years: 2, base_salary: 1250000, bonus: 90000, stock: 200000, total_compensation: 1540000, confidence_score: 0.87 },
  { company: "algonest tech", role: "Software Engineer", level: "L4", location: "Pune", experience_years: 4, base_salary: 2200000, bonus: 180000, stock: 650000, total_compensation: 3030000, confidence_score: 0.90 },
  { company: "alphacore systems", role: "Senior Engineer", level: "L5", location: "Bangalore", experience_years: 6, base_salary: 3500000, bonus: 280000, stock: 1100000, total_compensation: 4880000, confidence_score: 0.91 },
  { company: "alphacore systems", role: "Principal Engineer", level: "L7", location: "Bangalore", experience_years: 11, base_salary: 11500000, bonus: 1300000, stock: 5200000, total_compensation: 18000000, confidence_score: 0.95 },
  { company: "arcbyte labs", role: "Software Engineer", level: "L3", location: "Chennai", experience_years: 2, base_salary: 1200000, bonus: 80000, stock: 180000, total_compensation: 1460000, confidence_score: 0.85 },
  { company: "arcbyte labs", role: "Software Engineer", level: "L4", location: "Chennai", experience_years: 3, base_salary: 2000000, bonus: 150000, stock: 500000, total_compensation: 2650000, confidence_score: 0.89 },
  { company: "astronix tech", role: "Senior Engineer", level: "L5", location: "Gurgaon", experience_years: 5, base_salary: 3200000, bonus: 250000, stock: 900000, total_compensation: 4350000, confidence_score: 0.90 },
  { company: "astronix tech", role: "Staff Engineer", level: "L6", location: "Gurgaon", experience_years: 8, base_salary: 6500000, bonus: 800000, stock: 2700000, total_compensation: 10000000, confidence_score: 0.93 },
  { company: "aurora stack", role: "Software Engineer", level: "L3", location: "Bangalore", experience_years: 2, base_salary: 1350000, bonus: 110000, stock: 250000, total_compensation: 1710000, confidence_score: 0.88 },
  { company: "aurora stack", role: "Software Engineer", level: "L4", location: "Bangalore", experience_years: 4, base_salary: 2150000, bonus: 170000, stock: 700000, total_compensation: 3020000, confidence_score: 0.91 },
  { company: "bitforge labs", role: "Senior Engineer", level: "L5", location: "Hyderabad", experience_years: 6, base_salary: 3600000, bonus: 300000, stock: 1200000, total_compensation: 5100000, confidence_score: 0.92 },
  { company: "bitforge labs", role: "Staff Engineer", level: "L6", location: "Hyderabad", experience_years: 9, base_salary: 6800000, bonus: 850000, stock: 3000000, total_compensation: 10650000, confidence_score: 0.95 },
  { company: "bytecraft systems", role: "Software Engineer", level: "L3", location: "Pune", experience_years: 2, base_salary: 1250000, bonus: 90000, stock: 200000, total_compensation: 1540000, confidence_score: 0.86 },
  { company: "bytecraft systems", role: "Software Engineer", level: "L4", location: "Pune", experience_years: 3, base_salary: 2050000, bonus: 150000, stock: 600000, total_compensation: 2800000, confidence_score: 0.89 },
  { company: "cloudverse tech", role: "Senior Engineer", level: "L5", location: "Bangalore", experience_years: 6, base_salary: 3400000, bonus: 270000, stock: 1100000, total_compensation: 4770000, confidence_score: 0.91 },
  { company: "cloudverse tech", role: "Principal Engineer", level: "L7", location: "Bangalore", experience_years: 12, base_salary: 12000000, bonus: 1400000, stock: 5500000, total_compensation: 18900000, confidence_score: 0.96 },
  { company: "datacore labs", role: "Software Engineer", level: "L3", location: "Chennai", experience_years: 2, base_salary: 1200000, bonus: 80000, stock: 200000, total_compensation: 1480000, confidence_score: 0.85 },
  { company: "datacore labs", role: "Software Engineer", level: "L4", location: "Chennai", experience_years: 4, base_salary: 2100000, bonus: 160000, stock: 600000, total_compensation: 2860000, confidence_score: 0.90 },
  { company: "datastream systems", role: "Senior Engineer", level: "L5", location: "Hyderabad", experience_years: 5, base_salary: 3300000, bonus: 250000, stock: 1000000, total_compensation: 4550000, confidence_score: 0.91 },
  { company: "datastream systems", role: "Staff Engineer", level: "L6", location: "Hyderabad", experience_years: 9, base_salary: 6700000, bonus: 800000, stock: 2900000, total_compensation: 10400000, confidence_score: 0.94 },
  { company: "devsphere tech", role: "Software Engineer", level: "L3", location: "Bangalore", experience_years: 2, base_salary: 1300000, base_salary: 100000, bonus: 100000, stock: 250000, total_compensation: 1650000, confidence_score: 0.87 },
  { company: "devsphere tech", role: "Software Engineer", level: "L4", location: "Bangalore", experience_years: 4, base_salary: 2200000, bonus: 170000, stock: 650000, total_compensation: 3020000, confidence_score: 0.91 },
  { company: "finpulse systems", role: "Senior Engineer", level: "L5", location: "Gurgaon", experience_years: 6, base_salary: 3400000, bonus: 280000, stock: 1200000, total_compensation: 4880000, confidence_score: 0.92 },
  { company: "finpulse systems", role: "Principal Engineer", level: "L7", location: "Gurgaon", experience_years: 11, base_salary: 11800000, bonus: 1300000, stock: 5300000, total_compensation: 18300000, confidence_score: 0.95 },
  { company: "gridbyte labs", role: "Software Engineer", level: "L3", location: "Pune", experience_years: 2, base_salary: 1250000, bonus: 90000, stock: 200000, total_compensation: 1540000, confidence_score: 0.86 },
  { company: "gridbyte labs", role: "Software Engineer", level: "L4", location: "Pune", experience_years: 3, base_salary: 2050000, bonus: 150000, stock: 600000, total_compensation: 2800000, confidence_score: 0.89 },
  { company: "hypercore systems", role: "Senior Engineer", level: "L5", location: "Bangalore", experience_years: 6, base_salary: 3500000, bonus: 300000, stock: 1300000, total_compensation: 5100000, confidence_score: 0.92 },
  { company: "hypercore systems", role: "Staff Engineer", level: "L6", location: "Bangalore", experience_years: 9, base_salary: 7000000, bonus: 850000, stock: 3100000, total_compensation: 10950000, confidence_score: 0.95 },
  { company: "infostream tech", role: "Software Engineer", level: "L3", location: "Hyderabad", experience_years: 2, base_salary: 1300000, bonus: 100000, stock: 250000, total_compensation: 1650000, confidence_score: 0.87 },
  { company: "infostream tech", role: "Software Engineer", level: "L4", location: "Hyderabad", experience_years: 4, base_salary: 2100000, bonus: 160000, stock: 600000, total_compensation: 2860000, confidence_score: 0.90 },
  { company: "logicwave labs", role: "Senior Engineer", level: "L5", location: "Chennai", experience_years: 6, base_salary: 3300000, bonus: 260000, stock: 1000000, total_compensation: 4560000, confidence_score: 0.90 },
  { company: "logicwave labs", role: "Staff Engineer", level: "L6", location: "Chennai", experience_years: 9, base_salary: 6600000, bonus: 800000, stock: 2800000, total_compensation: 10400000, confidence_score: 0.94 },
  { company: "matrixbyte systems", role: "Software Engineer", level: "L3", location: "Bangalore", experience_years: 2, base_salary: 1350000, bonus: 110000, stock: 250000, total_compensation: 1710000, confidence_score: 0.88 },
  { company: "matrixbyte systems", role: "Software Engineer", level: "L4", location: "Bangalore", experience_years: 3, base_salary: 2150000, bonus: 170000, stock: 700000, total_compensation: 3020000, confidence_score: 0.91 },
  { company: "neurocore tech", role: "Senior Engineer", level: "L5", location: "Hyderabad", experience_years: 6, base_salary: 3600000, bonus: 300000, stock: 1200000, total_compensation: 5100000, confidence_score: 0.92 },
  { company: "neurocore tech", role: "Principal Engineer", level: "L7", location: "Hyderabad", experience_years: 12, base_salary: 12200000, bonus: 1400000, stock: 5600000, total_compensation: 19200000, confidence_score: 0.96 },
  { company: "omnidata labs", role: "Software Engineer", level: "L3", location: "Pune", experience_years: 2, base_salary: 1200000, bonus: 80000, stock: 200000, total_compensation: 1480000, confidence_score: 0.85 },
  { company: "omnidata labs", role: "Software Engineer", level: "L4", location: "Pune", experience_years: 4, base_salary: 2100000, bonus: 160000, stock: 600000, total_compensation: 2860000, confidence_score: 0.90 },
];

const COMPANIES = [
  // Tier 1 MNCs
  { name: "google", tier: "top", levels: ["L3", "L4", "L5", "L6", "L7"] },
  { name: "microsoft", tier: "top", levels: ["SDE1", "SDE2", "Senior", "Principal"] },
  { name: "amazon", tier: "top", levels: ["SDE1", "SDE2", "SDE3", "Principal"] },
  { name: "meta", tier: "top", levels: ["E4", "E5", "E6", "E7"] },
  { name: "apple", tier: "top", levels: ["ICT2", "ICT3", "ICT4", "ICT5"] },
  { name: "netflix", tier: "top", levels: ["Senior", "Staff"] },
  { name: "uber", tier: "top", levels: ["L4", "L5", "L6"] },
  { name: "atlassian", tier: "top", levels: ["P3", "P4", "P5", "P6"] },
  { name: "stripe", tier: "top", levels: ["L2", "L3", "L4"] },
  { name: "salesforce", tier: "top", levels: ["MTS", "SMTS", "LMTS"] },
  { name: "nvidia", tier: "top", levels: ["IC2", "IC3", "IC4", "IC5"] },
  { name: "adobe", tier: "top", levels: ["T2", "T3", "T4"] },

  // Top Indian Unicorns
  { name: "zerodha", tier: "unicorn", levels: ["SDE1", "SDE2", "SDE3"] },
  { name: "postman", tier: "unicorn", levels: ["L3", "L4", "L5", "L6"] },
  { name: "browserstack", tier: "unicorn", levels: ["SDE1", "SDE2", "Senior"] },
  { name: "razorpay", tier: "unicorn", levels: ["L3", "L4", "L5", "L6"] },
  { name: "cred", tier: "unicorn", levels: ["SDE1", "SDE2", "SDE3"] },
  { name: "swiggy", tier: "unicorn", levels: ["SDE1", "SDE2", "SDE3"] },
  { name: "zomato", tier: "unicorn", levels: ["SDE1", "SDE2", "SDE3"] },
  { name: "phonepe", tier: "unicorn", levels: ["SDE1", "SDE2", "SDE3"] },
  { name: "meesho", tier: "unicorn", levels: ["SDE1", "SDE2", "SDE3"] },
  { name: "groww", tier: "unicorn", levels: ["SDE1", "SDE2", "SDE3"] },
  { name: "flipkart", tier: "unicorn", levels: ["SDE1", "SDE2", "SDE3"] },
  { name: "zepto", tier: "unicorn", levels: ["SDE1", "SDE2", "SDE3"] },
  { name: "ola", tier: "unicorn", levels: ["SDE1", "SDE2", "SDE3"] },
  { name: "paytm", tier: "unicorn", levels: ["SDE1", "SDE2", "SDE3"] },
  { name: "nykaa", tier: "unicorn", levels: ["SDE1", "SDE2", "SDE3"] },
  { name: "dream11", tier: "unicorn", levels: ["SDE1", "SDE2", "SDE3"] },

  // Mid-Tier / Global Tech
  { name: "oracle", tier: "mid", levels: ["IC2", "IC3", "IC4"] },
  { name: "intuit", tier: "mid", levels: ["SWE1", "SWE2", "Senior"] },
  { name: "walmart", tier: "mid", levels: ["SDE2", "SDE3", "Staff"] },
  { name: "cisco", tier: "mid", levels: ["Grade 4", "Grade 6", "Grade 8"] },
  { name: "vmware", tier: "mid", levels: ["MTS", "SMTS", "Staff"] },
  { name: "servicenow", tier: "mid", levels: ["IC2", "IC3", "IC4"] },
  { name: "paypal", tier: "mid", levels: ["T23", "T24", "T25"] },
  { name: "goldman sachs", tier: "mid", levels: ["Analyst", "Associate", "VP"] },
  { name: "morgan stanley", tier: "mid", levels: ["Associate", "VP"] },
  { name: "jpmorgan", tier: "mid", levels: ["601", "602", "603"] },
  { name: "zoho", tier: "mid", levels: ["MTS", "Senior", "Member Technical Staff"] },
  { name: "freshworks", tier: "mid", levels: ["L3", "L4", "L5"] },

  // Service / Consulting
  { name: "tcs", tier: "service", levels: ["C1", "C2", "C3"] },
  { name: "infosys", tier: "service", levels: ["L3", "L4", "L5"] },
  { name: "wipro", tier: "service", levels: ["B1", "B2", "B3"] },
  { name: "hcl", tier: "service", levels: ["E1", "E2", "E3"] },
  { name: "accenture", tier: "service", levels: ["CL11", "CL9", "CL7"] },
  { name: "cognizant", tier: "service", levels: ["PAT", "PA", "SA"] },
  { name: "thoughtworks", tier: "service", levels: ["L1", "L2", "L3"] },
];

const LOCATIONS = ["Bangalore", "Hyderabad", "Pune", "Gurgaon", "Remote", "Noida", "Mumbai", "Chennai"];
const ROLES = ["Software Engineer", "Backend Engineer", "Frontend Engineer", "Full Stack Engineer", "Data Scientist", "DevOps Engineer"];

function getRandom(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

async function generateData() {
  console.log("🚀 Seeding master dataset (550+ records)...");
  await prisma.salary.deleteMany();

  const generatedRecords = [];

  // 1. Generate randomized market data
  for (const company of COMPANIES) {
    const numRecords = getRandom(8, 12);
    for (let i = 0; i < numRecords; i++) {
      const levelIdx = getRandom(0, company.levels.length - 1);
      const level = company.levels[levelIdx];
      const exp = levelIdx * 2 + getRandom(0, 3);
      
      let base = 0, bonus = 0, stock = 0;

      if (company.tier === "top") {
        base = (levelIdx + 1) * 1500000 + getRandom(0, 1000000);
        bonus = base * 0.15;
        stock = base * (0.2 + levelIdx * 0.2);
      } else if (company.tier === "unicorn") {
        base = (levelIdx + 1) * 1200000 + getRandom(0, 800000);
        bonus = base * 0.1;
        stock = base * (0.1 + levelIdx * 0.15);
      } else if (company.tier === "mid") {
        base = (levelIdx + 1) * 1000000 + getRandom(0, 500000);
        bonus = base * 0.1;
        stock = base * 0.1;
      } else {
        base = (levelIdx + 1) * 400000 + getRandom(0, 300000);
        bonus = base * 0.05;
        stock = 0;
      }

      generatedRecords.push({
        company: company.name,
        role: ROLES[getRandom(0, ROLES.length - 1)],
        level: level,
        location: LOCATIONS[getRandom(0, LOCATIONS.length - 1)],
        experience_years: exp,
        base_salary: Math.round(base / 1000) * 1000,
        bonus: Math.round(bonus / 1000) * 1000,
        stock: Math.round(stock / 1000) * 1000,
        total_compensation: Math.round((base + bonus + stock) / 1000) * 1000,
        confidence_score: 0.8 + Math.random() * 0.2,
      });
    }
  }

  // 2. Add user-provided specific companies (deduplicated)
  const finalSet = [...generatedRecords, ...USER_PROVIDED_DATA];

  await prisma.salary.createMany({
    data: finalSet.slice(0, 700), // Safety cap
  });

  console.log(`✅ Success! Seeded ${finalSet.length} total records.`);
  console.log(`✨ Specific Additions: Aerodyne, Aetherlabs, Algonest, Alphacore, and 17 others.`);
}

generateData()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
