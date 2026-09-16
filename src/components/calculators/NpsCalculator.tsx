import { useState, useMemo } from 'react';

function fmtINR(n: number): string {
  const v = Number.isFinite(n) ? n : 0;
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);
}
function fmtINRShort(value: number): string {
  const v = Number.isFinite(value) ? value : 0;
  if (v >= 10000000) return `₹${(v / 10000000).toFixed(2)} Cr`;
  if (v >= 100000) return `₹${(v / 100000).toFixed(2)} L`;
  return `₹${Math.round(v).toLocaleString('en-IN')}`;
}

/** PFRDA requires at least 40% of the Tier I corpus to be annuitised at superannuation. */
const MIN_ANNUITY_PCT = 40;
/** NPS Tier I vesting age — the corpus is locked until 60. */
const VESTING_AGE = 60;

/** Parses an input value, rejecting NaN/Infinity, then clamps it to a safe range. */
function clampInput(raw: string, min: number, max: number, fallback: number): number {
  const n = Number(raw);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

export default function NpsCalculator() {
  const [currentAge, setCurrentAge] = useState<number>(30);
  const [monthly, setMonthly] = useState<number>(5000);
  const [expectedReturn, setExpectedReturn] = useState<number>(10);
  const [annuityPct, setAnnuityPct] = useState<number>(40);
  const [annuityRate, setAnnuityRate] = useState<number>(6);

  const result = useMemo(() => {
    const months = Math.max(0, Math.round((VESTING_AGE - currentAge) * 12));
    const i = expectedReturn / 12 / 100;
    const P = Math.max(0, monthly);

    // Future value of an ordinary annuity. The i === 0 branch avoids a divide by zero.
    const fvAt = (n: number): number => {
      if (n <= 0 || P <= 0) return 0;
      const v = i === 0 ? P * n : P * ((Math.pow(1 + i, n) - 1) / i);
      return Number.isFinite(v) ? v : 0;
    };

    const corpus = fvAt(months);
    const totalInvested = P * months;
    const totalGains = Math.max(0, corpus - totalInvested);
    const annPct = Math.min(100, Math.max(MIN_ANNUITY_PCT, annuityPct));
    const annuityCorpus = (corpus * annPct) / 100;
    const lumpsum = corpus - annuityCorpus;
    const monthlyPension = (annuityCorpus * (Math.max(0, annuityRate) / 100)) / 12;

    const years = Math.floor(months / 12);
    const yearly: Array<{ year: number; age: number; balance: number; contributed: number }> = [];
    for (let y = 1; y <= years; y++) {
      yearly.push({
        year: y,
        age: currentAge + y,
        balance: fvAt(y * 12),
        contributed: P * y * 12,
      });
    }

    // Annuity rates differ by provider and option, so the pension is worth stress-testing.
    const sensitivity = [5, 6, 7].map((r) => ({
      rate: r,
      pension: (annuityCorpus * (r / 100)) / 12,
    }));

    return {
      months, years, corpus, totalInvested, totalGains,
      annPct, annuityCorpus, lumpsum, monthlyPension, yearly, sensitivity,
      retired: currentAge >= VESTING_AGE,
    };
  }, [currentAge, monthly, expectedReturn, annuityPct, annuityRate]);

  const maxBalance = Math.max(...result.yearly.map((d) => d.balance), 1);

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        <div className="bg-violet-500 border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🪷</span>
            <h2 className="!text-lg sm:!text-xl !my-0 !text-white font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>NPS Calculator</h2>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-50"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            Live
          </span>
        </div>

        <div className="p-5 sm:p-7 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 bg-ink-50">
          <div>
            <label htmlFor="nps-age" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Current Age</label>
            <input id="nps-age" type="number" min={18} max={60} step={1} value={currentAge}
              onChange={(e) => setCurrentAge(clampInput(e.target.value, 0, 60, 30))}
              className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-violet-500 transition-all"
              inputMode="numeric" />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[25, 30, 35, 40, 45].map((a) => (
                <button key={a} type="button" onClick={() => setCurrentAge(a)} className={`px-2.5 py-1 rounded-full text-xs font-bold border-2 border-ink-900 transition-all ${currentAge === a ? 'bg-violet-500 text-white shadow-sticker-sm' : 'bg-white text-ink-700 hover:bg-violet-500/20'}`}>
                  {a}
                </button>
              ))}
            </div>
            <div className="text-[10px] text-ink-500 mt-1.5 font-bold">Tier I stays locked until age 60</div>
          </div>
          <div>
            <label htmlFor="nps-monthly" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Monthly Contribution</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">₹</span>
              <input id="nps-monthly" type="number" min={500} max={500000} step={500} value={monthly}
                onChange={(e) => setMonthly(clampInput(e.target.value, 0, 5000000, 5000))}
                className="w-full pl-7 pr-3 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-cyan-accent transition-all"
                inputMode="numeric" />
            </div>
            <input type="range" min={500} max={100000} step={500} value={Math.min(100000, monthly)} onChange={(e) => setMonthly(Number(e.target.value))} className="w-full mt-2 accent-violet-500" aria-label="Monthly contribution slider" />
            <div className="text-[10px] text-ink-500 mt-1.5 font-bold">Minimum ₹1,000 per year keeps Tier I active</div>
          </div>
          <div>
            <label htmlFor="nps-return" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Expected Return</label>
            <div className="relative">
              <input id="nps-return" type="number" min={0} max={20} step={0.5} value={expectedReturn}
                onChange={(e) => setExpectedReturn(clampInput(e.target.value, 0, 30, 10))}
                className="w-full pl-3.5 pr-8 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-lime-accent transition-all"
                inputMode="decimal" />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">%</span>
            </div>
            <div className="text-[10px] text-ink-500 mt-1.5 font-bold">Blended E + C + G return, not guaranteed</div>
          </div>
          <div>
            <label htmlFor="nps-annuity-pct" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Annuity Portion</label>
            <div className="relative">
              <input id="nps-annuity-pct" type="number" min={40} max={100} step={5} value={annuityPct}
                onChange={(e) => setAnnuityPct(clampInput(e.target.value, MIN_ANNUITY_PCT, 100, MIN_ANNUITY_PCT))}
                className="w-full pl-3.5 pr-8 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-violet-500 transition-all"
                inputMode="decimal" />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">%</span>
            </div>
            <input type="range" min={40} max={100} step={5} value={result.annPct} onChange={(e) => setAnnuityPct(Number(e.target.value))} className="w-full mt-2 accent-violet-500" aria-label="Annuity portion slider" />
            <div className="text-[10px] text-ink-500 mt-1.5 font-bold">Statutory floor: 40% must buy an annuity</div>
          </div>
          <div>
            <label htmlFor="nps-annuity-rate" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Annuity Rate</label>
            <div className="relative">
              <input id="nps-annuity-rate" type="number" min={0} max={15} step={0.25} value={annuityRate}
                onChange={(e) => setAnnuityRate(clampInput(e.target.value, 0, 20, 6))}
                className="w-full pl-3.5 pr-8 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-yellow-accent transition-all"
                inputMode="decimal" />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">%</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[5, 6, 7].map((r) => (
                <button key={r} type="button" onClick={() => setAnnuityRate(r)} className={`px-2.5 py-1 rounded-full text-xs font-bold border-2 border-ink-900 transition-all ${annuityRate === r ? 'bg-yellow-accent text-ink-900 shadow-sticker-sm' : 'bg-white text-ink-700 hover:bg-yellow-accent/40'}`}>
                  {r}%
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-end">
            <div className="w-full bg-white border-2 border-ink-900 rounded-2xl p-4">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mb-1">Years to vesting</div>
              <div className="text-2xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.03em' }}>
                {result.years} yr{result.years === 1 ? '' : 's'}
              </div>
              <div className="text-[11px] text-ink-600 mt-1.5 font-semibold">{result.months} monthly contributions of {fmtINR(monthly)}</div>
            </div>
          </div>
        </div>

        {result.retired && (
          <div className="mx-5 sm:mx-7 mb-1 bg-yellow-accent border-[2.5px] border-ink-900 rounded-2xl p-4 shadow-sticker-sm">
            <div className="flex items-start gap-2.5">
              <span className="text-lg leading-none">⚠️</span>
              <p className="text-xs sm:text-sm font-bold text-ink-900 !m-0 leading-snug">
                You have entered an age of {currentAge}, which is at or past the NPS vesting age of 60, so there is no accumulation period left to project. Enter an age below 60 to see a corpus. If you are already 60 or over, you can still join NPS up to age 70 under the extended entry window, but the account then runs to a minimum three-year lock-in rather than to age 60, and the numbers below do not apply.
              </p>
            </div>
          </div>
        )}

        <div className="p-5 sm:p-7 bg-white grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 border-t-[2.5px] border-ink-900">
          <div className="bg-violet-500 border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-white mb-1">Corpus at 60</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmtINRShort(result.corpus)}</div>
            <div className="text-xs text-white/90 mt-2 font-semibold">{fmtINR(result.corpus)}</div>
          </div>
          <div className="bg-lime-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Monthly Pension</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmtINRShort(result.monthlyPension)}</div>
            <div className="text-xs text-ink-800 mt-2 font-semibold">at {annuityRate}% annuity rate</div>
          </div>
          <div className="bg-cyan-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Total Gains</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmtINRShort(result.totalGains)}</div>
            <div className="text-xs text-ink-800 mt-2 font-semibold">on {fmtINRShort(result.totalInvested)} invested</div>
          </div>
        </div>

        <div className="px-5 sm:px-7 pb-5 sm:pb-7 bg-white">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mb-3">How your corpus splits at 60</div>
          <div className="bg-ink-50 border-2 border-ink-900 rounded-2xl p-4 sm:p-5">
            <div className="flex w-full h-14 border-2 border-ink-900 rounded-xl overflow-hidden">
              <div className="bg-lime-accent flex items-center justify-center border-r-2 border-ink-900" style={{ width: `${100 - result.annPct}%` }}>
                <span className="text-xs sm:text-sm font-extrabold text-ink-900">{100 - result.annPct}%</span>
              </div>
              <div className="bg-violet-500 flex items-center justify-center" style={{ width: `${result.annPct}%` }}>
                <span className="text-xs sm:text-sm font-extrabold text-white">{result.annPct}%</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <div className="bg-white border-2 border-ink-900 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-3 h-3 bg-lime-accent border border-ink-900 rounded-sm"></span>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700">Lump sum you withdraw</span>
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.03em' }}>{fmtINR(result.lumpsum)}</div>
                <div className="text-[11px] text-ink-600 mt-2 font-semibold">Tax-free at withdrawal under Section 10(12A)</div>
              </div>
              <div className="bg-white border-2 border-ink-900 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-3 h-3 bg-violet-500 border border-ink-900 rounded-sm"></span>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700">Annuity corpus (locked)</span>
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.03em' }}>{fmtINR(result.annuityCorpus)}</div>
                <div className="text-[11px] text-ink-600 mt-2 font-semibold">Buys a pension of {fmtINR(result.monthlyPension)} per month</div>
              </div>
            </div>
            <p className="text-[11px] sm:text-xs text-ink-600 font-semibold mt-4 !mb-0 leading-relaxed">
              {fmtINR(result.annuityCorpus)} × {annuityRate}% ÷ 12 = <span className="font-extrabold text-ink-900">{fmtINR(result.monthlyPension)}</span> per month, paid for life by an IRDAI-registered annuity service provider.
            </p>
          </div>

          {result.yearly.length > 0 && (
            <>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mt-6 mb-3">Year-by-year NPS growth to age 60</div>
              <div className="bg-ink-50 border-2 border-ink-900 rounded-2xl p-4 overflow-x-auto">
                <div className="flex items-end gap-1 h-48 min-w-fit">
                  {result.yearly.map((d) => {
                    const totalHeight = (d.balance / maxBalance) * 100;
                    const contribHeight = d.balance > 0 ? (d.contributed / d.balance) * 100 : 0;
                    return (
                      <div key={d.year} className="relative flex-1 min-w-[14px] group" title={`Age ${d.age}: ${fmtINR(d.balance)}`}>
                        <div className="relative w-full bg-violet-500 border-r border-ink-900 transition-all hover:opacity-80" style={{ height: `${totalHeight}%` }}>
                          <div className="absolute bottom-0 inset-x-0 bg-cyan-accent" style={{ height: `${Math.min(100, contribHeight)}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between mt-3 text-[10px] font-bold text-ink-600">
                  <span>Age {currentAge + 1}</span>
                  <span>Age 60</span>
                </div>
                <div className="flex items-center gap-4 mt-3 text-[11px] font-bold">
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-cyan-accent border border-ink-900 rounded-sm"></span><span className="text-ink-700">Your contributions</span></div>
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-violet-500 border border-ink-900 rounded-sm"></span><span className="text-ink-700">Market growth</span></div>
                </div>
              </div>
            </>
          )}

          <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mt-6 mb-3">Monthly pension by annuity rate</div>
          <div className="bg-ink-50 border-2 border-ink-900 rounded-2xl overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-ink-900">
                  <th className="text-left px-4 py-2.5 font-extrabold text-ink-900 text-xs uppercase tracking-wider">Annuity rate</th>
                  <th className="text-right px-4 py-2.5 font-extrabold text-ink-900 text-xs uppercase tracking-wider">Monthly pension</th>
                  <th className="text-right px-4 py-2.5 font-extrabold text-ink-900 text-xs uppercase tracking-wider">Annual pension</th>
                </tr>
              </thead>
              <tbody>
                {result.sensitivity.map((row) => (
                  <tr key={row.rate} className={`border-b border-ink-200 last:border-0 ${row.rate === annuityRate ? 'bg-violet-500/20' : ''}`}>
                    <td className="px-4 py-2.5 font-bold text-ink-800">{row.rate}%</td>
                    <td className="px-4 py-2.5 text-right font-extrabold text-ink-900">{fmtINR(row.pension)}</td>
                    <td className="px-4 py-2.5 text-right font-bold text-ink-700">{fmtINR(row.pension * 12)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-ink-500 font-semibold mt-2 !mb-0">Annuity rates are quoted by the provider you pick at 60 and vary by option. A joint-life annuity with return of purchase price pays less than a single-life annuity without it.</p>
        </div>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · NPS Tier I · 60% lump sum tax-free, minimum 40% annuitised, pension taxed at slab rate</div>
    </div>
  );
}
