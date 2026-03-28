import ReadinessGauge from "@/components/ReadinessGauge";
import GapCard from "@/components/GapCard";
import { ArrowUpRight, TrendingUp, BookOpen, Target } from "lucide-react";

const mockSkills = {
  strong: [
    { skill: "JavaScript", score: 88 },
    { skill: "React.js", score: 82 },
    { skill: "HTML/CSS", score: 90 },
  ],
  weak: [
    { skill: "Data Structures", score: 55 },
    { skill: "SQL", score: 48 },
  ],
  missing: [
    { skill: "System Design", score: 0 },
    { skill: "Docker", score: 0 },
  ],
};

const stats = [
  { label: "Assessments", value: "3", icon: Target, change: "+1 this week" },
  { label: "Skills Tracked", value: "12", icon: TrendingUp, change: "7 strong" },
  { label: "Study Hours", value: "24", icon: BookOpen, change: "+6h this week" },
];

const Dashboard = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome back, Alex</h1>
        <p className="text-sm text-muted-foreground mt-1">
          You are 64% ready for a Backend Engineering role.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-[12px] shadow-card p-1">
            <div className="rounded-[8px] bg-card p-4">
              <div className="flex items-center justify-between">
                <stat.icon className="h-4 w-4 text-muted-foreground" />
                <ArrowUpRight className="h-3 w-3 text-success" />
              </div>
              <p className="text-2xl font-bold tabular-nums text-foreground mt-3">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              <p className="text-xs text-success mt-1">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Readiness Score */}
        <div className="rounded-[12px] shadow-card p-1">
          <div className="rounded-[8px] bg-card p-6 flex flex-col items-center">
            <ReadinessGauge score={64} />
            <p className="text-sm text-muted-foreground mt-4">
              +8% since last assessment
            </p>
          </div>
        </div>

        {/* Skill Breakdown */}
        <div className="lg:col-span-2 rounded-[12px] shadow-card p-1">
          <div className="rounded-[8px] bg-card p-6">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Skill Breakdown
            </h2>
            <div className="space-y-2">
              {mockSkills.strong.map((s) => (
                <GapCard key={s.skill} skill={s.skill} status="strong" score={s.score} />
              ))}
              {mockSkills.weak.map((s) => (
                <GapCard key={s.skill} skill={s.skill} status="weak" score={s.score} />
              ))}
              {mockSkills.missing.map((s) => (
                <GapCard key={s.skill} skill={s.skill} status="missing" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
