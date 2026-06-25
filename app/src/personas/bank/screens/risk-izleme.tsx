import { AlertTriangle, Clock, Download, Gavel, Percent, RotateCcw, ShieldAlert } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { type RiskContract, type RiskDurum } from "@/data/risk-watch";
import { downloadCsv } from "@/lib/csv";
import { formatNumber, formatPercent, formatTRYCompact } from "@/lib/format";
import { useRiskContracts } from "@/queries/risk-watch";
import { ErrorState, LoadingState } from "@/ui/async-states";
import { Card, CardHeader } from "@/ui/card";
import { ALL, ChartCard, FilterSelect, uniq } from "@/ui/report-kit";
import { StatCard } from "@/ui/stat-card";
import { BankShell } from "../bank-shell";

const SHELL_PROPS = {
  breadcrumb: ["Raporlar", "Risk & İzleme"],
  subtitle: "İzleme listesi, NPL, kanuni takip ve first payment default.",
  title: "Risk & İzleme",
} as const;

const DURUM_RENK: Record<RiskDurum, string> = {
  Güncel: "bg-success-tint text-success",
  İzleme: "bg-warn-tint text-warn",
  NPL: "bg-danger-tint text-danger",
  "Kanuni Takip": "bg-danger text-white",
};
const BUCKETS = [
  { label: "1-30", lo: 0, hi: 30 },
  { label: "31-60", lo: 31, hi: 60 },
  { label: "61-90", lo: 61, hi: 90 },
  { label: "91-120", lo: 91, hi: 120 },
  { label: "120+", lo: 121, hi: 99_999 },
];

