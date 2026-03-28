import { useEffect, useState, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReadinessGauge from "@/components/ReadinessGauge";
import GapCard from "@/components/GapCard";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { Lightbulb, Loader2 } from "lucide-react";
import { getFinalAnalysisApi } from "@/api/ApiHub";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";

const getBarColor = (status: string) => {
  if (status === "strong") return "hsl(160, 84%, 39%)";
  if (status === "weak") return "hsl(38, 92%, 50%)";
  return "hsl(0, 84%, 60%)";
};

interface AnalysisData {
  strongSkills: string[];
  weakSkills: string[];
  missingSkills: string[];
  overallScore: number;
  feedback: string;
  roadmap: string[];
}

const Analysis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { setRoadmap } = useUser();

  const {
    userSkills,
    requiredSkills,
    jobTitle,
    assessmentResult,
  } = location.state || {};

  const hasFetched = useRef(false);
  useEffect(() => {
    if (!userSkills || !requiredSkills || !assessmentResult) {
      toast.error("Missing data for analysis", {
        description: "Please complete the assessment process first.",
      });
      navigate("/upload");
      return;
    }

    const fetchAnalysis = async () => {
      setIsLoading(true);
      try {
        const data = await getFinalAnalysisApi({
          resumeSkills: userSkills,
          skillScores: assessmentResult,
          requiredSkills,
        });
        console.log("API RESPONSE:", data);
        setAnalysis(data.analysis);
        setRoadmap(data.analysis.roadmap); // Set the roadmap in the context
      } catch (error: any) {
        toast.error("Failed to get analysis", {
          description: error.message,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysis();
  }, [userSkills, requiredSkills, assessmentResult]);

  const skillData = useMemo(() => {
    if (!analysis) return [];

    const allSkills = new Set([
      ...analysis.strongSkills,
      ...analysis.weakSkills,
      ...analysis.missingSkills,
    ]);

    return Array.from(allSkills).map(skill => {
      let status: 'strong' | 'weak' | 'missing' = 'missing';
      if (analysis.strongSkills.includes(skill)) status = 'strong';
      else if (analysis.weakSkills.includes(skill)) status = 'weak';

      return {
        name: skill,
        score: assessmentResult[skill] || 0,
        status,
      };
    });
  }, [analysis, assessmentResult]);


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Analyzing your results...</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-semibold">Could not load analysis</h2>
        <p className="text-muted-foreground mt-2">There was an issue generating your detailed analysis.</p>
        <Button onClick={() => navigate('/assessment')} className="mt-4">Go Back</Button>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Analysis Results</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your placement readiness breakdown for {jobTitle || "the selected role"}.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score */}
        <div className="rounded-[12px] shadow-card p-1">
          <div className="rounded-[8px] bg-card p-6 flex flex-col items-center">
            <ReadinessGauge score={analysis.overallScore} size={180} />
            <div className="mt-4 grid grid-cols-3 gap-4 w-full text-center">
              <div>
                <p className="text-lg font-bold tabular-nums text-success">{analysis.strongSkills.length}</p>
                <p className="text-xs text-muted-foreground">Strong</p>
              </div>
              <div>
                <p className="text-lg font-bold tabular-nums text-warning">{analysis.weakSkills.length}</p>
                <p className="text-xs text-muted-foreground">Weak</p>
              </div>
              <div>
                <p className="text-lg font-bold tabular-nums text-danger">{analysis.missingSkills.length}</p>
                <p className="text-xs text-muted-foreground">Missing</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="lg:col-span-2 rounded-[12px] shadow-card p-1">
          <div className="rounded-[8px] bg-card p-6">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Skill Scores
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={skillData} layout="vertical" margin={{ left: 80 }}>
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} width={80} />
                <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20}>
                  {skillData.map((entry, i) => (
                    <Cell key={i} fill={getBarColor(entry.status)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Skills list */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-success uppercase tracking-wider px-1">Strong Skills</h3>
          {skillData.filter(s => s.status === "strong").map(s => (
            <GapCard key={s.name} skill={s.name} status="strong" score={s.score} />
          ))}
        </div>
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-warning uppercase tracking-wider px-1">Weak Skills</h3>
          {skillData.filter(s => s.status === "weak").map(s => (
            <GapCard key={s.name} skill={s.name} status="weak" score={s.score} />
          ))}
        </div>
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-danger uppercase tracking-wider px-1">Missing Skills</h3>
          {skillData.filter(s => s.status === "missing").map(s => (
            <GapCard key={s.name} skill={s.name} status="missing" score={s.score} />
          ))}
        </div>
      </div>

      {/* AI Feedback */}
      <div className="rounded-[12px] shadow-card p-1">
        <div className="rounded-[8px] bg-card p-6">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Lightbulb className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">AI Feedback</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                {analysis.feedback}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
