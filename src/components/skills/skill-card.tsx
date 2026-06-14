"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SKILL_CATEGORY_LABELS, SKILL_CATEGORY_COLORS } from "@/types/analysis";
import type { DetectedSkill } from "@/types/analysis";
import type { Skill } from "@/hooks/use-skills";
import { calculateLevel } from "@/lib/xp";
import { cn } from "@/lib/utils";

function getCategory(category: string): DetectedSkill["category"] {
  return category in SKILL_CATEGORY_LABELS ? (category as DetectedSkill["category"]) : "other";
}

export function SkillCard({ skill }: { skill: Skill }) {
  const { level, progressPercent, currentLevelXp, xpForNextLevel } = calculateLevel(skill.xp);
  const category = getCategory(skill.category);
  const colorClass = SKILL_CATEGORY_COLORS[category];
  const label = SKILL_CATEGORY_LABELS[category] || skill.category || "Skill";

  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base truncate" title={skill.name}>
              {skill.name}
            </CardTitle>
            <Badge className={cn("mt-1.5 text-[10px] px-1.5 py-0 border-0", colorClass)}>
              {label}
            </Badge>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-lg font-bold text-primary">
            {level}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1.5 mt-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{currentLevelXp.toLocaleString()} / {xpForNextLevel.toLocaleString()} XP</span>
            <span>{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
          <p className="text-right text-[10px] text-muted-foreground mt-1">
            Total XP: {skill.xp.toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
