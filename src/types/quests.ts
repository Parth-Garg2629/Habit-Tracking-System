export interface Quest {
  id: string;
  title: string;
  description: string | null;
  xpReward: number;
  isDaily: boolean;
  skillId: string | null;
  status: "TODO" | "IN_PROGRESS" | "DONE" | "SKIPPED";
  createdAt: string;
  updatedAt: string;
  completedToday: boolean;
}

export interface QuestsResponse {
  quests: Quest[];
  completedToday: number;
  totalDaily: number;
  progressPercent: number;
  resetAt: string;
}

export interface CreateQuestPayload {
  title: string;
  description?: string;
  xpReward?: number;
  isDaily?: boolean;
  skillId?: string;
}
