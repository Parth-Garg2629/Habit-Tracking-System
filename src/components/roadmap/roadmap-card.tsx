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
        "group relative overflow-hidden rounded-none",
        "glass system-border border-l-4 border-l-cyan-400",
        "hover:bg-violet-900/40 hover:border-cyan-400/60 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]",
        "hover:-translate-y-1 transition-all duration-300"
      )}
    >
      <CardHeader className="pb-3 pl-5">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base truncate font-semibold text-cyan-400" title={`[ ${roadmap.title} ]`}>
              [ {roadmap.title} ]
            </CardTitle>
            {roadmap.description && (
              <p className="text-xs text-cyan-100/70 mt-1.5 line-clamp-2 leading-relaxed">
                {roadmap.description}
              </p>
            )}
          </div>

          {/* Glowing icon */}
          <div className="relative flex-shrink-0 ml-4">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-none",
                "bg-violet-950/50 border border-cyan-400/30",
                "shadow-[0_0_10px_rgba(34,211,238,0.2)]",
                "group-hover:shadow-[0_0_16px_rgba(34,211,238,0.35)]",
                "transition-shadow duration-300"
              )}
            >
              <GitBranch className="h-5 w-5 text-cyan-400" />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pl-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="text-[10px] px-2 py-0.5 rounded-none bg-violet-900/40 border border-cyan-400/20 text-cyan-200"
            >
              [ {roadmap.nodeCount} {roadmap.nodeCount === 1 ? "node" : "nodes"} ]
            </Badge>
            <span className="text-[10px] text-cyan-100/50">
              Updated {updatedAt}
            </span>
          </div>
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-none text-cyan-100/60 hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-all duration-200"
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
                className="h-7 w-7 rounded-none text-cyan-100/60 hover:text-cyan-400 hover:bg-cyan-400/10 transition-colors duration-200"
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
