/**
 * Calculate XP required for a given level.
 * Level 1-10: 100 XP per level
 * Level 11-20: 200 XP per level
 * Level 21+: 500 XP per level
 */
export function xpRequiredForLevel(level: number): number {
  if (level <= 10) return 100;
  if (level <= 20) return 200;
  return 500;
}

/**
 * Calculate total XP needed to reach a given level from level 1.
 */
export function totalXpForLevel(level: number): number {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += xpRequiredForLevel(i);
  }
  return total;
}

/**
 * Given total XP, calculate what level the user should be at,
 * how much XP is into the current level, and how much is needed for next.
 */
export function calculateLevel(totalXp: number): {
  level: number;
  currentLevelXp: number;
  xpForNextLevel: number;
  progressPercent: number;
  totalXp: number;
} {
  let level = 1;
  let remainingXp = totalXp;

  while (remainingXp >= xpRequiredForLevel(level)) {
    remainingXp -= xpRequiredForLevel(level);
    level++;
  }

  const xpNeeded = xpRequiredForLevel(level);
  return {
    level,
    currentLevelXp: remainingXp,
    xpForNextLevel: xpNeeded,
    progressPercent: Math.round((remainingXp / xpNeeded) * 100),
    totalXp,
  };
}

/**
 * Get a title/label for the player's level tier.
 */
export function getLevelTier(level: number): { name: string; color: string } {
  if (level <= 5) return { name: "Novice", color: "text-zinc-400" };
  if (level <= 10) return { name: "Apprentice", color: "text-blue-400" };
  if (level <= 15) return { name: "Journeyman", color: "text-emerald-400" };
  if (level <= 20) return { name: "Expert", color: "text-purple-400" };
  if (level <= 30) return { name: "Master", color: "text-amber-400" };
  if (level <= 50) return { name: "Grandmaster", color: "text-orange-400" };
  return { name: "Legend", color: "text-red-400" };
}
