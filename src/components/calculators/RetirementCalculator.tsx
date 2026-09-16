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

function calcRetirement(
  currentSavings: number,
  monthlyContrib: number,
  annualRatePct: number,
  inflationPct: number,
  years: number
): {
  projectedSavings: number;
  inflationAdjusted: number;
  totalContributed: number;
  totalGrowth: number;
  yearlyData: Array<{ year: number; contributions: number; growth: number; total: number }>;
} {
  const r = annualRatePct / 100;
  const rm = r / 12;
  const n = years;

  // FV of lump sum + FV of annuity (monthly)
  const fvLump = currentSavings * Math.pow(1 + r, n);
  const fvAnnuity = rm > 0
    ? monthlyContrib * ((Math.pow(1 + rm, n * 12) - 1) / rm)
    : monthlyContrib * n * 12;

  const projectedSavings = fvLump + fvAnnuity;
  const inflationAdjusted = projectedSavings / Math.pow(1 + inflationPct / 100, n);
  const totalContributed = currentSavings + monthlyContrib * n * 12;
  const totalGrowth = projectedSavings - totalContributed;

  // Year-by-year data (cap at 30 data points)
  const step = Math.max(1, Math.ceil(n / 30));
  const yearlyData: Array<{ year: number; contributions: number; growth: number; total: number }> = [];
  for (let y = step; y <= n; y += step) {
    const fvL = currentSavings * Math.pow(1 + r, y);
    const fvA = rm > 0
      ? monthlyContrib * ((Math.pow(1 + rm, y * 12) - 1) / rm)
      : monthlyContrib * y * 12;
    const total = fvL + fvA;
    const contrib = currentSavings + monthlyContrib * y * 12;
    yearlyData.push({ year: y, contributions: contrib, growth: total - contrib, total });
  }

  return { projectedSavings, inflationAdjusted, totalContributed, totalGrowth, yearlyData };
}

function fmt2(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toFixed(0);
}

