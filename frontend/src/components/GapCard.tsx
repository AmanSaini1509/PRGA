import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

type SkillStatus = "strong" | "weak" | "missing";

interface GapCardProps {
  skill: string;
  status: SkillStatus;
  score?: number;
  onClick?: () => void;
}

const statusConfig = {
  strong: {
    icon: CheckCircle2,
    bg: "bg-success/5",
    dot: "bg-success",
    label: "Strong",
    labelColor: "text-success",
  },
  weak: {
    icon: AlertTriangle,
    bg: "bg-warning/5",
    dot: "bg-warning",
    label: "Weak",
    labelColor: "text-warning",
  },
  missing: {
    icon: XCircle,
    bg: "bg-danger/5",
    dot: "bg-danger",
    label: "Missing",
    labelColor: "text-danger",
  },
};

const GapCard = ({ skill, status, score, onClick }: GapCardProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -1 }}
      className={`w-full text-left rounded-[12px] shadow-card hover:shadow-card-hover transition-smooth p-1`}
    >
      <div className={`rounded-[8px] p-4 ${config.bg}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`h-2 w-2 rounded-full ${config.dot}`} />
            <span className="text-sm font-medium text-foreground">{skill}</span>
          </div>
          <div className="flex items-center gap-2">
            {score !== undefined && (
              <span className="text-sm tabular-nums text-muted-foreground">{score}%</span>
            )}
            <span className={`text-xs font-medium ${config.labelColor}`}>{config.label}</span>
          </div>
        </div>
      </div>
    </motion.button>
  );
};

export default GapCard;
