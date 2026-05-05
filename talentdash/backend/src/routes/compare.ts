import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const compareRoutes = Router();

// GET /compare?salaryId1=xxx&salaryId2=yyy
compareRoutes.get("/compare", async (req: Request, res: Response) => {
  const { salaryId1, salaryId2 } = req.query;

  if (!salaryId1 || !salaryId2) {
    return res.status(400).json({ error: "Both salaryId1 and salaryId2 are required" });
  }
  if (salaryId1 === salaryId2) {
    return res.status(400).json({ error: "Cannot compare a salary with itself" });
  }

  const [s1, s2] = await Promise.all([
    prisma.salary.findUnique({ where: { id: salaryId1 as string } }),
    prisma.salary.findUnique({ where: { id: salaryId2 as string } }),
  ]);

  if (!s1) return res.status(404).json({ error: `Salary not found: ${salaryId1}` });
  if (!s2) return res.status(404).json({ error: `Salary not found: ${salaryId2}` });

  const LEVEL_ORDER = [
    "L3", "SDE1", "IC3", "E3",
    "L4", "SDE2", "IC4", "E4",
    "L5", "SDE3", "Senior", "IC5", "E5",
    "L6", "Staff", "IC6", "E6",
    "L7", "Principal", "E7",
    "Director",
  ];

  const getOrder = (level: string) => {
    const idx = LEVEL_ORDER.indexOf(level);
    return idx === -1 ? 99 : idx;
  };

  const levelDiff = getOrder(s2.level) - getOrder(s1.level);

  return res.json({
    salary1: s1,
    salary2: s2,
    diff: {
      base_salary: s2.base_salary - s1.base_salary,
      bonus: s2.bonus - s1.bonus,
      stock: s2.stock - s1.stock,
      total_compensation: s2.total_compensation - s1.total_compensation,
      level_diff: levelDiff,
      level_direction:
        levelDiff > 0 ? "salary2 is higher level" :
        levelDiff < 0 ? "salary1 is higher level" :
        "same level",
    },
  });
});
