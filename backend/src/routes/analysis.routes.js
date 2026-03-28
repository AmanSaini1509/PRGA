import express from "express";
import { finalAnalysis } from "../controllers/analysis.controller.js";

const router = express.Router();

router.post("/analysis", finalAnalysis);

export default router;