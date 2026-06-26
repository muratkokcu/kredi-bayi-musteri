import { Download } from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  LabelList,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  type ProductionLoan,
  URETIM_AYLAR,
} from "@/data/production-loans";
import {
  formatCompact,
  formatNumber,
  formatPercent,
  formatTRY,
  formatTRYCompact,
} from "@/lib/format";
import { downloadCsv } from "@/lib/csv";
import { useProductionLoans } from "@/queries/production-loans";
import { ErrorState, LoadingState } from "@/ui/async-states";
import { MiniBar } from "@/ui/badge";
import { Card, CardHeader } from "@/ui/card";
import { DonutChart, FilterBar, KpiStrip, SortTh, useSort } from "@/ui/report-kit";
import { ReportingShell } from "../reporting-shell";

const SHELL_PROPS = {
  breadcrumb: ["Raporlar", "Üretim & Karlılık"],
  subtitle:
    "Açılan krediler ve karlılık — bayi / marka / segment kırılımında özet.",
  title: "Üretim & Karlılık Özeti",
} as const;

const PALETTE = ["0A9D5F", "2BB673", "57C99A", "127A9B", "F2A93B", "9CA3AF"];
const ALL = "Tümü";

function uniq(xs: string[]): string[] {
  return [...new Set(xs)].sort((a, b) => a.localeCompare(b, "tr"));
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Card>
      <CardHeader title={title} />
      <div className="mt-3 h-[240px] px-5 pb-5">{children}</div>
    </Card>
  );
}

function sumBy(rows: ProductionLoan[], key: "krediTutari" | "hedefTutar") {
  return rows.reduce((a, r) => a + r[key], 0);
}

