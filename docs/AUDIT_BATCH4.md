# P1-01 Batch 4 — Math / Conversion (verified 2026-10-21)

Direct reads confirmed:
- FractionCalculator: gcd/LCM correct; zero-divisor guarded (returns 0); parseInt/parseFloat with NaN handling.
- PercentageCalculator: `value * percent / 100`; reverse-percent path guarded on `percent !== 0`.
- ScientificCalculator: native `Math` functions only; scientific-notation parsing; no custom formula errors.
- TemperatureConverter: C<->F<->K linear conversions; float-equality guard (`abs < 0.0001`).
- UnitConverter: line 115 already cleaned (`c.units[0].sym`); verified no functional error (previous `Math.min(0, len-1)` was always 0 for all categories with len >= 2).
- CurrencyConverter: external source `open.er-api.com/v6/latest`; no API key; rate accuracy is external (not locally verifiable).

Defects: none new in batch 4.

Verification:
- `npx vitest run`: 23 passing (BMI 5, EMI 5, Mortgage 7, APY 6).
- `npm run build`: exit 0, 1675 pages, sitemap regenerated, IndexNow 913 URLs submitted.
- No deploy. Brand preserved.
