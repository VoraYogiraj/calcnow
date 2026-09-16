import { useState, useMemo } from 'react';

// Each unit stores its factor to the category's base unit.
interface U { label: string; sym: string; factor: number; }
interface Category { key: string; label: string; icon: string; base: string; units: U[]; }

const CATEGORIES: Category[] = [
  {
    key: 'length', label: 'Length', icon: '📏', base: 'metre',
    units: [
      { label: 'Millimetre', sym: 'mm', factor: 0.001 },
      { label: 'Centimetre', sym: 'cm', factor: 0.01 },
      { label: 'Metre', sym: 'm', factor: 1 },
      { label: 'Kilometre', sym: 'km', factor: 1000 },
      { label: 'Inch', sym: 'in', factor: 0.0254 },
      { label: 'Foot', sym: 'ft', factor: 0.3048 },
      { label: 'Yard', sym: 'yd', factor: 0.9144 },
      { label: 'Mile', sym: 'mi', factor: 1609.344 },
      { label: 'Nautical mile', sym: 'nmi', factor: 1852 },
    ],
  },
  {
    key: 'weight', label: 'Weight', icon: '⚖️', base: 'gram',
    units: [
      { label: 'Milligram', sym: 'mg', factor: 0.001 },
      { label: 'Gram', sym: 'g', factor: 1 },
      { label: 'Kilogram', sym: 'kg', factor: 1000 },
      { label: 'Metric tonne', sym: 't', factor: 1_000_000 },
      { label: 'Ounce', sym: 'oz', factor: 28.349523 },
      { label: 'Pound', sym: 'lb', factor: 453.59237 },
      { label: 'Stone', sym: 'st', factor: 6350.29318 },
    ],
  },
  {
    key: 'volume', label: 'Volume', icon: '🧪', base: 'litre',
    units: [
      { label: 'Millilitre', sym: 'ml', factor: 0.001 },
      { label: 'Litre', sym: 'L', factor: 1 },
      { label: 'Cubic metre', sym: 'm³', factor: 1000 },
      { label: 'Teaspoon (US)', sym: 'tsp', factor: 0.00492892 },
      { label: 'Tablespoon (US)', sym: 'tbsp', factor: 0.01478676 },
      { label: 'Cup (US)', sym: 'cup', factor: 0.2365882 },
      { label: 'Pint (US)', sym: 'pt', factor: 0.4731765 },
      { label: 'Gallon (US)', sym: 'gal', factor: 3.7854118 },
    ],
  },
  {
    key: 'area', label: 'Area', icon: '🗺️', base: 'square metre',
    units: [
      { label: 'Square centimetre', sym: 'cm²', factor: 0.0001 },
      { label: 'Square metre', sym: 'm²', factor: 1 },
      { label: 'Hectare', sym: 'ha', factor: 10000 },
      { label: 'Square kilometre', sym: 'km²', factor: 1_000_000 },
      { label: 'Square foot', sym: 'ft²', factor: 0.09290304 },
      { label: 'Square yard', sym: 'yd²', factor: 0.83612736 },
      { label: 'Acre', sym: 'acre', factor: 4046.8564 },
      { label: 'Square mile', sym: 'mi²', factor: 2_589_988.11 },
    ],
  },
  {
    key: 'speed', label: 'Speed', icon: '🚀', base: 'metre/second',
    units: [
      { label: 'Metre/second', sym: 'm/s', factor: 1 },
      { label: 'Kilometre/hour', sym: 'km/h', factor: 0.2777778 },
      { label: 'Mile/hour', sym: 'mph', factor: 0.44704 },
      { label: 'Foot/second', sym: 'ft/s', factor: 0.3048 },
      { label: 'Knot', sym: 'kn', factor: 0.5144444 },
    ],
  },
  {
    key: 'data', label: 'Data', icon: '💾', base: 'byte',
    units: [
      { label: 'Bit', sym: 'bit', factor: 0.125 },
      { label: 'Byte', sym: 'B', factor: 1 },
      { label: 'Kilobyte', sym: 'KB', factor: 1000 },
      { label: 'Megabyte', sym: 'MB', factor: 1_000_000 },
      { label: 'Gigabyte', sym: 'GB', factor: 1_000_000_000 },
      { label: 'Terabyte', sym: 'TB', factor: 1_000_000_000_000 },
      { label: 'Kibibyte', sym: 'KiB', factor: 1024 },
      { label: 'Mebibyte', sym: 'MiB', factor: 1_048_576 },
      { label: 'Gibibyte', sym: 'GiB', factor: 1_073_741_824 },
    ],
  },
];

