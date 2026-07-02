import type { TrainingType, MatchResult, DrillCategory, DrillDifficulty } from "@prisma/client";

export const trainingTypeLabels: Record<TrainingType, string> = {
  DRILL: "Technik-Drill",
  MATCH_PRACTICE: "Match-Training",
  LESSON: "Trainerstunde",
  FITNESS: "Fitness",
};

export const matchResultLabels: Record<MatchResult, string> = {
  WIN: "Sieg",
  LOSS: "Niederlage",
};

export const skillLevelLabels: Record<string, string> = {
  Beginner: "Anfänger",
  Intermediate: "Fortgeschritten",
  Competitive: "Wettkampf",
};

export const playingHandLabels: Record<string, string> = {
  right: "Rechtshänder",
  left: "Linkshänder",
};

export const drillCategoryLabels: Record<DrillCategory, string> = {
  FOREHAND: "Vorhand",
  BACKHAND: "Rückhand",
  SERVE: "Aufschlag",
  RETURN: "Return",
  VOLLEY: "Volley",
  APPROACH: "Annäherung",
  FOOTWORK: "Beinarbeit",
  TACTICS: "Taktik",
};

export const drillDifficultyLabels: Record<DrillDifficulty, string> = {
  BEGINNER: "Einsteiger",
  INTERMEDIATE: "Fortgeschritten",
  ADVANCED: "Erfahren",
};
