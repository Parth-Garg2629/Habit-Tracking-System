"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { usePlayer } from "@/hooks/use-player";
import { Sparkles, TrendingUp, Loader2, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function XpProgressCard() {
  const { player, loading } = usePlayer();

  if (loading) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="flex items-center justify-center py-10">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!player) return null;

  return (
    <Card className="relative overflow-hidden">
      {/* Gradient accent at top */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-amber-500" />

      <CardContent className="pt-6 pb-5 space-y-4">
        {/* Level + Tier header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/20">
                <span className="text-lg font-bold text-primary">{player.level}</span>
              </div>
              {/* Level glow effect */}
              <div className="absolute -inset-1 -z-10 rounded-xl bg-primary/10 blur-md" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">Level {player.level}</span>
                <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0 border-0", player.tier.color)}>
                  <Star className="mr-0.5 h-2.5 w-2.5" />
                  {player.tier.name}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {player.totalXp.toLocaleString()} total XP earned
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              <span>Next level</span>
            </div>
            <p className="text-sm font-semibold text-primary mt-0.5">
              {(player.xpForNextLevel - player.currentLevelXp).toLocaleString()} XP
            </p>
          </div>
        </div>

        {/* XP progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              <Sparkles className="mr-1 inline h-3 w-3 text-primary" />
              {player.currentLevelXp.toLocaleString()} / {player.xpForNextLevel.toLocaleString()} XP
            </span>
            <span className="font-medium text-primary">{player.progressPercent}%</span>
          </div>
          <div className="relative">
            <Progress value={player.progressPercent} className="h-3" />
            {/* Progress glow */}
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-primary/20 blur-sm transition-all duration-500"
              style={{ width: `${player.progressPercent}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
