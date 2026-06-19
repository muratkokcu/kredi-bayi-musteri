import {
  FileText,
  Search,
  ShieldCheck,
  ShieldOff,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  ConsentAmac,
  ConsentDurum,
  ConsentRecord,
} from "@/data/consents";
import { useConsents } from "@/queries/consents";
import { formatDate } from "@/lib/format";
import {
  EmptyState,
  ErrorState,
  TableSkeleton,
  TableStateRow,
} from "@/ui/async-states";
import { Badge } from "@/ui/badge";
import { Card } from "@/ui/card";
import { StatCard } from "@/ui/stat-card";
import { BankShell } from "../bank-shell";

// ConsentRecord type + seed live in src/data/consents.ts;
// rows arrive via useConsents().

type DurumTone = "success" | "danger" | "warn";

const DURUM_TONE: Record<ConsentDurum, DurumTone> = {
  Aktif: "success",
  "Geri Çekildi": "danger",
  "Süresi Doldu": "warn",
};

const DURUM_OPTIONS: ConsentDurum[] = [
  "Aktif",
  "Geri Çekildi",
  "Süresi Doldu",
];

const ALL = "__all__";

// Amaçlar that flag third-party / marketing sharing render as neutral so the
// stricter "data sharing" purposes stand out from the core credit purpose.
const NEUTRAL_AMACLAR = new Set<ConsentAmac>([
  "Pazarlama İletişimi",
  "Grup Şirketleriyle Paylaşım",
]);

