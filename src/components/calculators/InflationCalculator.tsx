import { useState, useMemo, useEffect } from 'react';
import {
  DEFAULT_CURRENCY,
  detectClientCurrency,
  rescaleAmount,
  formatMoney,
  setStoredCurrency,
  type CurrencyOption,
} from '../../lib/currency';
import CurrencySelect from '../ui/CurrencySelect';

type Mode = 'purchasing-power' | 'future-value';

const CURRENT_YEAR = 2026;

export default function InflationCalculator() {
  const isLocked = false;
  const [currency, setCurrency] = useState<CurrencyOption>(DEFAULT_CURRENCY);
  useEffect(() => {
    const next = detectClientCurrency();
    setCurrency(next);
    // Example amounts are authored in USD; re-express them at the region's scale so
    // the defaults (and the hero "Quick answer" above) read natively.
    setOrigAmount((v) => rescaleAmount(v, DEFAULT_CURRENCY, next));
    setFutureAmount((v) => rescaleAmount(v, DEFAULT_CURRENCY, next));
  }, []);
  const handleCurrencyChange = (next: CurrencyOption) => {
    setOrigAmount((v) => rescaleAmount(v, currency, next));
    setFutureAmount((v) => rescaleAmount(v, currency, next));
    setCurrency(next);
    setStoredCurrency(next.code);
  };
  const fmt = (v: number) => formatMoney(v, currency);
  const sym = currency.symbol;
  const symCls = sym.length > 1 ? 'text-xs' : '';

  const [mode, setMode] = useState<Mode>('purchasing-power');

  // Mode A — Purchasing Power
  const [origAmount, setOrigAmount] = useState(10000);
  const [startYear, setStartYear] = useState(2006);
  const [endYear, setEndYear] = useState(CURRENT_YEAR);
  const [ppInflation] = useState(3); // fixed average CPI

  // Mode B — Future Value
  const [futureAmount, setFutureAmount] = useState(10000);
  const [futureYears, setFutureYears] = useState(20);
  const [futureInflation, setFutureInflation] = useState(3);

  const result = useMemo(() => {
    if (mode === 'purchasing-power') {
      const yearsSpan = Math.max(0, endYear - startYear);
      const multiplier = Math.pow(1 + ppInflation / 100, yearsSpan);
      const equivalent = origAmount * multiplier;
      const lost = equivalent - origAmount;
      return {
        equivalent,
        lost,
        multiplier,
        yearsSpan,
        label: `${sym === '$' ? '' : ''}${startYear} → ${endYear}`,
        note: `Based on ~${ppInflation}% average annual inflation (US CPI historical average)`,
      };
    } else {
      const multiplier = Math.pow(1 + futureInflation / 100, futureYears);
      const equivalent = futureAmount * multiplier;
      const realValueLost = futureAmount - futureAmount / multiplier;
      return {
        equivalent,
        lost: realValueLost,
        multiplier,
        yearsSpan: futureYears,
        label: `In ${futureYears} year${futureYears !== 1 ? 's' : ''}`,
        note: `At ${futureInflation}% annual inflation`,
      };
    }
  }, [mode, origAmount, startYear, endYear, ppInflation, futureAmount, futureYears, futureInflation, sym]);

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">

        {/* Header */}
        <div className="bg-lime-accent border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-2xl flex-shrink-0">📈</span>
            <h2
              className="!text-lg sm:!text-xl !my-0 !text-ink-900 font-extrabold truncate"
              style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}
            >
              Inflation Calculator
            </h2>
          </div>
          <CurrencySelect value={currency} onChange={handleCurrencyChange} locked={isLocked} />
        </div>

        {/* Mode toggle */}
        <div className="bg-ink-50 px-5 sm:px-7 pt-5 pb-0">
          <div className="flex rounded-xl border-[2.5px] border-ink-900 overflow-hidden w-full sm:w-auto sm:inline-flex">
            <button
              type="button"
              onClick={() => setMode('purchasing-power')}
              className={`flex-1 sm:flex-none px-5 py-2.5 text-sm font-extrabold transition-all ${mode === 'purchasing-power' ? 'bg-ink-900 text-white' : 'bg-white text-ink-700 hover:bg-ink-50'}`}
            >
              Purchasing Power
            </button>
            <button
              type="button"
              onClick={() => setMode('future-value')}
              className={`flex-1 sm:flex-none px-5 py-2.5 text-sm font-extrabold border-l-2 border-ink-900 transition-all ${mode === 'future-value' ? 'bg-ink-900 text-white' : 'bg-white text-ink-700 hover:bg-ink-50'}`}
            >
              Future Value
            </button>
          </div>
        </div>

        {/* Inputs — Mode A */}
        {mode === 'purchasing-power' && (
          <div className="p-5 sm:p-7 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5 bg-ink-50">
            <div>
              <label htmlFor="inf-orig" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">
                Original Amount
              </label>
              <div className="relative">
                <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none ${symCls}`}>{sym}</span>
                <input
                  id="inf-orig" type="number" min={1} step={100} value={origAmount}
                  onChange={(e) => setOrigAmount(Number(e.target.value) || 0)}
                  className={`w-full ${sym.length > 1 ? 'pl-12' : 'pl-7'} pr-3 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-lime-accent transition-all`}
                  inputMode="numeric"
                />
              </div>
            </div>

            <div>
              <label htmlFor="inf-start-year" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">
                Start Year
              </label>
              <input
                id="inf-start-year" type="number" min={1950} max={CURRENT_YEAR - 1} step={1} value={startYear}
                onChange={(e) => setStartYear(Math.min(CURRENT_YEAR - 1, Math.max(1950, Number(e.target.value) || 1950)))}
                className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-cyan-accent transition-all"
                inputMode="numeric"
              />
              <input type="range" min={1950} max={CURRENT_YEAR - 1} step={1} value={startYear}
                onChange={(e) => setStartYear(Number(e.target.value))}
                className="w-full mt-2 accent-cyan-accent" aria-label="Start year slider"
              />
            </div>

            <div>
              <label htmlFor="inf-end-year" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">
                End Year
              </label>
              <input
                id="inf-end-year" type="number" min={startYear + 1} max={2100} step={1} value={endYear}
                onChange={(e) => setEndYear(Math.max(startYear + 1, Number(e.target.value) || CURRENT_YEAR))}
                className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-yellow-accent transition-all"
                inputMode="numeric"
              />
              <input type="range" min={startYear + 1} max={2100} step={1} value={endYear}
                onChange={(e) => setEndYear(Number(e.target.value))}
                className="w-full mt-2 accent-yellow-accent" aria-label="End year slider"
              />
            </div>
          </div>
        )}

        {/* Inputs — Mode B */}
        {mode === 'future-value' && (
          <div className="p-5 sm:p-7 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5 bg-ink-50">
            <div>
              <label htmlFor="inf-future-amt" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">
                Amount Today
              </label>
              <div className="relative">
                <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none ${symCls}`}>{sym}</span>
                <input
                  id="inf-future-amt" type="number" min={1} step={100} value={futureAmount}
                  onChange={(e) => setFutureAmount(Number(e.target.value) || 0)}
                  className={`w-full ${sym.length > 1 ? 'pl-12' : 'pl-7'} pr-3 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-lime-accent transition-all`}
                  inputMode="numeric"
                />
              </div>
            </div>

            <div>
              <label htmlFor="inf-future-years" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">
                Years: <span className="font-extrabold text-ink-900">{futureYears}</span>
              </label>
              <input
                id="inf-future-years" type="range" min={1} max={50} step={1} value={futureYears}
                onChange={(e) => setFutureYears(Number(e.target.value))}
                className="w-full mt-3 accent-pink-accent" aria-label="Years slider"
              />
              <div className="flex justify-between text-[10px] text-ink-500 font-semibold mt-1"><span>1y</span><span>50y</span></div>
            </div>

            <div>
              <label htmlFor="inf-future-rate" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">
                Inflation Rate: <span className="font-extrabold text-ink-900">{futureInflation}%</span>
              </label>
              <input
                id="inf-future-rate" type="range" min={0} max={15} step={0.5} value={futureInflation}
                onChange={(e) => setFutureInflation(Number(e.target.value))}
                className="w-full mt-3 accent-cyan-accent" aria-label="Inflation rate slider"
              />
              <div className="flex justify-between text-[10px] text-ink-500 font-semibold mt-1"><span>0%</span><span>15%</span></div>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="p-5 sm:p-7 bg-white border-t-[2.5px] border-ink-900">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">

            {/* Equivalent Value — hero */}
            <div className="bg-lime-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">
                {mode === 'purchasing-power' ? 'Equivalent in ' + endYear : 'You\'ll Need in ' + result.yearsSpan + 'y'}
              </div>
              <div
                className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-none tabular-nums"
                style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}
              >
                {fmt(result.equivalent)}
              </div>
              <div className="text-xs text-ink-800 mt-2 font-semibold">{result.label}</div>
            </div>

            {/* Purchasing Power Lost */}
            <div className="bg-pink-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-white mb-1">
                {mode === 'purchasing-power' ? 'Purchasing Power Lost' : 'Real Value Lost'}
              </div>
              <div
                className="text-2xl sm:text-3xl font-extrabold text-white leading-none tabular-nums"
                style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.03em' }}
              >
                {fmt(result.lost)}
              </div>
              <div className="text-xs text-white/90 mt-2 font-semibold">Erosion from inflation</div>
            </div>

            {/* Multiplier */}
            <div className="bg-cyan-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Inflation Multiplier</div>
              <div
                className="text-2xl sm:text-3xl font-extrabold text-ink-900 leading-none"
                style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.03em' }}
              >
                ×{result.multiplier.toFixed(2)}
              </div>
              <div className="text-xs text-ink-800 mt-2 font-semibold">Prices {result.multiplier >= 1 ? 'rose' : 'fell'} by factor</div>
            </div>
          </div>

          {/* Note */}
          <p className="text-[11px] text-ink-500 mt-4 font-semibold">{result.note}</p>
        </div>
      </div>

      <div className="text-xs text-ink-500 mt-3 px-1">
        <span className="font-bold">✨ Live calculation</span>
        {' · '}Uses compound inflation formula. Real CPI data varies by country and year.
      </div>
    </div>
  );
}
