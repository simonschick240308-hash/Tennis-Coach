import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrainingForm } from "@/components/training/training-form";
import { updateTrainingSession } from "@/actions/training";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function EditTrainingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const trainingSession = await prisma.trainingSession.findUnique({
    where: { id },
  });

  if (!trainingSession || trainingSession.userId !== session!.user.id) {
    notFound();
  }

  return (
    <Card className="mx-auto max-w-xl">
      <CardHeader>
        <CardTitle>Trainingseinheit bearbeiten</CardTitle>
      </CardHeader>
      <CardContent>
        <TrainingForm
          action={updateTrainingSession.bind(null, id)}
          defaultValues={trainingSession}
        />
      </CardContent>
    </Card>
  );
}
