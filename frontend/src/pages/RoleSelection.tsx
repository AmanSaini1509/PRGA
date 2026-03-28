import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { extractJobSkillsApi } from "@/api/ApiHub";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useUser } from "@/context/UserContext";

const RoleSelection = () => {
  const [jobTitle, setJobTitleState] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const { setJobTitle, setRequiredSkills } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim() || !jobDescription.trim()) {
      toast.error("Both fields are required", {
        description: "Please provide both a job title and a description.",
      });
      return;
    }

    setIsExtracting(true);
    try {
      const { requiredSkills } = await extractJobSkillsApi(jobDescription);
      setJobTitle(jobTitle);
      setRequiredSkills(requiredSkills);
      toast.success("Skills extracted successfully!");
      navigate("/assessment");
    } catch (error: any) {
      toast.error("Skill extraction failed", {
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto space-y-8"
    >
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Define Your Target Role
        </h1>
        <p className="text-md text-muted-foreground mt-2">
          Enter the details of the job you're aiming for.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="job-title" className="text-sm font-medium">Job Title</Label>
          <Input
            id="job-title"
            placeholder="e.g., Senior Frontend Developer"
            value={jobTitle}
            onChange={(e) => setJobTitleState(e.target.value)}
            disabled={isExtracting}
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="job-description" className="text-sm font-medium">
            Job Description or Requirements
          </Label>
          <Textarea
            id="job-description"
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            disabled={isExtracting}
            className="min-h-[200px] text-sm"
          />
        </div>

        <Button
          type="submit"
          className="w-full h-12 text-md"
          disabled={isExtracting || !jobTitle || !jobDescription}
        >
          {isExtracting ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Analyzing requirements...
            </div>
          ) : (
            "Analyze & Start Assessment"
          )}
        </Button>
      </form>
    </motion.div>
  );
};

export default RoleSelection;
