import { Download, FileWarning, FileX, Layers, RotateCcw, Store } from "lucide-react";
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
import { type MissingDoc } from "@/data/missing-docs";
import { downloadCsv } from "@/lib/csv";
import { formatNumber } from "@/lib/format";
import { useMissingDocs } from "@/queries/missing-docs";
import { ErrorState, LoadingState } from "@/ui/async-states";
import { Card, CardHeader } from "@/ui/card";
import { ALL, ChartCard, FilterSelect, uniq } from "@/ui/report-kit";
import { StatCard } from "@/ui/stat-card";
import { BankShell } from "../bank-shell";

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

function Body({ rows }: { rows: MissingDoc[] }) {
  const [tur, setTur] = useState(ALL);
  const [distributor, setDistributor] = useState(ALL);
  const [bolge, setBolge] = useState(ALL);
  const [bayi, setBayi] = useState(ALL);
  const [hata, setHata] = useState(ALL);

  const opts = useMemo(
    () => ({
      tur: uniq(rows.map((r) => r.tur)),
      distributor: uniq(rows.map((r) => r.distributor)),
      bolge: uniq(rows.map((r) => r.bolge)),
      bayi: uniq(rows.map((r) => r.bayi)),
      hata: uniq(rows.map((r) => r.hataTuru)),
    }),
    [rows]
  );

  const f = useMemo(
    () =>
      rows.filter(
        (r) =>
          (tur === ALL || r.tur === tur) &&
          (distributor === ALL || r.distributor === distributor) &&
          (bolge === ALL || r.bolge === bolge) &&
          (bayi === ALL || r.bayi === bayi) &&
          (hata === ALL || r.hataTuru === hata)
      ),
    [rows, tur, distributor, bolge, bayi, hata]
  );

  const hataDag = useMemo(() => countBy(f, "hataTuru"), [f]);
  const evrakDag = useMemo(() => countBy(f, "evrakTuru"), [f]);
  const bayiDag = useMemo(() => countBy(f, "bayi"), [f]);

  const k = useMemo(
    () => ({
      toplam: f.length,
      tuketici: f.filter((r) => r.tur === "Tüketici/Bayi").length,
      stok: f.filter((r) => r.tur === "Stok/Filo").length,
      enSikHata: hataDag[0]?.name ?? "—",
      etkilenenBayi: new Set(f.map((r) => r.bayi)).size,
    }),
    [f, hataDag]
  );

  const reset = () => {
    setTur(ALL);
    setDistributor(ALL);
    setBolge(ALL);
    setBayi(ALL);
    setHata(ALL);
  };
  const exportCsv = () =>
    downloadCsv(
      "eksik-evrak",
      ["Sözleşme No", "Tür", "Müşteri/Tedarikçi", "Distribütör", "Bölge", "İl", "Bayi", "Evrak Tarihi", "Evrak Türü", "Hata Türü"],
      f.map((r) => [r.sozlesmeNo, r.tur, r.musteriTedarikci, r.distributor, r.bolge, r.il, r.bayi, r.evrakTarihi, r.evrakTuru, r.hataTuru])
    );

  return (
    <>
      <Card className="flex flex-wrap items-end gap-3 p-4">
        <FilterSelect label="Tür" onChange={setTur} options={opts.tur} value={tur} width={140} />
        <FilterSelect label="Distribütör" onChange={setDistributor} options={opts.distributor} value={distributor} />
        <FilterSelect label="Bölge" onChange={setBolge} options={opts.bolge} value={bolge} />
        <FilterSelect label="Bayi" onChange={setBayi} options={opts.bayi} value={bayi} />
        <FilterSelect label="Hata Türü" onChange={setHata} options={opts.hata} value={hata} width={170} />
        <button className="flex h-9 items-center gap-1.5 rounded-[10px] border border-line-strong bg-surface px-3 font-medium text-[13px] text-ink-soft hover:bg-canvas" onClick={reset} type="button">
          <RotateCcw size={15} /> Temizle
        </button>
        <button className="ml-auto flex h-9 items-center gap-1.5 rounded-[10px] bg-bank px-3.5 font-semibold text-[13px] text-white hover:bg-bank-600" onClick={exportCsv} type="button">
          <Download size={15} /> CSV İndir
        </button>
      </Card>

      <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard icon={<FileWarning size={20} strokeWidth={1.9} />} label="Toplam Eksik Evrak" sub="Filtreli" tone="warn" value={formatNumber(k.toplam)} />
        <StatCard icon={<FileX size={20} strokeWidth={1.9} />} label="Tüketici / Bayi" sub="Kayıt" tone="bank" value={formatNumber(k.tuketici)} />
        <StatCard icon={<Layers size={20} strokeWidth={1.9} />} label="Stok / Filo" sub="Kayıt" tone="dealer" value={formatNumber(k.stok)} />
        <StatCard icon={<FileWarning size={20} strokeWidth={1.9} />} label="En Sık Hata" sub="Tür" tone="cust" value={k.enSikHata} />
        <StatCard icon={<Store size={20} strokeWidth={1.9} />} label="Etkilenen Bayi" sub="Adet" tone="teal" value={formatNumber(k.etkilenenBayi)} />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <ChartCard title="Hata Türü Dağılımı">
          <ResponsiveContainer height="100%" width="100%">
            <PieChart>
              <Pie data={hataDag} dataKey="value" innerRadius={52} nameKey="name" outerRadius={88} paddingAngle={2} stroke="none">
                {hataDag.map((s, i) => (
                  <Cell fill={`#${PALETTE[i % PALETTE.length]}`} key={s.name} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${formatNumber(Number(v) || 0)} kayıt`} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Bayi Bazında Eksik Adedi">
          <ResponsiveContainer height="100%" width="100%">
            <BarChart data={bayiDag} layout="vertical" margin={{ top: 4, right: 12, left: 8, bottom: 0 }}>
              <XAxis hide type="number" />
              <YAxis axisLine={false} dataKey="name" tick={{ fill: "var(--color-ink-soft)", fontSize: 11 }} tickLine={false} type="category" width={108} />
              <Tooltip formatter={(v) => `${formatNumber(Number(v) || 0)} kayıt`} />
              <Bar dataKey="value" fill="var(--color-warn)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Evrak Türü Dağılımı">
        <ResponsiveContainer height="100%" width="100%">
          <BarChart data={evrakDag} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
            <CartesianGrid stroke="var(--color-line)" vertical={false} />
            <XAxis axisLine={false} dataKey="name" interval={0} tick={{ fill: "var(--color-ink-muted)", fontSize: 10 }} tickLine={false} />
            <YAxis axisLine={false} tick={{ fill: "var(--color-ink-muted)", fontSize: 11 }} tickLine={false} width={32} />
            <Tooltip formatter={(v) => `${formatNumber(Number(v) || 0)} kayıt`} />
            <Bar dataKey="value" fill="var(--color-bank)" radius={[4, 4, 0, 0]} />
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
          <table className="w-full min-w-[860px]">
            <thead>
              <tr className="border-line border-b text-[11.5px] text-ink-muted">
                <th className="py-2 text-left font-medium">Sözleşme</th>
                <th className="py-2 text-left font-medium">Tür</th>
                <th className="py-2 text-left font-medium">Müşteri / Tedarikçi</th>
                <th className="py-2 text-left font-medium">Bayi</th>
                <th className="py-2 text-left font-medium">Evrak Tarihi</th>
                <th className="py-2 text-left font-medium">Evrak Türü</th>
                <th className="py-2 pr-1 text-left font-medium">Hata Türü</th>
              </tr>
            </thead>
            <tbody>
              {f.slice(0, 100).map((r) => (
                <tr className="border-line border-b last:border-0" key={r.sozlesmeNo}>
                  <td className="py-2 font-medium text-[12.5px] text-ink tabular-nums">{r.sozlesmeNo}</td>
                  <td className="py-2 text-[12.5px] text-ink-soft">{r.tur}</td>
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
