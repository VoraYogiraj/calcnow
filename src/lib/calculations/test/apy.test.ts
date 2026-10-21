import { describe, it, expect } from 'vitest';
import { APY_CHART, APY_CORPUS, APY_PENSION_LEVELS, clampApyAge, calculateApy } from '../apy';

describe('APY lookup (fixed government-notified figures)', () => {
  it('clamp handles out-of-range / non-finite ages', () => {
    expect(clampApyAge(10)).toBe(18);
    expect(clampApyAge(50)).toBe(40);
    expect(clampApyAge(NaN)).toBe(25);
    expect(clampApyAge(Infinity)).toBe(25);
  });

  it('chart row matches official notified figures (age 30)', () => {
    expect(APY_CHART[30]).toEqual([116, 231, 347, 462, 577]);
    expect(APY_CHART[25]).toEqual([76, 151, 226, 301, 376]);
  });

  it('compute for age 30 / pension 3000 / monthly', () => {
    const r = calculateApy(30, 3000, 1, 12);
    expect(r.monthly).toBe(347); // index 2 of the age-30 row
    expect(r.perCycle).toBe(347);
    expect(r.years).toBe(30);
    expect(r.totalContributed).toBe(347 * 12 * 30);
    expect(r.totalCycles).toBe(12 * 30);
    expect(r.corpus).toBe(APY_CORPUS[3000]);
  });

  it('quarterly and half-yearly scale per-cycle contribution only', () => {
    const q = calculateApy(30, 3000, 3, 4);
    expect(q.perCycle).toBe(347 * 3);
    expect(q.totalContributed).toBe(347 * 12 * 30); // total paid is unchanged by frequency
    const h = calculateApy(30, 3000, 6, 2);
    expect(h.perCycle).toBe(347 * 6);
  });

  it('unknown pension level falls back to the 5000 index', () => {
    const r = calculateApy(30, 7777, 1, 12);
    expect(r.monthly).toBe(APY_CHART[30][4]);
    expect(r.corpus).toBe(APY_CORPUS[5000]);
  });

  it('every age 18–40 has a complete 5-level row', () => {
    for (let a = 18; a <= 40; a++) {
      expect(APY_CHART[a]).toBeDefined();
      expect(APY_CHART[a].length).toBe(APY_PENSION_LEVELS.length);
    }
  });
});
