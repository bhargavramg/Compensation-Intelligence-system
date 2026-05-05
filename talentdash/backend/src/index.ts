import express from "express";
import cors from "cors";
import { salaryRoutes } from "./routes/salary";
import { companyRoutes } from "./routes/company";
import { compareRoutes } from "./routes/compare";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/", salaryRoutes);
app.use("/", companyRoutes);
app.use("/", compareRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`✅ TalentDash API running on http://localhost:${PORT}`);
});
