"use client";

import { useState, useEffect, useCallback } from "react";

export interface WeeklyStats {
  totalXpEarned: number;
  questsCompleted: number;
  journalEntries: number;
  xpByDay: {
    date: string;
    amount: number;
  }[];
}

export function useWeeklyReview() {
  const [stats, setStats] = useState<WeeklyStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/weekly-review");
      if (!res.ok) throw new Error("Failed to fetch stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, refetch: fetchStats };
}