function fmt(n: number): string {
  if (!Number.isFinite(n)) return '—';
  if (n === 0) return '0';
  const abs = Math.abs(n);
  if (abs >= 1e9 || abs < 1e-4) return n.toExponential(4);
  return Number(n.toPrecision(7)).toLocaleString('en-US', { maximumFractionDigits: 6 });
}

interface UnitConverterProps {
  initialCategory?: string;
  initialFrom?: string;
  initialTo?: string;
}

export default function UnitConverter({ initialCategory = 'length', initialFrom = 'km', initialTo = 'mi' }: UnitConverterProps) {
  const [catKey, setCatKey] = useState(initialCategory);
  const cat = CATEGORIES.find((c) => c.key === catKey) ?? CATEGORIES[0];
  const [fromSym, setFromSym] = useState(initialFrom);
  const [toSym, setToSym] = useState(initialTo);
  const [value, setValue] = useState<number>(1);

  const from = cat.units.find((u) => u.sym === fromSym) ?? cat.units[0];
  const to = cat.units.find((u) => u.sym === toSym) ?? cat.units[1];

  const result = useMemo(() => (value * from.factor) / to.factor, [value, from, to]);

  const switchCat = (key: string) => {
    const c = CATEGORIES.find((x) => x.key === key)!;
    setCatKey(key);
    setFromSym(c.units[Math.min(0, c.units.length - 1)].sym);
    setToSym(c.units[Math.min(1, c.units.length - 1)].sym);
    setValue(1);
  };
  const swap = () => { setFromSym(to.sym); setToSym(from.sym); };

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        <div className="bg-yellow-accent border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center gap-3">
          <span className="text-2xl flex-shrink-0">🔄</span>
          <h2 className="!text-lg sm:!text-xl !my-0 !text-ink-900 font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>Unit Converter</h2>
        </div>

        {/* Category tabs */}
        <div className="px-5 sm:px-7 pt-5 bg-ink-50">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button key={c.key} type="button" onClick={() => switchCat(c.key)}
                className={`px-3 py-2 rounded-xl border-2 border-ink-900 text-sm font-extrabold transition-all ${catKey === c.key ? 'bg-ink-900 text-white shadow-sticker-sm' : 'bg-white text-ink-700 hover:bg-yellow-accent'}`}>
                <span className="mr-1">{c.icon}</span>{c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Conversion */}
        <div className="p-5 sm:p-7 bg-ink-50">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-end">
            <div>
              <label htmlFor="uc-value" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">From</label>
              <input id="uc-value" type="number" value={value} onChange={(e) => setValue(Number(e.target.value) || 0)}
                className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-lg font-extrabold focus:outline-none focus:ring-4 focus:ring-cyan-accent transition-all mb-2" inputMode="decimal" />
              <select value={fromSym} onChange={(e) => setFromSym(e.target.value)}
                className="w-full px-3 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-cyan-accent transition-all" aria-label="Convert from unit">
                {cat.units.map((u) => <option key={u.sym} value={u.sym}>{u.label} ({u.sym})</option>)}
              </select>
            </div>
            <button type="button" onClick={swap} className="mx-auto my-1 md:mb-3 w-11 h-11 flex items-center justify-center rounded-full border-[2.5px] border-ink-900 bg-white hover:bg-lime-accent text-ink-900 font-extrabold text-lg transition-colors shadow-sticker-sm" aria-label="Swap units">⇄</button>
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">To</label>
              <div className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-lg font-extrabold text-ink-900 mb-2 truncate" aria-live="polite">{fmt(result)}</div>
              <select value={toSym} onChange={(e) => setToSym(e.target.value)}
                className="w-full px-3 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-lime-accent transition-all" aria-label="Convert to unit">
                {cat.units.map((u) => <option key={u.sym} value={u.sym}>{u.label} ({u.sym})</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Result line */}
        <div className="p-5 sm:p-7 bg-white border-t-[2.5px] border-ink-900">
          <div className="bg-yellow-accent border-[2.5px] border-ink-900 rounded-2xl p-5 sm:p-6 shadow-sticker-sm">
            <div className="text-lg sm:text-2xl font-extrabold text-ink-900 leading-tight" style={{ fontFamily: 'Inter Tight' }}>
              {fmt(value)} {from.sym} = {fmt(result)} {to.sym}
            </div>
            <div className="text-xs text-ink-800 mt-2 font-semibold">1 {from.sym} = {fmt(from.factor / to.factor)} {to.sym} · category base: {cat.base}</div>
          </div>
        </div>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · 6 categories, 45+ units. US customary volumes shown; UK/imperial gallons and cups differ.</div>
    </div>
  );
}
