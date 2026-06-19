import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { accountByRole, type Role, toUser, type User } from "@/data/users";
import { login as loginService } from "@/services/auth";

const STORAGE_KEY = "kbm.auth.user";

interface AuthValue {
  /** Validates credentials (throws on failure), then starts a session. */
  login: (email: string, password: string) => Promise<User>;
  /** Demo shortcut: start a session as a role without a password. */
  loginAs: (role: Role) => User;
  logout: () => void;
  user: User | null;
}

const AuthContext = createContext<AuthValue | null>(null);

function readStored(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Session restored synchronously from localStorage — no auth flash on refresh.
  const [user, setUser] = useState<User | null>(readStored);

  const persist = useCallback((next: User | null) => {
    setUser(next);
    if (next) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const next = await loginService(email, password);
      persist(next);
      return next;
    },
    [persist]
  );

  const loginAs = useCallback(
    (role: Role) => {
      const account = accountByRole(role);
      if (!account) {
        throw new Error(`Bilinmeyen rol: ${role}`);
      }
      const next = toUser(account);
      persist(next);
      return next;
    },
    [persist]
  );

  const logout = useCallback(() => persist(null), [persist]);

  const value = useMemo<AuthValue>(
    () => ({ user, login, loginAs, logout }),
    [user, login, loginAs, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
