import { useState, useMemo } from 'react';

type Sex = 'male' | 'female';

// US Navy body-fat method. Measurements converted cm -> inches.
function navyBodyFat(sex: Sex, heightCm: number, neckCm: number, waistCm: number, hipCm: number): number | null {
  const h = heightCm / 2.54, n = neckCm / 2.54, w = waistCm / 2.54, hip = hipCm / 2.54;
  if (sex === 'male') {
    if (w - n <= 0 || h <= 0) return null;
    return 86.010 * Math.log10(w - n) - 70.041 * Math.log10(h) + 36.76;
  }
  if (w + hip - n <= 0 || h <= 0) return null;
  return 163.205 * Math.log10(w + hip - n) - 97.684 * Math.log10(h) - 78.387;
}

function category(sex: Sex, bf: number): { label: string; color: string } {
  const m = sex === 'male';
  if (bf < (m ? 6 : 14)) return { label: m ? 'Essential fat' : 'Essential fat', color: 'bg-cyan-accent' };
  if (bf < (m ? 14 : 21)) return { label: 'Athletes', color: 'bg-lime-accent' };
  if (bf < (m ? 18 : 25)) return { label: 'Fitness', color: 'bg-lime-accent' };
  if (bf < (m ? 25 : 32)) return { label: 'Average / acceptable', color: 'bg-yellow-accent' };
  return { label: 'Obese range', color: 'bg-pink-accent' };
}

export default function BodyFatCalculator() {
  const [sex, setSex] = useState<Sex>('male');
  const [height, setHeight] = useState(178);
  const [neck, setNeck] = useState(38);
  const [waist, setWaist] = useState(85);
  const [hip, setHip] = useState(95);

  const bf = useMemo(() => navyBodyFat(sex, height, neck, waist, hip), [sex, height, neck, waist, hip]);
  const cat = bf !== null ? category(sex, bf) : null;

  const field = (id: string, label: string, val: number, set: (n: number) => void, ring: string) => (
    <div>
      <label htmlFor={id} className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">{label}</label>
      <input id={id} type="number" min={1} value={val} onChange={(e) => set(Number(e.target.value) || 0)}
        className={`w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 ${ring} transition-all`} inputMode="decimal" />
    </div>
  );

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        <div className="bg-rose-300 border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3"><span className="text-2xl">💪</span>
            <h2 className="!text-lg sm:!text-xl !my-0 !text-ink-900 font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>Body Fat % (US Navy)</h2>
          </div>
          <div className="inline-flex bg-white border-2 border-ink-900 rounded-full p-0.5 text-xs font-bold">
            <button onClick={() => setSex('male')} className={`px-3 py-1 rounded-full transition-all ${sex === 'male' ? 'bg-ink-900 text-white' : 'text-ink-700'}`} type="button">Male</button>
            <button onClick={() => setSex('female')} className={`px-3 py-1 rounded-full transition-all ${sex === 'female' ? 'bg-ink-900 text-white' : 'text-ink-700'}`} type="button">Female</button>
          </div>
        </div>

        <div className="p-5 sm:p-7 bg-ink-50 grid grid-cols-2 md:grid-cols-4 gap-4">
          {field('bf-h', 'Height (cm)', height, setHeight, 'focus:ring-cyan-accent')}
          {field('bf-n', 'Neck (cm)', neck, setNeck, 'focus:ring-lime-accent')}
          {field('bf-w', 'Waist (cm)', waist, setWaist, 'focus:ring-yellow-accent')}
          {sex === 'female' && field('bf-hip', 'Hip (cm)', hip, setHip, 'focus:ring-pink-accent')}
        </div>

        <div className="p-5 sm:p-7 bg-white border-t-[2.5px] border-ink-900">
          {bf !== null && cat ? (
            <div className={`${cat.color} border-[2.5px] border-ink-900 rounded-2xl p-5 sm:p-6 shadow-sticker-sm grid grid-cols-1 sm:grid-cols-3 gap-4 items-center`}>
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Body fat</div>
                <div className="text-5xl sm:text-6xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight', letterSpacing: '-0.04em' }}>{bf.toFixed(1)}%</div>
              </div>
              <div className="sm:col-span-2">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Category ({sex})</div>
                <p className="text-2xl font-extrabold text-ink-900 !m-0">{cat.label}</p>
              </div>
            </div>
          ) : (
            <div className="bg-pink-accent border-[2.5px] border-ink-900 rounded-2xl p-5 text-white font-extrabold">Check measurements. Waist must be larger than neck.</div>
          )}
        </div>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · US Navy circumference method, an estimate (±3–4%). DEXA or calipers are more precise. Measure waist at the navel, neck below the larynx.</div>
    </div>
  );
}
