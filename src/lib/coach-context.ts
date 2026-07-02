import { subDays, format } from "date-fns";
import { prisma } from "@/lib/prisma";
import { skillLevelLabels, playingHandLabels } from "@/lib/labels";

export async function buildCoachContext(userId: string): Promise<string> {
  const thirtyDaysAgo = subDays(new Date(), 30);

  const [profile, trainings, matches] = await Promise.all([
    prisma.playerProfile.findUnique({ where: { userId } }),
    prisma.trainingSession.findMany({
      where: { userId, date: { gte: thirtyDaysAgo } },
      orderBy: { date: "desc" },
    }),
    prisma.match.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 10,
    }),
  ]);

  const lines: string[] = [];

  lines.push("## Spielerprofil");
  if (profile) {
    lines.push(`- Niveau: ${skillLevelLabels[profile.skillLevel] ?? profile.skillLevel}`);
    lines.push(`- Spielhand: ${playingHandLabels[profile.playingHand] ?? profile.playingHand}`);
    if (profile.goals) lines.push(`- Ziele: ${profile.goals}`);
    if (profile.strengths) lines.push(`- Stärken: ${profile.strengths}`);
    if (profile.weaknesses) lines.push(`- Schwächen: ${profile.weaknesses}`);
    if (profile.oetvRanking) lines.push(`- ÖTV/OÖTV Rangliste: ${profile.oetvRanking}`);
    if (profile.itnValue !== null && profile.itnValue !== undefined) {
      lines.push(`- ITN-Leistungswert: ${profile.itnValue}`);
    }
    if (profile.oetvProfileUrl) lines.push(`- ÖTV/OÖTV Profil-Link: ${profile.oetvProfileUrl}`);
  } else {
    lines.push("- Noch kein Profil ausgefüllt.");
  }

  lines.push("");
  lines.push("## Training (letzte 30 Tage)");
  if (trainings.length > 0) {
    const totalMinutes = trainings.reduce((sum, t) => sum + t.durationMin, 0);
    const focusCounts = new Map<string, number>();
    let intensitySum = 0;
    let intensityCount = 0;
    for (const t of trainings) {
      for (const area of t.focusAreas) {
        focusCounts.set(area, (focusCounts.get(area) ?? 0) + 1);
      }
      if (t.intensity !== null) {
        intensitySum += t.intensity;
        intensityCount += 1;
      }
    }
    const topFocusAreas = [...focusCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([area, count]) => `${area} (${count}x)`)
      .join(", ");

    lines.push(`- Anzahl Einheiten: ${trainings.length}`);
    lines.push(`- Gesamtminuten: ${totalMinutes}`);
    if (topFocusAreas) lines.push(`- Häufigste Fokusbereiche: ${topFocusAreas}`);
    if (intensityCount > 0) {
      lines.push(`- Ø Intensität (RPE): ${(intensitySum / intensityCount).toFixed(1)}`);
    }
  } else {
    lines.push("- Keine Trainingseinheiten in den letzten 30 Tagen erfasst.");
  }

  lines.push("");
  lines.push("## Matches (letzte bis zu 10)");
  if (matches.length > 0) {
    const wins = matches.filter((m) => m.result === "WIN").length;
    const losses = matches.filter((m) => m.result === "LOSS").length;
    const servePcts = matches
      .map((m) => m.firstServePct)
      .filter((v): v is number => v !== null);
    const ueValues = matches
      .map((m) => m.unforcedErrors)
      .filter((v): v is number => v !== null);
    const aces = matches.map((m) => m.aces).filter((v): v is number => v !== null);
    const doubleFaults = matches
      .map((m) => m.doubleFaults)
      .filter((v): v is number => v !== null);

    lines.push(`- Bilanz: ${wins} Siege, ${losses} Niederlagen`);
    if (servePcts.length > 0) {
      lines.push(
        `- Ø 1. Aufschlag-Quote: ${(servePcts.reduce((a, b) => a + b, 0) / servePcts.length).toFixed(1)}%`,
      );
    }
    if (ueValues.length > 0) {
      lines.push(
        `- Ø Unforced Errors: ${(ueValues.reduce((a, b) => a + b, 0) / ueValues.length).toFixed(1)}`,
      );
    }
    if (aces.length > 0 && doubleFaults.length > 0) {
      const totalAces = aces.reduce((a, b) => a + b, 0);
      const totalDF = doubleFaults.reduce((a, b) => a + b, 0);
      lines.push(`- Asse/Doppelfehler gesamt: ${totalAces}/${totalDF}`);
    }
    lines.push("- Details je Match:");
    for (const m of matches) {
      lines.push(
        `  - ${format(m.date, "dd.MM.yyyy")} vs. ${m.opponentName}: ${m.result === "WIN" ? "Sieg" : "Niederlage"} (${m.score})`,
      );
    }
  } else {
    lines.push("- Keine Matches erfasst.");
  }

  const recentNotes = [...trainings, ...matches]
    .filter((entry) => "notes" in entry && entry.notes)
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 3);

  if (recentNotes.length > 0) {
    lines.push("");
    lines.push("## Letzte Notizen");
    for (const entry of recentNotes) {
      const notes = "notes" in entry ? entry.notes : null;
      if (notes) {
        lines.push(`- ${format(entry.date, "dd.MM.yyyy")}: ${notes.slice(0, 300)}`);
      }
    }
  }

  return lines.join("\n");
}
