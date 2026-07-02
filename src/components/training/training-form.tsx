"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import type { TrainingSession } from "@prisma/client";
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
import type { TrainingFormState } from "@/actions/training";
import { trainingTypeLabels } from "@/lib/labels";

function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function TrainingForm({
  action,
  defaultValues,
}: {
  action: (
    prevState: TrainingFormState,
    formData: FormData,
  ) => Promise<TrainingFormState>;
  defaultValues?: TrainingSession;
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
          <Label htmlFor="durationMin">Dauer (Minuten)</Label>
          <Input
            id="durationMin"
            name="durationMin"
            type="number"
            min={1}
            required
            defaultValue={defaultValues?.durationMin}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="type">Trainingsart</Label>
          <Select name="type" defaultValue={defaultValues?.type ?? "DRILL"}>
            <SelectTrigger id="type" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(trainingTypeLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="intensity">Intensität (1-10, RPE)</Label>
          <Input
            id="intensity"
            name="intensity"
            type="number"
            min={1}
            max={10}
            defaultValue={defaultValues?.intensity ?? undefined}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="focusAreas">Fokusbereiche (kommagetrennt)</Label>
        <Input
          id="focusAreas"
          name="focusAreas"
          placeholder="z.B. Aufschlag, Rückhand, Footwork"
          defaultValue={defaultValues?.focusAreas.join(", ") ?? ""}
        />
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
