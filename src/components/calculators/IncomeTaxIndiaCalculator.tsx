import { useState, useMemo } from 'react';

/**
 * Indian Income Tax Calculator — handles both Old and New regime (FY 2025-26).
 * Computes:
 *  - Tax under New Regime (default since AY 2024-25)
 *  - Tax under Old Regime (with deductions)
 *  - Recommendation: which regime saves more
 *
 * Reference: Income Tax Act sections / Finance Act 2024-25 slabs
 */

interface Props {
  monthlyProfessionalTax?: number; // optional state-specific PT
  stateName?: string;
}

function formatINR(value: number): string {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
}
function fmtRupees(v: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);
}

// New Regime slabs (FY 2025-26) — also called "default" regime
function computeNewRegime(taxableIncome: number, ageGroup: 'below60' | '60to80' | 'above80'): number {
  // Standard deduction of ₹75,000 already factored into taxableIncome by caller
  let tax = 0;
  const slabs: Array<[number, number, number]> = [
    [0, 400000, 0],
    [400000, 800000, 0.05],
    [800000, 1200000, 0.10],
    [1200000, 1600000, 0.15],
    [1600000, 2000000, 0.20],
    [2000000, 2400000, 0.25],
    [2400000, Infinity, 0.30],
  ];
  for (const [from, to, rate] of slabs) {
    if (taxableIncome > from) {
      tax += (Math.min(taxableIncome, to) - from) * rate;
    }
  }
  // Section 87A rebate: full rebate if taxable income ≤ ₹12 lakh
  if (taxableIncome <= 1200000) tax = 0;
  // Surcharge
  let surcharge = 0;
  if (taxableIncome > 50000000) surcharge = tax * 0.37; // 37%
  else if (taxableIncome > 20000000) surcharge = tax * 0.25;
  else if (taxableIncome > 10000000) surcharge = tax * 0.15;
  else if (taxableIncome > 5000000) surcharge = tax * 0.10;
  // Health and Education Cess: 4%
  const cess = (tax + surcharge) * 0.04;
  return Math.round(tax + surcharge + cess);
}

// Old Regime slabs (FY 2025-26)
function computeOldRegime(taxableIncome: number, ageGroup: 'below60' | '60to80' | 'above80'): number {
  let tax = 0;
  // Slabs differ by age
  let slabs: Array<[number, number, number]>;
  if (ageGroup === 'above80') {
    slabs = [
      [0, 500000, 0],
      [500000, 1000000, 0.20],
      [1000000, Infinity, 0.30],
    ];
  } else if (ageGroup === '60to80') {
    slabs = [
      [0, 300000, 0],
      [300000, 500000, 0.05],
      [500000, 1000000, 0.20],
      [1000000, Infinity, 0.30],
    ];
  } else {
    slabs = [
      [0, 250000, 0],
      [250000, 500000, 0.05],
      [500000, 1000000, 0.20],
      [1000000, Infinity, 0.30],
    ];
  }
  for (const [from, to, rate] of slabs) {
    if (taxableIncome > from) {
      tax += (Math.min(taxableIncome, to) - from) * rate;
    }
  }
  // Section 87A rebate: full rebate if taxable income ≤ ₹5 lakh (old regime)
  if (taxableIncome <= 500000) tax = 0;
  let surcharge = 0;
  if (taxableIncome > 50000000) surcharge = tax * 0.37;
  else if (taxableIncome > 20000000) surcharge = tax * 0.25;
  else if (taxableIncome > 10000000) surcharge = tax * 0.15;
  else if (taxableIncome > 5000000) surcharge = tax * 0.10;
  const cess = (tax + surcharge) * 0.04;
  return Math.round(tax + surcharge + cess);
}

