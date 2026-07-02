type ErrorContext = Record<string, string | number | boolean | null | undefined>;

// Strukturiertes Error-Logging: erscheint als durchsuchbares JSON in den
// Vercel Runtime-Logs (Settings/Logs-Tab), ohne einen externen Dienst wie
// Sentry zu benötigen.
export function logError(scope: string, error: unknown, context?: ErrorContext) {
  const payload = {
    level: "error",
    scope,
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    context,
    timestamp: new Date().toISOString(),
  };

  console.error(JSON.stringify(payload));
}
