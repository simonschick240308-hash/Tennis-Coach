import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { drillCategoryLabels, drillDifficultyLabels } from "@/lib/labels";
import { matchDrillCategoriesFromText } from "@/lib/drill-matching";
import type { DrillCategory } from "@prisma/client";

const categories = Object.keys(drillCategoryLabels) as DrillCategory[];

const difficultyBadgeVariant: Record<string, "secondary" | "default" | "outline"> = {
  BEGINNER: "secondary",
  INTERMEDIATE: "default",
  ADVANCED: "outline",
};

export default async function DrillsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const activeCategory =
    category && categories.includes(category as DrillCategory)
      ? (category as DrillCategory)
      : undefined;

  const session = await auth();
  const profile = await prisma.playerProfile.findUnique({
    where: { userId: session!.user.id },
    select: { weaknesses: true },
  });
  const recommendedCategories = matchDrillCategoriesFromText(profile?.weaknesses);

  const drills = await prisma.drill.findMany({
    where: activeCategory ? { category: activeCategory } : undefined,
    orderBy: [{ category: "asc" }, { title: "asc" }],
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Drill-Bibliothek</h1>
        <p className="text-muted-foreground">
          Situative Übungen zu Schlagarten und Spielsituationen — orientiert an
          taktischen Trainingsprinzipien von Patrick Mouratoglou.
        </p>
      </div>

      {recommendedCategories.length > 0 && (
        <p className="rounded-md border border-primary/40 bg-accent px-4 py-2 text-sm text-accent-foreground">
          Drills mit <span className="font-medium">★ Empfohlen</span> passen zu den
          Schwächen aus deinem Profil.
        </p>
      )}

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        <Link
          href="/drills"
          className={cn(
            "shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
            !activeCategory
              ? "border-primary bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-accent",
          )}
        >
          Alle
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/drills?category=${cat}`}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
              activeCategory === cat
                ? "border-primary bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent",
            )}
          >
            {drillCategoryLabels[cat]}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {drills.map((drill) => {
          const isRecommended = recommendedCategories.includes(drill.category);
          return (
            <Link key={drill.id} href={`/drills/${drill.id}`}>
              <Card
                className={cn(
                  "h-full transition-shadow hover:shadow-md",
                  isRecommended && "ring-1 ring-primary",
                )}
              >
                <CardHeader className="gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="secondary">{drillCategoryLabels[drill.category]}</Badge>
                    <Badge variant={difficultyBadgeVariant[drill.difficulty]}>
                      {drillDifficultyLabels[drill.difficulty]}
                    </Badge>
                  </div>
                  <CardTitle className="text-base">
                    {isRecommended && <span className="text-primary">★ </span>}
                    {drill.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 text-sm text-muted-foreground">
                    {drill.situation}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
