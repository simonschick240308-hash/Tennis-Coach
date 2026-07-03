"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Dumbbell, Trophy, BookOpen, MessageCircle, MoreHorizontal, User } from "lucide-react";
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
import { BrandMark } from "@/components/brand-mark";

const tabs = [
  { href: "/dashboard", label: "Start", icon: LayoutDashboard },
  { href: "/training", label: "Training", icon: Dumbbell },
  { href: "/matches", label: "Matches", icon: Trophy },
  { href: "/drills", label: "Drills", icon: BookOpen },
  { href: "/coach", label: "Coach", icon: MessageCircle },
];

export function BottomNav({ userName }: { userName?: string | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isMoreActive = pathname.startsWith("/profile");

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-background md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid grid-cols-6">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Icon className="size-5" />
              {label}
            </Link>
          );
        })}

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className={cn(
                "flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium",
                isMoreActive ? "text-primary" : "text-muted-foreground",
              )}
            >
              <MoreHorizontal className="size-5" />
              Mehr
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetHeader>
              <SheetTitle>
                <BrandMark size="compact" />
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-4 px-4">
              {userName && (
                <span className="text-sm text-muted-foreground">{userName}</span>
              )}
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
                  isMoreActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                )}
              >
                <User className="size-4" />
                Profil
              </Link>
              <form action={logout}>
                <Button type="submit" variant="outline" size="sm" className="w-full">
                  Abmelden
                </Button>
              </form>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
