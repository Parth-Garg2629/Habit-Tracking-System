"use client";

import { useCallback, useEffect, useState } from "react";
import type { RoadmapSummary, CreateRoadmapPayload } from "@/types/roadmap";

export function useRoadmaps() {
  const [roadmaps, setRoadmaps] = useState<RoadmapSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoadmaps = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch("/api/roadmaps");
      if (!res.ok) throw new Error("Failed to fetch roadmaps");
      const data = await res.json();
      setRoadmaps(data.roadmaps);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoadmaps();
  }, [fetchRoadmaps]);

  const createRoadmap = useCallback(
    async (payload: CreateRoadmapPayload) => {
      try {
        setError(null);
        const res = await fetch("/api/roadmaps", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to create roadmap");
        }

        await fetchRoadmaps();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    },
    [fetchRoadmaps]
  );

  const deleteRoadmap = useCallback(
    async (roadmapId: string) => {
      try {
        setError(null);
        const res = await fetch(`/api/roadmaps/${roadmapId}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to delete roadmap");
        }

        await fetchRoadmaps();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    },
    [fetchRoadmaps]
  );

  return {
    roadmaps,
    loading,
    error,
    createRoadmap,
    deleteRoadmap,
    refetch: fetchRoadmaps,
  };
}
