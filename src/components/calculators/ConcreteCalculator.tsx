import { useState, useMemo } from 'react';

type Unit = 'imperial' | 'metric';

export default function ConcreteCalculator() {
  const [unit, setUnit] = useState<Unit>('imperial');
  const [length, setLength] = useState(10);
  const [width, setWidth] = useState(10);
  const [thick, setThick] = useState(4);   // inches (imperial) or cm (metric)
  const [qty, setQty] = useState(1);
  const [waste, setWaste] = useState(10);   // %

  const r = useMemo(() => {
    let cuft = 0;
    if (unit === 'imperial') {
      cuft = length * width * (thick / 12); // ft × ft × ft
    } else {
      const m3base = length * width * (thick / 100); // m × m × m
      cuft = m3base * 35.3146667;
    }
    cuft = cuft * qty * (1 + waste / 100);
    const m3 = cuft * 0.0283168466;
    const cuyd = cuft / 27;
    return {
      cuft, m3, cuyd,
      bags80: Math.ceil(cuft / 0.6),
      bags60: Math.ceil(cuft / 0.45),
      bags40: Math.ceil(cuft / 0.3),
    };
  }, [unit, length, width, thick, qty, waste]);

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
        <div className="bg-orange-300 border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3"><span className="text-2xl">🧱</span>
            <h2 className="!text-lg sm:!text-xl !my-0 !text-ink-900 font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>Concrete Calculator</h2>
          </div>
          <div className="inline-flex bg-white border-2 border-ink-900 rounded-full p-0.5 text-xs font-bold">
            <button onClick={() => setUnit('imperial')} className={`px-3 py-1 rounded-full transition-all ${unit === 'imperial' ? 'bg-ink-900 text-white' : 'text-ink-700'}`} type="button">ft/in</button>
            <button onClick={() => setUnit('metric')} className={`px-3 py-1 rounded-full transition-all ${unit === 'metric' ? 'bg-ink-900 text-white' : 'text-ink-700'}`} type="button">m/cm</button>
          </div>
        </div>

        <div className="p-5 sm:p-7 bg-ink-50 grid grid-cols-2 md:grid-cols-3 gap-4">
          {field('cc-l', unit === 'imperial' ? 'Length (ft)' : 'Length (m)', length, setLength, 'focus:ring-cyan-accent')}
          {field('cc-w', unit === 'imperial' ? 'Width (ft)' : 'Width (m)', width, setWidth, 'focus:ring-lime-accent')}
          {field('cc-t', unit === 'imperial' ? 'Thickness (in)' : 'Thickness (cm)', thick, setThick, 'focus:ring-yellow-accent')}
          {field('cc-q', 'Quantity (slabs)', qty, setQty, 'focus:ring-violet-300')}
          {field('cc-waste', 'Waste (%)', waste, setWaste, 'focus:ring-pink-accent')}
        </div>

        <div className="p-5 sm:p-7 bg-white border-t-[2.5px] border-ink-900">
          <div className="bg-orange-300 border-[2.5px] border-ink-900 rounded-2xl p-5 sm:p-6 shadow-sticker-sm grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Concrete needed</div>
              <div className="text-4xl sm:text-5xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight', letterSpacing: '-0.04em' }}>{r.cuyd.toFixed(2)}<span className="text-xl"> yd³</span></div>
              <div className="text-sm text-ink-900 font-bold mt-1">= {r.m3.toFixed(2)} m³ · {r.cuft.toFixed(1)} ft³</div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white/70 border-2 border-ink-900 rounded-xl p-2"><div className="text-xl font-extrabold text-ink-900">{r.bags80}</div><div className="text-[10px] font-bold text-ink-700 uppercase">80 lb bags</div></div>
              <div className="bg-white/70 border-2 border-ink-900 rounded-xl p-2"><div className="text-xl font-extrabold text-ink-900">{r.bags60}</div><div className="text-[10px] font-bold text-ink-700 uppercase">60 lb bags</div></div>
              <div className="bg-white/70 border-2 border-ink-900 rounded-xl p-2"><div className="text-xl font-extrabold text-ink-900">{r.bags40}</div><div className="text-[10px] font-bold text-ink-700 uppercase">40 lb bags</div></div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · Bag counts are for pre-mixed concrete (80 lb ≈ 0.6 ft³ yield). Ready-mix trucks are sold by the cubic yard. Order to the nearest ¼ yard.</div>
    </div>
  );
}
