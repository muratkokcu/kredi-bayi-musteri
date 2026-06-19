import { z } from "zod";

/**
 * Turkish domain validators (TC Kimlik No, IBAN, telefon). Pure predicates so
 * they're unit-testable; zod fields wrap them for react-hook-form.
 */

/** TC Kimlik No: 11 digits, first non-zero, with the two checksum digits. */
export function isValidTCKimlik(value: string): boolean {
  const v = value.trim();
  if (!/^[1-9]\d{10}$/.test(v)) {
    return false;
  }
  const d = v.split("").map(Number);
  const oddSum = d[0] + d[2] + d[4] + d[6] + d[8];
  const evenSum = d[1] + d[3] + d[5] + d[7];
  const tenth = ((oddSum * 7 - evenSum) % 10 + 10) % 10;
  if (tenth !== d[9]) {
    return false;
  }
  const firstTen = d.slice(0, 10).reduce((a, b) => a + b, 0);
  return firstTen % 10 === d[10];
}

/** Turkish IBAN: TR + 24 digits (26 chars), validated with the ISO mod-97 check. */
export function isValidTRIban(value: string): boolean {
  const v = value.replace(/\s+/g, "").toLocaleUpperCase("en");
  if (!/^TR\d{24}$/.test(v)) {
    return false;
  }
  const rearranged = v.slice(4) + v.slice(0, 4);
  let remainder = 0;
  for (const ch of rearranged) {
    const chunk =
      ch >= "A" && ch <= "Z" ? (ch.charCodeAt(0) - 55).toString() : ch;
    for (const digit of chunk) {
      remainder = (remainder * 10 + Number(digit)) % 97;
    }
  }
  return remainder === 1;
}

/** TR mobile: normalizes +90 / 0 prefixes, requires a 5XXXXXXXXX number. */
export function isValidTRPhone(value: string): boolean {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("90")) {
    digits = digits.slice(2);
  } else if (digits.startsWith("0")) {
    digits = digits.slice(1);
  }
  return /^5\d{9}$/.test(digits);
}

export const tcKimlikField = z
  .string()
  .refine(isValidTCKimlik, "Geçerli bir TC Kimlik No girin");

export const ibanField = z
  .string()
  .refine(isValidTRIban, "Geçerli bir TR IBAN girin (TR + 24 hane)");

export const telefonField = z
  .string()
  .refine(isValidTRPhone, "Geçerli bir telefon girin (5XX XXX XX XX)");
