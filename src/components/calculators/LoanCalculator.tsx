import { useState, useMemo, useEffect } from 'react';
import {
  DEFAULT_CURRENCY,
  detectClientCurrency,
  rescaleAmount,
  formatMoney,
  getCurrency,
  setStoredCurrency,
  type CurrencyOption,
} from '../../lib/currency';
import CurrencySelect from '../ui/CurrencySelect';

interface LoanCalculatorProps {
  currency?: string;
  locked?: boolean;
}

function calculateLoan(principal: number, annualRatePct: number, months: number) {
  const monthlyRate = annualRatePct / 100 / 12;
  if (months === 0) return { monthlyPayment: 0, totalInterest: 0, totalPaid: 0 };
  if (monthlyRate === 0) {
    return {
      monthlyPayment: principal / months,
      totalInterest: 0,
      totalPaid: principal,
    };
  }
  const monthlyPayment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);
  return {
    monthlyPayment,
    totalInterest: monthlyPayment * months - principal,
    totalPaid: monthlyPayment * months,
  };
}

export default function LoanCalculator({ currency: currencyProp, locked: lockedProp }: LoanCalculatorProps = {}) {
  const isLocked = lockedProp ?? Boolean(currencyProp);
  const [currency, setCurrency] = useState<CurrencyOption>(
    currencyProp ? getCurrency(currencyProp) : DEFAULT_CURRENCY
  );
  useEffect(() => {
    if (isLocked) return;
    const next = detectClientCurrency();
    setCurrency(next);
    // Example amounts are authored in USD; re-express them at the region's scale so
    // the defaults (and the hero "Quick answer" above) read natively.
    setAmount((v) => rescaleAmount(v, DEFAULT_CURRENCY, next));
  }, [isLocked]);
  const handleCurrencyChange = (next: CurrencyOption) => {
    setAmount((v) => rescaleAmount(v, currency, next));
    setCurrency(next);
    setStoredCurrency(next.code);
  };
  const fmt = (v: number) => formatMoney(v, currency);

  const [amount, setAmount] = useState<number>(20000);
  const [rate, setRate] = useState<number>(9.5);
  const [years, setYears] = useState<number>(5);

  const result = useMemo(() => calculateLoan(amount, rate, years * 12), [amount, rate, years]);
  const interestPct = result.totalPaid > 0 ? Math.round((result.totalInterest / result.totalPaid) * 100) : 0;
  const principalPct = 100 - interestPct;

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        {/* Header */}
        <div className="bg-cyan-accent border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-2xl flex-shrink-0">💵</span>
            <h2 className="!text-lg sm:!text-xl !my-0 !text-ink-900 font-extrabold truncate" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>Loan Calculator</h2>
          </div>
          <CurrencySelect value={currency} onChange={handleCurrencyChange} locked={isLocked} />
        </div>

        {/* Inputs */}
        <div className="p-5 sm:p-7 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 bg-ink-50">
          <div>
            <label htmlFor="loan-amount" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Loan Amount</label>
            <div className="relative">
              <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none ${currency.symbol.length > 1 ? 'text-xs' : ''}`}>{currency.symbol}</span>
              <input
                id="loan-amount" type="number" min={500} step={500} value={amount}
                onChange={(e) => setAmount(Number(e.target.value) || 0)}
                className={`w-full ${currency.symbol.length > 1 ? 'pl-12' : 'pl-7'} pr-3 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-cyan-accent transition-all`}
                inputMode="numeric"
              />
            </div>
            <input type="range" min={1000} max={500000} step={500} value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full mt-2 accent-cyan-accent" aria-label="Amount slider" />
          </div>
          <div>
            <label htmlFor="loan-rate" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Interest Rate</label>
            <div className="relative">
              <input
                id="loan-rate" type="number" min={0} max={50} step={0.1} value={rate}
                onChange={(e) => setRate(Number(e.target.value) || 0)}
                className="w-full pl-3.5 pr-8 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-pink-accent transition-all"
                inputMode="decimal"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">%</span>
            </div>
            <input type="range" min={0.5} max={30} step={0.1} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full mt-2 accent-pink-accent" aria-label="Rate slider" />
          </div>
          <div>
            <label htmlFor="loan-term" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Term (years)</label>
            <select
              id="loan-term" value={years} onChange={(e) => setYears(Number(e.target.value))}
              className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-yellow-accent transition-all cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 7, 10, 15, 20, 25, 30].map((y) => (
                <option key={y} value={y}>{y} year{y > 1 ? 's' : ''}</option>
              ))}
            </select>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[3, 5, 10].map((y) => (
                <button key={y} type="button" onClick={() => setYears(y)} className={`px-2.5 py-1 rounded-full text-xs font-bold border-2 border-ink-900 transition-all ${years === y ? 'bg-yellow-accent text-ink-900 shadow-sticker-sm' : 'bg-white text-ink-700 hover:bg-yellow-accent/40'}`}>
                  {y}y
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="p-5 sm:p-7 bg-white grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 border-t-[2.5px] border-ink-900">
          <div className="bg-cyan-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Monthly Payment</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmt(result.monthlyPayment)}</div>
            <div className="text-xs text-ink-800 mt-2 font-semibold">/month</div>
          </div>
          <div className="bg-pink-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-white mb-1">Total Interest</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmt(result.totalInterest)}</div>
            <div className="text-xs text-white/90 mt-2 font-semibold">{interestPct}% of total</div>
          </div>
          <div className="bg-yellow-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Total Paid</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmt(result.totalPaid)}</div>
            <div className="text-xs text-ink-800 mt-2 font-semibold">over {years} year{years > 1 ? 's' : ''}</div>
          </div>
        </div>

        {/* Principal vs Interest bar */}
        <div className="px-5 sm:px-7 pb-5 sm:pb-7 bg-white">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mb-2">Principal vs Interest Split</div>
          <div className="relative h-10 rounded-full border-[2.5px] border-ink-900 overflow-hidden bg-white">
            <div className="absolute inset-y-0 left-0 bg-cyan-accent flex items-center justify-center transition-all duration-300" style={{ width: `${principalPct}%` }}>
              {principalPct >= 15 && <span className="text-[11px] sm:text-xs font-extrabold text-ink-900 whitespace-nowrap px-2">{principalPct}% principal</span>}
            </div>
            <div className="absolute inset-y-0 right-0 bg-pink-accent flex items-center justify-center transition-all duration-300" style={{ width: `${interestPct}%` }}>
              {interestPct >= 15 && <span className="text-[11px] sm:text-xs font-extrabold text-white whitespace-nowrap px-2">{interestPct}% interest</span>}
            </div>
          </div>
        </div>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live recalculation · Principal + interest only</div>
    </div>
  );
}
