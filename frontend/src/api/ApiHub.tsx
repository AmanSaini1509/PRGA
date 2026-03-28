import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api"; // Assuming your backend runs on port 5000 and has a /api prefix

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const uploadResumeApi = async (file: File) => {
  const formData = new FormData();
  formData.append("resume", file);

  try {
    const response = await api.post("/resume/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to upload resume");
    }
    throw error;
  }
};

export const extractJobSkillsApi = async (jobDescription: string) => {
  try {
    const response = await api.post("/job/extract", { jobDescription });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to extract skills");
    }
    throw error;
  }
};

export const generateAssessmentApi = async (skills: string[]) => {
  try {
    const response = await api.post("/assessment/generate", { skills });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to generate assessment");
    }
    throw error;
  }
}

export const submitAssessmentApi = async (data: { answers: any[] }) => {
  try {
    const response = await api.post("/assessment/submit", { data });
    console.log(response);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to submit assessment");
    }
    throw error;
  }
}

export const getFinalAnalysisApi = async (data: { resumeSkills: string[], skillScores: any, requiredSkills: string[] }) => {
  try {
    const response = await api.post("/analysis", data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to get final analysis");
    }
    throw error;
  }
}

export const registerUserApi = async (userData: any) => {
  try {
    const response = await api.post("/user/register", userData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
    throw error;
  }
};

export const loginUserApi = async (credentials: any) => {
  try {
    const response = await api.post("/user/login", credentials);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
    throw error;
  }
};
