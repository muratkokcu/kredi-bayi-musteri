import { Download } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { type LimitRow } from "@/data/limits";
import { downloadCsv } from "@/lib/csv";
import { formatNumber, formatPercent, formatTRY, formatTRYCompact } from "@/lib/format";
import { useLimits } from "@/queries/limits";
import { ErrorState, LoadingState } from "@/ui/async-states";
import { MiniBar } from "@/ui/badge";
import { Card, CardHeader } from "@/ui/card";
import { ALL, ChartCard, FilterBar, KpiStrip, uniq } from "@/ui/report-kit";
import { ReportingShell } from "../reporting-shell";

const SHELL_PROPS = {
  breadcrumb: ["Raporlar", "Limit Takip"],
  subtitle: "Grup/firma limitleri — tahsis, kullanım ve garantörlük.",
  title: "Limit Takip",
} as const;

const pct = (a: number, b: number) => (b ? a / b : 0);

function Body({ rows }: { rows: LimitRow[] }) {
  const [yil, setYil] = useState(ALL);
  const [distributor, setDistributor] = useState(ALL);
  const [bolge, setBolge] = useState(ALL);
  const [bayi, setBayi] = useState(ALL);
  const [grup, setGrup] = useState(ALL);
  const [limitTuru, setLimitTuru] = useState(ALL);
  const [altSektor, setAltSektor] = useState(ALL);
  const [sektorMuduru, setSektorMuduru] = useState(ALL);
  const [bolgeYoneticisi, setBolgeYoneticisi] = useState(ALL);
  const [ilce, setIlce] = useState(ALL);
  const [garantorluk, setGarantorluk] = useState(ALL);

  const opts = useMemo(
    () => ({
      yil: uniq(rows.map((r) => String(r.yil))),
      distributor: uniq(rows.map((r) => r.distributor)),
      bolge: uniq(rows.map((r) => r.bolge)),
      bayi: uniq(rows.map((r) => r.bayi)),
      grup: uniq(rows.map((r) => r.grupAdi)),
      limitTuru: uniq(rows.map((r) => r.limitTuru)),
      altSektor: uniq(rows.map((r) => r.altSektor)),
      sektorMuduru: uniq(rows.map((r) => r.sektorMuduru)),
      bolgeYoneticisi: uniq(rows.map((r) => r.bolgeYoneticisi)),
      ilce: uniq(rows.map((r) => r.ilce)),
      garantorluk: uniq(rows.map((r) => r.garantorluk)),
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
          (grup === ALL || r.grupAdi === grup) &&
          (limitTuru === ALL || r.limitTuru === limitTuru) &&
          (altSektor === ALL || r.altSektor === altSektor) &&
          (sektorMuduru === ALL || r.sektorMuduru === sektorMuduru) &&
          (bolgeYoneticisi === ALL || r.bolgeYoneticisi === bolgeYoneticisi) &&
          (ilce === ALL || r.ilce === ilce) &&
          (garantorluk === ALL || r.garantorluk === garantorluk)
      ),
    [rows, yil, distributor, bolge, bayi, grup, limitTuru, altSektor, sektorMuduru, bolgeYoneticisi, ilce, garantorluk]
  );

  const k = useMemo(() => {
    const toplam = f.reduce((a, r) => a + r.toplamLimit, 0);
    const kullanilan = f.reduce((a, r) => a + r.kullanilanLimit, 0);
    return {
      adet: f.length,
      toplam,
      kullanilan,
      kullanilabilir: toplam - kullanilan,
      kullanimOran: pct(kullanilan, toplam),
      garantorluTutar: f.reduce((a, r) => a + r.garantorlukTutari, 0),
    };
  }, [f]);

  const byTur = useMemo(() => {
    const m = new Map<string, { toplam: number; kullanilan: number }>();
    for (const r of f) {
      const e = m.get(r.limitTuru) ?? { toplam: 0, kullanilan: 0 };
      e.toplam += r.toplamLimit;
      e.kullanilan += r.kullanilanLimit;
      m.set(r.limitTuru, e);
    }
    return [...m.entries()].map(([name, e]) => ({ name, ...e })).sort((a, b) => b.toplam - a.toplam);
  }, [f]);

  const byGrup = useMemo(() => {
    const m = new Map<string, { toplam: number; kullanilan: number }>();
    for (const r of f) {
      const e = m.get(r.grupAdi) ?? { toplam: 0, kullanilan: 0 };
      e.toplam += r.toplamLimit;
      e.kullanilan += r.kullanilanLimit;
      m.set(r.grupAdi, e);
    }
    return [...m.entries()]
      .map(([name, e]) => ({
        name,
        toplam: e.toplam,
        kullanilan: e.kullanilan,
        kullanilabilir: e.toplam - e.kullanilan,
        oran: pct(e.kullanilan, e.toplam) * 100,
      }))
      .sort((a, b) => b.toplam - a.toplam);
  }, [f]);
  const maxOran = Math.max(...byGrup.map((g) => g.oran), 1);

  const garantorlukDag = useMemo(
    () => [
      { name: "Garantörlü", value: f.filter((r) => r.garantorluk === "Var").reduce((a, r) => a + r.toplamLimit, 0) },
      { name: "Garantörsüz", value: f.filter((r) => r.garantorluk === "Yok").reduce((a, r) => a + r.toplamLimit, 0) },
    ],
    [f]
  );

  const reset = () => {
    setYil(ALL);
    setDistributor(ALL);
    setBolge(ALL);
    setBayi(ALL);
    setGrup(ALL);
    setLimitTuru(ALL);
    setAltSektor(ALL);
    setSektorMuduru(ALL);
    setBolgeYoneticisi(ALL);
    setIlce(ALL);
    setGarantorluk(ALL);
  };
  const exportCsv = () =>
    downloadCsv(
      "limit-takip",
      [
        "Grup", "Distribütör", "Bölge", "İl", "İlçe", "Bayi", "Alt Sektör",
        "Sektör Müdürü", "Bölge Yöneticisi", "Limit Türü", "Toplam Limit",
        "Kullanılan Limit", "Kullanılabilir Limit", "Revize Tarihi",
        "Garantörlük", "Garantörlük Tutarı",
      ],
      f.map((r) => [
        r.grupAdi, r.distributor, r.bolge, r.il, r.ilce, r.bayi, r.altSektor,
        r.sektorMuduru, r.bolgeYoneticisi, r.limitTuru, r.toplamLimit,
        r.kullanilanLimit, r.kullanilabilirLimit, r.revizeTarihi,
        r.garantorluk, r.garantorlukTutari,
      ])
    );

  return (
    <>
      <FilterBar
        filters={[
          { key: "yil", label: "Dönem (Yıl)", value: yil, options: opts.yil, onChange: setYil },
          { key: "grup", label: "Grup", value: grup, options: opts.grup, onChange: setGrup, width: 170 },
          { key: "bolge", label: "Bölge", value: bolge, options: opts.bolge, onChange: setBolge },
          { key: "limitTuru", label: "Limit Türü", value: limitTuru, options: opts.limitTuru, onChange: setLimitTuru, width: 170 },
          { key: "distributor", label: "Distribütör", value: distributor, options: opts.distributor, onChange: setDistributor },
          { key: "bayi", label: "Bayi", value: bayi, options: opts.bayi, onChange: setBayi },
          { key: "altSektor", label: "Alt Sektör", value: altSektor, options: opts.altSektor, onChange: setAltSektor },
          { key: "sektorMuduru", label: "Sektör Müdürü", value: sektorMuduru, options: opts.sektorMuduru, onChange: setSektorMuduru },
          { key: "bolgeYoneticisi", label: "Bölge Yöneticisi", value: bolgeYoneticisi, options: opts.bolgeYoneticisi, onChange: setBolgeYoneticisi },
          { key: "ilce", label: "İlçe", value: ilce, options: opts.ilce, onChange: setIlce },
          { key: "garantorluk", label: "Garantörlük", value: garantorluk, options: opts.garantorluk, onChange: setGarantorluk, width: 120 },
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
          { label: "Toplam Limit", value: formatTRYCompact(k.toplam), sub: `${formatNumber(k.adet)} limit` },
          { label: "Kullanılan Limit", value: formatTRYCompact(k.kullanilan) },
          { label: "Kullanılabilir Limit", value: formatTRYCompact(k.kullanilabilir) },
          { label: "Kullanım Oranı", value: formatPercent(k.kullanimOran * 100, 1), sub: "Kullanılan / toplam" },
          { label: "Garantörlü Limit", value: formatTRYCompact(k.garantorluTutar), sub: "Toplam tutar" },
          { label: "Limit Adedi", value: formatNumber(k.adet), sub: "Filtreli" },
        ]}
      />

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <ChartCard title="Limit Türü — Toplam vs Kullanılan">
          <ResponsiveContainer height="100%" width="100%">
            <BarChart data={byTur} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
              <CartesianGrid stroke="var(--color-line)" vertical={false} />
              <XAxis axisLine={false} dataKey="name" interval={0} tick={{ fill: "var(--color-ink-muted)", fontSize: 10 }} tickLine={false} />
              <YAxis axisLine={false} tick={{ fill: "var(--color-ink-muted)", fontSize: 11 }} tickFormatter={formatTRYCompact} tickLine={false} width={60} />
              <Tooltip formatter={(v) => formatTRY(Number(v) || 0)} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="toplam" fill="var(--color-bank-soft)" name="Toplam" radius={[4, 4, 0, 0]} />
              <Bar dataKey="kullanilan" fill="var(--color-bank)" name="Kullanılan" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Garantörlü / Garantörsüz Limit (Tutar)">
          <ResponsiveContainer height="100%" width="100%">
            <PieChart>
              <Pie data={garantorlukDag} dataKey="value" innerRadius={56} nameKey="name" outerRadius={92} paddingAngle={2} stroke="none">
                <Cell fill="var(--color-bank)" />
                <Cell fill="var(--color-warn)" />
              </Pie>
              <Tooltip formatter={(v) => formatTRY(Number(v) || 0)} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <Card className="mt-5 pb-3">
        <CardHeader title="Grup Bazında Limit Kullanımı" />
        <div className="mt-3 overflow-x-auto px-5">
          <table className="[&_td]:px-2.5 [&_th]:px-2.5 w-full min-w-[760px]">
            <thead>
              <tr className="border-line border-b text-[11.5px] text-ink-muted">
                <th className="py-2 text-left font-medium">Grup</th>
                <th className="py-2 text-right font-medium">Toplam Limit</th>
                <th className="py-2 text-right font-medium">Kullanılan</th>
                <th className="py-2 text-right font-medium">Kullanılabilir</th>
                <th className="py-2 pr-1 text-right font-medium">Kullanım Oranı</th>
                <th className="w-28 py-2 font-medium" />
              </tr>
            </thead>
            <tbody>
              {byGrup.map((g) => (
                <tr className="border-line border-b last:border-0" key={g.name}>
                  <td className="py-2.5 font-medium text-[13px] text-ink">{g.name}</td>
                  <td className="py-2.5 text-right text-[12.5px] tabular-nums">{formatTRYCompact(g.toplam)}</td>
                  <td className="py-2.5 text-right text-[12.5px] tabular-nums">{formatTRYCompact(g.kullanilan)}</td>
                  <td className="py-2.5 text-right text-[12.5px] tabular-nums">{formatTRYCompact(g.kullanilabilir)}</td>
                  <td className="py-2.5 pr-1 text-right font-semibold text-[12.5px] text-bank-700 tabular-nums">{formatPercent(g.oran, 1)}</td>
                  <td className="py-2.5 pl-3">
                    <MiniBar value={(g.oran / maxOran) * 100} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="mt-5 pb-3">
        <CardHeader
          action={
            <span className="text-[12px] text-ink-muted">
              {formatNumber(f.length)} limit
              {f.length > 100 ? " · ilk 100 gösteriliyor, tümü CSV'de" : ""}
            </span>
          }
          title="Limit Takip — Detay"
        />
        <div className="mt-3 overflow-x-auto px-5">
          <table className="[&_td]:px-2.5 [&_th]:px-2.5 w-full min-w-[980px]">
            <thead>
              <tr className="border-line border-b text-[11.5px] text-ink-muted">
                <th className="py-2 text-left font-medium">Grup</th>
                <th className="py-2 text-left font-medium">Bayi</th>
                <th className="py-2 text-left font-medium">Limit Türü</th>
                <th className="py-2 text-right font-medium">Toplam</th>
                <th className="py-2 text-right font-medium">Kullanılan</th>
                <th className="py-2 text-right font-medium">Kullanılabilir</th>
                <th className="py-2 text-left font-medium">Revize</th>
                <th className="py-2 pr-1 text-left font-medium">Garantörlük</th>
              </tr>
            </thead>
            <tbody>
              {f.slice(0, 100).map((r, i) => (
                <tr className="border-line border-b last:border-0" key={`${r.grupAdi}-${i}`}>
                  <td className="py-2 text-[12.5px] text-ink">{r.grupAdi}</td>
                  <td className="py-2 text-[12.5px] text-ink-soft">{r.bayi}</td>
                  <td className="py-2 text-[12.5px] text-ink-soft">{r.limitTuru}</td>
                  <td className="py-2 text-right text-[12.5px] tabular-nums">{formatTRYCompact(r.toplamLimit)}</td>
                  <td className="py-2 text-right text-[12.5px] tabular-nums">{formatTRYCompact(r.kullanilanLimit)}</td>
                  <td className="py-2 text-right font-semibold text-[12.5px] text-ink tabular-nums">{formatTRYCompact(r.kullanilabilirLimit)}</td>
                  <td className="py-2 text-[12.5px] text-ink-soft tabular-nums">{r.revizeTarihi}</td>
                  <td className="py-2 pr-1">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 font-semibold text-[11px] ${r.garantorluk === "Var" ? "bg-success-tint text-success" : "bg-canvas text-ink-muted"}`}>
                      {r.garantorluk === "Var" ? `Var · ${formatTRYCompact(r.garantorlukTutari)}` : "Yok"}
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

export function BankLimitTakip() {
  const { data, isPending, isError, refetch } = useLimits();
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
