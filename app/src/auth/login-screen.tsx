import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { Landmark, LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { DEMO_ACCOUNTS, ROLE_HOME, ROLE_LABEL, type Role } from "@/data/users";
import { useAuth } from "./auth-context";

const schema = z.object({
  email: z.email("Geçerli bir e-posta girin"),
  password: z.string().min(1, "Şifre gerekli"),
});

type FormValues = z.infer<typeof schema>;

const ROLE_DOT: Record<Role, string> = {
  banka: "bg-bank",
  raporlama: "bg-bank-700",
  bayi: "bg-dealer",
  musteri: "bg-cust",
  executive: "bg-[#0b2545]",
};

export function LoginScreen() {
  const { login, loginAs } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async ({ email, password }) => {
    try {
      const user = await login(email, password);
      navigate({ to: ROLE_HOME[user.role] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Giriş başarısız.");
    }
  });

  function quickLogin(role: Role) {
    const user = loginAs(role);
    navigate({ to: ROLE_HOME[user.role] });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-[400px]">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <Landmark className="text-bank" size={34} strokeWidth={2} />
          <div className="font-bold text-[18px] text-ink tracking-tight">
            Yenileme Platformu
          </div>
        </div>

        <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-[var(--shadow-card)]">
          <h1 className="font-bold text-[18px] text-ink">Giriş Yap</h1>
          <p className="mt-1 text-[12.5px] text-ink-muted">
            Hesabınla giriş yap veya demo bir rol seç.
          </p>

          <form className="mt-5 flex flex-col gap-4" onSubmit={onSubmit}>
            <div>
              <label
                className="mb-1.5 block font-medium text-[12.5px] text-ink-soft"
                htmlFor="email"
              >
                E-posta
              </label>
              <input
                autoComplete="email"
                className="w-full rounded-[10px] border border-line-strong bg-surface px-3 py-2.5 text-[13.5px] text-ink outline-none placeholder:text-ink-muted focus:border-bank"
                id="email"
                placeholder="ornek@eposta.com"
                type="email"
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-[11.5px] text-danger">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                className="mb-1.5 block font-medium text-[12.5px] text-ink-soft"
                htmlFor="password"
              >
                Şifre
              </label>
              <input
                autoComplete="current-password"
                className="w-full rounded-[10px] border border-line-strong bg-surface px-3 py-2.5 text-[13.5px] text-ink outline-none placeholder:text-ink-muted focus:border-bank"
                id="password"
                placeholder="••••••••"
                type="password"
                {...register("password")}
              />
              {errors.password && (
                <p className="mt-1 text-[11.5px] text-danger">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              className="flex h-11 items-center justify-center gap-2 rounded-[10px] bg-bank font-semibold text-[14px] text-white hover:bg-bank-600 disabled:opacity-60"
              disabled={isSubmitting}
              type="submit"
            >
              <LogIn size={17} strokeWidth={2} />
              {isSubmitting ? "Giriş yapılıyor…" : "Giriş Yap"}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-line" />
            <span className="text-[11px] text-ink-muted">veya demo olarak gir</span>
            <span className="h-px flex-1 bg-line" />
          </div>

          <div className="flex flex-col gap-2">
            {DEMO_ACCOUNTS.map((a) => (
              <button
                className="flex items-center gap-3 rounded-[10px] border border-line-strong bg-surface px-3.5 py-2.5 text-left hover:bg-canvas"
                key={a.role}
                onClick={() => quickLogin(a.role)}
                type="button"
              >
                <span className={`size-2.5 rounded-full ${ROLE_DOT[a.role]}`} />
                <span className="flex-1">
                  <span className="block font-semibold text-[13px] text-ink">
                    {ROLE_LABEL[a.role]} olarak gir
                  </span>
                  <span className="block text-[11px] text-ink-muted">
                    {a.name} · {a.email}
                  </span>
                </span>
              </button>
            ))}
          </div>

          <p className="mt-4 text-center text-[11px] text-ink-muted">
            Demo şifresi: <span className="font-semibold text-ink-soft">demo1234</span>
          </p>
        </div>
      </div>
    </div>
  );
}
