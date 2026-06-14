"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePlayer } from "@/hooks/use-player";
import { cn } from "@/lib/utils";
import { Shield, Loader2 } from "lucide-react";

const levelTiers = [
  { name: "Novice", range: "1–5", color: "text-zinc-400", bg: "bg-zinc-400/10", border: "border-zinc-400/20" },
  { name: "Apprentice", range: "6–10", color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
  { name: "Journeyman", range: "11–15", color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
  { name: "Expert", range: "16–20", color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20" },
  { name: "Master", range: "21–30", color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20" },
  { name: "Grandmaster", range: "31–50", color: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/20" },
  { name: "Legend", range: "51+", color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20" },
];

function getTierIndex(level: number): number {
  if (level <= 5) return 0;
  if (level <= 10) return 1;
  if (level <= 15) return 2;
  if (level <= 20) return 3;
  if (level <= 30) return 4;
  if (level <= 50) return 5;
  return 6;
}

export function LevelBadgeCard() {
  const { player, loading } = usePlayer();

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-10">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!player) return null;

  const currentTierIdx = getTierIndex(player.level);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400">
            <Shield className="h-4 w-4" />
          </div>
          <CardTitle className="text-base">Level Tiers</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1.5">
          {levelTiers.map((tier, idx) => {
            const isCurrent = idx === currentTierIdx;
            const isUnlocked = idx <= currentTierIdx;

            return (
              <div
                key={tier.name}
                className={cn(
                  "flex items-center justify-between rounded-lg px-3 py-2 transition-all",
                  isCurrent && `${tier.bg} border ${tier.border}`,
                  !isCurrent && !isUnlocked && "opacity-40"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold",
                      isUnlocked ? `${tier.bg} ${tier.color}` : "bg-secondary text-muted-foreground"
                    )}
                  >
                    {isUnlocked ? "✓" : "?"}
                  </div>
                  <span className={cn("text-sm font-medium", isCurrent && tier.color)}>
                    {tier.name}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">Lv. {tier.range}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
