import { Download } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { STOK_AYLAR, type StockLoan } from "@/data/stock-financing";
import { downloadCsv } from "@/lib/csv";
import { formatCompact, formatNumber, formatPercent, formatTRY, formatTRYCompact } from "@/lib/format";
import { useStockLoans } from "@/queries/stock-financing";
import { ErrorState, LoadingState } from "@/ui/async-states";
import { Card, CardHeader } from "@/ui/card";
import { ALL, ChartCard, FilterBar, KpiStrip, SortTh, uniq, useSort } from "@/ui/report-kit";
import { ReportingShell } from "../reporting-shell";

const SHELL_PROPS = {
  breadcrumb: ["Raporlar", "Stok Finansmanı"],
  subtitle: "Tedarikçi/bayi stok kredileri — açık/kapalı, kapama süresi, tahsilat.",
  title: "Stok Finansmanı",
} as const;

function Body({ rows }: { rows: StockLoan[] }) {
  const [yil, setYil] = useState(ALL);
  const [distributor, setDistributor] = useState(ALL);
  const [bolge, setBolge] = useState(ALL);
  const [bayi, setBayi] = useState(ALL);
  const [tedarikci, setTedarikci] = useState(ALL);
  const [durum, setDurum] = useState(ALL);
  const [altSektor, setAltSektor] = useState(ALL);
  const [sektorMuduru, setSektorMuduru] = useState(ALL);
  const [bolgeYoneticisi, setBolgeYoneticisi] = useState(ALL);
  const [ilce, setIlce] = useState(ALL);

  const opts = useMemo(
    () => ({
      yil: uniq(rows.map((r) => String(r.yil))),
      distributor: uniq(rows.map((r) => r.distributor)),
      bolge: uniq(rows.map((r) => r.bolge)),
      bayi: uniq(rows.map((r) => r.bayi)),
      tedarikci: uniq(rows.map((r) => r.tedarikci)),
      durum: uniq(rows.map((r) => r.durum)),
      altSektor: uniq(rows.map((r) => r.altSektor)),
      sektorMuduru: uniq(rows.map((r) => r.sektorMuduru)),
      bolgeYoneticisi: uniq(rows.map((r) => r.bolgeYoneticisi)),
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
          (tedarikci === ALL || r.tedarikci === tedarikci) &&
          (durum === ALL || r.durum === durum) &&
          (altSektor === ALL || r.altSektor === altSektor) &&
          (sektorMuduru === ALL || r.sektorMuduru === sektorMuduru) &&
          (bolgeYoneticisi === ALL || r.bolgeYoneticisi === bolgeYoneticisi) &&
          (ilce === ALL || r.ilce === ilce)
      ),
    [rows, yil, distributor, bolge, bayi, tedarikci, durum, altSektor, sektorMuduru, bolgeYoneticisi, ilce]
  );

  const k = useMemo(() => {
    const acik = f.filter((r) => r.durum === "Açık");
    const kapali = f.filter((r) => r.durum === "Kapalı");
    const toplam = f.reduce((a, r) => a + r.krediTutari, 0);
    return {
      toplam,
      acikTutar: acik.reduce((a, r) => a + r.krediTutari, 0),
      acikAdet: acik.length,
      kapaliTutar: kapali.reduce((a, r) => a + r.krediTutari, 0),
      kapaliAdet: kapali.length,
      ortKredi: f.length ? toplam / f.length : 0,
      ortVade: f.length ? f.reduce((a, r) => a + r.vadeGun, 0) / f.length : 0,
      ortKapama: kapali.length
        ? kapali.reduce((a, r) => a + r.kapamaGun, 0) / kapali.length
        : 0,
      tahsilat: f.reduce((a, r) => a + r.tahsilat, 0),
      ortFaiz: f.length ? f.reduce((a, r) => a + r.faiz, 0) / f.length : 0,
    };
  }, [f]);

  const byTedarikci = useMemo(() => {
    type Acc = {
      tutar: number; acik: number; acikTutar: number; kapali: number;
      kapaliTutar: number; tahsilat: number; kapamaT: number; vadeT: number;
      faizT: number; n: number;
    };
    const m = new Map<string, Acc>();
    for (const r of f) {
      const e =
        m.get(r.tedarikci) ??
        { tutar: 0, acik: 0, acikTutar: 0, kapali: 0, kapaliTutar: 0, tahsilat: 0, kapamaT: 0, vadeT: 0, faizT: 0, n: 0 };
      e.tutar += r.krediTutari;
      e.tahsilat += r.tahsilat;
      e.vadeT += r.vadeGun;
      e.faizT += r.faiz;
      e.n += 1;
      if (r.durum === "Açık") {
        e.acik += 1;
        e.acikTutar += r.krediTutari;
      } else {
        e.kapali += 1;
        e.kapaliTutar += r.krediTutari;
        e.kapamaT += r.kapamaGun;
      }
      m.set(r.tedarikci, e);
    }
    return [...m.entries()]
      .map(([name, e]) => ({
        name,
        tutar: e.tutar,
        acik: e.acik,
        acikTutar: e.acikTutar,
        kapali: e.kapali,
        kapaliTutar: e.kapaliTutar,
        tahsilat: e.tahsilat,
        ortVade: e.n ? e.vadeT / e.n : 0,
        ortFaiz: e.n ? e.faizT / e.n : 0,
        ortKapama: e.kapali ? e.kapamaT / e.kapali : 0,
      }))
      .sort((a, b) => b.tutar - a.tutar);
  }, [f]);

  const tSort = useSort(byTedarikci, "tutar", "desc");
  const xSort = useSort(f, "krediTutari", "desc");

  const durumDag = useMemo(
    () => [
      { name: "Açık", value: k.acikTutar },
      { name: "Kapalı", value: k.toplam - k.acikTutar },
    ],
    [k]
  );

  const aylik = useMemo(() => {
    const g = STOK_AYLAR.map((ay) => ({ ay, tutar: 0 }));
    for (const r of f) {
      g[r.ay - 1].tutar += r.krediTutari;
    }
    return g;
  }, [f]);

  const reset = () => {
    setYil(ALL);
    setDistributor(ALL);
    setBolge(ALL);
    setBayi(ALL);
    setTedarikci(ALL);
    setDurum(ALL);
    setAltSektor(ALL);
    setSektorMuduru(ALL);
    setBolgeYoneticisi(ALL);
    setIlce(ALL);
  };
  const exportCsv = () =>
    downloadCsv(
      "stok-finansmani",
      [
        "Yıl", "Ay", "Distribütör", "Bölge", "İl", "Bayi", "Tedarikçi",
        "Alt Sektör", "Sektör Müdürü", "Bölge Yöneticisi", "İlçe",
        "Marka", "Model", "Model Yıl", "Araç Yaşı", "Plaka", "Satış Bedeli",
        "Kasko Değeri", "Kredi Tutarı", "Vade (Gün)", "Faiz (%)", "Dosya Masrafı",
        "Durum", "Kapama Gün", "Tahsilat",
      ],
      f.map((r) => [
        r.yil, STOK_AYLAR[r.ay - 1], r.distributor, r.bolge, r.il, r.bayi,
        r.tedarikci, r.altSektor, r.sektorMuduru, r.bolgeYoneticisi, r.ilce,
        r.marka, r.model, r.modelYil, r.aracYas, r.plaka,
        r.satisBedeli, r.kaskoDegeri, r.krediTutari, r.vadeGun, r.faiz,
        r.dosyaMasrafi, r.durum, r.kapamaGun || "", r.tahsilat || "",
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
          { key: "tedarikci", label: "Tedarikçi", value: tedarikci, options: opts.tedarikci, onChange: setTedarikci },
          { key: "durum", label: "Durum", value: durum, options: opts.durum, onChange: setDurum, width: 120 },
          { key: "altSektor", label: "Alt Sektör", value: altSektor, options: opts.altSektor, onChange: setAltSektor },
          { key: "sektorMuduru", label: "Sektör Müdürü", value: sektorMuduru, options: opts.sektorMuduru, onChange: setSektorMuduru },
          { key: "bolgeYoneticisi", label: "Bölge Yöneticisi", value: bolgeYoneticisi, options: opts.bolgeYoneticisi, onChange: setBolgeYoneticisi },
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
          { label: "Toplam Stok Kredisi", value: formatTRYCompact(k.toplam), sub: `${formatNumber(f.length)} kayıt` },
          { label: "Açık Kredi Tutarı", value: formatTRYCompact(k.acikTutar), sub: `${formatNumber(k.acikAdet)} açık` },
          { label: "Kapalı Kredi Tutarı", value: formatTRYCompact(k.kapaliTutar), sub: `${formatNumber(k.kapaliAdet)} kapalı` },
          { label: "Ort. Kredi Tutarı", value: formatTRYCompact(k.ortKredi), sub: "Kayıt başına" },
          { label: "Ort. Vade", value: `${k.ortVade.toFixed(0)} gün`, sub: "Gün" },
          { label: "Ort. Kapama Gün", value: `${k.ortKapama.toFixed(0)} gün`, sub: "Kapalı krediler" },
          { label: "Toplam Tahsilat", value: formatTRYCompact(k.tahsilat), sub: "Kapanan" },
          { label: "Ort. Faiz", value: formatPercent(k.ortFaiz, 2), sub: "Aylık" },
        ]}
      />

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <ChartCard title="Tedarikçi Bazında Hacim">
          <ResponsiveContainer height="100%" width="100%">
            <BarChart data={byTedarikci} layout="vertical" margin={{ top: 4, right: 12, left: 8, bottom: 0 }}>
              <XAxis hide type="number" />
              <YAxis axisLine={false} dataKey="name" tick={{ fill: "var(--color-ink-soft)", fontSize: 11 }} tickLine={false} type="category" width={108} />
              <Tooltip formatter={(v) => formatTRY(Number(v) || 0)} />
              <Bar dataKey="tutar" fill="var(--color-bank)" radius={[0, 4, 4, 0]}>
                <LabelList dataKey="tutar" formatter={(v) => formatCompact(Number(v) || 0)} position="right" style={{ fill: "var(--color-ink-soft)", fontSize: 10, fontWeight: 600 }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Açık / Kapalı Dağılımı (Tutar)">
          <ResponsiveContainer height="100%" width="100%">
            <PieChart>
              <Pie data={durumDag} dataKey="value" innerRadius={56} label={(e: { value?: number }) => formatCompact(e.value ?? 0)} labelLine={false} nameKey="name" outerRadius={92} paddingAngle={2} stroke="none">
                <Cell fill="var(--color-warn)" />
                <Cell fill="var(--color-bank)" />
              </Pie>
              <Tooltip formatter={(v) => formatTRY(Number(v) || 0)} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard className="mt-5" title="Aylık Açılan Stok Kredisi">
        <ResponsiveContainer height="100%" width="100%">
          <BarChart data={aylik} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
            <CartesianGrid stroke="var(--color-line)" vertical={false} />
            <XAxis axisLine={false} dataKey="ay" tick={{ fill: "var(--color-ink-muted)", fontSize: 11 }} tickLine={false} />
            <YAxis axisLine={false} tick={{ fill: "var(--color-ink-muted)", fontSize: 11 }} tickFormatter={formatTRYCompact} tickLine={false} width={60} />
            <Tooltip formatter={(v) => formatTRY(Number(v) || 0)} />
            <Bar dataKey="tutar" fill="var(--color-bank-700)" radius={[4, 4, 0, 0]}>
              <LabelList dataKey="tutar" formatter={(v) => formatCompact(Number(v) || 0)} position="top" style={{ fill: "var(--color-ink-soft)", fontSize: 10, fontWeight: 600 }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <Card className="mt-5 pb-3">
        <CardHeader title="Tedarikçi Bazında Özet" />
        <div className="mt-3 overflow-x-auto px-5">
          <table className="[&_td]:px-2.5 [&_th]:px-2.5 w-full min-w-[900px]">
            <thead>
              <tr className="border-line border-b text-[11.5px] text-ink-muted">
                <SortTh k="name" label="Tedarikçi" sort={tSort} />
                <SortTh align="right" k="tutar" label="Hacim" sort={tSort} />
                <SortTh align="right" k="acikTutar" label="Açık (Adet / Tutar)" sort={tSort} />
                <SortTh align="right" k="kapaliTutar" label="Kapalı (Adet / Tutar)" sort={tSort} />
                <SortTh align="right" k="ortVade" label="Ort. Vade" sort={tSort} />
                <SortTh align="right" k="ortFaiz" label="Ort. Faiz" sort={tSort} />
                <SortTh align="right" k="ortKapama" label="Ort. Kapama" sort={tSort} />
                <SortTh align="right" k="tahsilat" label="Tahsilat" sort={tSort} />
              </tr>
            </thead>
            <tbody>
              {tSort.sorted.map((t) => (
                <tr className="border-line border-b last:border-0" key={t.name}>
                  <td className="py-2.5 font-medium text-[13px] text-ink">{t.name}</td>
                  <td className="py-2.5 text-right text-[12.5px] tabular-nums">{formatTRYCompact(t.tutar)}</td>
                  <td className="py-2.5 text-right text-[12.5px] tabular-nums">
                    {formatNumber(t.acik)} / {formatTRYCompact(t.acikTutar)}
                  </td>
                  <td className="py-2.5 text-right text-[12.5px] tabular-nums">
                    {formatNumber(t.kapali)} / {formatTRYCompact(t.kapaliTutar)}
                  </td>
                  <td className="py-2.5 text-right text-[12.5px] tabular-nums">{t.ortVade.toFixed(0)} gün</td>
                  <td className="py-2.5 text-right text-[12.5px] tabular-nums">{formatPercent(t.ortFaiz, 2)}</td>
                  <td className="py-2.5 text-right text-[12.5px] tabular-nums">{t.ortKapama.toFixed(0)} gün</td>
                  <td className="py-2.5 pr-1 text-right font-semibold text-[12.5px] text-bank-700 tabular-nums">{formatTRYCompact(t.tahsilat)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* DETAY — Stok Finansmanı (kayıt-bazlı) */}
      <Card className="mt-5 pb-3">
        <CardHeader
          action={
            <span className="text-[12px] text-ink-muted">
              {formatNumber(f.length)} kayıt
              {f.length > 100 ? " · ilk 100 gösteriliyor, tümü CSV'de" : ""}
            </span>
          }
          title="Stok Finansmanı — Detay"
        />
        <div className="mt-3 overflow-x-auto px-5">
          <table className="[&_td]:px-2.5 [&_th]:px-2.5 w-full min-w-[1040px]">
            <thead>
              <tr className="border-line border-b text-[11.5px] text-ink-muted">
                <SortTh k="tedarikci" label="Tedarikçi" sort={xSort} />
                <SortTh k="bayi" label="Bayi" sort={xSort} />
                <SortTh k="marka" label="Araç" sort={xSort} />
                <SortTh k="plaka" label="Plaka" sort={xSort} />
                <SortTh align="right" k="satisBedeli" label="Satış Bedeli" sort={xSort} />
                <SortTh align="right" k="krediTutari" label="Kredi Tutarı" sort={xSort} />
                <SortTh align="right" k="vadeGun" label="Vade" sort={xSort} />
                <SortTh align="right" k="faiz" label="Faiz" sort={xSort} />
                <SortTh k="durum" label="Durum" sort={xSort} />
                <SortTh align="right" k="tahsilat" label="Tahsilat" sort={xSort} />
              </tr>
            </thead>
            <tbody>
              {xSort.sorted.slice(0, 100).map((r, i) => (
                <tr className="border-line border-b last:border-0" key={`${r.tedarikci}-${i}`}>
                  <td className="py-2 text-[12.5px] text-ink-soft">{r.tedarikci}</td>
                  <td className="py-2 text-[12.5px] text-ink-soft">{r.bayi}</td>
                  <td className="py-2 text-[12.5px] text-ink">
                    {r.marka} {r.model} <span className="text-ink-muted">· {r.modelYil}</span>
                  </td>
                  <td className="py-2 text-[12.5px] text-ink-soft tabular-nums">{r.plaka}</td>
                  <td className="py-2 text-right text-[12.5px] tabular-nums">{formatTRYCompact(r.satisBedeli)}</td>
                  <td className="py-2 text-right font-semibold text-[12.5px] text-ink tabular-nums">{formatTRYCompact(r.krediTutari)}</td>
                  <td className="py-2 text-right text-[12.5px] tabular-nums">{r.vadeGun} gün</td>
                  <td className="py-2 text-right text-[12.5px] tabular-nums">{formatPercent(r.faiz, 2)}</td>
                  <td className="py-2">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 font-semibold text-[11px] ${r.durum === "Açık" ? "bg-warn-tint text-warn" : "bg-success-tint text-success"}`}>
                      {r.durum}
                    </span>
                  </td>
                  <td className="py-2 pr-1 text-right text-[12.5px] tabular-nums">{r.tahsilat ? formatTRYCompact(r.tahsilat) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

export function BankStokFinansmani() {
  const { data, isPending, isError, refetch } = useStockLoans();
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
