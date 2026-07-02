import type { DrillCategory } from "@prisma/client";

const CATEGORY_KEYWORDS: Record<DrillCategory, string[]> = {
  FOREHAND: ["vorhand", "forehand"],
  BACKHAND: ["rückhand", "ruckhand", "backhand"],
  SERVE: ["aufschlag", "serve"],
  RETURN: ["return", "rückschlag"],
  VOLLEY: ["volley", "netz"],
  APPROACH: ["annäherung", "annaeherung", "approach", "vorlaufen"],
  FOOTWORK: ["beinarbeit", "footwork", "laufweg", "positionierung"],
  TACTICS: ["taktik", "mental", "tactics", "konstanz"],
};

export function matchDrillCategoriesFromText(text: string | null | undefined): DrillCategory[] {
  if (!text) return [];
  const lower = text.toLowerCase();
  return (Object.keys(CATEGORY_KEYWORDS) as DrillCategory[]).filter((category) =>
    CATEGORY_KEYWORDS[category].some((keyword) => lower.includes(keyword)),
  );
}
