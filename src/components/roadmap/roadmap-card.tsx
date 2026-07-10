"use client";

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
    <div
      className={cn(
        "glass-panel glass-panel-interactive p-5 rounded-md flex flex-col justify-between gap-4 group transition-all duration-300 relative overflow-hidden border-l-4 border-l-primary"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-headline-sm text-headline-sm text-primary group-hover:text-primary-fixed truncate transition-colors font-bold" title={roadmap.title}>
            {roadmap.title.toUpperCase()}
          </h3>
          {roadmap.description && (
            <p className="font-data-mono text-xs text-outline mt-1.5 line-clamp-2 leading-relaxed">
              {roadmap.description}
            </p>
          )}
        </div>

        {/* Glowing icon badge */}
        <div className="w-10 h-10 rounded-full border border-primary/40 glass-panel flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(34,211,238,0.25)] group-hover:shadow-[0_0_16px_rgba(34,211,238,0.5)] group-hover:scale-105 transition-all bg-primary/10">
          <GitBranch className="h-5 w-5 text-primary" />
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-primary/20">
        <div className="flex items-center gap-2">
          <span className="font-label-caps text-[10px] px-2 py-0.5 rounded bg-tertiary-container/20 border border-tertiary-container/30 text-tertiary-container uppercase tracking-wider">
            [ {roadmap.nodeCount} {roadmap.nodeCount === 1 ? "NODE" : "NODES"} ]
          </span>
          <span className="font-data-mono text-[10px] text-outline-variant">
            UPDATED: {updatedAt.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            className="p-1.5 rounded text-outline hover:text-error hover:bg-error/10 opacity-0 group-hover:opacity-100 transition-all duration-200"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(roadmap.id);
            }}
            title="Delete Quest Roadmap"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <Link href={`/roadmaps/${roadmap.id}`}>
            <button
              className="p-1.5 rounded text-primary hover:text-primary-fixed hover:bg-primary/10 transition-colors duration-200"
              title="Enter Quest Roadmap"
            >
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-200" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
