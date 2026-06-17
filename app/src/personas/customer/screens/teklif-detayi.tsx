import { Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  Car,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Heart,
  Share2,
  Sparkles,
  Star,
} from "lucide-react";
import { getModel } from "@/data/arac-taksonomisi";
import { MobileShell } from "../mobile-shell";

const tiguan = getModel("volkswagen", "tiguan");
const tiguanName = `Volkswagen ${tiguan?.model ?? "Tiguan"}`;
const tiguanVariant = `1.5 TSI ${tiguan?.varyantlar[0] ?? "1.5 TSI"} Life DSG`;
const aracSpec = "2022 · SUV · Otomatik · Benzin";

const KEY_STATS = [
  { label: "Faiz Oranı", value: "%1,89" },
  { label: "Aylık Taksit", value: "₺16.250" },
  { label: "Toplam Teklif Tutarı", value: "₺975.000" },
  { label: "Onay Şansı", value: "Yüksek", accent: true },
];

interface OzetSatir {
  label: string;
  value: string;
}

const TEKLIF_OZETI: OzetSatir[] = [
  { label: "Kredi Tutarı", value: "₺800.000" },
  { label: "Finansman", value: "Taşıt Kredisi" },
  { label: "Vade", value: "48 Ay" },
  { label: "Faiz Oranı", value: "%1,89" },
  { label: "Aylık Taksit", value: "₺16.250" },
  { label: "Toplam Geri Ödeme", value: "₺975.000" },
  { label: "Tahsis Ücreti", value: "₺9.500" },
  { label: "İlk Taksit Tarihi", value: "16 Haziran 2026" },
];

interface OdemeSatir {
  ay: string;
  id: string;
  tarih: string;
  tutar: string;
}

const ODEME_PLANI: OdemeSatir[] = [
  { id: "ay1", ay: "1. Ay", tarih: "16 Tem 2026", tutar: "₺16.250" },
  { id: "ay2", ay: "2. Ay", tarih: "16 Ağu 2026", tutar: "₺16.250" },
  { id: "ay3", ay: "3. Ay", tarih: "16 Eyl 2026", tutar: "₺16.250" },
  { id: "ay4", ay: "4. Ay", tarih: "16 Eki 2026", tutar: "₺16.250" },
  { id: "ay5", ay: "5. Ay", tarih: "16 Kas 2026", tutar: "₺16.250" },
  { id: "ay6", ay: "6. Ay", tarih: "16 Ara 2026", tutar: "₺16.250" },
];

function BottomBar() {
  return (
    <div className="flex items-center gap-3 border-line border-t bg-surface px-5 pt-3 pb-5">
      <Link
        className="flex h-12 flex-[1.6] items-center justify-center gap-1.5 rounded-2xl bg-cust font-semibold text-[15px] text-white shadow-[0_8px_20px_rgba(89,101,240,0.35)]"
        to="/musteri/basvuru-durumu"
      >
        Hemen Başvur <ChevronRight size={17} strokeWidth={2.2} />
      </Link>
      <Link
        className="flex h-12 flex-1 items-center justify-center rounded-2xl bg-cust-tint font-semibold text-[13.5px] text-cust-600"
        to="/musteri/tekliflerim"
      >
        Teklif Karşılaştır
      </Link>
    </div>
  );
}

