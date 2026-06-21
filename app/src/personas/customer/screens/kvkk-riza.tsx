import { useRouter } from "@tanstack/react-router";
import { ChevronLeft, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { MobileShell } from "../mobile-shell";

interface Purpose {
  desc: string;
  id: string;
  label: string;
  required: boolean;
}

const PURPOSES: Purpose[] = [
  {
    id: "kredi",
    label: "Kredi başvurumun değerlendirilmesi",
    desc: "Kimlik ve gelir bilgilerimin kredi uygunluk analizi için işlenmesine onay veriyorum.",
    required: true,
  },
  {
    id: "kkb",
    label: "KKB / Findeks kredi notu sorgusu",
    desc: "Kredi notumun ve risk raporumun sorgulanmasına onay veriyorum.",
    required: true,
  },
  {
    id: "pazarlama",
    label: "Kampanya ve pazarlama iletişimi",
    desc: "Bana özel teklif ve kampanyaların SMS / e-posta ile iletilmesine onay veriyorum.",
    required: false,
  },
  {
    id: "paylasim",
    label: "Grup şirketleriyle paylaşım",
    desc: "Verilerimin iş ortakları ve grup şirketleriyle paylaşılmasına onay veriyorum.",
    required: false,
  },
];

const INITIAL: Record<string, boolean> = Object.fromEntries(
  PURPOSES.map((p) => [p.id, false])
);

export function CustomerKvkkRiza() {
  const router = useRouter();
  const [accepted, setAccepted] = useState<Record<string, boolean>>(INITIAL);

  const requiredOk = PURPOSES.filter((p) => p.required).every(
    (p) => accepted[p.id]
  );

  function onApprove() {
    if (!requiredOk) {
      return;
    }
    toast.success("Açık rızanız zaman damgalı olarak kaydedildi.");
    router.history.back();
  }

  return (
    <MobileShell
      bottomBar={
        <div className="border-line border-t bg-surface px-5 pt-3 pb-5">
          {!requiredOk && (
            <p className="mb-2 text-center text-[11.5px] text-ink-muted">
              Devam etmek için zorunlu rızaları onaylayın.
            </p>
          )}
          <button
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-cust py-4 font-semibold text-[15px] text-white shadow-[0_10px_24px_rgba(89,101,240,0.35)] disabled:opacity-50"
            disabled={!requiredOk}
            onClick={onApprove}
            type="button"
          >
            <ShieldCheck size={18} strokeWidth={2.1} /> Açık Rızayı Onayla
          </button>
        </div>
      }
    >
      <div className="flex items-center gap-3 px-5 py-3">
        <button
          className="flex size-9 items-center justify-center rounded-full bg-surface text-ink-soft shadow-[var(--shadow-card)]"
          onClick={() => router.history.back()}
          type="button"
        >
          <ChevronLeft size={20} strokeWidth={2.2} />
        </button>
        <div>
          <div className="font-bold text-[16px] text-ink">KVKK Açık Rıza</div>
          <div className="text-[11px] text-ink-muted">
            Aydınlatma metni ve izin tercihlerin
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 px-5 pt-1 pb-6">
        <div className="rounded-2xl bg-surface p-4 shadow-[var(--shadow-card)]">
          <div className="mb-2 flex items-center gap-2">
            <ShieldCheck className="text-cust" size={18} strokeWidth={1.9} />
            <span className="font-semibold text-[14px] text-ink">
              Aydınlatma Metni
            </span>
          </div>
          <p className="text-[12px] text-ink-soft leading-5">
            6698 sayılı KVKK kapsamında, kredi başvurunuzun değerlendirilmesi
            amacıyla kimlik, iletişim ve finansal verileriniz veri sorumlusu
            tarafından işlenir. Verileriniz yasal saklama
            süresi boyunca güvenli biçimde saklanır ve süre sonunda imha edilir.
            Dilediğiniz zaman rızanızı geri çekebilirsiniz.
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          {PURPOSES.map((p) => (
            <label
              className="flex cursor-pointer items-start gap-3 rounded-2xl bg-surface p-3.5 shadow-[var(--shadow-card)]"
              key={p.id}
            >
              <Checkbox
                checked={accepted[p.id]}
                className="mt-0.5"
                onCheckedChange={(v) =>
                  setAccepted((s) => ({ ...s, [p.id]: v === true }))
                }
              />
              <span className="flex-1">
                <span className="flex items-center gap-2">
                  <span className="font-semibold text-[13px] text-ink">
                    {p.label}
                  </span>
                  {p.required ? (
                    <span className="rounded-full bg-cust-tint px-2 py-0.5 font-semibold text-[9.5px] text-cust-600">
                      Zorunlu
                    </span>
                  ) : (
                    <span className="rounded-full bg-canvas px-2 py-0.5 font-semibold text-[9.5px] text-ink-muted">
                      Opsiyonel
                    </span>
                  )}
                </span>
                <span className="mt-0.5 block text-[11.5px] text-ink-muted leading-4">
                  {p.desc}
                </span>
              </span>
            </label>
          ))}
        </div>

        <div className="text-center text-[10.5px] text-ink-muted">
          Aydınlatma metni v1.2 · Onayınız zaman damgalı kaydedilir
        </div>
      </div>
    </MobileShell>
  );
}
