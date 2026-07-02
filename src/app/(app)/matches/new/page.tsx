import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatchForm } from "@/components/matches/match-form";
import { createMatch } from "@/actions/matches";

export default function NewMatchPage() {
  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>Neues Match</CardTitle>
      </CardHeader>
      <CardContent>
        <MatchForm action={createMatch} />
      </CardContent>
    </Card>
  );
}
