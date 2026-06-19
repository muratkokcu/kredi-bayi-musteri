import { describe, expect, it } from "vitest";
import { isValidTCKimlik, isValidTRIban, isValidTRPhone } from "./validators";

describe("isValidTCKimlik", () => {
  it("accepts a checksum-valid number", () => {
    expect(isValidTCKimlik("10000000146")).toBe(true);
  });

  it("rejects wrong length / leading zero / non-digits", () => {
    expect(isValidTCKimlik("1234")).toBe(false);
    expect(isValidTCKimlik("00000000000")).toBe(false);
    expect(isValidTCKimlik("1000000014x")).toBe(false);
  });

  it("rejects a checksum-invalid number", () => {
    expect(isValidTCKimlik("12345678901")).toBe(false);
    expect(isValidTCKimlik("11111111111")).toBe(false);
  });
});

describe("isValidTRIban", () => {
  it("accepts a valid TR IBAN (with or without spaces)", () => {
    expect(isValidTRIban("TR330006100519786457841326")).toBe(true);
    expect(isValidTRIban("TR33 0006 1005 1978 6457 8413 26")).toBe(true);
  });

  it("rejects wrong country, length or check digits", () => {
    expect(isValidTRIban("DE89370400440532013000")).toBe(false);
    expect(isValidTRIban("TR000006100519786457841326")).toBe(false);
    expect(isValidTRIban("TR33")).toBe(false);
  });
});

describe("isValidTRPhone", () => {
  it("accepts TR mobile numbers in common formats", () => {
    expect(isValidTRPhone("0532 123 45 67")).toBe(true);
    expect(isValidTRPhone("+90 532 123 45 67")).toBe(true);
    expect(isValidTRPhone("5321234567")).toBe(true);
  });

  it("rejects non-mobile or malformed numbers", () => {
    expect(isValidTRPhone("0212 123 45 67")).toBe(false);
    expect(isValidTRPhone("1234")).toBe(false);
  });
});
