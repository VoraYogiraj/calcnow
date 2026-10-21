/**
 * Constant annual-rate vehicle depreciation.
 * Retained value after n years = price * (1 - rate/100)^n.
 * The annual rate is capped at 100% — a higher rate would invert the
 * remaining-value factor and produce negative vehicle values.
 */
export interface DepreciationRow {
  year: number;
  value: number;
  pct: number;
  cumDep: number;
}

export interface DepreciationResult {
  rows: DepreciationRow[];
  finalValue: number;
  totalDep: number;
  pctLost: number;
}

export function calculateDepreciation(price: number, rate: number, years: number): DepreciationResult {
  const factor = 1 - Math.min(rate, 100) / 100;
  const rows: DepreciationRow[] = [];
  for (let y = 0; y <= years; y++) {
    const value = price * Math.pow(factor, y);
    rows.push({ year: y, value, pct: Math.pow(factor, y) * 100, cumDep: price - value });
  }
  const finalValue = price * Math.pow(factor, years);
  const totalDep = price - finalValue;
  const pctLost = (1 - Math.pow(factor, years)) * 100;
  return { rows, finalValue, totalDep, pctLost };
}
