import { useState, useMemo } from 'react';

const PITCHES = [3, 4, 5, 6, 7, 8, 9, 10, 12];

export default function RoofingCalculator() {
  const [length, setLength] = useState(40); // footprint length (ft)
  const [width, setWidth] = useState(30);   // footprint width (ft)
  const [rise, setRise] = useState(6);      // pitch = rise / 12
  const [waste, setWaste] = useState(10);   // %

  const r = useMemo(() => {
    const pitchMultiplier = Math.sqrt(1 + (rise / 12) ** 2);
    const footprint = length * width;               // sq ft
    const roofArea = footprint * pitchMultiplier;     // sq ft
    const squares = roofArea / 100;                   // 1 square = 100 sq ft
    const bundles = Math.ceil(squares * 3 * (1 + waste / 100) - 1e-9); // 3 bundles / square
    return { pitchMultiplier, footprint, roofArea, squares, bundles };
  }, [length, width, rise, waste]);

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
        <div className="bg-violet-300 border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3"><span className="text-2xl">🏠</span>
            <h2 className="!text-lg sm:!text-xl !my-0 !text-ink-900 font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>Roofing Calculator</h2>
          </div>
          <div className="inline-flex bg-white border-2 border-ink-900 rounded-full px-3 py-1 text-xs font-bold text-ink-900">ft · squares</div>
        </div>

        <div className="p-5 sm:p-7 bg-ink-50 grid grid-cols-2 md:grid-cols-4 gap-4">
          {field('rc-l', 'Length (ft)', length, setLength, 'focus:ring-cyan-accent')}
          {field('rc-w', 'Width (ft)', width, setWidth, 'focus:ring-lime-accent')}
          <div>
            <label htmlFor="rc-pitch" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Roof pitch</label>
            <select id="rc-pitch" value={rise} onChange={(e) => setRise(Number(e.target.value))}
              className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-yellow-accent transition-all">
              {PITCHES.map((p) => <option key={p} value={p}>{p}/12</option>)}
            </select>
          </div>
          {field('rc-waste', 'Waste (%)', waste, setWaste, 'focus:ring-pink-accent')}
        </div>

        <div className="p-5 sm:p-7 bg-white border-t-[2.5px] border-ink-900">
          <div className="bg-violet-300 border-[2.5px] border-ink-900 rounded-2xl p-5 sm:p-6 shadow-sticker-sm grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Roof area</div>
              <div className="text-4xl sm:text-5xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight', letterSpacing: '-0.04em' }}>{r.roofArea.toFixed(0)}<span className="text-xl"> ft²</span></div>
              <div className="text-sm text-ink-900 font-bold mt-1">= {r.squares.toFixed(1)} squares · {r.footprint.toLocaleString()} ft² footprint</div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white/70 border-2 border-ink-900 rounded-xl p-2"><div className="text-xl font-extrabold text-ink-900">{r.pitchMultiplier.toFixed(3)}×</div><div className="text-[10px] font-bold text-ink-700 uppercase">Pitch factor</div></div>
              <div className="bg-white/70 border-2 border-ink-900 rounded-xl p-2"><div className="text-xl font-extrabold text-ink-900">{r.squares.toFixed(1)}</div><div className="text-[10px] font-bold text-ink-700 uppercase">Squares</div></div>
              <div className="bg-white/70 border-2 border-ink-900 rounded-xl p-2"><div className="text-xl font-extrabold text-ink-900">{r.bundles}</div><div className="text-[10px] font-bold text-ink-700 uppercase">Bundles</div></div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · Architectural shingles come 3 bundles per square (100 ft²). Measure hips, valleys and dormers separately on complex roofs. They need extra material.</div>
    </div>
  );
}
