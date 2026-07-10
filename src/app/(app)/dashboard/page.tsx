"use client";

import { BookOpen, CheckCircle2, Flame, Shield, Sparkles, Star, Trophy, Zap } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QuestWidget } from "@/components/quests/quest-widget";
import { usePlayer } from "@/hooks/use-player";
import { cn } from "@/lib/utils";

const skills = [
  { name: "Mathematics", progress: 68, color: "bg-primary" },
  { name: "Programming", progress: 54, color: "bg-primary" },
  { name: "Writing", progress: 42, color: "bg-primary" },
];

function HeroSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-none border border-primary/20 bg-background/60 backdrop-blur-xl p-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <div className="h-4 w-20 animate-pulse rounded-none bg-primary/20" />
          <div className="h-8 w-48 animate-pulse rounded-none bg-primary/20" />
          <div className="h-3 w-32 animate-pulse rounded-none bg-primary/20" />
        </div>
        <div className="h-20 w-20 animate-pulse rounded-none bg-primary/20" />
      </div>
      <div className="mt-6 space-y-2">
        <div className="h-3 w-full animate-pulse rounded-none bg-primary/20" />
      </div>
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="rounded-none border border-primary/20 bg-background/60 backdrop-blur-xl p-5">
      <div className="flex items-center justify-between">
        <div className="h-3 w-20 animate-pulse rounded-none bg-primary/20" />
        <div className="h-9 w-9 animate-pulse rounded-none bg-primary/20" />
      </div>
      <div className="mt-3 h-8 w-12 animate-pulse rounded-none bg-primary/20" />
      <div className="mt-2 h-3 w-28 animate-pulse rounded-none bg-primary/20" />
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
      <div className="animate-slide-up relative">
        <p className="text-sm font-bold uppercase tracking-widest text-primary/70">System</p>
        <h1 className="text-3xl font-bold tracking-widest text-primary uppercase drop-shadow-[0_0_10px_rgba(0,255,255,0.6)]">
          Status Window
        </h1>
        <div className="absolute -bottom-2 left-0 h-[2px] w-24 bg-primary shadow-[0_0_8px_rgba(0,255,255,0.8)]" />
      </div>

      {/* Hero Section — Player Card */}
      {loading ? (
        <HeroSkeleton />
      ) : player ? (
        <div className="group relative overflow-hidden rounded-none border border-primary/30 bg-background/80 backdrop-blur-xl animate-slide-up shadow-[0_0_30px_rgba(0,255,255,0.05)]">
          {/* Top gradient accent line */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_15px_rgba(0,255,255,0.8)]" />
          
          {/* Scanline overlay effect */}
          <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,255,0.03)_50%)] bg-[length:100%_4px] pointer-events-none" />

          {/* Background decorative glows */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-none bg-primary/[0.08] blur-3xl animate-pulse" />
          <div className="pointer-events-none absolute -right-20 -bottom-20 h-60 w-60 rounded-none bg-primary/[0.05] blur-3xl animate-pulse" />

          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              {/* Player Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="rounded-none border-primary text-primary text-[10px] font-bold uppercase tracking-widest shadow-[0_0_8px_rgba(0,255,255,0.3)] bg-primary/10"
                  >
                    <Shield className="mr-1.5 h-3 w-3" />
                    {player.tier.name}
                  </Badge>
                </div>

                <h2 className="text-3xl font-bold tracking-widest uppercase sm:text-4xl text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                  {player.name ?? "Sung Jin-Woo"}
                </h2>

                <div className="flex items-center gap-4 text-sm font-bold uppercase tracking-wider text-primary/80">
                  <span className="flex items-center gap-1.5 drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]">
                    <Zap className="h-4 w-4 text-primary" />
                    {player.totalXp.toLocaleString()} Total XP
                  </span>
                  <span className="text-primary/40">|</span>
                  <span className="flex items-center gap-1.5 drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]">
                    <Star className="h-4 w-4 text-primary" />
                    {xpRemaining.toLocaleString()} XP to next level
                  </span>
                </div>
              </div>

              {/* Level Hexagon / Box */}
              <div className="relative flex-shrink-0">
                <div className="relative flex h-24 w-24 items-center justify-center border-2 border-primary/40 bg-primary/5 shadow-[0_0_20px_rgba(0,255,255,0.2)] rotate-45 group-hover:border-primary transition-all duration-500">
                  <div className="absolute inset-0 border border-primary/20 m-1 animate-pulse" />
                  
                  {/* Center level number (un-rotate) */}
                  <div className="relative z-10 text-center -rotate-45">
                    <span className="text-3xl font-bold text-primary drop-shadow-[0_0_10px_rgba(0,255,255,0.8)] sm:text-4xl">
                      {player.level}
                    </span>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary/80">
                      Level
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* XP Progress Bar */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                <span className="flex items-center gap-2 text-primary/80">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Level Progress
                </span>
                <span className="text-primary drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]">
                  {player.currentLevelXp} / {player.xpForNextLevel} XP
                </span>
              </div>
              <div className="relative h-3 w-full overflow-hidden rounded-none border border-primary/30 bg-background/50">
                <div
                  className="h-full bg-primary transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(0,255,255,1)] relative"
                  style={{ width: `${player.progressPercent}%` }}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:20px_20px] animate-[slide_1s_linear_infinite]" />
                </div>
                {/* Glow overlay */}
                <div
                  className="absolute top-0 h-full bg-primary/60 blur-[4px]"
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
                  ? `${(player.xpForNextLevel - player.currentLevelXp).toLocaleString()} XP to next`
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

      {/* Quest Widget + Player Skills */}
      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <QuestWidget />

        <Card className="rounded-none border border-primary/20 bg-background/60 backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,255,0.02)_50%)] bg-[length:100%_4px] pointer-events-none opacity-50" />
          <CardHeader className="border-b border-primary/10 pb-4">
            <CardTitle className="flex items-center gap-3 text-primary font-bold uppercase tracking-widest drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]">
              <div className="flex h-8 w-8 items-center justify-center rounded-none border border-primary/40 bg-primary/10">
                <Star className="h-4 w-4 text-primary" />
              </div>
              Player Skills
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {skills.map((skill) => (
              <div key={skill.name} className="space-y-3 relative z-10">
                <div className="flex items-center justify-between text-sm font-bold uppercase tracking-wider">
                  <span className="text-primary/90">{skill.name}</span>
                  <span className="text-primary drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]">
                    {skill.progress}%
                  </span>
                </div>
                <div className="relative h-2 w-full overflow-hidden rounded-none border border-primary/20 bg-background/80">
                  <div
                    className={cn(
                      "h-full transition-all duration-700 shadow-[0_0_10px_rgba(0,255,255,0.8)] relative",
                      skill.color
                    )}
                    style={{ width: `${skill.progress}%` }}
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:10px_10px] animate-[slide_1s_linear_infinite]" />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
