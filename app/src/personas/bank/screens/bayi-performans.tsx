import {
  Car,
  ChevronRight,
  Download,
  Gauge,
  RotateCcw,
  ShieldCheck,
  Store,
} from "lucide-react";
import { Fragment, type ReactNode, useMemo, useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { type DealerSalesRow, SATIS_AYLAR } from "@/data/dealer-sales";
import { formatNumber, formatPercent } from "@/lib/format";
import { downloadCsv } from "@/lib/csv";
import { useDealerSales } from "@/queries/dealer-sales";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ErrorState, LoadingState } from "@/ui/async-states";
import { MiniBar } from "@/ui/badge";
import { Card, CardHeader } from "@/ui/card";
import { StatCard } from "@/ui/stat-card";
import { BankShell } from "../bank-shell";

const SHELL_PROPS = {
  breadcrumb: ["Raporlar", "Satış & Penetrasyon"],
  subtitle: "Bayi satış adetleri, QF kredi penetrasyonu ve sigorta penetrasyonu.",
  title: "Bayi Performans & Penetrasyon",
} as const;

const ALL = "Tümü";
const uniq = (xs: string[]) => [...new Set(xs)].sort((a, b) => a.localeCompare(b, "tr"));
const pct = (a: number, b: number) => (b ? a / b : 0);

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
  return (
    <div className="flex flex-col gap-1">
      <span className="font-medium text-[11px] text-ink-muted">{label}</span>
      <Select onValueChange={onChange} value={value}>
        <SelectTrigger className="h-9 w-[150px] border-line-strong text-[13px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{ALL}</SelectItem>
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

function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card>
      <CardHeader title={title} />
      <div className="mt-3 h-[240px] px-5 pb-5">{children}</div>
    </Card>
  );
}

interface PenNode {
  name: string;
  toplam: number;
  kredili: number;
  sigortali: number;
  pen: number; // QF penetrasyonu %
  sigPen: number; // sigorta penetrasyonu %
}
interface BolgeNode extends PenNode {
  bayiler: PenNode[];
}

/** Bölge → altında bayiler; penetrasyonlar oran toplamı (Σkredili/Σtoplam). */
function nestByBolge(rows: DealerSalesRow[]): BolgeNode[] {
  const bm = new Map<
    string,
    Map<string, { toplam: number; kredili: number; sigortali: number }>
  >();
  for (const r of rows) {
    if (!bm.has(r.bolge)) {
      bm.set(r.bolge, new Map());
    }
    const inner = bm.get(r.bolge)!;
    const e = inner.get(r.bayi) ?? { toplam: 0, kredili: 0, sigortali: 0 };
    e.toplam += r.toplamSatis;
    e.kredili += r.krediliSatis;
    e.sigortali += r.sigortali;
    inner.set(r.bayi, e);
  }
  return [...bm.entries()]
    .map(([name, inner]) => {
      const bayiler = [...inner.entries()]
        .map(([bn, e]) => ({
          name: bn,
          toplam: e.toplam,
          kredili: e.kredili,
          sigortali: e.sigortali,
          pen: pct(e.kredili, e.toplam) * 100,
          sigPen: pct(e.sigortali, e.kredili) * 100,
        }))
        .sort((a, b) => b.pen - a.pen);
      const toplam = bayiler.reduce((a, b) => a + b.toplam, 0);
      const kredili = bayiler.reduce((a, b) => a + b.kredili, 0);
      const sigortali = bayiler.reduce((a, b) => a + b.sigortali, 0);
      return {
        name,
        toplam,
        kredili,
        sigortali,
        pen: pct(kredili, toplam) * 100,
        sigPen: pct(sigortali, kredili) * 100,
        bayiler,
      };
    })
    .sort((a, b) => b.pen - a.pen);
}

