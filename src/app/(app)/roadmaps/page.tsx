"use client";

import { useRoadmaps } from "@/hooks/use-roadmaps";
import { RoadmapCard } from "@/components/roadmap/roadmap-card";
import { CreateRoadmapDialog } from "@/components/roadmap/create-roadmap-dialog";
import { GitBranch, Map } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function RoadmapCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-none bg-card/60 backdrop-blur-xl border border-white/[0.06] border-l-4 border-l-primary p-5">
      <div className="flex items-start justify-between pl-1">
        <div className="space-y-2 flex-1">
          <div className="h-5 w-32 rounded-none bg-secondary/60 animate-pulse" />
          <div className="h-3 w-44 rounded-none bg-secondary/40 animate-pulse" />
        </div>
        <div className="h-10 w-10 rounded-none bg-secondary/50 animate-pulse" />
      </div>

      <div className="flex items-center justify-between mt-4 pl-1">
        <div className="flex items-center gap-2">
          <div className="h-4 w-16 rounded-none bg-secondary/40 animate-pulse" />
          <div className="h-3 w-24 rounded-none bg-secondary/30 animate-pulse" />
        </div>
        <div className="flex gap-1">
          <div className="h-7 w-7 rounded-none bg-secondary/30 animate-pulse" />
          <div className="h-7 w-7 rounded-none bg-secondary/30 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function RoadmapsPage() {
  const { roadmaps, loading, error, createRoadmap, deleteRoadmap } =
    useRoadmaps();

  return (
    <div className="space-y-8">
      {/* Premium page header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Map className="h-3.5 w-3.5 text-primary" />
            System Goals
          </p>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
            Quest Progression
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {!loading && roadmaps.length > 0 && (
            <Badge
              variant="secondary"
              className="rounded-none bg-primary/10 text-primary border border-primary/20 px-3 py-1 text-xs font-medium shadow-[0_0_10px_rgba(16,185,129,0.15)]"
            >
              {roadmaps.length} {roadmaps.length === 1 ? "roadmap" : "roadmaps"}
            </Badge>
          )}
          <CreateRoadmapDialog
            onCreate={async (title, description) => {
              await createRoadmap({ title, description });
            }}
          />
        </div>
      </div>

      {error && (
        <div className="rounded-none border border-destructive/30 bg-destructive/10 backdrop-blur-sm p-4 text-sm text-destructive flex items-center gap-2">
          <div className="h-2 w-2 rounded-none bg-destructive animate-pulse" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              style={{ animationDelay: `${i * 75}ms` }}
              className="animate-in fade-in-0 fill-mode-both"
            >
              <RoadmapCardSkeleton />
            </div>
          ))}
        </div>
      ) : roadmaps.length === 0 ? (
        <div className="text-center py-24 rounded-none bg-card/40 backdrop-blur-xl border border-white/[0.06]">
          {/* Glowing icon */}
          <div className="relative inline-flex">
            <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-none bg-primary/10 border border-primary/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              <GitBranch className="h-7 w-7 text-primary" />
            </div>
            <div className="absolute inset-0 rounded-none bg-primary/10 blur-xl -z-10" />
          </div>
          <p className="text-muted-foreground mt-5 font-medium">
            No roadmaps yet
          </p>
          <p className="text-sm text-muted-foreground/70 mt-1.5 max-w-xs mx-auto">
            Create your first roadmap to start{" "}
            <span className="bg-gradient-to-r from-primary to-amber-400 bg-clip-text text-transparent font-medium">
              mapping out your learning journey
            </span>
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {roadmaps.map((roadmap, index) => (
            <div
              key={roadmap.id}
              className="animate-in fade-in-0 slide-in-from-bottom-4 fill-mode-both"
              style={{ animationDelay: `${index * 60}ms`, animationDuration: "400ms" }}
            >
              <RoadmapCard
                roadmap={roadmap}
                onDelete={deleteRoadmap}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
