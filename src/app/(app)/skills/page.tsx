"use client";

import { useSkills } from "@/hooks/use-skills";
import { SkillCard } from "@/components/skills/skill-card";
import { Sparkles, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function SkillCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-none glass system-border p-5">
      <div className="flex items-start justify-between pt-1">
        <div className="space-y-2 flex-1">
          <div className="h-5 w-28 rounded-none bg-blue-900/50 animate-pulse" />
          <div className="h-4 w-16 rounded-none bg-blue-900/30 animate-pulse" />
        </div>
        <div className="h-11 w-11 rounded-none bg-blue-900/40 animate-pulse" />
      </div>

      <div className="mt-5 space-y-2">
        <div className="h-3 w-16 rounded-none bg-blue-900/30 animate-pulse" />
        <div className="flex justify-between">
          <div className="h-3 w-24 rounded-none bg-blue-900/30 animate-pulse" />
          <div className="h-3 w-8 rounded-none bg-blue-900/30 animate-pulse" />
        </div>
        <div className="h-[2px] w-full rounded-none bg-blue-900/40 animate-pulse" />
        <div className="h-2.5 w-20 rounded-none bg-blue-900/30 animate-pulse ml-auto" />
      </div>
    </div>
  );
}

export default function SkillsPage() {
  const { skills, loading } = useSkills();

  return (
    <div className="space-y-8">
      {/* Premium page header */}
      <div className="flex flex-col items-center justify-center text-center">
        <p className="text-sm text-cyan-400 flex items-center justify-center gap-1.5 mb-2">
          <Sparkles className="h-3.5 w-3.5" />
          Status Window
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          [ PLAYER SKILLS ]
        </h1>
        {!loading && skills.length > 0 && (
          <Badge
            variant="secondary"
            className="mt-4 rounded-none bg-blue-900/30 text-cyan-400 border border-cyan-400/30 px-3 py-1 text-xs font-medium"
          >
            [ {skills.length} {skills.length === 1 ? "skill" : "skills"} tracked ]
          </Badge>
        )}
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              style={{ animationDelay: `${i * 75}ms` }}
              className="animate-in fade-in-0 fill-mode-both"
            >
              <SkillCardSkeleton />
            </div>
          ))}
        </div>
      ) : skills.length === 0 ? (
        <div className="text-center py-24 rounded-none glass system-border">
          {/* Glowing icon */}
          <div className="relative inline-flex">
            <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-none bg-blue-950/50 border border-cyan-400/30 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
              <Zap className="h-7 w-7 text-cyan-400" />
            </div>
          </div>
          <p className="text-cyan-100 mt-5 font-medium">
            No skills registered in the System. Complete daily quests to acquire skills.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {skills.map((skill, index) => (
            <div
              key={skill.id}
              className="animate-in fade-in-0 slide-in-from-bottom-4 fill-mode-both"
              style={{ animationDelay: `${index * 60}ms`, animationDuration: "400ms" }}
            >
              <SkillCard skill={skill} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
