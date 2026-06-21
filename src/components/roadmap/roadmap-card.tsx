"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowRight, GitBranch } from "lucide-react";
import type { RoadmapSummary } from "@/types/roadmap";
import Link from "next/link";

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
    <Card className="group relative hover:border-primary/50 transition-all duration-200 hover:shadow-lg hover:shadow-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base truncate" title={roadmap.title}>
              {roadmap.title}
            </CardTitle>
            {roadmap.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {roadmap.description}
              </p>
            )}
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
            <GitBranch className="h-5 w-5" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              {roadmap.nodeCount} {roadmap.nodeCount === 1 ? "node" : "nodes"}
            </Badge>
            <span className="text-[10px] text-muted-foreground">
              Updated {updatedAt}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
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
                className="h-7 w-7 text-muted-foreground hover:text-primary"
              >
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
