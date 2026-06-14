"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Brain, Send, Loader2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AnalyzePayload } from "@/types/analysis";

interface LogFormProps {
  onSubmit: (payload: AnalyzePayload) => Promise<void>;
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
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/15 text-purple-400">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base">Learning Log</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Describe what you learned — AI will detect skills &amp; suggest XP
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder="Today I worked on building a REST API with Express.js and learned about middleware patterns. I also debugged a tricky async/await issue with Promise.all and finally understood how error boundaries work in React..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              maxLength={5000}
              className="resize-none bg-secondary/30 border-border/50 text-sm leading-relaxed placeholder:text-muted-foreground/50"
              disabled={isAnalyzing}
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className={cn(charCount > 0 && charCount < 10 && "text-destructive")}>
                {charCount > 0 && charCount < 10 ? "At least 10 characters required" : "\u00A0"}
              </span>
              <span>{charCount.toLocaleString()} / 5,000</span>
            </div>
          </div>

          <div className="flex items-end gap-3">
            <div className="flex-1 max-w-[200px]">
              <label className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
                <Clock className="h-3 w-3" />
                Duration (minutes)
              </label>
              <Input
                type="number"
                min={1}
                max={720}
                placeholder="e.g., 45"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="bg-secondary/30 border-border/50 text-sm"
                disabled={isAnalyzing}
              />
            </div>
            <button
              type="submit"
              disabled={!isValid || isAnalyzing}
              className={cn(
                "flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all",
                isValid && !isAnalyzing
                  ? "bg-purple-600 text-white hover:bg-purple-500 shadow-lg shadow-purple-600/20"
                  : "bg-secondary text-muted-foreground cursor-not-allowed"
              )}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Analyze with AI
                </>
              )}
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
