import { prisma } from "@/lib/prisma";

export const DAILY_COACH_MESSAGE_LIMIT = 30;

function todayUTC(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

export async function checkCoachMessageLimit(
  userId: string,
): Promise<{ allowed: boolean; remaining: number }> {
  const day = todayUTC();
  const usage = await prisma.coachMessageUsage.findUnique({
    where: { userId_day: { userId, day } },
  });
  const count = usage?.count ?? 0;
  if (count >= DAILY_COACH_MESSAGE_LIMIT) {
    return { allowed: false, remaining: 0 };
  }
  return { allowed: true, remaining: DAILY_COACH_MESSAGE_LIMIT - count };
}

export async function incrementCoachMessageUsage(userId: string) {
  const day = todayUTC();
  await prisma.coachMessageUsage.upsert({
    where: { userId_day: { userId, day } },
    create: { userId, day, count: 1 },
    update: { count: { increment: 1 } },
  });
}
