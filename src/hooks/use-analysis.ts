"use client";

import { useState, useCallback } from "react";
import type {
  AiAnalysisResult,
  AnalyzePayload,
  ConfirmResult,
} from "@/types/analysis";

type AnalysisState =
  | { step: "idle" }
  | { step: "analyzing" }
  | { step: "result"; analysis: AiAnalysisResult }
  | { step: "confirming" }
  | { step: "confirmed"; result: ConfirmResult }
  | { step: "error"; message: string };

export function useAnalysis() {
  const [state, setState] = useState<AnalysisState>({ step: "idle" });

  const analyze = useCallback(async (payload: AnalyzePayload) => {
    setState({ step: "analyzing" });
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Analysis failed");
      }
      const analysis: AiAnalysisResult = await res.json();
      setState({ step: "result", analysis });
      return analysis;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setState({ step: "error", message });
      return null;
    }
  }, []);

  const confirm = useCallback(async (analysisId: string) => {
    setState({ step: "confirming" });
    try {
      const res = await fetch(`/api/analyze/${analysisId}/confirm`, {
        method: "POST",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Confirmation failed");
      }
      const result: ConfirmResult = await res.json();
      setState({ step: "confirmed", result });
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setState({ step: "error", message });
      return null;
    }
  }, []);

  const reject = useCallback(async (analysisId: string) => {
    try {
      const res = await fetch(`/api/analyze/${analysisId}/reject`, {
        method: "POST",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Rejection failed");
      }
      setState({ step: "idle" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setState({ step: "error", message });
    }
  }, []);

  const reset = useCallback(() => {
    setState({ step: "idle" });
  }, []);

  return {
    state,
    analyze,
    confirm,
    reject,
    reset,
  };
}
