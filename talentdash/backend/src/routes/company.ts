import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { normalizeCompany } from "../lib/normalize";

export const companyRoutes = Router();

// GET /company/:company
companyRoutes.get("/company/:company", async (req: Request, res: Response) => {
  const companyName = normalizeCompany(req.params.company);

  const salaries = await prisma.salary.findMany({
    where: { company: { contains: companyName } },
    orderBy: { total_compensation: "desc" },
  });

  if (salaries.length === 0) {
    return res.status(404).json({
      error: "Company not found",
      message: `No salary data found for: ${companyName}`,
    });
  }

  const sorted = [...salaries].sort((a, b) => a.total_compensation - b.total_compensation);
  const mid = Math.floor(sorted.length / 2);
  const median_compensation =
    sorted.length % 2 === 0
      ? (sorted[mid - 1].total_compensation + sorted[mid].total_compensation) / 2
      : sorted[mid].total_compensation;

  const levelMap: Record<string, number> = {};
  for (const s of salaries) {
    levelMap[s.level] = (levelMap[s.level] || 0) + 1;
  }
  const level_distribution = Object.entries(levelMap)
    .map(([level, count]) => ({ level, count }))
    .sort((a, b) => b.count - a.count);

  const levelAvgMap: Record<string, number[]> = {};
  for (const s of salaries) {
    if (!levelAvgMap[s.level]) levelAvgMap[s.level] = [];
    levelAvgMap[s.level].push(s.total_compensation);
  }
  const level_averages = Object.entries(levelAvgMap).map(([level, comps]) => ({
    level,
    avg_compensation: comps.reduce((a, b) => a + b, 0) / comps.length,
    count: comps.length,
  }));

  return res.json({
    company: companyName,
    total_entries: salaries.length,
    median_compensation,
    level_distribution,
    level_averages,
    salaries,
  });
});

// GET /companies
companyRoutes.get("/companies", async (_req: Request, res: Response) => {
  const groups = await prisma.salary.groupBy({
    by: ["company"],
    _count: { id: true },
    _avg: { total_compensation: true },
    orderBy: { _count: { id: "desc" } },
  });

  return res.json({
    data: groups.map((g) => ({
      company: g.company,
      count: g._count.id,
      avg_compensation: Math.round(g._avg.total_compensation ?? 0),
    })),
  });
});
