/**
 * Executive Dealer Performance Dashboard — Genel Müdür için tek sayfa, shell'siz,
 * yatay A4 PDF'e sığacak üst-yönetim özeti. Tüm metrikler mevcut veri setlerinden
 * (production-loans, applications, risk-watch, limits) türetilir; tüm grafikler
 * Recharts ile çizilir.
 */
import { AlertTriangle, Calendar, CheckCircle2, ChevronDown, Printer } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  FunnelViz,
  Gauge,
  HBars,
  KarlilikBars,
  ScoreBars,
  Section,
  Sparkline,
  TreemapMini,
  WaterfallChart,
} from "../exec-kit";

const NPL_SHADES = ["#dcfce7", "#fde68a", "#fb923c", "#ef4444", "#b91c1c"];
const SCATTER_FILL: Record<string, string> = { high: "#16a34a", mid: "#f59e0b", low: "#ef4444" };
const FUNNEL_COLORS = ["#0c4a6e", "#0369a1", "#0891b2", "#0d9488", "#10b981"];
const ALL = "Tümü";

const short = (s: string) => s.split(" ")[0];
const uniq = (xs: string[]) => [...new Set(xs)].sort((a, b) => a.localeCompare(b, "tr"));

export function ExecutiveDashboard() {
  const loans = useProductionLoans();
  const apps = useApplications();
  const risks = useRiskContracts();
  const limits = useLimits();

  const [bolge, setBolge] = useState(ALL);
  const [il, setIl] = useState(ALL);
  const [distributor, setDistributor] = useState(ALL);
  const [marka, setMarka] = useState(ALL);
  const [bayi, setBayi] = useState(ALL);
  const [sektor, setSektor] = useState(ALL);
  const [tip, setTip] = useState(ALL);

  const ready = loans.data && apps.data && risks.data && limits.data;

  const opts = useMemo(() => {
    const L = loans.data ?? [];
    return {
      bolge: uniq(L.map((l) => l.bolge)),
      il: uniq(L.map((l) => l.il)),
      distributor: uniq(L.map((l) => l.distributor)),
      marka: uniq(L.map((l) => l.marka)),
      bayi: uniq(L.map((l) => l.bayi)),
      sektor: uniq(L.map((l) => l.altSektor)),
      tip: ["Bireysel", "Ticari"],
    };
  }, [loans.data]);

  const d = useMemo(() => {
    if (!ready) {
      return null;
    }
    const geo = (r: { bolge: string; il: string; distributor: string; bayi: string; altSektor: string }) =>
      (bolge === ALL || r.bolge === bolge) &&
      (il === ALL || r.il === il) &&
      (distributor === ALL || r.distributor === distributor) &&
      (bayi === ALL || r.bayi === bayi) &&
      (sektor === ALL || r.altSektor === sektor);
    const fL = loans.data!.filter(
      (l) => geo(l) && (marka === ALL || l.marka === marka) && (tip === ALL || l.musteriTipi === tip)
    );
    const fA = apps.data!.filter((a) => geo(a) && (tip === ALL || a.musteriTipi === tip));
    const fR = risks.data!.filter((r) => geo(r) && (tip === ALL || r.musteriTipi === tip));
    const fLi = limits.data!.filter((l) => geo(l));
    return computeExec(fL, fA, fR, fLi);
  }, [ready, loans.data, apps.data, risks.data, limits.data, bolge, il, distributor, marka, bayi, sektor, tip]);

  if (!d) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <LoadingState />
      </div>
    );
  }

  const funnelData = d.funnel.map((s, i) => ({
    name: s.label,
    value: s.value,
    pct: fmtPct(s.pct, 1),
    fill: FUNNEL_COLORS[i],
  }));
  const topBayiData = d.topBayi.map((b) => ({ name: short(b.name), value: b.hacim / 1_000_000 }));
  const fx = d.scatter.map((s) => s.faiz);
  const faizDomain: [number, number] = fx.length
    ? [Math.min(...fx) - 0.1, Math.max(...fx) + 0.1]
    : [2, 4];
  const riskData = d.riskKpi.map((r) => ({
    name: r.label,
    value: (r.gercek / r.hedef) * 100,
    actual: fmtPct(r.gercek, r.unit === "%" ? 1 : 0),
    fill: r.bad ? "#ef4444" : "#22c55e",
  }));
  const tr1 = (x: number) => x.toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const limitStack = d.limitBars.map((g) => ({
    name: short(g.name),
    kullanilan: g.kullanilan / 1_000_000,
    bos: (g.toplam - g.kullanilan) / 1_000_000,
    toplam: g.toplam / 1_000_000,
    oran: g.oran,
  }));

  return (
    <div className="exec-shell min-h-screen overflow-auto bg-slate-200 py-5 print:bg-white print:py-0">
      {/* biome-ignore lint/style/noUnusedTemplateLiteral: print stylesheet */}
      <style>{`
        @media print {
          @page { size: A4 landscape; margin: 4mm; }
          html, body { background: #fff !important; }
          .exec-shell { min-height: 0 !important; }
          .exec-print { zoom: 0.735; box-shadow: none !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>

      <div className="mx-auto w-fit print:w-full">
        <div className="mb-2 flex justify-end print:hidden">
          <button
            className="flex items-center gap-2 rounded-lg bg-[#0b2545] px-4 py-2 font-semibold text-[13px] text-white shadow hover:bg-[#13315c]"
            onClick={() => window.print()}
            type="button"
          >
            <Printer size={15} /> PDF / Yazdır (A4 Yatay)
          </button>
        </div>

        <div className="exec-print flex w-[1480px] flex-col gap-2 bg-slate-100 p-3 shadow-[0_10px_40px_rgba(2,12,40,0.25)]">
          {/* Header */}
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

          {/* Filtre çubuğu — fonksiyonel */}
          <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-1">
            <FilterPill icon label="Tarih Aralığı" value="01.01.2025 - 20.05.2025" wide />
            <FilterSelect label="Bölge" onChange={setBolge} options={opts.bolge} value={bolge} />
            <FilterSelect label="İl" onChange={setIl} options={opts.il} value={il} />
            <FilterSelect label="Distribütör" onChange={setDistributor} options={opts.distributor} value={distributor} />
            <FilterSelect label="Marka" onChange={setMarka} options={opts.marka} value={marka} />
            <FilterSelect label="Bayi" onChange={setBayi} options={opts.bayi} value={bayi} />
            <FilterSelect label="Sektör" onChange={setSektor} options={opts.sektor} value={sektor} />
            <FilterSelect label="Bireysel / Ticari" onChange={setTip} options={opts.tip} value={tip} />
          </div>

          {/* KPI satırı */}
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
                <div className={`mt-0.5 font-bold text-[10px] ${k.up ? "text-emerald-600" : "text-red-500"}`}>
                  {k.up ? "▲" : "▼"} {k.delta}
                </div>
                <div className="mt-1">
                  <Sparkline color={k.accent} data={k.spark} />
                </div>
              </div>
            ))}
          </div>

          {/* Üst grid: 1 / 2 / 3 */}
          <div className="grid grid-cols-3 gap-2">
            {/* 1. HACİM ANALİZİ */}
            <Section accent="#1d4ed8" no={1} title="HACİM ANALİZİ">
              <div className="flex items-center justify-between font-semibold text-[9px] text-slate-400 uppercase">
                <span>Top Bayi — Kredi Tutarı (Mn)</span>
                <span>Adet</span>
              </div>
              <div className="flex">
                <div className="min-w-0 flex-1">
                  <HBars data={topBayiData} format={(v) => fmtMn(v * 1_000_000, 0)} height={138} labelWidth={74} />
                </div>
                <div className="flex w-8 flex-col justify-around py-1 text-right">
                  {d.topBayi.map((b) => (
                    <span className="font-semibold text-[8.5px] text-slate-500 tabular-nums" key={b.name}>
                      {b.adet}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-1 font-semibold text-[9px] text-slate-400 uppercase">Hacim Dağılımı (Kredi Tutarı)</div>
              <div className="mt-1 grid grid-cols-3 gap-1.5">
                {d.dagilim.map((col) => (
                  <div key={col.title}>
                    <div className="mb-0.5 font-bold text-[8.5px] text-slate-500">{col.title}</div>
                    <TreemapMini
                      data={col.rows.map((r) => ({ name: r.name, pct: r.pct, value: r.pct }))}
                      height={74}
                    />
                  </div>
                ))}
              </div>
            </Section>

            {/* 2. DÖNÜŞÜM ANALİZİ */}
            <Section accent="#0891b2" no={2} title="DÖNÜŞÜM ANALİZİ (FUNNEL)">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="mb-0.5 flex justify-end font-semibold text-[8px] text-slate-400 uppercase">
                    Dönüşüm Oranı
                  </div>
                  <FunnelViz data={funnelData} height={132} />
                </div>
                <div>
                  <div className="font-semibold text-[9px] text-slate-400 uppercase">Hacim Kayıp Analizi (Mn)</div>
                  <WaterfallChart height={132} steps={d.waterfall} />
                </div>
              </div>
              <div className="mt-1 grid grid-cols-2 gap-2">
                <div>
                  <div className="font-semibold text-[9px] text-slate-400 uppercase">Dönüşüm Oranları Trendi</div>
                  <ResponsiveContainer height={104} width="100%">
                    <LineChart data={d.trend} margin={{ top: 6, right: 6, left: -24, bottom: 0 }}>
                      <CartesianGrid stroke="#eef2f7" vertical={false} />
                      <XAxis axisLine={false} dataKey="ay" tick={{ fill: "#94a3b8", fontSize: 8 }} tickLine={false} />
                      <YAxis axisLine={false} tick={{ fill: "#94a3b8", fontSize: 8 }} tickLine={false} width={30} />
                      <Legend iconSize={6} wrapperStyle={{ fontSize: 7.5 }} />
                      <Line dataKey="onay" dot={{ r: 1.5 }} name="Onay" stroke="#2563eb" strokeWidth={1.5} />
                      <Line dataKey="kullandirim" dot={{ r: 1.5 }} name="Kullandırım" stroke="#0891b2" strokeWidth={1.5} />
                      <Line dataKey="aktif" dot={{ r: 1.5 }} name="Aktif" stroke="#16a34a" strokeWidth={1.5} />
                      <Line dataKey="tahsilat" dot={{ r: 1.5 }} name="Tahsilat" stroke="#f59e0b" strokeWidth={1.5} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <div className="font-semibold text-[9px] text-slate-400 uppercase">En Büyük Kayıplar (Bayi)</div>
                  <table className="mt-1 w-full">
                    <thead>
                      <tr className="text-[8px] text-slate-400">
                        <th className="text-left font-semibold">Bayi</th>
                        <th className="text-right font-semibold">Onay</th>
                        <th className="text-right font-semibold">Kull.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {d.kayiplar.map((k) => (
                        <tr className="border-slate-100 border-t" key={k.bayi}>
                          <td className="py-0.5 text-[9px] text-slate-600">{short(k.bayi)}</td>
                          <td className="py-0.5 text-right font-semibold text-[9px] text-red-500 tabular-nums">
                            {fmtPct(k.onay, 1)} ▼
                          </td>
                          <td className="py-0.5 text-right font-semibold text-[9px] text-red-500 tabular-nums">
                            {fmtPct(k.kullandirim, 1)} ▼
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Section>

            {/* 3. KARLILIK ANALİZİ */}
            <Section accent="#7c3aed" no={3} title="KARLILIK ANALİZİ">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="font-semibold text-[9px] text-slate-400 uppercase">Net Karlılık Kırılımı (Mn)</div>
                  <KarlilikBars height={150} rows={d.karlilik} />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[9px] text-slate-400 uppercase">Faiz vs Net Karlılık</span>
                    <span className="flex gap-1.5 text-[7px] text-slate-500">
                      <Dot c="#16a34a" t="Yüksek" />
                      <Dot c="#f59e0b" t="Orta" />
                      <Dot c="#ef4444" t="Düşük" />
                    </span>
                  </div>
                  <ResponsiveContainer height={132} width="100%">
                    <ScatterChart margin={{ top: 8, right: 8, left: -22, bottom: 2 }}>
                      <CartesianGrid stroke="#eef2f7" />
                      <XAxis
                        dataKey="faiz"
                        domain={faizDomain}
                        tick={{ fill: "#94a3b8", fontSize: 8 }}
                        tickFormatter={(v) => `%${v.toFixed(1)}`}
                        tickLine={false}
                        type="number"
                      />
                      <YAxis dataKey="net" tick={{ fill: "#94a3b8", fontSize: 8 }} tickLine={false} width={26} />
                      <ZAxis dataKey="hacim" range={[30, 200]} type="number" />
                      <Scatter data={d.scatter}>
                        {d.scatter.map((s) => (
                          <Cell fill={SCATTER_FILL[s.tier]} fillOpacity={0.78} key={s.name} />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="mt-1 font-semibold text-[9px] text-slate-400 uppercase">Karlılık Etkinlik Göstergeleri</div>
              <div className="mt-1 grid grid-cols-4 gap-1.5">
                {d.etkinlik.map((e) => (
                  <div className="rounded border border-slate-100 bg-slate-50 px-1.5 py-1 text-center" key={e.label}>
                    <div className="text-[7.5px] text-slate-500 leading-tight">{e.label}</div>
                    <div className="font-bold text-[14px] text-slate-800 tabular-nums">{e.value}</div>
                    <div className={`text-[8px] font-semibold ${e.up ? "text-emerald-600" : "text-red-500"}`}>
                      {e.up ? "▲" : "▼"} {e.delta}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          </div>

          {/* Alt grid: 4 / 5 / 6 */}
          <div className="grid grid-cols-3 gap-2">
            {/* 4. RİSK ANALİZİ */}
            <Section accent="#dc2626" no={4} title="RİSK ANALİZİ">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="mb-0.5 font-semibold text-[9px] text-slate-400 uppercase">Risk KPI (Hedef vs Gerç.)</div>
                  <ResponsiveContainer height={140} width="100%">
                    <BarChart data={riskData} layout="vertical" margin={{ top: 2, right: 30, left: 2, bottom: 2 }}>
                      <XAxis domain={[0, 160]} hide type="number" />
                      <YAxis axisLine={false} dataKey="name" tick={{ fill: "#475569", fontSize: 8 }} tickLine={false} type="category" width={62} />
                      <ReferenceLine
                        label={{ value: "Hedef", position: "top", fill: "#475569", fontSize: 7 }}
                        stroke="#475569"
                        strokeDasharray="2 2"
                        x={100}
                      />
                      <Bar dataKey="value" isAnimationActive={false} radius={[0, 3, 3, 0]}>
                        {riskData.map((r) => (
                          <Cell fill={r.fill} key={r.name} />
                        ))}
                        <LabelList dataKey="actual" position="right" style={{ fill: "#334155", fontSize: 8, fontWeight: 700 }} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <div className="mb-0.5 font-semibold text-[9px] text-slate-400 uppercase">NPL — Bölge Heatmap</div>
                  <TurkeyChoropleth legendHigh="Kritik" legendLow="İyi" ratesByRegion={d.nplByRegion} shades={NPL_SHADES} />
                </div>
              </div>
            </Section>

            {/* 5. PENETRASYON & LİMİT */}
            <Section accent="#0d9488" no={5} title="PENETRASYON & LİMİT KULLANIMI">
              <div className="grid grid-cols-2 gap-2">
                {/* Sol: penetrasyon */}
                <div className="flex flex-col">
                  <div className="text-center font-semibold text-[9px] text-slate-400 uppercase">
                    Penetrasyon Göstergeleri
                  </div>
                  <div className="mt-1 flex gap-1">
                    <Gauge
                      color="#16a34a"
                      delta={`${tr1(Math.abs(d.krediPenetDelta))} yp`}
                      label="Kredi"
                      up={d.krediPenetDelta >= 0}
                      value={d.krediPenet}
                    />
                    <Gauge
                      color="#2563eb"
                      delta={`${tr1(Math.abs(d.sigortaPenetDelta))} yp`}
                      label="Sigorta"
                      up={d.sigortaPenetDelta >= 0}
                      value={d.sigortaPenet}
                    />
                  </div>
                  <div className="mt-1.5 text-center font-semibold text-[9px] text-slate-400 uppercase">
                    Penetrasyon Trendi
                  </div>
                  <ResponsiveContainer height={96} width="100%">
                    <LineChart data={d.penetTrend} margin={{ top: 6, right: 6, left: -24, bottom: 0 }}>
                      <CartesianGrid stroke="#eef2f7" vertical={false} />
                      <XAxis axisLine={false} dataKey="ay" tick={{ fill: "#94a3b8", fontSize: 8 }} tickLine={false} />
                      <YAxis axisLine={false} tick={{ fill: "#94a3b8", fontSize: 8 }} tickLine={false} width={30} />
                      <Legend iconSize={6} wrapperStyle={{ fontSize: 7.5 }} />
                      <Line dataKey="kredi" dot={{ r: 1.6 }} name="Kredi Penet." stroke="#16a34a" strokeWidth={1.6} />
                      <Line dataKey="sigorta" dot={{ r: 1.6 }} name="Sigorta Penet." stroke="#2563eb" strokeWidth={1.6} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Sağ: limit */}
                <div className="flex flex-col">
                  <div className="font-semibold text-[9px] text-slate-400 uppercase">Limit Kullanımı (Mn)</div>
                  <ResponsiveContainer height={120} width="100%">
                    <BarChart data={limitStack} margin={{ top: 14, right: 6, left: 6, bottom: 0 }}>
                      <XAxis axisLine={false} dataKey="name" tick={{ fill: "#64748b", fontSize: 8 }} tickLine={false} />
                      <YAxis hide />
                      <Legend iconSize={6} wrapperStyle={{ fontSize: 7 }} />
                      <Bar dataKey="kullanilan" fill="#1e3a8a" isAnimationActive={false} name="Kullanılan Limit" stackId="l">
                        <LabelList
                          dataKey="oran"
                          formatter={(v) => fmtPct(Number(v), 0)}
                          position="inside"
                          style={{ fill: "#fff", fontSize: 8, fontWeight: 700 }}
                        />
                      </Bar>
                      <Bar dataKey="bos" fill="#cbd5e1" isAnimationActive={false} name="Boş Limit" radius={[2, 2, 0, 0]} stackId="l">
                        <LabelList
                          dataKey="toplam"
                          formatter={(v) => Math.round(Number(v)).toLocaleString("tr-TR")}
                          position="top"
                          style={{ fill: "#334155", fontSize: 8, fontWeight: 700 }}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-1 rounded border border-slate-100">
                    <div className="bg-slate-50 px-2 py-0.5 text-center font-bold text-[8px] text-slate-500 uppercase">
                      Limiti %85 Üzeri Kullanan Gruplar
                    </div>
                    <table className="w-full">
                      <thead>
                        <tr className="text-[7.5px] text-slate-400">
                          <th className="px-2 text-left font-semibold">Grup</th>
                          <th className="px-2 text-right font-semibold">Kullanılan (Mn)</th>
                          <th className="px-2 text-right font-semibold">Oran</th>
                        </tr>
                      </thead>
                      <tbody>
                        {d.limitAsiri.map((g) => (
                          <tr className="border-slate-100 border-t" key={g.name}>
                            <td className="truncate px-2 py-0.5 text-[8.5px] text-slate-600">{g.name}</td>
                            <td className="px-2 py-0.5 text-right text-[8.5px] text-slate-500 tabular-nums">{fmtMn(g.limit, 0)}</td>
                            <td className={`px-2 py-0.5 text-right font-bold text-[8.5px] tabular-nums ${g.up ? "text-red-500" : "text-amber-600"}`}>
                              {fmtPct(g.oran, 0)} {g.up ? "▲" : "▼"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Section>

            {/* 6. EXECUTIVE ALERTS & SKORLAR */}
            <Section accent="#0f172a" no={6} title="EXECUTIVE ALERTS & BAYİ SKORLARI">
              <div className="grid grid-cols-[1.35fr_1fr_1fr] gap-2">
                {/* Executive Alerts */}
                <div>
                  <div className="mb-1 font-bold text-[9px] text-slate-500 uppercase tracking-wide">Executive Alerts</div>
                  <div className="flex flex-col gap-1">
                    {d.alerts.map((a) => {
                      const Icon = a.sev === "ok" ? CheckCircle2 : AlertTriangle;
                      const c = a.sev === "danger" ? "#dc2626" : a.sev === "warn" ? "#d97706" : "#0d9488";
                      const tint = a.sev === "danger" ? "#fee2e2" : a.sev === "warn" ? "#fef3c7" : "#ccfbf1";
                      return (
                        <div className="flex gap-1.5 rounded-md border border-slate-100 bg-slate-50/70 px-1.5 py-1" key={a.title}>
                          <span className="flex size-4 shrink-0 items-center justify-center rounded" style={{ background: tint }}>
                            <Icon color={c} size={10} />
                          </span>
                          <div className="leading-tight">
                            <div className="font-semibold text-[8.5px] text-slate-700">{a.title}</div>
                            <div className="text-[7.5px] text-slate-400">{a.body}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bayi Health Score */}
                <div className="flex flex-col rounded-md border border-slate-200">
                  <div className="border-slate-100 border-b bg-slate-50 px-2 py-0.5 font-bold text-[8.5px] text-slate-500 uppercase">
                    Bayi Health Score (0-100)
                  </div>
                  <div className="flex-1 p-1.5">
                    <ScoreBars data={d.healthScores.map((s) => ({ name: short(s.name), score: s.score }))} height={114} />
                  </div>
                </div>

                {/* Opportunity Score */}
                <div className="flex flex-col rounded-md border border-slate-200">
                  <div className="border-slate-100 border-b bg-slate-50 px-2 py-0.5 font-bold text-[8.5px] text-slate-500 uppercase">
                    Opportunity Score (0-100)
                  </div>
                  <div className="flex-1 p-1.5">
                    <ScoreBars data={d.oppScores.map((s) => ({ name: short(s.name), score: s.score }))} height={114} />
                  </div>
                </div>
              </div>
            </Section>
          </div>

          {/* Footer */}
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

function Dot({ c, t }: { c: string; t: string }) {
  return (
    <span className="flex items-center gap-0.5">
      <span className="size-1.5 rounded-full" style={{ background: c }} />
      {t}
    </span>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const active = value !== ALL;
  return (
    <div
      className={`flex min-w-0 flex-1 items-center gap-1 rounded-md border px-2 py-0.5 ${
        active ? "border-[#0b2545] bg-[#0b2545]/5" : "border-slate-200 bg-slate-50"
      }`}
    >
      <span className="shrink-0 font-semibold text-[9px] text-slate-400 uppercase">{label}</span>
      <Select onValueChange={onChange} value={value}>
        <SelectTrigger className="ml-auto h-4 min-w-0 gap-1 border-0 bg-transparent p-0 font-semibold text-[10px] text-slate-700 shadow-none focus:ring-0 [&>svg]:size-3 [&>svg]:shrink-0 [&>svg]:text-slate-400">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="max-h-64">
          <SelectItem value={ALL}>Tümü</SelectItem>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
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
    <div className={`flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 ${wide ? "" : "flex-1"}`}>
      <span className="font-semibold text-[9px] text-slate-400 uppercase">{label}</span>
      <span className="ml-auto flex items-center gap-1 font-semibold text-[10px] text-slate-700">
        {icon ? <Calendar className="text-slate-400" size={11} /> : null}
        {value}
        {icon ? null : <ChevronDown className="text-slate-400" size={11} />}
      </span>
    </div>
  );
}
