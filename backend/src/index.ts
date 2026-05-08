import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { errorHandler } from "./middleware/errorHandler";
import collegeRoutes from "./routes/colleges";
import authRoutes from "./routes/auth";
import savedRoutes from "./routes/saved";
import compareRoutes from "./routes/compare";

const app = express();
const PORT = parseInt(process.env.PORT || "5000", 10);

app.use(cors({
  origin: "*",
  credentials: false,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.options("*", cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/colleges", collegeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/saved", savedRoutes);
app.use("/api/compare", compareRoutes);

app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});
app.use(errorHandler);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;