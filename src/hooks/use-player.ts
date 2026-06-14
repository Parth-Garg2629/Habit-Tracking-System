"use client";

import { useState, useEffect, useCallback } from "react";
import type { PlayerData } from "@/types/player";

export function usePlayer() {
  const [player, setPlayer] = useState<PlayerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlayer = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch("/api/player");
      if (!res.ok) throw new Error("Failed to fetch player data");
      const data: PlayerData = await res.json();
      setPlayer(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlayer();
  }, [fetchPlayer]);

  return {
    player,
    loading,
    error,
    refetch: fetchPlayer,
  };
}
