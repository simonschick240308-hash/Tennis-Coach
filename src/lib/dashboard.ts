import { subDays, subWeeks, format, startOfWeek } from "date-fns";
import { prisma } from "@/lib/prisma";

export async function getDashboardStats(userId: string) {
  const now = new Date();
  const sevenDaysAgo = subDays(now, 7);
  const thirtyDaysAgo = subDays(now, 30);
  const eightWeeksAgo = startOfWeek(subWeeks(now, 7), { weekStartsOn: 1 });

  const [
    trainingLast7,
    trainingLast30,
    matchResults,
    recentMatches,
    recentTrainings,
    latestConversation,
  ] = await Promise.all([
    prisma.trainingSession.aggregate({
      where: { userId, date: { gte: sevenDaysAgo } },
      _count: { _all: true },
      _sum: { durationMin: true },
    }),
    prisma.trainingSession.aggregate({
      where: { userId, date: { gte: thirtyDaysAgo } },
      _count: { _all: true },
      _sum: { durationMin: true },
    }),
    prisma.match.findMany({
      where: { userId },
      select: { result: true },
    }),
    prisma.match.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 10,
      select: {
        date: true,
        firstServePct: true,
        unforcedErrors: true,
      },
    }),
    prisma.trainingSession.findMany({
      where: { userId, date: { gte: eightWeeksAgo } },
      select: { date: true, durationMin: true },
    }),
    prisma.coachConversation.findFirst({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: {
        messages: {
          where: { role: "assistant" },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    }),
  ]);

  const wins = matchResults.filter((m) => m.result === "WIN").length;
  const losses = matchResults.filter((m) => m.result === "LOSS").length;

  const trendData = recentMatches
    .slice()
    .reverse()
    .map((m) => ({
      date: format(m.date, "dd.MM."),
      firstServePct: m.firstServePct,
      unforcedErrors: m.unforcedErrors,
    }));

  const weekBuckets = new Map<string, number>();
  for (let i = 7; i >= 0; i--) {
    const weekStart = startOfWeek(subWeeks(now, i), { weekStartsOn: 1 });
    weekBuckets.set(format(weekStart, "dd.MM."), 0);
  }
  for (const t of recentTrainings) {
    const weekStart = startOfWeek(t.date, { weekStartsOn: 1 });
    const key = format(weekStart, "dd.MM.");
    if (weekBuckets.has(key)) {
      weekBuckets.set(key, (weekBuckets.get(key) ?? 0) + t.durationMin);
    }
  }
  const trainingVolumeData = [...weekBuckets.entries()].map(([week, minutes]) => ({
    week,
    minutes,
  }));

  return {
    trainingLast7Days: {
      count: trainingLast7._count._all,
      totalMinutes: trainingLast7._sum.durationMin ?? 0,
    },
    trainingLast30Days: {
      count: trainingLast30._count._all,
      totalMinutes: trainingLast30._sum.durationMin ?? 0,
    },
    matchRecord: { wins, losses },
    trendData,
    trainingVolumeData,
    lastCoachMessage: latestConversation?.messages[0]?.content ?? null,
  };
}

export type DashboardStats = Awaited<ReturnType<typeof getDashboardStats>>;
