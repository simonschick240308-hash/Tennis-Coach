import { describe, expect, it } from "vitest";
import { generateRecoveryCode, hashRecoveryCode, verifyRecoveryCode } from "./recovery-code";

describe("generateRecoveryCode", () => {
  it("produces a code in XXXX-XXXX-XXXX format", () => {
    const code = generateRecoveryCode();
    expect(code).toMatch(/^[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}$/);
  });

  it("does not contain visually ambiguous characters", () => {
    const code = generateRecoveryCode();
    expect(code).not.toMatch(/[01OIL]/);
  });

  it("generates different codes across calls", () => {
    const codes = new Set(Array.from({ length: 20 }, () => generateRecoveryCode()));
    expect(codes.size).toBeGreaterThan(1);
  });
});

describe("hashRecoveryCode / verifyRecoveryCode", () => {
  it("verifies a matching code", async () => {
    const code = generateRecoveryCode();
    const hash = await hashRecoveryCode(code);
    expect(await verifyRecoveryCode(code, hash)).toBe(true);
  });

  it("is case-insensitive when verifying", async () => {
    const code = generateRecoveryCode();
    const hash = await hashRecoveryCode(code);
    expect(await verifyRecoveryCode(code.toLowerCase(), hash)).toBe(true);
  });

  it("rejects a non-matching code", async () => {
    const hash = await hashRecoveryCode(generateRecoveryCode());
    expect(await verifyRecoveryCode(generateRecoveryCode(), hash)).toBe(false);
  });
});
