import { BookOpen, CheckCircle2, Flame, Trophy } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { QuestWidget } from "@/components/quests/quest-widget";

const skills = [
  { name: "Mathematics", progress: 68 },
  { name: "Programming", progress: 54 },
  { name: "Writing", progress: 42 }
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Today</p>
        <h1 className="text-3xl font-semibold tracking-normal">Dashboard</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Current Level" value="7" icon={Trophy} detail="430 XP to next level" />
        <StatCard title="Daily Streak" value="14" icon={Flame} detail="Consistency is compounding" />
        <StatCard title="Quests Done" value="3/5" icon={CheckCircle2} detail="Two still open today" />
        <StatCard title="Learning Time" value="6.5h" icon={BookOpen} detail="Tracked this week" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <QuestWidget />

        <Card>
          <CardHeader>
            <CardTitle>Skill Growth</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {skills.map((skill) => (
              <div key={skill.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{skill.name}</span>
                  <span className="text-muted-foreground">{skill.progress}%</span>
                </div>
                <Progress value={skill.progress} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
