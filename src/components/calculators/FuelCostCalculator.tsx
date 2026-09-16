import { useState, useMemo } from 'react';

type Unit = 'us' | 'metric';

export default function FuelCostCalculator() {
  const [unit, setUnit] = useState<Unit>('us');
  const [distance, setDistance] = useState(100);   // miles (US) or km (metric)
  const [efficiency, setEfficiency] = useState(30); // MPG (US) or km/L (metric)
  const [price, setPrice] = useState(3.5);          // per US gallon (US) or per litre (metric)
  const [roundTrip, setRoundTrip] = useState(false);

  const r = useMemo(() => {
    const eff = efficiency > 0 ? efficiency : 1;
    const fuelOneWay = distance / eff;           // gallons or litres
    const costOneWay = fuelOneWay * price;
    const legs = roundTrip ? 2 : 1;
    const fuelTotal = fuelOneWay * legs;
    const costTotal = costOneWay * legs;
    const costPerUnit = distance > 0 ? costOneWay / distance : 0; // per mile or per km
    return {
      fuelTotal, costTotal,
      costOneWay, costRound: costOneWay * 2,
      costPerUnit,
      fuelLabel: unit === 'us' ? 'gallons' : 'litres',
      distLabel: unit === 'us' ? 'mile' : 'km',
    };
  }, [unit, distance, efficiency, price, roundTrip]);

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
        <div className="bg-cyan-accent border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3"><span className="text-2xl">⛽</span>
            <h2 className="!text-lg sm:!text-xl !my-0 !text-ink-900 font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>Fuel Cost Calculator</h2>
          </div>
          <div className="inline-flex bg-white border-2 border-ink-900 rounded-full p-0.5 text-xs font-bold">
            <button onClick={() => setUnit('us')} className={`px-3 py-1 rounded-full transition-all ${unit === 'us' ? 'bg-ink-900 text-white' : 'text-ink-700'}`} type="button">US</button>
            <button onClick={() => setUnit('metric')} className={`px-3 py-1 rounded-full transition-all ${unit === 'metric' ? 'bg-ink-900 text-white' : 'text-ink-700'}`} type="button">Metric</button>
          </div>
        </div>

        <div className="p-5 sm:p-7 bg-ink-50 grid grid-cols-2 md:grid-cols-4 gap-4">
          {field('fc-d', unit === 'us' ? 'Distance (mi)' : 'Distance (km)', distance, setDistance, 'focus:ring-cyan-accent')}
          {field('fc-e', unit === 'us' ? 'Efficiency (MPG)' : 'Efficiency (km/L)', efficiency, setEfficiency, 'focus:ring-lime-accent')}
          {field('fc-p', unit === 'us' ? 'Fuel price ($/gal)' : 'Fuel price ($/L)', price, setPrice, 'focus:ring-yellow-accent', 0.01)}
          <div>
            <span className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Trip type</span>
            <button onClick={() => setRoundTrip(!roundTrip)} type="button" aria-pressed={roundTrip}
              className={`w-full px-3.5 py-3 border-[2.5px] border-ink-900 rounded-xl text-base font-extrabold transition-all ${roundTrip ? 'bg-violet-300 text-ink-900' : 'bg-white text-ink-700'}`}>
              {roundTrip ? '⇄ Round trip' : '→ One way'}
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-7 bg-white border-t-[2.5px] border-ink-900">
          <div className="bg-cyan-accent border-[2.5px] border-ink-900 rounded-2xl p-5 sm:p-6 shadow-sticker-sm grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">{roundTrip ? 'Round-trip fuel cost' : 'One-way trip cost'}</div>
              <div className="text-4xl sm:text-5xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight', letterSpacing: '-0.04em' }}>${r.costTotal.toFixed(2)}</div>
              <div className="text-sm text-ink-900 font-bold mt-1">= {r.fuelTotal.toFixed(2)} {r.fuelLabel} · ${r.costPerUnit.toFixed(3)}/{r.distLabel}</div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-white/70 border-2 border-ink-900 rounded-xl p-2"><div className="text-xl font-extrabold text-ink-900">${r.costOneWay.toFixed(2)}</div><div className="text-[10px] font-bold text-ink-700 uppercase">One way</div></div>
              <div className="bg-white/70 border-2 border-ink-900 rounded-xl p-2"><div className="text-xl font-extrabold text-ink-900">${r.costRound.toFixed(2)}</div><div className="text-[10px] font-bold text-ink-700 uppercase">Round trip</div></div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · Fuel used = distance ÷ efficiency; cost = fuel used × price. Round trip doubles the distance. US gallon = 3.785 L.</div>
    </div>
  );
}
