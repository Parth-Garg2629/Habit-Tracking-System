"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navItems } from "@/components/layout/nav-items";
import { usePlayer } from "@/hooks/use-player";

export function Sidebar() {
  const pathname = usePathname();
  const { player } = usePlayer();

  const operatorName = player?.name ? player.name.toUpperCase() : "OPERATOR_01";
  const operatorRank = player?.tier?.name ? `RANK: ${player.tier.name.toUpperCase()}` : "RANK: ELITE";
  const level = player?.level ?? 24;

  return (
    <nav 
      className="hidden md:flex bg-surface/60 backdrop-blur-xl font-label-caps text-label-caps font-display-lg text-primary shadow-[5px_0_15px_rgba(34,211,238,0.1)] fixed left-0 top-16 h-[calc(100vh-64px)] z-40 flex-col py-gutter w-20 hover:w-64 transition-all duration-500 overflow-hidden group border-r border-primary/10"
    >
      {/* User Profile Area */}
      <div className="flex items-center gap-4 px-4 mb-8 w-64 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 whitespace-nowrap">
        <div className="w-10 h-10 rounded-full border border-primary/50 overflow-hidden shrink-0 glass-panel flex items-center justify-center bg-primary/20 text-primary font-bold text-sm">
          {operatorName.slice(0, 2)}
        </div>
        <div>
          <div className="text-primary font-headline-sm text-sm tracking-widest neon-text truncate max-w-[140px]">{operatorName}</div>
          <div className="text-outline text-[10px] tracking-widest">{operatorRank} (LV.{level})</div>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-2 px-2 w-64">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/dashboard");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-3 py-3 rounded-md border-l-4 transition-transform relative group/item",
                isActive
                  ? "text-primary border-primary bg-primary/10 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] translate-x-1"
                  : "text-outline opacity-70 border-transparent hover:bg-primary/5 hover:text-primary-container hover:translate-x-1"
              )}
            >
              <Icon className="h-5 w-5 shrink-0 text-xl" />
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap tracking-widest">
                {item.title}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
