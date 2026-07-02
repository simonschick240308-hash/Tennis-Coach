"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { logout } from "@/actions/logout";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/training", label: "Training" },
  { href: "/matches", label: "Matches" },
  { href: "/profile", label: "Profil" },
  { href: "/coach", label: "Coach" },
];

function NavLinks({
  pathname,
  onNavigate,
  className,
  linkClassName,
}: {
  pathname: string;
  onNavigate?: () => void;
  className?: string;
  linkClassName?: (active: boolean) => string;
}) {
  return (
    <nav className={className}>
      {links.map((link) => {
        const active = pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={linkClassName?.(active)}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function NavBar({ userName }: { userName?: string | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/dashboard" className="shrink-0 font-semibold">
          🎾 Tennis-Coach
        </Link>

        <NavLinks
          pathname={pathname}
          className="hidden items-center gap-1 md:flex"
          linkClassName={(active) =>
            cn(
              "rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors hover:bg-accent",
              active ? "bg-accent text-accent-foreground" : "text-muted-foreground",
            )
          }
        />

        <div className="flex items-center gap-2">
          {userName && (
            <span className="hidden text-sm text-muted-foreground lg:inline">
              {userName}
            </span>
          )}
          <form action={logout} className="hidden md:block">
            <Button type="submit" variant="outline" size="sm">
              Abmelden
            </Button>
          </form>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button type="button" variant="outline" size="icon" className="md:hidden">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>🎾 Tennis-Coach</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 px-4">
                {userName && (
                  <span className="text-sm text-muted-foreground">{userName}</span>
                )}
                <NavLinks
                  pathname={pathname}
                  onNavigate={() => setOpen(false)}
                  className="flex flex-col gap-1"
                  linkClassName={(active) =>
                    cn(
                      "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
                      active ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                    )
                  }
                />
                <form action={logout}>
                  <Button type="submit" variant="outline" size="sm" className="w-full">
                    Abmelden
                  </Button>
                </form>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
