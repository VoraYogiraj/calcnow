import { useState, useMemo } from 'react';

function formatINR(value: number): string {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatINRFull(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

function calculateEMI(principal: number, annualRatePct: number, months: number) {
  const monthlyRate = annualRatePct / 100 / 12;
  if (months === 0) return { emi: 0, totalInterest: 0, totalPaid: 0 };
  if (monthlyRate === 0) {
    return { emi: principal / months, totalInterest: 0, totalPaid: principal };
  }
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  return { emi, totalInterest: emi * months - principal, totalPaid: emi * months };
}

export default function EmiCalculator() {
  const [principal, setPrincipal] = useState<number>(2500000); // 25L
  const [rate, setRate] = useState<number>(8.5);
  const [years, setYears] = useState<number>(20);

  const result = useMemo(() => calculateEMI(principal, rate, years * 12), [principal, rate, years]);
  const interestPct = result.totalPaid > 0 ? Math.round((result.totalInterest / result.totalPaid) * 100) : 0;
  const principalPct = 100 - interestPct;

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        <div className="bg-yellow-accent border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🇮🇳</span>
            <h2 className="!text-lg sm:!text-xl !my-0 !text-ink-900 font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>EMI Calculator</h2>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink-900">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ink-900 opacity-50"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-ink-900"></span>
            </span>
            Live
          </span>
        </div>

        <div className="p-5 sm:p-7 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 bg-ink-50">
          <div>
            <label htmlFor="emi-principal" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Loan Amount</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">₹</span>
              <input
                id="emi-principal" type="number" min={10000} step={10000} value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value) || 0)}
                className="w-full pl-7 pr-3 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-yellow-accent transition-all"
                inputMode="numeric"
              />
            </div>
            <div className="text-xs font-bold text-ink-700 mt-1.5">{formatINR(principal)}</div>
            <input type="range" min={100000} max={50000000} step={50000} value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} className="w-full mt-1 accent-yellow-accent" aria-label="Principal slider" />
          </div>
          <div>
            <label htmlFor="emi-rate" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Interest Rate (p.a.)</label>
            <div className="relative">
              <input
                id="emi-rate" type="number" min={0} max={30} step={0.05} value={rate}
                onChange={(e) => setRate(Number(e.target.value) || 0)}
                className="w-full pl-3.5 pr-8 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-pink-accent transition-all"
                inputMode="decimal"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">%</span>
            </div>
            <input type="range" min={5} max={20} step={0.05} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full mt-2 accent-pink-accent" aria-label="Rate slider" />
          </div>
          <div>
            <label htmlFor="emi-years" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Tenure (years)</label>
            <select
              id="emi-years" value={years} onChange={(e) => setYears(Number(e.target.value))}
              className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-cyan-accent transition-all cursor-pointer"
            >
              {[1, 2, 3, 5, 7, 10, 12, 15, 20, 25, 30].map((y) => (
                <option key={y} value={y}>{y} years</option>
              ))}
            </select>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[10, 20, 30].map((y) => (
                <button key={y} type="button" onClick={() => setYears(y)} className={`px-2.5 py-1 rounded-full text-xs font-bold border-2 border-ink-900 transition-all ${years === y ? 'bg-cyan-accent text-ink-900 shadow-sticker-sm' : 'bg-white text-ink-700 hover:bg-cyan-accent/40'}`}>
                  {y}y
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-7 bg-white grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 border-t-[2.5px] border-ink-900">
          <div className="bg-yellow-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Monthly EMI</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{formatINRFull(result.emi)}</div>
            <div className="text-xs text-ink-800 mt-2 font-semibold">/month</div>
          </div>
          <div className="bg-pink-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-white mb-1">Total Interest</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{formatINR(result.totalInterest)}</div>
            <div className="text-xs text-white/90 mt-2 font-semibold">{interestPct}% of total</div>
          </div>
          <div className="bg-cyan-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Total Payable</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{formatINR(result.totalPaid)}</div>
            <div className="text-xs text-ink-800 mt-2 font-semibold">over {years} years</div>
          </div>
        </div>

        <div className="px-5 sm:px-7 pb-5 sm:pb-7 bg-white">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mb-2">Principal vs Interest Split</div>
          <div className="relative h-10 rounded-full border-[2.5px] border-ink-900 overflow-hidden bg-white">
            <div className="absolute inset-y-0 left-0 bg-yellow-accent flex items-center justify-center transition-all duration-300" style={{ width: `${principalPct}%` }}>
              {principalPct >= 15 && <span className="text-[11px] sm:text-xs font-extrabold text-ink-900 whitespace-nowrap px-2">{principalPct}% principal</span>}
            </div>
            <div className="absolute inset-y-0 right-0 bg-pink-accent flex items-center justify-center transition-all duration-300" style={{ width: `${interestPct}%` }}>
              {interestPct >= 15 && <span className="text-[11px] sm:text-xs font-extrabold text-white whitespace-nowrap px-2">{interestPct}% interest</span>}
            </div>
          </div>
        </div>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · For home, personal, auto, education loans · Excludes processing fees</div>
    </div>
  );
}
