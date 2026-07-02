import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatchForm } from "@/components/matches/match-form";
import { updateMatch } from "@/actions/matches";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function EditMatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const match = await prisma.match.findUnique({ where: { id } });

  if (!match || match.userId !== session!.user.id) {
    notFound();
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>Match bearbeiten</CardTitle>
      </CardHeader>
      <CardContent>
        <MatchForm action={updateMatch.bind(null, id)} defaultValues={match} />
      </CardContent>
    </Card>
  );
}
