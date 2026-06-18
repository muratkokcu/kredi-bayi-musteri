import { env } from "@/lib/env";

/**
 * Fake service layer (roadmap 0.2). Every request goes through `simulate`,
 * which models a network round-trip: it waits `VITE_API_DELAY_MS` and then,
 * with probability `VITE_API_ERROR_RATE`, rejects — so loading and error UX
 * are exercised exactly as they would be against a real backend.
 *
 * When a real API exists (roadmap 2.1), replace ONLY this module with a fetch
 * client; service modules and query hooks stay unchanged.
 */

export class ApiError extends Error {
  constructor(message = "İstek başarısız oldu. Lütfen tekrar deneyin.") {
    super(message);
    this.name = "ApiError";
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/** Resolves with `data` after the configured delay, or rejects per error rate. */
export async function simulate<T>(data: T): Promise<T> {
  await sleep(env.VITE_API_DELAY_MS);
  if (env.VITE_API_ERROR_RATE > 0 && Math.random() < env.VITE_API_ERROR_RATE) {
    throw new ApiError();
  }
  return data;
}
