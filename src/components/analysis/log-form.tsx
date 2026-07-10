"use client";

import { useState } from "react";
import { Brain, Send, Loader2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AnalyzePayload } from "@/types/analysis";

interface LogFormProps {
  onSubmit: (payload: AnalyzePayload) => Promise<unknown>;
  isAnalyzing: boolean;
}

export function LogForm({ onSubmit, isAnalyzing }: LogFormProps) {
  const [content, setContent] = useState("");
  const [duration, setDuration] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || content.trim().length < 10) return;
    await onSubmit({
      content: content.trim(),
      duration: duration ? parseInt(duration) : null,
    });
  };

  const charCount = content.length;
  const isValid = content.trim().length >= 10;

  return (
    <div className="glass-panel p-6 rounded-lg space-y-6 relative overflow-hidden">
      <div className="flex items-center justify-between border-b border-primary/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-primary/10 border border-primary/40 flex items-center justify-center text-primary shadow-[0_0_10px_rgba(34,211,238,0.2)]">
            <Brain className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-headline-sm text-headline-sm text-primary">TELEMETRY INGESTION TERMINAL</h3>
            <p className="font-data-mono text-xs text-outline mt-0.5">
              Input daily activities &mdash; AI Core will extract competencies and synthesize XP
            </p>
          </div>
        </div>
        <div className="hidden sm:block font-data-mono text-[10px] text-tertiary-container border border-tertiary-container/30 px-2.5 py-1 rounded">
          [ NLP_SYNTHESIS_READY ]
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between font-data-mono text-xs text-outline">
            <span>ACTIVITY &amp; LEARNING STREAM</span>
            <span className={cn(charCount > 0 && charCount < 10 ? "text-error font-bold" : "text-primary")}>
              {charCount.toLocaleString()} / 5,000 BYTES
            </span>
          </div>
          
          <textarea
            placeholder="[ TRANSMISSION START ] Today I engineered a custom JWT authentication service in Node.js, optimized SQL queries by indexing frequently accessed foreign keys, and resolved memory leaks inside a web worker thread..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            maxLength={5000}
            className="w-full rounded bg-background/60 border border-primary/30 p-4 font-data-mono text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-inner placeholder:text-outline/40 transition-all resize-none"
            disabled={isAnalyzing}
          />

          <div className="flex items-center justify-between text-xs font-data-mono text-outline">
            <span className={cn(charCount > 0 && charCount < 10 && "text-error")}>
              {charCount > 0 && charCount < 10 ? "[ ! ] MINIMUM 10 CHARACTERS REQUIRED FOR AI PARSING" : "[ SYSTEM READY ]"}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-end justify-between gap-4 pt-2 border-t border-primary/10">
          <div className="w-full sm:w-56">
            <label className="flex items-center gap-1.5 font-data-mono text-xs text-outline mb-1.5">
              <Clock className="h-3.5 w-3.5 text-secondary" />
              DURATION (MINUTES)
            </label>
            <input
              type="number"
              min={1}
              max={720}
              placeholder="e.g., 60"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full rounded bg-background/60 border border-primary/30 px-3 py-2 font-data-mono text-sm text-on-surface focus:outline-none focus:border-primary"
              disabled={isAnalyzing}
            />
          </div>

          <button
            type="submit"
            disabled={!isValid || isAnalyzing}
            className={cn(
              "flex items-center justify-center gap-2.5 rounded px-6 py-3 font-data-mono text-sm font-bold tracking-wider transition-all duration-300",
              isValid && !isAnalyzing
                ? "bg-primary text-background hover:bg-primary-fixed shadow-[0_0_20px_rgba(34,211,238,0.5)] hover:scale-[1.02]"
                : "bg-surface-variant/50 text-outline cursor-not-allowed border border-outline/20"
            )}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                NEURAL PARSING IN PROGRESS...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                TRANSMIT TO AI CORE
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
