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

type Frequency = 1 | 2 | 4 | 12 | 365;

interface CompoundInterestCalculatorProps {
  currency?: string;
  locked?: boolean;
}

export default function CompoundInterestCalculator({ currency: currencyProp, locked: lockedProp }: CompoundInterestCalculatorProps = {}) {
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
    setMonthlyContribution((v) => rescaleAmount(v, DEFAULT_CURRENCY, next));
  }, [isLocked]);
  const handleCurrencyChange = (next: CurrencyOption) => {
    setPrincipal((v) => rescaleAmount(v, currency, next));
    setMonthlyContribution((v) => rescaleAmount(v, currency, next));
    setCurrency(next);
    setStoredCurrency(next.code);
  };
  const fmtUSD = (v: number) => formatMoney(v, currency);

  const [copied, setCopied] = useState(false);
  const [principal, setPrincipal] = useState<number>(10000);
  const [rate, setRate] = useState<number>(8);
  const [years, setYears] = useState<number>(20);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(500);
  const [freq, setFreq] = useState<Frequency>(12);

  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      if (p.get('p')) setPrincipal(Number(p.get('p')));
      if (p.get('r')) setRate(Number(p.get('r')));
      if (p.get('y')) setYears(Number(p.get('y')));
      if (p.get('c')) setMonthlyContribution(Number(p.get('c')));
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShare = useCallback(() => {
    try {
      const params = new URLSearchParams({ p: String(principal), r: String(rate), y: String(years), c: String(monthlyContribution) });
      const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
      navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); });
    } catch {}
  }, [principal, rate, years, monthlyContribution]);

  const yearlyData = useMemo(() => {
    const data: Array<{ year: number; balance: number; contributed: number; interest: number }> = [];
    const r = rate / 100;
    const n = freq;
    const monthlyContrib = monthlyContribution;

    let balance = principal;
    let totalContributed = principal;
    for (let y = 1; y <= years; y++) {
      // Compound annually with periodic contributions: simulate per period
      for (let p = 0; p < n; p++) {
        balance += monthlyContrib * (12 / n); // contribution per period
        totalContributed += monthlyContrib * (12 / n);
        balance *= 1 + r / n;
      }
      data.push({
        year: y,
        balance,
        contributed: totalContributed,
        interest: balance - totalContributed,
      });
    }
    return data;
  }, [principal, rate, years, monthlyContribution, freq]);

  const final = yearlyData[yearlyData.length - 1] || { balance: principal, contributed: principal, interest: 0 };
  const maxBalance = Math.max(...yearlyData.map((d) => d.balance), 1);

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        <div className="bg-lime-accent border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-2xl flex-shrink-0">💹</span>
            <h2 className="!text-lg sm:!text-xl !my-0 !text-ink-900 font-extrabold truncate" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>Compound Interest</h2>
          </div>
          <CurrencySelect value={currency} onChange={handleCurrencyChange} locked={isLocked} />
        </div>

        {/* Inputs */}
        <div className="p-5 sm:p-7 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 bg-ink-50">
          <div>
            <label htmlFor="ci-principal" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Initial Investment</label>
            <div className="relative">
              <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none ${currency.symbol.length > 1 ? 'text-xs' : ''}`}>{currency.symbol}</span>
              <input id="ci-principal" type="number" min={0} step={100} value={principal} onChange={(e) => setPrincipal(Number(e.target.value) || 0)}
                className={`w-full ${currency.symbol.length > 1 ? 'pl-12' : 'pl-7'} pr-3 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-lime-accent transition-all`}
                inputMode="numeric" />
            </div>
            <input type="range" min={0} max={500000} step={500} value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} className="w-full mt-2 accent-lime-accent" aria-label="Principal slider" />
          </div>
          <div>
            <label htmlFor="ci-contribution" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Monthly Contribution</label>
            <div className="relative">
              <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none ${currency.symbol.length > 1 ? 'text-xs' : ''}`}>{currency.symbol}</span>
              <input id="ci-contribution" type="number" min={0} step={50} value={monthlyContribution} onChange={(e) => setMonthlyContribution(Number(e.target.value) || 0)}
                className={`w-full ${currency.symbol.length > 1 ? 'pl-12' : 'pl-7'} pr-3 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-cyan-accent transition-all`}
                inputMode="numeric" />
            </div>
            <input type="range" min={0} max={5000} step={50} value={monthlyContribution} onChange={(e) => setMonthlyContribution(Number(e.target.value))} className="w-full mt-2 accent-cyan-accent" aria-label="Contribution slider" />
          </div>
          <div>
            <label htmlFor="ci-rate" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Annual Return Rate</label>
            <div className="relative">
              <input id="ci-rate" type="number" min={0} max={30} step={0.1} value={rate} onChange={(e) => setRate(Number(e.target.value) || 0)}
                className="w-full pl-3.5 pr-8 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-pink-accent transition-all"
                inputMode="decimal" />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">%</span>
            </div>
            <input type="range" min={0} max={20} step={0.1} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full mt-2 accent-pink-accent" aria-label="Rate slider" />
          </div>
          <div>
            <label htmlFor="ci-years" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Years</label>
            <input id="ci-years" type="number" min={1} max={60} step={1} value={years} onChange={(e) => setYears(Number(e.target.value) || 1)}
              className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-yellow-accent transition-all"
              inputMode="numeric" />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[10, 20, 30, 40].map((y) => (
                <button key={y} type="button" onClick={() => setYears(y)} className={`px-2.5 py-1 rounded-full text-xs font-bold border-2 border-ink-900 transition-all ${years === y ? 'bg-yellow-accent text-ink-900 shadow-sticker-sm' : 'bg-white text-ink-700 hover:bg-yellow-accent/40'}`}>
                  {y}y
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Frequency picker */}
        <div className="px-5 sm:px-7 pb-3 bg-ink-50">
          <label className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Compounding Frequency</label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {([
              { value: 1 as Frequency, label: 'Annually' },
              { value: 2 as Frequency, label: 'Semi-annual' },
              { value: 4 as Frequency, label: 'Quarterly' },
              { value: 12 as Frequency, label: 'Monthly' },
              { value: 365 as Frequency, label: 'Daily' },
            ]).map((f) => (
              <button key={f.value} type="button" onClick={() => setFreq(f.value)}
                className={`py-2 px-2 rounded-xl border-2 border-ink-900 text-xs font-extrabold transition-all ${freq === f.value ? 'bg-ink-900 text-white shadow-sticker-sm -translate-y-0.5' : 'bg-white text-ink-700 hover:bg-lime-accent'}`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="p-5 sm:p-7 bg-white grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 border-t-[2.5px] border-ink-900">
          <div className="bg-lime-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Final Balance</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmtUSD(final.balance)}</div>
            <div className="text-xs text-ink-800 mt-2 font-semibold">after {years} year{years > 1 ? 's' : ''}</div>
          </div>
          <div className="bg-cyan-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Total Contributed</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmtUSD(final.contributed)}</div>
            <div className="text-xs text-ink-800 mt-2 font-semibold">your money in</div>
          </div>
          <div className="bg-pink-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-white mb-1">Interest Earned</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmtUSD(final.interest)}</div>
            <div className="text-xs text-white/90 mt-2 font-semibold">{((final.interest / final.balance) * 100).toFixed(0)}% of total</div>
          </div>
        </div>

        {/* Year-by-year chart */}
        <div className="px-5 sm:px-7 pb-5 sm:pb-7 bg-white">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mb-3">Year-by-year growth</div>
          <div className="bg-ink-50 border-2 border-ink-900 rounded-2xl p-4 overflow-x-auto">
            <div className="flex items-end gap-1 h-48 min-w-fit">
              {yearlyData.map((d) => {
                const totalHeight = (d.balance / maxBalance) * 100;
                const contribHeight = (d.contributed / d.balance) * 100;
                return (
                  <div key={d.year} className="relative flex-1 min-w-[12px] group" title={`Year ${d.year}: ${fmtUSD(d.balance)}`}>
                    <div
                      className="relative w-full bg-pink-accent border-r border-ink-900 transition-all hover:opacity-80"
                      style={{ height: `${totalHeight}%` }}
                    >
                      <div
                        className="absolute bottom-0 inset-x-0 bg-cyan-accent"
                        style={{ height: `${contribHeight}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-3 text-[10px] font-bold text-ink-600">
              <span>Year 1</span>
              <span>Year {years}</span>
            </div>
            <div className="flex items-center gap-4 mt-3 text-[11px] font-bold">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-cyan-accent border border-ink-900 rounded-sm"></span>
                <span className="text-ink-700">Contributions</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-pink-accent border border-ink-900 rounded-sm"></span>
                <span className="text-ink-700">Interest earned</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Share */}
      <div className="px-5 sm:px-7 pb-5 bg-white border-t-2 border-ink-100 pt-4">
        <button type="button" onClick={handleShare}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-ink-900 text-xs font-extrabold transition-all ${copied ? 'bg-lime-accent text-ink-900' : 'bg-white text-ink-700 hover:bg-lime-accent'}`}>
          {copied ? '✓ Copied!' : '↗ Share this calculation'}
        </button>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · Compound interest = the 8th wonder of the world (Einstein, allegedly)</div>
    </div>
  );
}
