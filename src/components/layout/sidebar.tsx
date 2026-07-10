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
      <div className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-primary/0 via-primary to-primary/0 animate-scanline" />

      {/* Main sidebar content */}
      <div className="flex h-full flex-col glass border-r border-primary/20 bg-blue-900/20 px-4 py-5 backdrop-blur-md">
        {/* Logo */}
        <Link href="/dashboard" className="group flex items-center gap-3 px-2">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-none bg-primary/15 text-primary transition-all duration-300 group-hover:bg-primary/25 border border-primary/30 glow-primary">
            <Activity className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
            <div className="absolute inset-0 bg-primary/10 animate-pulse-glow" />
          </div>
          <div>
            <p className="font-bold tracking-tight text-primary shadow-primary drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]">
              [ THE SYSTEM ]
            </p>
            <p className="text-[11px] font-medium uppercase tracking-widest text-primary/70">
              Status OS
            </p>
          </div>
        </Link>

        {/* Nav */}
        <nav className="mt-8 flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-none px-3 py-2.5 text-sm font-medium transition-all duration-200 border-l-4",
                  !isActive && "border-transparent text-muted-foreground hover:bg-primary/5 hover:text-primary/80 hover:border-primary/30",
                  isActive && "border-primary text-primary bg-primary/10 shadow-[inset_4px_0_10px_rgba(0,255,255,0.1)]"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 transition-colors duration-200",
                    isActive ? "text-primary animate-pulse" : "group-hover:text-primary/80"
                  )}
                />

                <span className={cn("tracking-wide uppercase text-xs", isActive && "font-bold shadow-primary")}>
                  [ {item.title} ]
                </span>

                {/* Subtle gradient overlay on active */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.15] to-transparent pointer-events-none animate-scanline opacity-50" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Player Level / XP Indicator */}
        <div className="mt-auto border-t border-primary/30 pt-4 relative">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          {loading ? (
            <div className="space-y-2 px-2">
              <div className="h-3 w-24 animate-pulse rounded-none bg-primary/20" />
              <div className="h-2 w-full animate-pulse rounded-none bg-primary/20" />
            </div>
          ) : player ? (
            <div className="space-y-3 px-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-none bg-primary/15 text-primary border border-primary/30 shadow-[0_0_10px_rgba(0,255,255,0.2)]">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-primary uppercase tracking-wider drop-shadow-[0_0_2px_rgba(0,255,255,0.5)]">
                      Level {player.level}
                    </p>
                    <p className="text-[10px] text-primary/70 uppercase">
                      {player.tier.name}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-primary tracking-wider">
                  {player.currentLevelXp}/{player.xpForNextLevel} XP
                </span>
              </div>

              {/* XP Progress Bar */}
              <div className="relative h-[2px] w-full overflow-hidden bg-background/50">
                <div
                  className="h-full bg-primary transition-all duration-700 ease-out shadow-[0_0_10px_rgba(0,255,255,0.8)]"
                  style={{ width: `${player.progressPercent}%` }}
                />
                <div
                  className="absolute top-0 h-full bg-primary blur-[2px] opacity-70"
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
