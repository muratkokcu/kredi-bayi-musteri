/**
 * Executive Dealer Performance Dashboard — Genel Müdür için tek sayfa, shell'siz,
 * yatay A4 PDF'e sığacak şekilde tasarlanmış üst-yönetim özeti. Tüm metrikler
 * mevcut veri setlerinden (production-loans, applications, risk-watch, limits)
 * türetilir.
 */
import { AlertTriangle, Calendar, ChevronDown, Info, Printer, ShieldAlert } from "lucide-react";
import { useMemo } from "react";
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { useApplications } from "@/queries/applications";
import { useLimits } from "@/queries/limits";
import { useProductionLoans } from "@/queries/production-loans";
import { useRiskContracts } from "@/queries/risk-watch";
import { LoadingState } from "@/ui/async-states";
import { TurkeyChoropleth } from "@/ui/turkey-choropleth";
import {
  computeExec,
  fmtMn,
  fmtPct,
  Gauge,
  ScoreRow,
  Section,
  Sparkline,
} from "../exec-kit";

const NPL_SHADES = ["#dcfce7", "#fde68a", "#fb923c", "#ef4444", "#b91c1c"];
const SCATTER_FILL: Record<string, string> = { high: "#16a34a", mid: "#f59e0b", low: "#ef4444" };

const FILTERS = [
  "Bölge", "İl", "Distribütör", "Marka", "Bayi", "Sektör", "Bireysel / Ticari",
];

