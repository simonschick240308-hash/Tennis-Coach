"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { logError } from "@/lib/log-error";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logError("app-error-boundary", error, { digest: error.digest });
  }, [error]);

  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <h2 className="text-xl font-semibold">Etwas ist schiefgelaufen</h2>
      <p className="text-muted-foreground">
        Beim Laden dieser Seite ist ein Fehler aufgetreten.
      </p>
      <Button onClick={reset}>Erneut versuchen</Button>
    </div>
  );
}
