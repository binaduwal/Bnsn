import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

import { connectDatabase } from "./config/database";
import { errorHandler } from "./middleware/errorHandler";
import { notFound } from "./middleware/notFound";
import authRoutes from "./routes/auth";
import projectRoutes from "./routes/projects";
import blueprintRoutes from "./routes/blueprints";
import categoryRoutes from "./routes/category";
import activitiesRoutes from "./routes/activities";
import adminRoutes from "./routes/admin";

import aiRoutes from "./routes/ai";
import campaignRoutes from "./routes/campaigns";
import uploadRoutes from "./routes/upload";
import paymentRoutes from "./routes/payments";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"),
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

const uploadDir = process.env.UPLOAD_PATH || "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(limiter);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(
  fileUpload({
    createParentPath: true,
    limits: {
      fileSize: parseInt(process.env.MAX_FILE_SIZE || "10485760"), // 10MB
    },
    abortOnLimit: true,
    responseOnLimit: "File size limit has been reached",
    useTempFiles: true,
    tempFileDir: path.join(uploadDir, "temp"),
  })
);

app.use("/uploads", express.static(uploadDir));

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/blueprints", blueprintRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/activities", activitiesRoutes);
app.use("/api/admin", adminRoutes);

app.use("/api/ai", aiRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/payments", paymentRoutes);

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔧 Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;