function Body({ rows }: { rows: DealerSalesRow[] }) {
  const [yil, setYil] = useState("2025");
  const [distributor, setDistributor] = useState(ALL);
  const [bolge, setBolge] = useState(ALL);
  const [bayi, setBayi] = useState(ALL);
  const [altSektor, setAltSektor] = useState(ALL);
  const [danisman, setDanisman] = useState(ALL);
  const [sektorMuduru, setSektorMuduru] = useState(ALL);
  const [bolgeYoneticisi, setBolgeYoneticisi] = useState(ALL);
  const [ilce, setIlce] = useState(ALL);

  const opts = useMemo(
    () => ({
      yil: uniq(rows.map((r) => String(r.yil))),
      distributor: uniq(rows.map((r) => r.distributor)),
      bolge: uniq(rows.map((r) => r.bolge)),
      bayi: uniq(rows.map((r) => r.bayi)),
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
          (yil === ALL || String(r.yil) === yil) &&
          (distributor === ALL || r.distributor === distributor) &&
          (bolge === ALL || r.bolge === bolge) &&
          (bayi === ALL || r.bayi === bayi) &&
          (altSektor === ALL || r.altSektor === altSektor) &&
          (danisman === ALL || r.danisman === danisman) &&
          (sektorMuduru === ALL || r.sektorMuduru === sektorMuduru) &&
          (bolgeYoneticisi === ALL || r.bolgeYoneticisi === bolgeYoneticisi) &&
          (ilce === ALL || r.ilce === ilce)
      ),
    [rows, yil, distributor, bolge, bayi, altSektor, danisman, sektorMuduru, bolgeYoneticisi, ilce]
  );

  const k = useMemo(() => {
    const toplam = f.reduce((a, r) => a + r.toplamSatis, 0);
    const kredili = f.reduce((a, r) => a + r.krediliSatis, 0);
    const sigortali = f.reduce((a, r) => a + r.sigortali, 0);
    return {
      toplam,
      kredili,
      sigortali,
      qfPen: pct(kredili, toplam),
      sigPen: pct(sigortali, kredili),
    };
  }, [f]);

  const aylik = useMemo(() => {
    const g = SATIS_AYLAR.map((ay) => ({ ay, toplam: 0, kredili: 0, sigortali: 0 }));
    for (const r of f) {
      g[r.ay - 1].toplam += r.toplamSatis;
      g[r.ay - 1].kredili += r.krediliSatis;
      g[r.ay - 1].sigortali += r.sigortali;
    }
    return g.map((x) => ({
      ...x,
      pen: pct(x.kredili, x.toplam) * 100,
      sigPen: pct(x.sigortali, x.kredili) * 100,
    }));
  }, [f]);

  const nested = useMemo(() => nestByBolge(f), [f]);
  const maxPen = Math.max(
    ...nested.flatMap((b) => [b.pen, ...b.bayiler.map((x) => x.pen)]),
    1
  );
  const [closed, setClosed] = useState<Set<string>>(new Set());
  const toggleBolge = (name: string) =>
    setClosed((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });

  const reset = () => {
    setYil("2025");
    setDistributor(ALL);
    setBolge(ALL);
    setBayi(ALL);
    setAltSektor(ALL);
    setDanisman(ALL);
    setSektorMuduru(ALL);
    setBolgeYoneticisi(ALL);
    setIlce(ALL);
  };

  const exportCsv = () =>
    downloadCsv(
      "satis-penetrasyon",
      [
        "Yıl", "Ay", "Distribütör", "Bölge", "İl", "İlçe", "Bayi", "Alt Sektör",
        "Danışman", "Sektör Müdürü", "Bölge Yöneticisi", "Toplam Satış",
        "Kredili Satış", "Sigortalı", "QF Penetrasyonu (%)", "Sigorta Penetrasyonu (%)",
      ],
      f.map((r) => [
        r.yil, SATIS_AYLAR[r.ay - 1], r.distributor, r.bolge, r.il, r.ilce, r.bayi,
        r.altSektor, r.danisman, r.sektorMuduru, r.bolgeYoneticisi,
        r.toplamSatis, r.krediliSatis, r.sigortali,
        (pct(r.krediliSatis, r.toplamSatis) * 100).toFixed(1),
        (pct(r.sigortali, r.krediliSatis) * 100).toFixed(1),
      ])
    );

  return (
    <>
      <Card className="flex flex-wrap items-end gap-3 p-4">
        <FilterSelect label="Dönem (Yıl)" onChange={setYil} options={opts.yil} value={yil} />
        <FilterSelect label="Distribütör" onChange={setDistributor} options={opts.distributor} value={distributor} />
        <FilterSelect label="Bölge" onChange={setBolge} options={opts.bolge} value={bolge} />
        <FilterSelect label="Bayi" onChange={setBayi} options={opts.bayi} value={bayi} />
        <FilterSelect label="Alt Sektör" onChange={setAltSektor} options={opts.altSektor} value={altSektor} />
        <FilterSelect label="Danışman" onChange={setDanisman} options={opts.danisman} value={danisman} />
        <FilterSelect label="Sektör Müdürü" onChange={setSektorMuduru} options={opts.sektorMuduru} value={sektorMuduru} />
        <FilterSelect label="Bölge Yöneticisi" onChange={setBolgeYoneticisi} options={opts.bolgeYoneticisi} value={bolgeYoneticisi} />
        <FilterSelect label="İlçe" onChange={setIlce} options={opts.ilce} value={ilce} />
        <button
          className="flex h-9 items-center gap-1.5 rounded-[10px] border border-line-strong bg-surface px-3 font-medium text-[13px] text-ink-soft hover:bg-canvas"
          onClick={reset}
          type="button"
        >
          <RotateCcw size={15} /> Temizle
        </button>
        <button
          className="ml-auto flex h-9 items-center gap-1.5 rounded-[10px] bg-bank px-3.5 font-semibold text-[13px] text-white hover:bg-bank-600"
          onClick={exportCsv}
          type="button"
        >
          <Download size={15} /> CSV İndir
        </button>
      </Card>

      <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={<Store size={20} strokeWidth={1.9} />}
          label="Toplam Satış"
          sub="Adet"
          tone="bank"
          value={formatNumber(k.toplam)}
        />
        <StatCard
          icon={<Car size={20} strokeWidth={1.9} />}
          label="Kredili Satış"
          sub="QF ile finanse"
          tone="dealer"
          value={formatNumber(k.kredili)}
        />
        <StatCard
          icon={<Gauge size={20} strokeWidth={1.9} />}
          label="QF Penetrasyonu"
          sub="Kredili / toplam"
          tone="teal"
          value={formatPercent(k.qfPen * 100, 1)}
        />
        <StatCard
          icon={<ShieldCheck size={20} strokeWidth={1.9} />}
          label="Sigorta Penetrasyonu"
          sub="Sigortalı / kredili"
          tone="cust"
          value={formatPercent(k.sigPen * 100, 1)}
        />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <ChartCard title="Aylık Penetrasyon (QF & Sigorta)">
          <ResponsiveContainer height="100%" width="100%">
            <LineChart data={aylik} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
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
                tickFormatter={(v) => `%${v}`}
                tickLine={false}
                width={40}
              />
              <Tooltip formatter={(v) => formatPercent(Number(v) || 0, 1)} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line
                dataKey="pen"
                dot={false}
                name="QF Penetrasyonu"
                stroke="var(--color-bank)"
                strokeWidth={2.4}
              />
              <Line
                dataKey="sigPen"
                dot={false}
                name="Sigorta Penetrasyonu"
                stroke="var(--color-cust)"
                strokeWidth={2.4}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Aylık Toplam vs Kredili Satış">
          <ResponsiveContainer height="100%" width="100%">
            <ComposedChart data={aylik} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
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
                width={36}
              />
              <Tooltip />
              <Bar dataKey="toplam" fill="var(--color-bank-soft)" name="Toplam Satış" radius={[4, 4, 0, 0]} />
              <Line
                dataKey="kredili"
                dot={false}
                name="Kredili Satış"
                stroke="var(--color-bank-700)"
                strokeWidth={2}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <Card className="mt-5 pb-3">
        <CardHeader title="Bölge / Bayi Penetrasyonu" />
        <div className="mt-3 overflow-x-auto px-5">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-line border-b text-[11.5px] text-ink-muted">
                <th className="py-2 text-left font-medium">Bölge / Bayi</th>
                <th className="py-2 text-right font-medium">Toplam Satış</th>
                <th className="py-2 text-right font-medium">Kredili Satış</th>
                <th className="py-2 text-right font-medium">QF Penetrasyonu</th>
                <th className="py-2 pr-1 text-right font-medium">Sigorta Pen.</th>
                <th className="w-24 py-2 font-medium" />
              </tr>
            </thead>
            <tbody>
              {nested.map((bo) => {
                const open = !closed.has(bo.name);
                return (
                  <Fragment key={bo.name}>
                    <tr
                      className="cursor-pointer border-line border-b bg-canvas/40 hover:bg-canvas"
                      onClick={() => toggleBolge(bo.name)}
                    >
                      <td className="py-2.5">
                        <span className="flex items-center gap-1.5 font-semibold text-[13px] text-ink">
                          <ChevronRight
                            className={`text-ink-muted transition-transform ${open ? "rotate-90" : ""}`}
                            size={15}
                          />
                          {bo.name}
                          <span className="ml-1 font-normal text-[11px] text-ink-muted">
                            ({bo.bayiler.length} bayi)
                          </span>
                        </span>
                      </td>
                      <td className="py-2.5 text-right font-semibold text-[12.5px] tabular-nums">
                        {formatNumber(bo.toplam)}
                      </td>
                      <td className="py-2.5 text-right font-semibold text-[12.5px] tabular-nums">
                        {formatNumber(bo.kredili)}
                      </td>
                      <td className="py-2.5 text-right font-bold text-[12.5px] text-bank-700 tabular-nums">
                        {formatPercent(bo.pen, 1)}
                      </td>
                      <td className="py-2.5 pr-1 text-right font-semibold text-[12.5px] text-cust-600 tabular-nums">
                        {formatPercent(bo.sigPen, 1)}
                      </td>
                      <td className="py-2.5 pl-3">
                        <MiniBar value={(bo.pen / maxPen) * 100} />
                      </td>
                    </tr>
                    {open &&
                      bo.bayiler.map((x) => (
                        <tr
                          className="border-line border-b last:border-0"
                          key={`${bo.name}-${x.name}`}
                        >
                          <td className="py-2 pl-7 text-[12.5px] text-ink-soft">{x.name}</td>
                          <td className="py-2 text-right text-[12.5px] tabular-nums">
                            {formatNumber(x.toplam)}
                          </td>
                          <td className="py-2 text-right text-[12.5px] tabular-nums">
                            {formatNumber(x.kredili)}
                          </td>
                          <td className="py-2 text-right font-semibold text-[12.5px] text-ink tabular-nums">
                            {formatPercent(x.pen, 1)}
                          </td>
                          <td className="py-2 pr-1 text-right text-[12.5px] text-ink-soft tabular-nums">
                            {formatPercent(x.sigPen, 1)}
                          </td>
                          <td className="py-2 pl-3">
                            <MiniBar value={(x.pen / maxPen) * 100} />
                          </td>
                        </tr>
                      ))}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

export function BankBayiPerformans() {
  const { data, isPending, isError, refetch } = useDealerSales();
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
