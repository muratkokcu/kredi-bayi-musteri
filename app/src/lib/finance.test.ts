import { describe, expect, it } from "vitest";
import {
  annuity,
  BSMV_RATE,
  computeLoan,
  effectiveMonthlyRate,
  KKDF_RATE,
} from "./finance";

describe("annuity", () => {
  it("falls back to straight-line when the rate is 0", () => {
    expect(annuity(1200, 0, 12)).toBe(100);
  });

  it("returns 0 for non-positive terms", () => {
    expect(annuity(1000, 0.01, 0)).toBe(0);
  });

  it("computes the standard annuity payment", () => {
    // 100.000 @ %1/ay, 12 ay → ~8.884,88
    expect(annuity(100_000, 0.01, 12)).toBeCloseTo(8884.88, 1);
  });

  it("pays back principal + interest over the term", () => {
    const months = 24;
    const payment = annuity(50_000, 0.02, months);
    expect(payment * months).toBeGreaterThan(50_000);
  });
});

describe("effectiveMonthlyRate", () => {
  it("equals the base rate when taxes are zero", () => {
    expect(effectiveMonthlyRate(0.0189, { kkdf: 0, bsmv: 0 })).toBe(0.0189);
  });

  it("applies KKDF + BSMV as a surcharge on the base rate", () => {
    const base = 0.0189;
    expect(effectiveMonthlyRate(base)).toBeCloseTo(
      base * (1 + KKDF_RATE + BSMV_RATE),
      10
    );
  });
});

describe("computeLoan", () => {
  const input = {
    price: 1_250_000,
    downPayment: 250_000,
    months: 48,
    baseMonthlyRate: 0.0189,
  };

  it("derives the loan principal from price minus down payment", () => {
    expect(computeLoan(input).loan).toBe(1_000_000);
  });

  it("floors the loan at 0 when the down payment exceeds the price", () => {
    expect(computeLoan({ ...input, downPayment: 2_000_000 }).loan).toBe(0);
  });

  it("reconciles monthly payment × term with total repayment", () => {
    const s = computeLoan(input);
    expect(s.monthlyPayment * input.months).toBeCloseTo(s.toplamGeriOdeme, 4);
  });

  it("splits total tax into KKDF + BSMV that sum back", () => {
    const s = computeLoan(input);
    expect(s.kkdf + s.bsmv).toBeCloseTo(s.toplamVergi, 4);
  });

  it("charges no tax when KKDF and BSMV are zero", () => {
    const s = computeLoan({ ...input, taxes: { kkdf: 0, bsmv: 0 } });
    expect(s.toplamVergi).toBeCloseTo(0, 4);
  });

  it("makes the taxed installment higher than the untaxed one", () => {
    const taxed = computeLoan(input);
    const untaxed = computeLoan({ ...input, taxes: { kkdf: 0, bsmv: 0 } });
    expect(taxed.monthlyPayment).toBeGreaterThan(untaxed.monthlyPayment);
  });

  it("computes the down-payment percentage", () => {
    expect(computeLoan(input).pesinatYuzde).toBe(20);
  });
});
