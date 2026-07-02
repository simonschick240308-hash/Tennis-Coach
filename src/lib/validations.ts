import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Name ist erforderlich").max(100),
  email: z.string().trim().email("Ungültige E-Mail-Adresse"),
  password: z.string().min(8, "Passwort muss mindestens 8 Zeichen haben"),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Ungültige E-Mail-Adresse"),
  password: z.string().min(1, "Passwort ist erforderlich"),
});

export const skillLevels = ["Beginner", "Intermediate", "Competitive"] as const;
export const playingHands = ["right", "left"] as const;

export const profileSchema = z.object({
  skillLevel: z.enum(skillLevels),
  playingHand: z.enum(playingHands),
  goals: z.string().trim().max(2000).optional().or(z.literal("")),
  weaknesses: z.string().trim().max(2000).optional().or(z.literal("")),
  strengths: z.string().trim().max(2000).optional().or(z.literal("")),
  oetvRanking: z.string().trim().max(200).optional().or(z.literal("")),
  itnValue: z.coerce.number().min(0).max(10).optional().or(z.literal("")),
  oetvProfileUrl: z
    .string()
    .trim()
    .url("Ungültige URL")
    .max(500)
    .optional()
    .or(z.literal("")),
});

export const trainingTypes = ["DRILL", "MATCH_PRACTICE", "LESSON", "FITNESS"] as const;

export const trainingSessionSchema = z.object({
  date: z.string().min(1, "Datum ist erforderlich"),
  durationMin: z.coerce.number().int().min(1).max(1000),
  type: z.enum(trainingTypes),
  focusAreas: z.string().trim().max(500).optional().or(z.literal("")),
  intensity: z.coerce.number().int().min(1).max(10).optional().or(z.literal("")),
  notes: z.string().trim().max(4000).optional().or(z.literal("")),
});

export const matchResults = ["WIN", "LOSS"] as const;

export const matchSchema = z.object({
  date: z.string().min(1, "Datum ist erforderlich"),
  opponentName: z.string().trim().min(1, "Gegner ist erforderlich").max(200),
  score: z.string().trim().min(1, "Ergebnis ist erforderlich").max(200),
  result: z.enum(matchResults),
  surface: z.string().trim().max(100).optional().or(z.literal("")),
  aces: z.coerce.number().int().min(0).max(200).optional().or(z.literal("")),
  doubleFaults: z.coerce.number().int().min(0).max(200).optional().or(z.literal("")),
  winners: z.coerce.number().int().min(0).max(500).optional().or(z.literal("")),
  unforcedErrors: z.coerce.number().int().min(0).max(500).optional().or(z.literal("")),
  firstServePct: z.coerce.number().min(0).max(100).optional().or(z.literal("")),
  notes: z.string().trim().max(4000).optional().or(z.literal("")),
});
