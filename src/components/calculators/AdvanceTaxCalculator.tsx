import { useState, useMemo } from 'react';

/**
 * Advance Tax Calculator (India) for FY 2025-26 / AY 2026-27.
 *
 * Advance tax is income tax paid in installments during the year (pay-as-you-earn)
 * rather than as a lump sum at filing. It applies when total tax liability for the
 * year, after TDS, is Rs 10,000 or more.
 *
 * Tax computation REUSES the exact slab logic from IncomeTaxIndiaCalculator.tsx so
 * the two calculators agree:
 *  - New regime: Rs 75,000 standard deduction, slabs 0/5/10/15/20/25/30, 87A rebate
 *    up to Rs 12L taxable, 4% Health & Education Cess.
 *  - Old regime: Rs 50,000 standard deduction + user deductions, slabs 0/5/20/30,
 *    87A rebate up to Rs 5L taxable, 4% cess.
 *
 * Installment schedule (non-presumptive): cumulative 15% / 45% / 75% / 100%.
 */

// ---- Rupee helpers (hard-coded, INR only) ----
function fmtINR(v: number): string {
  if (!isFinite(v) || isNaN(v)) v = 0;
  return '₹' + Math.round(v).toLocaleString('en-IN');
}
function fmtShort(v: number): string {
  if (!isFinite(v) || isNaN(v)) v = 0;
  if (v >= 10000000) return `₹${(v / 10000000).toFixed(2)} Cr`;
  if (v >= 100000) return `₹${(v / 100000).toFixed(2)} L`;
  return '₹' + Math.round(v).toLocaleString('en-IN');
}

// New Regime slabs (FY 2025-26), copied verbatim from IncomeTaxIndiaCalculator.tsx
function computeNewRegime(taxableIncome: number): number {
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
  // Section 87A rebate: full rebate if taxable income <= Rs 12 lakh
  if (taxableIncome <= 1200000) tax = 0;
  let surcharge = 0;
  if (taxableIncome > 50000000) surcharge = tax * 0.37;
  else if (taxableIncome > 20000000) surcharge = tax * 0.25;
  else if (taxableIncome > 10000000) surcharge = tax * 0.15;
  else if (taxableIncome > 5000000) surcharge = tax * 0.10;
  const cess = (tax + surcharge) * 0.04; // 4% Health & Education Cess
  return Math.round(tax + surcharge + cess);
}

// Old Regime slabs (FY 2025-26, below 60), copied verbatim from IncomeTaxIndiaCalculator.tsx
function computeOldRegime(taxableIncome: number): number {
  let tax = 0;
  const slabs: Array<[number, number, number]> = [
    [0, 250000, 0],
    [250000, 500000, 0.05],
    [500000, 1000000, 0.20],
    [1000000, Infinity, 0.30],
  ];
  for (const [from, to, rate] of slabs) {
    if (taxableIncome > from) {
      tax += (Math.min(taxableIncome, to) - from) * rate;
    }
  }
  // Section 87A rebate: full rebate if taxable income <= Rs 5 lakh (old regime)
  if (taxableIncome <= 500000) tax = 0;
  let surcharge = 0;
  if (taxableIncome > 50000000) surcharge = tax * 0.37;
  else if (taxableIncome > 20000000) surcharge = tax * 0.25;
  else if (taxableIncome > 10000000) surcharge = tax * 0.15;
  else if (taxableIncome > 5000000) surcharge = tax * 0.10;
  const cess = (tax + surcharge) * 0.04; // 4% Health & Education Cess
  return Math.round(tax + surcharge + cess);
}

const SCHEDULE: Array<{ date: string; cumPct: number; incPct: number }> = [
  { date: 'On or before 15 Jun 2025', cumPct: 15, incPct: 15 },
  { date: 'On or before 15 Sep 2025', cumPct: 45, incPct: 30 },
  { date: 'On or before 15 Dec 2025', cumPct: 75, incPct: 30 },
  { date: 'On or before 15 Mar 2026', cumPct: 100, incPct: 25 },
];

