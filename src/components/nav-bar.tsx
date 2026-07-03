"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { logout } from "@/actions/logout";
import { BrandMark } from "@/components/brand-mark";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/training", label: "Training" },
  { href: "/matches", label: "Matches" },
  { href: "/drills", label: "Drills" },
  { href: "/profile", label: "Profil" },
  { href: "/coach", label: "Coach" },
];

export function NavBar({ userName }: { userName?: string | null }) {
  const pathname = usePathname();

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/dashboard" className="shrink-0">
          <BrandMark size="compact" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors hover:bg-accent",
                  active ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {userName && (
            <span className="hidden text-sm text-muted-foreground lg:inline">
              {userName}
            </span>
          )}
          <form action={logout}>
            <Button type="submit" variant="outline" size="sm">
              Abmelden
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
