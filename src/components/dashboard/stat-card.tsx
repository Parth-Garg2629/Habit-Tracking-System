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
        "group relative overflow-hidden rounded-xl border border-white/[0.06] bg-card/60 backdrop-blur-xl",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1 hover:border-white/[0.1] hover:shadow-lg hover:shadow-primary/5"
      )}
    >
      {/* Gradient top border accent */}
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-[1px]",
          accentColor ?? "bg-gradient-to-r from-transparent via-primary/60 to-transparent"
        )}
      />

      {/* Subtle corner glow */}
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/[0.06] blur-2xl transition-all duration-500 group-hover:bg-primary/[0.12]" />

      <div className="relative p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {title}
          </p>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary/20 group-hover:shadow-md group-hover:shadow-primary/20">
            <Icon className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-3">
          <span className="text-3xl font-bold tracking-tight text-foreground">
            {value}
          </span>
        </div>

        <p className="mt-1.5 text-xs text-muted-foreground">{detail}</p>
      </div>
    </div>
  );
}
