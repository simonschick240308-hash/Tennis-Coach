"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import type { Match } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { MatchFormState } from "@/actions/matches";
import { matchResultLabels } from "@/lib/labels";

function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function MatchForm({
  action,
  defaultValues,
}: {
  action: (
    prevState: MatchFormState,
    formData: FormData,
  ) => Promise<MatchFormState>;
  defaultValues?: Match;
}) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(action, {});

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="date">Datum</Label>
          <Input
            id="date"
            name="date"
            type="date"
            required
            defaultValue={
              defaultValues ? toDateInputValue(defaultValues.date) : undefined
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="opponentName">Gegner</Label>
          <Input
            id="opponentName"
            name="opponentName"
            required
            defaultValue={defaultValues?.opponentName}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="score">Ergebnis (Sätze)</Label>
          <Input
            id="score"
            name="score"
            placeholder="6-4, 3-6, 10-8"
            required
            defaultValue={defaultValues?.score}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="result">Match-Ergebnis</Label>
          <Select name="result" defaultValue={defaultValues?.result ?? "WIN"}>
            <SelectTrigger id="result" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(matchResultLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="surface">Belag</Label>
          <Input
            id="surface"
            name="surface"
            placeholder="Sand, Hartplatz, ..."
            defaultValue={defaultValues?.surface ?? ""}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="firstServePct">1. Aufschlag-Quote (%)</Label>
          <Input
            id="firstServePct"
            name="firstServePct"
            type="number"
            min={0}
            max={100}
            step="0.1"
            defaultValue={defaultValues?.firstServePct ?? undefined}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="aces">Asse</Label>
          <Input
            id="aces"
            name="aces"
            type="number"
            min={0}
            defaultValue={defaultValues?.aces ?? undefined}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="doubleFaults">Doppelfehler</Label>
          <Input
            id="doubleFaults"
            name="doubleFaults"
            type="number"
            min={0}
            defaultValue={defaultValues?.doubleFaults ?? undefined}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="winners">Winner</Label>
          <Input
            id="winners"
            name="winners"
            type="number"
            min={0}
            defaultValue={defaultValues?.winners ?? undefined}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="unforcedErrors">Unforced Errors</Label>
          <Input
            id="unforcedErrors"
            name="unforcedErrors"
            type="number"
            min={0}
            defaultValue={defaultValues?.unforcedErrors ?? undefined}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="notes">Notizen</Label>
        <Textarea
          id="notes"
          name="notes"
          rows={4}
          defaultValue={defaultValues?.notes ?? ""}
        />
      </div>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <div className="flex gap-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Speichern..." : "Speichern"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Abbrechen
        </Button>
      </div>
    </form>
  );
}
