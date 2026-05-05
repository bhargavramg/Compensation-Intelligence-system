import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const seedData = [
  { company: "google", role: "Software Engineer", level: "L3", location: "Bangalore", experience_years: 1, base_salary: 2200000, bonus: 300000, stock: 500000 },
  { company: "google", role: "Software Engineer", level: "L4", location: "Bangalore", experience_years: 3, base_salary: 3500000, bonus: 600000, stock: 1200000 },
  { company: "google", role: "Software Engineer", level: "L5", location: "Bangalore", experience_years: 6, base_salary: 5000000, bonus: 1000000, stock: 2500000 },
  { company: "google", role: "Senior Software Engineer", level: "L5", location: "Hyderabad", experience_years: 7, base_salary: 5200000, bonus: 1100000, stock: 2800000 },
  { company: "google", role: "Staff Engineer", level: "L6", location: "Bangalore", experience_years: 10, base_salary: 7000000, bonus: 1800000, stock: 5000000 },
  { company: "microsoft", role: "Software Engineer", level: "SDE1", location: "Hyderabad", experience_years: 1, base_salary: 1800000, bonus: 200000, stock: 400000 },
  { company: "microsoft", role: "Software Engineer", level: "SDE2", location: "Hyderabad", experience_years: 4, base_salary: 2800000, bonus: 400000, stock: 900000 },
  { company: "microsoft", role: "Senior Software Engineer", level: "Senior", location: "Bangalore", experience_years: 7, base_salary: 4000000, bonus: 700000, stock: 1800000 },
  { company: "microsoft", role: "Principal Engineer", level: "Principal", location: "Hyderabad", experience_years: 12, base_salary: 6500000, bonus: 1500000, stock: 4000000 },
  { company: "amazon", role: "Software Development Engineer", level: "SDE1", location: "Bangalore", experience_years: 2, base_salary: 1900000, bonus: 0, stock: 600000 },
  { company: "amazon", role: "Software Development Engineer", level: "SDE2", location: "Bangalore", experience_years: 5, base_salary: 2900000, bonus: 0, stock: 1400000 },
  { company: "amazon", role: "Senior SDE", level: "SDE3", location: "Hyderabad", experience_years: 8, base_salary: 4200000, bonus: 0, stock: 3000000 },
  { company: "amazon", role: "Principal SDE", level: "Principal", location: "Bangalore", experience_years: 13, base_salary: 6800000, bonus: 0, stock: 8000000 },
  { company: "flipkart", role: "Software Engineer", level: "SDE1", location: "Bangalore", experience_years: 1, base_salary: 1400000, bonus: 150000, stock: 200000 },
  { company: "flipkart", role: "Software Engineer", level: "SDE2", location: "Bangalore", experience_years: 4, base_salary: 2200000, bonus: 300000, stock: 600000 },
  { company: "flipkart", role: "Senior Engineer", level: "Senior", location: "Bangalore", experience_years: 7, base_salary: 3200000, bonus: 500000, stock: 1200000 },
  { company: "swiggy", role: "Software Engineer", level: "SDE1", location: "Bangalore", experience_years: 2, base_salary: 1600000, bonus: 200000, stock: 300000 },
  { company: "swiggy", role: "Senior Engineer", level: "SDE2", location: "Bangalore", experience_years: 5, base_salary: 2600000, bonus: 400000, stock: 800000 },
  { company: "razorpay", role: "Software Engineer", level: "L3", location: "Bangalore", experience_years: 2, base_salary: 1800000, bonus: 250000, stock: 400000 },
  { company: "razorpay", role: "Senior Engineer", level: "L5", location: "Bangalore", experience_years: 6, base_salary: 3500000, bonus: 600000, stock: 1500000 },
  { company: "phonepe", role: "Software Engineer", level: "SDE1", location: "Bangalore", experience_years: 2, base_salary: 1700000, bonus: 200000, stock: 350000 },
  { company: "phonepe", role: "Senior Engineer", level: "SDE2", location: "Bangalore", experience_years: 5, base_salary: 2800000, bonus: 400000, stock: 900000 },
  { company: "meta", role: "Software Engineer", level: "E4", location: "Bangalore", experience_years: 3, base_salary: 4000000, bonus: 800000, stock: 2000000 },
  { company: "meta", role: "Senior Software Engineer", level: "E5", location: "Bangalore", experience_years: 7, base_salary: 6000000, bonus: 1500000, stock: 4500000 },
  { company: "atlassian", role: "Software Engineer", level: "L3", location: "Bangalore", experience_years: 2, base_salary: 2400000, bonus: 300000, stock: 700000 },
  { company: "atlassian", role: "Senior Engineer", level: "L5", location: "Bangalore", experience_years: 6, base_salary: 4200000, bonus: 700000, stock: 2000000 },
  { company: "uber", role: "Software Engineer", level: "L4", location: "Bangalore", experience_years: 3, base_salary: 3000000, bonus: 500000, stock: 1500000 },
  { company: "uber", role: "Senior Engineer", level: "L5", location: "Bangalore", experience_years: 6, base_salary: 4800000, bonus: 900000, stock: 2500000 },
  { company: "adobe", role: "Software Engineer", level: "T2", location: "Noida", experience_years: 3, base_salary: 2200000, bonus: 200000, stock: 600000 },
  { company: "adobe", role: "Senior Software Engineer", level: "T3", location: "Noida", experience_years: 7, base_salary: 3800000, bonus: 400000, stock: 1200000 },
  { company: "apple", role: "Software Engineer", level: "ICT2", location: "Hyderabad", experience_years: 2, base_salary: 2600000, bonus: 350000, stock: 800000 },
  { company: "apple", role: "Senior Software Engineer", level: "ICT3", location: "Hyderabad", experience_years: 5, base_salary: 4500000, bonus: 700000, stock: 2200000 },
  { company: "apple", role: "Staff Engineer", level: "ICT4", location: "Hyderabad", experience_years: 9, base_salary: 7000000, bonus: 1400000, stock: 5000000 },
  { company: "netflix", role: "Senior Software Engineer", level: "Senior", location: "Bangalore", experience_years: 6, base_salary: 8000000, bonus: 0, stock: 0 },
  { company: "netflix", role: "Staff Software Engineer", level: "Staff", location: "Bangalore", experience_years: 10, base_salary: 12000000, bonus: 0, stock: 0 },
  { company: "salesforce", role: "Software Engineer", level: "MTS", location: "Hyderabad", experience_years: 2, base_salary: 2200000, bonus: 300000, stock: 600000 },
  { company: "salesforce", role: "Senior Software Engineer", level: "SMTS", location: "Hyderabad", experience_years: 6, base_salary: 4000000, bonus: 700000, stock: 1800000 },
  { company: "salesforce", role: "Principal Engineer", level: "LMTS", location: "Hyderabad", experience_years: 11, base_salary: 6500000, bonus: 1500000, stock: 4000000 },
  { company: "zomato", role: "Software Engineer", level: "SDE1", location: "Gurgaon", experience_years: 1, base_salary: 1500000, bonus: 150000, stock: 250000 },
  { company: "zomato", role: "Senior Engineer", level: "SDE2", location: "Gurgaon", experience_years: 4, base_salary: 2500000, bonus: 350000, stock: 700000 },
  { company: "zomato", role: "Staff Engineer", level: "SDE3", location: "Gurgaon", experience_years: 8, base_salary: 4000000, bonus: 600000, stock: 1800000 },
  { company: "paytm", role: "Software Engineer", level: "SDE1", location: "Noida", experience_years: 1, base_salary: 1200000, bonus: 120000, stock: 150000 },
  { company: "paytm", role: "Senior Engineer", level: "SDE2", location: "Noida", experience_years: 4, base_salary: 2000000, bonus: 250000, stock: 500000 },
  { company: "meesho", role: "Software Engineer", level: "SDE1", location: "Bangalore", experience_years: 1, base_salary: 1600000, bonus: 180000, stock: 300000 },
  { company: "meesho", role: "Senior Engineer", level: "SDE2", location: "Bangalore", experience_years: 4, base_salary: 2800000, bonus: 350000, stock: 900000 },
  { company: "meesho", role: "Staff Engineer", level: "SDE3", location: "Bangalore", experience_years: 7, base_salary: 4200000, bonus: 600000, stock: 2000000 },
  { company: "freshworks", role: "Software Engineer", level: "L3", location: "Chennai", experience_years: 2, base_salary: 1500000, bonus: 180000, stock: 300000 },
  { company: "freshworks", role: "Senior Engineer", level: "L4", location: "Chennai", experience_years: 5, base_salary: 2800000, bonus: 400000, stock: 900000 },
  { company: "freshworks", role: "Principal Engineer", level: "L6", location: "Chennai", experience_years: 10, base_salary: 4800000, bonus: 900000, stock: 2500000 },
  { company: "cred", role: "Software Engineer", level: "SDE2", location: "Bangalore", experience_years: 3, base_salary: 2800000, bonus: 400000, stock: 1000000 },
  { company: "cred", role: "Senior Engineer", level: "SDE3", location: "Bangalore", experience_years: 6, base_salary: 4500000, bonus: 700000, stock: 2500000 },
  { company: "stripe", role: "Software Engineer", level: "L3", location: "Bangalore", experience_years: 2, base_salary: 3500000, bonus: 500000, stock: 1500000 },
  { company: "stripe", role: "Senior Engineer", level: "L4", location: "Bangalore", experience_years: 6, base_salary: 6000000, bonus: 1000000, stock: 3500000 },
  { company: "ola", role: "Software Engineer", level: "SDE1", location: "Bangalore", experience_years: 1, base_salary: 1400000, bonus: 150000, stock: 200000 },
  { company: "ola", role: "Senior Engineer", level: "SDE2", location: "Bangalore", experience_years: 4, base_salary: 2400000, bonus: 300000, stock: 700000 },
  { company: "juspay", role: "Software Engineer", level: "SDE1", location: "Bangalore", experience_years: 2, base_salary: 1800000, bonus: 200000, stock: 400000 },
  { company: "juspay", role: "Senior Engineer", level: "SDE2", location: "Bangalore", experience_years: 5, base_salary: 3200000, bonus: 450000, stock: 1200000 },
  { company: "zepto", role: "Software Engineer", level: "SDE1", location: "Mumbai", experience_years: 1, base_salary: 1700000, bonus: 200000, stock: 400000 },
  { company: "zepto", role: "Senior Engineer", level: "SDE2", location: "Mumbai", experience_years: 4, base_salary: 3000000, bonus: 450000, stock: 1200000 },
  { company: "groww", role: "Software Engineer", level: "SDE1", location: "Bangalore", experience_years: 2, base_salary: 1900000, bonus: 220000, stock: 500000 },
  { company: "groww", role: "Senior Engineer", level: "SDE2", location: "Bangalore", experience_years: 5, base_salary: 3200000, bonus: 500000, stock: 1500000 },
  { company: "groww", role: "Staff Engineer", level: "SDE3", location: "Bangalore", experience_years: 8, base_salary: 5000000, bonus: 900000, stock: 3000000 },
  { company: "coinbase", role: "Software Engineer", level: "L4", location: "Bangalore", experience_years: 3, base_salary: 4000000, bonus: 600000, stock: 2000000 },
  { company: "coinbase", role: "Senior Engineer", level: "L5", location: "Bangalore", experience_years: 7, base_salary: 7000000, bonus: 1200000, stock: 4500000 },
  { company: "intuit", role: "Software Engineer", level: "SWE2", location: "Bangalore", experience_years: 2, base_salary: 2100000, bonus: 280000, stock: 600000 },
  { company: "intuit", role: "Senior Engineer", level: "SWE3", location: "Bangalore", experience_years: 6, base_salary: 3800000, bonus: 600000, stock: 1800000 },
  { company: "walmart", role: "Software Engineer", level: "SDE2", location: "Bangalore", experience_years: 3, base_salary: 2000000, bonus: 250000, stock: 500000 },
  { company: "walmart", role: "Senior Engineer", level: "SDE3", location: "Bangalore", experience_years: 7, base_salary: 3500000, bonus: 550000, stock: 1400000 },
  { company: "oracle", role: "Software Engineer", level: "IC2", location: "Bangalore", experience_years: 2, base_salary: 1700000, bonus: 200000, stock: 350000 },
  { company: "oracle", role: "Senior Engineer", level: "IC3", location: "Hyderabad", experience_years: 5, base_salary: 2800000, bonus: 400000, stock: 900000 },
  { company: "thoughtworks", role: "Application Developer", level: "L1", location: "Bangalore", experience_years: 1, base_salary: 1300000, bonus: 150000, stock: 0 },
  { company: "thoughtworks", role: "Senior Developer", level: "L2", location: "Bangalore", experience_years: 4, base_salary: 2200000, bonus: 300000, stock: 0 },
];

async function main() {
  console.log("🌱 Seeding database...");
  await prisma.salary.deleteMany();

  for (const entry of seedData) {
    const total_compensation = entry.base_salary + (entry.bonus ?? 0) + (entry.stock ?? 0);
    await prisma.salary.create({
      data: { ...entry, bonus: entry.bonus ?? 0, stock: entry.stock ?? 0, total_compensation, confidence_score: 0.85 },
    });
  }

  console.log(`✅ Seeded ${seedData.length} salary entries`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
