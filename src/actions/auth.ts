"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";
import { generateRecoveryCode, hashRecoveryCode } from "@/lib/recovery-code";

export type RegisterState = {
  error?: string;
  success?: boolean;
  recoveryCode?: string;
};

export async function registerUser(
  _prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe" };
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Ein Konto mit dieser E-Mail existiert bereits" };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const recoveryCode = generateRecoveryCode();
  const recoveryCodeHash = await hashRecoveryCode(recoveryCode);

  await prisma.user.create({
    data: { name, email, passwordHash, recoveryCodeHash },
  });

  return { success: true, recoveryCode };
}
