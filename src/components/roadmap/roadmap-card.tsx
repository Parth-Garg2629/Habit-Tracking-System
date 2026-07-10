"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowRight, GitBranch } from "lucide-react";
import type { RoadmapSummary } from "@/types/roadmap";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface RoadmapCardProps {
  roadmap: RoadmapSummary;
  onDelete: (id: string) => void;
}

export function RoadmapCard({ roadmap, onDelete }: RoadmapCardProps) {
  const updatedAt = new Date(roadmap.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card
      className={cn(
        "group relative overflow-hidden",
        "bg-card/60 backdrop-blur-xl border border-white/[0.06]",
        "hover:bg-card/80 hover:border-white/[0.1] hover:shadow-lg hover:shadow-primary/5",
        "hover:-translate-y-1 transition-all duration-300"
      )}
    >
      {/* Gradient accent on the left edge */}
      <div className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-primary via-emerald-400 to-amber-400 opacity-50 group-hover:opacity-100 transition-opacity duration-300" />

      <CardHeader className="pb-3 pl-5">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base truncate font-semibold" title={roadmap.title}>
              {roadmap.title}
            </CardTitle>
            {roadmap.description && (
              <p className="text-xs text-muted-foreground/80 mt-1.5 line-clamp-2 leading-relaxed">
                {roadmap.description}
              </p>
            )}
          </div>

          {/* Glowing icon */}
          <div className="relative flex-shrink-0">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl",
                "bg-primary/10 border border-primary/20",
                "shadow-[0_0_10px_rgba(16,185,129,0.2)]",
                "group-hover:shadow-[0_0_16px_rgba(16,185,129,0.35)]",
                "transition-shadow duration-300"
              )}
            >
              <GitBranch className="h-5 w-5 text-primary" />
            </div>
            <div className="absolute inset-0 rounded-xl bg-primary/5 blur-md -z-10" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pl-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="text-[10px] px-2 py-0.5 bg-secondary/60 border border-white/[0.06] text-muted-foreground"
            >
              {roadmap.nodeCount} {roadmap.nodeCount === 1 ? "node" : "nodes"}
            </Badge>
            <span className="text-[10px] text-muted-foreground/60">
              Updated {updatedAt}
            </span>
          </div>
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all duration-200"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(roadmap.id);
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
            <Link href={`/roadmaps/${roadmap.id}`}>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground/60 hover:text-primary hover:bg-primary/10 transition-colors duration-200"
              >
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
