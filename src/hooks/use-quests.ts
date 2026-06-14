"use client";

import { useCallback, useEffect, useState } from "react";
import type { CreateQuestPayload, Quest, QuestsResponse } from "@/types/quests";

export function useQuests() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [completedToday, setCompletedToday] = useState(0);
  const [totalDaily, setTotalDaily] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [resetAt, setResetAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const applyResponse = (data: QuestsResponse) => {
    setQuests(data.quests);
    setCompletedToday(data.completedToday);
    setTotalDaily(data.totalDaily);
    setProgressPercent(data.progressPercent);
    setResetAt(data.resetAt);
  };

  const fetchQuests = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch("/api/quests");
      if (!res.ok) throw new Error("Failed to fetch quests");
      applyResponse(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuests();
  }, [fetchQuests]);

  const completeQuest = useCallback(
    async (questId: string) => {
      const quest = quests.find((item) => item.id === questId);
      if (!quest || quest.completedToday) return;

      try {
        setError(null);
        setQuests((prev) =>
          prev.map((item) =>
            item.id === questId ? { ...item, completedToday: true } : item
          )
        );
        setCompletedToday((prev) => {
          const next = Math.min(prev + 1, totalDaily);
          setProgressPercent(totalDaily > 0 ? Math.round((next / totalDaily) * 100) : 0);
          return next;
        });

        const res = await fetch(`/api/quests/${questId}/complete`, {
          method: "POST",
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to complete quest");
        }

        await fetchQuests();
      } catch (err) {
        setQuests((prev) =>
          prev.map((item) =>
            item.id === questId ? { ...item, completedToday: false } : item
          )
        );
        setCompletedToday((prev) => {
          const next = Math.max(prev - 1, 0);
          setProgressPercent(totalDaily > 0 ? Math.round((next / totalDaily) * 100) : 0);
          return next;
        });
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    },
    [fetchQuests, quests, totalDaily]
  );

  const createQuest = useCallback(
    async (payload: CreateQuestPayload) => {
      try {
        setError(null);
        const res = await fetch("/api/quests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to create quest");
        }

        await fetchQuests();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    },
    [fetchQuests]
  );

  const deleteQuest = useCallback(
    async (questId: string) => {
      try {
        setError(null);
        const res = await fetch(`/api/quests/${questId}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to delete quest");
        }

        await fetchQuests();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    },
    [fetchQuests]
  );

  const seedQuests = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const res = await fetch("/api/quests/seed", { method: "POST" });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to seed quests");
      }

      await fetchQuests();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [fetchQuests]);

  return {
    quests,
    completedToday,
    totalDaily,
    progressPercent,
    resetAt,
    loading,
    error,
    completeQuest,
    createQuest,
    deleteQuest,
    seedQuests,
    refetch: fetchQuests,
  };
}
