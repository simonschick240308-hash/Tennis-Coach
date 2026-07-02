import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardStats } from "@/lib/dashboard";

export function StatsCards({ stats }: { stats: DashboardStats }) {
  const { wins, losses } = stats.matchRecord;
  const winRate = wins + losses > 0 ? Math.round((wins / (wins + losses)) * 100) : null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Training (letzte 7 Tage)
          </CardTitle>
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
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Training (letzte 30 Tage)
          </CardTitle>
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
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Match-Bilanz
          </CardTitle>
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
