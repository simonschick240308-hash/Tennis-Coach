"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { syncWhoopWorkouts } from "@/lib/whoop";
import { logError } from "@/lib/log-error";

export type SyncState = {
  error?: string;
  imported?: number;
};

export async function disconnectWhoop() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  await prisma.whoopConnection.deleteMany({ where: { userId: session.user.id } });
  revalidatePath("/profile");
  revalidatePath("/dashboard");
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- signature required by useActionState
export async function syncWhoopNow(_prevState: SyncState, _formData: FormData): Promise<SyncState> {
  const session = await auth();
  if (!session?.user) redirect("/login");

  try {
    const { imported } = await syncWhoopWorkouts(session.user.id);
    revalidatePath("/training");
    revalidatePath("/dashboard");
    revalidatePath("/profile");
    return { imported };
  } catch (error) {
    logError("whoop-manual-sync", error, { userId: session.user.id });
    return { error: "Synchronisierung mit Whoop ist fehlgeschlagen. Bitte später erneut versuchen." };
  }
}