function FilterSelect({
  label,
  placeholder,
  options,
  value,
  onChange,
}: {
  label: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  value: string;
}) {
  return (
    <div className="w-[200px]">
      <div className="mb-1.5 font-medium text-[12px] text-ink-soft">{label}</div>
      <Select onValueChange={onChange} value={value}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{placeholder}</SelectItem>
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

function Toolbar({
  search,
  onSearch,
  durum,
  onDurum,
  amac,
  onAmac,
  amaclar,
}: {
  amac: string;
  amaclar: string[];
  durum: string;
  onAmac: (value: string) => void;
  onDurum: (value: string) => void;
  onSearch: (value: string) => void;
  search: string;
}) {
  return (
    <Card className="mt-5 px-5 py-4">
      <div className="flex flex-wrap items-end gap-4">
        <div className="min-w-[240px] flex-1">
          <div className="mb-1.5 font-medium text-[12px] text-ink-soft">
            Arama
          </div>
          <div className="flex items-center gap-2 rounded-[10px] border border-line-strong px-3 py-2">
            <Search className="text-ink-muted" size={16} />
            <input
              className="w-full bg-transparent text-[13px] text-ink outline-none placeholder:text-ink-muted"
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Müşteri adı veya kodu..."
              value={search}
            />
          </div>
        </div>
        <FilterSelect
          label="Durum"
          onChange={onDurum}
          options={DURUM_OPTIONS}
          placeholder="Tüm Durumlar"
          value={durum}
        />
        <FilterSelect
          label="Amaç"
          onChange={onAmac}
          options={amaclar}
          placeholder="Tüm Amaçlar"
          value={amac}
        />
      </div>
    </Card>
  );
}

const COLUMNS = [
  "Müşteri",
  "Tarih",
  "İzin Verilen Amaçlar",
  "Metin Versiyonu",
  "Kanal",
  "Durum",
  "",
];

function ConsentRow({ row }: { row: ConsentRecord }) {
  return (
    <tr className="border-line border-t hover:bg-canvas/50">
      <td className="px-4 py-3 first:pl-5">
        <span className="leading-tight">
          <span className="block font-semibold text-[13.5px] text-ink">
            {row.musteri}
          </span>
          <span className="block text-[11.5px] text-ink-muted tabular-nums">
            {row.musteriKodu}
          </span>
        </span>
      </td>
      <td className="px-4 py-3">
        <span className="text-[12.5px] text-ink-soft tabular-nums">
          {formatDate(row.tarih)}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex max-w-[320px] flex-wrap gap-1.5">
          {row.amaclar.map((a) => (
            <Badge
              key={a}
              tone={NEUTRAL_AMACLAR.has(a) ? "neutral" : "bank"}
            >
              {a}
            </Badge>
          ))}
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="font-medium text-[12.5px] text-ink-soft tabular-nums">
          {row.metinVersiyonu}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className="text-[12.5px] text-ink-soft">{row.kanal}</span>
      </td>
      <td className="px-4 py-3">
        <Badge tone={DURUM_TONE[row.durum]}>{row.durum}</Badge>
      </td>
      <td className="px-4 py-3">
        <div className="flex justify-end">
          <button
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-semibold text-[12.5px] text-bank-700 hover:bg-bank-tint"
            type="button"
          >
            <FileText size={14} /> Belgeyi Görüntüle
          </button>
        </div>
      </td>
    </tr>
  );
}

export function BankRizaYonetimi() {
  const { data, isPending, isError, refetch } = useConsents();
  const consents = useMemo(() => data ?? [], [data]);

  const [search, setSearch] = useState("");
  const [durum, setDurum] = useState(ALL);
  const [amac, setAmac] = useState(ALL);

  const amaclar = useMemo(
    () => [...new Set(consents.flatMap((c) => c.amaclar))],
    [consents]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLocaleLowerCase("tr");
    return consents.filter((c) => {
      if (durum !== ALL && c.durum !== durum) {
        return false;
      }
      if (amac !== ALL && !c.amaclar.includes(amac as ConsentAmac)) {
        return false;
      }
      if (q) {
        const hay = `${c.musteri} ${c.musteriKodu}`.toLocaleLowerCase("tr");
        if (!hay.includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [consents, search, durum, amac]);

  function renderBody() {
    if (isPending) {
      return <TableSkeleton cols={COLUMNS.length} rows={8} />;
    }
    if (isError) {
      return (
        <TableStateRow colSpan={COLUMNS.length}>
          <ErrorState
            label="Rıza kayıtları yüklenemedi."
            onRetry={() => refetch()}
          />
        </TableStateRow>
      );
    }
    if (filtered.length === 0) {
      return (
        <TableStateRow colSpan={COLUMNS.length}>
          <EmptyState label="Eşleşen rıza kaydı bulunamadı." />
        </TableStateRow>
      );
    }
    return filtered.map((row) => <ConsentRow key={row.id} row={row} />);
  }

  return (
    <BankShell
      breadcrumb={["Uyum", "Rıza Yönetimi"]}
      info
      subtitle="Müşteri açık rızaları zaman damgalı ve denetlenebilir biçimde tutulur."
      title="KVKK Rıza Yönetimi"
    >
      {/* stat cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          icon={<ShieldCheck size={20} strokeWidth={1.9} />}
          label="Toplam Rıza"
          sub="Kayıt altındaki tüm onaylar"
          tone="bank"
          value="11"
        />
        <StatCard
          icon={<ShieldCheck size={20} strokeWidth={1.9} />}
          label="Aktif Rıza"
          sub="Yürürlükteki açık rızalar"
          tone="bank"
          value="6"
        />
        <StatCard
          icon={<ShieldOff size={20} strokeWidth={1.9} />}
          label="Geri Çekilen"
          sub="Müşteri tarafından iptal edildi"
          tone="warn"
          value="3"
        />
        <StatCard
          icon={<Sparkles size={20} strokeWidth={1.9} />}
          label="Bu Ay Alınan"
          sub="Haziran 2026 dönemi"
          tone="dealer"
          value="5"
        />
      </div>

      {/* retention info banner */}
      <div className="mt-5 flex items-start gap-3 rounded-[12px] border border-line bg-bank-tint px-4 py-3">
        <ShieldCheck className="mt-0.5 shrink-0 text-bank-700" size={18} />
        <p className="text-[12.5px] text-ink-soft leading-5">
          Başvuru verileri yasal saklama süresi sonunda otomatik imha edilir.
          Tüm rıza kayıtları zaman damgalı ve değiştirilemez biçimde tutulur.
        </p>
      </div>

      <Toolbar
        amac={amac}
        amaclar={amaclar}
        durum={durum}
        onAmac={setAmac}
        onDurum={setDurum}
        onSearch={setSearch}
        search={search}
      />

      {/* table */}
      <Card className="mt-5 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4">
          <h3 className="font-semibold text-[15px] text-ink">
            Rıza Kayıtları{" "}
            <span className="font-normal text-ink-muted">
              ({isPending ? "…" : filtered.length})
            </span>
          </h3>
        </div>

        <table className="w-full border-line border-t">
          <thead>
            <tr className="bg-canvas/60">
              {COLUMNS.map((col, i) => (
                <th
                  className="px-4 py-2.5 text-left font-semibold text-[11px] text-ink-muted uppercase tracking-wide first:pl-5"
                  // biome-ignore lint/suspicious/noArrayIndexKey: static header labels
                  key={col || `col-${i}`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{renderBody()}</tbody>
        </table>

        <div className="flex items-center justify-between border-line border-t px-5 py-3.5 text-[12.5px] text-ink-muted">
          <span>
            {isPending && "Yükleniyor…"}
            {!isPending && filtered.length === 0 && "Sonuç bulunamadı"}
            {!isPending &&
              filtered.length > 0 &&
              `1-${filtered.length} / ${filtered.length} kayıt`}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              className="flex size-8 items-center justify-center rounded-lg border border-line-strong text-ink-muted disabled:opacity-40"
              disabled
              type="button"
            >
              ‹
            </button>
            <button
              className="flex size-8 items-center justify-center rounded-lg bg-bank font-medium text-white"
              type="button"
            >
              1
            </button>
            <button
              className="flex size-8 items-center justify-center rounded-lg border border-line-strong text-ink-soft disabled:opacity-40"
              disabled
              type="button"
            >
              ›
            </button>
          </div>
        </div>
      </Card>
    </BankShell>
  );
}
