import { describe, it, expect } from 'vitest';
import { calculateMortgage, calculateWithExtra } from '../mortgage';

describe('Mortgage amortization regression', () => {
  it('standard 30yr @ 7% on $300k → monthly ≈ $1,995.91; total ≈ $718.5k', () => {
    const r = calculateMortgage(300000, 7, 30);
    expect(r.monthlyPayment).toBeCloseTo(1995.91, 2);
    expect(r.totalPaid).toBeCloseTo(718526.69, 0);
    expect(r.totalInterest).toBeCloseTo(718526.69 - 300000, 0);
    expect(r.schedule.length).toBe(360);
    // Last schedule entry balance should be ~0 (float-capped via Math.max)
    const last = r.schedule[r.schedule.length - 1];
    expect(last.balance).toBeGreaterThanOrEqual(0);
    expect(last.balance).toBeLessThan(1);
  });
  it('0% rate over 1 year → payment = principal / 12, no interest', () => {
    const r = calculateMortgage(120000, 0, 1);
    expect(r.monthlyPayment).toBeCloseTo(10000, 6);
    expect(r.totalInterest).toBe(0);
    expect(r.schedule).toHaveLength(0);
  });
  it('0 years → zero payments, empty schedule (no division by zero)', () => {
    const r = calculateMortgage(100000, 8, 0);
    expect(r.monthlyPayment).toBe(0);
    expect(r.schedule).toHaveLength(0);
    expect(isFinite(r.monthlyPayment)).toBe(true);
  });
  it('schedule balance decreases monotonically and never goes negative', () => {
    const r = calculateMortgage(200000, 6, 15);
    for (let i = 1; i < r.schedule.length; i++) {
      expect(r.schedule[i].balance).toBeLessThanOrEqual(r.schedule[i - 1].balance);
      expect(r.schedule[i].balance).toBeGreaterThanOrEqual(0);
    }
  });
  it('sum of scheduled principal equals the loan amount', () => {
    const r = calculateMortgage(150000, 5.5, 20);
    const principalSum = r.schedule.reduce((s, row) => s + row.principal, 0);
    expect(principalSum).toBeCloseTo(150000, 2);
  });
  it('extra payment of $100/mo shortens payoff below the 360-month base', () => {
    const { months } = calculateWithExtra(300000, 7, 30, 1995.91, 100);
    expect(months).toBeGreaterThan(0);
    expect(months).toBeLessThan(360);
  });
  it('zero extra payment returns base term with no interest counted', () => {
    const r = calculateWithExtra(300000, 7, 30, 1995.91, 0);
    expect(r.months).toBe(360);
    expect(r.totalInterest).toBe(0);
  });
});
