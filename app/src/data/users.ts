/**
 * Demo identities for the simulated auth/RBAC layer. Roles map 1:1 to personas.
 * A real backend would replace src/services/auth + token handling; this file,
 * the context, guards and login UI stay the same.
 */
export type Role = "banka" | "raporlama" | "bayi" | "musteri";

export interface User {
  email: string;
  id: string;
  initials: string;
  name: string;
  org?: string;
  role: Role;
  title: string;
}

interface DemoAccount extends User {
  password: string;
}

/** Each role's landing route after login. `as const` keeps paths typed for the router. */
export const ROLE_HOME = {
  banka: "/banka/dashboard",
  raporlama: "/raporlama/uretim-karlilik",
  bayi: "/bayi/ana-sayfa",
  musteri: "/musteri/ana-sayfa",
} as const;

export const ROLE_LABEL: Record<Role, string> = {
  banka: "Banka",
  raporlama: "Raporlama",
  bayi: "Bayi",
  musteri: "Müşteri",
};

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    id: "u-banka",
    role: "banka",
    name: "Ahmet Kaya",
    title: "Yönetici",
    org: "Banka",
    email: "banka@demo.com",
    initials: "AK",
    password: "demo1234",
  },
  {
    id: "u-raporlama",
    role: "raporlama",
    name: "Selin Demir",
    title: "Raporlama Uzmanı",
    org: "Banka",
    email: "raporlama@demo.com",
    initials: "SD",
    password: "demo1234",
  },
  {
    id: "u-bayi",
    role: "bayi",
    name: "Mehmet Kaya",
    title: "Bayi Yetkilisi",
    org: "Bayi",
    email: "bayi@demo.com",
    initials: "MK",
    password: "demo1234",
  },
  {
    id: "u-musteri",
    role: "musteri",
    name: "Elif Yıldız",
    title: "Müşteri",
    email: "musteri@demo.com",
    initials: "EY",
    password: "demo1234",
  },
];

/** Public (session-safe) user — strips the password from a demo account. */
export function toUser(account: DemoAccount): User {
  return {
    id: account.id,
    role: account.role,
    name: account.name,
    title: account.title,
    org: account.org,
    email: account.email,
    initials: account.initials,
  };
}

export function accountByRole(role: Role): DemoAccount | undefined {
  return DEMO_ACCOUNTS.find((a) => a.role === role);
}

export function verifyCredentials(
  email: string,
  password: string
): DemoAccount | undefined {
  const normalized = email.trim().toLocaleLowerCase("tr");
  return DEMO_ACCOUNTS.find(
    (a) => a.email.toLocaleLowerCase("tr") === normalized && a.password === password
  );
}
