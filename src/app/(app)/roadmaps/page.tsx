"use client";

import { useRoadmaps } from "@/hooks/use-roadmaps";
import { RoadmapCard } from "@/components/roadmap/roadmap-card";
import { CreateRoadmapDialog } from "@/components/roadmap/create-roadmap-dialog";
import { GitBranch, Map } from "lucide-react";

function RoadmapCardSkeleton() {
  return (
    <div className="glass-panel border-l-4 border-l-primary p-5 rounded-md space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className="h-5 w-32 rounded bg-primary/20 animate-pulse" />
          <div className="h-3 w-44 rounded bg-outline/20 animate-pulse" />
        </div>
        <div className="h-10 w-10 rounded-full bg-primary/10 animate-pulse" />
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-primary/10">
        <div className="h-4 w-20 rounded bg-outline/20 animate-pulse" />
        <div className="h-6 w-6 rounded bg-primary/20 animate-pulse" />
      </div>
    </div>
  );
}

export default function RoadmapsPage() {
  const { roadmaps, loading, error, createRoadmap, deleteRoadmap } =
    useRoadmaps();

  return (
    <div className="flex flex-col gap-gutter">
      {/* Roadmaps Header */}
      <header className="w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-primary/20 pb-4">
        <div>
          <div className="flex items-center gap-2 font-data-mono text-xs text-primary mb-1">
            <Map className="h-3.5 w-3.5" />
            <span>SYSTEM GOALS &amp; SKILL TREES</span>
          </div>
          <h1 className="font-display-lg text-display-lg text-primary drop-shadow-[0_0_8px_rgba(34,211,238,0.4)] glitch-text">
            QUEST_PROGRESSION
          </h1>
          <p className="font-data-mono text-xs text-outline mt-1">
            STRATEGIC DIRECTIVES: MULTI-STEP LEARNING ROADMAPS &amp; MILESTONE MATRICES
          </p>
        </div>
        <div className="flex items-center gap-3 self-stretch md:self-end justify-between md:justify-end">
          {!loading && roadmaps.length > 0 && (
            <span className="font-label-caps text-xs px-3 py-1 rounded.md bg-secondary/15 border border-secondary/40 text-secondary tracking-widest shadow-[0_0_10px_rgba(208,188,255,0.2)]">
              [ {roadmaps.length} {roadmaps.length === 1 ? "QUEST ACTIVE" : "QUESTS ACTIVE"} ]
            </span>
          )}
          <CreateRoadmapDialog
            onCreate={async (title, description) => {
              await createRoadmap({ title, description });
            }}
          />
        </div>
      </header>

      {error && (
        <div className="glass-panel border-error/50 bg-error/10 p-4 rounded text-sm text-error font-data-mono flex items-center gap-3">
          <div className="h-2.5 w-2.5 rounded-full bg-error animate-pulse" />
          <span>[ TELEMETRY_ERROR ]: {error}</span>
        </div>
      )}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pt-2">
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
        <div className="glass-panel p-16 rounded-lg text-center flex flex-col items-center justify-center space-y-5 my-4 border border-primary/30 shadow-[0_0_30px_rgba(34,211,238,0.1)]">
          <div className="w-20 h-20 rounded-full border border-primary/40 glass-panel flex items-center justify-center shadow-[0_0_25px_rgba(34,211,238,0.3)] bg-primary/10">
            <GitBranch className="h-9 w-9 text-primary animate-pulse" />
          </div>
          <div>
            <h3 className="font-headline-sm text-headline-sm text-primary font-bold">NO ACTIVE QUEST ROADMAPS DETECTED</h3>
            <p className="font-data-mono text-xs text-outline max-w-md mx-auto mt-2 leading-relaxed">
              Initialize a strategic roadmap to map milestones, track node completion, and unlock advanced neural capabilities.
            </p>
          </div>
          <div className="pt-2">
            <CreateRoadmapDialog
              onCreate={async (title, description) => {
                await createRoadmap({ title, description });
              }}
            />
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pt-2">
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
