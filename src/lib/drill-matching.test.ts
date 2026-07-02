import { describe, expect, it } from "vitest";
import { matchDrillCategoriesFromText } from "./drill-matching";

describe("matchDrillCategoriesFromText", () => {
  it("returns an empty array for null/empty input", () => {
    expect(matchDrillCategoriesFromText(null)).toEqual([]);
    expect(matchDrillCategoriesFromText("")).toEqual([]);
  });

  it("matches BACKHAND from German keyword", () => {
    expect(matchDrillCategoriesFromText("Meine Rückhand ist schwach")).toContain(
      "BACKHAND",
    );
  });

  it("matches SERVE from German keyword", () => {
    expect(matchDrillCategoriesFromText("Der Aufschlag ist inkonsistent")).toContain(
      "SERVE",
    );
  });

  it("matches multiple categories in one text", () => {
    const result = matchDrillCategoriesFromText(
      "Rückhand und Aufschlag sind beide verbesserungswürdig",
    );
    expect(result).toContain("BACKHAND");
    expect(result).toContain("SERVE");
  });

  it("is case-insensitive", () => {
    expect(matchDrillCategoriesFromText("VORHAND ist stark, aber RÜCKHAND schwach")).toContain(
      "BACKHAND",
    );
  });

  it("returns no matches for unrelated text", () => {
    expect(matchDrillCategoriesFromText("Ich möchte mehr Wasser trinken")).toEqual([]);
  });
});
