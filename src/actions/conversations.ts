"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function createConversation() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const conversation = await prisma.coachConversation.create({
    data: { userId: session.user.id },
  });

  redirect(`/coach/${conversation.id}`);
}
