import { Download } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { type MissingDoc } from "@/data/missing-docs";
import { downloadCsv } from "@/lib/csv";
import { formatNumber } from "@/lib/format";
import { useMissingDocs } from "@/queries/missing-docs";
import { ErrorState, LoadingState } from "@/ui/async-states";
import { Card, CardHeader } from "@/ui/card";
import { ALL, ChartCard, DonutChart, FilterBar, KpiStrip, SortTh, uniq, useSort } from "@/ui/report-kit";
import { ReportingShell } from "../reporting-shell";

const SHELL_PROPS = {
  breadcrumb: ["Raporlar", "Eksik Evrak"],
  subtitle: "Eksik/hatalı evrak takibi — tür, hata türü ve bayi kırılımı.",
  title: "Eksik Evrak Takibi",
} as const;

const PALETTE = ["E2603B", "F2A93B", "9CA3AF", "57C99A", "127A9B"];

function countBy(rows: MissingDoc[], key: "hataTuru" | "evrakTuru" | "bayi") {
  const m = new Map<string, number>();
  for (const r of rows) {
    m.set(r[key], (m.get(r[key]) ?? 0) + 1);
  }
  return [...m.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
}

/** Uzun evrak adlarını grafik ekseninde kısaltır (tekrar eden "Sözleşmesi" vb. atılır). */
function kisaltEvrak(s: string): string {
  return s
    .replace(/ Sözleşmesi$/, "")
    .replace(/ Sözleşme$/, "")
    .replace(/ Evrakı$/, "")
    .replace(/ Taahhütnamesi$/, " Taahhüt")
    .replace(/ Aydınlatma Metni$/, " Aydınlatma")
    .replace(/ Protokolü$/, " Protokol");
}

function Body({ rows }: { rows: MissingDoc[] }) {
  const [tur, setTur] = useState(ALL);
  const [sozlesmeTuru, setSozlesmeTuru] = useState(ALL);
  const [distributor, setDistributor] = useState(ALL);
  const [bolge, setBolge] = useState(ALL);
  const [bayi, setBayi] = useState(ALL);
  const [hata, setHata] = useState(ALL);
  const [altSektor, setAltSektor] = useState(ALL);
  const [danisman, setDanisman] = useState(ALL);
  const [sektorMuduru, setSektorMuduru] = useState(ALL);
  const [bolgeYoneticisi, setBolgeYoneticisi] = useState(ALL);
  const [il, setIl] = useState(ALL);
  const [ilce, setIlce] = useState(ALL);

  const opts = useMemo(
    () => ({
      tur: uniq(rows.map((r) => r.tur)),
      sozlesmeTuru: uniq(rows.map((r) => r.sozlesmeTuru)),
      distributor: uniq(rows.map((r) => r.distributor)),
      bolge: uniq(rows.map((r) => r.bolge)),
      il: uniq(rows.map((r) => r.il)),
      ilce: uniq(rows.map((r) => r.ilce)),
      bayi: uniq(rows.map((r) => r.bayi)),
      hata: uniq(rows.map((r) => r.hataTuru)),
      altSektor: uniq(rows.map((r) => r.altSektor)),
      danisman: uniq(rows.map((r) => r.danisman)),
      sektorMuduru: uniq(rows.map((r) => r.sektorMuduru)),
      bolgeYoneticisi: uniq(rows.map((r) => r.bolgeYoneticisi)),
    }),
    [rows]
  );

  const f = useMemo(
    () =>
      rows.filter(
        (r) =>
          (tur === ALL || r.tur === tur) &&
          (sozlesmeTuru === ALL || r.sozlesmeTuru === sozlesmeTuru) &&
          (distributor === ALL || r.distributor === distributor) &&
          (bolge === ALL || r.bolge === bolge) &&
          (il === ALL || r.il === il) &&
          (ilce === ALL || r.ilce === ilce) &&
          (bayi === ALL || r.bayi === bayi) &&
          (hata === ALL || r.hataTuru === hata) &&
          (altSektor === ALL || r.altSektor === altSektor) &&
          (danisman === ALL || r.danisman === danisman) &&
          (sektorMuduru === ALL || r.sektorMuduru === sektorMuduru) &&
          (bolgeYoneticisi === ALL || r.bolgeYoneticisi === bolgeYoneticisi)
      ),
    [rows, tur, sozlesmeTuru, distributor, bolge, il, ilce, bayi, hata, altSektor, danisman, sektorMuduru, bolgeYoneticisi]
  );

  const hataDag = useMemo(() => countBy(f, "hataTuru"), [f]);
  const evrakDag = useMemo(() => countBy(f, "evrakTuru"), [f]);
  const bayiDag = useMemo(() => countBy(f, "bayi"), [f]);
  const xSort = useSort(f, "sozlesmeNo", "asc");

  const k = useMemo(
    () => ({
      toplam: f.length,
      tuketici: f.filter((r) => r.tur === "Tüketici").length,
      bayi: f.filter((r) => r.tur === "Bayi").length,
      spot: f.filter((r) => r.tur === "Spot").length,
      filo: f.filter((r) => r.tur === "Filo").length,
      enSikHata: hataDag[0]?.name ?? "—",
      etkilenenBayi: new Set(f.map((r) => r.bayi)).size,
    }),
    [f, hataDag]
  );

  const reset = () => {
    setTur(ALL);
    setSozlesmeTuru(ALL);
    setDistributor(ALL);
    setBolge(ALL);
    setBayi(ALL);
    setHata(ALL);
    setAltSektor(ALL);
    setDanisman(ALL);
    setSektorMuduru(ALL);
    setBolgeYoneticisi(ALL);
    setIl(ALL);
    setIlce(ALL);
  };
  const exportCsv = () =>
    downloadCsv(
      "eksik-evrak",
      ["Sözleşme No", "Tür", "Sözleşme Türü", "Müşteri/Tedarikçi", "Distribütör", "Bölge", "İl", "Bayi", "Evrak Tarihi", "Evrak Türü", "Hata Türü", "Alt Sektör", "Danışman", "Sektör Müdürü", "Bölge Yöneticisi"],
      f.map((r) => [r.sozlesmeNo, r.tur, r.sozlesmeTuru, r.musteriTedarikci, r.distributor, r.bolge, r.il, r.bayi, r.evrakTarihi, r.evrakTuru, r.hataTuru, r.altSektor, r.danisman, r.sektorMuduru, r.bolgeYoneticisi])
    );

  return (
    <>
      <FilterBar
        filters={[
          { key: "tur", label: "Tür", value: tur, options: opts.tur, onChange: setTur, width: 140 },
          { key: "bolge", label: "Bölge", value: bolge, options: opts.bolge, onChange: setBolge },
          { key: "bayi", label: "Bayi", value: bayi, options: opts.bayi, onChange: setBayi },
          { key: "il", label: "İl", value: il, options: opts.il, onChange: setIl, width: 120 },
          { key: "ilce", label: "İlçe", value: ilce, options: opts.ilce, onChange: setIlce, width: 120 },
          { key: "sozlesmeTuru", label: "Sözleşme Türü", value: sozlesmeTuru, options: opts.sozlesmeTuru, onChange: setSozlesmeTuru, width: 150 },
          { key: "hata", label: "Hata Türü", value: hata, options: opts.hata, onChange: setHata, width: 170 },
          { key: "distributor", label: "Distribütör", value: distributor, options: opts.distributor, onChange: setDistributor },
          { key: "altSektor", label: "Alt Sektör", value: altSektor, options: opts.altSektor, onChange: setAltSektor },
          { key: "danisman", label: "Danışman", value: danisman, options: opts.danisman, onChange: setDanisman },
          { key: "sektorMuduru", label: "Sektör Müdürü", value: sektorMuduru, options: opts.sektorMuduru, onChange: setSektorMuduru },
          { key: "bolgeYoneticisi", label: "Bölge Yöneticisi", value: bolgeYoneticisi, options: opts.bolgeYoneticisi, onChange: setBolgeYoneticisi },
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
          { label: "Toplam Eksik Evrak", value: formatNumber(k.toplam), sub: "Filtreli" },
          { label: "Tüketici", value: formatNumber(k.tuketici), sub: "Kayıt" },
          { label: "Bayi", value: formatNumber(k.bayi), sub: "Kayıt" },
          { label: "Spot", value: formatNumber(k.spot), sub: "Kayıt" },
          { label: "Filo", value: formatNumber(k.filo), sub: "Kayıt" },
          { label: "En Sık Hata", value: k.enSikHata, sub: "Tür" },
          { label: "Etkilenen Bayi", value: formatNumber(k.etkilenenBayi), sub: "Adet" },
        ]}
      />

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <ChartCard title="Hata Türü Dağılımı">
          <DonutChart
            colors={PALETTE.map((c) => `#${c}`)}
            data={hataDag}
            formatValue={formatNumber}
          />
        </ChartCard>

        <ChartCard title="Bayi Bazında Eksik Adedi">
          <ResponsiveContainer height="100%" width="100%">
            <BarChart data={bayiDag} layout="vertical" margin={{ top: 4, right: 12, left: 8, bottom: 0 }}>
              <XAxis hide type="number" />
              <YAxis axisLine={false} dataKey="name" tick={{ fill: "var(--color-ink-soft)", fontSize: 11 }} tickLine={false} type="category" width={108} />
              <Tooltip formatter={(v) => `${formatNumber(Number(v) || 0)} kayıt`} />
              <Bar dataKey="value" fill="var(--color-warn)" radius={[0, 4, 4, 0]}>
                <LabelList dataKey="value" position="right" formatter={(v) => formatNumber(Number(v) || 0)} style={{ fill: "var(--color-ink-soft)", fontSize: 10, fontWeight: 600 }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard className="mt-5" title="Evrak Türü Dağılımı">
        <ResponsiveContainer height="100%" width="100%">
          <BarChart data={evrakDag} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
            <CartesianGrid stroke="var(--color-line)" vertical={false} />
            <XAxis axisLine={false} dataKey="name" interval={0} tick={{ fill: "var(--color-ink-muted)", fontSize: 10 }} tickFormatter={kisaltEvrak} tickLine={false} />
            <YAxis axisLine={false} tick={{ fill: "var(--color-ink-muted)", fontSize: 11 }} tickLine={false} width={32} />
            <Tooltip formatter={(v) => `${formatNumber(Number(v) || 0)} kayıt`} />
            <Bar dataKey="value" fill="var(--color-bank)" radius={[4, 4, 0, 0]}>
              <LabelList dataKey="value" position="top" formatter={(v) => formatNumber(Number(v) || 0)} style={{ fill: "var(--color-ink-soft)", fontSize: 10, fontWeight: 600 }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <Card className="mt-5 pb-3">
        <CardHeader
          action={
            <span className="text-[12px] text-ink-muted">
              {formatNumber(f.length)} kayıt
              {f.length > 100 ? " · ilk 100 gösteriliyor, tümü CSV'de" : ""}
            </span>
          }
          title="Eksik Evrak Listesi"
        />
        <div className="mt-3 overflow-x-auto px-5">
          <table className="[&_td]:px-2.5 [&_th]:px-2.5 w-full min-w-[980px]">
            <thead>
              <tr className="border-line border-b text-[11.5px] text-ink-muted">
                <SortTh k="sozlesmeNo" label="Sözleşme" sort={xSort} />
                <SortTh k="tur" label="Tür" sort={xSort} />
                <SortTh k="sozlesmeTuru" label="Sözleşme Türü" sort={xSort} />
                <SortTh k="musteriTedarikci" label="Müşteri / Tedarikçi" sort={xSort} />
                <SortTh k="bayi" label="Bayi" sort={xSort} />
                <SortTh k="evrakTarihi" label="Evrak Tarihi" sort={xSort} />
                <SortTh k="evrakTuru" label="Evrak Türü" sort={xSort} />
                <SortTh className="pr-1" k="hataTuru" label="Hata Türü" sort={xSort} />
              </tr>
            </thead>
            <tbody>
              {xSort.sorted.slice(0, 100).map((r) => (
                <tr className="border-line border-b last:border-0" key={r.sozlesmeNo}>
                  <td className="py-2 font-medium text-[12.5px] text-ink tabular-nums">{r.sozlesmeNo}</td>
                  <td className="py-2 text-[12.5px] text-ink-soft">{r.tur}</td>
                  <td className="py-2 text-[12.5px] text-ink-soft">{r.sozlesmeTuru}</td>
                  <td className="py-2 text-[12.5px] text-ink-soft">{r.musteriTedarikci}</td>
                  <td className="py-2 text-[12.5px] text-ink-soft">{r.bayi}</td>
                  <td className="py-2 text-[12.5px] text-ink-soft tabular-nums">{r.evrakTarihi}</td>
                  <td className="py-2 text-[12.5px] text-ink-soft">{r.evrakTuru}</td>
                  <td className="py-2 pr-1">
                    <span className="inline-flex rounded-full bg-warn-tint px-2.5 py-0.5 font-semibold text-[11px] text-warn">
                      {r.hataTuru}
                    </span>
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

export function BankEksikEvrak() {
  const { data, isPending, isError, refetch } = useMissingDocs();
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
