import { useState, useMemo, useEffect, useCallback } from 'react';

/**
 * India Salary / Take-Home Calculator (FY 2025-26).
 * CTC → in-hand: employer/employee EPF (12% of basic), professional tax,
 * and income tax under BOTH regimes (slab math mirrors IncomeTaxIndiaCalculator).
 */

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
    if (taxableIncome > from) tax += (Math.min(taxableIncome, to) - from) * rate;
  }
  if (taxableIncome <= 1200000) tax = 0; // 87A rebate
  let surcharge = 0;
  if (taxableIncome > 50000000) surcharge = tax * 0.37;
  else if (taxableIncome > 20000000) surcharge = tax * 0.25;
  else if (taxableIncome > 10000000) surcharge = tax * 0.15;
  else if (taxableIncome > 5000000) surcharge = tax * 0.10;
  const cess = (tax + surcharge) * 0.04;
  return Math.round(tax + surcharge + cess);
}

function computeOldRegime(taxableIncome: number): number {
  let tax = 0;
  const slabs: Array<[number, number, number]> = [
    [0, 250000, 0],
    [250000, 500000, 0.05],
    [500000, 1000000, 0.20],
    [1000000, Infinity, 0.30],
  ];
  for (const [from, to, rate] of slabs) {
    if (taxableIncome > from) tax += (Math.min(taxableIncome, to) - from) * rate;
  }
  if (taxableIncome <= 500000) tax = 0; // 87A rebate
  let surcharge = 0;
  if (taxableIncome > 50000000) surcharge = tax * 0.37;
  else if (taxableIncome > 20000000) surcharge = tax * 0.25;
  else if (taxableIncome > 10000000) surcharge = tax * 0.15;
  else if (taxableIncome > 5000000) surcharge = tax * 0.10;
  const cess = (tax + surcharge) * 0.04;
  return Math.round(tax + surcharge + cess);
}

const fmtINR = (v: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);
function fmtINRShort(value: number): string {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
  return `₹${Math.round(value).toLocaleString('en-IN')}`;
}

