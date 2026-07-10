"use client";

import React from "react";
import { useSkills, type Skill } from "@/hooks/use-skills";
import { usePlayer } from "@/hooks/use-player";
import { SkillCard } from "@/components/skills/skill-card";

export default function SkillsPage() {
  const { skills } = useSkills();
  const { player } = usePlayer();

  const operatorId = player?.id ? `OP-${player.id.slice(0, 6).toUpperCase()}` : "OP-7729-X";
  const level = player?.level ?? 42;
  const totalXp = player?.totalXp ?? 8492;

  // Sample default skills if user hasn't added real ones
  const sampleSkills: Skill[] = [
    { id: "s1", name: "NEURAL PROGRAMMING", category: "cognitive", xp: 14500, level: 12 },
    { id: "s2", name: "CYBERNETIC FITNESS", category: "physical", xp: 9200, level: 8 },
    { id: "s3", name: "QUANTUM MATHEMATICS", category: "cognitive", xp: 18900, level: 15 },
    { id: "s4", name: "TACTICAL LEADERSHIP", category: "social", xp: 6400, level: 6 }
  ];

  const displaySkills: Skill[] = skills.length > 0 ? skills : sampleSkills;

  return (
    <div className="flex flex-col gap-gutter">
      {/* Profile Header */}
      <header className="w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-primary/20 pb-4">
        <div>
          <h1 className="font-display-lg text-display-lg text-primary drop-shadow-[0_0_8px_rgba(34,211,238,0.4)] glitch-text">
            PROFILE_DATA
          </h1>
          <p className="font-data-mono text-xs text-outline mt-1">
            ID: {operatorId} | STATUS: <span className="text-success">OPTIMAL</span>
          </p>
        </div>
        <div className="text-left md:text-right">
          <div className="font-label-caps text-label-caps text-secondary mb-1">[ SYNC_LEVEL ]</div>
          <div className="font-headline-md text-headline-md text-on-surface neon-text">LVL {level}</div>
        </div>
      </header>

      {/* Bento Grid Top Section: Radar & Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Core Radar Chart (Centerpiece) */}
        <div className="glass-panel col-span-1 lg:col-span-8 p-6 flex flex-col items-center justify-center relative min-h-[480px] rounded-lg">
          <div className="absolute top-4 left-4 font-label-caps text-label-caps text-primary">[ STAT_MATRIX ]</div>
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#22d3ee]" />
            <span className="font-data-mono text-[10px] text-primary">LIVE TELEMETRY</span>
          </div>

          <div className="w-full max-w-md relative mt-6 flex items-center justify-center aspect-square">
            <svg className="w-full h-full transform -rotate-22.5" viewBox="0 0 200 200">
              <g transform="translate(100,100)">
                {/* Webs */}
                <polygon className="stroke-outline/30 fill-none stroke-[0.5px]" points="0,-80 56.5,-56.5 80,0 56.5,56.5 0,80 -56.5,56.5 -80,0 -56.5,-56.5" />
                <polygon className="stroke-outline/40 fill-none stroke-[0.5px]" points="0,-60 42.4,-42.4 60,0 42.4,42.4 0,60 -42.4,42.4 -60,0 -42.4,-42.4" />
                <polygon className="stroke-outline/50 fill-none stroke-[0.5px]" points="0,-40 28.3,-28.3 40,0 28.3,28.3 0,40 -28.3,28.3 -40,0 -28.3,-28.3" />
                <polygon className="stroke-outline/60 fill-none stroke-[0.5px]" points="0,-20 14.1,-14.1 20,0 14.1,14.1 0,20 -14.1,14.1 -20,0 -14.1,-14.1" />
                
                {/* Axes */}
                <line className="stroke-outline/40 stroke-[0.5px]" x1="0" x2="0" y1="0" y2="-90" />
                <line className="stroke-outline/40 stroke-[0.5px]" x1="0" x2="63.6" y1="0" y2="-63.6" />
                <line className="stroke-outline/40 stroke-[0.5px]" x1="0" x2="90" y1="0" y2="0" />
                <line className="stroke-outline/40 stroke-[0.5px]" x1="0" x2="63.6" y1="0" y2="63.6" />
                <line className="stroke-outline/40 stroke-[0.5px]" x1="0" x2="0" y1="0" y2="90" />
                <line className="stroke-outline/40 stroke-[0.5px]" x1="0" x2="-63.6" y1="0" y2="63.6" />
                <line className="stroke-outline/40 stroke-[0.5px]" x1="0" x2="-90" y1="0" y2="0" />
                <line className="stroke-outline/40 stroke-[0.5px]" x1="0" x2="-63.6" y1="0" y2="-63.6" />
                
                {/* Data Polygon */}
                <polygon 
                  className="fill-secondary/20 stroke-primary stroke-2 [filter:drop-shadow(0_0_10px_rgba(34,211,238,0.6))]" 
                  points="0,-68 36,-36 72,0 22.6,22.6 0,56 -28.3,28.3 -64,0 -42.4,-42.4" 
                />
                
                {/* Data Points */}
                <circle className="fill-primary stroke-background stroke-1 [filter:drop-shadow(0_0_5px_rgba(34,211,238,0.8))]" cx="0" cy="-68" r="3" />
                <circle className="fill-primary stroke-background stroke-1" cx="36" cy="-36" r="3" />
                <circle className="fill-primary stroke-background stroke-1" cx="72" cy="0" r="3" />
                <circle className="fill-primary stroke-background stroke-1" cx="22.6" cy="22.6" r="3" />
                <circle className="fill-primary stroke-background stroke-1" cx="0" cy="56" r="3" />
                <circle className="fill-primary stroke-background stroke-1" cx="-28.3" cy="28.3" r="3" />
                <circle className="fill-primary stroke-background stroke-1" cx="-64" cy="0" r="3" />
                <circle className="fill-primary stroke-background stroke-1" cx="-42.4" cy="-42.4" r="3" />
                
                {/* Labels */}
                <g className="transform rotate-22.5 font-label-caps text-[11px] font-bold tracking-widest fill-primary [text-shadow:0_0_5px_rgba(34,211,238,0.5)]">
                  <text textAnchor="middle" x="0" y="-92">[STR]</text>
                  <text textAnchor="start" x="65" y="-65">[INT]</text>
                  <text textAnchor="start" x="90" y="4">[FOC]</text>
                  <text textAnchor="start" x="65" y="75">[DIS]</text>
                  <text textAnchor="middle" x="0" y="102">[CRE]</text>
                  <text textAnchor="end" x="-65" y="75">[CON]</text>
                  <text textAnchor="end" x="-90" y="4">[END]</text>
                  <text textAnchor="end" x="-65" y="-65">[KNO]</text>
                </g>
              </g>
            </svg>
          </div>
        </div>

        {/* Right Column Data */}
        <div className="col-span-1 lg:col-span-4 flex flex-col gap-gutter">
          {/* Power Rating */}
          <div className="glass-panel p-6 rounded-lg flex flex-col items-center justify-center py-8">
            <div className="font-label-caps text-label-caps text-outline mb-2">[ PWR_RATING ]</div>
            <div className="relative">
              <div className="font-display-lg text-5xl font-bold text-secondary drop-shadow-[0_0_15px_rgba(208,188,255,0.6)]">
                {totalXp.toLocaleString()}
              </div>
              <div className="absolute -right-10 top-0 font-data-mono text-primary text-[10px]">+14%</div>
            </div>
          </div>

          {/* Detailed Readouts */}
          <div className="glass-panel p-6 rounded-lg flex-1 flex flex-col justify-between gap-6">
            <div className="font-label-caps text-label-caps text-primary">[ VITAL_METRICS ]</div>
            <div className="flex flex-col gap-5">
              {/* Metric 1 */}
              <div>
                <div className="flex justify-between items-end mb-2 font-data-mono text-xs">
                  <span className="text-on-surface">CORTICAL_SYNC</span>
                  <span className="text-primary font-bold">94.2%</span>
                </div>
                <div className="progress-bar-container h-2 w-full">
                  <div className="progress-bar-fill" style={{ width: "94.2%" }} />
                </div>
              </div>
              {/* Metric 2 */}
              <div>
                <div className="flex justify-between items-end mb-2 font-data-mono text-xs">
                  <span className="text-on-surface">ENERGY_RESERVE</span>
                  <span className="text-secondary font-bold">62.0%</span>
                </div>
                <div className="progress-bar-container h-2 w-full">
                  <div className="progress-bar-fill bg-secondary shadow-[0_0_10px_#d0bcff]" style={{ width: "62%" }} />
                </div>
              </div>
              {/* Metric 3 */}
              <div>
                <div className="flex justify-between items-end mb-2 font-data-mono text-xs">
                  <span className="text-on-surface">ARMOR_INTEGRITY</span>
                  <span className="text-success font-bold">88.5%</span>
                </div>
                <div className="progress-bar-container h-2 w-full">
                  <div className="progress-bar-fill fill-success" style={{ width: "88.5%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills & Competencies Grid */}
      <section className="flex flex-col gap-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="font-headline-sm text-headline-sm text-primary bracketed-text neon-text">
            TRACKED COMPETENCIES & SKILLS
          </h2>
          <span className="font-data-mono text-xs text-outline">
            {displaySkills.length} SKILLS ACTIVE
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displaySkills.map((skill: Skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      </section>
    </div>
  );
}
