import { useState, useMemo } from 'react';

type Mode = 'pct-off' | 'sale-price' | 'original-price';

interface CalcResult {
  salePrice: number;
  youSave: number;
  discountPct: number;
  originalPrice: number;
  valid: boolean;
}

function calcDiscount(mode: Mode, a: string, b: string): CalcResult {
  const empty: CalcResult = { salePrice: 0, youSave: 0, discountPct: 0, originalPrice: 0, valid: false };
  const A = parseFloat(a);
  const B = parseFloat(b);
  if (isNaN(A) || isNaN(B) || A <= 0) return empty;

  if (mode === 'pct-off') {
    // A = original price, B = discount %
    if (B < 0 || B > 100) return empty;
    const save = A * (B / 100);
    return { salePrice: A - save, youSave: save, discountPct: B, originalPrice: A, valid: true };
  }
  if (mode === 'sale-price') {
    // A = original price, B = sale price
    if (B > A) return empty;
    const save = A - B;
    const pct = (save / A) * 100;
    return { salePrice: B, youSave: save, discountPct: pct, originalPrice: A, valid: true };
  }
  if (mode === 'original-price') {
    // A = sale price, B = discount %
    if (B < 0 || B >= 100) return empty;
    const original = A / (1 - B / 100);
    const save = original - A;
    return { salePrice: A, youSave: save, discountPct: B, originalPrice: original, valid: true };
  }
  return empty;
}

const MODES: { id: Mode; label: string; desc: string }[] = [
  { id: 'pct-off', label: '% Off', desc: 'Original + discount %' },
  { id: 'sale-price', label: 'Sale Price', desc: 'Original + sale price' },
  { id: 'original-price', label: 'Original', desc: 'Sale price + discount %' },
];

const LABELS: Record<Mode, { a: string; b: string; aPrefix: string; bSuffix: string; aPlaceholder: string; bPlaceholder: string }> = {
  'pct-off': { a: 'Original Price', b: 'Discount', aPrefix: '$', bSuffix: '%', aPlaceholder: '120', bPlaceholder: '35' },
  'sale-price': { a: 'Original Price', b: 'Sale Price', aPrefix: '$', bSuffix: '', aPlaceholder: '120', bPlaceholder: '78' },
  'original-price': { a: 'Sale Price (You Pay)', b: 'Discount', aPrefix: '$', bSuffix: '%', aPlaceholder: '78', bPlaceholder: '35' },
};

export default function DiscountCalculator() {
  const [mode, setMode] = useState<Mode>('pct-off');
  const [fieldA, setFieldA] = useState('120');
  const [fieldB, setFieldB] = useState('35');

  const result = useMemo(() => calcDiscount(mode, fieldA, fieldB), [mode, fieldA, fieldB]);
  const labels = LABELS[mode];

  const handleModeChange = (m: Mode) => {
    setMode(m);
    setFieldA('');
    setFieldB('');
  };

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        {/* Header */}
        <div className="bg-lime-accent border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center gap-3">
          <span className="text-2xl">🏷️</span>
          <h2 className="!text-lg sm:!text-xl !my-0 !text-ink-900 font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>Discount Calculator</h2>
        </div>

        {/* Mode tabs */}
        <div className="border-b-[2.5px] border-ink-900 flex">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => handleModeChange(m.id)}
              className={`flex-1 px-3 py-3 text-xs sm:text-sm font-extrabold transition-all border-r-[2.5px] border-ink-900 last:border-r-0 ${mode === m.id ? 'bg-ink-900 text-white' : 'bg-white text-ink-700 hover:bg-ink-50'}`}
            >
              <div>{m.label}</div>
              <div className={`text-[10px] font-medium mt-0.5 ${mode === m.id ? 'text-white/70' : 'text-ink-400'}`}>{m.desc}</div>
            </button>
          ))}
        </div>

        {/* Inputs */}
        <div className="p-5 sm:p-7 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-ink-50">
          {/* Field A */}
          <div>
            <label htmlFor="disc-a" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">{labels.a}</label>
            <div className="relative">
              {labels.aPrefix && (
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-extrabold text-base pointer-events-none">{labels.aPrefix}</span>
              )}
              <input
                id="disc-a"
                type="number"
                min={0}
                step={0.01}
                value={fieldA}
                onChange={(e) => setFieldA(e.target.value)}
                placeholder={labels.aPlaceholder}
                inputMode="decimal"
                className={`w-full ${labels.aPrefix ? 'pl-8' : 'pl-3.5'} pr-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-lime-accent transition-all`}
              />
            </div>
          </div>
          {/* Field B */}
          <div>
            <label htmlFor="disc-b" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">{labels.b}</label>
            <div className="relative">
              {labels.bSuffix && (
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-extrabold text-base pointer-events-none">{labels.bSuffix}</span>
              )}
              {labels.b === 'Sale Price' && (
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-extrabold text-base pointer-events-none">$</span>
              )}
              <input
                id="disc-b"
                type="number"
                min={0}
                step={mode === 'sale-price' ? 0.01 : 1}
                max={mode !== 'sale-price' ? 100 : undefined}
                value={fieldB}
                onChange={(e) => setFieldB(e.target.value)}
                placeholder={labels.bPlaceholder}
                inputMode="decimal"
                className={`w-full ${labels.b === 'Sale Price' ? 'pl-8' : 'pl-3.5'} ${labels.bSuffix ? 'pr-10' : 'pr-3.5'} py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-cyan-accent transition-all`}
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="p-5 sm:p-7 bg-white border-t-[2.5px] border-ink-900">
          {!result.valid ? (
            <div className="text-center py-6 text-ink-500 font-semibold">Enter valid values to see results.</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <div className="bg-lime-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Sale Price</div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>${result.salePrice.toFixed(2)}</div>
                </div>
                <div className="bg-pink-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-white mb-1">You Save</div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-white leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>${result.youSave.toFixed(2)}</div>
                </div>
                <div className="bg-cyan-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">
                    {mode === 'original-price' ? 'Original Price' : 'Discount %'}
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>
                    {mode === 'original-price' ? `$${result.originalPrice.toFixed(2)}` : `${result.discountPct.toFixed(1)}%`}
                  </div>
                </div>
              </div>

              {/* Bulk savings */}
              <div className="bg-ink-50 border-[2.5px] border-ink-900 rounded-2xl p-4 shadow-sticker-sm">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mb-3">Bulk Savings</div>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((qty) => (
                    <div key={qty} className="bg-white border-2 border-ink-900 rounded-xl p-3 text-center">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-500 mb-1">×{qty} unit{qty > 1 ? 's' : ''}</div>
                      <div className="text-base font-extrabold text-ink-900 leading-tight" style={{ fontFamily: 'Inter Tight, Inter, sans-serif' }}>
                        ${(result.salePrice * qty).toFixed(2)}
                      </div>
                      {qty > 1 && (
                        <div className="text-[10px] font-bold text-ink-500 mt-0.5">save ${(result.youSave * qty).toFixed(2)}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · Switch modes to solve for any unknown</div>
    </div>
  );
}
