export interface PlayerData {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  xp: number;
  level: number;
  currentLevelXp: number;
  xpForNextLevel: number;
  progressPercent: number;
  totalXp: number;
  tier: {
    name: string;
    color: string;
  };
  createdAt: string;
}

export interface XpActivity {
  id: string;
  type: "xp";
  amount: number;
  reason: string;
  createdAt: string;
}

export interface LevelUpActivity {
  id: string;
  type: "level_up";
  fromLevel: number;
  toLevel: number;
  totalXp: number;
  createdAt: string;
}

export type Activity = XpActivity | LevelUpActivity;

export interface ActivityResponse {
  activities: Activity[];
}
