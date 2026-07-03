import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileForm } from "@/components/profile/profile-form";
import { WhoopCard } from "@/components/whoop/whoop-card";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isWhoopConfigured } from "@/lib/whoop";

const whoopErrorMessages: Record<string, string> = {
  not_configured: "Die Whoop-Integration ist noch nicht konfiguriert.",
  invalid_state: "Die Whoop-Verbindung ist ungültig oder abgelaufen. Bitte erneut versuchen.",
  token_exchange: "Die Verbindung mit Whoop ist fehlgeschlagen. Bitte erneut versuchen.",
};

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ whoop_connected?: string; whoop_error?: string }>;
}) {
  const { whoop_connected, whoop_error } = await searchParams;
  const session = await auth();
  const [profile, whoopConnection] = await Promise.all([
    prisma.playerProfile.findUnique({ where: { userId: session!.user.id } }),
    prisma.whoopConnection.findUnique({ where: { userId: session!.user.id } }),
  ]);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Spielerprofil</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm defaultValues={profile} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Whoop</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {whoop_connected && (
            <p className="text-sm text-primary">Whoop erfolgreich verbunden.</p>
          )}
          {whoop_error && (
            <p className="text-sm text-destructive">
              {whoopErrorMessages[whoop_error] ?? "Verbindung mit Whoop fehlgeschlagen."}
            </p>
          )}
          <WhoopCard
            connected={Boolean(whoopConnection)}
            whoopConfigured={isWhoopConfigured()}
            lastSyncedAt={whoopConnection?.lastSyncedAt ?? null}
          />
        </CardContent>
      </Card>
    </div>
  );
}