export default function RetirementCalculator() {
  const isLocked = false;
  const [currency, setCurrency] = useState<CurrencyOption>(DEFAULT_CURRENCY);
  useEffect(() => {
    const next = detectClientCurrency();
    setCurrency(next);
    // Example amounts are authored in USD; re-express them at the region's scale so
    // the defaults (and the hero "Quick answer" above) read natively.
    setCurrentSavings((v) => rescaleAmount(v, DEFAULT_CURRENCY, next));
    setMonthlyContrib((v) => rescaleAmount(v, DEFAULT_CURRENCY, next));
  }, []);
  const handleCurrencyChange = (next: CurrencyOption) => {
    setCurrentSavings((v) => rescaleAmount(v, currency, next));
    setMonthlyContrib((v) => rescaleAmount(v, currency, next));
    setCurrency(next);
    setStoredCurrency(next.code);
  };
  const fmt = (v: number) => formatMoney(v, currency);
  const sym = currency.symbol;
  const symCls = sym.length > 1 ? 'text-xs' : '';

  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(65);
  const [currentSavings, setCurrentSavings] = useState(10000);
  const [monthlyContrib, setMonthlyContrib] = useState(500);
  const [annualReturn, setAnnualReturn] = useState(7);
  const [inflationRate, setInflationRate] = useState(3);

  const years = Math.max(0, retirementAge - currentAge);

  const result = useMemo(
    () => calcRetirement(currentSavings, monthlyContrib, annualReturn, inflationRate, years),
    [currentSavings, monthlyContrib, annualReturn, inflationRate, years]
  );

  const maxBar = Math.max(...result.yearlyData.map((d) => d.total), 1);

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">

        {/* Header */}
        <div className="bg-lime-accent border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-2xl flex-shrink-0">🏖️</span>
            <h2
              className="!text-lg sm:!text-xl !my-0 !text-ink-900 font-extrabold truncate"
              style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}
            >
              Retirement Savings Calculator
            </h2>
          </div>
          <CurrencySelect value={currency} onChange={handleCurrencyChange} locked={isLocked} />
        </div>

        {/* Inputs */}
        <div className="p-5 sm:p-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 bg-ink-50">

          {/* Current Age */}
          <div>
            <label htmlFor="ret-current-age" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">
              Current Age
            </label>
            <input
              id="ret-current-age" type="number" min={18} max={80} step={1} value={currentAge}
              onChange={(e) => setCurrentAge(Math.min(80, Math.max(18, Number(e.target.value) || 18)))}
              className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-lime-accent transition-all"
              inputMode="numeric"
            />
            <input type="range" min={18} max={80} step={1} value={currentAge}
              onChange={(e) => setCurrentAge(Number(e.target.value))}
              className="w-full mt-2 accent-lime-accent" aria-label="Current age slider"
            />
          </div>

          {/* Retirement Age */}
          <div>
            <label htmlFor="ret-retire-age" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">
              Retirement Age
            </label>
            <input
              id="ret-retire-age" type="number" min={40} max={90} step={1} value={retirementAge}
              onChange={(e) => setRetirementAge(Math.min(90, Math.max(40, Number(e.target.value) || 40)))}
              className={`w-full px-3.5 py-3 bg-white border-[2.5px] rounded-xl text-base font-bold focus:outline-none focus:ring-4 transition-all ${retirementAge <= currentAge ? 'border-pink-accent focus:ring-pink-accent' : 'border-ink-900 focus:ring-cyan-accent'}`}
              inputMode="numeric"
            />
            <input type="range" min={40} max={90} step={1} value={retirementAge}
              onChange={(e) => setRetirementAge(Number(e.target.value))}
              className="w-full mt-2 accent-cyan-accent" aria-label="Retirement age slider"
            />
            {retirementAge <= currentAge && (
              <p className="text-[10px] text-pink-700 mt-1 font-extrabold">Must be greater than current age</p>
            )}
          </div>

          {/* Current Savings */}
          <div>
            <label htmlFor="ret-savings" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">
              Current Savings
            </label>
            <div className="relative">
              <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none ${symCls}`}>{sym}</span>
              <input
                id="ret-savings" type="number" min={0} step={1000} value={currentSavings}
                onChange={(e) => setCurrentSavings(Number(e.target.value) || 0)}
                className={`w-full ${sym.length > 1 ? 'pl-12' : 'pl-7'} pr-3 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-yellow-accent transition-all`}
                inputMode="numeric"
              />
            </div>
            <input type="range" min={0} max={500000} step={1000} value={currentSavings}
              onChange={(e) => setCurrentSavings(Number(e.target.value))}
              className="w-full mt-2 accent-yellow-accent" aria-label="Current savings slider"
            />
          </div>

          {/* Monthly Contribution */}
          <div>
            <label htmlFor="ret-contrib" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">
              Monthly Contribution
            </label>
            <div className="relative">
              <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none ${symCls}`}>{sym}</span>
              <input
                id="ret-contrib" type="number" min={0} step={50} value={monthlyContrib}
                onChange={(e) => setMonthlyContrib(Number(e.target.value) || 0)}
                className={`w-full ${sym.length > 1 ? 'pl-12' : 'pl-7'} pr-3 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-pink-accent transition-all`}
                inputMode="numeric"
              />
            </div>
            <input type="range" min={0} max={10000} step={50} value={monthlyContrib}
              onChange={(e) => setMonthlyContrib(Number(e.target.value))}
              className="w-full mt-2 accent-pink-accent" aria-label="Monthly contribution slider"
            />
          </div>

          {/* Annual Return */}
          <div>
            <label htmlFor="ret-return" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">
              Expected Annual Return
            </label>
            <div className="relative">
              <input
                id="ret-return" type="number" min={0} max={30} step={0.5} value={annualReturn}
                onChange={(e) => setAnnualReturn(Number(e.target.value) || 0)}
                className="w-full pl-3.5 pr-8 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-lime-accent transition-all"
                inputMode="decimal"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">%</span>
            </div>
            <input type="range" min={0} max={20} step={0.5} value={annualReturn}
              onChange={(e) => setAnnualReturn(Number(e.target.value))}
              className="w-full mt-2 accent-lime-accent" aria-label="Annual return slider"
            />
          </div>

          {/* Inflation Rate */}
          <div>
            <label htmlFor="ret-inflation" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">
              Inflation Rate
            </label>
            <div className="relative">
              <input
                id="ret-inflation" type="number" min={0} max={15} step={0.25} value={inflationRate}
                onChange={(e) => setInflationRate(Number(e.target.value) || 0)}
                className="w-full pl-3.5 pr-8 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-cyan-accent transition-all"
                inputMode="decimal"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">%</span>
            </div>
            <input type="range" min={0} max={10} step={0.25} value={inflationRate}
              onChange={(e) => setInflationRate(Number(e.target.value))}
              className="w-full mt-2 accent-cyan-accent" aria-label="Inflation rate slider"
            />
          </div>
        </div>

        {/* Results */}
        <div className="p-5 sm:p-7 bg-white border-t-[2.5px] border-ink-900">

          {/* Years chip */}
          <div className="mb-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ink-900 text-white text-xs font-extrabold uppercase tracking-wider">
              ⏱ {years} year{years !== 1 ? 's' : ''} to retirement
            </span>
            {years === 0 && (
              <span className="text-xs text-pink-700 font-bold">Set retirement age higher than current age</span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Projected Savings — hero */}
            <div className="bg-lime-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm sm:col-span-2 lg:col-span-1">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Projected at Retirement</div>
              <div className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-none tabular-nums" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>
                {fmt2(result.projectedSavings)}
                <span className="text-sm ml-1 font-bold">{sym}</span>
              </div>
              <div className="text-xs text-ink-800 mt-2 font-semibold">{fmt(result.projectedSavings)}</div>
            </div>

            {/* Inflation-Adjusted */}
            <div className="bg-cyan-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Inflation-Adjusted Value</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-ink-900 leading-none tabular-nums" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.03em' }}>
                {fmt(result.inflationAdjusted)}
              </div>
              <div className="text-xs text-ink-800 mt-2 font-semibold">In today's {sym} at {inflationRate}% inflation</div>
            </div>

            {/* Total Contributed */}
            <div className="bg-yellow-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Total Contributed</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-ink-900 leading-none tabular-nums" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.03em' }}>
                {fmt(result.totalContributed)}
              </div>
              <div className="text-xs text-ink-800 mt-2 font-semibold">Your actual deposits</div>
            </div>

            {/* Total Growth */}
            <div className="bg-pink-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-white mb-1">Total Growth</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white leading-none tabular-nums" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.03em' }}>
                {fmt(result.totalGrowth)}
              </div>
              <div className="text-xs text-white/90 mt-2 font-semibold">Interest earned</div>
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        {result.yearlyData.length > 0 && (
          <div className="px-5 sm:px-7 pb-5 sm:pb-7 bg-white">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mb-4">
              Growth Over Time
            </div>
            <div className="flex items-end gap-1 h-40 overflow-x-auto pb-2">
              {result.yearlyData.map((d) => {
                const totalH = (d.total / maxBar) * 100;
                const contribH = (d.contributions / maxBar) * 100;
                const growthH = totalH - contribH;
                return (
                  <div key={d.year} className="flex flex-col items-center flex-1 min-w-[18px] group relative">
                    <div className="absolute bottom-6 hidden group-hover:flex flex-col items-center z-10 pointer-events-none">
                      <div className="bg-ink-900 text-white text-[10px] font-bold rounded-lg px-2 py-1 whitespace-nowrap shadow-sticker-sm">
                        Yr {d.year}: {fmt(d.total)}
                      </div>
                    </div>
                    <div className="w-full flex flex-col justify-end h-32 gap-0">
                      <div
                        className="w-full bg-pink-accent border-x border-pink-accent/50 transition-all duration-300"
                        style={{ height: `${growthH}%` }}
                        title={`Growth: ${fmt(d.growth)}`}
                      />
                      <div
                        className="w-full bg-cyan-accent border-x border-cyan-accent/50 transition-all duration-300"
                        style={{ height: `${contribH}%` }}
                        title={`Contributions: ${fmt(d.contributions)}`}
                      />
                    </div>
                    <span className="text-[8px] text-ink-500 mt-1 font-bold">{d.year}y</span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-4 mt-2 text-[10px] font-extrabold uppercase tracking-wider">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-pink-accent border border-ink-900 inline-block" />Growth</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-cyan-accent border border-ink-900 inline-block" />Contributions</span>
            </div>
          </div>
        )}
      </div>

      <div className="text-xs text-ink-500 mt-3 px-1">
        <span className="font-bold">✨ Live calculation</span>
        {' · '}Results are estimates. Actual returns vary. Consult a licensed financial adviser.
      </div>
    </div>
  );
}
