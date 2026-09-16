import { useState, useMemo } from 'react';

function fmtINR(n: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}
function fmtINRShort(value: number): string {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
  return `₹${Math.round(value).toLocaleString('en-IN')}`;
}
function clamp(n: number, lo: number, hi: number): number {
  if (!Number.isFinite(n)) return lo;
  return Math.min(hi, Math.max(lo, n));
}

/**
 * Official Atal Pension Yojana monthly contribution chart.
 * Key = entry age (18 to 40). Value = monthly contribution in ₹ for the
 * five guaranteed pension levels [1000, 2000, 3000, 4000, 5000].
 * These are fixed government-notified figures, NOT computed by a returns
 * formula. APY is a defined-benefit scheme: the contribution is a lookup.
 */
const APY_CHART: Record<number, [number, number, number, number, number]> = {
  18: [42, 84, 126, 168, 210],
  19: [46, 92, 138, 183, 228],
  20: [50, 100, 150, 198, 248],
  21: [54, 108, 162, 215, 269],
  22: [59, 117, 177, 234, 292],
  23: [64, 127, 192, 254, 318],
  24: [70, 139, 208, 277, 346],
  25: [76, 151, 226, 301, 376],
  26: [82, 164, 246, 327, 409],
  27: [90, 178, 268, 356, 446],
  28: [97, 194, 292, 388, 485],
  29: [106, 212, 318, 423, 529],
  30: [116, 231, 347, 462, 577],
  31: [126, 252, 379, 504, 630],
  32: [138, 276, 414, 551, 689],
  33: [151, 302, 453, 602, 752],
  34: [165, 330, 495, 659, 824],
  35: [181, 362, 543, 722, 902],
  36: [198, 396, 594, 792, 990],
  37: [218, 436, 654, 870, 1087],
  38: [240, 480, 720, 957, 1196],
  39: [264, 528, 792, 1054, 1318],
  40: [291, 582, 873, 1164, 1454],
};

const AGES: number[] = Array.from({ length: 23 }, (_, i) => 18 + i); // 18..40
const PENSION_LEVELS = [1000, 2000, 3000, 4000, 5000] as const;

/** Indicative corpus returned to the nominee after both subscriber and spouse, by pension level. */
const CORPUS: Record<number, number> = {
  1000: 170000,
  2000: 340000,
  3000: 510000,
  4000: 680000,
  5000: 850000,
};

const FREQUENCIES = [
  { id: 'monthly', label: 'Monthly', mult: 1, cycles: 12, per: 'a month' },
  { id: 'quarterly', label: 'Quarterly', mult: 3, cycles: 4, per: 'a quarter' },
  { id: 'half', label: 'Half-yearly', mult: 6, cycles: 2, per: 'every 6 months' },
] as const;

const MIN_AGE = 18;
const MAX_AGE = 40;
const PENSION_START_AGE = 60;

