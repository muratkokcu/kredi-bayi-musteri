import {
  Activity,
  Database,
  Download,
  ScrollText,
  Search,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AuditEvent, AuditResult } from "@/data/audit-log";
import { useAuditLog } from "@/queries/audit-log";
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

// AuditEvent type + seed live in src/data/audit-log.ts;
// rows arrive via useAuditLog() and are rendered append-only (immutable).

type ResultTone = "success" | "danger" | "warn";

const RESULT_TONE: Record<AuditResult, ResultTone> = {
  Başarılı: "success",
  Reddedildi: "danger",
  Uyarı: "warn",
};

const ALL = "__all__";

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
    <div className="w-[180px]">
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
  kategori,
  onKategori,
  kategoriler,
  sonuc,
  onSonuc,
  sonuclar,
}: {
  kategori: string;
  kategoriler: string[];
  onKategori: (value: string) => void;
  onSearch: (value: string) => void;
  onSonuc: (value: string) => void;
  search: string;
  sonuc: string;
  sonuclar: string[];
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
              placeholder="Kullanıcı, işlem, kaynak, IP..."
              value={search}
            />
          </div>
        </div>
        <FilterSelect
          label="Kategori"
          onChange={onKategori}
          options={kategoriler}
          placeholder="Tüm Kategoriler"
          value={kategori}
        />
        <FilterSelect
          label="Sonuç"
          onChange={onSonuc}
          options={sonuclar}
          placeholder="Tüm Sonuçlar"
          value={sonuc}
        />
      </div>
    </Card>
  );
}

const COLUMNS = [
  "Zaman",
  "Kullanıcı",
  "İşlem",
  "Kaynak",
  "IP",
  "Kategori",
  "Sonuç",
];

function EventRow({ row }: { row: AuditEvent }) {
  return (
    <tr className="border-line border-t hover:bg-canvas/50">
      <td className="px-4 py-3 first:pl-5">
        <span className="text-[12.5px] text-ink-soft tabular-nums">
          {row.timestamp}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className="leading-tight">
          <span className="block font-semibold text-[13.5px] text-ink">
            {row.actor}
          </span>
          <span className="block text-[11.5px] text-ink-muted">{row.role}</span>
        </span>
      </td>
      <td className="px-4 py-3">
        <span className="text-[12.5px] text-ink-soft">{row.action}</span>
      </td>
      <td className="px-4 py-3">
        <span className="font-medium text-[12.5px] text-ink-soft">
          {row.resource}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className="text-[12.5px] text-ink-muted tabular-nums">
          {row.ip}
        </span>
      </td>
      <td className="px-4 py-3">
        <Badge tone="bank">{row.category}</Badge>
      </td>
      <td className="px-4 py-3">
        <Badge tone={RESULT_TONE[row.result]}>{row.result}</Badge>
      </td>
    </tr>
  );
}

export function BankDenetimKaydi() {
  const { data, isPending, isError, refetch } = useAuditLog();
  const events = useMemo(() => data ?? [], [data]);

  const [search, setSearch] = useState("");
  const [kategori, setKategori] = useState(ALL);
  const [sonuc, setSonuc] = useState(ALL);

  const kategoriler = useMemo(
    () => [...new Set(events.map((e) => e.category))],
    [events]
  );
  const sonuclar = useMemo(
    () => [...new Set(events.map((e) => e.result))],
    [events]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLocaleLowerCase("tr");
    return events.filter((e) => {
      if (kategori !== ALL && e.category !== kategori) {
        return false;
      }
      if (sonuc !== ALL && e.result !== sonuc) {
        return false;
      }
      if (q) {
        const hay =
          `${e.actor} ${e.role} ${e.action} ${e.resource} ${e.ip}`.toLocaleLowerCase(
            "tr"
          );
        if (!hay.includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [events, search, kategori, sonuc]);

  function renderBody() {
    if (isPending) {
      return <TableSkeleton cols={COLUMNS.length} rows={8} />;
    }
    if (isError) {
      return (
        <TableStateRow colSpan={COLUMNS.length}>
          <ErrorState
            label="Denetim kayıtları yüklenemedi."
            onRetry={() => refetch()}
          />
        </TableStateRow>
      );
    }
    if (filtered.length === 0) {
      return (
        <TableStateRow colSpan={COLUMNS.length}>
          <EmptyState label="Eşleşen denetim kaydı bulunamadı." />
        </TableStateRow>
      );
    }
    return filtered.map((row) => <EventRow key={row.id} row={row} />);
  }

  return (
    <BankShell
      actions={
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1.5 rounded-[10px] border border-line bg-canvas px-2.5 py-1.5 font-medium text-[11.5px] text-ink-muted">
            <span className="size-1.5 rounded-full bg-success" />
            SIEM'e aktarılıyor · Splunk
          </span>
          <button
            className="flex items-center gap-2 rounded-[10px] bg-bank px-3.5 py-2 font-semibold text-[12.5px] text-white hover:bg-bank-600"
            type="button"
          >
            <Download size={15} /> BDDK Denetimi için Dışa Aktar (CSV)
          </button>
        </div>
      }
      breadcrumb={["Güvenlik", "Denetim Kaydı"]}
      info
      subtitle="Tüm kullanıcı ve sistem işlemleri değişmez biçimde kaydedilir."
      title="Denetim Kaydı"
    >
      {/* stat cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          icon={<Activity size={20} strokeWidth={1.9} />}
          label="Bugünkü Olay"
          sub="Son 24 saatteki kayıt sayısı"
          tone="bank"
          value="1.284"
        />
        <StatCard
          icon={<ShieldAlert size={20} strokeWidth={1.9} />}
          label="Başarısız Giriş (24s)"
          sub="İzlenmesi gereken denemeler"
          tone="warn"
          value="17"
        />
        <StatCard
          icon={<Database size={20} strokeWidth={1.9} />}
          label="Veri Erişimi"
          sub="Kayıt görüntüleme & dışa aktarma"
          tone="bank"
          value="342"
        />
        <StatCard
          icon={<ShieldCheck size={20} strokeWidth={1.9} />}
          label="Yönetim İşlemi"
          sub="Rol & parametre değişiklikleri"
          tone="dealer"
          value="9"
        />
      </div>

      <Toolbar
        kategori={kategori}
        kategoriler={kategoriler}
        onKategori={setKategori}
        onSearch={setSearch}
        onSonuc={setSonuc}
        search={search}
        sonuc={sonuc}
        sonuclar={sonuclar}
      />

      {/* table */}
      <Card className="mt-5 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4">
          <h3 className="flex items-center gap-2 font-semibold text-[15px] text-ink">
            <ScrollText className="text-ink-muted" size={17} strokeWidth={1.9} />
            Denetim Kayıtları{" "}
            <span className="font-normal text-ink-muted">
              ({isPending ? "…" : filtered.length})
            </span>
          </h3>
          <span className="text-[11.5px] text-ink-muted">
            Değişmez kayıt · yalnızca okuma
          </span>
        </div>

        <table className="w-full border-line border-t">
          <thead>
            <tr className="bg-canvas/60">
              {COLUMNS.map((col) => (
                <th
                  className="px-4 py-2.5 text-left font-semibold text-[11px] text-ink-muted uppercase tracking-wide first:pl-5"
                  key={col}
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
          <span>Kayıtlar değiştirilemez · SHA-256 ile zincirlenir</span>
        </div>
      </Card>
    </BankShell>
  );
}
