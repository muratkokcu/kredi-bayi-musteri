import { describe, expect, it } from "vitest";
import {
  formatDate,
  formatNumber,
  formatPercent,
  formatTRY,
  formatTRYCompact,
} from "./format";

describe("formatTRY", () => {
  it("prefixes ₺ and groups with tr-TR dots, rounded", () => {
    expect(formatTRY(612_750)).toBe("₺612.750");
    expect(formatTRY(18_449.6)).toBe("₺18.450");
  });

  it("supports kuruş precision", () => {
    expect(formatTRY(1234.5, 2)).toBe("₺1.234,50");
  });
});

describe("formatNumber", () => {
  it("groups thousands with tr-TR separators", () => {
    expect(formatNumber(12_450)).toBe("12.450");
  });
});

describe("formatPercent", () => {
  it("uses a leading % and comma decimal", () => {
    expect(formatPercent(1.89, 2)).toBe("%1,89");
    expect(formatPercent(20)).toBe("%20");
  });
});

describe("formatTRYCompact", () => {
  it("abbreviates millions and thousands", () => {
    expect(formatTRYCompact(1_250_000)).toBe("₺1,25 Mn");
    expect(formatTRYCompact(45_000)).toBe("₺45 B");
  });
});

describe("formatDate", () => {
  it("formats to dd.MM.yyyy", () => {
    expect(formatDate("2021-08-15")).toBe("15.08.2021");
  });
});