export default function IncomeTaxIndiaCalculator({ monthlyProfessionalTax = 0, stateName }: Props) {
  const [grossIncome, setGrossIncome] = useState<number>(1500000);
  const [ageGroup, setAgeGroup] = useState<'below60' | '60to80' | 'above80'>('below60');

  // Old regime deductions
  const [section80C, setSection80C] = useState<number>(150000);
  const [section80D, setSection80D] = useState<number>(25000);
  const [hraAmount, setHraAmount] = useState<number>(180000);
  const [homeLoanInterest, setHomeLoanInterest] = useState<number>(0);
  const [npsExtra, setNpsExtra] = useState<number>(50000);

  // Yearly professional tax (₹0-2,500 max as per state law)
  const yearlyPT = monthlyProfessionalTax * 12;

  // OLD REGIME calculation
  const oldResult = useMemo(() => {
    // Old regime allows: ₹50K standard deduction, plus 80C, 80D, HRA, home loan interest, NPS extra
    const standardDeduction = 50000;
    const totalDeductions = standardDeduction + Math.min(section80C, 150000) + Math.min(section80D, 100000) + hraAmount + Math.min(homeLoanInterest, 200000) + Math.min(npsExtra, 50000) + yearlyPT;
    const taxable = Math.max(0, grossIncome - totalDeductions);
    return {
      taxableIncome: taxable,
      tax: computeOldRegime(taxable, ageGroup),
      deductionsUsed: totalDeductions,
    };
  }, [grossIncome, ageGroup, section80C, section80D, hraAmount, homeLoanInterest, npsExtra, yearlyPT]);

  // NEW REGIME calculation
  const newResult = useMemo(() => {
    // New regime: only ₹75K standard deduction (salaried), and PT
    const standardDeduction = 75000;
    const totalDeductions = standardDeduction + yearlyPT;
    const taxable = Math.max(0, grossIncome - totalDeductions);
    return {
      taxableIncome: taxable,
      tax: computeNewRegime(taxable, ageGroup),
      deductionsUsed: totalDeductions,
    };
  }, [grossIncome, ageGroup, yearlyPT]);

  const recommendation = oldResult.tax < newResult.tax ? 'old' : 'new';
  const savings = Math.abs(oldResult.tax - newResult.tax);

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        <div className="bg-yellow-accent border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🇮🇳</span>
            <h2 className="!text-lg sm:!text-xl !my-0 !text-ink-900 font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>
              India Income Tax Calculator
              {stateName ? `, ${stateName}` : ''}
            </h2>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink-900">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ink-900 opacity-50"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-ink-900"></span>
            </span>
            FY 2025-26
          </span>
        </div>

        {/* Common inputs */}
        <div className="p-5 sm:p-7 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 bg-ink-50">
          <div className="md:col-span-2">
            <label htmlFor="gross-income" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Annual Gross Income</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">₹</span>
              <input
                id="gross-income" type="number" min={0} step={10000} value={grossIncome}
                onChange={(e) => setGrossIncome(Number(e.target.value) || 0)}
                className="w-full pl-7 pr-3 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-yellow-accent transition-all"
                inputMode="numeric"
              />
            </div>
            <div className="text-xs font-bold text-ink-700 mt-1.5">{formatINR(grossIncome)} per year</div>
            <input type="range" min={300000} max={20000000} step={50000} value={grossIncome} onChange={(e) => setGrossIncome(Number(e.target.value))} className="w-full mt-2 accent-yellow-accent" aria-label="Gross income slider" />
          </div>
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Age Group</label>
            <select
              value={ageGroup}
              onChange={(e) => setAgeGroup(e.target.value as any)}
              className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-cyan-accent transition-all cursor-pointer"
            >
              <option value="below60">Below 60 years</option>
              <option value="60to80">60-80 (Senior Citizen)</option>
              <option value="above80">80+ (Super Senior)</option>
            </select>
          </div>
          {monthlyProfessionalTax > 0 && (
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">
                Professional Tax {stateName ? `(${stateName})` : ''}
              </label>
              <div className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold">
                ₹{monthlyProfessionalTax}/mo · ₹{yearlyPT}/yr
              </div>
            </div>
          )}
        </div>

        {/* Old regime deductions (collapsed by default for new regime users) */}
        <details className="border-t-[2.5px] border-ink-900 bg-white" open>
          <summary className="cursor-pointer p-5 sm:p-7 font-extrabold text-ink-900 bg-pink-accent/10 list-none flex items-center justify-between gap-4">
            <span style={{ fontFamily: 'Inter Tight, sans-serif' }}>Old Regime deductions (only used if Old Regime is selected)</span>
            <span className="text-pink-accent text-sm">+ Toggle</span>
          </summary>
          <div className="px-5 sm:px-7 pb-5 sm:pb-7 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Section 80C (max ₹1.5L)</label>
              <input type="number" min={0} max={150000} step={1000} value={section80C} onChange={(e) => setSection80C(Math.min(150000, Number(e.target.value) || 0))} className="w-full px-3.5 py-2.5 bg-white border-2 border-ink-200 rounded-xl text-base font-bold focus:outline-none focus:ring-2 focus:ring-pink-accent" inputMode="numeric" />
            </div>
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Section 80D Medical (max ₹1L)</label>
              <input type="number" min={0} max={100000} step={1000} value={section80D} onChange={(e) => setSection80D(Math.min(100000, Number(e.target.value) || 0))} className="w-full px-3.5 py-2.5 bg-white border-2 border-ink-200 rounded-xl text-base font-bold focus:outline-none focus:ring-2 focus:ring-pink-accent" inputMode="numeric" />
            </div>
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">HRA Exemption (yearly)</label>
              <input type="number" min={0} step={1000} value={hraAmount} onChange={(e) => setHraAmount(Number(e.target.value) || 0)} className="w-full px-3.5 py-2.5 bg-white border-2 border-ink-200 rounded-xl text-base font-bold focus:outline-none focus:ring-2 focus:ring-pink-accent" inputMode="numeric" />
            </div>
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Home Loan Interest 24(b) (max ₹2L)</label>
              <input type="number" min={0} max={200000} step={1000} value={homeLoanInterest} onChange={(e) => setHomeLoanInterest(Math.min(200000, Number(e.target.value) || 0))} className="w-full px-3.5 py-2.5 bg-white border-2 border-ink-200 rounded-xl text-base font-bold focus:outline-none focus:ring-2 focus:ring-pink-accent" inputMode="numeric" />
            </div>
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">NPS Extra 80CCD(1B) (max ₹50K)</label>
              <input type="number" min={0} max={50000} step={1000} value={npsExtra} onChange={(e) => setNpsExtra(Math.min(50000, Number(e.target.value) || 0))} className="w-full px-3.5 py-2.5 bg-white border-2 border-ink-200 rounded-xl text-base font-bold focus:outline-none focus:ring-2 focus:ring-pink-accent" inputMode="numeric" />
            </div>
          </div>
        </details>

        {/* COMPARISON RESULT */}
        <div className="p-5 sm:p-7 bg-white border-t-[2.5px] border-ink-900">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* OLD REGIME */}
            <div className={`${recommendation === 'old' ? 'bg-lime-accent' : 'bg-white'} border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm relative`}>
              {recommendation === 'old' && (
                <span className="absolute -top-3 -right-3 chip-yellow !text-xs">✓ Better</span>
              )}
              <div className="text-xs font-extrabold uppercase tracking-wider text-ink-900 mb-1">Old Regime</div>
              <div className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight', letterSpacing: '-0.04em' }}>
                {fmtRupees(oldResult.tax)}
              </div>
              <div className="text-xs text-ink-800 mt-2 font-semibold">
                Taxable: {formatINR(oldResult.taxableIncome)}
              </div>
              <div className="text-xs text-ink-800 font-semibold">
                Deductions: {formatINR(oldResult.deductionsUsed)}
              </div>
            </div>

            {/* NEW REGIME */}
            <div className={`${recommendation === 'new' ? 'bg-lime-accent' : 'bg-white'} border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm relative`}>
              {recommendation === 'new' && (
                <span className="absolute -top-3 -right-3 chip-yellow !text-xs">✓ Better</span>
              )}
              <div className="text-xs font-extrabold uppercase tracking-wider text-ink-900 mb-1">New Regime (default)</div>
              <div className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight', letterSpacing: '-0.04em' }}>
                {fmtRupees(newResult.tax)}
              </div>
              <div className="text-xs text-ink-800 mt-2 font-semibold">
                Taxable: {formatINR(newResult.taxableIncome)}
              </div>
              <div className="text-xs text-ink-800 font-semibold">
                Deductions: {formatINR(newResult.deductionsUsed)} (auto)
              </div>
            </div>
          </div>

          <div className="mt-5 bg-cyan-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-xs font-extrabold uppercase tracking-wider text-ink-900 mb-1">💡 Recommendation</div>
            <p className="text-ink-900 font-bold !m-0 leading-relaxed">
              {savings > 100 ? (
                <>The <strong>{recommendation === 'old' ? 'Old' : 'New'} Regime</strong> saves you <strong>{fmtRupees(savings)}</strong> in tax this year. {recommendation === 'old' ? 'Old regime wins because your deductions exceed ₹4 lakh.' : 'New regime wins. You don\'t have enough deductions to beat the default lower slabs.'}</>
              ) : (
                <>Both regimes produce nearly identical tax. The <strong>New Regime</strong> is simpler with no deduction documentation needed.</>
              )}
            </p>
          </div>
        </div>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · FY 2025-26 (AY 2026-27) slabs · Includes 4% cess and surcharge · Not legal/tax advice. Consult a CA for filings.</div>
    </div>
  );
}
