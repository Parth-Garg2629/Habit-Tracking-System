export interface DetectedSkill {
  name: string;
  category: "language" | "framework" | "tool" | "concept" | "soft_skill" | "other";
  confidence: number;
  xpSuggested: number;
  reasoning: string;
}

export interface AiAnalysisResult {
  id: string;
  detectedSkills: DetectedSkill[];
  totalXpSuggested: number;
  summary: string;
  encouragement: string;
}

export interface AiAnalysisRecord {
  id: string;
  logContent: string;
  detectedSkills: DetectedSkill[];
  totalXpSuggested: number;
  summary: string;
  status: "PENDING" | "CONFIRMED" | "REJECTED";
  confirmedAt: string | null;
  createdAt: string;
}

export interface ConfirmResult {
  confirmed: boolean;
  xpAwarded: number;
  skillsUpdated: number;
  levelUp: { from: number; to: number } | null;
}

export interface AnalyzePayload {
  content: string;
  duration?: number | null;
}

export const SKILL_CATEGORY_LABELS: Record<DetectedSkill["category"], string> = {
  language: "Language",
  framework: "Framework",
  tool: "Tool",
  concept: "Concept",
  soft_skill: "Soft Skill",
  other: "Other",
};

export const SKILL_CATEGORY_COLORS: Record<DetectedSkill["category"], string> = {
  language: "text-blue-400 bg-blue-400/10",
  framework: "text-purple-400 bg-purple-400/10",
  tool: "text-amber-400 bg-amber-400/10",
  concept: "text-emerald-400 bg-emerald-400/10",
  soft_skill: "text-pink-400 bg-pink-400/10",
  other: "text-zinc-400 bg-zinc-400/10",
};
