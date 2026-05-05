import { z } from "zod";

export const VALID_LEVELS = [
  "L3", "L4", "L5", "L6", "L7",
  "SDE1", "SDE2", "SDE3",
  "Senior", "Staff", "Principal", "Director",
  "IC3", "IC4", "IC5", "IC6",
  "E3", "E4", "E5", "E6", "E7",
] as const;

export function normalizeCompany(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

export function normalizeRole(role: string): string {
  return role.trim();
}

export const IngestSalarySchema = z.object({
  company: z.string().min(1, "Company is required").max(100),
  role: z.string().min(1, "Role is required").max(100),
  level_standardized: z
    .string()
    .min(1, "Level is required")
    .refine(
      (val) => VALID_LEVELS.includes(val as (typeof VALID_LEVELS)[number]),
      { message: `Level must be one of: ${VALID_LEVELS.join(", ")}` }
    ),
  location: z.string().min(1, "Location is required").max(100),
  experience_years: z
    .number()
    .int("Experience must be a whole number")
    .min(0)
    .max(50),
  base_salary: z.number().positive("Base salary must be positive").max(100_000_000),
  bonus: z.number().min(0).max(100_000_000).optional().default(0),
  stock: z.number().min(0).max(100_000_000).optional().default(0),
  confidence: z.number().min(0).max(1).optional().default(0.8),
});

export type IngestSalaryInput = z.infer<typeof IngestSalarySchema>;

export const SalaryQuerySchema = z.object({
  company: z.string().optional(),
  role: z.string().optional(),
  level: z.string().optional(),
  location: z.string().optional(),
  sort: z.enum(["asc", "desc"]).optional().default("desc"),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
});

export type SalaryQuery = z.infer<typeof SalaryQuerySchema>;
