import { useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { useAuth } from "@/auth/auth-context";
import { type Role, ROLE_HOME, ROLE_LABEL } from "@/data/users";

const ROLES: { dot: string; role: Role }[] = [
  { role: "banka", dot: "bg-bank" },
  { role: "bayi", dot: "bg-dealer" },
  { role: "musteri", dot: "bg-cust" },
];

/**
 * Demo account switcher. Unlike the old free jump, switching re-authenticates
 * as the chosen role (loginAs), so RBAC stays enforced. Hidden when logged out.
 */
export function PersonaSwitcher() {
  const { user, loginAs, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-1 rounded-full border border-line-strong bg-surface/95 p-1 shadow-[0_8px_24px_rgba(15,23,42,0.16)] backdrop-blur">
      <span className="px-2 font-semibold text-[10px] text-ink-muted uppercase tracking-wide">
        Demo
      </span>
      {ROLES.map((p) => {
        const active = user.role === p.role;
        return (
          <button
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 font-semibold text-[12.5px] transition-colors ${
              active ? "bg-canvas text-ink" : "text-ink-soft hover:bg-canvas/60"
            }`}
            key={p.role}
            onClick={() => {
              if (!active) {
                loginAs(p.role);
                navigate({ to: ROLE_HOME[p.role] });
              }
            }}
            type="button"
          >
            <span className={`size-2 rounded-full ${p.dot}`} />
            {ROLE_LABEL[p.role]}
          </button>
        );
      })}
      <span className="mx-0.5 h-5 w-px bg-line-strong" />
      <button
        aria-label="Çıkış yap"
        className="flex size-7 items-center justify-center rounded-full text-ink-soft hover:bg-canvas hover:text-danger"
        onClick={() => {
          logout();
          navigate({ to: "/login" });
        }}
        title="Çıkış yap"
        type="button"
      >
        <LogOut size={15} strokeWidth={2} />
      </button>
    </div>
  );
}
