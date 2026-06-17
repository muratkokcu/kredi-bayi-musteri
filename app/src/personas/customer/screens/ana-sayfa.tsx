import { Link } from "@tanstack/react-router";
import {
  Bell,
  Calculator,
  Car,
  ChevronRight,
  FileText,
  Heart,
  TrendingUp,
  User,
} from "lucide-react";
import { getModel } from "@/data/arac-taksonomisi";
import { MobileShell } from "../mobile-shell";

const tiguan = getModel("volkswagen", "tiguan");
const tiguanName = `Volkswagen ${tiguan?.model ?? "Tiguan"}`;
const tiguanVariant = `1.5 TSI · ${tiguan?.varyantlar[0] ?? "1.5 TSI"} DSG`;

const MINI_STATS = [
  { label: "Tekliflerim", value: "6", sub: "yeni teklif" },
  { label: "Araç Değerim", value: "₺1.125.000", sub: "Tahmini" },
  { label: "Aylık Ödemem", value: "₺18.750", sub: "Taksit" },
  { label: "Kredi Bitiş Tarihi", value: "15.08.2025", sub: "" },
];

const QUICK_ACTIONS = [
  { icon: FileText, label: "Teklifler", to: "/musteri/tekliflerim" },
  { icon: Car, label: "Araçlar", to: "/musteri/arac-tercihlerim" },
  { icon: Calculator, label: "Simülatör", to: "/musteri/simulator" },
  { icon: Heart, label: "Favoriler", to: "/musteri/tekliflerim" },
  { icon: FileText, label: "Belgeler", to: "/musteri/basvuru-durumu" },
];

function CountdownRing() {
  const size = 64;
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  const dash = 0.62 * c;
  return (
    <span
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        aria-hidden="true"
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        width={size}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={r}
          stroke="rgba(89,101,240,0.18)"
          strokeWidth={6}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={r}
          stroke="var(--color-cust)"
          strokeDasharray={`${dash} ${c}`}
          strokeLinecap="round"
          strokeWidth={6}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className="absolute text-center leading-none">
        <span className="block font-bold text-[20px] text-cust">4</span>
        <span className="block text-[8px] text-ink-muted">AY KALDI</span>
      </span>
    </span>
  );
}

