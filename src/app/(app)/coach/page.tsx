import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createConversation } from "@/actions/conversations";

export default async function CoachPage() {
  const session = await auth();
  const conversations = await prisma.coachConversation.findMany({
    where: { userId: session!.user.id },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">KI-Coach</h1>
        <form action={createConversation}>
          <Button type="submit">Neue Unterhaltung</Button>
        </form>
      </div>

      {conversations.length === 0 ? (
        <p className="text-muted-foreground">
          Noch keine Gespräche. Starte eine neue Unterhaltung mit deinem
          KI-Coach.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {conversations.map((c) => (
            <Link key={c.id} href={`/coach/${c.id}`}>
              <Card className="transition-colors hover:bg-accent">
                <CardContent className="flex items-center justify-between py-4">
                  <span>{c.title ?? "Neues Gespräch"}</span>
                  <span className="text-sm text-muted-foreground">
                    {c.updatedAt.toLocaleDateString("de-AT")}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
