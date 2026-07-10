"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems } from "@/components/layout/nav-items";
import { usePlayer } from "@/hooks/use-player";

export function Sidebar() {
  const pathname = usePathname();
  const { player, loading } = usePlayer();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 lg:block">
      {/* Glowing left edge gradient */}
      <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-primary/0 via-primary/40 to-primary/0 animate-pulse-glow" />

      {/* Main sidebar content */}
      <div className="flex h-full flex-col glass border-r border-l-0 border-white/[0.04] px-4 py-5">
        {/* Logo */}
        <Link href="/dashboard" className="group flex items-center gap-3 px-2">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary transition-all duration-300 group-hover:bg-primary/25 glow-primary">
            <Activity className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
            <div className="absolute inset-0 rounded-lg bg-primary/10 animate-pulse-glow" />
          </div>
          <div>
            <p className="font-semibold tracking-tight text-gradient from-primary to-emerald-300">
              The System
            </p>
            <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
              Life OS
            </p>
          </div>
        </Link>

        {/* Nav */}
        <nav className="mt-8 flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200",
                  "hover:bg-white/[0.04] hover:text-foreground",
                  isActive && "text-foreground bg-white/[0.06]"
                )}
              >
                {/* Active indicator - glowing left border */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-full bg-primary glow-primary" />
                )}

                <Icon
                  className={cn(
                    "h-4 w-4 transition-colors duration-200",
                    isActive ? "text-primary" : "group-hover:text-foreground"
                  )}
                />

                <span>{item.title}</span>

                {/* Subtle gradient overlay on active */}
                {isActive && (
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/[0.08] to-transparent pointer-events-none" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Player Level / XP Indicator */}
        <div className="mt-auto border-t border-white/[0.06] pt-4">
          {loading ? (
            <div className="space-y-2 px-2">
              <div className="h-3 w-24 animate-pulse rounded bg-white/[0.06]" />
              <div className="h-2 w-full animate-pulse rounded-full bg-white/[0.06]" />
            </div>
          ) : player ? (
            <div className="space-y-3 px-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/15 text-primary glow-primary">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      Level {player.level}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {player.tier.name}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-medium text-primary">
                  {player.currentLevelXp}/{player.xpForNextLevel} XP
                </span>
              </div>

              {/* XP Progress Bar */}
              <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-300 transition-all duration-700 ease-out"
                  style={{ width: `${player.progressPercent}%` }}
                />
                <div
                  className="absolute top-0 h-full rounded-full bg-gradient-to-r from-primary/50 to-emerald-300/50 blur-sm"
                  style={{ width: `${player.progressPercent}%` }}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
