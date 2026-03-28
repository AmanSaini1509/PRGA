import { createRequire } from "module";
const require = createRequire(import.meta.url);

const pdf = require("pdf-parse");
import fs from "fs";
import { ai } from "../services/gemini.service.js";


export const uploadResume = async (req, res) => {
    try {
        const filePath = req.file.path;
        const dataBuffer = fs.readFileSync(filePath);
        const pdfData = await pdf(dataBuffer);

        const resumeText = pdfData.text;

        const prompt = `Extract  any main 4 skills from the following resume.
        Return only valid JSON. Do not include any explanation, text, or markdown.
        Ensure the output is strictly parsable using JSON.parse():
        {
        "skills": ["skill1", "skill2"]
        }

        Resume:
        ${JSON.stringify(resumeText)}`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });
        let result = response.text;
        result = result.replace(/```json|```/g, "").trim();

        let parsed;
        try {
            parsed = JSON.parse(result);
        } catch (err) {
            console.error("Invalid AI JSON:", result);

            return res.status(500).json({
                error: "AI returned invalid JSON",
            });
        }
        
        res.json({
        skills: parsed.skills
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}