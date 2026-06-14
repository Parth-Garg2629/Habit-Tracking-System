"use client";

import { useSkills } from "@/hooks/use-skills";
import { SkillCard } from "@/components/skills/skill-card";
import { Loader2 } from "lucide-react";

export default function SkillsPage() {
  const { skills, loading } = useSkills();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Progression</p>
        <h1 className="text-3xl font-semibold tracking-normal">My Skills</h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : skills.length === 0 ? (
        <div className="text-center py-20 bg-secondary/20 rounded-xl border border-border/50">
          <p className="text-muted-foreground text-sm">No skills tracked yet.</p>
          <p className="text-xs text-muted-foreground mt-1">Complete AI daily logs to start tracking skills.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {skills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      )}
    </div>
  );
}
