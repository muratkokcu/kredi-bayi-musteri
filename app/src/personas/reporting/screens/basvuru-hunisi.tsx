import { Download } from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  LabelList,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { type Application, BASVURU_AYLAR } from "@/data/applications";
import { formatCompact, formatNumber, formatPercent, formatTRYCompact } from "@/lib/format";
import { downloadCsv } from "@/lib/csv";
import { useApplications } from "@/queries/applications";
import { ErrorState, LoadingState } from "@/ui/async-states";
import { MiniBar } from "@/ui/badge";
import { Card, CardHeader } from "@/ui/card";
import { DonutChart, FilterBar, KpiStrip, SortTh, useSort } from "@/ui/report-kit";
import { ReportingShell } from "../reporting-shell";

const SHELL_PROPS = {
  breadcrumb: ["Raporlar", "Başvuru Hunisi"],
  subtitle: "Başvuru → onay → kullandırım dönüşümü ve ret analizi.",
  title: "Başvuru Hunisi & Dönüşüm",
} as const;

const PALETTE = ["E2603B", "F2A93B", "9CA3AF", "57C99A", "127A9B"];
const ALL = "Tümü";
const uniq = (xs: string[]) => [...new Set(xs)].sort((a, b) => a.localeCompare(b, "tr"));

function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card>
      <CardHeader title={title} />
      <div className="mt-3 h-[240px] px-5 pb-5">{children}</div>
    </Card>
  );
}

function FunnelBar({
  label,
  value,
  pct,
  color,
}: {
  label: string;
  value: number;
  pct: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 shrink-0 text-[12.5px] text-ink-soft">{label}</span>
      <div className="h-8 flex-1 overflow-hidden rounded-lg bg-canvas">
        <div
          className="flex h-full items-center justify-end rounded-lg px-2.5 font-semibold text-[12px] text-white"
          style={{ width: `${Math.max(pct, 8)}%`, background: color }}
        >
          {formatNumber(value)}
        </div>
      </div>
      <span className="w-12 shrink-0 text-right font-semibold text-[12px] text-ink tabular-nums">
        %{pct.toFixed(0)}
      </span>
    </div>
  );
}

