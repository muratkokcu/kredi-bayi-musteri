/**
 * Centralized tr-TR formatting. Screens MUST use these helpers rather than
 * inlining `Intl.NumberFormat` / manual "₺" prefixes (which were duplicated
 * across ~a dozen screens before extraction).
 */

const LOCALE = "tr-TR";

const tryFormatter = new Intl.NumberFormat(LOCALE, {
  maximumFractionDigits: 0,
});

/**
 * Turkish Lira. Symbol-prefixed ("₺612.750") to match the existing design,
 * rounded to whole lira by default. Pass `decimals` for kuruş precision.
 */
export function formatTRY(value: number, decimals = 0): string {
  const formatter =
    decimals === 0
      ? tryFormatter
      : new Intl.NumberFormat(LOCALE, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        });
  const n = decimals === 0 ? Math.round(value) : value;
  return `₺${formatter.format(n)}`;
}

/** Plain grouped number, e.g. 12450 → "12.450". */
export function formatNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat(LOCALE, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/** Percent with Turkish prefix and comma decimal, e.g. 1.89 → "%1,89". */
export function formatPercent(value: number, decimals?: number): string {
  return `%${new Intl.NumberFormat(LOCALE, {
    minimumFractionDigits: decimals ?? 0,
    maximumFractionDigits: decimals ?? 2,
  }).format(value)}`;
}

/** Compact lira for chart axes / KPIs, e.g. 1_250_000 → "₺1,25 Mn". */
export function formatTRYCompact(value: number): string {
  if (Math.abs(value) >= 1_000_000) {
    return `₺${formatNumber(value / 1_000_000, 2)} Mn`;
  }
  if (Math.abs(value) >= 1000) {
    return `₺${formatNumber(value / 1000, 0)} B`;
  }
  return formatTRY(value);
}

/** Para birimsiz kompakt: 86_000_000 → "86 Mn", 1_250 → "1 B" (grafik etiketi). */
export function formatCompact(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) {
    return `${formatNumber(value / 1_000_000_000, 1)} Mr`;
  }
  if (abs >= 1_000_000) {
    return `${formatNumber(value / 1_000_000, abs >= 10_000_000 ? 0 : 1)} Mn`;
  }
  if (abs >= 1000) {
    return `${formatNumber(value / 1000, 0)} B`;
  }
  return formatNumber(value);
}

const dateFormatter = new Intl.DateTimeFormat(LOCALE, {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

/** Date → "15.08.2021" (tr-TR). Accepts Date or ISO/parsable string. */
export function formatDate(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);
  return dateFormatter.format(date);
}
