import { useState, useMemo } from 'react';

// University conversion formulas students actually search for.
export type FormulaKey = 'cbse' | 'vtu' | 'anna' | 'mu' | 'gtu' | 'makaut' | 'custom';
const FORMULAS: Record<FormulaKey, { label: string; toPct: (c: number) => number; toCgpa: (p: number) => number; note: string }> = {
  cbse:   { label: 'CBSE / Generic (×9.5)', toPct: (c) => c * 9.5, toCgpa: (p) => p / 9.5, note: 'CBSE and most 10-point universities: Percentage = CGPA × 9.5' },
  vtu:    { label: 'VTU ((CGPA−0.75)×10)', toPct: (c) => (c - 0.75) * 10, toCgpa: (p) => p / 10 + 0.75, note: 'Visvesvaraya Technological University: % = (CGPA − 0.75) × 10' },
  anna:   { label: 'Anna University ((CGPA−0.5)×10)', toPct: (c) => (c - 0.5) * 10, toCgpa: (p) => p / 10 + 0.5, note: 'Anna University: % = (CGPA − 0.5) × 10' },
  mu:     { label: 'Mumbai University (7.1×CGPA+11)', toPct: (c) => 7.1 * c + 11, toCgpa: (p) => (p - 11) / 7.1, note: 'University of Mumbai (7-point average formula): % = 7.1 × CGPA + 11' },
  gtu:    { label: 'GTU ((CGPA−0.5)×10)', toPct: (c) => (c - 0.5) * 10, toCgpa: (p) => p / 10 + 0.5, note: 'Gujarat Technological University: % = (CGPA − 0.5) × 10' },
  makaut: { label: 'MAKAUT / WBUT ((CGPA−0.75)×10)', toPct: (c) => (c - 0.75) * 10, toCgpa: (p) => p / 10 + 0.75, note: 'MAKAUT (formerly WBUT): % = (CGPA − 0.75) × 10' },
  custom: { label: 'Custom multiplier', toPct: (c) => c * 9.5, toCgpa: (p) => p / 9.5, note: 'Set your own multiplier if your university uses a different factor.' },
};

interface CgpaCalculatorProps {
  initialFormula?: FormulaKey;
  initialMode?: 'toPct' | 'toCgpa';
}

export default function CgpaCalculator({ initialFormula = 'cbse', initialMode = 'toPct' }: CgpaCalculatorProps) {
  const [mode, setMode] = useState<'toPct' | 'toCgpa'>(initialMode);
  const [formula, setFormula] = useState<FormulaKey>(initialFormula);
  const [cgpa, setCgpa] = useState<number>(8.5);
  const [pct, setPct] = useState<number>(80);
  const [mult, setMult] = useState<number>(9.5);

  const f = FORMULAS[formula];
  const result = useMemo(() => {
    if (formula === 'custom') {
      return mode === 'toPct' ? cgpa * mult : pct / mult;
    }
    return mode === 'toPct' ? f.toPct(cgpa) : f.toCgpa(pct);
  }, [mode, formula, cgpa, pct, mult, f]);

  const clamped = Math.max(0, mode === 'toPct' ? Math.min(100, result) : Math.min(10, result));

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        <div className="bg-violet-300 border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-2xl flex-shrink-0">🎓</span>
            <h2 className="!text-lg sm:!text-xl !my-0 !text-ink-900 font-extrabold truncate" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>CGPA ↔ Percentage</h2>
          </div>
        </div>

        {/* Mode toggle */}
        <div className="p-5 sm:p-7 bg-ink-50">
          <div className="grid grid-cols-2 gap-2 mb-5">
            {([['toPct', 'CGPA → Percentage'], ['toCgpa', 'Percentage → CGPA']] as const).map(([m, label]) => (
              <button key={m} type="button" onClick={() => setMode(m)}
                className={`py-2.5 px-2 rounded-xl border-2 border-ink-900 text-sm font-extrabold transition-all ${mode === m ? 'bg-ink-900 text-white shadow-sticker-sm -translate-y-0.5' : 'bg-white text-ink-700 hover:bg-violet-300'}`}>
                {label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">University formula</label>
              <select value={formula} onChange={(e) => setFormula(e.target.value as FormulaKey)}
                className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-violet-300 transition-all">
                {Object.entries(FORMULAS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            {mode === 'toPct' ? (
              <div>
                <label htmlFor="cg-cgpa" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Your CGPA (out of 10)</label>
                <input id="cg-cgpa" type="number" min={0} max={10} step={0.01} value={cgpa} onChange={(e) => setCgpa(Math.min(10, Number(e.target.value) || 0))}
                  className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-lime-accent transition-all" inputMode="decimal" />
                <input type="range" min={0} max={10} step={0.1} value={cgpa} onChange={(e) => setCgpa(Number(e.target.value))} className="w-full mt-2 accent-violet-300" aria-label="CGPA slider" />
              </div>
            ) : (
              <div>
                <label htmlFor="cg-pct" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Your Percentage</label>
                <div className="relative">
                  <input id="cg-pct" type="number" min={0} max={100} step={0.1} value={pct} onChange={(e) => setPct(Math.min(100, Number(e.target.value) || 0))}
                    className="w-full pl-3.5 pr-8 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-lime-accent transition-all" inputMode="decimal" />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">%</span>
                </div>
                <input type="range" min={0} max={100} step={1} value={pct} onChange={(e) => setPct(Number(e.target.value))} className="w-full mt-2 accent-violet-300" aria-label="Percentage slider" />
              </div>
            )}
          </div>

          {formula === 'custom' && (
            <div className="mt-4 max-w-xs">
              <label htmlFor="cg-mult" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Custom multiplier</label>
              <input id="cg-mult" type="number" min={1} max={20} step={0.1} value={mult} onChange={(e) => setMult(Number(e.target.value) || 9.5)}
                className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-cyan-accent transition-all" inputMode="decimal" />
            </div>
          )}
        </div>

        {/* Result */}
        <div className="p-5 sm:p-7 bg-white border-t-[2.5px] border-ink-900">
          <div className="bg-violet-300 border-[2.5px] border-ink-900 rounded-2xl p-5 sm:p-6 shadow-sticker-sm">
            <div className="text-xs font-extrabold uppercase tracking-wider text-ink-900 mb-2">
              {mode === 'toPct' ? `CGPA ${cgpa} = ` : `${pct}% = `}
            </div>
            <div className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight', letterSpacing: '-0.04em' }}>
              {clamped.toFixed(2)}{mode === 'toPct' ? '%' : ' CGPA'}
            </div>
            <div className="text-xs text-ink-800 mt-3 font-semibold">{formula === 'custom' ? `Using ×${mult}` : f.note}</div>
          </div>
        </div>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · Formulas vary by university. Pick yours above or set a custom multiplier. Check your official grade card for the exact conversion.</div>
    </div>
  );
}