function Body({ rows }: { rows: Application[] }) {
  const [yil, setYil] = useState(ALL);
  const [distributor, setDistributor] = useState(ALL);
  const [bolge, setBolge] = useState(ALL);
  const [bayi, setBayi] = useState(ALL);
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
      tip,
      altSektor,
      danisman,
      sektorMuduru,
      bolgeYoneticisi,
      il,
      ilce,
    ]
  );

  // şablon: tüm durumlar için adet + tutar + oran
  const durumOzet = useMemo(() => {
    const order: Application["durum"][] = [
      "Kullandırım", "Onay", "Ret", "İade", "İptal",
    ];
    const n = f.length || 1;
    return order.map((d) => {
      const sel = f.filter((r) => r.durum === d);
      return {
        durum: d,
        adet: sel.length,
        tutar: sel.reduce((a, r) => a + r.tutar, 0),
        oran: sel.length / n,
      };
    });
  }, [f]);

  const k = useMemo(() => {
    const n = f.length || 1;
    const ret = f.filter((r) => r.durum === "Ret").length;
    const kull = f.filter((r) => r.durum === "Kullandırım");
    const onaylanan = f.length - ret;
    return {
      n: f.length,
      ret,
      onaylanan,
      kullandirim: kull.length,
      retOran: ret / n,
      onayOran: onaylanan / n,
      kullOran: kull.length / n,
      kullTutar: kull.reduce((a, r) => a + r.tutar, 0),
      ortTutar: f.reduce((a, r) => a + r.tutar, 0) / n,
    };
  }, [f]);

  const aylik = useMemo(() => {
    const g = BASVURU_AYLAR.map((ay) => ({ ay, basvuru: 0, kullandirim: 0 }));
    for (const r of f) {
      g[r.ay - 1].basvuru += 1;
      if (r.durum === "Kullandırım") {
        g[r.ay - 1].kullandirim += 1;
      }
    }
    return g;
  }, [f]);

  const retNeden = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of f) {
      if (r.durum === "Ret") {
        m.set(r.retNedeni, (m.get(r.retNedeni) ?? 0) + 1);
      }
    }
    return [...m.entries()].map(([name, value]) => ({ name, value }));
  }, [f]);

  const bayiTablo = useMemo(() => {
    const m = new Map<string, { basvuru: number; ret: number; kull: number; tutar: number }>();
    for (const r of f) {
      const e = m.get(r.bayi) ?? { basvuru: 0, ret: 0, kull: 0, tutar: 0 };
      e.basvuru += 1;
      if (r.durum === "Ret") e.ret += 1;
      if (r.durum === "Kullandırım") {
        e.kull += 1;
        e.tutar += r.tutar;
      }
      m.set(r.bayi, e);
    }
    return [...m.entries()]
      .map(([name, e]) => ({
        name,
        ...e,
        oran: e.basvuru ? e.kull / e.basvuru : 0,
      }))
      .sort((a, b) => b.kull - a.kull);
  }, [f]);
  const maxOran = Math.max(...bayiTablo.map((b) => b.oran), 0.01);
  const durumSort = useSort(durumOzet, "adet", "desc");
  const bayiSort = useSort(bayiTablo, "kull", "desc");
  const detSort = useSort(f, "tutar", "desc");

  const reset = () => {
    setYil(ALL);
    setDistributor(ALL);
    setBolge(ALL);
    setBayi(ALL);
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
      "basvuru-hunisi",
      ["Yıl", "Ay", "Distribütör", "Bölge", "İl", "Bayi", "Müşteri Tipi", "Tutar", "Durum", "Ret Nedeni", "Alt Sektör", "Danışman", "Sektör Müdürü", "Bölge Yöneticisi", "İlçe"],
      f.map((r) => [
        r.yil, BASVURU_AYLAR[r.ay - 1], r.distributor, r.bolge, r.il, r.bayi,
        r.musteriTipi, r.tutar, r.durum, r.retNedeni,
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
          { label: "Başvuru Adedi", value: formatNumber(k.n), sub: "Seçili dönem" },
          { label: "Ret Oranı", value: formatPercent(k.retOran * 100, 1), sub: `${formatNumber(k.ret)} ret` },
          { label: "Onay Oranı", value: formatPercent(k.onayOran * 100, 1), sub: `${formatNumber(k.onaylanan)} onay` },
          { label: "Kullandırım Oranı", value: formatPercent(k.kullOran * 100, 1), sub: `${formatNumber(k.kullandirim)} kullandırım` },
          { label: "Kullandırılan Tutar", value: formatTRYCompact(k.kullTutar), sub: "Kullandırım" },
          { label: "Ort. Başvuru Tutarı", value: formatTRYCompact(k.ortTutar), sub: "Tüm başvurular" },
        ]}
      />

      {/* Birleşik: Başvuru Sonuç Özeti — huni + durum dağılımı + ret nedenleri */}
      <Card className="mt-5">
        <CardHeader title="Başvuru Sonuç Özeti" />
        <div className="mt-2 grid grid-cols-1 divide-line pb-3 lg:grid-cols-3 lg:divide-x">
          {/* Dönüşüm hunisi */}
          <div className="px-5 py-3">
            <div className="mb-2.5 font-semibold text-[11px] text-ink-muted uppercase tracking-wide">
              Dönüşüm Hunisi
            </div>
            <div className="flex flex-col gap-3">
              <FunnelBar color="var(--color-bank)" label="Başvuru" pct={100} value={k.n} />
              <FunnelBar
                color="var(--color-bank-600)"
                label="Onaylanan"
                pct={k.n ? (k.onaylanan / k.n) * 100 : 0}
                value={k.onaylanan}
              />
              <FunnelBar
                color="var(--color-bank-700)"
                label="Kullandırılan"
                pct={k.n ? (k.kullandirim / k.n) * 100 : 0}
                value={k.kullandirim}
              />
            </div>
          </div>

          {/* Durum dağılımı — adet / tutar / oran (şablon) */}
          <div className="overflow-x-auto px-5 py-3">
            <div className="mb-2 font-semibold text-[11px] text-ink-muted uppercase tracking-wide">
              Durum Dağılımı
            </div>
            <table className="[&_td]:px-1.5 [&_th]:px-1.5 w-full min-w-[280px]">
              <thead>
                <tr className="border-line border-b text-[11px] text-ink-muted">
                  <SortTh k="durum" label="Durum" sort={durumSort} />
                  <SortTh align="right" k="adet" label="Adet" sort={durumSort} />
                  <SortTh align="right" k="tutar" label="Tutar" sort={durumSort} />
                  <SortTh align="right" k="oran" label="Oran" sort={durumSort} />
                </tr>
              </thead>
              <tbody>
                {durumSort.sorted.map((d) => (
                  <tr className="border-line border-b last:border-0" key={d.durum}>
                    <td className="py-2 font-medium text-[12.5px] text-ink">{d.durum}</td>
                    <td className="py-2 text-right text-[12px] tabular-nums">{formatNumber(d.adet)}</td>
                    <td className="py-2 text-right text-[12px] text-ink-soft tabular-nums">{formatTRYCompact(d.tutar)}</td>
                    <td className="py-2 pr-1 text-right font-semibold text-[12px] text-bank-700 tabular-nums">
                      {formatPercent(d.oran * 100, 1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Ret nedenleri */}
          <div className="flex flex-col px-5 py-3">
            <div className="mb-2 font-semibold text-[11px] text-ink-muted uppercase tracking-wide">
              Ret Nedenleri
            </div>
            <div className="min-h-[150px] flex-1">
              <DonutChart
                centerLabel="Ret"
                colors={PALETTE.map((c) => `#${c}`)}
                data={retNeden}
                formatValue={formatNumber}
              />
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <ChartCard title="Aylık Başvuru vs Kullandırım">
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
                tickLine={false}
                width={32}
              />
              <Tooltip />
              <Bar dataKey="basvuru" fill="var(--color-bank-soft)" name="Başvuru" radius={[4, 4, 0, 0]}>
                <LabelList
                  dataKey="basvuru"
                  formatter={(v) => formatCompact(Number(v) || 0)}
                  position="top"
                  style={{ fill: "var(--color-ink-soft)", fontSize: 10, fontWeight: 600 }}
                />
              </Bar>
              <Line
                dataKey="kullandirim"
                dot={false}
                name="Kullandırım"
                stroke="var(--color-bank-700)"
                strokeWidth={2}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card className="pb-3">
          <CardHeader title="Bayi Bazında Dönüşüm" />
          <div className="mt-3 overflow-x-auto px-5">
            <table className="[&_td]:px-2.5 [&_th]:px-2.5 w-full min-w-[560px]">
              <thead>
                <tr className="border-line border-b text-[11.5px] text-ink-muted">
                  <SortTh k="name" label="Bayi" sort={bayiSort} />
                  <SortTh align="right" k="basvuru" label="Başvuru" sort={bayiSort} />
                  <SortTh align="right" k="ret" label="Ret" sort={bayiSort} />
                  <SortTh align="right" k="kull" label="Kullandırım" sort={bayiSort} />
                  <SortTh align="right" k="oran" label="Oran" sort={bayiSort} />
                  <th className="w-24 py-2 font-medium" />
                </tr>
              </thead>
              <tbody>
                {bayiSort.sorted.map((b) => (
                  <tr
                    className={`cursor-pointer border-line border-b last:border-0 hover:bg-canvas/60 ${
                      bayi === b.name ? "bg-bank-tint/40" : ""
                    }`}
                    key={b.name}
                    onClick={() => setBayi((p) => (p === b.name ? ALL : b.name))}
                  >
                    <td className="py-2.5 font-medium text-[13px] text-ink">{b.name}</td>
                    <td className="py-2.5 text-right text-[12.5px] tabular-nums">{formatNumber(b.basvuru)}</td>
                    <td className="py-2.5 text-right text-[12.5px] tabular-nums">{formatNumber(b.ret)}</td>
                    <td className="py-2.5 text-right text-[12.5px] tabular-nums">{formatNumber(b.kull)}</td>
                    <td className="py-2.5 pr-1 text-right font-semibold text-[12.5px] text-bank-700 tabular-nums">
                      {formatPercent(b.oran * 100, 0)}
                    </td>
                    <td className="py-2.5 pl-3">
                      <MiniBar value={(b.oran / maxOran) * 100} />
                    </td>
                  </tr>
                ))}
                {bayiTablo.length === 0 && (
                  <tr>
                    <td className="py-6 text-center text-[13px] text-ink-muted" colSpan={6}>
                      Seçili filtrelerle kayıt yok.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* DETAY — Başvuru kayıtları */}
      <Card className="mt-5 pb-3">
        <CardHeader
          action={
            <span className="text-[12px] text-ink-muted">
              {formatNumber(f.length)} kayıt
              {f.length > 100 ? " · ilk 100 gösteriliyor, tümü CSV'de" : ""}
            </span>
          }
          title="Başvuru Kayıtları — Detay"
        />
        <div className="mt-3 overflow-x-auto px-5">
          <table className="[&_td]:px-2.5 [&_th]:px-2.5 w-full min-w-[760px]">
            <thead>
              <tr className="border-line border-b text-[11.5px] text-ink-muted">
                <SortTh k="yil" label="Dönem" sort={detSort} />
                <SortTh k="bolge" label="Bölge" sort={detSort} />
                <SortTh k="bayi" label="Bayi" sort={detSort} />
                <SortTh k="musteriTipi" label="Müşteri" sort={detSort} />
                <SortTh align="right" k="tutar" label="Tutar" sort={detSort} />
                <SortTh k="durum" label="Durum" sort={detSort} />
                <SortTh k="retNedeni" label="Ret Nedeni" sort={detSort} />
              </tr>
            </thead>
            <tbody>
              {detSort.sorted.slice(0, 100).map((r, i) => (
                <tr className="border-line border-b last:border-0" key={`${r.bayi}-${i}`}>
                  <td className="py-2 text-[12.5px] text-ink-soft tabular-nums">
                    {r.yil} {BASVURU_AYLAR[r.ay - 1]}
                  </td>
                  <td className="py-2 text-[12.5px] text-ink-soft">{r.bolge}</td>
                  <td className="py-2 text-[12.5px] text-ink">{r.bayi}</td>
                  <td className="py-2 text-[12.5px] text-ink-soft">{r.musteriTipi}</td>
                  <td className="py-2 text-right font-semibold text-[12.5px] text-ink tabular-nums">
                    {formatTRYCompact(r.tutar)}
                  </td>
                  <td className="py-2 text-[12.5px] text-ink-soft">{r.durum}</td>
                  <td className="py-2 pr-1 text-[12.5px] text-ink-muted">{r.retNedeni}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

export function BankBasvuruHunisi() {
  const { data, isPending, isError, refetch } = useApplications();
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
      <Body rows={data} />
    </ReportingShell>
  );
}
