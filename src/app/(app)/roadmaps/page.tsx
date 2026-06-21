"use client";

import { useRoadmaps } from "@/hooks/use-roadmaps";
import { RoadmapCard } from "@/components/roadmap/roadmap-card";
import { CreateRoadmapDialog } from "@/components/roadmap/create-roadmap-dialog";
import { Loader2, GitBranch } from "lucide-react";

export default function RoadmapsPage() {
  const { roadmaps, loading, error, createRoadmap, deleteRoadmap } =
    useRoadmaps();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Learning Paths</p>
          <h1 className="text-3xl font-semibold tracking-normal">
            My Roadmaps
          </h1>
        </div>
        <CreateRoadmapDialog
          onCreate={async (title, description) => {
            await createRoadmap({ title, description });
          }}
        />
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : roadmaps.length === 0 ? (
        <div className="text-center py-20 bg-secondary/20 rounded-xl border border-border/50">
          <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-secondary/60 border border-border/50 mb-3">
            <GitBranch className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm">
            No roadmaps yet
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Create your first roadmap to start mapping out your learning path.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {roadmaps.map((roadmap) => (
            <RoadmapCard
              key={roadmap.id}
              roadmap={roadmap}
              onDelete={deleteRoadmap}
            />
          ))}
        </div>
      )}
    </div>
  );
}
