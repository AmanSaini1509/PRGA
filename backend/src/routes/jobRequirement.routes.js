import express from "express";
import { extractJobSkills } from "../controllers/jobRequirement.controller.js";

const router = express.Router();

router.post("/extract", extractJobSkills);

export default router;