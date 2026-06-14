"use client";

import { LogForm } from "@/components/analysis/log-form";
import { AnalysisResultCard } from "@/components/analysis/analysis-result-card";
import { QuestList } from "@/components/quests/quest-list";
import { useAnalysis } from "@/hooks/use-analysis";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function DailyLogPage() {
  const { state, analyze, confirm, reject, reset } = useAnalysis();

  const handleConfirm = async () => {
    if (state.step !== "result") return;
    const res = await confirm(state.analysis.id);
    if (res) {
      setTimeout(() => {
        reset();
      }, 3000);
    }
  };

  const handleReject = async () => {
    if (state.step !== "result") return;
    await reject(state.analysis.id);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Daily execution</p>
        <h1 className="text-3xl font-semibold tracking-normal">Daily Learning Log</h1>
      </div>

      <QuestList />

      {state.step === "error" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      {state.step === "confirmed" && (
        <Alert className="border-emerald-500/20 bg-emerald-500/10 text-emerald-500">
          <AlertCircle className="h-4 w-4 text-emerald-500" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            Awarded {state.result.xpAwarded} XP and updated {state.result.skillsUpdated} skills.
            {state.result.levelUp && (
              <span className="block mt-1 font-bold">
                Level Up! {state.result.levelUp.from} → {state.result.levelUp.to}
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}

      {(state.step === "idle" || state.step === "analyzing" || state.step === "error") && (
        <LogForm
          onSubmit={analyze}
          isAnalyzing={state.step === "analyzing"}
        />
      )}

      {(state.step === "result" || state.step === "confirming") && state.step !== "idle" && "analysis" in state && (
        <AnalysisResultCard
          analysis={state.analysis}
          onConfirm={handleConfirm}
          onReject={handleReject}
          isConfirming={state.step === "confirming"}
        />
      )}
    </div>
  );
}
