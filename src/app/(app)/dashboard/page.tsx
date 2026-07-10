"use client";

import { BookOpen, CheckCircle2, Flame, Shield, Sparkles, Star, Trophy, Zap } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QuestWidget } from "@/components/quests/quest-widget";
import { usePlayer } from "@/hooks/use-player";
import { cn } from "@/lib/utils";

const skills = [
  { name: "Mathematics", progress: 68, color: "from-primary to-emerald-300" },
  { name: "Programming", progress: 54, color: "from-violet-500 to-purple-300" },
  { name: "Writing", progress: 42, color: "from-amber-500 to-yellow-300" },
];

function HeroSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card/60 backdrop-blur-xl p-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <div className="h-4 w-20 animate-pulse rounded bg-white/[0.06]" />
          <div className="h-8 w-48 animate-pulse rounded bg-white/[0.06]" />
          <div className="h-3 w-32 animate-pulse rounded bg-white/[0.06]" />
        </div>
        <div className="h-20 w-20 animate-pulse rounded-full bg-white/[0.06]" />
      </div>
      <div className="mt-6 space-y-2">
        <div className="h-3 w-full animate-pulse rounded-full bg-white/[0.06]" />
      </div>
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-card/60 backdrop-blur-xl p-5">
      <div className="flex items-center justify-between">
        <div className="h-3 w-20 animate-pulse rounded bg-white/[0.06]" />
        <div className="h-9 w-9 animate-pulse rounded-lg bg-white/[0.06]" />
      </div>
      <div className="mt-3 h-8 w-12 animate-pulse rounded bg-white/[0.06]" />
      <div className="mt-2 h-3 w-28 animate-pulse rounded bg-white/[0.06]" />
    </div>
  );
}

export default function DashboardPage() {
  const { player, loading } = usePlayer();

  const xpRemaining = player
    ? player.xpForNextLevel - player.currentLevelXp
    : 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="animate-slide-up">
        <p className="text-sm font-medium text-muted-foreground">Today</p>
        <h1 className="text-3xl font-bold tracking-tight text-gradient from-foreground to-muted-foreground bg-gradient-to-r">
          Dashboard
        </h1>
      </div>

      {/* Hero Section — Player Card */}
      {loading ? (
        <HeroSkeleton />
      ) : player ? (
        <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card/60 backdrop-blur-xl animate-slide-up">
          {/* Top gradient accent line */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

          {/* Background decorative glows */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-primary/[0.06] blur-3xl" />
          <div className="pointer-events-none absolute -right-20 -bottom-20 h-60 w-60 rounded-full bg-accent/[0.04] blur-3xl" />

          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              {/* Player Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="border-primary/30 text-primary text-[10px] uppercase tracking-widest"
                  >
                    <Shield className="mr-1 h-3 w-3" />
                    {player.tier.name}
                  </Badge>
                </div>

                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  <span className="text-gradient from-white to-white/70 bg-gradient-to-r">
                    {player.name ?? "Adventurer"}
                  </span>
                </h2>

                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Zap className="h-3.5 w-3.5 text-accent" />
                    {player.totalXp.toLocaleString()} Total XP
                  </span>
                  <span className="text-white/20">•</span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-primary" />
                    {xpRemaining.toLocaleString()} XP to next level
                  </span>
                </div>
              </div>

              {/* Level Circle */}
              <div className="relative flex-shrink-0">
                <div className="relative flex h-20 w-20 items-center justify-center sm:h-24 sm:w-24">
                  {/* Outer glow ring */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 animate-pulse-glow" />

                  {/* Circular progress track */}
                  <svg
                    className="absolute inset-0 -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="hsl(222 14% 22%)"
                      strokeWidth="4"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="hsl(166 72% 44%)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 42}`}
                      strokeDashoffset={`${2 * Math.PI * 42 * (1 - player.progressPercent / 100)}`}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>

                  {/* Center level number */}
                  <div className="relative z-10 text-center">
                    <span className="text-2xl font-bold text-primary sm:text-3xl">
                      {player.level}
                    </span>
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
                      Level
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* XP Progress Bar */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-muted-foreground">
                  <Sparkles className="h-3 w-3 text-primary" />
                  Level Progress
                </span>
                <span className="font-mono text-xs text-primary">
                  {player.currentLevelXp} / {player.xpForNextLevel} XP
                </span>
              </div>
              <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-300 transition-all duration-1000 ease-out"
                  style={{ width: `${player.progressPercent}%` }}
                />
                {/* Glow overlay */}
                <div
                  className="absolute top-0 h-full rounded-full bg-gradient-to-r from-primary/40 to-emerald-300/40 blur-sm"
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
              value={player ? String(player.level) : "—"}
              icon={Trophy}
              detail={
                player
                  ? `${(player.xpForNextLevel - player.currentLevelXp).toLocaleString()} XP to next level`
                  : "Loading..."
              }
            />
            <StatCard
              title="Daily Streak"
              value="14"
              icon={Flame}
              detail="Consistency is compounding"
            />
            <StatCard
              title="Quests Done"
              value="3/5"
              icon={CheckCircle2}
              detail="Two still open today"
            />
            <StatCard
              title="Learning Time"
              value="6.5h"
              icon={BookOpen}
              detail="Tracked this week"
            />
          </>
        )}
      </div>

      {/* Quest Widget + Skill Growth */}
      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <QuestWidget />

        <Card className="glass glass-hover overflow-hidden border-white/[0.06]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-violet-500/15">
                <Star className="h-3.5 w-3.5 text-violet-400" />
              </div>
              Skill Growth
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {skills.map((skill) => (
              <div key={skill.name} className="space-y-2.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{skill.name}</span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {skill.progress}%
                  </span>
                </div>
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className={cn(
                      "h-full rounded-full bg-gradient-to-r transition-all duration-700",
                      skill.color
                    )}
                    style={{ width: `${skill.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
