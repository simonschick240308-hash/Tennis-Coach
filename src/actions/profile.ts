"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { profileSchema } from "@/lib/validations";

export type ProfileFormState = {
  error?: string;
  success?: boolean;
};

export async function updateProfile(
  _prevState: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const parsed = profileSchema.safeParse({
    skillLevel: formData.get("skillLevel"),
    playingHand: formData.get("playingHand"),
    goals: formData.get("goals"),
    weaknesses: formData.get("weaknesses"),
    strengths: formData.get("strengths"),
    oetvRanking: formData.get("oetvRanking"),
    itnValue: formData.get("itnValue"),
    oetvProfileUrl: formData.get("oetvProfileUrl"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe" };
  }

  const data = parsed.data;

  await prisma.playerProfile.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      skillLevel: data.skillLevel,
      playingHand: data.playingHand,
      goals: data.goals || null,
      weaknesses: data.weaknesses || null,
      strengths: data.strengths || null,
      oetvRanking: data.oetvRanking || null,
      itnValue: data.itnValue === "" || data.itnValue === undefined ? null : data.itnValue,
      oetvProfileUrl: data.oetvProfileUrl || null,
    },
    update: {
      skillLevel: data.skillLevel,
      playingHand: data.playingHand,
      goals: data.goals || null,
      weaknesses: data.weaknesses || null,
      strengths: data.strengths || null,
      oetvRanking: data.oetvRanking || null,
      itnValue: data.itnValue === "" || data.itnValue === undefined ? null : data.itnValue,
      oetvProfileUrl: data.oetvProfileUrl || null,
    },
  });

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  return { success: true };
}
