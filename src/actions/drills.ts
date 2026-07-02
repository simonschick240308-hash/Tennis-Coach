"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type DrillLogState = {
  error?: string;
  success?: boolean;
};

export async function logDrillCompletion(
  drillId: string,
  _prevState: DrillLogState,
  formData: FormData,
): Promise<DrillLogState> {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const notes = formData.get("notes");

  await prisma.drillLog.create({
    data: {
      userId: session.user.id,
      drillId,
      notes: typeof notes === "string" && notes.trim() ? notes.trim() : null,
    },
  });

  revalidatePath(`/drills/${drillId}`);
  return { success: true };
}

export async function deleteDrillLog(logId: string) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const log = await prisma.drillLog.findUnique({ where: { id: logId } });
  if (!log || log.userId !== session.user.id) {
    return;
  }

  await prisma.drillLog.delete({ where: { id: logId } });
  revalidatePath(`/drills/${log.drillId}`);
}
