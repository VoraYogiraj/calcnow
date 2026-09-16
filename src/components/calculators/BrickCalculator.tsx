import { useState, useMemo } from 'react';

type Unit = 'imperial' | 'metric';

export default function BrickCalculator() {
  const [unit, setUnit] = useState<Unit>('imperial');
  const [length, setLength] = useState(20);   // ft (imperial) or m (metric)
  const [height, setHeight] = useState(8);     // ft (imperial) or m (metric)
  const [waste, setWaste] = useState(10);      // %
  const [wythe, setWythe] = useState('single'); // single-wythe (single-layer wall)

  const r = useMemo(() => {
    const wallArea = length * height;                       // sq ft or m²
    const bricksPerUnit = unit === 'imperial' ? 7 : 60;     // 7 / sq ft · 60 / m²
    const bricks = Math.ceil(wallArea * bricksPerUnit * (1 + waste / 100) - 1e-9);
    const mortarBags = Math.ceil(bricks / 30);              // ~1 × 80 lb bag per 30 bricks
    return { wallArea, bricks, mortarBags, bricksPerUnit };
  }, [unit, length, height, waste, wythe]);

  const areaUnit = unit === 'imperial' ? 'ft²' : 'm²';

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
            <h2 className="!text-lg sm:!text-xl !my-0 !text-ink-900 font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>Brick Calculator</h2>
          </div>
          <div className="inline-flex bg-white border-2 border-ink-900 rounded-full p-0.5 text-xs font-bold">
            <button onClick={() => setUnit('imperial')} className={`px-3 py-1 rounded-full transition-all ${unit === 'imperial' ? 'bg-ink-900 text-white' : 'text-ink-700'}`} type="button">ft</button>
            <button onClick={() => setUnit('metric')} className={`px-3 py-1 rounded-full transition-all ${unit === 'metric' ? 'bg-ink-900 text-white' : 'text-ink-700'}`} type="button">m</button>
          </div>
        </div>

        <div className="p-5 sm:p-7 bg-ink-50 grid grid-cols-2 md:grid-cols-3 gap-4">
          {field('bc-l', unit === 'imperial' ? 'Wall length (ft)' : 'Wall length (m)', length, setLength, 'focus:ring-cyan-accent')}
          {field('bc-h', unit === 'imperial' ? 'Wall height (ft)' : 'Wall height (m)', height, setHeight, 'focus:ring-lime-accent')}
          {field('bc-waste', 'Waste (%)', waste, setWaste, 'focus:ring-yellow-accent')}
          <div>
            <label htmlFor="bc-wythe" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Wall type</label>
            <select id="bc-wythe" value={wythe} onChange={(e) => setWythe(e.target.value)}
              className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-violet-300 transition-all">
              <option value="single">Single-wythe (½ brick)</option>
            </select>
          </div>
        </div>

        <div className="p-5 sm:p-7 bg-white border-t-[2.5px] border-ink-900">
          <div className="bg-orange-300 border-[2.5px] border-ink-900 rounded-2xl p-5 sm:p-6 shadow-sticker-sm grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Bricks needed</div>
              <div className="text-4xl sm:text-5xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight', letterSpacing: '-0.04em' }}>{r.bricks.toLocaleString()}<span className="text-xl"> bricks</span></div>
              <div className="text-sm text-ink-900 font-bold mt-1">{r.bricksPerUnit} bricks per {areaUnit} · {(1 + waste / 100).toFixed(2)}× for waste</div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-white/70 border-2 border-ink-900 rounded-xl p-2"><div className="text-xl font-extrabold text-ink-900">{r.wallArea.toFixed(1)}</div><div className="text-[10px] font-bold text-ink-700 uppercase">Wall area ({areaUnit})</div></div>
              <div className="bg-white/70 border-2 border-ink-900 rounded-xl p-2"><div className="text-xl font-extrabold text-ink-900">{r.mortarBags}</div><div className="text-[10px] font-bold text-ink-700 uppercase">80 lb mortar bags</div></div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · Figures are for standard modular bricks on a single-wythe (single-layer) wall. King- or queen-size bricks and double-wythe (full-brick) walls differ. Mortar ≈ one 80 lb bag per 30 bricks laid.</div>
    </div>
  );
}
