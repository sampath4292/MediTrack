import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.js";
import slipRoutes from "./routes/slips.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN?.split(",") || "*",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/slips", slipRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

const PORT = process.env.PORT || 4000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/medivault";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on :${PORT}`));
  })
  .catch((err) => {
    console.error("Mongo connection error", err);
    process.exit(1);
  });
