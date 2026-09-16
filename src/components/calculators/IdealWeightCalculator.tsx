import { useState, useMemo } from 'react';

type Sex = 'male' | 'female';

// Height in cm; formulas use inches over 5 ft (60 in). Returns kg.
function formulas(sex: Sex, heightCm: number) {
  const inches = heightCm / 2.54;
  const over = Math.max(0, inches - 60);
  const m = sex === 'male';
  return [
    { name: 'Devine (1974)', kg: (m ? 50 : 45.5) + 2.3 * over },
    { name: 'Robinson (1983)', kg: (m ? 52 : 49) + (m ? 1.9 : 1.7) * over },
    { name: 'Miller (1983)', kg: (m ? 56.2 : 53.1) + (m ? 1.41 : 1.36) * over },
    { name: 'Hamwi (1964)', kg: (m ? 48 : 45.5) + (m ? 2.7 : 2.2) * over },
  ];
}

export default function IdealWeightCalculator() {
  const [sex, setSex] = useState<Sex>('male');
  const [height, setHeight] = useState(170);

  const rows = useMemo(() => formulas(sex, height), [sex, height]);
  const bmiRange = useMemo(() => {
    const m = height / 100;
    return { low: 18.5 * m * m, high: 24.9 * m * m };
  }, [height]);
  const avg = useMemo(() => rows.reduce((s, r) => s + r.kg, 0) / rows.length, [rows]);

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        <div className="bg-lime-accent border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3"><span className="text-2xl">🎯</span>
            <h2 className="!text-lg sm:!text-xl !my-0 !text-ink-900 font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>Ideal Weight</h2>
          </div>
          <div className="inline-flex bg-white border-2 border-ink-900 rounded-full p-0.5 text-xs font-bold">
            <button onClick={() => setSex('male')} className={`px-3 py-1 rounded-full transition-all ${sex === 'male' ? 'bg-ink-900 text-white' : 'text-ink-700'}`} type="button">Male</button>
            <button onClick={() => setSex('female')} className={`px-3 py-1 rounded-full transition-all ${sex === 'female' ? 'bg-ink-900 text-white' : 'text-ink-700'}`} type="button">Female</button>
          </div>
        </div>

        <div className="p-5 sm:p-7 bg-ink-50">
          <label htmlFor="iw-h" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Height (cm)</label>
          <input id="iw-h" type="number" min={120} max={220} value={height} onChange={(e) => setHeight(Number(e.target.value) || 0)}
            className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-cyan-accent transition-all mb-2" inputMode="decimal" />
          <input type="range" min={140} max={210} value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full accent-lime-accent" aria-label="Height slider" />
        </div>

        <div className="p-5 sm:p-7 bg-white border-t-[2.5px] border-ink-900">
          <div className="bg-lime-accent border-[2.5px] border-ink-900 rounded-2xl p-5 sm:p-6 shadow-sticker-sm mb-4">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Healthy weight range (BMI 18.5–24.9)</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight', letterSpacing: '-0.03em' }}>{bmiRange.low.toFixed(1)} – {bmiRange.high.toFixed(1)} kg</div>
            <p className="text-sm text-ink-900 font-bold mt-2 !m-0">Formula average: ~{avg.toFixed(1)} kg</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-[2.5px] border-ink-900 rounded-2xl overflow-hidden border-separate border-spacing-0 text-sm">
              <thead><tr className="bg-ink-900 text-white">
                <th className="text-left p-3 font-extrabold">Formula</th>
                <th className="text-right p-3 font-extrabold">Ideal weight</th>
              </tr></thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.name} className={`border-b-2 border-ink-100 ${i % 2 ? 'bg-ink-50' : 'bg-white'}`}>
                    <td className="p-3 font-bold text-ink-900">{r.name}</td>
                    <td className="p-3 text-right font-mono font-extrabold text-ink-900">{r.kg.toFixed(1)} kg</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · "Ideal weight" formulas date from the 1960s–80s and ignore frame size and muscle. The healthy BMI range is a better guide for most people.</div>
    </div>
  );
}
