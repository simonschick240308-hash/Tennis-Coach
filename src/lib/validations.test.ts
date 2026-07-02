import { describe, expect, it } from "vitest";
import {
  registerSchema,
  loginSchema,
  trainingSessionSchema,
  matchSchema,
  profileSchema,
} from "./validations";

describe("registerSchema", () => {
  it("accepts valid input", () => {
    const result = registerSchema.safeParse({
      name: "Max Mustermann",
      email: "max@example.com",
      password: "supersecret123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a password shorter than 8 characters", () => {
    const result = registerSchema.safeParse({
      name: "Max",
      email: "max@example.com",
      password: "short",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = registerSchema.safeParse({
      name: "Max",
      email: "not-an-email",
      password: "supersecret123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an empty name", () => {
    const result = registerSchema.safeParse({
      name: "  ",
      email: "max@example.com",
      password: "supersecret123",
    });
    expect(result.success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("requires a non-empty password", () => {
    const result = loginSchema.safeParse({ email: "max@example.com", password: "" });
    expect(result.success).toBe(false);
  });
});

describe("trainingSessionSchema", () => {
  it("accepts a minimal valid session", () => {
    const result = trainingSessionSchema.safeParse({
      date: "2026-01-01",
      durationMin: "60",
      type: "DRILL",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid training type", () => {
    const result = trainingSessionSchema.safeParse({
      date: "2026-01-01",
      durationMin: "60",
      type: "NOT_A_TYPE",
    });
    expect(result.success).toBe(false);
  });

  it("rejects intensity above 10", () => {
    const result = trainingSessionSchema.safeParse({
      date: "2026-01-01",
      durationMin: "60",
      type: "DRILL",
      intensity: "11",
    });
    expect(result.success).toBe(false);
  });
});

describe("matchSchema", () => {
  it("accepts a minimal valid match", () => {
    const result = matchSchema.safeParse({
      date: "2026-01-01",
      opponentName: "Anna",
      score: "6-4, 6-3",
      result: "WIN",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a first-serve percentage above 100", () => {
    const result = matchSchema.safeParse({
      date: "2026-01-01",
      opponentName: "Anna",
      score: "6-4, 6-3",
      result: "WIN",
      firstServePct: "150",
    });
    expect(result.success).toBe(false);
  });
});

describe("profileSchema", () => {
  it("accepts a minimal valid profile", () => {
    const result = profileSchema.safeParse({
      skillLevel: "Intermediate",
      playingHand: "right",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid oetvProfileUrl", () => {
    const result = profileSchema.safeParse({
      skillLevel: "Intermediate",
      playingHand: "right",
      oetvProfileUrl: "not-a-url",
    });
    expect(result.success).toBe(false);
  });
});
