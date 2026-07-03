"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { syncWhoopNow, disconnectWhoop, type SyncState } from "@/actions/whoop";

export function WhoopCard({
  connected,
  whoopConfigured,
  lastSyncedAt,
}: {
  connected: boolean;
  whoopConfigured: boolean;
  lastSyncedAt: Date | null;
}) {
  const [state, formAction, isPending] = useActionState<SyncState, FormData>(
    syncWhoopNow,
    {},
  );

  useEffect(() => {
    if (state.imported !== undefined) {
      toast.success(
        state.imported > 0
          ? `${state.imported} neue Trainingseinheit(en) von Whoop importiert`
          : "Keine neuen Whoop-Workouts gefunden",
      );
    }
  }, [state.imported]);

  if (!whoopConfigured) {
    return (
      <p className="text-sm text-muted-foreground">
        Die Whoop-Integration ist auf diesem Server noch nicht konfiguriert
        (fehlende API-Zugangsdaten).
      </p>
    );
  }

  if (!connected) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">
          Verbinde dein Whoop-Konto, um Recovery, Schlaf und Strain im
          Dashboard zu sehen und Workouts automatisch als Trainingseinheiten
          zu importieren.
        </p>
        <Button asChild className="w-fit">
          <a href="/api/whoop/connect">Whoop verbinden</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">
        Verbunden
        {lastSyncedAt &&
          ` — zuletzt synchronisiert am ${lastSyncedAt.toLocaleString("de-AT")}`}
      </p>
      <div className="flex gap-2">
        <form action={formAction}>
          <Button type="submit" disabled={isPending} size="sm">
            {isPending ? "Synchronisiere..." : "Jetzt synchronisieren"}
          </Button>
        </form>
        <form action={disconnectWhoop}>
          <Button type="submit" variant="outline" size="sm">
            Trennen
          </Button>
        </form>
      </div>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
    </div>
  );
}
