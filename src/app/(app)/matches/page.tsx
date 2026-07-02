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
import { deleteMatch } from "@/actions/matches";
import { matchResultLabels } from "@/lib/labels";

export default async function MatchesPage() {
  const session = await auth();
  const matches = await prisma.match.findMany({
    where: { userId: session!.user.id },
    orderBy: { date: "desc" },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Match-Log</h1>
        <Button asChild>
          <Link href="/matches/new">Neues Match</Link>
        </Button>
      </div>

      {matches.length === 0 ? (
        <p className="text-muted-foreground">Noch keine Matches erfasst.</p>
      ) : (
        <div className="overflow-x-auto rounded-md border bg-background">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Datum</TableHead>
                <TableHead>Gegner</TableHead>
                <TableHead>Ergebnis</TableHead>
                <TableHead>Sätze</TableHead>
                <TableHead>1. Aufschlag %</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matches.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>{m.date.toLocaleDateString("de-AT")}</TableCell>
                  <TableCell>{m.opponentName}</TableCell>
                  <TableCell>
                    <Badge variant={m.result === "WIN" ? "default" : "destructive"}>
                      {matchResultLabels[m.result]}
                    </Badge>
                  </TableCell>
                  <TableCell>{m.score}</TableCell>
                  <TableCell>
                    {m.firstServePct !== null ? `${m.firstServePct}%` : "–"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/matches/${m.id}/edit`}>Bearbeiten</Link>
                      </Button>
                      <DeleteButton
                        action={deleteMatch.bind(null, m.id)}
                        itemLabel="Match"
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
