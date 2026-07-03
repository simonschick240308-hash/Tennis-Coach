import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getWhoopAuthUrl, isWhoopConfigured } from "@/lib/whoop";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (!isWhoopConfigured()) {
    return NextResponse.redirect(
      new URL("/profile?whoop_error=not_configured", req.url),
    );
  }

  const state = randomBytes(16).toString("hex");
  const redirectUri = new URL("/api/whoop/callback", req.url).toString();
  const authUrl = getWhoopAuthUrl(state, redirectUri);

  const response = NextResponse.redirect(authUrl);
  response.cookies.set("whoop_oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });
  return response;
}
