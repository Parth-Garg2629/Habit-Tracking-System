"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Loader2, Swords, Wand2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
        "glass system-border relative overflow-hidden transition-all duration-500",
        allComplete && "border-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.3)]"
      )}
    >
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,255,0.02)_50%)] bg-[length:100%_4px] pointer-events-none opacity-50" />
      
      <CardHeader className="border-b border-primary/10 pb-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-none border transition-colors",
                allComplete ? "bg-cyan-400/20 text-cyan-300 border-cyan-400/50 glow-primary" : "bg-primary/10 text-primary border-primary/30"
              )}
            >
              <Swords className="h-5 w-5 drop-shadow-[0_0_5px_rgba(0,255,255,0.8)]" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-lg font-bold uppercase tracking-widest text-primary drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]">[ DAILY QUESTS ]</CardTitle>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-primary/60">
                Resets at {formatReset(resetAt)}
              </p>
            </div>
          </div>
          <Link
            href="/daily-log"
            className="flex shrink-0 items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-primary/60 transition-colors hover:text-primary"
          >
            [ View All ]
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 pt-5 relative">
        <div className="space-y-2">
          <div className="flex items-center justify-between font-bold uppercase tracking-wider text-white">
            <span className="text-xs">
              [ {completedToday}/{totalDaily} COMPLETED ]
            </span>
            <span className="text-primary drop-shadow-[0_0_5px_rgba(0,255,255,0.5)] text-xs">
              {progressPercent}%
            </span>
          </div>
          <div className="relative h-[2px] w-full overflow-hidden bg-background/80">
            <div
              className={cn(
                "h-full transition-all duration-700 shadow-[0_0_10px_rgba(0,255,255,0.8)] relative",
                "bg-primary"
              )}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {quests.length === 0 ? (
          <div className="flex flex-col items-center py-7 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary/60">[ NO QUESTS YET ]</p>
            <button
              onClick={seedQuests}
              className="flex items-center gap-1.5 rounded-none border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary transition-colors hover:bg-primary/20 hover:shadow-[0_0_15px_rgba(0,255,255,0.3)]"
            >
              <Wand2 className="h-3.5 w-3.5" />
              [ ADD STARTER QUESTS ]
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {displayedQuests.map((quest) => (
              <div
                key={quest.id}
                className={cn(
                  "flex items-center gap-3 rounded-none px-3 py-3 border transition-all duration-300",
                  quest.completedToday ? "bg-cyan-950/40 border-cyan-400/20" : "bg-violet-950/40 border-primary/10 hover:border-primary/30 hover:bg-violet-900/40"
                )}
              >
                <Checkbox
                  checked={quest.completedToday}
                  onCheckedChange={() => completeQuest(quest.id)}
                  disabled={quest.completedToday}
                  className={cn("h-4 w-4 rounded-none border-primary/50", quest.completedToday && "border-cyan-400 bg-cyan-400 text-black")}
                />
                <span
                  className={cn(
                    "min-w-0 flex-1 truncate text-xs font-bold uppercase tracking-widest transition-all duration-300",
                    quest.completedToday ? "text-primary/40 line-through" : "text-white drop-shadow-md"
                  )}
                >
                  {quest.title}
                </span>
                {quest.completedToday ? (
                  <CheckCircle2 className="h-4 w-4 text-cyan-400 drop-shadow-[0_0_5px_rgba(0,255,255,0.8)]" />
                ) : (
                  <span className="text-[10px] font-bold text-primary drop-shadow-[0_0_3px_rgba(0,255,255,0.5)]">
                    +{quest.xpReward} XP
                  </span>
                )}
              </div>
            ))}
            {remaining > 0 && (
              <Link
                href="/daily-log"
                className="block py-2 text-center text-[10px] font-bold uppercase tracking-widest text-primary/60 transition-colors hover:text-primary"
              >
                [ +{remaining} MORE QUEST{remaining > 1 ? "S" : ""} ]
              </Link>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
