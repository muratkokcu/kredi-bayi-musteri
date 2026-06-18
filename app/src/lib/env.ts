import { z } from "zod";

/**
 * Validated, typed environment config. Parsed once at module load so a
 * misconfigured deploy fails fast (before the app renders) instead of
 * surfacing as confusing runtime behavior.
 *
 * Only `VITE_`-prefixed vars are exposed to the client by Vite. See
 * `.env.example` for the full list and defaults.
 */
const schema = z.object({
  /** Base URL the (currently simulated) API client targets. */
  VITE_API_URL: z.string().default("/api"),
  /** Artificial latency for the fake service layer, in ms (roadmap 0.2). */
  VITE_API_DELAY_MS: z.coerce.number().int().nonnegative().default(450),
  /** Probability [0,1] that a simulated request fails (for testing error UX). */
  VITE_API_ERROR_RATE: z.coerce.number().min(0).max(1).default(0),
  /** Deployment target — drives env-specific behavior (telemetry, banners…). */
  VITE_APP_ENV: z
    .enum(["development", "staging", "production"])
    .default("development"),
});

const parsed = schema.safeParse(import.meta.env);

if (!parsed.success) {
  const issues = z.flattenError(parsed.error).fieldErrors;
  // biome-ignore lint/suspicious/noConsole: surfacing fatal misconfig at boot.
  console.error("Geçersiz ortam değişkenleri:", issues);
  throw new Error(
    "Ortam değişkenleri doğrulanamadı — .env dosyanı kontrol et (src/lib/env.ts)."
  );
}

export const env = parsed.data;
export type Env = typeof env;
