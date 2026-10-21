/**
 * Official Atal Pension Yojana monthly contribution chart.
 * Key = entry age (18 to 40). Value = monthly contribution in ₹ for the
 * five guaranteed pension levels [1000, 2000, 3000, 4000, 5000].
 * These are fixed government-notified figures, NOT computed by a returns
 * formula. APY is a defined-benefit scheme: the contribution is a lookup.
 */
export const APY_CHART: Record<number, [number, number, number, number, number]> = {
  18: [42, 84, 126, 168, 210],
  19: [46, 92, 138, 183, 228],
  20: [50, 100, 150, 198, 248],
  21: [54, 108, 162, 215, 269],
  22: [59, 117, 177, 234, 292],
  23: [64, 127, 192, 254, 318],
  24: [70, 139, 208, 277, 346],
  25: [76, 151, 226, 301, 376],
  26: [82, 164, 246, 327, 409],
  27: [90, 178, 268, 356, 446],
  28: [97, 194, 292, 388, 485],
  29: [106, 212, 318, 423, 529],
  30: [116, 231, 347, 462, 577],
  31: [126, 252, 379, 504, 630],
  32: [138, 276, 414, 551, 689],
  33: [151, 302, 453, 602, 752],
  34: [165, 330, 495, 659, 824],
  35: [181, 362, 543, 722, 902],
  36: [198, 396, 594, 792, 990],
  37: [218, 436, 654, 870, 1087],
  38: [240, 480, 720, 957, 1196],
  39: [264, 528, 792, 1054, 1318],
  40: [291, 582, 873, 1164, 1454],
};

/** Indicative corpus returned to the nominee after both subscriber and spouse, by pension level. */
export const APY_CORPUS: Record<number, number> = {
  1000: 170000,
  2000: 340000,
  3000: 510000,
  4000: 680000,
  5000: 850000,
};

export const APY_PENSION_LEVELS = [1000, 2000, 3000, 4000, 5000] as const;
export const APY_AGES: number[] = Array.from({ length: 23 }, (_, i) => 18 + i); // 18..40

export const APY_MIN_AGE = 18;
export const APY_MAX_AGE = 40;
export const APY_PENSION_START_AGE = 60;

export interface ApyResult {
  monthly: number;
  perCycle: number;
  years: number;
  totalContributed: number;
  corpus: number;
  totalCycles: number;
}

/**
 * Clamp an entry age into the valid 18–40 band. Non-finite input falls back to the
 * default lookup age of 25 (matches the component's behaviour).
 */
export function clampApyAge(age: number): number {
  if (!Number.isFinite(age)) return 25;
  return Math.min(APY_MAX_AGE, Math.max(APY_MIN_AGE, Math.round(age)));
}

/**
 * Compute APY contribution figures for an entry age, pension level and payment frequency.
 * `freqMult` scales the monthly contribution per cycle (1 = monthly, 3 = quarterly, 6 = half-yearly).
 */
export function calculateApy(age: number, pension: number, freqMult: number, freqCycles: number): ApyResult {
  const lookupAge = clampApyAge(age);
  const pensionIndex = APY_PENSION_LEVELS.indexOf(pension as (typeof APY_PENSION_LEVELS)[number]);
  const monthly = APY_CHART[lookupAge][pensionIndex >= 0 ? pensionIndex : 4];
  const perCycle = monthly * freqMult;
  const years = APY_PENSION_START_AGE - lookupAge;
  const totalContributed = monthly * 12 * years;
  const corpus = APY_CORPUS[pension] ?? APY_CORPUS[5000];
  const totalCycles = freqCycles * years;
  return { monthly, perCycle, years, totalContributed, corpus, totalCycles };
}
