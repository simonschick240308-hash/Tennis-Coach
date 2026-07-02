import { describe, expect, it } from "vitest";
import { buildYoutubeSearchUrl } from "./video-search";

describe("buildYoutubeSearchUrl", () => {
  it("builds a valid YouTube search URL", () => {
    const url = buildYoutubeSearchUrl("Patrick Mouratoglou forehand tip");
    expect(url).toBe(
      "https://www.youtube.com/results?search_query=Patrick%20Mouratoglou%20forehand%20tip",
    );
  });

  it("encodes special characters safely", () => {
    const url = buildYoutubeSearchUrl("slice & dice / topspin?");
    expect(url.startsWith("https://www.youtube.com/results?search_query=")).toBe(true);
    expect(url).not.toContain(" ");
  });
});
