import { motion } from "framer-motion";

interface ReadinessGaugeProps {
  score: number;
  size?: number;
}

const ReadinessGauge = ({ score, size = 200 }: ReadinessGaugeProps) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (score >= 70) return "hsl(var(--success))";
    if (score >= 40) return "hsl(var(--warning))";
    return "hsl(var(--danger))";
  };

  return (
    <div className="relative inline-flex flex-col items-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle
          cx="50" cy="50" r={radius}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="8"
        />
        <motion.circle
          cx="50" cy="50" r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: [0.2, 0, 0, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-5xl font-bold tracking-tighter tabular-nums text-foreground"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4, ease: [0.2, 0, 0, 1] }}
        >
          {score}%
        </motion.span>
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest mt-1">
          Readiness
        </span>
      </div>
    </div>
  );
};

export default ReadinessGauge;
