import express from "express";
import { generateAssessment, submitAssessment } from "../controllers/assessment.controller.js";

const router = express.Router();

router.post("/generate", generateAssessment);
router.post("/submit", submitAssessment);

export default router;