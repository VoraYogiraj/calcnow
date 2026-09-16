import { useState, useMemo } from 'react';

type Climate = 'temperate' | 'warm' | 'hot';
const CLIMATE_BUMP: Record<Climate, number> = { temperate: 0, warm: 0.4, hot: 0.8 };

export default function WaterIntakeCalculator() {
  const [weight, setWeight] = useState(70);
  const [exercise, setExercise] = useState(30); // minutes/day
  const [climate, setClimate] = useState<Climate>('temperate');

  const litres = useMemo(() => {
    const base = weight * 0.033;                 // ~33 ml per kg
    const activity = (exercise / 30) * 0.35;     // ~350 ml per 30 min
    return Math.max(0, base + activity + CLIMATE_BUMP[climate]);
  }, [weight, exercise, climate]);

  const glasses = Math.round(litres / 0.25);     // 250 ml glass
  const cups = Math.round(litres / 0.24);        // 240 ml US cup
  const oz = Math.round(litres * 33.814);

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        <div className="bg-cyan-accent border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center gap-3">
          <span className="text-2xl flex-shrink-0">💧</span>
          <h2 className="!text-lg sm:!text-xl !my-0 !text-ink-900 font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>Daily Water Intake</h2>
        </div>

        <div className="p-5 sm:p-7 bg-ink-50 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="wi-w" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Body weight (kg)</label>
            <input id="wi-w" type="number" min={20} max={200} value={weight} onChange={(e) => setWeight(Number(e.target.value) || 0)}
              className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-cyan-accent transition-all" inputMode="decimal" />
          </div>
          <div>
            <label htmlFor="wi-e" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Exercise (min/day)</label>
            <input id="wi-e" type="number" min={0} max={300} value={exercise} onChange={(e) => setExercise(Number(e.target.value) || 0)}
              className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-lime-accent transition-all" inputMode="numeric" />
          </div>
          <div>
            <label htmlFor="wi-c" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Climate</label>
            <select id="wi-c" value={climate} onChange={(e) => setClimate(e.target.value as Climate)}
              className="w-full px-3 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-yellow-accent transition-all">
              <option value="temperate">Temperate</option>
              <option value="warm">Warm</option>
              <option value="hot">Hot / humid</option>
            </select>
          </div>
        </div>

        <div className="p-5 sm:p-7 bg-white border-t-[2.5px] border-ink-900">
          <div className="bg-cyan-accent border-[2.5px] border-ink-900 rounded-2xl p-5 sm:p-6 shadow-sticker-sm grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Recommended</div>
              <div className="text-5xl sm:text-6xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight', letterSpacing: '-0.04em' }}>{litres.toFixed(1)}<span className="text-2xl"> L</span></div>
            </div>
            <div className="sm:col-span-2 grid grid-cols-3 gap-3 text-center">
              <div className="bg-white/70 border-2 border-ink-900 rounded-xl p-2"><div className="text-2xl font-extrabold text-ink-900">{glasses}</div><div className="text-[10px] font-bold text-ink-700 uppercase">glasses<br/>(250 ml)</div></div>
              <div className="bg-white/70 border-2 border-ink-900 rounded-xl p-2"><div className="text-2xl font-extrabold text-ink-900">{cups}</div><div className="text-[10px] font-bold text-ink-700 uppercase">cups<br/>(240 ml)</div></div>
              <div className="bg-white/70 border-2 border-ink-900 rounded-xl p-2"><div className="text-2xl font-extrabold text-ink-900">{oz}</div><div className="text-[10px] font-bold text-ink-700 uppercase">fl oz</div></div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · Estimate from body weight (~33 ml/kg) plus activity and climate. Food gives ~20% of your fluid too. Drink to thirst; ask a doctor if you have kidney or heart conditions.</div>
    </div>
  );
}
