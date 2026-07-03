import { describe, expect, it } from "vitest";
import { mapWorkoutToTraining, type WhoopWorkoutRecord } from "./whoop";

function makeWorkout(overrides: Partial<WhoopWorkoutRecord> = {}): WhoopWorkoutRecord {
  return {
    id: "workout-1",
    start: "2026-01-01T10:00:00.000Z",
    end: "2026-01-01T11:00:00.000Z",
    sport_name: "Weightlifting",
    score_state: "SCORED",
    score: {
      strain: 10.5,
      average_heart_rate: 130,
      max_heart_rate: 160,
    },
    ...overrides,
  };
}

describe("mapWorkoutToTraining", () => {
  it("computes duration in minutes from start/end", () => {
    const result = mapWorkoutToTraining(makeWorkout());
    expect(result.durationMin).toBe(60);
  });

  it("scales strain (0-21) to an intensity of 1-10", () => {
    const result = mapWorkoutToTraining(makeWorkout({ score: { strain: 21, average_heart_rate: 150, max_heart_rate: 180 } }));
    expect(result.intensity).toBe(10);
  });

  it("clamps intensity to a minimum of 1", () => {
    const result = mapWorkoutToTraining(makeWorkout({ score: { strain: 0.1, average_heart_rate: 100, max_heart_rate: 120 } }));
    expect(result.intensity).toBe(1);
  });

  it("classifies tennis workouts as DRILL", () => {
    const result = mapWorkoutToTraining(makeWorkout({ sport_name: "Tennis" }));
    expect(result.type).toBe("DRILL");
  });

  it("classifies non-tennis workouts as FITNESS", () => {
    const result = mapWorkoutToTraining(makeWorkout({ sport_name: "Running" }));
    expect(result.type).toBe("FITNESS");
  });

  it("carries the workout id for deduplication", () => {
    const result = mapWorkoutToTraining(makeWorkout({ id: "abc-123" }));
    expect(result.whoopWorkoutId).toBe("abc-123");
  });

  it("includes strain and heart rate in the notes", () => {
    const result = mapWorkoutToTraining(makeWorkout());
    expect(result.notes).toContain("Whoop");
    expect(result.notes).toContain("10.5");
    expect(result.notes).toContain("130");
  });

  it("handles a missing score gracefully", () => {
    const result = mapWorkoutToTraining(makeWorkout({ score: undefined }));
    expect(result.intensity).toBeNull();
  });
});
