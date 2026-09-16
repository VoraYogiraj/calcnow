import { useState, useMemo } from 'react';

type Unit = 'us' | 'metric';

// Standard conversion factors between the three fuel-economy units.
const MPG_TO_KMPL = 0.425144;   // US MPG × this  = km/L
const KMPL_TO_MPG = 2.35215;    // km/L  × this  = US MPG
const L100_CONST = 235.215;     // L/100km = 235.215 / MPG (= 100 / km/L)

export default function FuelEconomyCalculator() {
  const [unit, setUnit] = useState<Unit>('us');
  const [distance, setDistance] = useState(300); // miles (US) or km (metric)
  const [fuel, setFuel] = useState(12);          // gallons (US) or litres (metric)

  const r = useMemo(() => {
    let mpg = 0;
    let kmPerL = 0;
    if (unit === 'us') {
      mpg = fuel > 0 ? distance / fuel : 0;       // mpg = miles / gallons
      kmPerL = mpg * MPG_TO_KMPL;                  // US MPG -> km/L
    } else {
      kmPerL = fuel > 0 ? distance / fuel : 0;     // km/L = km / litres
      mpg = kmPerL * KMPL_TO_MPG;                  // km/L -> US MPG
    }
    const l100 = mpg > 0 ? L100_CONST / mpg : 0;   // L/100km = 235.215 / MPG
    return { mpg, kmPerL, l100 };
  }, [unit, distance, fuel]);

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
        <div className="bg-lime-accent border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3"><span className="text-2xl">⛽</span>
            <h2 className="!text-lg sm:!text-xl !my-0 !text-ink-900 font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>Fuel Economy Calculator</h2>
          </div>
          <div className="inline-flex bg-white border-2 border-ink-900 rounded-full p-0.5 text-xs font-bold">
            <button onClick={() => setUnit('us')} className={`px-3 py-1 rounded-full transition-all ${unit === 'us' ? 'bg-ink-900 text-white' : 'text-ink-700'}`} type="button">mi/gal</button>
            <button onClick={() => setUnit('metric')} className={`px-3 py-1 rounded-full transition-all ${unit === 'metric' ? 'bg-ink-900 text-white' : 'text-ink-700'}`} type="button">km/L</button>
          </div>
        </div>

        <div className="p-5 sm:p-7 bg-ink-50 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {field('fe-d', unit === 'us' ? 'Distance (miles)' : 'Distance (km)', distance, setDistance, 'focus:ring-cyan-accent')}
          {field('fe-f', unit === 'us' ? 'Fuel used (gallons)' : 'Fuel used (litres)', fuel, setFuel, 'focus:ring-lime-accent', 0.1)}
        </div>

        <div className="p-5 sm:p-7 bg-white border-t-[2.5px] border-ink-900">
          <div className="bg-lime-accent border-[2.5px] border-ink-900 rounded-2xl p-5 sm:p-6 shadow-sticker-sm grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Fuel economy</div>
              <div className="text-4xl sm:text-5xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight', letterSpacing: '-0.04em' }}>{r.mpg.toFixed(1)}<span className="text-xl"> MPG</span></div>
              <div className="text-sm text-ink-900 font-bold mt-1">= {r.kmPerL.toFixed(2)} km/L · {r.l100.toFixed(2)} L/100km</div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white/70 border-2 border-ink-900 rounded-xl p-2"><div className="text-xl font-extrabold text-ink-900">{r.mpg.toFixed(1)}</div><div className="text-[10px] font-bold text-ink-700 uppercase">MPG · higher ↑</div></div>
              <div className="bg-white/70 border-2 border-ink-900 rounded-xl p-2"><div className="text-xl font-extrabold text-ink-900">{r.kmPerL.toFixed(2)}</div><div className="text-[10px] font-bold text-ink-700 uppercase">km/L · higher ↑</div></div>
              <div className="bg-white/70 border-2 border-ink-900 rounded-xl p-2"><div className="text-xl font-extrabold text-ink-900">{r.l100.toFixed(2)}</div><div className="text-[10px] font-bold text-ink-700 uppercase">L/100km · lower ↓</div></div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · MPG and km/L both measure how far you travel per unit of fuel, so higher is better. L/100km measures fuel burned per fixed distance, so lower is better. Figures use the US gallon (3.785 L).</div>
    </div>
  );
}
