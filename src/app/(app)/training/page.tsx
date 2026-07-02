import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DeleteButton } from "@/components/delete-button";
import { deleteTrainingSession } from "@/actions/training";
import { trainingTypeLabels } from "@/lib/labels";

export default async function TrainingPage() {
  const session = await auth();
  const sessions = await prisma.trainingSession.findMany({
    where: { userId: session!.user.id },
    orderBy: { date: "desc" },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Trainings-Log</h1>
        <Button asChild>
          <Link href="/training/new">Neue Einheit</Link>
        </Button>
      </div>

      {sessions.length === 0 ? (
        <p className="text-muted-foreground">
          Noch keine Trainingseinheiten erfasst.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-md border bg-background">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Datum</TableHead>
                <TableHead>Art</TableHead>
                <TableHead>Dauer</TableHead>
                <TableHead>Intensität</TableHead>
                <TableHead>Fokus</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.date.toLocaleDateString("de-AT")}</TableCell>
                  <TableCell>{trainingTypeLabels[s.type]}</TableCell>
                  <TableCell>{s.durationMin} min</TableCell>
                  <TableCell>{s.intensity ?? "–"}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {s.focusAreas.map((area) => (
                        <Badge key={area} variant="secondary">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/training/${s.id}/edit`}>Bearbeiten</Link>
                      </Button>
                      <DeleteButton
                        action={deleteTrainingSession.bind(null, s.id)}
                        itemLabel="Trainingseinheit"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
