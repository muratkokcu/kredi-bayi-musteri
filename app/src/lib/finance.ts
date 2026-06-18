/**
 * Turkish vehicle-loan (taşıt kredisi) finance math.
 *
 * In Türkiye, consumer/vehicle-loan installments are NOT computed on the
 * advertised monthly rate directly. Two taxes are levied on the INTEREST
 * portion and folded into an *effective* monthly rate used for the annuity:
 *   - KKDF (Kaynak Kullanımını Destekleme Fonu)
 *   - BSMV (Banka ve Sigorta Muameleleri Vergisi)
 *
 * effectiveRate = baseRate × (1 + KKDF + BSMV)
 *
 * NOTE: the prototype previously treated the advertised rate as the literal
 * installment rate and added "BSMV = 1.89% of principal" as a one-off line —
 * that was a placeholder, not correct taşıt-kredisi math.
 *
 * VERIFY: the default KKDF/BSMV rates below must be confirmed against the
 * current GİB/BDDK schedule before any real (non-demo) use; they are
 * intentionally overridable so a real rate service can supply live values.
 */

export const KKDF_RATE = 0.15; // VERIFY against current GİB schedule
export const BSMV_RATE = 0.15; // VERIFY against current GİB schedule

export interface TaxRates {
  kkdf: number;
  bsmv: number;
}

const DEFAULT_TAXES: TaxRates = { kkdf: KKDF_RATE, bsmv: BSMV_RATE };

/** Advertised monthly rate → effective monthly rate including KKDF + BSMV. */
export function effectiveMonthlyRate(
  baseMonthlyRate: number,
  taxes: TaxRates = DEFAULT_TAXES
): number {
  return baseMonthlyRate * (1 + taxes.kkdf + taxes.bsmv);
}

/**
 * Equal-installment (annuity) payment. `monthlyRate` is a fraction (0.0189),
 * not a percent. Falls back to straight-line when the rate is 0.
 */
export function annuity(
  principal: number,
  monthlyRate: number,
  months: number
): number {
  if (months <= 0) {
    return 0;
  }
  if (monthlyRate === 0) {
    return principal / months;
  }
  return (principal * monthlyRate) / (1 - (1 + monthlyRate) ** -months);
}

export interface LoanInput {
  /** Advertised monthly rate as a fraction, e.g. 0.0189 for %1,89. */
  baseMonthlyRate: number;
  downPayment: number;
  months: number;
  price: number;
  taxes?: TaxRates;
}

export interface LoanSummary {
  bsmv: number;
  /** Total interest including taxes. */
  faizTutari: number;
  kkdf: number;
  loan: number;
  monthlyPayment: number;
  /** Down payment as a whole percent of price. */
  pesinatYuzde: number;
  toplamGeriOdeme: number;
  toplamVergi: number;
}

/**
 * Full taşıt-kredisi breakdown. Installment is computed on the effective
 * (tax-inclusive) rate; taxes are then split out of the total interest so the
 * UI can show KKDF / BSMV lines that actually reconcile to the payment.
 */
export function computeLoan(input: LoanInput): LoanSummary {
  const taxes = input.taxes ?? DEFAULT_TAXES;
  const loan = Math.max(input.price - input.downPayment, 0);

  const effRate = effectiveMonthlyRate(input.baseMonthlyRate, taxes);
  const monthlyPayment = annuity(loan, effRate, input.months);
  const toplamGeriOdeme = monthlyPayment * input.months;
  const faizTutari = toplamGeriOdeme - loan;

  // Untaxed interest = interest at the base rate; the remainder is tax.
  const baseInterest = annuity(loan, input.baseMonthlyRate, input.months) * input.months - loan;
  const toplamVergi = Math.max(faizTutari - baseInterest, 0);
  const taxSum = taxes.kkdf + taxes.bsmv;
  const kkdf = taxSum > 0 ? (toplamVergi * taxes.kkdf) / taxSum : 0;
  const bsmv = toplamVergi - kkdf;

  const pesinatYuzde =
    input.price > 0 ? Math.round((input.downPayment / input.price) * 100) : 0;

  return {
    loan,
    monthlyPayment,
    toplamGeriOdeme,
    faizTutari,
    toplamVergi,
    kkdf,
    bsmv,
    pesinatYuzde,
  };
}
