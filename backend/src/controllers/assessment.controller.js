import { ai } from "../services/gemini.service.js";

export const generateAssessment = async (req, res) => {
    try {
        const { skills } = req.body;
        const prompt = `
        Generate 10 MCQ questions based on these skills: ${JSON.stringify(skills)}

        Rules:
        - At least two question should test one skill
        - Return only valid JSON. Do not include any explanation, text, or markdown.
        Ensure the output is strictly parsable using JSON.parse()
        - Format:

        [
            {
                "question": "",
                "options": {"A": "", "B": "", "C": "", "D": ""},
                "answer": "A",
                "skill": ""
            }
        ]
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });
        let result = response.text;
        result = result.replace(/```json|```/g, "").trim();
        let questions;
        try {
            questions = JSON.parse(result);
        } catch (err) {
            console.error("Invalid AI JSON:", result);

            return res.status(500).json({
                error: "AI returned invalid JSON",
            });
        }
        res.json({questions});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const submitAssessment = (req, res) => {
    try {
        const { data } = req.body;
        const skillScores = {};
        console.log(typeof data.answers)

        data.answers.forEach(ans => {
            const { skill, selected, answer } = ans;
            if (!skillScores[skill]) {
               skillScores[skill] = { correct: 0, total: 0 };
            }
            skillScores[skill].total++;

            if (selected === answer) {
                skillScores[skill].correct++;
            }
        });

        const result = {};
        for (let skill in skillScores) {
            const s = skillScores[skill];
            result[skill] = Math.round((s.correct / s.total) * 100);
        }

        res.json({
            skillScores: result
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}