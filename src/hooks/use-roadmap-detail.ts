"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  RoadmapDetail,
  RoadmapDetailRaw,
  RoadmapNode,
  RoadmapNodeFlat,
  CreateNodePayload,
  UpdateNodePayload,
  UpdateRoadmapPayload,
} from "@/types/roadmap";

/**
 * Converts a flat node list from the API into a nested tree structure.
 * Separates children (isSubtopic=false) from subtopics (isSubtopic=true).
 */
function buildTree(nodes: RoadmapNodeFlat[]): RoadmapNode[] {
  const nodeMap = new Map<string, RoadmapNode>();

  // First pass: create RoadmapNode wrappers
  for (const node of nodes) {
    nodeMap.set(node.id, { ...node, children: [], subtopics: [] });
  }

  const roots: RoadmapNode[] = [];

  // Second pass: attach children to parents
  for (const node of nodes) {
    const wrapped = nodeMap.get(node.id)!;
    if (node.parentId) {
      const parent = nodeMap.get(node.parentId);
      if (parent) {
        if (node.isSubtopic) {
          parent.subtopics.push(wrapped);
        } else {
          parent.children.push(wrapped);
        }
      } else {
        // Orphan node — treat as root
        roots.push(wrapped);
      }
    } else {
      roots.push(wrapped);
    }
  }

  return roots;
}

export function useRoadmapDetail(roadmapId: string) {
  const [roadmap, setRoadmap] = useState<RoadmapDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoadmap = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch(`/api/roadmaps/${roadmapId}`);
      if (!res.ok) throw new Error("Failed to fetch roadmap");
      const data: { roadmap: RoadmapDetailRaw } = await res.json();
      const raw = data.roadmap;

      setRoadmap({
        id: raw.id,
        title: raw.title,
        description: raw.description,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        tree: buildTree(raw.nodes),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [roadmapId]);

  useEffect(() => {
    fetchRoadmap();
  }, [fetchRoadmap]);

  const updateRoadmap = useCallback(
    async (payload: UpdateRoadmapPayload) => {
      try {
        setError(null);
        const res = await fetch(`/api/roadmaps/${roadmapId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to update roadmap");
        }

        await fetchRoadmap();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    },
    [roadmapId, fetchRoadmap]
  );

  const addNode = useCallback(
    async (payload: CreateNodePayload) => {
      try {
        setError(null);
        const res = await fetch(`/api/roadmaps/${roadmapId}/nodes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to add node");
        }

        await fetchRoadmap();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    },
    [roadmapId, fetchRoadmap]
  );

  const updateNode = useCallback(
    async (nodeId: string, payload: UpdateNodePayload) => {
      try {
        setError(null);
        const res = await fetch(`/api/roadmaps/${roadmapId}/nodes/${nodeId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to update node");
        }

        await fetchRoadmap();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    },
    [roadmapId, fetchRoadmap]
  );

  const deleteNode = useCallback(
    async (nodeId: string) => {
      try {
        setError(null);
        const res = await fetch(`/api/roadmaps/${roadmapId}/nodes/${nodeId}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to delete node");
        }

        await fetchRoadmap();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    },
    [roadmapId, fetchRoadmap]
  );

  return {
    roadmap,
    loading,
    error,
    updateRoadmap,
    addNode,
    updateNode,
    deleteNode,
    refetch: fetchRoadmap,
  };
}
