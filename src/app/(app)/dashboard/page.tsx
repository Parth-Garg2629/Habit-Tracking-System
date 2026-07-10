"use client";

import { BookOpen, CheckCircle2, Flame, Trophy } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuestWidget } from "@/components/quests/quest-widget";
import { usePlayer } from "@/hooks/use-player";
import { useQuests } from "@/hooks/use-quests";
import { useActivity } from "@/hooks/use-activity";
import { useSkills } from "@/hooks/use-skills";
import { calculateLevel } from "@/lib/xp";
import { cn } from "@/lib/utils";

function HeroSkeleton() {
  return (
    <div className="relative overflow-hidden glass system-border p-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <div className="h-4 w-20 animate-pulse bg-primary/20" />
          <div className="h-8 w-48 animate-pulse bg-primary/20" />
        </div>
        <div className="h-20 w-20 animate-pulse bg-primary/20" />
      </div>
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="glass system-border p-5">
      <div className="flex items-center justify-between">
        <div className="h-3 w-20 animate-pulse bg-primary/20" />
        <div className="h-9 w-9 animate-pulse bg-primary/20" />
      </div>
      <div className="mt-3 h-8 w-12 animate-pulse bg-primary/20" />
      <div className="mt-2 h-3 w-28 animate-pulse bg-primary/20" />
    </div>
  );
}

export default function DashboardPage() {
  const { player, loading: playerLoading } = usePlayer();
  const { completedToday, totalDaily, loading: questsLoading } = useQuests();
  const { activities, loading: activityLoading } = useActivity();
  const { skills, loading: skillsLoading } = useSkills();

  const loading = playerLoading || questsLoading || activityLoading || skillsLoading;

  // Count recent activities instead of learning time
  const activityCount = activities.length;
  
  // Basic streak calculation (just a placeholder since we don't track streak on backend yet)
  const streak = activities.length > 0 ? 1 : 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="animate-slide-up relative text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-primary/70">[ SYSTEM ]</p>
        <h1 className="text-3xl font-bold tracking-widest text-primary uppercase drop-shadow-[0_0_10px_rgba(0,255,255,0.6)]">
          [ STATUS WINDOW ]
        </h1>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-[2px] w-24 bg-primary shadow-[0_0_8px_rgba(0,255,255,0.8)]" />
      </div>

      {/* Hero Section – Player Card */}
      {loading ? (
        <HeroSkeleton />
      ) : player ? (
        <div className="group relative overflow-hidden glass system-border animate-slide-up shadow-[0_0_30px_rgba(0,255,255,0.05)]">
          {/* Top gradient accent line */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_15px_rgba(0,255,255,0.8)]" />
          
          {/* Scanline effect */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-20 mix-blend-overlay" />

          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
              {/* Player Info */}
              <div className="flex-1 space-y-4">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary/80">
                    [ Player ]
                  </p>
                  <h2 className="text-3xl font-bold text-white drop-shadow-md sm:text-4xl">
                    [ {player.name || "Adventurer"} ]
                  </h2>
                </div>

                <div className="flex flex-wrap gap-3">
                  <div className={cn("inline-flex items-center px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-cyan-200 bg-cyan-400/10 border border-cyan-400/30")}>
                    [ {player.tier?.name || "E-Rank"} ]
                  </div>
                  <div className="inline-flex items-center border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-white">
                    [ Total XP: {player.totalXp.toLocaleString()} ]
                  </div>
                </div>
              </div>

              {/* Level Indicator */}
              <div className="relative flex-shrink-0">
                <div className="text-center">
                  <span className="text-3xl font-bold text-primary drop-shadow-[0_0_10px_rgba(0,255,255,0.8)] sm:text-4xl">
                    [ LV. {player.level} ]
                  </span>
                </div>
              </div>
            </div>

            {/* XP Progress Bar */}
            <div className="mt-8 space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-primary/80">
                <span>[ XP Progress ]</span>
                <span>
                  {player.currentLevelXp} / {player.xpForNextLevel} XP
                </span>
              </div>
              <div className="relative h-[2px] w-full overflow-hidden bg-background/50">
                <div
                  className="h-full bg-primary transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(0,255,255,1)] relative"
                  style={{ width: `${player.progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              title="Current Level"
              value={player ? `[ ${player.level} ]` : "—"}
              icon={Trophy}
              detail={
                player
                  ? `[ ${(player.xpForNextLevel - player.currentLevelXp).toLocaleString()} XP to next ]`
                  : "Loading..."
              }
            />
            <StatCard
              title="Daily Streak"
              value={`[ ${streak} ]`}
              icon={Flame}
              detail="[ Consistency is compounding ]"
            />
            <StatCard
              title="Quests Done"
              value={`[ ${completedToday}/${totalDaily} ]`}
              icon={CheckCircle2}
              detail="[ Daily Objectives ]"
            />
            <StatCard
              title="Recent Actions"
              value={`[ ${activityCount} ]`}
              icon={BookOpen}
              detail="[ Tracked this week ]"
            />
          </>
        )}
      </div>

      {/* Quest Widget + Player Skills */}
      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <QuestWidget />

        <Card className="glass system-border relative overflow-hidden group">
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,255,0.02)_50%)] bg-[length:100%_4px] pointer-events-none opacity-50" />
          <CardHeader className="border-b border-primary/10 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-bold uppercase tracking-widest text-primary drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]">
              [ PLAYER SKILLS ]
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {skills.length === 0 && (
              <p className="text-center text-xs text-primary/60">[ NO SKILLS DETECTED ]</p>
            )}
            {skills.map((skill) => {
              const { progressPercent } = calculateLevel(skill.xp);
              return (
                <div key={skill.name} className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-white">
                    <span>[ {skill.name} ]</span>
                    <span className="text-primary drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]">
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
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
