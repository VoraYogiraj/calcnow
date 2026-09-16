import { useState, useMemo } from 'react';

function fmtINR(n: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(
    Number.isFinite(n) ? n : 0,
  );
}
function fmtINRShort(value: number): string {
  const v = Number.isFinite(value) ? value : 0;
  if (v >= 10000000) return `₹${(v / 10000000).toFixed(2)} Cr`;
  if (v >= 100000) return `₹${(v / 100000).toFixed(2)} L`;
  return `₹${Math.round(v).toLocaleString('en-IN')}`;
}

/** Return assumptions compared side by side against the user's own amount and tenure. */
const SCENARIO_RATES = [8, 10, 12, 14];

export default function LumpsumCalculator() {
  const [amount, setAmount] = useState<number>(100000);
  const [annualReturn, setAnnualReturn] = useState<number>(12);
  const [years, setYears] = useState<number>(10);
  const [inflation, setInflation] = useState<number>(6);

  // Every input is clamped before it reaches the maths so a blank field,
  // a negative number or a pasted string can never produce NaN on screen.
  const safe = useMemo(() => {
    const a = Number.isFinite(amount) ? Math.max(0, amount) : 0;
    const r = Number.isFinite(annualReturn) ? Math.max(-99, Math.min(50, annualReturn)) : 0;
    const y = Number.isFinite(years) ? Math.max(0, Math.min(50, Math.floor(years))) : 0;
    const i = Number.isFinite(inflation) ? Math.max(0, Math.min(50, inflation)) : 0;
    return { amount: a, rate: r, years: y, inflation: i };
  }, [amount, annualReturn, years, inflation]);

  const result = useMemo(() => {
    const growth = Math.pow(1 + safe.rate / 100, safe.years);
    const futureValue = safe.amount * growth;
    const totalGains = futureValue - safe.amount;
    const realValue = futureValue / Math.pow(1 + safe.inflation / 100, safe.years);
    const absoluteReturn = safe.amount > 0 ? (totalGains / safe.amount) * 100 : 0;
    const inflationCost = futureValue - realValue;
    return { growth, futureValue, totalGains, realValue, absoluteReturn, inflationCost };
  }, [safe]);

  const yearlyData = useMemo(() => {
    const data: Array<{ year: number; balance: number; principal: number; gains: number }> = [];
    for (let y = 1; y <= safe.years; y++) {
      const balance = safe.amount * Math.pow(1 + safe.rate / 100, y);
      data.push({ year: y, balance, principal: safe.amount, gains: balance - safe.amount });
    }
    return data;
  }, [safe]);

  const maxBalance = Math.max(...yearlyData.map((d) => d.balance), 1);

  // Same money, same tenure, four different return assumptions.
  const scenarios = useMemo(
    () =>
      SCENARIO_RATES.map((rate) => {
        const fv = safe.amount * Math.pow(1 + rate / 100, safe.years);
        return { rate, fv, gains: fv - safe.amount };
      }),
    [safe.amount, safe.years],
  );

  const zeroYears = safe.years === 0;

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        <div className="bg-orange-500 border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💰</span>
            <h2 className="!text-lg sm:!text-xl !my-0 !text-white font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>Lumpsum Calculator</h2>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-50"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            Live
          </span>
        </div>

        <div className="p-5 sm:p-7 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 bg-ink-50">
          <div>
            <label htmlFor="lump-amount" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">One-Time Investment</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">₹</span>
              <input id="lump-amount" type="number" min={0} step={5000} value={amount} onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))}
                className="w-full pl-7 pr-3 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-orange-500 transition-all"
                inputMode="numeric" />
            </div>
            <input type="range" min={5000} max={5000000} step={5000} value={Math.min(amount, 5000000)} onChange={(e) => setAmount(Number(e.target.value))} className="w-full mt-2 accent-orange-500" aria-label="Investment amount slider" />
            <div className="text-[10px] text-ink-500 mt-1.5 font-bold">Invested once, upfront (no monthly instalments)</div>
          </div>
          <div>
            <label htmlFor="lump-return" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Expected Annual Return</label>
            <div className="relative">
              <input id="lump-return" type="number" min={0} max={30} step={0.5} value={annualReturn} onChange={(e) => setAnnualReturn(Number(e.target.value) || 0)}
                className="w-full pl-3.5 pr-8 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-pink-accent transition-all"
                inputMode="decimal" />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">%</span>
            </div>
            <input type="range" min={0} max={25} step={0.5} value={Math.min(Math.max(annualReturn, 0), 25)} onChange={(e) => setAnnualReturn(Number(e.target.value))} className="w-full mt-2 accent-pink-accent" aria-label="Expected return slider" />
            <div className="text-[10px] text-ink-500 mt-1.5 font-bold">Equity funds 10–12% · hybrid 8–10% · debt 6–8%</div>
          </div>
          <div>
            <label htmlFor="lump-years" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Investment Period (Years)</label>
            <input id="lump-years" type="number" min={0} max={50} step={1} value={years} onChange={(e) => setYears(Math.max(0, Math.min(50, Math.floor(Number(e.target.value) || 0))))}
              className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-yellow-accent transition-all"
              inputMode="numeric" />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[3, 5, 10, 15, 20, 25].map((y) => (
                <button key={y} type="button" onClick={() => setYears(y)} className={`px-2.5 py-1 rounded-full text-xs font-bold border-2 border-ink-900 transition-all ${years === y ? 'bg-yellow-accent text-ink-900 shadow-sticker-sm' : 'bg-white text-ink-700 hover:bg-yellow-accent/40'}`}>
                  {y}y
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="lump-inflation" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Inflation Rate</label>
            <div className="relative">
              <input id="lump-inflation" type="number" min={0} max={20} step={0.5} value={inflation} onChange={(e) => setInflation(Math.max(0, Number(e.target.value) || 0))}
                className="w-full pl-3.5 pr-8 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-cyan-accent transition-all"
                inputMode="decimal" />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">%</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[4, 5, 6, 7].map((p) => (
                <button key={p} type="button" onClick={() => setInflation(p)} className={`px-2.5 py-1 rounded-full text-xs font-bold border-2 border-ink-900 transition-all ${inflation === p ? 'bg-cyan-accent text-ink-900 shadow-sticker-sm' : 'bg-white text-ink-700 hover:bg-cyan-accent/40'}`}>
                  {p}%
                </button>
              ))}
            </div>
            <div className="text-[10px] text-ink-500 mt-1.5 font-bold">Used only for the "in today's money" figure</div>
          </div>
        </div>

        {zeroYears && (
          <div className="mx-5 sm:mx-7 mb-1 bg-yellow-accent border-[2.5px] border-ink-900 rounded-2xl p-4 shadow-sticker-sm">
            <div className="flex items-start gap-2.5">
              <span className="text-lg leading-none">⚠️</span>
              <p className="text-xs sm:text-sm font-bold text-ink-900 !m-0 leading-snug">
                Investment period is zero, so nothing has compounded yet. Your future value equals the amount you put in. Set a tenure of at least one year to see growth.
              </p>
            </div>
          </div>
        )}

        <div className="p-5 sm:p-7 bg-white grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 border-t-[2.5px] border-ink-900">
          <div className="bg-lime-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Future Value</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmtINRShort(result.futureValue)}</div>
            <div className="text-xs text-ink-800 mt-2 font-semibold">after {safe.years} year{safe.years === 1 ? '' : 's'} at {safe.rate}%</div>
          </div>
          <div className="bg-cyan-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Total Gains</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmtINRShort(result.totalGains)}</div>
            <div className="text-xs text-ink-800 mt-2 font-semibold">on {fmtINRShort(safe.amount)} invested</div>
          </div>
          <div className="bg-orange-500 border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-white mb-1">In Today's Money</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmtINRShort(result.realValue)}</div>
            <div className="text-xs text-white/90 mt-2 font-semibold">after {safe.inflation}% inflation</div>
          </div>
          <div className="bg-pink-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-white mb-1">Absolute Return</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{result.absoluteReturn.toFixed(1)}%</div>
            <div className="text-xs text-white/90 mt-2 font-semibold">{result.growth.toFixed(2)}× your money</div>
          </div>
        </div>

        <div className="px-5 sm:px-7 pb-5 sm:pb-7 bg-white">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mb-3">Your formula, step by step</div>
          <div className="bg-ink-50 border-2 border-ink-900 rounded-2xl p-4 sm:p-5">
            <div className="font-mono text-xs sm:text-sm font-bold text-ink-900 break-words">
              {fmtINR(safe.amount)} × (1 + {safe.rate}/100)<sup>{safe.years}</sup> = <span className="text-pink-accent">{fmtINR(result.futureValue)}</span>
            </div>
            <p className="text-[11px] sm:text-xs text-ink-600 font-semibold mt-3 !mb-0 leading-relaxed">
              Annual compounding on a single upfront investment. Discounting that back at {safe.inflation}% inflation
              gives <strong>{fmtINR(result.realValue)}</strong> in today's purchasing power. Inflation quietly absorbs {fmtINR(result.inflationCost)} of the headline figure.
            </p>
          </div>

          {yearlyData.length > 0 && (
            <>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mt-6 mb-3">Year-by-year growth</div>
              <div className="bg-ink-50 border-2 border-ink-900 rounded-2xl p-4 overflow-x-auto">
                <div className="flex items-end gap-1 h-48 min-w-fit">
                  {yearlyData.map((d) => {
                    const totalHeight = (d.balance / maxBalance) * 100;
                    const principalHeight = d.balance > 0 ? (d.principal / d.balance) * 100 : 0;
                    return (
                      <div key={d.year} className="relative flex-1 min-w-[14px] group" title={`Year ${d.year}: ${fmtINR(d.balance)}`}>
                        <div className="relative w-full bg-pink-accent border-r border-ink-900 transition-all hover:opacity-80" style={{ height: `${totalHeight}%` }}>
                          <div className="absolute bottom-0 inset-x-0 bg-cyan-accent" style={{ height: `${principalHeight}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between mt-3 text-[10px] font-bold text-ink-600">
                  <span>Year 1</span>
                  <span>Year {safe.years}</span>
                </div>
                <div className="flex items-center gap-4 mt-3 text-[11px] font-bold">
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-cyan-accent border border-ink-900 rounded-sm"></span><span className="text-ink-700">Principal (fixed)</span></div>
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-pink-accent border border-ink-900 rounded-sm"></span><span className="text-ink-700">Gains</span></div>
                </div>
              </div>
            </>
          )}

          <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mt-6 mb-3">
            Same {fmtINRShort(safe.amount)}, same {safe.years} year{safe.years === 1 ? '' : 's'}, different return assumptions
          </div>
          <div className="bg-ink-50 border-2 border-ink-900 rounded-2xl overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-ink-900">
                  <th className="text-left px-4 py-2.5 font-extrabold text-ink-900 text-xs uppercase tracking-wider">Annual return</th>
                  <th className="text-right px-4 py-2.5 font-extrabold text-ink-900 text-xs uppercase tracking-wider">Future value</th>
                  <th className="text-right px-4 py-2.5 font-extrabold text-ink-900 text-xs uppercase tracking-wider hidden xs:table-cell">Gains</th>
                </tr>
              </thead>
              <tbody>
                {scenarios.map((row) => (
                  <tr key={row.rate} className={`border-b border-ink-200 last:border-0 ${Math.abs(row.rate - safe.rate) < 0.01 ? 'bg-lime-accent/40' : ''}`}>
                    <td className="px-4 py-2.5 font-bold text-ink-800">{row.rate}% a year</td>
                    <td className="px-4 py-2.5 text-right font-extrabold text-ink-900">{fmtINR(row.fv)}</td>
                    <td className="px-4 py-2.5 text-right font-bold text-ink-700 hidden xs:table-cell">{fmtINR(row.gains)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] sm:text-xs text-ink-600 font-semibold mt-3 !mb-0 leading-relaxed">
            Two percentage points of return is not a rounding error.
            {zeroYears
              ? ' Set a tenure above zero to see how far apart these assumptions drift.'
              : ` Over ${safe.years} year${safe.years === 1 ? '' : 's'}, the gap between the 10% and 12% rows is ${fmtINR(Math.abs(scenarios[2].fv - scenarios[1].fv))} on the same money.`}
            {' '}Fund selection and expense ratios matter more than they look.
          </p>
        </div>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · Mutual fund returns are not guaranteed · figures are before exit load and capital gains tax</div>
    </div>
  );
}
