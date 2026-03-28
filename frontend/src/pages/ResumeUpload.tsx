import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { uploadResumeApi } from "@/api/ApiHub";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";

const ResumeUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const { setUserSkills, userSkills } = useUser();
  const navigate = useNavigate();

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") { // Only allow PDF for now
      setFile(droppedFile);
    } else {
      toast.error("Invalid file type", {
        description: "Only PDF files are allowed.",
      });
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "application/pdf") { // Only allow PDF for now
        setFile(selectedFile);
      } else {
        toast.error("Invalid file type", {
          description: "Only PDF files are allowed.",
        });
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("No file selected", {
        description: "Please select a resume to upload.",
      });
      return;
    }

    setUploading(true);
    try {
      const response = await uploadResumeApi(file);
      setUserSkills(response.skills);
      setUploaded(true);
      toast.success("Resume uploaded successfully", {
        description: `Found ${response.skills.length} skills in your resume.`,
      });
    } catch (error: any) {
      toast.error("Upload failed", {
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Upload Resume</h1>
        <p className="text-sm text-muted-foreground mt-1">
          We'll extract your skills and experience to analyze your readiness.
        </p>
      </div>

      <div className="rounded-[12px] shadow-card p-1">
        <div className="rounded-[8px] bg-card p-6">
          {!uploaded ? (
            <>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-smooth cursor-pointer ${
                  dragOver ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
                }`}
                onClick={() => document.getElementById("file-input")?.click()}
              >
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm font-medium text-foreground">
                  Drop your resume here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground mt-1">PDF, max 10MB</p>
                <input
                  id="file-input"
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>

              {file && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex items-center justify-between p-3 rounded-lg bg-secondary"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setFile(null)} className="text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                </motion.div>
              )}

              <Button
                className="w-full mt-4 h-11"
                disabled={!file || uploading}
                onClick={handleUpload}
              >
                {uploading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Extracting skills...
                  </div>
                ) : (
                  "Upload & Analyze"
                )}
              </Button>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-foreground">Resume Analyzed</h2>
              <p className="text-sm text-muted-foreground mt-1">
                We found {userSkills.length} skills in your resume.
              </p>
              {userSkills.length > 0 && (
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {userSkills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-primary/10 text-primary-foreground rounded-full text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
              <Button className="mt-6" onClick={() => navigate("/select-role")}>
                Enter Job Requirements
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;
