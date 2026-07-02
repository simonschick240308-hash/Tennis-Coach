"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { matchSchema } from "@/lib/validations";

export type MatchFormState = {
  error?: string;
};

function numOrNull(value: number | "" | undefined) {
  return value === "" || value === undefined ? null : value;
}

export async function createMatch(
  _prevState: MatchFormState,
  formData: FormData,
): Promise<MatchFormState> {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const parsed = matchSchema.safeParse({
    date: formData.get("date"),
    opponentName: formData.get("opponentName"),
    score: formData.get("score"),
    result: formData.get("result"),
    surface: formData.get("surface"),
    aces: formData.get("aces"),
    doubleFaults: formData.get("doubleFaults"),
    winners: formData.get("winners"),
    unforcedErrors: formData.get("unforcedErrors"),
    firstServePct: formData.get("firstServePct"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe" };
  }

  const data = parsed.data;

  await prisma.match.create({
    data: {
      userId: session.user.id,
      date: new Date(data.date),
      opponentName: data.opponentName,
      score: data.score,
      result: data.result,
      surface: data.surface || null,
      aces: numOrNull(data.aces),
      doubleFaults: numOrNull(data.doubleFaults),
      winners: numOrNull(data.winners),
      unforcedErrors: numOrNull(data.unforcedErrors),
      firstServePct: numOrNull(data.firstServePct),
      notes: data.notes || null,
    },
  });

  revalidatePath("/matches");
  redirect("/matches");
}

export async function updateMatch(
  id: string,
  _prevState: MatchFormState,
  formData: FormData,
): Promise<MatchFormState> {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const existing = await prisma.match.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id) {
    return { error: "Match nicht gefunden" };
  }

  const parsed = matchSchema.safeParse({
    date: formData.get("date"),
    opponentName: formData.get("opponentName"),
    score: formData.get("score"),
    result: formData.get("result"),
    surface: formData.get("surface"),
    aces: formData.get("aces"),
    doubleFaults: formData.get("doubleFaults"),
    winners: formData.get("winners"),
    unforcedErrors: formData.get("unforcedErrors"),
    firstServePct: formData.get("firstServePct"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe" };
  }

  const data = parsed.data;

  await prisma.match.update({
    where: { id },
    data: {
      date: new Date(data.date),
      opponentName: data.opponentName,
      score: data.score,
      result: data.result,
      surface: data.surface || null,
      aces: numOrNull(data.aces),
      doubleFaults: numOrNull(data.doubleFaults),
      winners: numOrNull(data.winners),
      unforcedErrors: numOrNull(data.unforcedErrors),
      firstServePct: numOrNull(data.firstServePct),
      notes: data.notes || null,
    },
  });

  revalidatePath("/matches");
  redirect("/matches");
}

export async function deleteMatch(id: string) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const existing = await prisma.match.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id) {
    return;
  }

  await prisma.match.delete({ where: { id } });
  revalidatePath("/matches");
}
