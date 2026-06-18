import { Inbox, LoaderCircle, RotateCcw, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";

/** Centered loading spinner for async content regions. */
export function LoadingState({ label = "Yükleniyor…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2.5 py-14 text-ink-muted">
      <LoaderCircle className="animate-spin" size={24} strokeWidth={1.9} />
      <span className="text-[13px]">{label}</span>
    </div>
  );
}

/** Error region with an optional retry action. */
export function ErrorState({
  label = "Bir şeyler ters gitti.",
  onRetry,
}: {
  label?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
      <TriangleAlert className="text-warn" size={26} strokeWidth={1.9} />
      <span className="text-[13px] text-ink-soft">{label}</span>
      {onRetry ? (
        <button
          className="flex items-center gap-2 rounded-[10px] border border-line-strong bg-surface px-3.5 py-2 font-medium text-[13px] text-ink-soft hover:bg-canvas"
          onClick={onRetry}
          type="button"
        >
          <RotateCcw size={15} /> Tekrar dene
        </button>
      ) : null}
    </div>
  );
}

/** Empty region for "no records" states. */
export function EmptyState({
  label = "Kayıt bulunamadı.",
  icon,
}: {
  label?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2.5 py-14 text-ink-muted">
      {icon ?? <Inbox size={26} strokeWidth={1.7} />}
      <span className="text-[13px]">{label}</span>
    </div>
  );
}

/** Wraps a state component as a single full-width table row. */
export function TableStateRow({
  colSpan,
  children,
}: {
  colSpan: number;
  children: ReactNode;
}) {
  return (
    <tr className="border-line border-t">
      <td className="px-4 py-2" colSpan={colSpan}>
        {children}
      </td>
    </tr>
  );
}

/** Pulsing skeleton rows shown while table data loads. */
export function TableSkeleton({ rows, cols }: { rows: number; cols: number }) {
  return Array.from({ length: rows }, (_, r) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length skeleton, order is stable
    <tr className="border-line border-t" key={r}>
      {Array.from({ length: cols }, (_, c) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length skeleton, order is stable
        <td className="px-4 py-3.5 first:pl-5" key={c}>
          <div className="h-3.5 animate-pulse rounded bg-line" />
        </td>
      ))}
    </tr>
  ));
}
