import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema({
    strongSkills: {
        type: [String],
        required: true,
        default: []
    },
    weakSkills: {
        type: [String],
        required: true,
        default: []
    },
    missingSkills: {
        type: [String],
        required: true,
        default: []
    },
    overallScore: {
        type: Number,
        required: true,
        default: 0
    },
    feedback: {
        type: String,
        required: true,
        default: ""
    },
    roadmap: {
        type: [String],
        default: []
    }
})

export const Analysis = mongoose.model("Analysis", analysisSchema);