import type { TrainingType, MatchResult } from "@prisma/client";

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
