"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import type { PlayerProfile } from "@prisma/client";
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
import { updateProfile } from "@/actions/profile";
import { skillLevelLabels, playingHandLabels } from "@/lib/labels";
import { skillLevels, playingHands } from "@/lib/validations";

export function ProfileForm({
  defaultValues,
}: {
  defaultValues: PlayerProfile | null;
}) {
  const [state, formAction, isPending] = useActionState(updateProfile, {});

  useEffect(() => {
    if (state.success) {
      toast.success("Profil gespeichert");
    }
  }, [state.success]);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="skillLevel">Spielniveau</Label>
          <Select
            name="skillLevel"
            defaultValue={defaultValues?.skillLevel ?? "Beginner"}
          >
            <SelectTrigger id="skillLevel" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {skillLevels.map((level) => (
                <SelectItem key={level} value={level}>
                  {skillLevelLabels[level]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="playingHand">Spielhand</Label>
          <Select
            name="playingHand"
            defaultValue={defaultValues?.playingHand ?? "right"}
          >
            <SelectTrigger id="playingHand" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {playingHands.map((hand) => (
                <SelectItem key={hand} value={hand}>
                  {playingHandLabels[hand]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="goals">Ziele</Label>
        <Textarea
          id="goals"
          name="goals"
          rows={3}
          defaultValue={defaultValues?.goals ?? ""}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="strengths">Stärken</Label>
          <Textarea
            id="strengths"
            name="strengths"
            rows={3}
            defaultValue={defaultValues?.strengths ?? ""}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="weaknesses">Schwächen</Label>
          <Textarea
            id="weaknesses"
            name="weaknesses"
            rows={3}
            defaultValue={defaultValues?.weaknesses ?? ""}
          />
        </div>
      </div>

      <div className="rounded-md border p-4">
        <h3 className="mb-3 font-medium">ÖTV / OÖTV Verbandsdaten</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Manuelle Eingabe — es gibt keinen automatischen Sync mit dem
          Verbandsportal.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="oetvRanking">Rangliste / Klasse</Label>
            <Input
              id="oetvRanking"
              name="oetvRanking"
              placeholder="z.B. OÖ Rangliste Herren 42"
              defaultValue={defaultValues?.oetvRanking ?? ""}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="itnValue">ITN-Leistungswert</Label>
            <Input
              id="itnValue"
              name="itnValue"
              type="number"
              step="0.1"
              min={0}
              max={10}
              defaultValue={defaultValues?.itnValue ?? undefined}
            />
          </div>
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label htmlFor="oetvProfileUrl">Profil-Link</Label>
            <Input
              id="oetvProfileUrl"
              name="oetvProfileUrl"
              type="url"
              placeholder="https://..."
              defaultValue={defaultValues?.oetvProfileUrl ?? ""}
            />
          </div>
        </div>
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={isPending} className="w-fit">
        {isPending ? "Speichern..." : "Profil speichern"}
      </Button>
    </form>
  );
}
