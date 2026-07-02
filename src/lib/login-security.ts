import { prisma } from "@/lib/prisma";

export const MAX_FAILED_ATTEMPTS = 5;
export const LOCKOUT_MINUTES = 15;

export function isLocked(user: { lockedUntil: Date | null }): boolean {
  return !!user.lockedUntil && user.lockedUntil.getTime() > Date.now();
}

export function lockoutMinutesRemaining(user: { lockedUntil: Date | null }): number {
  if (!user.lockedUntil) return 0;
  const ms = user.lockedUntil.getTime() - Date.now();
  return Math.max(1, Math.ceil(ms / 60_000));
}

export async function recordFailedAttempt(userId: string, currentAttempts: number) {
  const attempts = currentAttempts + 1;
  const shouldLock = attempts >= MAX_FAILED_ATTEMPTS;

  await prisma.user.update({
    where: { id: userId },
    data: {
      failedLoginAttempts: shouldLock ? 0 : attempts,
      lockedUntil: shouldLock
        ? new Date(Date.now() + LOCKOUT_MINUTES * 60_000)
        : undefined,
    },
  });
}

export async function resetFailedAttempts(userId: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { failedLoginAttempts: 0, lockedUntil: null },
  });
}
