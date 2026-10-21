import { describe, it, expect } from 'vitest';
import { calculateDepreciation } from '../depreciation';

describe('Car depreciation (constant annual rate)', () => {
  it('year 0 retains full value', () => {
    const r = calculateDepreciation(30000, 15, 5);
    expect(r.rows[0].value).toBe(30000);
    expect(r.rows[0].pct).toBe(100);
    expect(r.rows[0].cumDep).toBe(0);
  });

  it('reference: 30000 at 15% for 5 years', () => {
    const r = calculateDepreciation(30000, 15, 5);
    // 0.85^5 = 0.4437053125 -> 13311.159375
    expect(r.finalValue).toBeCloseTo(13311.159375, 6);
    expect(r.totalDep).toBeCloseTo(30000 - 13311.159375, 6);
    expect(r.pctLost).toBeCloseTo(55.62946875, 6);
    expect(r.rows.length).toBe(6); // years 0..5 inclusive
  });

  it('caps rate at 100% so values never invert negative', () => {
    const r = calculateDepreciation(30000, 150, 3);
    expect(r.finalValue).toBe(0);
    expect(r.totalDep).toBe(30000);
    expect(r.pctLost).toBe(100);
    expect(r.rows.every(row => row.value >= 0)).toBe(true);
  });

  it('zero rate leaves value unchanged', () => {
    const r = calculateDepreciation(30000, 0, 5);
    expect(r.finalValue).toBe(30000);
    expect(r.totalDep).toBe(0);
    expect(r.pctLost).toBe(0);
  });

  it('single-year hold', () => {
    const r = calculateDepreciation(20000, 20, 1);
    expect(r.finalValue).toBeCloseTo(16000, 8);
    expect(r.pctLost).toBeCloseTo(20, 8);
  });
});
