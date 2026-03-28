import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Clock, Loader2 } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { generateAssessmentApi, submitAssessmentApi } from "@/api/ApiHub";
import { toast } from "sonner";

interface Question {
  question: string;
  options: Record<string, string>;
  answer: string;
  skill: string;
}

const Assessment = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const { userSkills, requiredSkills, jobTitle } = useUser();

  useEffect(() => {
    const fetchAssessment = async () => {
      if (userSkills.length === 0) { // Only userSkills are needed for generating questions
        toast.error("No user skills found", {
          description: "Please upload a resume first to generate assessment questions.",
        });
        navigate("/upload"); // Navigate back to resume upload
        return;
      }

      setIsLoading(true);
      try {
        const data = await generateAssessmentApi(userSkills); // Pass only userSkills
        setQuestions(data.questions);
      } catch (error: any) {
        toast.error("Failed to generate assessment", {
          description: error.message,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssessment();
  }, [userSkills, navigate]); // Depend only on userSkills

  const selectAnswer = (optionKey: string) => {
    setAnswers({ ...answers, [current]: optionKey });
  };

  const handleSubmit = async () => {
    const formattedAnswers = {
      answers: questions.map((q, i) => ({
        question: q.question,
        skill: q.skill,
        selected: answers[i],
        answer: q.answer,
      })),
    };

    try {
      const result = await submitAssessmentApi(formattedAnswers); // result will contain skillScores
      navigate("/analysis", {
        state: {
          userSkills,
          requiredSkills,
          jobTitle,
          assessmentResult: result.skillScores, // Pass skillScores
        },
      });
    } catch (error: any) {
      toast.error("Failed to submit assessment",
        {
          description: error.message,
        });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Generating your assessment...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-semibold">Could not generate assessment</h2>
        <p className="text-muted-foreground mt-2">There was an issue generating questions based on your skills.</p>
        <Button onClick={() => navigate('/upload')} className="mt-4">Upload Resume</Button>
      </div>
    )
  }

  const q = questions[current];
  const progress = (Object.keys(answers).length / questions.length) * 100;
  const optionKeys = Object.keys(q.options);


  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Progress bar */}
      <div className="h-0.5 bg-border rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
        />
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Assessment: {jobTitle}</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span className="tabular-nums">
            {current + 1} / {questions.length}
          </span>
        </div>
      </div>

      <div className="rounded-[12px] shadow-card p-1">
        <div className="rounded-[8px] bg-card p-6 lg:p-8">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
          >
            <p className="text-lg leading-relaxed text-foreground max-w-[65ch]">
              {q.question}
            </p>

            <div className="mt-6 space-y-3">
              {optionKeys.map((key) => (
                <button
                  key={key}
                  onClick={() => selectAnswer(key)}
                  className={`w-full text-left p-4 rounded-lg text-sm font-medium transition-smooth ${answers[current] === key
                      ? "bg-primary/10 text-primary ring-1 ring-primary/30"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                    }`}
                >
                  <span className="text-muted-foreground mr-3 tabular-nums">
                    {key}.
                  </span>
                  {q.options[key]}
                </button>
              ))}
            </div>
          </motion.div>

          <div className="flex items-center justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrent(Math.max(0, current - 1))}
              disabled={current === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            {current < questions.length - 1 ? (
              <Button onClick={() => setCurrent(current + 1)} disabled={answers[current] === undefined}>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={() => setShowConfirm(true)} disabled={answers[current] === undefined}>
                Submit Assessment
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Question nav dots */}
      <div className="flex justify-center gap-2">
        {questions.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 w-2 rounded-full transition-smooth ${i === current
                ? "bg-primary w-6"
                : answers[i] !== undefined
                  ? "bg-primary/40"
                  : "bg-border"
              }`}
          />
        ))}
      </div>

      {/* Confirm dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-[12px] shadow-card p-1 bg-card max-w-sm w-full mx-4"
          >
            <div className="rounded-[8px] bg-card p-6 text-center">
              <h2 className="text-lg font-semibold text-foreground">Submit Assessment?</h2>
              <p className="text-sm text-muted-foreground mt-2">
                You've answered {Object.keys(answers).length} of {questions.length} questions. Are you sure?
              </p>
              <div className="flex gap-3 mt-6">
                <Button variant="outline" className="flex-1" onClick={() => setShowConfirm(false)}>
                  Review
                </Button>
                <Button className="flex-1" onClick={handleSubmit}>
                  Submit
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Assessment;
