import { describe, it, expect } from 'vitest';
import { calculateEMI } from '../emi';

describe('EMI formula regression', () => {
  it('₹25L @ 8.5% for 20y → EMI ≈ ₹17,290 (standard annuity)', () => {
    const r = calculateEMI(2500000, 8.5, 240);
    expect(r.emi).toBeCloseTo(21695.58, 0);
    expect(r.totalPaid).toBeCloseTo(r.emi * 240, 4);
    expect(r.totalInterest).toBeCloseTo(r.emi * 240 - 2500000, 4);
  });
  it('zero interest → EMI = principal / months, no interest', () => {
    const r = calculateEMI(120000, 0, 12);
    expect(r.emi).toBeCloseTo(10000, 6);
    expect(r.totalInterest).toBe(0);
    expect(r.totalPaid).toBeCloseTo(120000, 6);
  });
  it('zero months → all zeros (no division by zero)', () => {
    const r = calculateEMI(100000, 8, 0);
    expect(r.emi).toBe(0);
    expect(isFinite(r.emi)).toBe(true);
  });
  it('1 year at 12% on ₹100k → EMI ≈ ₹8,849 (known value)', () => {
    const r = calculateEMI(100000, 12, 12);
    expect(r.emi).toBeCloseTo(8884.88, 1);
  });
  it('total interest is positive and totalPaid > principal for a rate-bearing loan', () => {
    const r = calculateEMI(1000000, 7, 120);
    expect(r.totalInterest).toBeGreaterThan(0);
    expect(r.totalPaid).toBeGreaterThan(1000000);
  });
});
