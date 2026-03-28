import { ai } from "../services/gemini.service.js";

export const extractJobSkills = async (req, res) => {
    try {
        const { jobDescription } = req.body;
        const prompt = `
        Extract required technical skills from this job description.

        Return ONLY valid JSON. Do not include any explanation, text, or markdown.
        Ensure the output is strictly parsable using JSON.parse():
        {
        "requiredSkills": ["skill1", "skill2"]
        }

        Job Description:
        ${JSON.stringify(jobDescription)}
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

        res.json({
            requiredSkills: parsed.requiredSkills
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}