import { useState, useMemo, useEffect, useCallback } from 'react';
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

interface CarLoanCalculatorProps {
  currency?: string;
  locked?: boolean;
}

export default function CarLoanCalculator({ currency: currencyProp, locked: lockedProp }: CarLoanCalculatorProps = {}) {
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
    setPrice((v) => rescaleAmount(v, DEFAULT_CURRENCY, next));
  }, [isLocked]);
  const handleCurrencyChange = (next: CurrencyOption) => {
    setPrice((v) => rescaleAmount(v, currency, next));
    setCurrency(next);
    setStoredCurrency(next.code);
  };
  const fmt = (v: number) => formatMoney(v, currency);

  const [copied, setCopied] = useState(false);
  const [price, setPrice] = useState<number>(25000);
  const [downPct, setDownPct] = useState<number>(20);
  const [rate, setRate] = useState<number>(9);
  const [years, setYears] = useState<number>(5);

  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      if (p.get('v')) setPrice(Number(p.get('v')));
      if (p.get('d')) setDownPct(Number(p.get('d')));
      if (p.get('r')) setRate(Number(p.get('r')));
      if (p.get('y')) setYears(Number(p.get('y')));
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShare = useCallback(() => {
    try {
      const params = new URLSearchParams({ v: String(price), d: String(downPct), r: String(rate), y: String(years) });
      const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
      navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); });
    } catch {}
  }, [price, downPct, rate, years]);

  const calc = useMemo(() => {
    const downPayment = price * (downPct / 100);
    const loanAmount = Math.max(0, price - downPayment);
    const m = rate / 100 / 12;
    const n = Math.max(1, Math.round(years * 12));
    const emi = m === 0 ? loanAmount / n : (loanAmount * m * Math.pow(1 + m, n)) / (Math.pow(1 + m, n) - 1);
    const totalPaid = emi * n;
    const totalInterest = totalPaid - loanAmount;
    const totalCost = downPayment + totalPaid;
    return { downPayment, loanAmount, emi, totalPaid, totalInterest, totalCost, months: n };
  }, [price, downPct, rate, years]);

  // Amortization by year for the chart: remaining balance at each year end.
  const yearlyBalance = useMemo(() => {
    const m = rate / 100 / 12;
    const data: Array<{ year: number; balance: number }> = [];
    let bal = calc.loanAmount;
    for (let month = 1; month <= calc.months; month++) {
      const interest = bal * m;
      bal = Math.max(0, bal + interest - calc.emi);
      if (month % 12 === 0 || month === calc.months) {
        data.push({ year: Math.ceil(month / 12), balance: bal });
      }
    }
    return data;
  }, [calc, rate]);

  const maxBar = Math.max(calc.loanAmount, 1);

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        <div className="bg-pink-accent border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-2xl flex-shrink-0">🚗</span>
            <h2 className="!text-lg sm:!text-xl !my-0 !text-white font-extrabold truncate" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>Car Loan EMI</h2>
          </div>
          <CurrencySelect value={currency} onChange={handleCurrencyChange} locked={isLocked} />
        </div>

        {/* Inputs */}
        <div className="p-5 sm:p-7 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 bg-ink-50">
          <div>
            <label htmlFor="cl-price" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Vehicle Price (on-road)</label>
            <div className="relative">
              <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none ${currency.symbol.length > 1 ? 'text-xs' : ''}`}>{currency.symbol}</span>
              <input id="cl-price" type="number" min={0} step={500} value={price} onChange={(e) => setPrice(Number(e.target.value) || 0)}
                className={`w-full ${currency.symbol.length > 1 ? 'pl-12' : 'pl-7'} pr-3 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-pink-accent transition-all`}
                inputMode="numeric" />
            </div>
            <input type="range" min={0} max={200000} step={1000} value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full mt-2 accent-pink-accent" aria-label="Price slider" />
          </div>
          <div>
            <label htmlFor="cl-down" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Down Payment</label>
            <div className="relative">
              <input id="cl-down" type="number" min={0} max={90} step={1} value={downPct} onChange={(e) => setDownPct(Number(e.target.value) || 0)}
                className="w-full pl-3.5 pr-8 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-cyan-accent transition-all"
                inputMode="numeric" />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">%</span>
            </div>
            <input type="range" min={0} max={60} step={1} value={downPct} onChange={(e) => setDownPct(Number(e.target.value))} className="w-full mt-2 accent-cyan-accent" aria-label="Down payment slider" />
            <div className="text-xs font-bold text-ink-600 mt-1">{fmt(calc.downPayment)} upfront → loan of {fmt(calc.loanAmount)}</div>
          </div>
          <div>
            <label htmlFor="cl-rate" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Interest Rate (p.a.)</label>
            <div className="relative">
              <input id="cl-rate" type="number" min={0} max={30} step={0.1} value={rate} onChange={(e) => setRate(Number(e.target.value) || 0)}
                className="w-full pl-3.5 pr-8 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-lime-accent transition-all"
                inputMode="decimal" />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">%</span>
            </div>
            <input type="range" min={3} max={20} step={0.1} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full mt-2 accent-lime-accent" aria-label="Rate slider" />
          </div>
          <div>
            <label htmlFor="cl-years" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Loan Tenure</label>
            <input id="cl-years" type="number" min={1} max={8} step={1} value={years} onChange={(e) => setYears(Number(e.target.value) || 1)}
              className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-yellow-accent transition-all"
              inputMode="numeric" />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[3, 5, 7].map((y) => (
                <button key={y} type="button" onClick={() => setYears(y)} className={`px-2.5 py-1 rounded-full text-xs font-bold border-2 border-ink-900 transition-all ${years === y ? 'bg-yellow-accent text-ink-900 shadow-sticker-sm' : 'bg-white text-ink-700 hover:bg-yellow-accent/40'}`}>
                  {y}y
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="p-5 sm:p-7 bg-white grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 border-t-[2.5px] border-ink-900">
          <div className="bg-pink-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-white mb-1">Monthly EMI</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmt(calc.emi)}</div>
            <div className="text-xs text-white/90 mt-2 font-semibold">for {calc.months} months</div>
          </div>
          <div className="bg-cyan-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Total Interest</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmt(calc.totalInterest)}</div>
            <div className="text-xs text-ink-800 mt-2 font-semibold">cost of borrowing</div>
          </div>
          <div className="bg-lime-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Total Cost of Car</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmt(calc.totalCost)}</div>
            <div className="text-xs text-ink-800 mt-2 font-semibold">down payment + all EMIs</div>
          </div>
        </div>

        {/* Balance rundown chart */}
        {yearlyBalance.length > 1 && (
          <div className="px-5 sm:px-7 pb-5 sm:pb-7 bg-white">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mb-3">Loan balance by year end</div>
            <div className="bg-ink-50 border-2 border-ink-900 rounded-2xl p-4 overflow-x-auto">
              <div className="flex items-end gap-2 h-40 min-w-fit">
                {yearlyBalance.map((d) => (
                  <div key={d.year} className="relative flex-1 min-w-[24px] flex flex-col items-center justify-end h-full" title={`Year ${d.year}: ${fmt(d.balance)}`}>
                    <div className="w-full bg-pink-accent border-2 border-ink-900 rounded-t-lg transition-all hover:opacity-80" style={{ height: `${Math.max(2, (d.balance / maxBar) * 100)}%` }} />
                    <div className="text-[10px] font-bold text-ink-600 mt-1">Y{d.year}</div>
                  </div>
                ))}
              </div>
              <div className="text-[11px] font-bold text-ink-600 mt-2">Outstanding principal remaining after each year of EMIs.</div>
            </div>
          </div>
        )}
      </div>
      {/* Share */}
      <div className="px-5 sm:px-7 pb-5 bg-white border-t-2 border-ink-100 pt-4">
        <button type="button" onClick={handleShare}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-ink-900 text-xs font-extrabold transition-all ${copied ? 'bg-lime-accent text-ink-900' : 'bg-white text-ink-700 hover:bg-pink-accent hover:text-white'}`}>
          {copied ? '✓ Copied!' : '↗ Share this calculation'}
        </button>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · Reducing-balance EMI. Insurance, registration & processing fees not included.</div>
    </div>
  );
}
