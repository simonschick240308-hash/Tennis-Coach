import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { drillCategoryLabels, drillDifficultyLabels } from "@/lib/labels";
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
        {drills.map((drill) => (
          <Link key={drill.id} href={`/drills/${drill.id}`}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardHeader className="gap-2">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="secondary">{drillCategoryLabels[drill.category]}</Badge>
                  <Badge variant={difficultyBadgeVariant[drill.difficulty]}>
                    {drillDifficultyLabels[drill.difficulty]}
                  </Badge>
                </div>
                <CardTitle className="text-base">{drill.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {drill.situation}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
