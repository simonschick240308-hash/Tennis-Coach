import { describe, expect, it, vi, afterEach } from "vitest";
import { logError } from "./log-error";

describe("logError", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("logs a structured JSON payload with scope and message", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    logError("test-scope", new Error("boom"), { userId: "u1" });

    expect(spy).toHaveBeenCalledOnce();
    const logged = JSON.parse(spy.mock.calls[0][0] as string);
    expect(logged.scope).toBe("test-scope");
    expect(logged.message).toBe("boom");
    expect(logged.level).toBe("error");
    expect(logged.context).toEqual({ userId: "u1" });
    expect(typeof logged.timestamp).toBe("string");
  });

  it("handles non-Error values", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    logError("test-scope", "just a string");

    const logged = JSON.parse(spy.mock.calls[0][0] as string);
    expect(logged.message).toBe("just a string");
    expect(logged.stack).toBeUndefined();
  });
});