function groupSum(
  rows: ProductionLoan[],
  dim: "marka" | "kasa" | "bolge" | "bayi"
): { name: string; value: number }[] {
  const m = new Map<string, number>();
  for (const r of rows) {
    m.set(r[dim], (m.get(r[dim]) ?? 0) + r.krediTutari);
  }
  return [...m.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

function ProductionBody({ rows }: { rows: ProductionLoan[] }) {
  const [yil, setYil] = useState(ALL);
  const [distributor, setDistributor] = useState(ALL);
  const [bolge, setBolge] = useState(ALL);
  const [bayi, setBayi] = useState(ALL);
  const [kasa, setKasa] = useState(ALL);
  const [tip, setTip] = useState(ALL);
  const [altSektor, setAltSektor] = useState(ALL);
  const [danisman, setDanisman] = useState(ALL);
  const [sektorMuduru, setSektorMuduru] = useState(ALL);
  const [bolgeYoneticisi, setBolgeYoneticisi] = useState(ALL);
  const [il, setIl] = useState(ALL);
  const [ilce, setIlce] = useState(ALL);

  const opts = useMemo(
    () => ({
      yil: uniq(rows.map((r) => String(r.yil))),
      distributor: uniq(rows.map((r) => r.distributor)),
      bolge: uniq(rows.map((r) => r.bolge)),
      bayi: uniq(rows.map((r) => r.bayi)),
      kasa: uniq(rows.map((r) => r.kasa)),
      tip: uniq(rows.map((r) => r.musteriTipi)),
      altSektor: uniq(rows.map((r) => r.altSektor)),
      danisman: uniq(rows.map((r) => r.danisman)),
      sektorMuduru: uniq(rows.map((r) => r.sektorMuduru)),
      bolgeYoneticisi: uniq(rows.map((r) => r.bolgeYoneticisi)),
      il: uniq(rows.map((r) => r.il)),
      ilce: uniq(rows.map((r) => r.ilce)),
    }),
    [rows]
  );

  const f = useMemo(
    () =>
      rows.filter(
        (r) =>
          (yil === ALL || String(r.yil) === yil) &&
          (distributor === ALL || r.distributor === distributor) &&
          (bolge === ALL || r.bolge === bolge) &&
          (bayi === ALL || r.bayi === bayi) &&
          (kasa === ALL || r.kasa === kasa) &&
          (tip === ALL || r.musteriTipi === tip) &&
          (altSektor === ALL || r.altSektor === altSektor) &&
          (danisman === ALL || r.danisman === danisman) &&
          (sektorMuduru === ALL || r.sektorMuduru === sektorMuduru) &&
          (bolgeYoneticisi === ALL || r.bolgeYoneticisi === bolgeYoneticisi) &&
          (il === ALL || r.il === il) &&
          (ilce === ALL || r.ilce === ilce)
      ),
    [
      rows,
      yil,
      distributor,
      bolge,
      bayi,
      kasa,
      tip,
      altSektor,
      danisman,
      sektorMuduru,
      bolgeYoneticisi,
      il,
      ilce,
    ]
  );

  const k = useMemo(() => {
    const n = f.length || 1;
    const hacim = sumBy(f, "krediTutari");
    const dosya = f.reduce((a, r) => a + r.dosyaMasrafi, 0);
    const tesvik = f.reduce((a, r) => a + r.tesvik, 0);
    const yas15 = f.filter((r) => r.aracYas >= 15);
    return {
      n: f.length,
      hacim,
      ortKredi: hacim / n,
      ortVade: f.reduce((a, r) => a + r.vade, 0) / n,
      ortFaiz: f.reduce((a, r) => a + r.faiz, 0) / n,
      tesvik,
      netKatki: dosya - tesvik,
      sigortaPen: f.filter((r) => r.sigorta).length / n,
      ekspertizPen: f.filter((r) => r.ekspertiz).length / n,
      yas15Adet: yas15.length,
      yas15Tutar: yas15.reduce((a, r) => a + r.krediTutari, 0),
      yas15Oran: yas15.length / n,
    };
  }, [f]);

  const aylik = useMemo(() => {
    const g = URETIM_AYLAR.map((ay, i) => ({ ay, gerc: 0, hedef: 0, i: i + 1 }));
    for (const r of f) {
      g[r.ay - 1].gerc += r.krediTutari;
      g[r.ay - 1].hedef += r.hedefTutar;
    }
    return g;
  }, [f]);

  const marka = useMemo(() => groupSum(f, "marka").slice(0, 8), [f]);
  const kasaDag = useMemo(() => groupSum(f, "kasa"), [f]);
  const bolgeDag = useMemo(() => groupSum(f, "bolge"), [f]);

  const bayiKar = useMemo(() => {
    const m = new Map<
      string,
      { hacim: number; adet: number; faiz: number; dosya: number; tesvik: number }
    >();
    for (const r of f) {
      const e =
        m.get(r.bayi) ?? { hacim: 0, adet: 0, faiz: 0, dosya: 0, tesvik: 0 };
      e.hacim += r.krediTutari;
      e.adet += 1;
      e.faiz += r.faiz;
      e.dosya += r.dosyaMasrafi;
      e.tesvik += r.tesvik;
      m.set(r.bayi, e);
    }
    return [...m.entries()]
      .map(([name, e]) => ({
        name,
        hacim: e.hacim,
        adet: e.adet,
        ortFaiz: e.faiz / e.adet,
        dosya: e.dosya,
        tesvik: e.tesvik,
        net: e.dosya - e.tesvik,
      }))
      .sort((a, b) => b.hacim - a.hacim);
  }, [f]);
  const maxNet = Math.max(...bayiKar.map((b) => b.net), 1);
  const karSort = useSort(bayiKar, "hacim", "desc");
  const detSort = useSort(f, "krediTutari", "desc");

  const reset = () => {
    setYil(ALL);
    setDistributor(ALL);
    setBolge(ALL);
    setBayi(ALL);
    setKasa(ALL);
    setTip(ALL);
    setAltSektor(ALL);
    setDanisman(ALL);
    setSektorMuduru(ALL);
    setBolgeYoneticisi(ALL);
    setIl(ALL);
    setIlce(ALL);
  };

  const exportCsv = () =>
    downloadCsv(
      "uretim-karlilik",
      [
        "Yıl", "Ay", "Distribütör", "Bölge", "İl", "Bayi", "Marka", "Model",
        "Kasa", "Müşteri Tipi", "Model Yıl", "Araç Yaşı", "Plaka",
        "Satış Bedeli", "Kasko Değeri", "Kredi Tutarı", "Vade (Ay)", "Faiz (%)",
        "Dosya Masrafı", "Teşvik", "Sigorta", "Ekspertiz", "Ekspertiz Firması",
        "Alt Sektör", "Danışman", "Sektör Müdürü", "Bölge Yöneticisi", "İlçe",
      ],
      f.map((r) => [
        r.yil, URETIM_AYLAR[r.ay - 1], r.distributor, r.bolge, r.il, r.bayi,
        r.marka, r.model, r.kasa, r.musteriTipi, r.modelYil, r.aracYas, r.plaka,
        r.satisBedeli, r.kaskoDegeri, r.krediTutari, r.vade, r.faiz,
        r.dosyaMasrafi, r.tesvik, r.sigorta ? "Var" : "Yok",
        r.ekspertiz ? "Var" : "Yok", r.ekspertizFirma,
        r.altSektor, r.danisman, r.sektorMuduru, r.bolgeYoneticisi, r.ilce,
      ])
    );

  return (
    <>
      <FilterBar
        filters={[
          { key: "yil", label: "Dönem (Yıl)", value: yil, options: opts.yil, onChange: setYil },
          { key: "bolge", label: "Bölge", value: bolge, options: opts.bolge, onChange: setBolge },
          { key: "bayi", label: "Bayi", value: bayi, options: opts.bayi, onChange: setBayi },
          { key: "distributor", label: "Distribütör", value: distributor, options: opts.distributor, onChange: setDistributor },
          { key: "kasa", label: "Kasa / Segment", value: kasa, options: opts.kasa, onChange: setKasa },
          { key: "tip", label: "Müşteri Tipi", value: tip, options: opts.tip, onChange: setTip },
          { key: "altSektor", label: "Alt Sektör", value: altSektor, options: opts.altSektor, onChange: setAltSektor },
          { key: "danisman", label: "Danışman", value: danisman, options: opts.danisman, onChange: setDanisman },
          { key: "sektorMuduru", label: "Sektör Müdürü", value: sektorMuduru, options: opts.sektorMuduru, onChange: setSektorMuduru },
          { key: "bolgeYoneticisi", label: "Bölge Yöneticisi", value: bolgeYoneticisi, options: opts.bolgeYoneticisi, onChange: setBolgeYoneticisi },
          { key: "il", label: "İl", value: il, options: opts.il, onChange: setIl, width: 120 },
          { key: "ilce", label: "İlçe", value: ilce, options: opts.ilce, onChange: setIlce },
        ]}
        onReset={reset}
        right={
          <button
            className="flex h-9 items-center gap-1.5 rounded-[10px] bg-bank px-3.5 font-semibold text-[13px] text-white hover:bg-bank-600"
            onClick={exportCsv}
            type="button"
          >
            <Download size={15} /> CSV İndir
          </button>
        }
      />

      <KpiStrip
        items={[
          { label: "Kredi Hacmi", value: formatTRYCompact(k.hacim), sub: `${formatNumber(k.n)} kredi` },
          { label: "Ort. Kredi Tutarı", value: formatTRYCompact(k.ortKredi), sub: `Ort. vade ${k.ortVade.toFixed(0)} ay` },
          { label: "Ort. Faiz (aylık)", value: formatPercent(k.ortFaiz, 2) },
          { label: "Net Katkı", value: formatTRYCompact(k.netKatki), sub: "Dosya − teşvik" },
          { label: "Ödenen Teşvik", value: formatTRYCompact(k.tesvik) },
          { label: "Sigorta Pen.", value: formatPercent(k.sigortaPen * 100, 1) },
          { label: "Ekspertiz Pen.", value: formatPercent(k.ekspertizPen * 100, 1) },
          { label: "15 Yaş Üstü", value: formatNumber(k.yas15Adet), sub: formatPercent(k.yas15Oran * 100, 1) },
        ]}
      />

      {/* GRAFİKLER */}
      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <ChartCard title="Aylık Üretim — Gerçekleşen vs Hedef">
          <ResponsiveContainer height="100%" width="100%">
            <ComposedChart data={aylik} margin={{ top: 28, right: 8, left: 8, bottom: 0 }}>
              <CartesianGrid stroke="var(--color-line)" vertical={false} />
              <XAxis
                axisLine={false}
                dataKey="ay"
                tick={{ fill: "var(--color-ink-muted)", fontSize: 11 }}
                tickLine={false}
              />
              <YAxis
                axisLine={false}
                tick={{ fill: "var(--color-ink-muted)", fontSize: 11 }}
                tickFormatter={formatTRYCompact}
                tickLine={false}
                width={60}
              />
              <Tooltip formatter={(v) => formatTRY(Number(v) || 0)} />
              <Bar dataKey="gerc" fill="var(--color-bank)" name="Gerçekleşen" radius={[4, 4, 0, 0]}>
                <LabelList
                  dataKey="gerc"
                  formatter={(v) => formatCompact(Number(v) || 0)}
                  position="top"
                  style={{ fill: "var(--color-ink-soft)", fontSize: 10, fontWeight: 600 }}
                />
              </Bar>
              <Line
                dataKey="hedef"
                dot={false}
                name="Hedef"
                stroke="var(--color-warn)"
                strokeWidth={2}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Marka Kırılımı — Hacim (ilk 8)">
          <ResponsiveContainer height="100%" width="100%">
            <BarChart
              data={marka}
              layout="vertical"
              margin={{ top: 4, right: 12, left: 8, bottom: 0 }}
            >
              <XAxis hide type="number" />
              <YAxis
                axisLine={false}
                dataKey="name"
                tick={{ fill: "var(--color-ink-soft)", fontSize: 11 }}
                tickLine={false}
                type="category"
                width={92}
              />
              <Tooltip formatter={(v) => formatTRY(Number(v) || 0)} />
              <Bar dataKey="value" fill="var(--color-bank)" radius={[0, 4, 4, 0]}>
                <LabelList
                  dataKey="value"
                  formatter={(v) => formatCompact(Number(v) || 0)}
                  position="right"
                  style={{ fill: "var(--color-ink-soft)", fontSize: 10, fontWeight: 600 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Segment (Kasa) Dağılımı">
          <DonutChart
            colors={PALETTE.map((c) => `#${c}`)}
            data={kasaDag}
            formatValue={formatCompact}
          />
        </ChartCard>

        <ChartCard title="Bölge Kırılımı — Hacim">
          <ResponsiveContainer height="100%" width="100%">
            <BarChart data={bolgeDag} margin={{ top: 28, right: 8, left: 8, bottom: 0 }}>
              <CartesianGrid stroke="var(--color-line)" vertical={false} />
              <XAxis
                axisLine={false}
                dataKey="name"
                tick={{ fill: "var(--color-ink-muted)", fontSize: 11 }}
                tickLine={false}
              />
              <YAxis
                axisLine={false}
                tick={{ fill: "var(--color-ink-muted)", fontSize: 11 }}
                tickFormatter={formatTRYCompact}
                tickLine={false}
                width={60}
              />
              <Tooltip formatter={(v) => formatTRY(Number(v) || 0)} />
              <Bar dataKey="value" fill="var(--color-bank-700)" radius={[4, 4, 0, 0]}>
                <LabelList
                  dataKey="value"
                  formatter={(v) => formatCompact(Number(v) || 0)}
                  position="top"
                  style={{ fill: "var(--color-ink-soft)", fontSize: 10, fontWeight: 600 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* KARLILIK TABLOSU */}
      <Card className="mt-5 pb-3">
        <CardHeader title="Bayi Bazında Karlılık Kırılımı" />
        <div className="mt-3 overflow-x-auto px-5">
          <table className="[&_td]:px-2.5 [&_th]:px-2.5 w-full min-w-[760px]">
            <thead>
              <tr className="border-line border-b text-[11.5px] text-ink-muted">
                <SortTh k="name" label="Bayi" sort={karSort} />
                <SortTh align="right" k="hacim" label="Hacim" sort={karSort} />
                <SortTh align="right" k="adet" label="Adet" sort={karSort} />
                <SortTh align="right" k="ortFaiz" label="Ort. Faiz" sort={karSort} />
                <SortTh align="right" k="dosya" label="Dosya Masrafı" sort={karSort} />
                <SortTh align="right" k="tesvik" label="Teşvik" sort={karSort} />
                <SortTh align="right" k="net" label="Net Katkı" sort={karSort} />
                <th className="w-28 py-2 font-medium" />
              </tr>
            </thead>
            <tbody>
              {karSort.sorted.map((b) => (
                <tr
                  className={`cursor-pointer border-line border-b last:border-0 hover:bg-canvas/60 ${
                    bayi === b.name ? "bg-bank-tint/40" : ""
                  }`}
                  key={b.name}
                  onClick={() => setBayi((p) => (p === b.name ? ALL : b.name))}
                >
                  <td className="py-2.5 font-medium text-[13px] text-ink">{b.name}</td>
                  <td className="py-2.5 text-right text-[12.5px] tabular-nums">
                    {formatTRYCompact(b.hacim)}
                  </td>
                  <td className="py-2.5 text-right text-[12.5px] tabular-nums">
                    {formatNumber(b.adet)}
                  </td>
                  <td className="py-2.5 text-right text-[12.5px] tabular-nums">
                    {formatPercent(b.ortFaiz, 2)}
                  </td>
                  <td className="py-2.5 text-right text-[12.5px] tabular-nums">
                    {formatTRYCompact(b.dosya)}
                  </td>
                  <td className="py-2.5 text-right text-[12.5px] tabular-nums">
                    {formatTRYCompact(b.tesvik)}
                  </td>
                  <td className="py-2.5 pr-1 text-right font-semibold text-[12.5px] text-bank-700 tabular-nums">
                    {formatTRYCompact(b.net)}
                  </td>
                  <td className="py-2.5 pl-3">
                    <MiniBar value={(b.net / maxNet) * 100} />
                  </td>
                </tr>
              ))}
              {bayiKar.length === 0 && (
                <tr>
                  <td className="py-6 text-center text-[13px] text-ink-muted" colSpan={8}>
                    Seçili filtrelerle kayıt yok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* DETAY — Açılan Krediler (kredi-bazlı) */}
      <Card className="mt-5 pb-3">
        <CardHeader
          action={
            <span className="text-[12px] text-ink-muted">
              {formatNumber(f.length)} kayıt
              {f.length > 100 ? " · ilk 100 gösteriliyor, tümü CSV'de" : ""}
            </span>
          }
          title="Açılan Krediler — Detay"
        />
        <div className="mt-3 overflow-x-auto px-5">
          <table className="[&_td]:px-2.5 [&_th]:px-2.5 w-full min-w-[1100px]">
            <thead>
              <tr className="border-line border-b text-[11.5px] text-ink-muted">
                <SortTh k="yil" label="Dönem" sort={detSort} />
                <SortTh k="bayi" label="Bayi" sort={detSort} />
                <SortTh k="marka" label="Araç" sort={detSort} />
                <SortTh k="kasa" label="Segment" sort={detSort} />
                <SortTh k="plaka" label="Plaka" sort={detSort} />
                <SortTh align="right" k="modelYil" label="Yıl / Yaş" sort={detSort} />
                <SortTh align="right" k="satisBedeli" label="Satış Bedeli" sort={detSort} />
                <SortTh align="right" k="krediTutari" label="Kredi Tutarı" sort={detSort} />
                <SortTh align="right" k="vade" label="Vade" sort={detSort} />
                <SortTh align="right" k="faiz" label="Faiz" sort={detSort} />
                <SortTh align="right" k="tesvik" label="Teşvik" sort={detSort} />
                <th className="py-2 pr-1 text-center font-medium">Sig. / Eksp.</th>
              </tr>
            </thead>
            <tbody>
              {detSort.sorted.slice(0, 100).map((r, i) => (
                <tr className="border-line border-b last:border-0" key={`${r.bayi}-${i}`}>
                  <td className="py-2 text-[12.5px] text-ink-soft tabular-nums">
                    {r.yil} {URETIM_AYLAR[r.ay - 1]}
                  </td>
                  <td className="py-2 text-[12.5px] text-ink-soft">{r.bayi}</td>
                  <td className="py-2 text-[12.5px] text-ink">
                    {r.marka} {r.model}
                  </td>
                  <td className="py-2 text-[12.5px] text-ink-soft">
                    {r.kasa}{" "}
                    <span className="text-ink-muted">· {r.segment}</span>
                  </td>
                  <td className="py-2 text-[12.5px] text-ink-soft tabular-nums">{r.plaka}</td>
                  <td className="py-2 text-right text-[12.5px] tabular-nums">
                    {r.modelYil} · {r.aracYas}y
                  </td>
                  <td className="py-2 text-right text-[12.5px] tabular-nums">
                    {formatTRYCompact(r.satisBedeli)}
                  </td>
                  <td className="py-2 text-right font-semibold text-[12.5px] text-ink tabular-nums">
                    {formatTRYCompact(r.krediTutari)}
                  </td>
                  <td className="py-2 text-right text-[12.5px] tabular-nums">{r.vade} ay</td>
                  <td className="py-2 text-right text-[12.5px] tabular-nums">
                    {formatPercent(r.faiz, 2)}
                  </td>
                  <td className="py-2 text-right text-[12.5px] tabular-nums">
                    {formatTRYCompact(r.tesvik)}
                  </td>
                  <td className="py-2 pr-1 text-center text-[12.5px]">
                    {r.sigorta ? "✓" : "—"} / {r.ekspertiz ? "✓" : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

export function BankUretimKarlilik() {
  const { data, isPending, isError, refetch } = useProductionLoans();

  if (isPending) {
    return (
      <ReportingShell {...SHELL_PROPS}>
        <LoadingState />
      </ReportingShell>
    );
  }
  if (isError || !data) {
    return (
      <ReportingShell {...SHELL_PROPS}>
        <ErrorState onRetry={() => refetch()} />
      </ReportingShell>
    );
  }
  return (
    <ReportingShell {...SHELL_PROPS}>
      <ProductionBody rows={data} />
    </ReportingShell>
  );
}
