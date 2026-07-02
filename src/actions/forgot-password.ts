"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { generateRecoveryCode, hashRecoveryCode, verifyRecoveryCode } from "@/lib/recovery-code";

export type ForgotPasswordState = {
  error?: string;
  success?: boolean;
  newRecoveryCode?: string;
};

const schema = z.object({
  email: z.string().trim().email("Ungültige E-Mail-Adresse"),
  recoveryCode: z.string().trim().min(1, "Recovery-Code ist erforderlich"),
  newPassword: z.string().min(8, "Passwort muss mindestens 8 Zeichen haben"),
});

export async function resetPasswordWithRecoveryCode(
  _prevState: ForgotPasswordState,
  formData: FormData,
): Promise<ForgotPasswordState> {
  const parsed = schema.safeParse({
    email: formData.get("email"),
    recoveryCode: formData.get("recoveryCode"),
    newPassword: formData.get("newPassword"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe" };
  }

  const { email, recoveryCode, newPassword } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.recoveryCodeHash) {
    return { error: "E-Mail oder Recovery-Code ist falsch" };
  }

  const isValidCode = await verifyRecoveryCode(recoveryCode, user.recoveryCodeHash);
  if (!isValidCode) {
    return { error: "E-Mail oder Recovery-Code ist falsch" };
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  const newRecoveryCode = generateRecoveryCode();
  const newRecoveryCodeHash = await hashRecoveryCode(newRecoveryCode);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      recoveryCodeHash: newRecoveryCodeHash,
      failedLoginAttempts: 0,
      lockedUntil: null,
    },
  });

  return { success: true, newRecoveryCode };
}
