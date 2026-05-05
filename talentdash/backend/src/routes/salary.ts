import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import {
  IngestSalarySchema,
  SalaryQuerySchema,
  normalizeCompany,
  normalizeRole,
} from "../lib/normalize";

export const salaryRoutes = Router();

// POST /ingest-salary
salaryRoutes.post("/ingest-salary", async (req: Request, res: Response) => {
  const parseResult = IngestSalarySchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({
      error: "Validation failed",
      details: parseResult.error.flatten().fieldErrors,
    });
  }

  const data = parseResult.data;
  const company = normalizeCompany(data.company);
  const role = normalizeRole(data.role);
  const bonus = data.bonus ?? 0;
  const stock = data.stock ?? 0;
  const total_compensation = data.base_salary + bonus + stock;

  const existing = await prisma.salary.findFirst({
    where: {
      company,
      role,
      level: data.level_standardized,
      location: data.location.trim(),
      base_salary: data.base_salary,
      experience_years: data.experience_years,
    },
  });

  if (existing) {
    return res.status(409).json({
      error: "Duplicate entry",
      message: "An identical salary entry already exists",
      existing_id: existing.id,
    });
  }

  const salary = await prisma.salary.create({
    data: {
      company,
      role,
      level: data.level_standardized,
      location: data.location.trim(),
      experience_years: data.experience_years,
      base_salary: data.base_salary,
      bonus,
      stock,
      total_compensation,
      confidence_score: data.confidence ?? 0.8,
    },
  });

  return res.status(201).json({
    message: "Salary ingested successfully",
    data: salary,
  });
});

// GET /salaries
salaryRoutes.get("/salaries", async (req: Request, res: Response) => {
  const parseResult = SalaryQuerySchema.safeParse(req.query);

  if (!parseResult.success) {
    return res.status(400).json({
      error: "Invalid query params",
      details: parseResult.error.flatten().fieldErrors,
    });
  }

  const { company, role, level, location, sort, page, limit } = parseResult.data;
  const where: Record<string, unknown> = {};

  if (company) where.company = { contains: normalizeCompany(company) };
  if (role) where.role = { contains: role.trim() };
  if (level) where.level = { equals: level.trim() };
  if (location) where.location = { contains: location.trim() };

  const [total, salaries] = await Promise.all([
    prisma.salary.count({ where }),
    prisma.salary.findMany({
      where,
      orderBy: { total_compensation: sort === "asc" ? "asc" : "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return res.json({
    data: salaries,
    meta: { total, page, limit, pages: Math.ceil(total / limit) },
  });
});
