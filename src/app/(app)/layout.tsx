import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { NavBar } from "@/components/nav-bar";
import { BottomNav } from "@/components/bottom-nav";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const userName = session.user.name ?? session.user.email;

  return (
    <div className="min-h-screen bg-muted/20">
      <NavBar userName={userName} />
      <main className="mx-auto max-w-5xl px-4 py-6 pb-24 md:pb-6">{children}</main>
      <BottomNav userName={userName} />
    </div>
  );
}
