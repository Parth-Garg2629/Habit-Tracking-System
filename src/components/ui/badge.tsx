import * as React from "react";
import { cn } from "@/lib/utils";

const Badge = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & {
    variant?: "default" | "secondary" | "outline" | "success" | "warning" | "destructive";
  }
>(({ className, variant = "default", ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        {
          "bg-primary/15 text-primary": variant === "default",
          "bg-secondary text-secondary-foreground": variant === "secondary",
          "border border-border text-muted-foreground": variant === "outline",
          "bg-emerald-500/15 text-emerald-400": variant === "success",
          "bg-amber-500/15 text-amber-400": variant === "warning",
          "bg-destructive/15 text-destructive": variant === "destructive",
        },
        className
      )}
      {...props}
    />
  );
});
Badge.displayName = "Badge";

export { Badge };
