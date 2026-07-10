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
        "glass system-border",
        "hover:bg-violet-900/40 hover:border-cyan-400/60 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]",
        "hover:-translate-y-1 transition-all duration-300"
      )}
    >
      <CardHeader className="pb-3 pt-5">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-base truncate font-semibold text-cyan-400" title={`[ ${skill.name} ]`}>
              [ {skill.name} ]
            </CardTitle>
            <Badge className={cn("mt-1.5 text-[10px] px-1.5 py-0 border-0 rounded-none text-white bg-transparent opacity-80", colorClass)}>
              [ {label} ]
            </Badge>
          </div>

          {/* Glowing angular level indicator */}
          <div className="relative flex-shrink-0">
            <div
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-none",
                "bg-violet-950/50 border border-cyan-400/30",
                "shadow-[0_0_12px_rgba(34,211,238,0.25)]",
                "group-hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]",
                "transition-shadow duration-300"
              )}
            >
              <span className={cn("text-lg font-bold text-cyan-400")}>
                {level}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-2 mt-1">
          {/* Tier label */}
          <span className={cn("text-[10px] font-medium text-cyan-200")}>
            [ {tier.name} ]
          </span>

          <div className="flex items-center justify-between text-xs text-cyan-100/70">
            <span>{currentLevelXp.toLocaleString()} / {xpForNextLevel.toLocaleString()} XP</span>
            <span className="font-medium text-cyan-400">{progressPercent}%</span>
          </div>

          {/* Progress bar with thin cyan line */}
          <div className="relative h-[2px] w-full overflow-hidden rounded-none bg-violet-950/80">
            <div
              className="h-[2px] rounded-none bg-cyan-400 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="text-right text-[10px] text-cyan-100/50 mt-1">
            Total XP: <span className="text-cyan-100/80">{skill.xp.toLocaleString()}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
