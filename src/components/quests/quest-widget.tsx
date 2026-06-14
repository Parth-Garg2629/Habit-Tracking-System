"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Loader2, Sparkles, Swords, Wand2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useQuests } from "@/hooks/use-quests";
import { cn } from "@/lib/utils";

function formatReset(resetAt: string | null) {
  if (!resetAt) return "midnight UTC";

  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(resetAt));
}

export function QuestWidget() {
  const {
    quests,
    completedToday,
    totalDaily,
    progressPercent,
    resetAt,
    loading,
    completeQuest,
    seedQuests,
  } = useQuests();

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  const allComplete = totalDaily > 0 && completedToday >= totalDaily;
  const displayedQuests = quests.slice(0, 5);
  const remaining = quests.length - displayedQuests.length;

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-500",
        allComplete && "border-emerald-500/30 shadow-emerald-500/5"
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors",
                allComplete ? "bg-emerald-500/15 text-emerald-400" : "bg-primary/15 text-primary"
              )}
            >
              <Swords className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-base">Daily Quests</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">
                Resets at {formatReset(resetAt)}
              </p>
            </div>
          </div>
          <Link
            href="/daily-log"
            className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-primary"
          >
            View all
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {completedToday}/{totalDaily} completed
            </span>
            <Badge
              variant={allComplete ? "success" : progressPercent >= 50 ? "default" : "secondary"}
              className="gap-1 px-2 py-0.5 text-[10px]"
            >
              <Sparkles className="h-2.5 w-2.5" />
              {progressPercent}%
            </Badge>
          </div>
          <Progress
            value={progressPercent}
            className={cn("h-2 transition-all duration-500", allComplete && "[&>div]:bg-emerald-500")}
          />
        </div>

        {quests.length === 0 ? (
          <div className="flex flex-col items-center py-7 text-center">
            <p className="mb-3 text-xs text-muted-foreground">No quests yet</p>
            <button
              onClick={seedQuests}
              className="flex items-center gap-1.5 rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
            >
              <Wand2 className="h-3.5 w-3.5" />
              Add starter quests
            </button>
          </div>
        ) : (
          <div className="space-y-1.5">
            {displayedQuests.map((quest) => (
              <div
                key={quest.id}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 transition-all duration-300",
                  quest.completedToday ? "bg-emerald-500/5" : "bg-secondary/40 hover:bg-secondary/60"
                )}
              >
                <Checkbox
                  checked={quest.completedToday}
                  onCheckedChange={() => completeQuest(quest.id)}
                  disabled={quest.completedToday}
                  className={cn("h-4 w-4", quest.completedToday && "border-emerald-500 bg-emerald-500")}
                />
                <span
                  className={cn(
                    "min-w-0 flex-1 truncate text-sm transition-all duration-300",
                    quest.completedToday && "text-muted-foreground line-through"
                  )}
                >
                  {quest.title}
                </span>
                {quest.completedToday ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <span className="text-[10px] font-medium text-muted-foreground">
                    +{quest.xpReward}
                  </span>
                )}
              </div>
            ))}
            {remaining > 0 && (
              <Link
                href="/daily-log"
                className="block py-1 text-center text-xs text-muted-foreground transition-colors hover:text-primary"
              >
                +{remaining} more quest{remaining > 1 ? "s" : ""}
              </Link>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