export default function AdvanceTaxCalculator() {
  const [regime, setRegime] = useState<'new' | 'old'>('new');
  const [income, setIncome] = useState<number>(1500000);
  const [deductions, setDeductions] = useState<number>(0);
  const [tds, setTds] = useState<number>(0);

  const result = useMemo(() => {
    const safeIncome = Math.max(0, Number(income) || 0);
    const safeDed = Math.max(0, Number(deductions) || 0);
    const safeTds = Math.max(0, Number(tds) || 0);

    let taxable: number;
    let totalTax: number;
    if (regime === 'new') {
      // New regime: only Rs 75,000 standard deduction is allowed (baked in).
      taxable = Math.max(0, safeIncome - 75000);
      totalTax = computeNewRegime(taxable);
    } else {
      // Old regime: Rs 50,000 standard deduction + user deductions (80C, HRA, etc.)
      taxable = Math.max(0, safeIncome - 50000 - safeDed);
      totalTax = computeOldRegime(taxable);
    }

    const advanceTax = Math.max(0, totalTax - safeTds);
    const required = advanceTax >= 10000;

    const rows = SCHEDULE.map((s) => ({
      ...s,
      cumAmount: Math.round(advanceTax * (s.cumPct / 100)),
      incAmount: Math.round(advanceTax * (s.incPct / 100)),
    }));

    return { taxable, totalTax, advanceTax, required, rows };
  }, [regime, income, deductions, tds]);

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        {/* Header bar: bg-yellow-accent with text-ink-900 */}
        <div className="bg-yellow-accent border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🗓️</span>
            <h2 className="!text-lg sm:!text-xl !my-0 !text-ink-900 font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>
              Advance Tax Calculator
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

        {/* Inputs */}
        <div className="p-5 sm:p-7 bg-ink-50">
          {/* Regime toggle */}
          <div className="mb-5">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Tax regime</label>
            <div className="inline-flex rounded-xl border-[2.5px] border-ink-900 overflow-hidden shadow-sticker-sm">
              <button
                type="button"
                onClick={() => setRegime('new')}
                className={`px-5 py-2.5 text-sm font-extrabold transition-colors ${regime === 'new' ? 'bg-ink-900 text-white' : 'bg-white text-ink-900 hover:bg-ink-100'}`}
              >
                New (default)
              </button>
              <button
                type="button"
                onClick={() => setRegime('old')}
                className={`px-5 py-2.5 text-sm font-extrabold border-l-[2.5px] border-ink-900 transition-colors ${regime === 'old' ? 'bg-ink-900 text-white' : 'bg-white text-ink-900 hover:bg-ink-100'}`}
              >
                Old
              </button>
            </div>
            <div className="text-xs font-bold text-ink-700 mt-1.5">
              {regime === 'new'
                ? 'New regime: Rs 75,000 standard deduction is applied automatically. No other deductions.'
                : 'Old regime: Rs 50,000 standard deduction is applied. Add your 80C / HRA / NPS deductions below.'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            <div className="md:col-span-2">
              <label htmlFor="adv-income" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Estimated annual income</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">₹</span>
                <input
                  id="adv-income" type="number" min={0} step={10000} value={income}
                  onChange={(e) => setIncome(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full pl-7 pr-3 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-yellow-accent transition-all"
                  inputMode="numeric"
                />
              </div>
              <div className="text-xs font-bold text-ink-700 mt-1.5">{fmtShort(Math.max(0, Number(income) || 0))} per year (estimated)</div>
              <input type="range" min={300000} max={20000000} step={50000} value={Math.min(20000000, Math.max(300000, Number(income) || 0))} onChange={(e) => setIncome(Number(e.target.value))} className="w-full mt-2 accent-yellow-accent" aria-label="Estimated income slider" />
            </div>

            <div>
              <label htmlFor="adv-ded" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">
                Deductions {regime === 'new' ? '(old regime only)' : '(80C, HRA, NPS...)'}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">₹</span>
                <input
                  id="adv-ded" type="number" min={0} step={10000} value={deductions}
                  disabled={regime === 'new'}
                  onChange={(e) => setDeductions(Math.max(0, Number(e.target.value) || 0))}
                  className={`w-full pl-7 pr-3 py-3 border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-cyan-accent transition-all ${regime === 'new' ? 'bg-ink-100 text-ink-400 cursor-not-allowed' : 'bg-white'}`}
                  inputMode="numeric"
                />
              </div>
              <div className="text-xs font-bold text-ink-500 mt-1.5">
                {regime === 'new' ? 'Not allowed under the new regime.' : 'Total Chapter VI-A + HRA exemptions.'}
              </div>
            </div>

            <div>
              <label htmlFor="adv-tds" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">TDS already deducted / expected</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">₹</span>
                <input
                  id="adv-tds" type="number" min={0} step={5000} value={tds}
                  onChange={(e) => setTds(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full pl-7 pr-3 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-cyan-accent transition-all"
                  inputMode="numeric"
                />
              </div>
              <div className="text-xs font-bold text-ink-500 mt-1.5">Tax already withheld by employer / payers.</div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="p-5 sm:p-7 bg-white border-t-[2.5px] border-ink-900">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
              <div className="text-xs font-extrabold uppercase tracking-wider text-ink-900 mb-1">Estimated total tax (incl. 4% cess)</div>
              <div className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight', letterSpacing: '-0.04em' }}>
                {fmtINR(result.totalTax)}
              </div>
              <div className="text-xs text-ink-800 mt-2 font-semibold">Taxable income: {fmtShort(result.taxable)}</div>
              <div className="text-xs text-ink-800 font-semibold">{regime === 'new' ? 'New regime' : 'Old regime'} slabs, FY 2025-26</div>
            </div>

            <div className={`${result.required ? 'bg-lime-accent' : 'bg-white'} border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm`}>
              <div className="text-xs font-extrabold uppercase tracking-wider text-ink-900 mb-1">Advance tax payable (after TDS)</div>
              <div className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight', letterSpacing: '-0.04em' }}>
                {fmtINR(result.advanceTax)}
              </div>
              <div className="text-xs text-ink-800 mt-2 font-semibold">Total tax {fmtINR(result.totalTax)} minus TDS {fmtINR(Math.max(0, Number(tds) || 0))}</div>
            </div>
          </div>

          {/* Threshold banner */}
          <div className={`mt-5 border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm ${result.required ? 'bg-cyan-accent' : 'bg-ink-100'}`}>
            <div className="text-xs font-extrabold uppercase tracking-wider text-ink-900 mb-1">₹10,000 threshold</div>
            {result.required ? (
              <p className="text-ink-900 font-bold !m-0 leading-relaxed">
                Advance tax is <strong>required</strong>. Your net liability of {fmtINR(result.advanceTax)} is at or above the ₹10,000 threshold, so pay it in the 4 installments below to avoid interest under Sections 234B and 234C.
              </p>
            ) : (
              <p className="text-ink-900 font-bold !m-0 leading-relaxed">
                Advance tax is <strong>not required</strong>. Your net liability of {fmtINR(result.advanceTax)} is below the ₹10,000 threshold. Any balance can be paid as self-assessment tax at filing.
              </p>
            )}
          </div>

          {/* Installment schedule */}
          {result.required && (
            <div className="mt-5">
              <div className="text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-3">Installment schedule (non-presumptive)</div>
              <div className="overflow-x-auto rounded-2xl border-[2.5px] border-ink-900 shadow-sticker-sm">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-ink-900 text-white">
                      <th className="text-left px-4 py-3 font-extrabold">Due date</th>
                      <th className="text-right px-4 py-3 font-extrabold">Cumulative %</th>
                      <th className="text-right px-4 py-3 font-extrabold">Cumulative due</th>
                      <th className="text-right px-4 py-3 font-extrabold">This installment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.rows.map((r, i) => (
                      <tr key={r.date} className={i % 2 === 0 ? 'bg-white' : 'bg-ink-50'}>
                        <td className="px-4 py-3 font-bold text-ink-900 border-t-2 border-ink-200">{r.date}</td>
                        <td className="px-4 py-3 text-right font-semibold text-ink-800 border-t-2 border-ink-200">{r.cumPct}%</td>
                        <td className="px-4 py-3 text-right font-semibold text-ink-800 border-t-2 border-ink-200">{fmtINR(r.cumAmount)}</td>
                        <td className="px-4 py-3 text-right font-extrabold text-ink-900 border-t-2 border-ink-200">{fmtINR(r.incAmount)} <span className="text-ink-500 font-semibold">({r.incPct}%)</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-xs text-ink-600 mt-2 font-semibold">
                Presumptive taxpayers under Sections 44AD / 44ADA pay 100% ({fmtINR(result.advanceTax)}) in a single installment by 15 Mar 2026.
              </div>
            </div>
          )}

          {/* Interest note */}
          <div className="mt-5 bg-pink-accent/10 border-2 border-ink-200 rounded-2xl p-4">
            <p className="text-xs text-ink-700 font-semibold !m-0 leading-relaxed">
              <strong>Interest:</strong> Section 234B charges 1% per month if you pay less than 90% of your tax as advance tax. Section 234C charges 1% per month when any installment falls short of its cumulative target (15% / 45% / 75% / 100%). This tool does not compute that interest.
            </p>
          </div>
        </div>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · FY 2025-26 (AY 2026-27) slabs · Includes 4% cess · Verify current slabs and due dates on incometax.gov.in · Not legal/tax advice. Consult a CA for filings.</div>
    </div>
  );
}
