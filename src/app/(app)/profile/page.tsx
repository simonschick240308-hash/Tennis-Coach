import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileForm } from "@/components/profile/profile-form";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function ProfilePage() {
  const session = await auth();
  const profile = await prisma.playerProfile.findUnique({
    where: { userId: session!.user.id },
  });

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>Spielerprofil</CardTitle>
      </CardHeader>
      <CardContent>
        <ProfileForm defaultValues={profile} />
      </CardContent>
    </Card>
  );
}
