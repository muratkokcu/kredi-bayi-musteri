import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// env is parsed at module load, so reset modules + stub env before each import.
beforeEach(() => {
  vi.resetModules();
  vi.stubEnv("VITE_API_DELAY_MS", "0");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("simulate", () => {
  it("resolves with the original data when no error is injected", async () => {
    vi.stubEnv("VITE_API_ERROR_RATE", "0");
    const { simulate } = await import("./client");
    await expect(simulate([1, 2, 3])).resolves.toEqual([1, 2, 3]);
  });

  it("rejects with ApiError when the error rate is 1", async () => {
    vi.stubEnv("VITE_API_ERROR_RATE", "1");
    const { simulate, ApiError } = await import("./client");
    await expect(simulate("x")).rejects.toBeInstanceOf(ApiError);
  });
});
