import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrainingForm } from "@/components/training/training-form";
import { createTrainingSession } from "@/actions/training";

export default function NewTrainingPage() {
  return (
    <Card className="mx-auto max-w-xl">
      <CardHeader>
        <CardTitle>Neue Trainingseinheit</CardTitle>
      </CardHeader>
      <CardContent>
        <TrainingForm action={createTrainingSession} />
      </CardContent>
    </Card>
  );
}
