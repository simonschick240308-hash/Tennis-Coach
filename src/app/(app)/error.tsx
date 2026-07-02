"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
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
