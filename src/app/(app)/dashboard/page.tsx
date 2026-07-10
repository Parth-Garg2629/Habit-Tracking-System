"use client";

import React, { useState } from "react";
import { usePlayer } from "@/hooks/use-player";
import { useQuests } from "@/hooks/use-quests";
import { useSkills } from "@/hooks/use-skills";
import { useActivity } from "@/hooks/use-activity";
import { calculateLevel } from "@/lib/xp";
import { cn } from "@/lib/utils";
import { 
  User, 
  Zap, 
  Coins, 
  Flame, 
  Target, 
  Brain, 
  Dumbbell, 
  ShieldAlert, 
  Palette, 
  Calendar, 
  CheckCircle2, 
  ArrowUp, 
  Circle,
  AlertTriangle,
  Loader2
} from "lucide-react";

export default function DashboardPage() {
  const { player, loading: playerLoading } = usePlayer();
  const { quests, completeQuest } = useQuests();
  const { skills } = useSkills();
  const { activities } = useActivity();

  const [completingId, setCompletingId] = useState<string | null>(null);

  const handleToggleQuest = async (id: string, currentCompleted: boolean) => {
    if (currentCompleted || completingId === id) return;
    setCompletingId(id);
    try {
      await completeQuest(id);
    } finally {
      setCompletingId(null);
    }
  };

  if (playerLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="font-data-mono text-xs text-outline animate-pulse">[ ACQUIRING SYSTEM DATA... ]</p>
      </div>
    );
  }

  // Dynamic Player data
  const operatorName = player?.name ? player.name.toUpperCase() : "ADVENTURER";
  const level = player?.level ?? 1;
  const rankName = player?.tier?.name ? `${player.tier.name.toUpperCase()} RANK` : "RECRUIT RANK";
  const currentXp = player?.currentLevelXp ?? 0;
  const nextXp = player?.xpForNextLevel ?? 100;
  const progressPercent = player ? Math.min(100, Math.max(0, player.progressPercent)) : 0;
  const totalXp = player?.totalXp ?? 0;

  // HUD Stats calculation
  const streak = player ? 0 : 0; // Or calculate based on logs
  const coins = Math.floor(totalXp * 0.15);
  const pendingQuests = quests.filter(q => !q.completedToday).length;
  const energy = Math.max(10, Math.min(100, 100 - pendingQuests * 15));

  // Dynamic stats mapped from skills
  const statIcons = [Dumbbell, Brain, Target, ShieldAlert, Palette, Calendar];
  const displayStats = skills.slice(0, 6).map((s, idx) => {
    const { progressPercent } = calculateLevel(s.xp);
    return {
      name: s.name.toUpperCase(),
      short: s.name.slice(0, 3).toUpperCase(),
      icon: statIcons[idx % statIcons.length],
      progress: progressPercent,
      color: idx % 2 === 0 ? "primary" : "secondary"
    };
  });

  // Dynamic quests
  const displayMissions = quests.slice(0, 4).map((q) => {
    const diff = q.xpReward >= 400 ? "HARD" : q.xpReward >= 200 ? "ROUTINE" : "EASY";
    return {
      id: q.id,
      title: q.title,
      description: q.description || "Daily Objective",
      difficulty: diff,
      xpReward: q.xpReward,
      coinReward: Math.floor(q.xpReward / 10),
      status: q.completedToday ? "COMPLETED" : "AVAILABLE",
      completed: q.completedToday,
      color: diff === "HARD" ? "tertiary-container" : diff === "ROUTINE" ? "outline" : "primary"
    };
  });

  // Weekly Challenge Progress
  const completedCount = quests.filter(q => q.completedToday).length;
  const totalCount = quests.length;
  const challengePercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
      {/* COLUMN 1: Character & Stats (Span 8) */}
      <div className="lg:col-span-8 flex flex-col gap-gutter">
        {/* Hero Section [ CHARACTER STATUS ] */}
        <section className="glass-panel p-panel-padding rounded-lg flex flex-col gap-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="font-headline-md text-headline-md text-primary bracketed-text neon-text mb-1 glitch-text">
                CHARACTER STATUS
              </h1>
              <div className="font-display-lg text-display-lg text-on-surface tracking-widest">{operatorName}</div>
              <div className="font-label-caps text-label-caps text-secondary mt-2">
                LEVEL {level} {rankName}
              </div>
            </div>
            <div className="w-16 h-16 rounded-full border-2 border-primary/50 overflow-hidden glass-panel shrink-0 shadow-[0_0_15px_rgba(34,211,238,0.3)] float-anim flex items-center justify-center bg-primary/20 text-primary font-bold text-xl">
              <User className="h-8 w-8 text-primary" />
            </div>
          </div>

          {/* Massive XP Bar */}
          <div className="w-full flex flex-col gap-2">
            <div className="flex justify-between font-data-mono text-data-mono text-outline text-xs">
              <span>XP PROGRESS</span>
              <span className="text-primary neon-text">
                {currentXp.toLocaleString()} / {nextXp.toLocaleString()}
              </span>
            </div>
            <div className="progress-bar-container h-4 w-full">
              <div 
                className="progress-bar-fill shimmer-effect" 
                style={{ width: `${progressPercent}%` }} 
              />
            </div>
          </div>

          {/* Status HUD */}
          <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-primary/20">
            <div className="flex flex-col items-center justify-center gap-1">
              <Zap className="h-8 w-8 text-tertiary-container drop-shadow-[0_0_8px_rgba(255,177,59,0.5)]" />
              <span className="font-label-caps text-label-caps text-outline text-[10px]">ENERGY</span>
              <span className="font-data-mono text-headline-sm text-tertiary-container">{energy}%</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-1 border-l border-r border-primary/20">
              <Coins className="h-8 w-8 text-warning drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
              <span className="font-label-caps text-label-caps text-outline text-[10px]">COINS</span>
              <span className="font-data-mono text-headline-sm text-warning">{coins.toLocaleString()}</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-1">
              <Flame className="h-8 w-8 text-success drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
              <span className="font-label-caps text-label-caps text-outline text-[10px]">STREAK</span>
              <span className="font-data-mono text-headline-sm text-success">{streak} DAYS</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-2">
            {displayStats.length > 0 ? (
              displayStats.map((stat, idx) => {
                const StatIcon = stat.icon;
                return (
                  <div key={idx} className="flex flex-col gap-2">
                    <div className="flex justify-between items-end font-label-caps text-label-caps text-[10px]">
                      <span className="text-outline flex items-center gap-1">
                        <StatIcon className="h-3.5 w-3.5 text-outline" /> {stat.short}
                      </span>
                      <span className={cn("font-data-mono", stat.color === "secondary" ? "text-secondary" : "text-primary")}>
                        {stat.progress}
                      </span>
                    </div>
                    <div className="progress-bar-container h-1 w-full">
                      <div 
                        className={cn(
                          "progress-bar-fill", 
                          stat.color === "secondary" ? "bg-secondary shadow-[0_0_10px_rgba(208,188,255,0.5)]" : ""
                        )} 
                        style={{ width: `${stat.progress}%` }} 
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-6 text-center border border-dashed border-primary/20 bg-primary/5 rounded font-data-mono text-xs text-outline">
                [ NO TRACKED COMPETENCIES FOUND. SUBMIT LOGS TO ACQUIRE SKILLS ]
              </div>
            )}
          </div>
        </section>

        {/* Daily Missions Grid */}
        <section className="flex flex-col gap-4">
          <h2 className="font-headline-sm text-headline-sm text-primary bracketed-text neon-text pl-2">
            DAILY MISSIONS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayMissions.length > 0 ? (
              displayMissions.map((mission) => {
                if (mission.completed) {
                  return (
                    <div 
                      key={mission.id}
                      onClick={() => handleToggleQuest(mission.id, true)}
                      className="glass-panel p-4 rounded-md flex flex-col gap-3 border-success/50 bg-success/5 shadow-[0_0_15px_rgba(74,222,128,0.15)] relative overflow-hidden transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-success/20 to-transparent pointer-events-none" />
                      <div className="flex justify-between items-start relative z-10">
                        <span className="font-label-caps text-label-caps text-[10px] text-outline tracking-widest border border-outline/30 bg-surface-container px-2 py-1 rounded">
                          {mission.difficulty}
                        </span>
                        <span className="font-data-mono text-xs text-success flex items-center gap-1 drop-shadow-[0_0_5px_rgba(74,222,128,0.8)]">
                          <CheckCircle2 className="h-3.5 w-3.5 text-success" /> COMPLETED
                        </span>
                      </div>
                      <div className="relative z-10">
                        <div className="font-headline-sm text-headline-sm text-on-surface line-through opacity-70">
                          {mission.title}
                        </div>
                        <div className="font-body-md text-sm text-outline mt-1">{mission.description}</div>
                      </div>
                      <div className="flex gap-4 mt-2 pt-3 border-t border-success/20 font-data-mono text-xs opacity-50 relative z-10">
                        <span className="flex items-center gap-1">
                          <ArrowUp className="h-3.5 w-3.5 text-outline" /> {mission.xpReward} XP
                        </span>
                        <span className="flex items-center gap-1">
                          <Coins className="h-3.5 w-3.5 text-outline" /> {mission.coinReward}
                        </span>
                      </div>
                    </div>
                  );
                }

                return (
                  <div 
                    key={mission.id}
                    onClick={() => handleToggleQuest(mission.id, mission.completed)}
                    className="glass-panel glass-panel-interactive p-4 rounded-md flex flex-col gap-3 cursor-pointer group transition-all duration-300"
                  >
                    <div className="flex justify-between items-start">
                      <span className={cn(
                        "font-label-caps text-label-caps text-[10px] tracking-widest border px-2 py-1 rounded",
                        mission.color === "tertiary-container"
                          ? "text-tertiary-container border-tertiary-container/30 bg-tertiary-container/10"
                          : "text-primary border-primary/30 bg-primary/10"
                      )}>
                        {mission.difficulty}
                      </span>
                      <span className="font-data-mono text-xs text-outline flex items-center gap-1 group-hover:text-primary transition-colors">
                        <Circle className="h-3.5 w-3.5 text-outline group-hover:text-primary transition-colors" /> {mission.status}
                      </span>
                    </div>
                    <div>
                      <div className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">
                        {mission.title}
                      </div>
                      <div className="font-body-md text-sm text-outline mt-1">{mission.description}</div>
                    </div>
                    <div className="flex justify-between items-end mt-2 pt-3 border-t border-primary/20">
                      <div className="flex gap-4 font-data-mono text-xs">
                        <span className="text-primary flex items-center gap-1">
                          <ArrowUp className="h-3.5 w-3.5 text-primary" /> {mission.xpReward} XP
                        </span>
                        <span className="text-warning flex items-center gap-1">
                          <Coins className="h-3.5 w-3.5 text-warning" /> {mission.coinReward}
                        </span>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleQuest(mission.id, mission.completed);
                        }}
                        disabled={completingId === mission.id}
                        className="font-label-caps text-[10px] border border-primary text-primary px-3 py-1 rounded hover:bg-primary hover:text-on-primary transition-colors hover:shadow-[0_0_10px_rgba(34,211,238,0.5)] bg-transparent"
                      >
                        {completingId === mission.id ? "PROCESSING..." : "INITIATE"}
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-8 text-center border border-dashed border-primary/20 bg-primary/5 rounded font-data-mono text-xs text-outline">
                [ NO DAILY DIRECTIVES REGISTERED. INITIATE MISSIONS IN DAILY LOG ]
              </div>
            )}
          </div>
        </section>
      </div>

      {/* COLUMN 2: Sidebar Widgets (Span 4) */}
      <div className="lg:col-span-4 flex flex-col gap-gutter">
        {/* Weekly Challenge */}
        <section className="glass-panel p-6 rounded-lg flex flex-col items-center text-center gap-4 relative overflow-hidden h-full min-h-[400px]">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
          <h2 className="font-headline-sm text-headline-sm text-secondary bracketed-text drop-shadow-[0_0_8px_rgba(208,188,255,0.6)] w-full text-left">
            WEEKLY CHALLENGE
          </h2>
          <div className="flex-1 flex flex-col items-center justify-center w-full mt-4">
            {/* Neon Progress Ring */}
            <div className="relative w-48 h-48 mb-6 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90 absolute" viewBox="0 0 100 100">
                <circle cx="50" cy="50" fill="none" r="45" stroke="rgba(34, 211, 238, 0.1)" strokeWidth="4" />
                <circle 
                  cx="50" 
                  cy="50" 
                  fill="none" 
                  r="45" 
                  stroke="#22d3ee" 
                  strokeDasharray="283" 
                  strokeDashoffset={283 - (283 * challengePercent) / 100}
                  strokeWidth="4" 
                  style={{ filter: "drop-shadow(0 0 5px rgba(34,211,238,0.8))" }} 
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display-lg text-4xl text-primary neon-text">{challengePercent}%</span>
                <span className="font-label-caps text-[10px] text-outline tracking-widest mt-1">COMPLETED</span>
              </div>
            </div>
            <h3 className="font-headline-md text-xl text-on-surface mb-2">The Discipline Protocol</h3>
            <p className="font-body-md text-sm text-outline mb-6 max-w-[80%]">
              Maintain perfect consistency across all core habits for 7 consecutive days.
            </p>
            <div className="w-full bg-surface-container-high/50 border border-primary/20 p-3 rounded font-data-mono text-center flex flex-col gap-1">
              <span className="text-[10px] text-outline tracking-widest">TIME REMAINING</span>
              <span className="text-secondary drop-shadow-[0_0_5px_rgba(208,188,255,0.6)] text-lg tracking-wider">
                2D:14H:05M
              </span>
            </div>
          </div>
        </section>

        {/* Mini Log / Notifications */}
        <section className="glass-panel p-4 rounded-lg flex flex-col gap-3">
          <h2 className="font-label-caps text-label-caps text-primary bracketed-text opacity-70">SYSTEM LOG</h2>
          <div className="flex flex-col gap-2 mt-2">
            {activities.length > 0 ? (
              activities.slice(0, 3).map((act, idx) => (
                <React.Fragment key={act.id}>
                  <div className="flex gap-2 items-start text-sm">
                    <span className="text-success mt-0.5"><CheckCircle2 className="h-4 w-4" /></span>
                    <div>
                      <div className="font-data-mono text-on-surface text-xs">
                        {act.type === "xp" ? act.reason.toUpperCase() : `LEVEL UP: LV.${act.fromLevel} -> LV.${act.toLevel}`}
                      </div>
                      <div className="text-outline text-[10px] mt-0.5">
                        {act.type === "xp" ? `+${act.amount} XP awarded.` : `Reached Level ${act.toLevel}`}
                      </div>
                    </div>
                  </div>
                  {idx < Math.min(2, activities.length - 1) && <div className="h-px w-full bg-primary/10" />}
                </React.Fragment>
              ))
            ) : (
              <div className="py-6 text-center font-data-mono text-xs text-outline">
                [ LOG DATA EMPTY. TELEMETRY PENDING ]
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
