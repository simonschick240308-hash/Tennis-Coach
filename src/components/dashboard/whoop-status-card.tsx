import Link from "next/link";
import { HeartPulse } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WhoopSnapshot } from "@/lib/whoop";

function recoveryStatus(score: number | null) {
  if (score === null) return null;
  if (score >= 67) return { label: "Hoch", color: "#0ca30c" };
  if (score >= 34) return { label: "Mittel", color: "#fab219" };
  return { label: "Niedrig", color: "#d03b3b" };
}

export function WhoopStatusCard({ snapshot }: { snapshot: WhoopSnapshot | null }) {
  if (!snapshot) return null;

  const status = recoveryStatus(snapshot.recoveryScore);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HeartPulse className="size-4" />
          Whoop-Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground">Recovery</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-semibold">
                {snapshot.recoveryScore !== null ? `${snapshot.recoveryScore}%` : "–"}
              </span>
              {status && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: status.color }}
                  />
                  {status.label}
                </span>
              )}
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Ruhepuls</p>
            <p className="text-2xl font-semibold">
              {snapshot.restingHeartRate !== null ? `${snapshot.restingHeartRate}` : "–"}
              <span className="ml-1 text-sm font-normal text-muted-foreground">bpm</span>
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Schlaf-Performance</p>
            <p className="text-2xl font-semibold">
              {snapshot.sleepPerformancePct !== null
                ? `${Math.round(snapshot.sleepPerformancePct)}%`
                : "–"}
            </p>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Daten von Whoop —{" "}
          <Link href="/profile" className="underline underline-offset-4">
            Verbindung verwalten
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
