import { useState, useMemo } from 'react';

export default function CarDepreciationCalculator() {
  const [price, setPrice] = useState(30000);
  const [rate, setRate] = useState(15);   // % annual depreciation
  const [years, setYears] = useState(5);  // years to hold

  const r = useMemo(() => {
    const factor = 1 - rate / 100;
    const rows = [];
    for (let y = 0; y <= years; y++) {
      const value = price * Math.pow(factor, y);
      rows.push({ year: y, value, pct: Math.pow(factor, y) * 100, cumDep: price - value });
    }
    const finalValue = price * Math.pow(factor, years);
    const totalDep = price - finalValue;
    const pctLost = (1 - Math.pow(factor, years)) * 100;
    return { rows, finalValue, totalDep, pctLost };
  }, [price, rate, years]);

  const fmt = (n: number) => Math.round(n).toLocaleString();

  const field = (id: string, label: string, val: number, set: (n: number) => void, ring: string, step = 1) => (
    <div>
      <label htmlFor={id} className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">{label}</label>
      <input id={id} type="number" min={0} step={step} value={val} onChange={(e) => set(Math.max(0, Number(e.target.value) || 0))}
        className={`w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 ${ring} transition-all`} inputMode="decimal" />
    </div>
  );

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        <div className="bg-yellow-accent border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3"><span className="text-2xl">🚗</span>
            <h2 className="!text-lg sm:!text-xl !my-0 !text-ink-900 font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>Car Depreciation Calculator</h2>
          </div>
          <span className="hidden sm:inline-flex text-[10px] font-extrabold uppercase tracking-wider text-ink-900 bg-white border-2 border-ink-900 rounded-full px-3 py-1">✨ Live</span>
        </div>

        <div className="p-5 sm:p-7 bg-ink-50 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {field('cd-price', 'Purchase price', price, setPrice, 'focus:ring-cyan-accent', 500)}
          {field('cd-rate', 'Annual depreciation (%)', rate, setRate, 'focus:ring-lime-accent', 0.5)}
          {field('cd-years', 'Years to hold', years, setYears, 'focus:ring-violet-300', 1)}
        </div>

        <div className="p-5 sm:p-7 bg-white border-t-[2.5px] border-ink-900">
          <div className="bg-lime-accent border-[2.5px] border-ink-900 rounded-2xl p-5 sm:p-6 shadow-sticker-sm grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Value after {years} {years === 1 ? 'year' : 'years'}</div>
              <div className="text-4xl sm:text-5xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight', letterSpacing: '-0.04em' }}>{fmt(r.finalValue)}</div>
              <div className="text-sm text-ink-900 font-bold mt-1">in your currency</div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-white/70 border-2 border-ink-900 rounded-xl p-2"><div className="text-xl font-extrabold text-ink-900">{fmt(r.totalDep)}</div><div className="text-[10px] font-bold text-ink-700 uppercase">Total lost</div></div>
              <div className="bg-white/70 border-2 border-ink-900 rounded-xl p-2"><div className="text-xl font-extrabold text-ink-900">{r.pctLost.toFixed(1)}%</div><div className="text-[10px] font-bold text-ink-700 uppercase">Value lost</div></div>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full border-[2.5px] border-ink-900 rounded-2xl border-separate border-spacing-0 overflow-hidden text-sm">
              <thead><tr className="bg-ink-900 text-white">
                <th className="text-left p-2.5 font-extrabold">Year</th>
                <th className="text-right p-2.5 font-extrabold">Value</th>
                <th className="text-right p-2.5 font-extrabold">% of original</th>
              </tr></thead>
              <tbody>
                {r.rows.map((row, i) => (
                  <tr key={row.year} className={i % 2 ? 'bg-ink-50' : 'bg-white'}>
                    <td className="p-2.5 font-extrabold text-ink-900">{row.year}</td>
                    <td className="p-2.5 text-right font-mono font-bold text-ink-900">{fmt(row.value)}</td>
                    <td className="p-2.5 text-right font-mono font-bold text-ink-900">{row.pct.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · Real-world depreciation is steepest in year one (often ~20%) then slows; luxury and EV curves differ. This uses a constant annual rate as an estimate.</div>
    </div>
  );
}
