import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { exchangeCodeForTokens } from "@/lib/whoop";
import { logError } from "@/lib/log-error";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const cookieState = req.cookies.get("whoop_oauth_state")?.value;

  if (!code || !state || !cookieState || state !== cookieState) {
    return NextResponse.redirect(new URL("/profile?whoop_error=invalid_state", req.url));
  }

  try {
    const redirectUri = new URL("/api/whoop/callback", req.url).toString();
    const tokens = await exchangeCodeForTokens(code, redirectUri);

    await prisma.whoopConnection.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token ?? "",
        expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
      },
      update: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token ?? undefined,
        expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
      },
    });

    const response = NextResponse.redirect(new URL("/profile?whoop_connected=1", req.url));
    response.cookies.delete("whoop_oauth_state");
    return response;
  } catch (error) {
    logError("whoop-oauth-callback", error, { userId: session.user.id });
    return NextResponse.redirect(new URL("/profile?whoop_error=token_exchange", req.url));
  }
}