export function CustomerAnaSayfa() {
  return (
    <MobileShell tab="Ana Sayfa">
      <div className="flex flex-col gap-4 px-5 pt-2 pb-6">
        {/* header */}
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-full bg-cust-tint font-bold text-[14px] text-cust-600">
            MK
          </span>
          <div className="flex-1">
            <div className="font-bold text-[16px] text-ink">
              Merhaba, Mehmet Kaya 👋
            </div>
            <div className="text-[12px] text-ink-muted">
              Kredi yenileme fırsatınız hazırlandı.
            </div>
          </div>
          <button
            className="relative flex size-9 items-center justify-center rounded-full bg-surface text-ink-soft"
            type="button"
          >
            <Bell size={18} strokeWidth={1.9} />
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-danger" />
          </button>
          <button
            className="flex size-9 items-center justify-center rounded-full bg-surface text-ink-soft"
            type="button"
          >
            <User size={18} strokeWidth={1.9} />
          </button>
        </div>

        {/* countdown */}
        <div className="flex items-center gap-4 rounded-2xl bg-cust-tint p-4">
          <div className="flex size-10 items-center justify-center rounded-xl bg-cust/15 text-cust">
            <Calculator size={20} strokeWidth={1.9} />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-[14px] text-ink">
              Kredine <span className="text-cust">4 ay</span> kaldı
            </div>
            <div className="text-[11.5px] text-ink-soft leading-4">
              Yenileme fırsatları seni bekliyor. Şimdi inceleyip avantajlı
              faizlerden faydalanabilirsin.
            </div>
          </div>
          <CountdownRing />
          <ChevronRight className="text-ink-muted" size={18} />
        </div>

        {/* mini stats 2x2 */}
        <div className="grid grid-cols-2 gap-3">
          {MINI_STATS.map((s) => (
            <div
              className="rounded-2xl bg-surface p-3.5 shadow-[var(--shadow-card)]"
              key={s.label}
            >
              <div className="text-[11.5px] text-ink-muted">{s.label}</div>
              <div className="mt-1 font-bold text-[17px] text-ink">
                {s.value}
              </div>
              {s.sub && (
                <div className="text-[10.5px] text-cust-600">{s.sub}</div>
              )}
            </div>
          ))}
        </div>

        {/* current loan */}
        <div className="rounded-2xl bg-surface p-4 shadow-[var(--shadow-card)]">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-semibold text-[14px] text-ink">
              Mevcut Kredi Bilgileri
            </span>
            <Link
              className="font-semibold text-[12px] text-cust"
              to="/musteri/basvuru-durumu"
            >
              Detayları Gör
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex h-14 w-20 items-center justify-center rounded-xl bg-canvas text-ink-muted">
              <Car size={26} strokeWidth={1.6} />
            </span>
            <div>
              <div className="font-semibold text-[14px] text-ink">
                {tiguanName}
              </div>
              <div className="text-[11.5px] text-ink-muted">
                {tiguanVariant}
              </div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 border-line border-t pt-3 text-center">
            <div>
              <div className="text-[10.5px] text-ink-muted">Kalan Borç</div>
              <div className="font-bold text-[13px] text-ink">₺425.000</div>
            </div>
            <div>
              <div className="text-[10.5px] text-ink-muted">Faiz Oranı</div>
              <div className="font-bold text-[13px] text-ink">%1,89</div>
            </div>
            <div>
              <div className="text-[10.5px] text-ink-muted">Aylık Taksit</div>
              <div className="font-bold text-[13px] text-ink">₺18.750</div>
            </div>
          </div>
        </div>

        {/* personalized offers (dark) */}
        <div className="rounded-2xl bg-cust-ink p-4 text-white">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[12px] text-white/70">Sana özel</div>
              <div className="font-bold text-[22px]">6 teklif</div>
              <div className="text-[11.5px] text-white/70">
                en iyi faiz oranlarıyla seni bekliyor
              </div>
              <Link
                className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 font-semibold text-[12.5px] text-cust-ink"
                to="/musteri/tekliflerim"
              >
                Teklifleri Gör <ChevronRight size={14} />
              </Link>
            </div>
            <div className="w-[120px] shrink-0 rounded-xl bg-white/10 p-2.5">
              <div className="font-semibold text-[10px] text-emerald-300">
                En Uygun
              </div>
              <div className="mt-0.5 text-[11px] text-white/80">
                Kaya Otomotiv
              </div>
              <div className="font-bold text-[18px]">%1,89</div>
              <div className="text-[10px] text-white/60">Faiz Oranı</div>
              <div className="mt-1 font-semibold text-[12px]">₺16.250</div>
            </div>
          </div>
        </div>

        {/* market value + simulator */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-surface p-3.5 shadow-[var(--shadow-card)]">
            <div className="text-[11.5px] text-ink-muted">
              Aracının Piyasa Değeri
            </div>
            <div className="mt-1 font-bold text-[16px] text-ink">
              ₺1.125.000
            </div>
            <div className="mt-1 flex items-center gap-1 text-[11px] text-success">
              <TrendingUp size={13} /> %3,2
            </div>
          </div>
          <Link
            className="flex flex-col rounded-2xl bg-surface p-3.5 shadow-[var(--shadow-card)]"
            to="/musteri/simulator"
          >
            <div className="flex size-9 items-center justify-center rounded-xl bg-cust-tint text-cust">
              <Calculator size={18} strokeWidth={1.9} />
            </div>
            <div className="mt-2 font-semibold text-[13px] text-ink">
              Kredi Simülatörü
            </div>
            <div className="text-[10.5px] text-ink-muted">
              Farklı vade ve tutarlarla simülasyon yap
            </div>
          </Link>
        </div>

        {/* quick actions */}
        <div>
          <div className="mb-2 font-semibold text-[14px] text-ink">
            Hızlı İşlemler
          </div>
          <div className="flex justify-between">
            {QUICK_ACTIONS.map((a) => (
              <Link
                className="flex flex-1 flex-col items-center gap-1.5"
                key={a.label}
                to={a.to}
              >
                <span className="flex size-12 items-center justify-center rounded-2xl bg-surface text-cust shadow-[var(--shadow-card)]">
                  <a.icon size={20} strokeWidth={1.9} />
                </span>
                <span className="text-[10.5px] text-ink-soft">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </MobileShell>
  );
}
