import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
  console.log("🚀 Generating 500+ salary records...");
  await prisma.salary.deleteMany();

  const allRecords = [];

  for (const company of COMPANIES) {
    // Generate 8-12 records per company
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

      allRecords.push({
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

  // Slice to exactly 500 or slightly more
  const finalSet = allRecords.slice(0, 550);

  await prisma.salary.createMany({
    data: finalSet,
  });

  console.log(`✅ Success! Seeded ${finalSet.length} records across ${COMPANIES.length} companies.`);
}

generateData()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
