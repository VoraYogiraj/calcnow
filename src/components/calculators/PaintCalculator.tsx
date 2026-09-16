import { useState, useMemo } from 'react';

type Unit = 'imperial' | 'metric';

export default function PaintCalculator() {
  const [unit, setUnit] = useState<Unit>('imperial');
  const [length, setLength] = useState(12);
  const [width, setWidth] = useState(12);
  const [height, setHeight] = useState(9);
  const [coats, setCoats] = useState(2);
  const [doors, setDoors] = useState(1);
  const [windows, setWindows] = useState(2);

  const r = useMemo(() => {
    const imp = unit === 'imperial';
    const doorArea = imp ? 21 : 1.95;    // sq ft / m² per door
    const winArea = imp ? 15 : 1.4;      // per window
    const coverage = imp ? 350 : 11;     // sq ft per gallon / m² per litre
    let wall = 2 * (length + width) * height;
    wall = Math.max(0, wall - doors * doorArea - windows * winArea);
    const paint = (wall * coats) / coverage;
    return { wall, paint, unitLabel: imp ? 'gallons' : 'litres', areaLabel: imp ? 'sq ft' : 'm²', cans: Math.ceil(paint) };
  }, [unit, length, width, height, coats, doors, windows]);

  const field = (id: string, label: string, val: number, set: (n: number) => void, ring: string) => (
    <div>
      <label htmlFor={id} className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">{label}</label>
      <input id={id} type="number" min={0} value={val} onChange={(e) => set(Math.max(0, Number(e.target.value) || 0))}
        className={`w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 ${ring} transition-all`} inputMode="decimal" />
    </div>
  );

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        <div className="bg-cyan-accent border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3"><span className="text-2xl">🎨</span>
            <h2 className="!text-lg sm:!text-xl !my-0 !text-ink-900 font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>Paint Calculator</h2>
          </div>
          <div className="inline-flex bg-white border-2 border-ink-900 rounded-full p-0.5 text-xs font-bold">
            <button onClick={() => setUnit('imperial')} className={`px-3 py-1 rounded-full transition-all ${unit === 'imperial' ? 'bg-ink-900 text-white' : 'text-ink-700'}`} type="button">ft</button>
            <button onClick={() => setUnit('metric')} className={`px-3 py-1 rounded-full transition-all ${unit === 'metric' ? 'bg-ink-900 text-white' : 'text-ink-700'}`} type="button">m</button>
          </div>
        </div>

        <div className="p-5 sm:p-7 bg-ink-50 grid grid-cols-2 md:grid-cols-3 gap-4">
          {field('pt-l', unit === 'imperial' ? 'Room length (ft)' : 'Room length (m)', length, setLength, 'focus:ring-cyan-accent')}
          {field('pt-w', unit === 'imperial' ? 'Room width (ft)' : 'Room width (m)', width, setWidth, 'focus:ring-lime-accent')}
          {field('pt-h', unit === 'imperial' ? 'Wall height (ft)' : 'Wall height (m)', height, setHeight, 'focus:ring-yellow-accent')}
          {field('pt-c', 'Coats', coats, setCoats, 'focus:ring-violet-300')}
          {field('pt-d', 'Doors', doors, setDoors, 'focus:ring-pink-accent')}
          {field('pt-win', 'Windows', windows, setWindows, 'focus:ring-cyan-accent')}
        </div>

        <div className="p-5 sm:p-7 bg-white border-t-[2.5px] border-ink-900">
          <div className="bg-cyan-accent border-[2.5px] border-ink-900 rounded-2xl p-5 sm:p-6 shadow-sticker-sm grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Paint needed</div>
              <div className="text-4xl sm:text-5xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight', letterSpacing: '-0.04em' }}>{r.paint.toFixed(1)} <span className="text-xl">{r.unitLabel}</span></div>
              <div className="text-sm text-ink-900 font-bold mt-1">Buy {r.cans} {unit === 'imperial' ? '× 1-gallon cans' : '× 1-litre cans'}</div>
            </div>
            <div className="bg-white/70 border-2 border-ink-900 rounded-xl p-3 text-center">
              <div className="text-[10px] font-bold text-ink-700 uppercase">Paintable wall area</div>
              <div className="text-2xl font-extrabold text-ink-900">{r.wall.toFixed(0)} {r.areaLabel}</div>
              <div className="text-[10px] text-ink-600 font-semibold mt-1">{coats} coat{coats === 1 ? '' : 's'} · doors & windows deducted</div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · Assumes ~{unit === 'imperial' ? '350 sq ft per gallon' : '11 m² per litre'} coverage. Textured or unprimed walls soak up more. Add a primer coat for bare drywall.</div>
    </div>
  );
}
