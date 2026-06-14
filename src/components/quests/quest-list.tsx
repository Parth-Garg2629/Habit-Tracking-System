"use client";

import { useState } from "react";
import { Loader2, Plus, Sparkles, Swords, Wand2 } from "lucide-react";
import { CreateQuestForm } from "@/components/quests/create-quest-form";
import { QuestItem } from "@/components/quests/quest-item";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export function QuestList() {
  const {
    quests,
    completedToday,
    totalDaily,
    progressPercent,
    resetAt,
    loading,
    error,
    completeQuest,
    createQuest,
    deleteQuest,
    seedQuests,
  } = useQuests();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const allComplete = totalDaily > 0 && completedToday >= totalDaily;

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card
        className={cn(
          "overflow-hidden transition-all duration-500",
          allComplete && "border-emerald-500/30"
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-md transition-colors duration-500",
                  allComplete ? "bg-emerald-500/15 text-emerald-400" : "bg-primary/15 text-primary"
                )}
              >
                <Swords className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Daily Quests</CardTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {allComplete ? "All quests completed for today" : `${completedToday} of ${totalDaily} completed`}
                </p>
              </div>
            </div>
            <Badge variant={allComplete ? "success" : "default"} className="w-fit gap-1.5 px-3 py-1 text-sm">
              <Sparkles className="h-3.5 w-3.5" />
              {progressPercent}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-5">
          <div className="space-y-2">
            <Progress
              value={progressPercent}
              className={cn("h-2.5 transition-all duration-500", allComplete && "[&>div]:bg-emerald-500")}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{completedToday} done</span>
              <span>Resets at {formatReset(resetAt)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base">Today&apos;s Quests</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              {quests.length === 0 && (
                <button
                  onClick={seedQuests}
                  className="flex items-center gap-1.5 rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                >
                  <Wand2 className="h-3.5 w-3.5" />
                  Add starter quests
                </button>
              )}
              <button
                onClick={() => setShowCreateForm((current) => !current)}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                  showCreateForm ? "bg-secondary text-foreground" : "bg-primary/10 text-primary hover:bg-primary/20"
                )}
              >
                <Plus className={cn("h-3.5 w-3.5 transition-transform", showCreateForm && "rotate-45")} />
                {showCreateForm ? "Cancel" : "New quest"}
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {showCreateForm && (
            <CreateQuestForm
              onCreate={async (payload) => {
                await createQuest(payload);
                setShowCreateForm(false);
              }}
              onCancel={() => setShowCreateForm(false)}
            />
          )}

          {error && (
            <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {quests.length === 0 && !showCreateForm ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-md bg-secondary">
                <Swords className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">No quests yet</p>
              <p className="mt-1 max-w-[260px] text-xs text-muted-foreground">
                Create your first daily quest or add starter quests to begin tracking today.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {quests.map((quest) => (
                <QuestItem
                  key={quest.id}
                  quest={quest}
                  onComplete={completeQuest}
                  onDelete={deleteQuest}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
