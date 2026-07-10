"use client";

import { useSkills } from "@/hooks/use-skills";
import { SkillCard } from "@/components/skills/skill-card";
import { Sparkles, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function SkillCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-xl bg-card/60 backdrop-blur-xl border border-white/[0.06] p-5">
      {/* Top accent bar */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary/30 via-emerald-400/30 to-amber-400/30" />

      <div className="flex items-start justify-between pt-1">
        <div className="space-y-2 flex-1">
          <div className="h-5 w-28 rounded-md bg-secondary/60 animate-pulse" />
          <div className="h-4 w-16 rounded-full bg-secondary/40 animate-pulse" />
        </div>
        <div className="h-11 w-11 rounded-full bg-secondary/50 animate-pulse" />
      </div>

      <div className="mt-5 space-y-2">
        <div className="h-3 w-16 rounded bg-secondary/40 animate-pulse" />
        <div className="flex justify-between">
          <div className="h-3 w-24 rounded bg-secondary/40 animate-pulse" />
          <div className="h-3 w-8 rounded bg-secondary/40 animate-pulse" />
        </div>
        <div className="h-2 w-full rounded-full bg-secondary/30 animate-pulse" />
        <div className="h-2.5 w-20 rounded bg-secondary/30 animate-pulse ml-auto" />
      </div>
    </div>
  );
}

export default function SkillsPage() {
  const { skills, loading } = useSkills();

  return (
    <div className="space-y-8">
      {/* Premium page header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Progression
          </p>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
            My Skills
          </h1>
        </div>
        {!loading && skills.length > 0 && (
          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 text-xs font-medium shadow-[0_0_10px_rgba(16,185,129,0.15)]"
          >
            {skills.length} {skills.length === 1 ? "skill" : "skills"} tracked
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
        <div className="text-center py-24 rounded-xl bg-card/40 backdrop-blur-xl border border-white/[0.06]">
          {/* Glowing icon */}
          <div className="relative inline-flex">
            <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              <Zap className="h-7 w-7 text-primary" />
            </div>
            <div className="absolute inset-0 rounded-2xl bg-primary/10 blur-xl -z-10" />
          </div>
          <p className="text-muted-foreground mt-5 font-medium">
            No skills tracked yet
          </p>
          <p className="text-sm text-muted-foreground/70 mt-1.5 max-w-xs mx-auto">
            Complete AI daily logs to start tracking skills and{" "}
            <span className="bg-gradient-to-r from-primary to-amber-400 bg-clip-text text-transparent font-medium">
              level up your abilities
            </span>
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
