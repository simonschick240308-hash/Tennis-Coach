import Link from "next/link";
import { auth } from "@/lib/auth";
import { getDashboardStats } from "@/lib/dashboard";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const session = await auth();
  const stats = await getDashboardStats(session!.user.id);

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
