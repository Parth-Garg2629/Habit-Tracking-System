"use client";

import { useRoadmaps } from "@/hooks/use-roadmaps";
import { RoadmapCard } from "@/components/roadmap/roadmap-card";
import { CreateRoadmapDialog } from "@/components/roadmap/create-roadmap-dialog";
import { GitBranch, Map } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function RoadmapCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-none glass system-border border-l-4 border-l-cyan-400 p-5">
      <div className="flex items-start justify-between pl-1">
        <div className="space-y-2 flex-1">
          <div className="h-5 w-32 rounded-none bg-violet-900/50 animate-pulse" />
          <div className="h-3 w-44 rounded-none bg-violet-900/30 animate-pulse" />
        </div>
        <div className="h-10 w-10 rounded-none bg-violet-900/40 animate-pulse" />
      </div>

      <div className="flex items-center justify-between mt-4 pl-1">
        <div className="flex items-center gap-2">
          <div className="h-4 w-16 rounded-none bg-violet-900/40 animate-pulse" />
          <div className="h-3 w-24 rounded-none bg-violet-900/30 animate-pulse" />
        </div>
        <div className="flex gap-1">
          <div className="h-7 w-7 rounded-none bg-violet-900/30 animate-pulse" />
          <div className="h-7 w-7 rounded-none bg-violet-900/30 animate-pulse" />
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
      <div className="flex flex-col items-center justify-center text-center">
        <p className="text-sm text-cyan-400 flex items-center justify-center gap-1.5 mb-2">
          <Map className="h-3.5 w-3.5" />
          System Goals
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          [ QUEST PROGRESSION ]
        </h1>
        <div className="flex items-center justify-center gap-3 mt-4">
          {!loading && roadmaps.length > 0 && (
            <Badge
              variant="secondary"
              className="rounded-none bg-violet-900/30 text-cyan-400 border border-cyan-400/30 px-3 py-1 text-xs font-medium"
            >
              [ {roadmaps.length} {roadmaps.length === 1 ? "quest" : "quests"} ]
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
        <div className="rounded-none border border-red-500/50 bg-red-500/10 backdrop-blur-sm p-4 text-sm text-red-400 flex items-center gap-2 system-border">
          <div className="h-2 w-2 rounded-none bg-red-500 animate-pulse" />
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
        <div className="text-center py-24 rounded-none glass system-border">
          {/* Glowing icon */}
          <div className="relative inline-flex">
            <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-none bg-violet-950/50 border border-cyan-400/30 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
              <GitBranch className="h-7 w-7 text-cyan-400" />
            </div>
          </div>
          <p className="text-cyan-100 mt-5 font-medium">
            No quests found.
          </p>
          <p className="text-sm text-cyan-100/70 mt-1.5 max-w-xs mx-auto">
            Create your first quest to start{" "}
            <span className="text-cyan-400 font-medium">
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
