"use client";

import {
  Sparkles,
  Check,
  X,
  Loader2,
  Brain,
  TrendingUp,
  ArrowUp,
  MessageSquareText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AiAnalysisResult, DetectedSkill } from "@/types/analysis";
import { SKILL_CATEGORY_LABELS, SKILL_CATEGORY_COLORS } from "@/types/analysis";

interface AnalysisResultCardProps {
  analysis: AiAnalysisResult;
  onConfirm: () => void;
  onReject: () => void;
  isConfirming: boolean;
}

export function AnalysisResultCard({
  analysis,
  onConfirm,
  onReject,
  isConfirming,
}: AnalysisResultCardProps) {
  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      {/* Summary card */}
      <div className="glass-panel border-secondary/40 bg-secondary/5 p-6 rounded-lg space-y-5 shadow-[0_0_20px_rgba(208,188,255,0.15)]">
        <div className="flex items-center justify-between border-b border-secondary/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-secondary/15 text-secondary border border-secondary/30 shadow-[0_0_10px_rgba(208,188,255,0.3)]">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-secondary">AI NEURAL ANALYSIS COMPLETE</h3>
              <p className="font-data-mono text-xs text-outline mt-0.5">
                Verify synthesized telemetry and synchronize XP with core matrix
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded border border-primary/40 bg-primary/10 px-3 py-1.5 shadow-[0_0_12px_rgba(34,211,238,0.3)]">
            <Sparkles className="h-4 w-4 text-primary animate-spin" style={{ animationDuration: "6s" }} />
            <span className="font-data-mono text-sm font-bold text-primary">
              +{analysis.totalXpSuggested} XP
            </span>
          </div>
        </div>

        {/* Summary */}
        <div className="rounded bg-background/60 border border-primary/20 p-4 space-y-2">
          <div className="flex items-center gap-2 font-data-mono text-xs font-bold text-primary">
            <MessageSquareText className="h-3.5 w-3.5" />
            [ TELEMETRY SUMMARY ]
          </div>
          <p className="font-data-mono text-sm text-on-surface leading-relaxed">{analysis.summary}</p>
        </div>

        {/* Encouragement */}
        <div className="rounded bg-success/10 border border-success/30 p-4 shadow-[0_0_10px_rgba(74,222,128,0.1)]">
          <p className="font-data-mono text-sm text-success italic">
            &ldquo;{analysis.encouragement}&rdquo;
          </p>
        </div>
      </div>

      {/* Detected skills */}
      <div className="glass-panel p-6 rounded-lg space-y-4">
        <div className="flex items-center justify-between border-b border-primary/20 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/15 text-primary border border-primary/30">
              <TrendingUp className="h-4 w-4" />
            </div>
            <h3 className="font-headline-sm text-headline-sm text-primary">
              SYNTHESIZED SKILLS ({analysis.detectedSkills.length})
            </h3>
          </div>
          <span className="font-data-mono text-xs text-outline">[ LEVEL PROGRESSION TARGETS ]</span>
        </div>

        <div className="space-y-3 pt-1">
          {analysis.detectedSkills.map((skill, idx) => (
            <SkillRow key={`${skill.name}-${idx}`} skill={skill} />
          ))}
        </div>
      </div>

      {/* Confirm / Reject actions */}
      <div className="glass-panel p-5 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 border-l-4 border-l-primary">
        <div>
          <p className="font-data-mono text-sm text-on-surface">
            SYNCHRONIZE PROTOCOL: Accept neural findings to inject{" "}
            <span className="font-bold text-primary neon-text">
              +{analysis.totalXpSuggested} XP
            </span>{" "}
            into character status?
          </p>
          <p className="font-data-mono text-xs text-outline mt-0.5">
            Skill matrices will be updated immediately upon confirmation.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-end">
          <button
            onClick={onReject}
            disabled={isConfirming}
            className="flex items-center justify-center gap-2 rounded border border-outline/30 px-4 py-2.5 font-data-mono text-xs font-bold text-outline hover:border-error hover:text-error hover:bg-error/10 transition-all disabled:opacity-50"
          >
            <X className="h-4 w-4" />
            DISCARD
          </button>
          <button
            onClick={onConfirm}
            disabled={isConfirming}
            className="flex items-center justify-center gap-2 rounded bg-primary text-background px-6 py-2.5 font-data-mono text-xs font-bold shadow-[0_0_15px_rgba(34,211,238,0.4)] hover:bg-primary-fixed hover:scale-105 transition-all disabled:opacity-50"
          >
            {isConfirming ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                SYNCHRONIZING...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                CONFIRM &amp; INJECT XP
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function SkillRow({ skill }: { skill: DetectedSkill }) {
  const colorClass = SKILL_CATEGORY_COLORS[skill.category] || SKILL_CATEGORY_COLORS.other;
  const confidencePercent = Math.round(skill.confidence * 100);

  return (
    <div className="glass-panel p-4 rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-primary/20 hover:border-primary/50 transition-all">
      {/* Skill name + category */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2.5">
          <span className="font-headline-sm text-sm text-primary font-bold truncate">{skill.name.toUpperCase()}</span>
          <span
            className={cn(
              "font-label-caps text-[10px] px-2 py-0.5 rounded border border-white/10 shrink-0 uppercase tracking-wider text-white",
              colorClass
            )}
          >
            {SKILL_CATEGORY_LABELS[skill.category] || skill.category}
          </span>
        </div>
        <p className="font-data-mono text-xs text-outline mt-1 leading-normal">
          {skill.reasoning}
        </p>
      </div>

      {/* Confidence bar */}
      <div className="w-full sm:w-28 shrink-0 space-y-1">
        <div className="flex items-center justify-between font-data-mono text-[10px] text-outline">
          <span>CONFIDENCE</span>
          <span className="text-primary font-bold">{confidencePercent}%</span>
        </div>
        <div className="progress-bar-container h-1.5 w-full">
          <div
            className={cn(
              "progress-bar-fill",
              confidencePercent >= 70 && "bg-success shadow-[0_0_5px_#4ade80]",
              confidencePercent >= 40 && confidencePercent < 70 && "bg-tertiary-container",
              confidencePercent < 40 && "bg-outline"
            )}
            style={{ width: `${confidencePercent}%` }}
          />
        </div>
      </div>

      {/* XP badge */}
      <div className="flex items-center gap-1.5 shrink-0 rounded bg-primary/10 border border-primary/30 px-3 py-1.5 shadow-[0_0_8px_rgba(34,211,238,0.2)]">
        <ArrowUp className="h-3.5 w-3.5 text-primary" />
        <span className="font-data-mono text-xs font-bold text-primary">+{skill.xpSuggested} XP</span>
      </div>
    </div>
  );
}
