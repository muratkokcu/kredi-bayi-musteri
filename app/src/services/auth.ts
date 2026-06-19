import { toUser, type User, verifyCredentials } from "@/data/users";
import { ApiError, simulate } from "./client";

/**
 * Simulated login. Validates against the demo accounts after a fake round-trip.
 * Swap this for a real auth endpoint (token exchange) without touching the
 * auth context, route guards or login UI.
 */
export async function login(email: string, password: string): Promise<User> {
  await simulate(null);
  const account = verifyCredentials(email, password);
  if (!account) {
    throw new ApiError("E-posta veya şifre hatalı.");
  }
  return toUser(account);
}