export default function SalaryCalculator() {
  const [copied, setCopied] = useState(false);
  const [ctc, setCtc] = useState<number>(1200000);
  const [basicPct, setBasicPct] = useState<number>(40);
  const [monthlyPT, setMonthlyPT] = useState<number>(200);
  const [deductions80C, setDeductions80C] = useState<number>(150000);
  const [otherDeductions, setOtherDeductions] = useState<number>(0);

  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      if (p.get('ctc')) setCtc(Number(p.get('ctc')));
      if (p.get('b')) setBasicPct(Number(p.get('b')));
      if (p.get('pt')) setMonthlyPT(Number(p.get('pt')));
      if (p.get('d80c')) setDeductions80C(Number(p.get('d80c')));
      if (p.get('od')) setOtherDeductions(Number(p.get('od')));
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShare = useCallback(() => {
    try {
      const params = new URLSearchParams({ ctc: String(ctc), b: String(basicPct), pt: String(monthlyPT), d80c: String(deductions80C), od: String(otherDeductions) });
      const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
      navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); });
    } catch {}
  }, [ctc, basicPct, monthlyPT, deductions80C, otherDeductions]);

  const calc = useMemo(() => {
    const basic = ctc * (basicPct / 100);
    const employerEPF = Math.min(basic, 1800000) * 0.12; // employer PF is inside CTC
    const gross = Math.max(0, ctc - employerEPF);        // gross salary (taxable side)
    const employeeEPF = Math.min(basic, 1800000) * 0.12; // deducted from gross
    const yearlyPT = Math.min(monthlyPT * 12, 2500);     // PT capped ₹2,500/yr by law

    // NEW regime: ₹75K standard deduction only
    const newTaxable = Math.max(0, gross - 75000);
    const newTax = computeNewRegime(newTaxable);

    // OLD regime: ₹50K standard + 80C (max 1.5L) + other declared deductions + PT
    const oldTaxable = Math.max(0, gross - 50000 - Math.min(deductions80C, 150000) - otherDeductions - yearlyPT);
    const oldTax = computeOldRegime(oldTaxable);

    const better: 'new' | 'old' = newTax <= oldTax ? 'new' : 'old';
    const tax = Math.min(newTax, oldTax);
    const annualTakeHome = gross - employeeEPF - yearlyPT - tax;
    const monthlyTakeHome = annualTakeHome / 12;

    return { basic, employerEPF, gross, employeeEPF, yearlyPT, newTax, oldTax, better, tax, annualTakeHome, monthlyTakeHome };
  }, [ctc, basicPct, monthlyPT, deductions80C, otherDeductions]);

  const deductionRows = [
    { label: 'Employee EPF (12% of basic)', value: calc.employeeEPF },
    { label: 'Professional tax', value: calc.yearlyPT },
    { label: `Income tax (${calc.better} regime)`, value: calc.tax },
  ];

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        <div className="bg-yellow-accent border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-2xl flex-shrink-0">💼</span>
            <h2 className="!text-lg sm:!text-xl !my-0 !text-ink-900 font-extrabold truncate" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>Salary → Take-Home (India)</h2>
          </div>
          <span className="text-xs font-extrabold text-ink-700 bg-white border-2 border-ink-900 rounded-full px-3 py-1 whitespace-nowrap">FY 2025-26</span>
        </div>

        {/* Inputs */}
        <div className="p-5 sm:p-7 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 bg-ink-50">
          <div>
            <label htmlFor="sal-ctc" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Annual CTC</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">₹</span>
              <input id="sal-ctc" type="number" min={0} step={50000} value={ctc} onChange={(e) => setCtc(Number(e.target.value) || 0)}
                className="w-full pl-7 pr-3 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-yellow-accent transition-all"
                inputMode="numeric" />
            </div>
            <input type="range" min={300000} max={10000000} step={50000} value={ctc} onChange={(e) => setCtc(Number(e.target.value))} className="w-full mt-2 accent-yellow-accent" aria-label="CTC slider" />
            <div className="text-xs font-bold text-ink-600 mt-1">{fmtINRShort(ctc)} / year</div>
          </div>
          <div>
            <label htmlFor="sal-basic" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Basic Salary (% of CTC)</label>
            <div className="relative">
              <input id="sal-basic" type="number" min={20} max={70} step={1} value={basicPct} onChange={(e) => setBasicPct(Number(e.target.value) || 0)}
                className="w-full pl-3.5 pr-8 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-cyan-accent transition-all"
                inputMode="numeric" />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">%</span>
            </div>
            <input type="range" min={20} max={70} step={1} value={basicPct} onChange={(e) => setBasicPct(Number(e.target.value))} className="w-full mt-2 accent-cyan-accent" aria-label="Basic percent slider" />
            <div className="text-xs font-bold text-ink-600 mt-1">Basic = {fmtINRShort(calc.basic)} (most companies use 40–50%)</div>
          </div>
          <div>
            <label htmlFor="sal-80c" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">80C Investments (old regime)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">₹</span>
              <input id="sal-80c" type="number" min={0} max={150000} step={5000} value={deductions80C} onChange={(e) => setDeductions80C(Number(e.target.value) || 0)}
                className="w-full pl-7 pr-3 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-lime-accent transition-all"
                inputMode="numeric" />
            </div>
            <div className="text-xs font-bold text-ink-600 mt-1">EPF + ELSS + PPF + LIC etc., capped ₹1.5L</div>
          </div>
          <div>
            <label htmlFor="sal-other" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Other Deductions (old regime)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">₹</span>
              <input id="sal-other" type="number" min={0} step={5000} value={otherDeductions} onChange={(e) => setOtherDeductions(Number(e.target.value) || 0)}
                className="w-full pl-7 pr-3 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-pink-accent transition-all"
                inputMode="numeric" />
            </div>
            <div className="text-xs font-bold text-ink-600 mt-1">HRA exemption, 80D, home-loan interest, NPS…</div>
          </div>
          <div className="md:col-span-2">
            <label htmlFor="sal-pt" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Professional Tax (per month)</label>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-40">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">₹</span>
                <input id="sal-pt" type="number" min={0} max={300} step={10} value={monthlyPT} onChange={(e) => setMonthlyPT(Number(e.target.value) || 0)}
                  className="w-full pl-7 pr-3 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-yellow-accent transition-all"
                  inputMode="numeric" />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[0, 200, 208].map((v) => (
                  <button key={v} type="button" onClick={() => setMonthlyPT(v)} className={`px-2.5 py-1 rounded-full text-xs font-bold border-2 border-ink-900 transition-all ${monthlyPT === v ? 'bg-yellow-accent text-ink-900 shadow-sticker-sm' : 'bg-white text-ink-700 hover:bg-yellow-accent/40'}`}>
                    {v === 0 ? '₹0 (Delhi/UP)' : v === 200 ? '₹200 (KA/MH…)' : '₹208 (WB)'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="p-5 sm:p-7 bg-white grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 border-t-[2.5px] border-ink-900">
          <div className="bg-lime-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm sm:col-span-2">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Monthly Take-Home</div>
            <div className="text-3xl sm:text-5xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmtINR(calc.monthlyTakeHome)}</div>
            <div className="text-xs text-ink-800 mt-2 font-semibold">in-hand each month · {fmtINRShort(calc.annualTakeHome)}/year</div>
          </div>
          <div className="bg-cyan-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Best Regime</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-none capitalize" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{calc.better}</div>
            <div className="text-xs text-ink-800 mt-2 font-semibold">saves {fmtINRShort(Math.abs(calc.newTax - calc.oldTax))}/yr vs {calc.better === 'new' ? 'old' : 'new'}</div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="px-5 sm:px-7 pb-5 sm:pb-7 bg-white">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mb-3">Where your CTC goes (annual)</div>
          <div className="bg-white border-2 border-ink-900 rounded-2xl divide-y-2 divide-ink-100 shadow-sticker-sm overflow-hidden">
            <div className="flex items-center justify-between gap-4 p-4">
              <div className="text-sm font-semibold text-ink-700">Annual CTC</div>
              <code className="font-mono font-bold text-ink-900">{fmtINR(ctc)}</code>
            </div>
            <div className="flex items-center justify-between gap-4 p-4">
              <div className="text-sm font-semibold text-ink-700">− Employer EPF (inside CTC)</div>
              <code className="font-mono font-bold text-ink-900">{fmtINR(calc.employerEPF)}</code>
            </div>
            <div className="flex items-center justify-between gap-4 p-4 bg-ink-50">
              <div className="text-sm font-semibold text-ink-700">= Gross salary</div>
              <code className="font-mono font-bold text-ink-900">{fmtINR(calc.gross)}</code>
            </div>
            {deductionRows.map((r) => (
              <div key={r.label} className="flex items-center justify-between gap-4 p-4">
                <div className="text-sm font-semibold text-ink-700">− {r.label}</div>
                <code className="font-mono font-bold text-ink-900">{fmtINR(r.value)}</code>
              </div>
            ))}
            <div className="flex items-center justify-between gap-4 p-4 bg-lime-accent/30">
              <div className="text-sm font-semibold text-ink-700">= Annual take-home</div>
              <code className="font-mono font-extrabold text-ink-900 text-base">{fmtINR(calc.annualTakeHome)}</code>
            </div>
          </div>
          <div className="mt-4 bg-ink-900 text-white border-[2.5px] border-ink-900 rounded-2xl p-4 shadow-sticker-sm text-sm font-medium flex flex-wrap gap-x-6 gap-y-1">
            <span>New regime tax: <strong className="text-lime-accent">{fmtINR(calc.newTax)}</strong></span>
            <span>Old regime tax: <strong className="text-cyan-accent">{fmtINR(calc.oldTax)}</strong></span>
            <a href="/finance/income-tax-india/" className="text-yellow-accent underline decoration-2 underline-offset-2 font-bold">Full regime comparison →</a>
          </div>
        </div>
      </div>
      {/* Share */}
      <div className="px-5 sm:px-7 pb-5 bg-white border-t-2 border-ink-100 pt-4">
        <button type="button" onClick={handleShare}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-ink-900 text-xs font-extrabold transition-all ${copied ? 'bg-lime-accent text-ink-900' : 'bg-white text-ink-700 hover:bg-yellow-accent'}`}>
          {copied ? '✓ Copied!' : '↗ Share this calculation'}
        </button>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · Estimates for salaried employees; gratuity, variable pay & flexi components vary by employer.</div>
    </div>
  );
}
