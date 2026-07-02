import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getDashboardStats } from "@/lib/dashboard";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { drillCategoryLabels } from "@/lib/labels";

async function getFeaturedDrill() {
  const count = await prisma.drill.count();
  if (count === 0) return null;
  const skip = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % count;
  const [drill] = await prisma.drill.findMany({ take: 1, skip, orderBy: { title: "asc" } });
  return drill ?? null;
}

export default async function DashboardPage() {
  const session = await auth();
  const [stats, featuredDrill] = await Promise.all([
    getDashboardStats(session!.user.id),
    getFeaturedDrill(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">
          Willkommen zurück, {session?.user?.name ?? session?.user?.email}!
        </h1>
        <p className="text-muted-foreground">
          Dein Trainings- und Match-Überblick.
        </p>
      </div>

      <StatsCards stats={stats} />
      <TrendChart data={stats.trendData} />

      {featuredDrill && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-2">
              <span>Drill des Tages</span>
              <Badge variant="secondary">{drillCategoryLabels[featuredDrill.category]}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div>
              <p className="font-medium">{featuredDrill.title}</p>
              <p className="text-sm text-muted-foreground">{featuredDrill.situation}</p>
            </div>
            <Button asChild size="sm" className="w-fit">
              <Link href={`/drills/${featuredDrill.id}`}>Drill ansehen</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Letztes Coach-Fazit</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.lastCoachMessage ? (
            <p className="whitespace-pre-wrap text-sm">
              {stats.lastCoachMessage.slice(0, 500)}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Noch kein Gespräch mit deinem KI-Coach.{" "}
              <Link href="/coach" className="underline underline-offset-4">
                Jetzt starten
              </Link>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
