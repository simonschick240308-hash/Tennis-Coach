import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { drillCategoryLabels, drillDifficultyLabels } from "@/lib/labels";
import { buildYoutubeSearchUrl } from "@/lib/video-search";

export default async function DrillDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const drill = await prisma.drill.findUnique({ where: { id } });

  if (!drill) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-4">
      <Button asChild variant="ghost" size="sm" className="w-fit -ml-2">
        <Link href="/drills">
          <ArrowLeft className="size-4" />
          Zurück zur Bibliothek
        </Link>
      </Button>

      <Card>
        <CardHeader className="gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{drillCategoryLabels[drill.category]}</Badge>
            <Badge>{drillDifficultyLabels[drill.difficulty]}</Badge>
          </div>
          <CardTitle className="text-xl">{drill.title}</CardTitle>
          <p className="text-muted-foreground">{drill.situation}</p>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div>
            <h3 className="mb-1 font-medium">Aufbau</h3>
            <p className="whitespace-pre-wrap text-sm text-muted-foreground">
              {drill.setup}
            </p>
          </div>
          <Separator />
          <div>
            <h3 className="mb-1 font-medium">Ablauf</h3>
            <p className="whitespace-pre-wrap text-sm text-muted-foreground">
              {drill.execution}
            </p>
          </div>
          <Separator />
          <div>
            <h3 className="mb-1 font-medium">Coaching-Hinweis</h3>
            <p className="whitespace-pre-wrap text-sm text-muted-foreground">
              {drill.coachingCue}
            </p>
          </div>
          <Separator />
          <div>
            <h3 className="mb-1 font-medium">Wiederholungen</h3>
            <p className="text-sm text-muted-foreground">{drill.reps}</p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {drill.focusTags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>

          <Separator />

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Passende Videoerklärungen zu diesem Drill (externe Suche):
            </p>
            <Button asChild variant="outline" size="sm">
              <a
                href={buildYoutubeSearchUrl(drill.videoQuery)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Video-Erklärungen suchen
                <ExternalLink className="size-4" />
              </a>
            </Button>
          </div>

          <div className="flex justify-end">
            <Button asChild size="sm">
              <Link
                href={`/training/new?focusAreas=${encodeURIComponent(drill.focusTags.join(", "))}`}
              >
                Als Trainingseinheit loggen
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
