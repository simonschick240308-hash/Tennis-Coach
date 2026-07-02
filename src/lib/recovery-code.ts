import { randomInt } from "crypto";
import bcrypt from "bcryptjs";

// Vermeidet visuell mehrdeutige Zeichen (0/O, 1/I/L)
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function generateRecoveryCode(): string {
  const groups = [4, 4, 4].map((len) =>
    Array.from({ length: len }, () => ALPHABET[randomInt(ALPHABET.length)]).join(""),
  );
  return groups.join("-");
}

export function hashRecoveryCode(code: string): Promise<string> {
  return bcrypt.hash(code.trim().toUpperCase(), 12);
}

export function verifyRecoveryCode(code: string, hash: string): Promise<boolean> {
  return bcrypt.compare(code.trim().toUpperCase(), hash);
}
