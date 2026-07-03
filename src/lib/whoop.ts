import { prisma } from "@/lib/prisma";
import { logError } from "@/lib/log-error";
import type { WhoopConnection } from "@prisma/client";

const AUTH_URL = "https://api.prod.whoop.com/oauth/oauth2/auth";
const TOKEN_URL = "https://api.prod.whoop.com/oauth/oauth2/token";
const API_BASE = "https://api.prod.whoop.com/developer/v2";

export const WHOOP_SCOPES = "read:recovery read:sleep read:cycles read:workout offline";

function getClientCredentials() {
  const clientId = process.env.WHOOP_CLIENT_ID;
  const clientSecret = process.env.WHOOP_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("WHOOP_CLIENT_ID/WHOOP_CLIENT_SECRET sind nicht konfiguriert");
  }
  return { clientId, clientSecret };
}

export function isWhoopConfigured(): boolean {
  return Boolean(process.env.WHOOP_CLIENT_ID && process.env.WHOOP_CLIENT_SECRET);
}

export function getWhoopAuthUrl(state: string, redirectUri: string): string {
  const { clientId } = getClientCredentials();
  const url = new URL(AUTH_URL);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", WHOOP_SCOPES);
  url.searchParams.set("state", state);
  return url.toString();
}

type TokenResponse = {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
};

export async function exchangeCodeForTokens(code: string, redirectUri: string) {
  const { clientId, clientSecret } = getClientCredentials();
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
    }),
  });

  if (!res.ok) {
    throw new Error(`Whoop token exchange failed: ${res.status} ${await res.text()}`);
  }

  return (await res.json()) as TokenResponse;
}

async function refreshAccessToken(refreshToken: string) {
  const { clientId, clientSecret } = getClientCredentials();
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
      scope: "offline",
    }),
  });

  if (!res.ok) {
    throw new Error(`Whoop token refresh failed: ${res.status} ${await res.text()}`);
  }

  return (await res.json()) as TokenResponse;
}

export async function getValidAccessToken(connection: WhoopConnection): Promise<string> {
  const isExpiring = connection.expiresAt.getTime() < Date.now() + 60_000;
  if (!isExpiring) {
    return connection.accessToken;
  }

  const tokens = await refreshAccessToken(connection.refreshToken);
  await prisma.whoopConnection.update({
    where: { id: connection.id },
    data: {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token ?? connection.refreshToken,
      expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
    },
  });
  return tokens.access_token;
}

async function whoopGet<T>(accessToken: string, path: string, params?: Record<string, string>) {
  const url = new URL(`${API_BASE}${path}`);
  for (const [key, value] of Object.entries(params ?? {})) {
    url.searchParams.set(key, value);
  }

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    throw new Error(`Whoop API ${path} failed: ${res.status} ${await res.text()}`);
  }

  return (await res.json()) as T;
}

export type WhoopRecoveryRecord = {
  cycle_id: number;
  score_state: string;
  score?: {
    recovery_score: number;
    resting_heart_rate: number;
    hrv_rmssd_milli: number;
  };
  created_at: string;
};

export type WhoopSleepRecord = {
  id: string;
  score_state: string;
  score?: {
    sleep_performance_percentage: number;
  };
  start: string;
  end: string;
};

export type WhoopWorkoutRecord = {
  id: string;
  start: string;
  end: string;
  sport_name: string;
  score_state: string;
  score?: {
    strain: number;
    average_heart_rate: number;
    max_heart_rate: number;
  };
};

type Collection<T> = { records: T[]; next_token?: string | null };

export async function fetchLatestRecovery(accessToken: string) {
  const data = await whoopGet<Collection<WhoopRecoveryRecord>>(accessToken, "/recovery", {
    limit: "1",
  });
  return data.records[0] ?? null;
}

export async function fetchLatestSleep(accessToken: string) {
  const data = await whoopGet<Collection<WhoopSleepRecord>>(accessToken, "/activity/sleep", {
    limit: "1",
  });
  return data.records[0] ?? null;
}

export async function fetchRecentWorkouts(accessToken: string, since: Date) {
  const data = await whoopGet<Collection<WhoopWorkoutRecord>>(accessToken, "/activity/workout", {
    start: since.toISOString(),
    limit: "25",
  });
  return data.records;
}

export function mapWorkoutToTraining(workout: WhoopWorkoutRecord) {
  const start = new Date(workout.start);
  const end = new Date(workout.end);
  const durationMin = Math.max(1, Math.round((end.getTime() - start.getTime()) / 60_000));
  const strain = workout.score?.strain ?? null;
  const intensity =
    strain !== null ? Math.min(10, Math.max(1, Math.round((strain / 21) * 10))) : null;
  const isTennis = workout.sport_name?.toLowerCase().includes("tennis");

  const notesParts = [`Automatisch importiert von Whoop (${workout.sport_name}).`];
  if (strain !== null) notesParts.push(`Strain: ${strain.toFixed(1)}.`);
  if (workout.score?.average_heart_rate) {
    notesParts.push(`Ø Herzfrequenz: ${workout.score.average_heart_rate} bpm.`);
  }

  return {
    date: start,
    durationMin,
    type: isTennis ? ("DRILL" as const) : ("FITNESS" as const),
    focusAreas: [] as string[],
    intensity,
    notes: notesParts.join(" "),
    whoopWorkoutId: workout.id,
  };
}

export type WhoopSnapshot = {
  recoveryScore: number | null;
  restingHeartRate: number | null;
  sleepPerformancePct: number | null;
};

export async function getWhoopSnapshot(userId: string): Promise<WhoopSnapshot | null> {
  const connection = await prisma.whoopConnection.findUnique({ where: { userId } });
  if (!connection) return null;

  try {
    const accessToken = await getValidAccessToken(connection);
    const [recovery, sleep] = await Promise.all([
      fetchLatestRecovery(accessToken),
      fetchLatestSleep(accessToken),
    ]);

    return {
      recoveryScore: recovery?.score?.recovery_score ?? null,
      restingHeartRate: recovery?.score?.resting_heart_rate ?? null,
      sleepPerformancePct: sleep?.score?.sleep_performance_percentage ?? null,
    };
  } catch (error) {
    logError("whoop-dashboard-snapshot", error, { userId });
    return null;
  }
}

export async function syncWhoopWorkouts(userId: string): Promise<{ imported: number }> {
  const connection = await prisma.whoopConnection.findUnique({ where: { userId } });
  if (!connection) {
    return { imported: 0 };
  }

  const accessToken = await getValidAccessToken(connection);
  const since = connection.lastSyncedAt ?? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  let imported = 0;
  try {
    const workouts = await fetchRecentWorkouts(accessToken, since);
    for (const workout of workouts) {
      if (workout.score_state !== "SCORED") continue;
      const existing = await prisma.trainingSession.findUnique({
        where: { whoopWorkoutId: workout.id },
      });
      if (existing) continue;

      const data = mapWorkoutToTraining(workout);
      await prisma.trainingSession.create({
        data: { ...data, userId },
      });
      imported++;
    }
  } catch (error) {
    logError("whoop-sync", error, { userId });
    throw error;
  }

  await prisma.whoopConnection.update({
    where: { userId },
    data: { lastSyncedAt: new Date() },
  });

  return { imported };
}
