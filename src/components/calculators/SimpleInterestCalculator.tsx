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

type Unit = 'years' | 'months' | 'days';

interface SimpleInterestCalculatorProps {
  currency?: string;
  locked?: boolean;
}

export default function SimpleInterestCalculator({ currency: currencyProp, locked: lockedProp }: SimpleInterestCalculatorProps = {}) {
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
    setPrincipal((v) => rescaleAmount(v, DEFAULT_CURRENCY, next));
  }, [isLocked]);
  const handleCurrencyChange = (next: CurrencyOption) => {
    setPrincipal((v) => rescaleAmount(v, currency, next));
    setCurrency(next);
    setStoredCurrency(next.code);
  };
  const fmt = (v: number) => formatMoney(v, currency);

  const [copied, setCopied] = useState(false);
  const [principal, setPrincipal] = useState<number>(10000);
  const [rate, setRate] = useState<number>(8);
  const [time, setTime] = useState<number>(5);
  const [unit, setUnit] = useState<Unit>('years');

  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      if (p.get('p')) setPrincipal(Number(p.get('p')));
      if (p.get('r')) setRate(Number(p.get('r')));
      if (p.get('t')) setTime(Number(p.get('t')));
      const u = p.get('u');
      if (u === 'years' || u === 'months' || u === 'days') setUnit(u);
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShare = useCallback(() => {
    try {
      const params = new URLSearchParams({ p: String(principal), r: String(rate), t: String(time), u: unit });
      const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
      navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); });
    } catch {}
  }, [principal, rate, time, unit]);

  const calc = useMemo(() => {
    const tYears = unit === 'years' ? time : unit === 'months' ? time / 12 : time / 365;
    const simpleInterest = principal * (rate / 100) * tYears;
    const total = principal + simpleInterest;
    // Same inputs, compounded annually — for the comparison card.
    const compoundTotal = principal * Math.pow(1 + rate / 100, tYears);
    const compoundInterest = compoundTotal - principal;
    const compoundExtra = compoundInterest - simpleInterest;
    return { tYears, simpleInterest, total, compoundInterest, compoundExtra };
  }, [principal, rate, time, unit]);

  // Year-by-year linear growth for the chart (simple interest accrues linearly).
  const yearlyData = useMemo(() => {
    const data: Array<{ year: number; principal: number; interest: number; balance: number }> = [];
    const wholeYears = Math.max(1, Math.ceil(calc.tYears));
    for (let y = 1; y <= wholeYears; y++) {
      const t = Math.min(y, calc.tYears);
      const interest = principal * (rate / 100) * t;
      data.push({ year: y, principal, interest, balance: principal + interest });
    }
    return data;
  }, [principal, rate, calc.tYears]);

  const maxBalance = Math.max(...yearlyData.map((d) => d.balance), 1);
  const unitLabel = unit === 'years' ? 'year' : unit === 'months' ? 'month' : 'day';

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        <div className="bg-cyan-accent border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-2xl flex-shrink-0">🧾</span>
            <h2 className="!text-lg sm:!text-xl !my-0 !text-ink-900 font-extrabold truncate" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>Simple Interest</h2>
          </div>
          <CurrencySelect value={currency} onChange={handleCurrencyChange} locked={isLocked} />
        </div>

        {/* Inputs */}
        <div className="p-5 sm:p-7 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 bg-ink-50">
          <div>
            <label htmlFor="si-principal" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Principal Amount</label>
            <div className="relative">
              <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none ${currency.symbol.length > 1 ? 'text-xs' : ''}`}>{currency.symbol}</span>
              <input id="si-principal" type="number" min={0} step={100} value={principal} onChange={(e) => setPrincipal(Number(e.target.value) || 0)}
                className={`w-full ${currency.symbol.length > 1 ? 'pl-12' : 'pl-7'} pr-3 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-cyan-accent transition-all`}
                inputMode="numeric" />
            </div>
            <input type="range" min={0} max={500000} step={500} value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} className="w-full mt-2 accent-cyan-accent" aria-label="Principal slider" />
          </div>
          <div>
            <label htmlFor="si-rate" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Annual Interest Rate</label>
            <div className="relative">
              <input id="si-rate" type="number" min={0} max={100} step={0.1} value={rate} onChange={(e) => setRate(Number(e.target.value) || 0)}
                className="w-full pl-3.5 pr-8 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-pink-accent transition-all"
                inputMode="decimal" />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">%</span>
            </div>
            <input type="range" min={0} max={30} step={0.1} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full mt-2 accent-pink-accent" aria-label="Rate slider" />
          </div>
          <div>
            <label htmlFor="si-time" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Time Period</label>
            <input id="si-time" type="number" min={0} step={1} value={time} onChange={(e) => setTime(Number(e.target.value) || 0)}
              className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-yellow-accent transition-all"
              inputMode="numeric" />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[1, 2, 5, 10].map((t) => (
                <button key={t} type="button" onClick={() => setTime(t)} className={`px-2.5 py-1 rounded-full text-xs font-bold border-2 border-ink-900 transition-all ${time === t ? 'bg-yellow-accent text-ink-900 shadow-sticker-sm' : 'bg-white text-ink-700 hover:bg-yellow-accent/40'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Time Unit</label>
            <div className="grid grid-cols-3 gap-2">
              {(['years', 'months', 'days'] as Unit[]).map((u) => (
                <button key={u} type="button" onClick={() => setUnit(u)}
                  className={`py-2.5 px-2 rounded-xl border-2 border-ink-900 text-xs font-extrabold capitalize transition-all ${unit === u ? 'bg-ink-900 text-white shadow-sticker-sm -translate-y-0.5' : 'bg-white text-ink-700 hover:bg-cyan-accent'}`}>
                  {u}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="p-5 sm:p-7 bg-white grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 border-t-[2.5px] border-ink-900">
          <div className="bg-cyan-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Simple Interest</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmt(calc.simpleInterest)}</div>
            <div className="text-xs text-ink-800 mt-2 font-semibold">over {time} {unitLabel}{time === 1 ? '' : 's'}</div>
          </div>
          <div className="bg-lime-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Total Amount</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmt(calc.total)}</div>
            <div className="text-xs text-ink-800 mt-2 font-semibold">principal + interest</div>
          </div>
          <div className="bg-pink-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-white mb-1">Principal</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmt(principal)}</div>
            <div className="text-xs text-white/90 mt-2 font-semibold">your original amount</div>
          </div>
        </div>

        {/* Simple vs Compound comparison */}
        <div className="px-5 sm:px-7 pb-5 sm:pb-7 bg-white">
          <div className="bg-ink-900 text-white border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-accent mb-1">Simple vs Compound</div>
              <p className="!m-0 text-sm text-ink-200 font-medium">
                Compounded annually, the same {fmt(principal)} at {rate}% would earn <strong className="text-white">{fmt(calc.compoundInterest)}</strong>.
                That's <strong className="text-lime-accent">{fmt(Math.max(0, calc.compoundExtra))} more</strong> than simple interest.
              </p>
            </div>
            <a href="/finance/compound-interest-calculator/" className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-white text-xs font-extrabold text-ink-900 bg-white hover:bg-lime-accent no-underline transition-all whitespace-nowrap">
              Compound Interest →
            </a>
          </div>
        </div>

        {/* Year-by-year chart (linear) */}
        {yearlyData.length > 1 && (
          <div className="px-5 sm:px-7 pb-5 sm:pb-7 bg-white">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mb-3">Year-by-year balance</div>
            <div className="bg-ink-50 border-2 border-ink-900 rounded-2xl p-4 overflow-x-auto">
              <div className="flex items-end gap-1 h-48 min-w-fit">
                {yearlyData.map((d) => {
                  const totalHeight = (d.balance / maxBalance) * 100;
                  const principalHeight = (d.principal / d.balance) * 100;
                  return (
                    <div key={d.year} className="relative flex-1 min-w-[12px] group" title={`Year ${d.year}: ${fmt(d.balance)}`}>
                      <div className="relative w-full bg-cyan-accent border-r border-ink-900 transition-all hover:opacity-80" style={{ height: `${totalHeight}%` }}>
                        <div className="absolute bottom-0 inset-x-0 bg-pink-accent" style={{ height: `${principalHeight}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between mt-3 text-[10px] font-bold text-ink-600">
                <span>Year 1</span>
                <span>Year {yearlyData.length}</span>
              </div>
              <div className="flex items-center gap-4 mt-3 text-[11px] font-bold">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-pink-accent border border-ink-900 rounded-sm"></span>
                  <span className="text-ink-700">Principal</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-cyan-accent border border-ink-900 rounded-sm"></span>
                  <span className="text-ink-700">Interest earned</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Share */}
      <div className="px-5 sm:px-7 pb-5 bg-white border-t-2 border-ink-100 pt-4">
        <button type="button" onClick={handleShare}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-ink-900 text-xs font-extrabold transition-all ${copied ? 'bg-lime-accent text-ink-900' : 'bg-white text-ink-700 hover:bg-cyan-accent'}`}>
          {copied ? '✓ Copied!' : '↗ Share this calculation'}
        </button>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · Simple interest = Principal × Rate × Time. No compounding.</div>
    </div>
  );
}
