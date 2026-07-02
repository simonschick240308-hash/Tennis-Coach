import { subDays, format } from "date-fns";
import { prisma } from "@/lib/prisma";

export async function getDashboardStats(userId: string) {
  const now = new Date();
  const sevenDaysAgo = subDays(now, 7);
  const thirtyDaysAgo = subDays(now, 30);

  const [
    trainingLast7,
    trainingLast30,
    matchResults,
    recentMatches,
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
    lastCoachMessage: latestConversation?.messages[0]?.content ?? null,
  };
}

export type DashboardStats = Awaited<ReturnType<typeof getDashboardStats>>;
