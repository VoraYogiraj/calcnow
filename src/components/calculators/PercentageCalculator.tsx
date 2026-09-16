import { useState, useMemo } from 'react';

type Mode = 'of' | 'is-percent-of' | 'change';

function fmtNum(n: number): string {
  if (!isFinite(n)) return '—';
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 4 }).format(n);
}

export default function PercentageCalculator() {
  const [mode, setMode] = useState<Mode>('of');

  // Mode 1: X% of Y
  const [pct, setPct] = useState<number>(15);
  const [base, setBase] = useState<number>(200);

  // Mode 2: X is what % of Y
  const [part, setPart] = useState<number>(30);
  const [whole, setWhole] = useState<number>(120);

  // Mode 3: % change from X to Y
  const [from, setFrom] = useState<number>(100);
  const [to, setTo] = useState<number>(150);

  const result = useMemo(() => {
    if (mode === 'of') {
      return { value: (pct / 100) * base, label: `${pct}% of ${fmtNum(base)}` };
    }
    if (mode === 'is-percent-of') {
      const v = whole === 0 ? NaN : (part / whole) * 100;
      return { value: v, label: `${fmtNum(part)} is what % of ${fmtNum(whole)}`, suffix: '%' };
    }
    // change
    const v = from === 0 ? NaN : ((to - from) / Math.abs(from)) * 100;
    return { value: v, label: `% change from ${fmtNum(from)} to ${fmtNum(to)}`, suffix: '%' };
  }, [mode, pct, base, part, whole, from, to]);

  const modeColors: Record<Mode, { bg: string; ring: string; text: string }> = {
    of: { bg: 'bg-lime-accent', ring: 'focus:ring-lime-accent', text: 'text-ink-900' },
    'is-percent-of': { bg: 'bg-pink-accent', ring: 'focus:ring-pink-accent', text: 'text-white' },
    change: { bg: 'bg-cyan-accent', ring: 'focus:ring-cyan-accent', text: 'text-ink-900' },
  };
  const c = modeColors[mode];

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        <div className="bg-violet-300 border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center gap-3">
          <span className="text-2xl">％</span>
          <h2 className="!text-lg sm:!text-xl !my-0 !text-ink-900 font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>Percentage Calculator</h2>
        </div>

        {/* Mode tabs */}
        <div className="px-3 sm:px-5 pt-5 bg-ink-50">
          <div className="grid grid-cols-3 gap-2">
            {([
              { value: 'of' as Mode, label: 'X% of Y', short: 'of' },
              { value: 'is-percent-of' as Mode, label: 'X is % of Y', short: 'is %' },
              { value: 'change' as Mode, label: '% Change', short: 'Δ%' },
            ]).map((m) => (
              <button
                key={m.value} type="button" onClick={() => setMode(m.value)}
                className={`py-3 rounded-xl border-2 border-ink-900 text-sm font-extrabold transition-all ${
                  mode === m.value
                    ? 'bg-ink-900 text-white shadow-sticker-sm -translate-y-0.5'
                    : 'bg-white text-ink-700 hover:bg-violet-300 hover:text-ink-900'
                }`}
                style={{ fontFamily: 'Inter Tight, Inter, sans-serif' }}
              >
                <span className="hidden sm:inline">{m.label}</span>
                <span className="sm:hidden">{m.short}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Inputs (mode-dependent) */}
        <div className="p-5 sm:p-7 bg-ink-50">
          {mode === 'of' && (
            <div className="flex flex-wrap items-end gap-3 text-base sm:text-lg font-extrabold text-ink-900" style={{ fontFamily: 'Inter Tight, Inter, sans-serif' }}>
              <span className="text-2xl sm:text-3xl">What is</span>
              <div className="relative">
                <input type="number" value={pct} onChange={(e) => setPct(Number(e.target.value) || 0)}
                  className={`w-24 sm:w-28 pr-7 pl-3 py-2 bg-white border-[2.5px] border-ink-900 rounded-xl text-2xl sm:text-3xl font-extrabold focus:outline-none focus:ring-4 ${c.ring} transition-all text-center`}
                  inputMode="decimal" aria-label="Percentage" />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-500">%</span>
              </div>
              <span className="text-2xl sm:text-3xl">of</span>
              <input type="number" value={base} onChange={(e) => setBase(Number(e.target.value) || 0)}
                className={`w-32 sm:w-36 px-3 py-2 bg-white border-[2.5px] border-ink-900 rounded-xl text-2xl sm:text-3xl font-extrabold focus:outline-none focus:ring-4 ${c.ring} transition-all text-center`}
                inputMode="decimal" aria-label="Base number" />
              <span className="text-2xl sm:text-3xl">?</span>
            </div>
          )}
          {mode === 'is-percent-of' && (
            <div className="flex flex-wrap items-end gap-3 text-base sm:text-lg font-extrabold text-ink-900" style={{ fontFamily: 'Inter Tight, Inter, sans-serif' }}>
              <input type="number" value={part} onChange={(e) => setPart(Number(e.target.value) || 0)}
                className={`w-24 sm:w-32 px-3 py-2 bg-white border-[2.5px] border-ink-900 rounded-xl text-2xl sm:text-3xl font-extrabold focus:outline-none focus:ring-4 ${c.ring} transition-all text-center`}
                inputMode="decimal" aria-label="Part" />
              <span className="text-2xl sm:text-3xl">is what % of</span>
              <input type="number" value={whole} onChange={(e) => setWhole(Number(e.target.value) || 0)}
                className={`w-24 sm:w-32 px-3 py-2 bg-white border-[2.5px] border-ink-900 rounded-xl text-2xl sm:text-3xl font-extrabold focus:outline-none focus:ring-4 ${c.ring} transition-all text-center`}
                inputMode="decimal" aria-label="Whole" />
              <span className="text-2xl sm:text-3xl">?</span>
            </div>
          )}
          {mode === 'change' && (
            <div className="flex flex-wrap items-end gap-3 text-base sm:text-lg font-extrabold text-ink-900" style={{ fontFamily: 'Inter Tight, Inter, sans-serif' }}>
              <span className="text-2xl sm:text-3xl">From</span>
              <input type="number" value={from} onChange={(e) => setFrom(Number(e.target.value) || 0)}
                className={`w-24 sm:w-32 px-3 py-2 bg-white border-[2.5px] border-ink-900 rounded-xl text-2xl sm:text-3xl font-extrabold focus:outline-none focus:ring-4 ${c.ring} transition-all text-center`}
                inputMode="decimal" aria-label="From" />
              <span className="text-2xl sm:text-3xl">to</span>
              <input type="number" value={to} onChange={(e) => setTo(Number(e.target.value) || 0)}
                className={`w-24 sm:w-32 px-3 py-2 bg-white border-[2.5px] border-ink-900 rounded-xl text-2xl sm:text-3xl font-extrabold focus:outline-none focus:ring-4 ${c.ring} transition-all text-center`}
                inputMode="decimal" aria-label="To" />
              <span className="text-2xl sm:text-3xl">?</span>
            </div>
          )}
        </div>

        {/* Result */}
        <div className="p-5 sm:p-7 bg-white border-t-[2.5px] border-ink-900">
          <div className={`${c.bg} border-[2.5px] border-ink-900 rounded-2xl p-6 md:p-8 shadow-sticker-sm`}>
            <div className={`text-[10px] font-extrabold uppercase tracking-wider ${c.text} mb-2`}>{result.label}</div>
            <div className={`text-5xl sm:text-6xl md:text-7xl font-extrabold ${c.text} leading-none`} style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.05em' }}>
              {fmtNum(result.value)}{(result as any).suffix || ''}
            </div>
            {mode === 'change' && isFinite(result.value) && (
              <div className={`mt-3 text-sm font-bold ${c.text}`}>
                {result.value > 0 ? '↑ Increase' : result.value < 0 ? '↓ Decrease' : 'No change'}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · Three percentage modes in one tool</div>
    </div>
  );
}
