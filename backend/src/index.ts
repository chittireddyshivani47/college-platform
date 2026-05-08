import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load env vars FIRST before any other imports that need them
dotenv.config();

import { errorHandler } from "./middleware/errorHandler";
import collegeRoutes from "./routes/colleges";
import authRoutes from "./routes/auth";
import savedRoutes from "./routes/saved";
import compareRoutes from "./routes/compare";

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ──────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/colleges", collegeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/saved", savedRoutes);
app.use("/api/compare", compareRoutes);

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ─── Error Handler (must be last) ────────────────────────────────────────────
app.use(errorHandler);

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running → http://localhost:${PORT}`);
  console.log(`📊 Health check  → http://localhost:${PORT}/health`);
  console.log(`🌍 Environment   → ${process.env.NODE_ENV || "development"}`);
});

export default app;