export function ExecutiveDashboard() {
  const loans = useProductionLoans();
  const apps = useApplications();
  const risks = useRiskContracts();
  const limits = useLimits();

  const ready = loans.data && apps.data && risks.data && limits.data;
  const d = useMemo(
    () => (ready ? computeExec(loans.data!, apps.data!, risks.data!, limits.data!) : null),
    [ready, loans.data, apps.data, risks.data, limits.data]
  );

  if (!d) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <LoadingState />
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-auto bg-slate-200 py-5">
      {/* eslint-disable-next-line react/no-unknown-property */}
      <style>{`
        @media print {
          @page { size: A4 landscape; margin: 0; }
          html, body { background: #fff !important; }
          body * { visibility: hidden; }
          .exec-print, .exec-print * { visibility: visible; }
          .exec-print { position: absolute; left: 0; top: 0; transform: scale(0.757); transform-origin: top left; box-shadow: none !important; }
          .exec-noprint { display: none !important; }
          .exec-print { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      <div className="mx-auto w-fit">
        <div className="mb-2 flex justify-end">
          <button
            className="exec-noprint flex items-center gap-2 rounded-lg bg-[#0b2545] px-4 py-2 font-semibold text-[13px] text-white shadow hover:bg-[#13315c]"
            onClick={() => window.print()}
            type="button"
          >
            <Printer size={15} /> PDF / Yazdır (A4 Yatay)
          </button>
        </div>

        <div
          className="exec-print flex w-[1480px] flex-col gap-2 bg-slate-100 p-3 shadow-[0_10px_40px_rgba(2,12,40,0.25)]"
          style={{ ["-webkit-print-color-adjust" as string]: "exact" }}
        >
          {/* ---------------- Header ---------------- */}
          <header className="flex items-center justify-between rounded-lg bg-[#0b2545] px-4 py-2.5">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 rounded-md bg-white px-2 py-1">
                <span className="font-extrabold text-[15px] text-[#0b2545] italic tracking-tight">QUICK</span>
                <span className="font-bold text-[10px] text-[#ea580c] uppercase">Finans</span>
              </span>
              <div className="leading-tight">
                <div className="font-bold text-[17px] text-white tracking-wide">
                  EXECUTIVE DEALER PERFORMANCE DASHBOARD
                </div>
                <div className="font-medium text-[11px] text-sky-200 tracking-wide">OTO KREDİ FİNANSMAN</div>
              </div>
            </div>
            <div className="text-right text-[11px] text-slate-300">Son Güncelleme: 20.05.2025 09:30</div>
          </header>

          {/* ---------------- Filtre çubuğu (snapshot, görsel) ---------------- */}
          <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-1.5">
            <FilterPill icon label="Tarih Aralığı" value="01.01.2025 - 20.05.2025" wide />
            {FILTERS.map((f) => (
              <FilterPill key={f} label={f} value="Tümü" />
            ))}
          </div>

          {/* ---------------- KPI satırı ---------------- */}
          <div className="grid grid-cols-8 gap-2">
            {d.kpis.map((k) => (
              <div className="rounded-lg border border-slate-200 bg-white px-2.5 py-2" key={k.label}>
                <div className="truncate font-bold text-[9px] tracking-wide" style={{ color: k.accent }}>
                  {k.label}
                </div>
                <div className="mt-0.5 flex items-baseline gap-1">
                  <span className="font-extrabold text-[20px] text-slate-800 leading-none tabular-nums">{k.value}</span>
                  {k.unit ? <span className="text-[9px] text-slate-400">{k.unit}</span> : null}
                </div>
                <div
                  className={`mt-0.5 font-bold text-[10px] ${k.up ? "text-emerald-600" : "text-red-500"}`}
                >
                  {k.up ? "▲" : "▼"} {k.delta}
                </div>
                <div className="mt-1">
                  <Sparkline color={k.accent} data={k.spark} />
                </div>
              </div>
            ))}
          </div>

          {/* ---------------- Üst grid: 1 / 2 / 3 ---------------- */}
          <div className="grid grid-cols-3 gap-2">
            {/* 1. HACİM ANALİZİ */}
            <Section accent="#1d4ed8" no={1} title="HACİM ANALİZİ">
              <div className="mb-1 flex items-center justify-between font-semibold text-[9px] text-slate-400 uppercase">
                <span>Top Bayi — Kredi Tutarı (Mn)</span>
                <span>Adet</span>
              </div>
              <div className="flex flex-col gap-1">
                {d.topBayi.map((b) => (
                  <div className="flex items-center gap-1.5" key={b.name}>
                    <span className="w-20 shrink-0 truncate text-[9.5px] text-slate-600">{b.name}</span>
                    <div className="relative h-3.5 flex-1 rounded bg-slate-100">
                      <div
                        className="flex h-full items-center justify-end rounded bg-[#1d4ed8] pr-1 font-bold text-[8px] text-white"
                        style={{ width: `${Math.max((b.hacim / d.hacimMaxBayi) * 100, 14)}%` }}
                      >
                        {fmtMn(b.hacim, 0)}
                      </div>
                    </div>
                    <span className="w-9 shrink-0 text-right font-semibold text-[9.5px] text-slate-500 tabular-nums">
                      {b.adet}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-2 font-semibold text-[9px] text-slate-400 uppercase">Hacim Dağılımı</div>
              <div className="mt-1 grid grid-cols-3 gap-2">
                {d.dagilim.map((col) => (
                  <div key={col.title}>
                    <div className="mb-1 font-bold text-[8.5px] text-slate-500">{col.title}</div>
                    <div className="flex flex-col gap-0.5">
                      {col.rows.map((r) => (
                        <div className="flex items-center justify-between gap-1" key={r.name}>
                          <span className="truncate text-[8.5px] text-slate-600">{r.name}</span>
                          <span className="font-semibold text-[8.5px] text-slate-700 tabular-nums">{fmtPct(r.pct, 1)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* 2. DÖNÜŞÜM ANALİZİ */}
            <Section accent="#0891b2" no={2} title="DÖNÜŞÜM ANALİZİ (FUNNEL)">
              <div className="flex flex-col items-center gap-1">
                {d.funnel.map((s, i) => (
                  <div className="flex w-full items-center gap-2" key={s.label}>
                    <span className="w-20 shrink-0 text-right font-semibold text-[9px] text-slate-500">{s.label}</span>
                    <div className="flex flex-1 justify-center">
                      <div
                        className="flex h-6 items-center justify-center rounded font-bold text-[10px] text-white tabular-nums"
                        style={{
                          width: `${100 - i * 15}%`,
                          background: i < 2 ? "#0e7490" : i < 4 ? "#0891b2" : "#10b981",
                        }}
                      >
                        {s.value.toLocaleString("tr-TR")}
                      </div>
                    </div>
                    <span className="w-10 shrink-0 font-bold text-[9.5px] text-slate-600 tabular-nums">{fmtPct(s.pct, 1)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 font-semibold text-[9px] text-slate-400 uppercase">Hacim Kayıp Analizi (Mn)</div>
              <Waterfall steps={d.waterfall} />
              <div className="mt-1.5 font-semibold text-[9px] text-slate-400 uppercase">Dönüşüm Oranları Trendi</div>
              <div className="h-[78px]">
                <ResponsiveContainer height="100%" width="100%">
                  <LineChart data={d.trend} margin={{ top: 6, right: 6, left: -22, bottom: 0 }}>
                    <CartesianGrid stroke="#eef2f7" vertical={false} />
                    <XAxis axisLine={false} dataKey="ay" tick={{ fill: "#94a3b8", fontSize: 8 }} tickLine={false} />
                    <YAxis tick={{ fill: "#94a3b8", fontSize: 8 }} tickLine={false} axisLine={false} width={28} />
                    <Line dataKey="onay" dot={false} name="Onay" stroke="#2563eb" strokeWidth={1.6} />
                    <Line dataKey="kullandirim" dot={false} name="Kullandırım" stroke="#16a34a" strokeWidth={1.6} />
                    <Line dataKey="tahsilat" dot={false} name="Tahsilat" stroke="#f59e0b" strokeWidth={1.6} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Section>

            {/* 3. KARLILIK ANALİZİ */}
            <Section accent="#7c3aed" no={3} title="KARLILIK ANALİZİ">
              <div className="font-semibold text-[9px] text-slate-400 uppercase">Net Karlılık Kırılımı (Mn)</div>
              <DivergingBars rows={d.karlilik} />
              <div className="mt-1.5 grid grid-cols-2 gap-2">
                <div>
                  <div className="font-semibold text-[9px] text-slate-400 uppercase">Faiz vs Net Karlılık</div>
                  <div className="h-[96px]">
                    <ResponsiveContainer height="100%" width="100%">
                      <ScatterChart margin={{ top: 6, right: 6, left: -24, bottom: -6 }}>
                        <CartesianGrid stroke="#eef2f7" />
                        <XAxis dataKey="faiz" domain={[2, 4]} tick={{ fill: "#94a3b8", fontSize: 8 }} tickLine={false} type="number" />
                        <YAxis dataKey="net" tick={{ fill: "#94a3b8", fontSize: 8 }} tickLine={false} width={26} />
                        <ZAxis dataKey="hacim" range={[20, 130]} type="number" />
                        <Scatter data={d.scatter}>
                          {d.scatter.map((s) => (
                            <Cell fill={SCATTER_FILL[s.tier]} fillOpacity={0.75} key={s.name} />
                          ))}
                        </Scatter>
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {d.etkinlik.map((e) => (
                    <div className="rounded border border-slate-100 bg-slate-50 px-1.5 py-1" key={e.label}>
                      <div className="text-[8px] text-slate-500 leading-tight">{e.label}</div>
                      <div className="font-bold text-[13px] text-slate-800 tabular-nums">{e.value}</div>
                      <div className={`text-[8px] font-semibold ${e.up ? "text-emerald-600" : "text-red-500"}`}>
                        {e.up ? "▲" : "▼"} {e.delta}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Section>
          </div>

          {/* ---------------- Alt grid: 4 / 5 / 6 ---------------- */}
          <div className="grid grid-cols-3 gap-2">
            {/* 4. RİSK ANALİZİ */}
            <Section accent="#dc2626" no={4} title="RİSK ANALİZİ">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="mb-1 font-semibold text-[9px] text-slate-400 uppercase">Risk KPI (Hedef vs Gerç.)</div>
                  <div className="flex flex-col gap-1.5">
                    {d.riskKpi.map((r) => (
                      <div key={r.label}>
                        <div className="flex items-center justify-between text-[9px]">
                          <span className="text-slate-600">{r.label}</span>
                          <span className={`font-bold tabular-nums ${r.bad ? "text-red-500" : "text-emerald-600"}`}>
                            {fmtPct(r.gercek, r.unit === "%" ? 1 : 0)}
                          </span>
                        </div>
                        <div className="relative mt-0.5 h-2 rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full ${r.bad ? "bg-red-500" : "bg-emerald-500"}`}
                            style={{ width: `${Math.min((r.gercek / (r.hedef * 1.6)) * 100, 100)}%` }}
                          />
                          <span
                            className="absolute top-[-1px] h-3 w-0.5 bg-slate-700"
                            style={{ left: `${Math.min((r.hedef / (r.hedef * 1.6)) * 100, 100)}%` }}
                          />
                        </div>
                        <div className="text-right text-[7.5px] text-slate-400">Hedef {r.hedef}{r.unit}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="mb-0.5 font-semibold text-[9px] text-slate-400 uppercase">NPL — Bölge Heatmap</div>
                  <TurkeyChoropleth
                    legendHigh="Kritik"
                    legendLow="İyi"
                    ratesByRegion={d.nplByRegion}
                    shades={NPL_SHADES}
                  />
                </div>
              </div>
            </Section>

            {/* 5. PENETRASYON & LİMİT */}
            <Section accent="#0d9488" no={5} title="PENETRASYON & LİMİT KULLANIMI">
              <div className="grid grid-cols-[auto_1fr] gap-2">
                <div className="flex flex-col justify-center gap-1.5 pr-2">
                  <Gauge color="#16a34a" label="Kredi Penet." sub={fmtPct(d.krediPenet, 1)} value={d.krediPenet} />
                  <Gauge color="#2563eb" label="Sigorta Penet." sub={fmtPct(d.sigortaPenet, 1)} value={d.sigortaPenet} />
                </div>
                <div>
                  <div className="mb-1 font-semibold text-[9px] text-slate-400 uppercase">Grup Limit Kullanımı (Mn)</div>
                  <div className="flex flex-col gap-1">
                    {d.limitBars.map((g) => (
                      <div key={g.name}>
                        <div className="flex items-center justify-between text-[8.5px]">
                          <span className="truncate text-slate-600">{g.name}</span>
                          <span className="font-bold text-slate-700 tabular-nums">{fmtPct(g.oran, 0)}</span>
                        </div>
                        <div className="h-2.5 overflow-hidden rounded bg-slate-100">
                          <div
                            className={`h-full ${g.oran >= 90 ? "bg-red-500" : g.oran >= 75 ? "bg-amber-500" : "bg-[#0d9488]"}`}
                            style={{ width: `${g.oran}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-2 rounded border border-slate-100">
                <div className="bg-slate-50 px-2 py-0.5 font-bold text-[8.5px] text-slate-500 uppercase">
                  Limiti %85 Üzeri Kullanan Gruplar
                </div>
                {d.limitAsiri.map((g) => (
                  <div className="flex items-center justify-between border-slate-100 border-t px-2 py-0.5 text-[9px]" key={g.name}>
                    <span className="truncate text-slate-600">{g.name}</span>
                    <span className="text-slate-500 tabular-nums">{fmtMn(g.limit, 0)} Mn</span>
                    <span className={`font-bold tabular-nums ${g.up ? "text-red-500" : "text-amber-600"}`}>
                      {g.up ? "▲" : "▼"} {fmtPct(g.oran, 0)}
                    </span>
                  </div>
                ))}
              </div>
            </Section>

            {/* 6. EXECUTIVE ALERTS & SKORLAR */}
            <Section accent="#0f172a" no={6} title="EXECUTIVE ALERTS & BAYİ SKORLARI">
              <div className="grid grid-cols-[1.3fr_1fr] gap-2">
                <div className="flex flex-col gap-1">
                  {d.alerts.map((a) => {
                    const Icon = a.sev === "danger" ? AlertTriangle : a.sev === "warn" ? ShieldAlert : Info;
                    const c = a.sev === "danger" ? "#dc2626" : a.sev === "warn" ? "#d97706" : "#0d9488";
                    return (
                      <div className="flex gap-1.5" key={a.title}>
                        <Icon className="mt-0.5 shrink-0" color={c} size={12} />
                        <div className="leading-tight">
                          <div className="font-semibold text-[9px] text-slate-700">{a.title}</div>
                          <div className="text-[8px] text-slate-400">{a.body}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="grid grid-rows-2 gap-1.5">
                  <div>
                    <div className="mb-0.5 font-bold text-[8.5px] text-slate-500 uppercase">Bayi Health Score</div>
                    <div className="flex flex-col gap-0.5">
                      {d.healthScores.map((s) => (
                        <ScoreRow key={s.name} name={s.name} score={s.score} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="mb-0.5 font-bold text-[8.5px] text-slate-500 uppercase">Opportunity Score</div>
                    <div className="flex flex-col gap-0.5">
                      {d.oppScores.map((s) => (
                        <ScoreRow key={s.name} name={s.name} score={s.score} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Section>
          </div>

          {/* ---------------- Footer ---------------- */}
          <div className="px-1 text-[8px] text-slate-400">
            Not: Tüm oranlar seçili filtrelere göre hesaplanmıştır. yp: yüzde puan | NPL: Takipteki Krediler Oranı
            (≥90 gün) | KT: Kanuni Takip Oranı | FPD 30+: İlk Taksit Gecikme Oranı · Veri kaynağı: production-loans,
            applications, risk-watch, limits.
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterPill({
  label,
  value,
  icon,
  wide,
}: {
  label: string;
  value: string;
  icon?: boolean;
  wide?: boolean;
}) {
  return (
    <div className={`flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 ${wide ? "" : "flex-1"}`}>
      <span className="font-semibold text-[9px] text-slate-400 uppercase">{label}</span>
      <span className="ml-auto flex items-center gap-1 font-semibold text-[10px] text-slate-700">
        {icon ? <Calendar className="text-slate-400" size={11} /> : null}
        {value}
        {icon ? null : <ChevronDown className="text-slate-400" size={11} />}
      </span>
    </div>
  );
}

/** Mini waterfall (hacim kaybı). */
function Waterfall({ steps }: { steps: { label: string; value: number; type: "total" | "down" }[] }) {
  const maxV = Math.max(...steps.map((s) => Math.abs(s.value)));
  let running = 0;
  const H = 60;
  return (
    <div className="flex h-[72px] items-end justify-between gap-1">
      {steps.map((s) => {
        const mag = (Math.abs(s.value) / maxV) * H;
        let topOffset = 0;
        if (s.type === "total") {
          running = s.value;
          topOffset = H - mag;
        } else {
          const before = running;
          running += s.value; // value negatif
          topOffset = H - (before / maxV) * H;
        }
        const color = s.type === "total" ? "#1e3a8a" : "#ef4444";
        return (
          <div className="flex flex-1 flex-col items-center" key={s.label}>
            <span className="mb-0.5 font-semibold text-[7.5px] text-slate-500 tabular-nums">
              {(s.value / 1_000_000).toLocaleString("tr-TR", { maximumFractionDigits: 0 })}
            </span>
            <div className="flex w-full items-end justify-center" style={{ height: H }}>
              <div className="w-5 rounded-sm" style={{ height: mag, marginTop: topOffset, background: color }} />
            </div>
            <span className="mt-0.5 whitespace-pre text-center text-[7px] text-slate-400 leading-tight">{s.label}</span>
          </div>
        );
      })}
    </div>
  );
}

/** Net karlılık kırılımı — merkezden iki yöne (yeşil + / kırmızı −). */
function DivergingBars({ rows }: { rows: { label: string; value: number; net?: boolean }[] }) {
  const maxV = Math.max(...rows.map((r) => Math.abs(r.value)));
  return (
    <div className="mt-1 flex flex-col gap-[3px]">
      {rows.map((r) => {
        const w = (Math.abs(r.value) / maxV) * 50;
        const pos = r.value >= 0;
        return (
          <div className={`flex items-center gap-1 ${r.net ? "border-slate-200 border-t pt-1" : ""}`} key={r.label}>
            <span className={`w-[88px] shrink-0 truncate text-[8.5px] ${r.net ? "font-bold text-slate-800" : "text-slate-600"}`}>
              {r.label}
            </span>
            <div className="relative h-3 flex-1">
              <div className="absolute top-0 bottom-0 left-1/2 w-px bg-slate-200" />
              <div
                className="absolute top-0 h-full rounded-sm"
                style={{
                  left: pos ? "50%" : `${50 - w}%`,
                  width: `${w}%`,
                  background: r.net ? "#15803d" : pos ? "#22c55e" : "#ef4444",
                }}
              />
            </div>
            <span className={`w-10 shrink-0 text-right text-[8.5px] tabular-nums ${r.net ? "font-bold text-slate-800" : "text-slate-600"}`}>
              {(r.value / 1_000_000).toLocaleString("tr-TR", { maximumFractionDigits: 1 })}
            </span>
          </div>
        );
      })}
    </div>
  );
}
