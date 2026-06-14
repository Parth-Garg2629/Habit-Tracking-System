"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Trash2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Quest } from "@/types/quests";

interface QuestItemProps {
  quest: Quest;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export function QuestItem({ quest, onComplete, onDelete }: QuestItemProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showXp, setShowXp] = useState(false);

  const handleComplete = () => {
    if (quest.completedToday) return;
    setIsAnimating(true);
    setShowXp(true);
    onComplete(quest.id);

    setTimeout(() => setIsAnimating(false), 600);
    setTimeout(() => setShowXp(false), 1500);
  };

  return (
    <div
      className={cn(
        "group relative flex items-center gap-4 rounded-xl border p-4 transition-all duration-300",
        quest.completedToday
          ? "border-emerald-500/20 bg-emerald-500/5"
          : "border-border bg-card hover:border-primary/30 hover:bg-card/80"
      )}
    >
      {/* Completion checkbox */}
      <Checkbox
        checked={quest.completedToday}
        onCheckedChange={handleComplete}
        disabled={quest.completedToday}
        className={cn(
          "transition-all duration-300",
          quest.completedToday && "border-emerald-500 bg-emerald-500"
        )}
      />

      {/* Quest content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-sm font-medium transition-all duration-300",
              quest.completedToday && "text-muted-foreground line-through"
            )}
          >
            {quest.title}
          </span>
          {quest.completedToday && (
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 animate-in fade-in-0 zoom-in-95 duration-300" />
          )}
        </div>
        {quest.description && (
          <p className="mt-0.5 text-xs text-muted-foreground/70 truncate">
            {quest.description}
          </p>
        )}
      </div>

      {/* XP reward badge */}
      <div className="relative flex items-center gap-2">
        {/* Floating XP animation */}
        {showXp && (
          <span className="absolute -top-6 right-0 text-xs font-bold text-emerald-400 animate-bounce">
            +{quest.xpReward} XP
          </span>
        )}

        <Badge
          variant={quest.completedToday ? "success" : "secondary"}
          className={cn(
            "gap-1 transition-all duration-300",
            isAnimating && "scale-110"
          )}
        >
          <Sparkles className="h-3 w-3" />
          {quest.xpReward} XP
        </Badge>

        {/* Delete button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(quest.id);
          }}
          className="h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground/40 opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
          title="Delete quest"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
