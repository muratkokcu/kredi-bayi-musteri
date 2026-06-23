import {
  CheckCircle2,
  FileInput,
  Percent,
  RotateCcw,
  Wallet,
  XCircle,
} from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { type Application, BASVURU_AYLAR } from "@/data/applications";
import { formatNumber, formatPercent, formatTRYCompact } from "@/lib/format";
import { useApplications } from "@/queries/applications";
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
  breadcrumb: ["Raporlar", "Başvuru Hunisi"],
  subtitle: "Başvuru → onay → kullandırım dönüşümü ve ret analizi.",
  title: "Başvuru Hunisi & Dönüşüm",
} as const;

const PALETTE = ["E2603B", "F2A93B", "9CA3AF", "57C99A", "127A9B"];
const ALL = "Tümü";
const uniq = (xs: string[]) => [...new Set(xs)].sort((a, b) => a.localeCompare(b, "tr"));

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
    <Card className="p-5">
      <CardHeader title={title} />
      <div className="mt-3 h-[240px]">{children}</div>
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
  const [bolge, setBolge] = useState(ALL);
  const [bayi, setBayi] = useState(ALL);
  const [tip, setTip] = useState(ALL);

  const opts = useMemo(
    () => ({
      yil: uniq(rows.map((r) => String(r.yil))),
      bolge: uniq(rows.map((r) => r.bolge)),
      bayi: uniq(rows.map((r) => r.bayi)),
      tip: uniq(rows.map((r) => r.musteriTipi)),
    }),
    [rows]
  );

  const f = useMemo(
    () =>
      rows.filter(
        (r) =>
          (yil === ALL || String(r.yil) === yil) &&
          (bolge === ALL || r.bolge === bolge) &&
          (bayi === ALL || r.bayi === bayi) &&
          (tip === ALL || r.musteriTipi === tip)
      ),
    [rows, yil, bolge, bayi, tip]
  );

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

  const reset = () => {
    setYil(ALL);
    setBolge(ALL);
    setBayi(ALL);
    setTip(ALL);
  };

  return (
    <>
      <Card className="flex flex-wrap items-end gap-3 p-4">
        <FilterSelect label="Dönem (Yıl)" onChange={setYil} options={opts.yil} value={yil} />
        <FilterSelect label="Bölge" onChange={setBolge} options={opts.bolge} value={bolge} />
        <FilterSelect label="Bayi" onChange={setBayi} options={opts.bayi} value={bayi} />
        <FilterSelect label="Müşteri Tipi" onChange={setTip} options={opts.tip} value={tip} />
        <button
          className="flex h-9 items-center gap-1.5 rounded-[10px] border border-line-strong bg-surface px-3 font-medium text-[13px] text-ink-soft hover:bg-canvas"
          onClick={reset}
          type="button"
        >
          <RotateCcw size={15} /> Temizle
        </button>
      </Card>

      <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          icon={<FileInput size={20} strokeWidth={1.9} />}
          label="Başvuru Adedi"
          sub="Seçili dönem"
          tone="bank"
          value={formatNumber(k.n)}
        />
        <StatCard
          icon={<XCircle size={20} strokeWidth={1.9} />}
          label="Ret Oranı"
          sub={`${formatNumber(k.ret)} ret`}
          tone="warn"
          value={formatPercent(k.retOran * 100, 1)}
        />
        <StatCard
          icon={<CheckCircle2 size={20} strokeWidth={1.9} />}
          label="Onay Oranı"
          sub={`${formatNumber(k.onaylanan)} onay`}
          tone="dealer"
          value={formatPercent(k.onayOran * 100, 1)}
        />
        <StatCard
          icon={<Percent size={20} strokeWidth={1.9} />}
          label="Kullandırım Oranı"
          sub={`${formatNumber(k.kullandirim)} kullandırım`}
          tone="teal"
          value={formatPercent(k.kullOran * 100, 1)}
        />
        <StatCard
          icon={<Wallet size={20} strokeWidth={1.9} />}
          label="Kullandırılan Tutar"
          sub="Kullandırım"
          tone="cust"
          value={formatTRYCompact(k.kullTutar)}
        />
        <StatCard
          icon={<Wallet size={20} strokeWidth={1.9} />}
          label="Ort. Başvuru Tutarı"
          sub="Tüm başvurular"
          tone="bank"
          value={formatTRYCompact(k.ortTutar)}
        />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card className="p-5">
          <CardHeader title="Dönüşüm Hunisi" />
          <div className="mt-4 flex flex-col gap-3">
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
        </Card>

        <ChartCard title="Ret Nedenleri">
          <ResponsiveContainer height="100%" width="100%">
            <PieChart>
              <Pie
                data={retNeden}
                dataKey="value"
                innerRadius={52}
                nameKey="name"
                outerRadius={88}
                paddingAngle={2}
                stroke="none"
              >
                {retNeden.map((s, i) => (
                  <Cell fill={`#${PALETTE[i % PALETTE.length]}`} key={s.name} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${formatNumber(Number(v) || 0)} ret`} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Aylık Başvuru vs Kullandırım">
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
                width={32}
              />
              <Tooltip />
              <Bar dataKey="basvuru" fill="var(--color-bank-soft)" name="Başvuru" radius={[4, 4, 0, 0]} />
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
            <table className="w-full min-w-[560px]">
              <thead>
                <tr className="border-line border-b text-[11.5px] text-ink-muted">
                  <th className="py-2 text-left font-medium">Bayi</th>
                  <th className="py-2 text-right font-medium">Başvuru</th>
                  <th className="py-2 text-right font-medium">Ret</th>
                  <th className="py-2 text-right font-medium">Kullandırım</th>
                  <th className="py-2 pr-1 text-right font-medium">Oran</th>
                  <th className="w-24 py-2 font-medium" />
                </tr>
              </thead>
              <tbody>
                {bayiTablo.map((b) => (
                  <tr className="border-line border-b last:border-0" key={b.name}>
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
    </>
  );
}

export function BankBasvuruHunisi() {
  const { data, isPending, isError, refetch } = useApplications();
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
