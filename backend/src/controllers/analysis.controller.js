import { ai } from "../services/gemini.service.js";
import { Analysis } from "../modles/analysis.model.js";

export const finalAnalysis = async (req, res) => {
    try {
        const { resumeSkills, skillScores, requiredSkills } = req.body;
        const prompt = `
        You are an AI career assistant.

        Resume Skills:
        ${JSON.stringify(resumeSkills)}

        Skill Scores:
        ${JSON.stringify(skillScores)}

        Job Required Skills:
        ${JSON.stringify(requiredSkills)}

        Analyze and return ONLY valid JSON. Do not include any explanation, text, or markdown.
        Ensure the output is strictly parsable using JSON.parse():

        {
        "strongSkills": [],
        "weakSkills": [],
        "missingSkills": [],
        "overallScore": number,
        "feedback": "detailed feedback",
        "roadmap": ["step1", "step2"]
        }

        Rules:
        - Strong: score >= 70 AND required in job
        - Weak: score < 70 AND present in resume
        - Missing: required but not in resume
        - Overall score based on job readiness
        `;

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
        const safeParsed = {
            strongSkills: parsed.strongSkills || [],
            weakSkills: parsed.weakSkills || [],
            missingSkills: parsed.missingSkills || [],
            overallScore: parsed.overallScore || 6,
            feedback: parsed.feedback || "",
            roadmap: parsed.roadmap || []
        };
        await Analysis.create(safeParsed);
        res.json({
            analysis: safeParsed
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

