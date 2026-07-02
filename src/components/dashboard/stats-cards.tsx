import { Dumbbell, CalendarClock, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardStats } from "@/lib/dashboard";

function StatIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex size-8 items-center justify-center rounded-full bg-accent text-accent-foreground">
      {children}
    </span>
  );
}

export function StatsCards({ stats }: { stats: DashboardStats }) {
  const { wins, losses } = stats.matchRecord;
  const winRate = wins + losses > 0 ? Math.round((wins / (wins + losses)) * 100) : null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Training (7 Tage)
          </CardTitle>
          <StatIcon>
            <Dumbbell className="size-4" />
          </StatIcon>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">
            {stats.trainingLast7Days.count} Einheiten
          </div>
          <p className="text-sm text-muted-foreground">
            {stats.trainingLast7Days.totalMinutes} Minuten
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Training (30 Tage)
          </CardTitle>
          <StatIcon>
            <CalendarClock className="size-4" />
          </StatIcon>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">
            {stats.trainingLast30Days.count} Einheiten
          </div>
          <p className="text-sm text-muted-foreground">
            {stats.trainingLast30Days.totalMinutes} Minuten
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Match-Bilanz
          </CardTitle>
          <StatIcon>
            <Trophy className="size-4" />
          </StatIcon>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">
            {wins} - {losses}
          </div>
          <p className="text-sm text-muted-foreground">
            {winRate !== null ? `${winRate}% Siegquote` : "Noch keine Matches"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
