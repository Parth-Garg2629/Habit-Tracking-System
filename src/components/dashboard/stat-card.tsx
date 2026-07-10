import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type StatCardProps = {
  title: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  accentColor?: string;
};

export function StatCard({
  title,
  value,
  detail,
  icon: Icon,
  accentColor,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-none bg-background/40 backdrop-blur-xl glass",
        "border border-primary/20 hover:border-primary/50",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(0,255,255,0.15)]",
        "before:absolute before:inset-0 before:border before:border-primary/10 before:animate-pulse"
      )}
    >
      {/* Gradient top border accent */}
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-[2px]",
          accentColor ?? "bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_8px_rgba(0,255,255,0.8)]"
        )}
      />
      
      {/* Scanline overlay effect */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,255,0.02)_50%)] bg-[length:100%_4px] pointer-events-none opacity-50" />

      {/* Subtle corner glow */}
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-none bg-primary/[0.1] blur-2xl transition-all duration-500 group-hover:bg-primary/[0.2]" />

      <div className="relative p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-widest text-primary/80 drop-shadow-[0_0_2px_rgba(0,255,255,0.3)]">
            {title}
          </p>
          <div className="flex h-9 w-9 items-center justify-center rounded-none border border-primary/30 bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary/20 group-hover:shadow-[0_0_15px_rgba(0,255,255,0.4)]">
            <Icon className="h-4 w-4 drop-shadow-[0_0_5px_rgba(0,255,255,0.8)]" />
          </div>
        </div>

        <div className="mt-3">
          <span className="text-3xl font-bold tracking-tight text-primary drop-shadow-[0_0_8px_rgba(0,255,255,0.5)]">
            {value}
          </span>
        </div>

        <p className="mt-1.5 text-xs text-primary/60 uppercase tracking-wide">{detail}</p>
      </div>
    </div>
  );
}
