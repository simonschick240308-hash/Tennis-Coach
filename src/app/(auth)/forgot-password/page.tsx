"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { resetPasswordWithRecoveryCode } from "@/actions/forgot-password";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandMark } from "@/components/brand-mark";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(resetPasswordWithRecoveryCode, {});
  const [copied, setCopied] = useState(false);

  if (state.success && state.newRecoveryCode) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center gap-6 p-4"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, color-mix(in oklab, var(--primary) 12%, transparent), var(--background))",
        }}
      >
        <BrandMark />
        <Card className="w-full max-w-sm shadow-sm">
          <CardHeader>
            <CardTitle>Passwort geändert</CardTitle>
            <CardDescription>
              Dein neuer Recovery-Code — speichere ihn jetzt sicher, der alte Code
              ist ab sofort ungültig.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="rounded-md border bg-muted p-4 text-center font-mono text-lg tracking-wider">
              {state.newRecoveryCode}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={async () => {
                await navigator.clipboard.writeText(state.newRecoveryCode!);
                setCopied(true);
              }}
            >
              {copied ? "Kopiert!" : "Code kopieren"}
            </Button>
            <Button asChild className="w-full">
              <Link href="/login">Zum Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-6 p-4"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% -10%, color-mix(in oklab, var(--primary) 12%, transparent), var(--background))",
      }}
    >
      <BrandMark />
      <Card className="w-full max-w-sm shadow-sm">
        <CardHeader>
          <CardTitle>Passwort zurücksetzen</CardTitle>
          <CardDescription>
            Gib deine E-Mail, deinen Recovery-Code und ein neues Passwort ein.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input id="email" name="email" type="email" required autoComplete="email" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="recoveryCode">Recovery-Code</Label>
              <Input
                id="recoveryCode"
                name="recoveryCode"
                placeholder="XXXX-XXXX-XXXX"
                required
                autoComplete="off"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="newPassword">Neues Passwort</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>
            {state.error && <p className="text-sm text-destructive">{state.error}</p>}
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Wird gespeichert..." : "Passwort setzen"}
            </Button>
          </form>
          <p className="mt-4 text-sm text-muted-foreground">
            <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
              Zurück zum Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
