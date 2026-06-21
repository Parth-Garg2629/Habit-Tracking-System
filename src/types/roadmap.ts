export interface RoadmapSummary {
  id: string;
  title: string;
  description: string | null;
  nodeCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface RoadmapNodeFlat {
  id: string;
  roadmapId: string;
  parentId: string | null;
  title: string;
  description: string | null;
  isSubtopic: boolean;
  status: NodeStatus;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface RoadmapNode extends RoadmapNodeFlat {
  children: RoadmapNode[];
  subtopics: RoadmapNode[];
}

export interface RoadmapDetail {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  tree: RoadmapNode[];
}

export interface RoadmapDetailRaw {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  nodes: RoadmapNodeFlat[];
}

export type NodeStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

export interface CreateRoadmapPayload {
  title: string;
  description?: string;
}

export interface CreateNodePayload {
  parentId?: string | null;
  title: string;
  description?: string;
  isSubtopic?: boolean;
}

export interface UpdateNodePayload {
  title?: string;
  description?: string | null;
  status?: NodeStatus;
  isSubtopic?: boolean;
  sortOrder?: number;
}

export interface UpdateRoadmapPayload {
  title?: string;
  description?: string | null;
}
