"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
    <div className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      {/* Summary card */}
      <Card className="border-purple-500/20 bg-purple-500/5">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/15 text-purple-400">
              <Brain className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-base">AI Analysis</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Review the analysis and confirm to earn XP
              </p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-purple-500/15 px-3 py-1.5">
              <Sparkles className="h-3.5 w-3.5 text-purple-400" />
              <span className="text-sm font-bold text-purple-400">
                +{analysis.totalXpSuggested} XP
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Summary */}
          <div className="rounded-lg bg-background/50 p-3 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <MessageSquareText className="h-3 w-3" />
              Summary
            </div>
            <p className="text-sm leading-relaxed">{analysis.summary}</p>
          </div>

          {/* Encouragement */}
          <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/10 p-3">
            <p className="text-sm text-emerald-400 italic">
              &ldquo;{analysis.encouragement}&rdquo;
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Detected skills */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <TrendingUp className="h-4 w-4" />
            </div>
            <CardTitle className="text-base">
              Detected Skills ({analysis.detectedSkills.length})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {analysis.detectedSkills.map((skill, idx) => (
            <SkillRow key={`${skill.name}-${idx}`} skill={skill} />
          ))}
        </CardContent>
      </Card>

      {/* Confirm / Reject actions */}
      <div className="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-card p-4">
        <p className="text-sm text-muted-foreground">
          Accept these results to earn{" "}
          <span className="font-semibold text-purple-400">
            {analysis.totalXpSuggested} XP
          </span>{" "}
          and update your skills?
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onReject}
            disabled={isConfirming}
            className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-50"
          >
            <X className="h-3.5 w-3.5" />
            Discard
          </button>
          <button
            onClick={onConfirm}
            disabled={isConfirming}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-500 disabled:opacity-50"
          >
            {isConfirming ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Check className="h-3.5 w-3.5" />
            )}
            {isConfirming ? "Applying..." : "Confirm & Earn XP"}
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
    <div className="flex items-center gap-3 rounded-lg border border-border/30 bg-secondary/20 p-3 transition-colors hover:bg-secondary/40">
      {/* Skill name + category */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium truncate">{skill.name}</span>
          <Badge
            className={cn(
              "text-[10px] px-1.5 py-0 border-0 shrink-0",
              colorClass
            )}
          >
            {SKILL_CATEGORY_LABELS[skill.category]}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">
          {skill.reasoning}
        </p>
      </div>

      {/* Confidence bar */}
      <div className="w-20 shrink-0 space-y-1">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span>Conf.</span>
          <span>{confidencePercent}%</span>
        </div>
        <Progress
          value={confidencePercent}
          className={cn(
            "h-1.5",
            confidencePercent >= 70 && "[&>div]:bg-emerald-500",
            confidencePercent >= 40 && confidencePercent < 70 && "[&>div]:bg-amber-500",
            confidencePercent < 40 && "[&>div]:bg-zinc-500"
          )}
        />
      </div>

      {/* XP badge */}
      <div className="flex items-center gap-1 shrink-0 rounded-full bg-primary/10 px-2.5 py-1">
        <ArrowUp className="h-3 w-3 text-primary" />
        <span className="text-xs font-bold text-primary">{skill.xpSuggested}</span>
      </div>
    </div>
  );
}