function Body({ rows }: { rows: RiskContract[] }) {
  const [distributor, setDistributor] = useState(ALL);
  const [bolge, setBolge] = useState(ALL);
  const [bayi, setBayi] = useState(ALL);
  const [tip, setTip] = useState(ALL);
  const [durum, setDurum] = useState(ALL);
  const [altSektor, setAltSektor] = useState(ALL);
  const [danisman, setDanisman] = useState(ALL);
  const [sektorMuduru, setSektorMuduru] = useState(ALL);
  const [bolgeYoneticisi, setBolgeYoneticisi] = useState(ALL);
  const [ilce, setIlce] = useState(ALL);

  const opts = useMemo(
    () => ({
      distributor: uniq(rows.map((r) => r.distributor)),
      bolge: uniq(rows.map((r) => r.bolge)),
      bayi: uniq(rows.map((r) => r.bayi)),
      tip: uniq(rows.map((r) => r.musteriTipi)),
      durum: uniq(rows.map((r) => r.durum)),
      altSektor: uniq(rows.map((r) => r.altSektor)),
      danisman: uniq(rows.map((r) => r.danisman)),
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
          (distributor === ALL || r.distributor === distributor) &&
          (bolge === ALL || r.bolge === bolge) &&
          (bayi === ALL || r.bayi === bayi) &&
          (tip === ALL || r.musteriTipi === tip) &&
          (durum === ALL || r.durum === durum) &&
          (altSektor === ALL || r.altSektor === altSektor) &&
          (danisman === ALL || r.danisman === danisman) &&
          (sektorMuduru === ALL || r.sektorMuduru === sektorMuduru) &&
          (bolgeYoneticisi === ALL || r.bolgeYoneticisi === bolgeYoneticisi) &&
          (ilce === ALL || r.ilce === ilce)
      ),
    [rows, distributor, bolge, bayi, tip, durum, altSektor, danisman, sektorMuduru, bolgeYoneticisi, ilce]
  );

  const k = useMemo(() => {
    const bakiye = f.reduce((a, r) => a + r.kalanBakiye, 0) || 1;
    const nplBakiye = f.filter((r) => r.gecikmeGun >= 90).reduce((a, r) => a + r.kalanBakiye, 0);
    const kt = f.filter((r) => r.durum === "Kanuni Takip");
    const ktBakiye = kt.reduce((a, r) => a + r.kalanBakiye, 0);
    return {
      adet: f.length,
      nplOran: nplBakiye / bakiye,
      ktAdet: kt.length,
      ktTutar: ktBakiye,
      ktOran: ktBakiye / bakiye,
      fpdOran: f.length ? f.filter((r) => r.fpd).length / f.length : 0,
      ortGecikme: f.length ? f.reduce((a, r) => a + r.gecikmeGun, 0) / f.length : 0,
      ortTahsilat: f.length ? f.reduce((a, r) => a + r.tahsilatOrani, 0) / f.length : 0,
    };
  }, [f]);

  const bucketDag = useMemo(
    () =>
      BUCKETS.map((b) => ({
        ay: b.label,
        adet: f.filter((r) => r.gecikmeGun >= b.lo && r.gecikmeGun <= b.hi).length,
      })),
    [f]
  );

  const durumDag = useMemo(() => {
    const order: RiskDurum[] = ["Güncel", "İzleme", "NPL", "Kanuni Takip"];
    return order
      .map((d) => ({ name: d, value: f.filter((r) => r.durum === d).length }))
      .filter((x) => x.value > 0);
  }, [f]);
  const DURUM_FILL: Record<RiskDurum, string> = {
    Güncel: "var(--color-success)",
    İzleme: "var(--color-warn)",
    NPL: "var(--color-danger)",
    "Kanuni Takip": "#7f1d1d",
  };

  const bolgeNpl = useMemo(() => {
    const m = new Map<string, { bakiye: number; npl: number }>();
    for (const r of f) {
      const e = m.get(r.bolge) ?? { bakiye: 0, npl: 0 };
      e.bakiye += r.kalanBakiye;
      if (r.gecikmeGun >= 90) e.npl += r.kalanBakiye;
      m.set(r.bolge, e);
    }
    return [...m.entries()]
      .map(([name, e]) => ({ name, oran: e.bakiye ? (e.npl / e.bakiye) * 100 : 0 }))
      .sort((a, b) => b.oran - a.oran);
  }, [f]);

  const liste = useMemo(() => [...f].sort((a, b) => b.gecikmeGun - a.gecikmeGun), [f]);

  const reset = () => {
    setDistributor(ALL);
    setBolge(ALL);
    setBayi(ALL);
    setTip(ALL);
    setDurum(ALL);
    setAltSektor(ALL);
    setDanisman(ALL);
    setSektorMuduru(ALL);
    setBolgeYoneticisi(ALL);
    setIlce(ALL);
  };
  const exportCsv = () =>
    downloadCsv(
      "risk-izleme",
      ["Sözleşme No", "Müşteri", "Müşteri Tipi", "Distribütör", "Bölge", "İl", "Bayi", "Alt Sektör", "Danışman", "Sektör Müdürü", "Bölge Yöneticisi", "İlçe", "Kredi Tutarı", "Kalan Bakiye", "Gecikme Gün", "Taksit Gecikme", "Durum", "FPD", "Tahsilat Oranı"],
      liste.map((r) => [r.sozlesmeNo, r.musteri, r.musteriTipi, r.distributor, r.bolge, r.il, r.bayi, r.altSektor, r.danisman, r.sektorMuduru, r.bolgeYoneticisi, r.ilce, r.krediTutari, r.kalanBakiye, r.gecikmeGun, r.taksitGecikme, r.durum, r.fpd ? "Evet" : "Hayır", (r.tahsilatOrani * 100).toFixed(1)])
    );

  return (
    <>
      <Card className="flex flex-wrap items-end gap-3 p-4">
        <FilterSelect label="Distribütör" onChange={setDistributor} options={opts.distributor} value={distributor} />
        <FilterSelect label="Bölge" onChange={setBolge} options={opts.bolge} value={bolge} />
        <FilterSelect label="Bayi" onChange={setBayi} options={opts.bayi} value={bayi} />
        <FilterSelect label="Müşteri Tipi" onChange={setTip} options={opts.tip} value={tip} />
        <FilterSelect label="Durum" onChange={setDurum} options={opts.durum} value={durum} />
        <FilterSelect label="Alt Sektör" onChange={setAltSektor} options={opts.altSektor} value={altSektor} />
        <FilterSelect label="Danışman" onChange={setDanisman} options={opts.danisman} value={danisman} />
        <FilterSelect label="Sektör Müdürü" onChange={setSektorMuduru} options={opts.sektorMuduru} value={sektorMuduru} />
        <FilterSelect label="Bölge Yöneticisi" onChange={setBolgeYoneticisi} options={opts.bolgeYoneticisi} value={bolgeYoneticisi} />
        <FilterSelect label="İlçe" onChange={setIlce} options={opts.ilce} value={ilce} />
        <button className="flex h-9 items-center gap-1.5 rounded-[10px] border border-line-strong bg-surface px-3 font-medium text-[13px] text-ink-soft hover:bg-canvas" onClick={reset} type="button">
          <RotateCcw size={15} /> Temizle
        </button>
        <button className="ml-auto flex h-9 items-center gap-1.5 rounded-[10px] bg-bank px-3.5 font-semibold text-[13px] text-white hover:bg-bank-600" onClick={exportCsv} type="button">
          <Download size={15} /> CSV İndir
        </button>
      </Card>

      <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={<ShieldAlert size={20} strokeWidth={1.9} />} label="İzlemedeki Sözleşme" sub="Filtreli" tone="bank" value={formatNumber(k.adet)} />
        <StatCard icon={<AlertTriangle size={20} strokeWidth={1.9} />} label="NPL Oranı" sub="Bakiye bazlı (90+ gün)" tone="warn" value={formatPercent(k.nplOran * 100, 1)} />
        <StatCard icon={<Gavel size={20} strokeWidth={1.9} />} label="KT Oranı" sub={`${formatNumber(k.ktAdet)} adet · ${formatTRYCompact(k.ktTutar)}`} tone="cust" value={formatPercent(k.ktOran * 100, 1)} />
        <StatCard icon={<Percent size={20} strokeWidth={1.9} />} label="Tahsilat Oranı" sub="Ortalama" tone="teal" value={formatPercent(k.ortTahsilat * 100, 1)} />
        <StatCard icon={<AlertTriangle size={20} strokeWidth={1.9} />} label="FPD Oranı" sub="First payment default" tone="warn" value={formatPercent(k.fpdOran * 100, 1)} />
        <StatCard icon={<Clock size={20} strokeWidth={1.9} />} label="Ort. Gecikme" sub="Gün" tone="dealer" value={`${k.ortGecikme.toFixed(0)} gün`} />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <ChartCard title="Gecikme Gün Kovaları">
          <ResponsiveContainer height="100%" width="100%">
            <BarChart data={bucketDag} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
              <CartesianGrid stroke="var(--color-line)" vertical={false} />
              <XAxis axisLine={false} dataKey="ay" tick={{ fill: "var(--color-ink-muted)", fontSize: 11 }} tickLine={false} />
              <YAxis axisLine={false} tick={{ fill: "var(--color-ink-muted)", fontSize: 11 }} tickLine={false} width={32} />
              <Tooltip />
              <Bar dataKey="adet" radius={[4, 4, 0, 0]}>
                {bucketDag.map((b, i) => (
                  <Cell fill={i >= 3 ? "var(--color-danger)" : i === 2 ? "var(--color-warn)" : "var(--color-bank)"} key={b.ay} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Durum Dağılımı">
          <ResponsiveContainer height="100%" width="100%">
            <PieChart>
              <Pie data={durumDag} dataKey="value" innerRadius={56} nameKey="name" outerRadius={92} paddingAngle={2} stroke="none">
                {durumDag.map((s) => (
                  <Cell fill={DURUM_FILL[s.name as RiskDurum]} key={s.name} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${formatNumber(Number(v) || 0)} sözleşme`} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard className="mt-5" title="Bölge Bazında NPL Oranı">
        <ResponsiveContainer height="100%" width="100%">
          <BarChart data={bolgeNpl} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
            <CartesianGrid stroke="var(--color-line)" vertical={false} />
            <XAxis axisLine={false} dataKey="name" tick={{ fill: "var(--color-ink-muted)", fontSize: 11 }} tickLine={false} />
            <YAxis axisLine={false} tick={{ fill: "var(--color-ink-muted)", fontSize: 11 }} tickFormatter={(v) => `%${v}`} tickLine={false} width={40} />
            <Tooltip formatter={(v) => formatPercent(Number(v) || 0, 1)} />
            <Bar dataKey="oran" fill="var(--color-danger)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <Card className="mt-5 pb-3">
        <CardHeader
          action={
            <span className="text-[12px] text-ink-muted">
              {formatNumber(liste.length)} sözleşme
              {liste.length > 100 ? " · ilk 100 gösteriliyor, tümü CSV'de" : ""}
            </span>
          }
          title="İzleme Listesi"
        />
        <div className="mt-3 overflow-x-auto px-5">
          <table className="[&_td]:px-2.5 [&_th]:px-2.5 w-full min-w-[780px]">
            <thead>
              <tr className="border-line border-b text-[11.5px] text-ink-muted">
                <th className="py-2 text-left font-medium">Sözleşme</th>
                <th className="py-2 text-left font-medium">Müşteri</th>
                <th className="py-2 text-left font-medium">Bayi</th>
                <th className="py-2 text-right font-medium">Kredi</th>
                <th className="py-2 text-right font-medium">Kalan Bakiye</th>
                <th className="py-2 text-right font-medium">Gecikme</th>
                <th className="py-2 pr-1 text-left font-medium">Durum</th>
              </tr>
            </thead>
            <tbody>
              {liste.slice(0, 100).map((r) => (
                <tr className="border-line border-b last:border-0" key={r.sozlesmeNo}>
                  <td className="py-2 font-medium text-[12.5px] text-ink tabular-nums">{r.sozlesmeNo}</td>
                  <td className="py-2 text-[12.5px] text-ink-soft">{r.musteri}</td>
                  <td className="py-2 text-[12.5px] text-ink-soft">{r.bayi}</td>
                  <td className="py-2 text-right text-[12.5px] tabular-nums">{formatTRYCompact(r.krediTutari)}</td>
                  <td className="py-2 text-right text-[12.5px] tabular-nums">{formatTRYCompact(r.kalanBakiye)}</td>
                  <td className="py-2 text-right font-semibold text-[12.5px] tabular-nums">{r.gecikmeGun} gün</td>
                  <td className="py-2 pr-1">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 font-semibold text-[11px] ${DURUM_RENK[r.durum]}`}>
                      {r.durum}
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

export function BankRiskIzleme() {
  const { data, isPending, isError, refetch } = useRiskContracts();
  if (isPending) {
    return (
      <BankShell {...SHELL_PROPS}>
        <LoadingState />
      </BankShell>
    );
  }
  if (isError || !data) {
    return (
      <BankShell {...SHELL_PROPS}>
        <ErrorState onRetry={() => refetch()} />
      </BankShell>
    );
  }
  return (
    <BankShell {...SHELL_PROPS}>
      <Body rows={data} />
    </BankShell>
  );
}