export function CustomerTeklifDetayi() {
  return (
    <MobileShell bottomBar={<BottomBar />}>
      <div className="flex flex-col gap-4 pb-6">
        {/* back-header */}
        <div className="flex items-center justify-between px-5 py-3">
          <Link
            className="flex size-9 items-center justify-center rounded-full bg-surface text-ink-soft shadow-[var(--shadow-card)]"
            to="/musteri/tekliflerim"
          >
            <ChevronLeft size={20} strokeWidth={2.1} />
          </Link>
          <span className="font-bold text-[16px] text-ink">Teklif Detayı</span>
          <div className="flex items-center gap-2">
            <button
              className="flex size-9 items-center justify-center rounded-full bg-surface text-ink-soft shadow-[var(--shadow-card)]"
              type="button"
            >
              <Share2 size={17} strokeWidth={1.9} />
            </button>
            <button
              className="flex size-9 items-center justify-center rounded-full bg-surface text-ink-soft shadow-[var(--shadow-card)]"
              type="button"
            >
              <Heart size={17} strokeWidth={1.9} />
            </button>
          </div>
        </div>

        {/* hero */}
        <div className="px-5">
          <div className="flex gap-3.5">
            <div className="relative size-[104px] shrink-0 overflow-hidden rounded-2xl bg-canvas">
              <span className="flex size-full items-center justify-center text-ink-muted">
                <Car size={44} strokeWidth={1.3} />
              </span>
              <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-success px-2 py-0.5 font-semibold text-[9.5px] text-white">
                <BadgeCheck size={11} strokeWidth={2.2} /> En Uygun Teklif
              </span>
            </div>
            <div className="flex flex-1 flex-col justify-center">
              <div className="font-bold text-[18px] text-ink leading-tight">
                {tiguanName}
              </div>
              <div className="text-[12.5px] text-ink-soft">{tiguanVariant}</div>
              <div className="mt-1 text-[11px] text-ink-muted">{aracSpec}</div>
              <div className="mt-2 flex items-center gap-2">
                <span className="font-semibold text-[12.5px] text-ink">
                  Kaya Otomotiv
                </span>
                <span className="inline-flex items-center gap-0.5 rounded-full bg-warn-tint px-1.5 py-0.5 font-semibold text-[10.5px] text-warn">
                  <Star fill="currentColor" size={10} /> 4.8
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* key stats */}
        <div className="px-5">
          <div className="grid grid-cols-4 divide-x divide-line rounded-2xl bg-surface py-3 shadow-[var(--shadow-card)]">
            {KEY_STATS.map((s) => (
              <div className="px-1.5 text-center" key={s.label}>
                <div
                  className={`font-bold text-[14px] ${s.accent ? "text-success" : "text-ink"}`}
                >
                  {s.value}
                </div>
                <div className="mt-0.5 text-[9.5px] text-ink-muted leading-tight">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* purple info card */}
        <div className="px-5">
          <div className="flex items-start gap-3 rounded-2xl bg-cust-tint p-3.5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-cust/15 text-cust">
              <Sparkles size={18} strokeWidth={1.9} />
            </span>
            <div className="flex-1">
              <p className="text-[12px] text-ink-soft leading-5">
                Bu teklif, kredi profiline göre en uygun olarak işaretlendi.
              </p>
              <button
                className="mt-1 inline-flex items-center gap-1 font-semibold text-[12px] text-cust"
                type="button"
              >
                Neden En Uygun? <ChevronRight size={14} strokeWidth={2.2} />
              </button>
            </div>
          </div>
        </div>

        {/* teklif özeti */}
        <div className="px-5">
          <div className="rounded-2xl bg-surface p-4 shadow-[var(--shadow-card)]">
            <div className="mb-2 font-semibold text-[14px] text-ink">
              Teklif Özeti
            </div>
            <dl className="divide-y divide-line">
              {TEKLIF_OZETI.map((row) => (
                <div
                  className="flex items-center justify-between py-2.5"
                  key={row.label}
                >
                  <dt className="text-[12.5px] text-ink-soft">{row.label}</dt>
                  <dd className="font-semibold text-[13px] text-ink">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* ödeme planı */}
        <div className="px-5">
          <div className="rounded-2xl bg-surface p-4 shadow-[var(--shadow-card)]">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-semibold text-[14px] text-ink">
                Ödeme Planı (İlk 6 Ay)
              </span>
              <Link
                className="font-semibold text-[12px] text-cust"
                to="/musteri/basvuru-durumu"
              >
                Tümünü Gör
              </Link>
            </div>
            <div className="divide-y divide-line">
              {ODEME_PLANI.map((row) => (
                <div
                  className="flex items-center justify-between py-2.5"
                  key={row.id}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-7 items-center justify-center rounded-lg bg-cust-tint font-semibold text-[10.5px] text-cust-600">
                      {row.ay.replace(". Ay", "")}
                    </span>
                    <div>
                      <div className="font-medium text-[12.5px] text-ink">
                        {row.ay}
                      </div>
                      <div className="text-[10.5px] text-ink-muted">
                        {row.tarih}
                      </div>
                    </div>
                  </div>
                  <span className="font-semibold text-[13px] text-ink">
                    {row.tutar}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* erken başvuru countdown */}
        <div className="px-5">
          <div className="flex items-center gap-3 rounded-2xl bg-success-tint p-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-success/15 text-success">
              <CheckCircle2 size={20} strokeWidth={1.9} />
            </span>
            <div className="flex-1">
              <div className="font-semibold text-[13.5px] text-ink">
                Erken başvuru avantajı
              </div>
              <div className="text-[11px] text-ink-soft leading-4">
                Kredinin yenileme döneminde başvur, ek faiz indirimi kazan.
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 font-bold text-[16px] text-success">
                <Clock size={14} strokeWidth={2.1} /> 03:18:42
              </div>
              <div className="text-[9px] text-ink-muted">Süre kaldı</div>
            </div>
          </div>
        </div>
      </div>
    </MobileShell>
  );
}
