import { useState, useMemo } from 'react';

function fmtINR(n: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}
function fmtINRShort(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  if (abs >= 10000000) return `${sign}₹${(abs / 10000000).toFixed(2)} Cr`;
  if (abs >= 100000) return `${sign}₹${(abs / 100000).toFixed(2)} L`;
  return `${sign}₹${Math.round(abs).toLocaleString('en-IN')}`;
}
function fmtPct(n: number): string {
  return `${n < 0 ? '-' : ''}${Math.abs(n).toFixed(2)}%`;
}
function fmtNum(n: number, dp = 2): string {
  return n.toLocaleString('en-IN', { minimumFractionDigits: dp, maximumFractionDigits: dp });
}

/** Reference rates used in the "what does X% compound to" table. */
const REFERENCE_RATES = [6, 8, 10, 12, 15];
const REFERENCE_BASE = 100000;
const REFERENCE_YEARS = 10;

export default function CagrCalculator() {
  const [initial, setInitial] = useState<number>(100000);
  const [final, setFinal] = useState<number>(250000);
  const [years, setYears] = useState<number>(5);
  const [months, setMonths] = useState<number>(0);

  const result = useMemo(() => {
    const t = years + months / 12;

    // Explicit guards — every one of these would otherwise produce NaN or Infinity.
    if (!(initial > 0)) {
      return { ok: false as const, t, error: 'Starting value must be greater than zero. CAGR divides by the starting value, so a zero or negative start has no defined growth rate.' };
    }
    if (!(final > 0)) {
      return { ok: false as const, t, error: 'Ending value must be greater than zero. A total wipe-out (or a negative ending value) means the investment lost 100% or more. A compound rate cannot be expressed for it.' };
    }
    if (!(t > 0)) {
      return { ok: false as const, t, error: 'The holding period must be greater than zero. Set at least one year, or one month, before a compound annual rate can be worked out.' };
    }

    const ratio = final / initial;
    const cagr = (Math.pow(ratio, 1 / t) - 1) * 100;
    const absoluteReturn = ((final - initial) / initial) * 100;
    const gain = final - initial;

    // Doubling time only exists for a positive growth rate.
    const growable = cagr > 0;
    const doublingYears = growable ? Math.log(2) / Math.log(1 + cagr / 100) : null;
    const rule72Years = growable ? 72 / cagr : null;

    return { ok: true as const, t, ratio, cagr, absoluteReturn, gain, doublingYears, rule72Years, error: null };
  }, [initial, final, years, months]);

  // Smoothed path at the computed CAGR: what the value "would have" been each
  // year if growth had been perfectly even. It almost never actually was.
  const smoothedRows = useMemo(() => {
    if (!result.ok) return [];
    const rows: Array<{ label: string; t: number; value: number; growth: number }> = [];
    const whole = Math.floor(result.t + 1e-9);
    for (let y = 0; y <= whole; y++) {
      const value = initial * Math.pow(1 + result.cagr / 100, y);
      rows.push({ label: `Year ${y}`, t: y, value, growth: ((value - initial) / initial) * 100 });
    }
    if (result.t - whole > 1e-9) {
      const value = initial * Math.pow(1 + result.cagr / 100, result.t);
      rows.push({ label: `Year ${fmtNum(result.t, 2)}`, t: result.t, value, growth: ((value - initial) / initial) * 100 });
    }
    return rows;
  }, [result, initial]);

  const referenceRows = useMemo(
    () =>
      REFERENCE_RATES.map((rate) => ({
        rate,
        value: REFERENCE_BASE * Math.pow(1 + rate / 100, REFERENCE_YEARS),
      })),
    []
  );

  // Highlight whichever reference rate is closest to the user's own CAGR.
  const nearestRate = result.ok
    ? REFERENCE_RATES.reduce((best, r) => (Math.abs(r - result.cagr) < Math.abs(best - result.cagr) ? r : best), REFERENCE_RATES[0])
    : null;

  const negative = result.ok && result.cagr < 0;

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        <div className="bg-sky-500 border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📊</span>
            <h2 className="!text-lg sm:!text-xl !my-0 !text-white font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>CAGR Calculator</h2>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-50"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            Live
          </span>
        </div>

        <div className="p-5 sm:p-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 bg-ink-50">
          <div>
            <label htmlFor="cagr-initial" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Initial Value</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">₹</span>
              <input id="cagr-initial" type="number" min={0} step={1000} value={initial} onChange={(e) => setInitial(Number(e.target.value) || 0)}
                className="w-full pl-7 pr-3 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-sky-500 transition-all"
                inputMode="numeric" />
            </div>
            <div className="text-[10px] text-ink-500 mt-1.5 font-bold">What you invested on day one</div>
          </div>
          <div>
            <label htmlFor="cagr-final" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Final Value</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">₹</span>
              <input id="cagr-final" type="number" min={0} step={1000} value={final} onChange={(e) => setFinal(Number(e.target.value) || 0)}
                className="w-full pl-7 pr-3 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-cyan-accent transition-all"
                inputMode="numeric" />
            </div>
            <div className="text-[10px] text-ink-500 mt-1.5 font-bold">Value today, or on the exit date</div>
          </div>
          <div>
            <label htmlFor="cagr-years" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Duration (Years)</label>
            <input id="cagr-years" type="number" min={0} max={60} step={1} value={years} onChange={(e) => setYears(Math.max(0, Number(e.target.value) || 0))}
              className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-lime-accent transition-all"
              inputMode="numeric" />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[3, 5, 7, 10, 15].map((y) => (
                <button key={y} type="button" onClick={() => setYears(y)} className={`px-2.5 py-1 rounded-full text-xs font-bold border-2 border-ink-900 transition-all ${years === y ? 'bg-lime-accent text-ink-900 shadow-sticker-sm' : 'bg-white text-ink-700 hover:bg-lime-accent/40'}`}>
                  {y}y
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="cagr-months" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Additional Months</label>
            <input id="cagr-months" type="number" min={0} max={11} step={1} value={months} onChange={(e) => setMonths(Math.min(11, Math.max(0, Number(e.target.value) || 0)))}
              className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-yellow-accent transition-all"
              inputMode="numeric" />
            <div className="text-[10px] text-ink-500 mt-1.5 font-bold">Optional: 0 to 11. Counted as months ÷ 12</div>
          </div>
        </div>

        {!result.ok && (
          <div className="mx-5 sm:mx-7 mb-1 bg-yellow-accent border-[2.5px] border-ink-900 rounded-2xl p-4 shadow-sticker-sm">
            <div className="flex items-start gap-2.5">
              <span className="text-lg leading-none">⚠️</span>
              <p className="text-xs sm:text-sm font-bold text-ink-900 !m-0 leading-snug">{result.error}</p>
            </div>
          </div>
        )}

        {result.ok && negative && (
          <div className="mx-5 sm:mx-7 mb-1 bg-yellow-accent border-[2.5px] border-ink-900 rounded-2xl p-4 shadow-sticker-sm">
            <div className="flex items-start gap-2.5">
              <span className="text-lg leading-none">📉</span>
              <p className="text-xs sm:text-sm font-bold text-ink-900 !m-0 leading-snug">
                Your ending value is below your starting value, so the CAGR is negative, a compound rate of loss. That is a valid, correctly signed result: the money shrank by {fmtPct(Math.abs(result.cagr))} a year, every year, to get from {fmtINR(initial)} to {fmtINR(final)}. Doubling time does not apply to a negative rate.
              </p>
            </div>
          </div>
        )}

        {result.ok && (
          <>
            <div className="p-5 sm:p-7 bg-white grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 border-t-[2.5px] border-ink-900">
              <div className="bg-lime-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">CAGR</div>
                <div className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmtPct(result.cagr)}</div>
                <div className="text-xs text-ink-800 mt-2 font-semibold">per year over {fmtNum(result.t, 2)} years</div>
              </div>
              <div className="bg-cyan-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Absolute Return</div>
                <div className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmtPct(result.absoluteReturn)}</div>
                <div className="text-xs text-ink-800 mt-2 font-semibold">{result.gain >= 0 ? 'gain' : 'loss'} of {fmtINRShort(Math.abs(result.gain))} in total</div>
              </div>
              <div className="bg-pink-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-white mb-1">Doubling Time</div>
                <div className="text-3xl sm:text-4xl font-extrabold text-white leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>
                  {result.doublingYears !== null ? `${fmtNum(result.doublingYears, 2)} yr` : 'n/a'}
                </div>
                <div className="text-xs text-white/90 mt-2 font-semibold">
                  {result.rule72Years !== null ? <>Rule of 72 says {fmtNum(result.rule72Years, 2)} yr (approx.)</> : 'no doubling at a negative rate'}
                </div>
              </div>
            </div>

            <div className="px-5 sm:px-7 pb-5 sm:pb-7 bg-white">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mb-3">Your formula, step by step</div>
              <div className="bg-ink-50 border-2 border-ink-900 rounded-2xl p-4 sm:p-5">
                <div className="font-mono text-xs sm:text-sm font-bold text-ink-900 space-y-2 break-words">
                  <div>CAGR = (Final ÷ Initial)<sup>(1 ÷ t)</sup> − 1</div>
                  <div>= ({fmtINR(final)} ÷ {fmtINR(initial)})<sup>(1 ÷ {fmtNum(result.t, 2)})</sup> − 1</div>
                  <div>= ({fmtNum(result.ratio, 4)})<sup>{fmtNum(1 / result.t, 4)}</sup> − 1</div>
                  <div>= {fmtNum(Math.pow(result.ratio, 1 / result.t), 6)} − 1 = <span className="text-pink-accent">{fmtPct(result.cagr)}</span></div>
                </div>
                <p className="text-[11px] sm:text-xs text-ink-600 font-semibold mt-3 !mb-0 leading-relaxed">
                  t is the holding period in years: {years} year{years === 1 ? '' : 's'}{months > 0 ? ` plus ${months} month${months === 1 ? '' : 's'} (${months} ÷ 12 = ${fmtNum(months / 12, 4)})` : ''} = {fmtNum(result.t, 2)} years.
                  Absolute return is a different sum entirely: ({fmtINR(final)} − {fmtINR(initial)}) ÷ {fmtINR(initial)} = {fmtPct(result.absoluteReturn)}, with no reference to time at all.
                </p>
              </div>

              <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mt-6 mb-3">Smoothed growth at {fmtPct(result.cagr)} a year</div>
              <div className="bg-ink-50 border-2 border-ink-900 rounded-2xl overflow-x-auto overflow-y-auto max-h-[420px]">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-ink-50">
                    <tr className="border-b-2 border-ink-900">
                      <th className="text-left px-4 py-2.5 font-extrabold text-ink-900 text-xs uppercase tracking-wider">Point in time</th>
                      <th className="text-right px-4 py-2.5 font-extrabold text-ink-900 text-xs uppercase tracking-wider">Smoothed value</th>
                      <th className="text-right px-4 py-2.5 font-extrabold text-ink-900 text-xs uppercase tracking-wider">Total growth</th>
                    </tr>
                  </thead>
                  <tbody>
                    {smoothedRows.map((row, i) => (
                      <tr key={row.label} className={`border-b border-ink-200 last:border-0 ${i === smoothedRows.length - 1 ? 'bg-lime-accent/40' : ''}`}>
                        <td className="px-4 py-2.5 font-bold text-ink-800">{row.label}</td>
                        <td className="px-4 py-2.5 text-right font-extrabold text-ink-900">{fmtINR(row.value)}</td>
                        <td className="px-4 py-2.5 text-right font-bold text-ink-700">{fmtPct(row.growth)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] sm:text-xs text-ink-600 font-semibold mt-3 leading-relaxed">
                This is a straight line dressed up as growth. CAGR back-solves the one constant rate that connects your start point to your end point, so the table shows the path your money <em>would</em> have taken had every year been identical. The real path almost certainly was not: a fund that returned +45%, −18%, +30%, −6% and +26% can land on exactly the same {fmtPct(result.cagr)} and feel nothing like this table on the way there.
              </p>

              <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mt-6 mb-3">What each CAGR does to ₹1 lakh over 10 years</div>
              <div className="bg-ink-50 border-2 border-ink-900 rounded-2xl overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-ink-900">
                      <th className="text-left px-4 py-2.5 font-extrabold text-ink-900 text-xs uppercase tracking-wider">CAGR</th>
                      <th className="text-right px-4 py-2.5 font-extrabold text-ink-900 text-xs uppercase tracking-wider">₹1 lakh becomes</th>
                      <th className="text-right px-4 py-2.5 font-extrabold text-ink-900 text-xs uppercase tracking-wider">Multiple</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referenceRows.map((row) => (
                      <tr key={row.rate} className={`border-b border-ink-200 last:border-0 ${row.rate === nearestRate ? 'bg-cyan-accent/30' : ''}`}>
                        <td className="px-4 py-2.5 font-bold text-ink-800">{row.rate}%</td>
                        <td className="px-4 py-2.5 text-right font-extrabold text-ink-900">{fmtINR(row.value)}</td>
                        <td className="px-4 py-2.5 text-right font-bold text-ink-700">{fmtNum(row.value / REFERENCE_BASE, 2)}×</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] sm:text-xs text-ink-600 font-semibold mt-3 !mb-0 leading-relaxed">
                Six percentage points separate the first row from the last, yet after ten years the gap is more than {fmtINRShort(referenceRows[referenceRows.length - 1].value - referenceRows[0].value)}. That is why a couple of points of expense ratio or a few years of delay matter far more than they look on a single-year view.
              </p>
            </div>
          </>
        )}
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · CAGR is a smoothed rate. It says nothing about the volatility or drawdowns along the way</div>
    </div>
  );
}
