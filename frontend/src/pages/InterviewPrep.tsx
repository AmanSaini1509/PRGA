import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const interviewQuestions = [
  {
    id: 1,
    category: "Data Structures",
    question: "What is the difference between an Array and a Linked List?",
    options: [
      "Arrays have fixed size, Linked Lists are dynamic",
      "Arrays are slower than Linked Lists in all operations",
      "Linked Lists support random access",
      "There is no difference",
    ],
    correct: 0,
    explanation:
      "Arrays have fixed size and support random access (O(1)), while Linked Lists are dynamic in size but require O(n) for random access.",
  },
  {
    id: 2,
    category: "SQL",
    question: "What is the difference between INNER JOIN and LEFT JOIN?",
    options: [
      "They are the same",
      "INNER JOIN returns only matching rows; LEFT JOIN returns all rows from the left table",
      "LEFT JOIN is faster than INNER JOIN",
      "INNER JOIN works only with primary keys",
    ],
    correct: 1,
    explanation:
      "INNER JOIN returns rows that have matching values in both tables. LEFT JOIN returns all rows from the left table and matched rows from the right table.",
  },
  {
    id: 3,
    category: "System Design",
    question: "What is the purpose of a load balancer?",
    options: [
      "To store data across servers",
      "To distribute network traffic across multiple servers",
      "To encrypt network traffic",
      "To compile code faster",
    ],
    correct: 1,
    explanation:
      "A load balancer distributes incoming network traffic across multiple servers to ensure no single server bears too much demand, improving reliability and performance.",
  },
  {
    id: 4,
    category: "Docker",
    question: "What is the difference between a Docker image and a container?",
    options: [
      "They are the same thing",
      "An image is a running instance, a container is the blueprint",
      "An image is the blueprint, a container is a running instance",
      "Images can only run on Linux",
    ],
    correct: 2,
    explanation:
      "A Docker image is a read-only template (blueprint) used to create containers. A container is a running instance of an image.",
  },
];

const InterviewPrep = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Set<number>>(new Set());

  const handleAnswer = (qId: number, optionIndex: number) => {
    if (revealedAnswers.has(qId)) return;
    setSelectedAnswers({ ...selectedAnswers, [qId]: optionIndex });
  };

  const revealAnswer = (qId: number) => {
    setRevealedAnswers(new Set([...revealedAnswers, qId]));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Interview Prep</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Practice role-based questions and get instant feedback.
        </p>
      </div>

      <div className="space-y-4">
        {interviewQuestions.map((q, i) => {
          const answered = selectedAnswers[q.id] !== undefined;
          const revealed = revealedAnswers.has(q.id);
          const isCorrect = selectedAnswers[q.id] === q.correct;

          return (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3, ease: [0.2, 0, 0, 1] }}
              className="rounded-[12px] shadow-card p-1"
            >
              <div className="rounded-[8px] bg-card p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                    {q.category}
                  </span>
                </div>
                <p className="text-sm font-medium text-foreground leading-relaxed">{q.question}</p>

                <div className="mt-4 space-y-2">
                  {q.options.map((opt, j) => {
                    let optionClass = "bg-secondary text-foreground hover:bg-secondary/80";
                    if (revealed) {
                      if (j === q.correct) optionClass = "bg-success/10 text-success ring-1 ring-success/20";
                      else if (j === selectedAnswers[q.id]) optionClass = "bg-danger/10 text-danger ring-1 ring-danger/20";
                      else optionClass = "bg-secondary/50 text-muted-foreground";
                    } else if (selectedAnswers[q.id] === j) {
                      optionClass = "bg-primary/10 text-primary ring-1 ring-primary/30";
                    }

                    return (
                      <button
                        key={j}
                        onClick={() => handleAnswer(q.id, j)}
                        className={`w-full text-left p-3 rounded-lg text-sm transition-smooth ${optionClass}`}
                      >
                        <span className="text-muted-foreground mr-2 tabular-nums">
                          {String.fromCharCode(65 + j)}.
                        </span>
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {answered && !revealed && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => revealAnswer(q.id)}
                  >
                    Check Answer
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </Button>
                )}

                {revealed && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-secondary"
                  >
                    {isCorrect ? (
                      <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-4 w-4 text-danger flex-shrink-0 mt-0.5" />
                    )}
                    <p className="text-sm text-muted-foreground leading-relaxed">{q.explanation}</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default InterviewPrep;
