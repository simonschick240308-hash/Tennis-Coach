import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrainingForm } from "@/components/training/training-form";
import { createTrainingSession } from "@/actions/training";

export default async function NewTrainingPage({
  searchParams,
}: {
  searchParams: Promise<{ focusAreas?: string }>;
}) {
  const { focusAreas } = await searchParams;

  return (
    <Card className="mx-auto max-w-xl">
      <CardHeader>
        <CardTitle>Neue Trainingseinheit</CardTitle>
      </CardHeader>
      <CardContent>
        <TrainingForm action={createTrainingSession} defaultFocusAreas={focusAreas} />
      </CardContent>
    </Card>
  );
}
