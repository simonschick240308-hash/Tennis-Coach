"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { trainingSessionSchema } from "@/lib/validations";

export type TrainingFormState = {
  error?: string;
};

function parseFocusAreas(value: string | undefined | ""): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function createTrainingSession(
  _prevState: TrainingFormState,
  formData: FormData,
): Promise<TrainingFormState> {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const parsed = trainingSessionSchema.safeParse({
    date: formData.get("date"),
    durationMin: formData.get("durationMin"),
    type: formData.get("type"),
    focusAreas: formData.get("focusAreas"),
    intensity: formData.get("intensity"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe" };
  }

  const { date, durationMin, type, focusAreas, intensity, notes } = parsed.data;

  await prisma.trainingSession.create({
    data: {
      userId: session.user.id,
      date: new Date(date),
      durationMin,
      type,
      focusAreas: parseFocusAreas(focusAreas),
      intensity: intensity === "" || intensity === undefined ? null : intensity,
      notes: notes || null,
    },
  });

  revalidatePath("/training");
  redirect("/training");
}

export async function updateTrainingSession(
  id: string,
  _prevState: TrainingFormState,
  formData: FormData,
): Promise<TrainingFormState> {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const existing = await prisma.trainingSession.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id) {
    return { error: "Trainingseinheit nicht gefunden" };
  }

  const parsed = trainingSessionSchema.safeParse({
    date: formData.get("date"),
    durationMin: formData.get("durationMin"),
    type: formData.get("type"),
    focusAreas: formData.get("focusAreas"),
    intensity: formData.get("intensity"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe" };
  }

  const { date, durationMin, type, focusAreas, intensity, notes } = parsed.data;

  await prisma.trainingSession.update({
    where: { id },
    data: {
      date: new Date(date),
      durationMin,
      type,
      focusAreas: parseFocusAreas(focusAreas),
      intensity: intensity === "" || intensity === undefined ? null : intensity,
      notes: notes || null,
    },
  });

  revalidatePath("/training");
  redirect("/training");
}

export async function deleteTrainingSession(id: string) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const existing = await prisma.trainingSession.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id) {
    return;
  }

  await prisma.trainingSession.delete({ where: { id } });
  revalidatePath("/training");
}