export default function ApyCalculator() {
  const [entryAge, setEntryAge] = useState<number>(25);
  const [pension, setPension] = useState<number>(5000);
  const [frequency, setFrequency] = useState<string>('monthly');

  const rawAge = entryAge;
  const ageOutOfRange = !Number.isFinite(rawAge) || rawAge < MIN_AGE || rawAge > MAX_AGE;
  const lookupAge = clamp(Math.round(Number.isFinite(rawAge) ? rawAge : 25), MIN_AGE, MAX_AGE);
  const pensionIndex = PENSION_LEVELS.indexOf(pension as (typeof PENSION_LEVELS)[number]);
  const freq = FREQUENCIES.find((f) => f.id === frequency) ?? FREQUENCIES[0];

  const result = useMemo(() => {
    const monthly = APY_CHART[lookupAge][pensionIndex >= 0 ? pensionIndex : 4];
    const perCycle = monthly * freq.mult;
    const years = PENSION_START_AGE - lookupAge;
    const totalContributed = monthly * 12 * years;
    const corpus = CORPUS[pension] ?? CORPUS[5000];
    const totalCycles = freq.cycles * years;
    return { monthly, perCycle, years, totalContributed, corpus, totalCycles };
  }, [lookupAge, pensionIndex, pension, freq]);

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        <div className="bg-pink-accent border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🇮🇳</span>
            <h2 className="!text-lg sm:!text-xl !my-0 !text-white font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>Atal Pension Yojana Calculator</h2>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-50"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            Live
          </span>
        </div>

        {/* Inputs */}
        <div className="p-5 sm:p-7 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 bg-ink-50">
          <div>
            <label htmlFor="apy-age" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Your Age Today</label>
            <input id="apy-age" type="number" min={MIN_AGE} max={MAX_AGE} step={1} value={Number.isFinite(entryAge) ? entryAge : ''} onChange={(e) => setEntryAge(e.target.value === '' ? NaN : Number(e.target.value))}
              className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-pink-accent/40 transition-all"
              inputMode="numeric" />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[18, 25, 30, 35, 40].map((a) => (
                <button key={a} type="button" onClick={() => setEntryAge(a)} className={`px-2.5 py-1 rounded-full text-xs font-bold border-2 border-ink-900 transition-all ${lookupAge === a && !ageOutOfRange ? 'bg-pink-accent text-white shadow-sticker-sm' : 'bg-white text-ink-700 hover:bg-pink-accent/20'}`}>
                  {a}y
                </button>
              ))}
            </div>
            <div className="text-[10px] text-ink-500 mt-1.5 font-bold">Entry age must be 18 to 40 · you pay in until 60</div>
          </div>
          <div>
            <label htmlFor="apy-pension" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Guaranteed Monthly Pension</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none z-10">₹</span>
              <select id="apy-pension" value={pension} onChange={(e) => setPension(Number(e.target.value))}
                className="w-full pl-7 pr-8 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-cyan-accent appearance-none transition-all">
                {PENSION_LEVELS.map((p) => (
                  <option key={p} value={p}>{p.toLocaleString('en-IN')} per month</option>
                ))}
              </select>
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-500 pointer-events-none">▾</span>
            </div>
            <div className="text-[10px] text-ink-500 mt-1.5 font-bold">Fixed for life from 60 · then to your spouse</div>
          </div>
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Contribution Frequency</label>
            <div className="flex flex-wrap gap-1.5">
              {FREQUENCIES.map((f) => (
                <button key={f.id} type="button" onClick={() => setFrequency(f.id)} className={`px-3 py-2 rounded-xl text-xs font-bold border-2 border-ink-900 transition-all ${frequency === f.id ? 'bg-cyan-accent text-ink-900 shadow-sticker-sm' : 'bg-white text-ink-700 hover:bg-cyan-accent/30'}`}>
                  {f.label}
                </button>
              ))}
            </div>
            <div className="text-[10px] text-ink-500 mt-1.5 font-bold">Monthly × 1 · quarterly × 3 · half-yearly × 6</div>
          </div>
        </div>

        {ageOutOfRange && (
          <div className="px-5 sm:px-7 pt-5 bg-white">
            <div className="bg-yellow-accent border-[2.5px] border-ink-900 rounded-2xl p-4 shadow-sticker-sm flex items-start gap-3">
              <span className="text-xl leading-none">⚠️</span>
              <p className="text-sm font-bold text-ink-900 !m-0 leading-snug">
                APY only accepts new subscribers aged <strong>18 to 40</strong>. The figures below use the nearest valid entry age of <strong>{lookupAge}</strong>. Enter an age from 18 to 40 for an exact lookup.
              </p>
            </div>
          </div>
        )}

        {/* Headline results */}
        <div className="p-5 sm:p-7 bg-white grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 border-t-[2.5px] border-ink-900">
          <div className="bg-pink-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-white mb-1">You Pay {freq.label}</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmtINR(result.perCycle)}</div>
            <div className="text-xs text-white/90 mt-2 font-semibold">{fmtINR(result.monthly)}/month{freq.mult > 1 ? ` × ${freq.mult}` : ''} · from the chart</div>
          </div>
          <div className="bg-lime-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Guaranteed Pension</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmtINR(pension)}</div>
            <div className="text-xs text-ink-800 mt-2 font-semibold">every month from age 60, for life</div>
          </div>
          <div className="bg-cyan-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Corpus To Nominee</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmtINRShort(result.corpus)}</div>
            <div className="text-xs text-ink-800 mt-2 font-semibold">{fmtINR(result.corpus)} after you and your spouse</div>
          </div>
        </div>

        {/* Secondary results */}
        <div className="px-5 sm:px-7 pb-5 sm:pb-7 bg-white grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-ink-50 border-2 border-ink-900 rounded-2xl p-5">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mb-1">Years You Contribute</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.03em' }}>{result.years} years</div>
            <div className="text-xs text-ink-600 mt-2 font-semibold">age {lookupAge} to 60 · {result.totalCycles} {freq.label.toLowerCase()} payments</div>
          </div>
          <div className="bg-ink-50 border-2 border-ink-900 rounded-2xl p-5">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mb-1">Total You Will Contribute</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.03em' }}>{fmtINR(result.totalContributed)}</div>
            <div className="text-xs text-ink-600 mt-2 font-semibold">{fmtINR(result.monthly)} × 12 × {result.years} years</div>
          </div>
        </div>

        {/* Plain-language summary */}
        <div className="px-5 sm:px-7 pb-5 sm:pb-7 bg-white">
          <div className="bg-yellow-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="flex items-start gap-3">
              <span className="text-xl leading-none">🧾</span>
              <p className="text-sm font-bold text-ink-900 !m-0 leading-snug">
                Starting at age <strong>{lookupAge}</strong>, you pay <strong>{fmtINR(result.perCycle)}</strong> {freq.per} until 60. That is <strong>{fmtINR(result.totalContributed)}</strong> put in over <strong>{result.years} years</strong>. In return the government guarantees <strong>{fmtINR(pension)} a month for life</strong> from age 60, the same pension to your spouse afterwards, and <strong>{fmtINR(result.corpus)}</strong> back to your nominee at the end. The contribution is fixed, not a market projection.
              </p>
            </div>
          </div>
        </div>

        {/* Full official contribution chart with the user's cell highlighted */}
        <div className="px-5 sm:px-7 pb-5 sm:pb-7 bg-white">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mb-3">Official APY monthly contribution chart (₹ per month)</div>
          <div className="bg-ink-50 border-2 border-ink-900 rounded-2xl overflow-x-auto max-h-[28rem] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-ink-50 z-10">
                <tr className="border-b-2 border-ink-900">
                  <th className="text-left px-3 sm:px-4 py-2.5 font-extrabold text-ink-900 text-xs uppercase tracking-wider whitespace-nowrap">Entry age</th>
                  {PENSION_LEVELS.map((p, ci) => (
                    <th key={p} className={`text-right px-3 sm:px-4 py-2.5 font-extrabold text-xs uppercase tracking-wider whitespace-nowrap ${ci === pensionIndex ? 'bg-cyan-accent text-ink-900' : 'text-ink-900'}`}>
                      ₹{p.toLocaleString('en-IN')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {AGES.map((a) => {
                  const isRow = a === lookupAge && !ageOutOfRange;
                  return (
                    <tr key={a} className={`border-b border-ink-200 last:border-0 ${isRow ? 'bg-pink-accent/10' : ''}`}>
                      <td className={`px-3 sm:px-4 py-2 font-bold whitespace-nowrap ${isRow ? 'text-ink-900' : 'text-ink-700'}`}>{a}</td>
                      {APY_CHART[a].map((c, ci) => {
                        const isCell = isRow && ci === pensionIndex;
                        const isCol = ci === pensionIndex;
                        return (
                          <td key={ci} className={`px-3 sm:px-4 py-2 text-right whitespace-nowrap ${isCell ? 'bg-lime-accent font-extrabold text-ink-900 rounded' : isCol ? 'bg-cyan-accent/15 font-bold text-ink-900' : isRow ? 'font-bold text-ink-900' : 'font-semibold text-ink-700'}`}>
                            {c.toLocaleString('en-IN')}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-3 text-[11px] font-bold">
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-lime-accent border border-ink-900 rounded-sm"></span><span className="text-ink-700">Your contribution (age {lookupAge}, {fmtINR(pension)} pension)</span></div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-cyan-accent border border-ink-900 rounded-sm"></span><span className="text-ink-700">Your chosen pension column</span></div>
          </div>
          <p className="text-[11px] sm:text-xs text-ink-600 font-semibold mt-3 !mb-0 leading-relaxed">
            Figures are the government-notified monthly contribution. For quarterly billing multiply by 3, for half-yearly multiply by 6. The chart is fixed by scheme rules, so it does not change with markets or the calendar quarter.
          </p>
        </div>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · Atal Pension Yojana (PFRDA) · defined-benefit pension, contribution read from the official government chart, guaranteed by the Government of India</div>
    </div>
  );
}
