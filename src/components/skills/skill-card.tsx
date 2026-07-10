"use client";

import { SKILL_CATEGORY_LABELS } from "@/types/analysis";
import type { DetectedSkill } from "@/types/analysis";
import type { Skill } from "@/hooks/use-skills";
import { calculateLevel, getLevelTier } from "@/lib/xp";

function getCategory(category: string): DetectedSkill["category"] {
  return category in SKILL_CATEGORY_LABELS ? (category as DetectedSkill["category"]) : "other";
}

export function SkillCard({ skill }: { skill: Skill }) {
  const { level, progressPercent, currentLevelXp, xpForNextLevel } = calculateLevel(skill.xp);
  const category = getCategory(skill.category);
  const label = SKILL_CATEGORY_LABELS[category] || skill.category || "Skill";
  const tier = getLevelTier(level);

  return (
    <div 
      className="glass-panel glass-panel-interactive p-5 rounded-md flex flex-col justify-between gap-4 group transition-all duration-300 relative overflow-hidden"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="font-headline-sm text-headline-sm text-primary group-hover:text-primary-fixed truncate transition-colors">
            {skill.name.toUpperCase()}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-label-caps text-[10px] text-tertiary-container border border-tertiary-container/30 bg-tertiary-container/10 px-2 py-0.5 rounded tracking-widest">
              {label.toUpperCase()}
            </span>
            <span className="font-label-caps text-[10px] text-secondary tracking-widest">
              {tier.name.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Glowing Level Badge */}
        <div className="w-12 h-12 rounded-full border border-primary/50 glass-panel flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(34,211,238,0.3)] group-hover:shadow-[0_0_20px_rgba(34,211,238,0.6)] group-hover:scale-105 transition-all bg-primary/10">
          <span className="font-data-mono text-base text-primary font-bold">
            {level}
          </span>
        </div>
      </div>

      <div className="space-y-2 pt-2 border-t border-primary/20">
        <div className="flex items-center justify-between font-data-mono text-xs text-outline">
          <span>{currentLevelXp.toLocaleString()} / {xpForNextLevel.toLocaleString()} XP</span>
          <span className="text-primary font-bold neon-text">{progressPercent}%</span>
        </div>

        <div className="progress-bar-container h-2 w-full">
          <div
            className="progress-bar-fill shimmer-effect"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-[10px] font-data-mono text-outline-variant pt-1">
          <span>TOTAL XP ACCUMULATED</span>
          <span className="text-on-surface font-bold">{skill.xp.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
