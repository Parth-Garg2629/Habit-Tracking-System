"use client";

import { useWeeklyReview } from "@/hooks/use-weekly-review";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles, CheckCircle2, BookOpen } from "lucide-react";

export default function WeeklyReviewPage() {
  const { stats, loading } = useWeeklyReview();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Retrospective</p>
        <h1 className="text-3xl font-semibold tracking-normal">Weekly Review</h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : !stats ? (
        <div>Error loading stats</div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">XP Earned</CardTitle>
                <Sparkles className="h-4 w-4 text-emerald-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-emerald-400">+{stats.totalXpEarned}</div>
                <p className="mt-1 text-xs text-muted-foreground">Past 7 days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Quests Done</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{stats.questsCompleted}</div>
                <p className="mt-1 text-xs text-muted-foreground">Completed quests</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Daily Logs</CardTitle>
                <BookOpen className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{stats.journalEntries}</div>
                <p className="mt-1 text-xs text-muted-foreground">Logs submitted</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>XP Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex h-48 items-end gap-2 sm:gap-4 mt-4">
                {stats.xpByDay.map((day) => {
                  const max = Math.max(...stats.xpByDay.map((d) => d.amount), 100);
                  const height = `${(day.amount / max) * 100}%`;
                  const dateObj = new Date(day.date);
                  const label = dateObj.toLocaleDateString(undefined, { weekday: "short" });

                  return (
                    <div key={day.date} className="flex flex-col items-center flex-1 gap-2">
                      <div className="relative w-full flex-1 rounded-t-sm bg-secondary/50">
                        <div
                          className="absolute bottom-0 w-full rounded-t-sm bg-primary/80 transition-all"
                          style={{ height }}
                        >
                          <div className="absolute -top-6 w-full text-center text-xs opacity-0 hover:opacity-100 transition-opacity">
                            {day.amount}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] text-muted-foreground">{label}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
