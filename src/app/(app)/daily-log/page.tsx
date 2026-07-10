"use client";

import { LogForm } from "@/components/analysis/log-form";
import { AnalysisResultCard } from "@/components/analysis/analysis-result-card";
import { QuestList } from "@/components/quests/quest-list";
import { useAnalysis } from "@/hooks/use-analysis";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Sparkles } from "lucide-react";

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
    <div className="flex flex-col gap-gutter">
      {/* Daily Log Header */}
      <header className="w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-primary/20 pb-4">
        <div>
          <h1 className="font-display-lg text-display-lg text-primary drop-shadow-[0_0_8px_rgba(34,211,238,0.4)] glitch-text">
            EXECUTION_LOG
          </h1>
          <p className="font-data-mono text-xs text-outline mt-1">
            PROTOCOL: DAILY_NEURAL_TELEMETRY | RECORDING: <span className="text-success animate-pulse">ACTIVE</span>
          </p>
        </div>
        <div className="text-left md:text-right">
          <div className="font-label-caps text-label-caps text-secondary mb-1">[ AI_NEURAL_ENGINE ]</div>
          <div className="font-headline-md text-headline-md text-on-surface neon-text">ONLINE v4.2</div>
        </div>
      </header>

      {/* Quests Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-headline-sm text-headline-sm text-primary bracketed-text neon-text">
            ACTIVE MISSIONS &amp; DIRECTIVES
          </h2>
          <span className="font-data-mono text-xs text-outline">DAILY PROTOCOLS</span>
        </div>
        <QuestList />
      </section>

      {/* Analysis Status Alerts */}
      {state.step === "error" && (
        <Alert variant="destructive" className="glass-panel border-error/50 bg-error/10 text-error rounded-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="font-data-mono font-bold">[ TELEMETRY_ERROR ]</AlertTitle>
          <AlertDescription className="font-data-mono text-xs">{state.message}</AlertDescription>
        </Alert>
      )}

      {state.step === "confirmed" && (
        <Alert className="glass-panel border-success/50 bg-success/10 text-success rounded-md shadow-[0_0_15px_rgba(74,222,128,0.2)]">
          <Sparkles className="h-4 w-4 text-success" />
          <AlertTitle className="font-data-mono font-bold">[ XP_SYNCHRONIZED_SUCCESS ]</AlertTitle>
          <AlertDescription className="font-data-mono text-xs">
            Awarded +{state.result.xpAwarded} XP and calibrated {state.result.skillsUpdated} neural skills.
            {state.result.levelUp && (
              <span className="block mt-2 text-primary font-bold text-sm neon-text">
                NEURAL UPGRADE! LVL {state.result.levelUp.from} → LVL {state.result.levelUp.to}
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Main AI Log / Result Section */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="font-headline-sm text-headline-sm text-secondary bracketed-text">
            NEURAL DATA INGESTION
          </h2>
          <span className="font-data-mono text-xs text-outline-variant">AI SKILL EXTRACTION</span>
        </div>

        {(state.step === "idle" || state.step === "analyzing" || state.step === "error") && (
          <LogForm
            onSubmit={analyze}
            isAnalyzing={state.step === "analyzing"}
          />
        )}

        {(state.step === "result" || state.step === "confirming") && (
          <AnalysisResultCard
            analysis={state.analysis}
            onConfirm={handleConfirm}
            onReject={handleReject}
            isConfirming={state.step === "confirming"}
          />
        )}
      </section>
    </div>
  );
}
