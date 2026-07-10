"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SKILL_CATEGORY_LABELS, SKILL_CATEGORY_COLORS } from "@/types/analysis";
import type { DetectedSkill } from "@/types/analysis";
import type { Skill } from "@/hooks/use-skills";
import { calculateLevel, getLevelTier } from "@/lib/xp";
import { cn } from "@/lib/utils";

function getCategory(category: string): DetectedSkill["category"] {
  return category in SKILL_CATEGORY_LABELS ? (category as DetectedSkill["category"]) : "other";
}

export function SkillCard({ skill }: { skill: Skill }) {
  const { level, progressPercent, currentLevelXp, xpForNextLevel } = calculateLevel(skill.xp);
  const category = getCategory(skill.category);
  const colorClass = SKILL_CATEGORY_COLORS[category];
  const label = SKILL_CATEGORY_LABELS[category] || skill.category || "Skill";
  const tier = getLevelTier(level);

  return (
    <Card
      className={cn(
        "group relative overflow-hidden rounded-none",
        "bg-card/60 backdrop-blur-xl border border-white/[0.06]",
        "hover:bg-card/80 hover:border-white/[0.1] hover:shadow-lg hover:shadow-primary/5",
        "hover:-translate-y-1 transition-all duration-300"
      )}
    >
      {/* Gradient accent bar at top */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-primary opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

      <CardHeader className="pb-3 pt-5">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-base truncate font-semibold" title={skill.name}>
              {skill.name}
            </CardTitle>
            <Badge className={cn("mt-1.5 text-[10px] px-1.5 py-0 border-0 rounded-none", colorClass)}>
              {label}
            </Badge>
          </div>

          {/* Glowing angular level indicator */}
          <div className="relative flex-shrink-0">
            <div
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-none",
                "bg-primary/10 border border-primary/30",
                "shadow-[0_0_12px_rgba(16,185,129,0.25)]",
                "group-hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]",
                "transition-shadow duration-300"
              )}
            >
              <span className={cn("text-lg font-bold", tier.color)}>
                {level}
              </span>
            </div>
            {/* Subtle glow ring */}
            <div className="absolute inset-0 rounded-none bg-primary/5 blur-md -z-10" />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-2 mt-1">
          {/* Tier label */}
          <span className={cn("text-[10px] font-medium", tier.color)}>
            {tier.name}
          </span>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{currentLevelXp.toLocaleString()} / {xpForNextLevel.toLocaleString()} XP</span>
            <span className="font-medium text-foreground/70">{progressPercent}%</span>
          </div>

          {/* Progress bar with sharp fill effect */}
          <div className="relative h-2 w-full overflow-hidden rounded-none bg-secondary/50">
            <div
              className="h-full rounded-none bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
            {/* Shimmer effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-x-full group-hover:translate-x-full" style={{ transitionDuration: "1s" }} />
          </div>

          <p className="text-right text-[10px] text-muted-foreground/70 mt-1">
            Total XP: <span className="text-muted-foreground">{skill.xp.toLocaleString()}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
