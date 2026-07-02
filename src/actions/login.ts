"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isLocked, lockoutMinutesRemaining } from "@/lib/login-security";

export type LoginState = {
  error?: string;
};

export async function authenticate(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = formData.get("email");

  if (typeof email === "string") {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { lockedUntil: true },
    });
    if (user && isLocked(user)) {
      const minutes = lockoutMinutesRemaining(user);
      return {
        error: `Zu viele Fehlversuche. Bitte versuche es in ${minutes} Minute${minutes === 1 ? "" : "n"} erneut.`,
      };
    }
  }

  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/dashboard",
    });
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "E-Mail oder Passwort ist falsch" };
        default:
          return { error: "Anmeldung fehlgeschlagen" };
      }
    }
    throw error;
  }
}
