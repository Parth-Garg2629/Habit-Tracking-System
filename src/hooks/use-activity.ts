"use client";

import { useState, useEffect, useCallback } from "react";
import type { Activity, ActivityResponse } from "@/types/player";

export function useActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivity = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch("/api/player/activity");
      if (!res.ok) throw new Error("Failed to fetch activity");
      const data: ActivityResponse = await res.json();
      setActivities(data.activities);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

  return {
    activities,
    loading,
    error,
    refetch: fetchActivity,
  };
}
