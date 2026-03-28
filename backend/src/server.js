import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Routes
import resumeRoutes from "./routes/resume.routes.js";
import assessmentRoutes from "./routes/assessment.routes.js";
import jobRoutes from "./routes/jobRequirement.routes.js";
import analysisRoutes from "./routes/analysis.routes.js";
import userRoutes from "./routes/user.routes.js";
import { databaseConnection } from "./configurations/database.configure.js";


dotenv.config();

const app = express();

// ✅ Middleware
app.use(cors({
  origin: "*", // change in production
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Health Check
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// ✅ Routes
app.use("/api/resume", resumeRoutes);
app.use("/api/assessment", assessmentRoutes);
app.use("/api/job", jobRoutes);
app.use("/api", analysisRoutes);
app.use("/api/user", userRoutes);

// ✅ Start Server
const PORT = process.env.PORT || 5000;
const startDatabaseConnection = async () => {
  await databaseConnection();
  app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
};

startDatabaseConnection();
