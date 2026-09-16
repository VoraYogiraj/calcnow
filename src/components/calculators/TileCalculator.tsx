import { useState, useMemo } from 'react';

type Unit = 'imperial' | 'metric';

export default function TileCalculator() {
  const [unit, setUnit] = useState<Unit>('imperial');
  const [length, setLength] = useState(10);   // ft (imperial) or m (metric)
  const [width, setWidth] = useState(10);      // ft (imperial) or m (metric)
  const [tileW, setTileW] = useState(12);      // in (imperial) or cm (metric)
  const [tileH, setTileH] = useState(12);      // in (imperial) or cm (metric)
  const [waste, setWaste] = useState(10);      // %
  const [perBox, setPerBox] = useState(10);    // tiles per box

  const r = useMemo(() => {
    const floorArea = length * width; // sq ft (imperial) or m² (metric)
    const tileArea = unit === 'imperial'
      ? (tileW * tileH) / 144    // in² → sq ft
      : (tileW * tileH) / 10000; // cm² → m²
    const tilesNeeded = tileArea > 0
      ? Math.ceil((floorArea / tileArea) * (1 + waste / 100) - 1e-9)
      : 0;
    const boxes = perBox > 0 ? Math.ceil(tilesNeeded / perBox) : 0;
    return { floorArea, tileArea, tilesNeeded, boxes };
  }, [unit, length, width, tileW, tileH, waste, perBox]);

  const areaUnit = unit === 'imperial' ? 'sq ft' : 'm²';

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
          <div className="flex items-center gap-3"><span className="text-2xl">🟦</span>
            <h2 className="!text-lg sm:!text-xl !my-0 !text-ink-900 font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>Tile Calculator</h2>
          </div>
          <div className="inline-flex bg-white border-2 border-ink-900 rounded-full p-0.5 text-xs font-bold">
            <button onClick={() => setUnit('imperial')} className={`px-3 py-1 rounded-full transition-all ${unit === 'imperial' ? 'bg-ink-900 text-white' : 'text-ink-700'}`} type="button">ft/in</button>
            <button onClick={() => setUnit('metric')} className={`px-3 py-1 rounded-full transition-all ${unit === 'metric' ? 'bg-ink-900 text-white' : 'text-ink-700'}`} type="button">m/cm</button>
          </div>
        </div>

        <div className="p-5 sm:p-7 bg-ink-50 grid grid-cols-2 md:grid-cols-3 gap-4">
          {field('tc-l', unit === 'imperial' ? 'Room length (ft)' : 'Room length (m)', length, setLength, 'focus:ring-cyan-accent')}
          {field('tc-w', unit === 'imperial' ? 'Room width (ft)' : 'Room width (m)', width, setWidth, 'focus:ring-lime-accent')}
          {field('tc-tw', unit === 'imperial' ? 'Tile width (in)' : 'Tile width (cm)', tileW, setTileW, 'focus:ring-yellow-accent')}
          {field('tc-th', unit === 'imperial' ? 'Tile height (in)' : 'Tile height (cm)', tileH, setTileH, 'focus:ring-violet-300')}
          {field('tc-waste', 'Waste (%)', waste, setWaste, 'focus:ring-pink-accent')}
          {field('tc-box', 'Tiles per box', perBox, setPerBox, 'focus:ring-cyan-accent')}
        </div>

        <div className="p-5 sm:p-7 bg-white border-t-[2.5px] border-ink-900">
          <div className="bg-cyan-accent border-[2.5px] border-ink-900 rounded-2xl p-5 sm:p-6 shadow-sticker-sm grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Tiles needed</div>
              <div className="text-4xl sm:text-5xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight', letterSpacing: '-0.04em' }}>{r.tilesNeeded}<span className="text-xl"> tiles</span></div>
              <div className="text-sm text-ink-900 font-bold mt-1">= {r.boxes} boxes · covers {r.floorArea.toFixed(1)} {areaUnit}</div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white/70 border-2 border-ink-900 rounded-xl p-2"><div className="text-xl font-extrabold text-ink-900">{r.boxes}</div><div className="text-[10px] font-bold text-ink-700 uppercase">Boxes</div></div>
              <div className="bg-white/70 border-2 border-ink-900 rounded-xl p-2"><div className="text-xl font-extrabold text-ink-900">{r.floorArea.toFixed(0)}</div><div className="text-[10px] font-bold text-ink-700 uppercase">Floor {areaUnit}</div></div>
              <div className="bg-white/70 border-2 border-ink-900 rounded-xl p-2"><div className="text-xl font-extrabold text-ink-900">{r.tileArea.toFixed(2)}</div><div className="text-[10px] font-bold text-ink-700 uppercase">{areaUnit}/tile</div></div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · Waste covers cuts around edges and breakage. Bump the allowance to 15% for diagonal, herringbone or patterned layouts, which produce more offcuts.</div>
    </div>
  );
}
