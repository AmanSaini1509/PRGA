import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Roadmap = () => {
  const { roadmap, jobTitle } = useUser();
  const navigate = useNavigate();

  if (!roadmap || roadmap.length === 0) {
    return (
      <div className="text-center max-w-xl mx-auto">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">No Roadmap Generated</h1>
        <p className="text-md text-muted-foreground mt-2">
          Complete the analysis process to get your personalized study roadmap.
        </p>
        <Button onClick={() => navigate('/resume-upload')} className="mt-6">
          Start Analysis
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Your Personalized Roadmap</h1>
        <p className="text-sm text-muted-foreground mt-1">
          A step-by-step plan to close your skill gaps for {jobTitle || "your target role"}.
        </p>
      </div>

      <div className="space-y-4">
        {roadmap.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3, ease: [0.2, 0, 0, 1] }}
            className="rounded-[12px] shadow-card p-1"
          >
            <div className="rounded-[8px] bg-card p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                  <span className="text-sm font-bold text-primary">{i + 1}</span>
                </div>
                <p className="text-sm text-foreground leading-relaxed mt-1">
                  {step}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="text-center pt-4">
          <Button onClick={() => navigate('/analysis')}>
              Back to Analysis
              <ArrowRight className="h-4 w-4 ml-2"/>
          </Button>
      </div>
    </div>
  );
};

export default Roadmap;
