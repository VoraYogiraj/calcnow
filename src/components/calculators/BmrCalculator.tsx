import { useState, useMemo } from 'react';

type Unit = 'metric' | 'imperial';
type Sex = 'male' | 'female';

const ACTIVITY_LEVELS = [
  { label: 'Sedentary', desc: 'Little or no exercise', multiplier: 1.2, color: 'bg-cyan-accent' },
  { label: 'Lightly Active', desc: 'Exercise 1–3 days/week', multiplier: 1.375, color: 'bg-lime-accent' },
  { label: 'Moderately Active', desc: 'Exercise 3–5 days/week', multiplier: 1.55, color: 'bg-yellow-accent' },
  { label: 'Very Active', desc: 'Hard exercise 6–7 days/week', multiplier: 1.725, color: 'bg-pink-accent' },
  { label: 'Extra Active', desc: 'Very hard exercise / physical job', multiplier: 1.9, color: 'bg-violet-300' },
];

function calcBMR(sex: Sex, ageYears: number, heightCm: number, weightKg: number): number {
  if (heightCm <= 0 || weightKg <= 0 || ageYears <= 0) return 0;
  const base = 10 * weightKg + 6.25 * heightCm - 5 * ageYears;
  return sex === 'male' ? base + 5 : base - 161;
}

export default function BmrCalculator() {
  const [unit, setUnit] = useState<Unit>('metric');
  const [sex, setSex] = useState<Sex>('male');
  const [age, setAge] = useState<number>(30);
  const [heightCm, setHeightCm] = useState<number>(175);
  const [feet, setFeet] = useState<number>(5);
  const [inches, setInches] = useState<number>(9);
  const [weightKg, setWeightKg] = useState<number>(75);
  const [lbs, setLbs] = useState<number>(165);

  const resolvedHeight = useMemo(() => {
    if (unit === 'metric') return heightCm;
    return (feet * 12 + inches) * 2.54;
  }, [unit, heightCm, feet, inches]);

  const resolvedWeight = useMemo(() => {
    if (unit === 'metric') return weightKg;
    return lbs * 0.453592;
  }, [unit, weightKg, lbs]);

  const bmr = useMemo(() => calcBMR(sex, age, resolvedHeight, resolvedWeight), [sex, age, resolvedHeight, resolvedWeight]);

  const barMax = bmr > 0 ? ACTIVITY_LEVELS[ACTIVITY_LEVELS.length - 1].multiplier * bmr : 1;

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        {/* Header */}
        <div className="bg-lime-accent border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔥</span>
            <h2 className="!text-lg sm:!text-xl !my-0 !text-ink-900 font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>
              BMR Calculator
            </h2>
          </div>
          <div className="inline-flex bg-white border-2 border-ink-900 rounded-full p-0.5 text-xs font-bold">
            <button onClick={() => setUnit('metric')} className={`px-3 py-1 rounded-full transition-all ${unit === 'metric' ? 'bg-ink-900 text-white' : 'text-ink-700'}`} type="button">Metric</button>
            <button onClick={() => setUnit('imperial')} className={`px-3 py-1 rounded-full transition-all ${unit === 'imperial' ? 'bg-ink-900 text-white' : 'text-ink-700'}`} type="button">Imperial</button>
          </div>
        </div>

        {/* Inputs */}
        <div className="p-5 sm:p-7 bg-ink-50 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
          {/* Sex */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Biological Sex</label>
            <div className="inline-flex bg-white border-2 border-ink-900 rounded-full p-0.5 text-sm font-bold">
              <button onClick={() => setSex('male')} className={`px-5 py-2 rounded-full transition-all ${sex === 'male' ? 'bg-ink-900 text-white' : 'text-ink-700 hover:text-ink-900'}`} type="button">Male</button>
              <button onClick={() => setSex('female')} className={`px-5 py-2 rounded-full transition-all ${sex === 'female' ? 'bg-ink-900 text-white' : 'text-ink-700 hover:text-ink-900'}`} type="button">Female</button>
            </div>
          </div>

          {/* Age */}
          <div>
            <label htmlFor="bmr-age" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Age (years)</label>
            <input
              id="bmr-age" type="number" min={10} max={90} value={age}
              onChange={(e) => setAge(Number(e.target.value) || 0)}
              className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-lime-accent transition-all"
              inputMode="numeric"
            />
            <input type="range" min={10} max={90} value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full mt-2 accent-lime-accent" aria-label="Age slider" />
          </div>

          {/* Height */}
          {unit === 'metric' ? (
            <div>
              <label htmlFor="bmr-height" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Height (cm)</label>
              <input
                id="bmr-height" type="number" min={50} max={250} value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value) || 0)}
                className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-cyan-accent transition-all"
                inputMode="decimal"
              />
              <input type="range" min={120} max={220} value={heightCm} onChange={(e) => setHeightCm(Number(e.target.value))} className="w-full mt-2 accent-cyan-accent" aria-label="Height slider" />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Height</label>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <input type="number" min={0} max={8} value={feet} onChange={(e) => setFeet(Number(e.target.value) || 0)}
                    className="w-full pl-3.5 pr-8 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-cyan-accent transition-all"
                    inputMode="decimal" aria-label="Feet" />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">ft</span>
                </div>
                <div className="relative">
                  <input type="number" min={0} max={11.9} step={0.1} value={inches} onChange={(e) => setInches(Number(e.target.value) || 0)}
                    className="w-full pl-3.5 pr-8 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-cyan-accent transition-all"
                    inputMode="decimal" aria-label="Inches" />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">in</span>
                </div>
              </div>
            </div>
          )}

          {/* Weight */}
          {unit === 'metric' ? (
            <div>
              <label htmlFor="bmr-weight" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Weight (kg)</label>
              <input
                id="bmr-weight" type="number" min={20} max={300} value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value) || 0)}
                className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-pink-accent transition-all"
                inputMode="decimal"
              />
              <input type="range" min={30} max={200} value={weightKg} onChange={(e) => setWeightKg(Number(e.target.value))} className="w-full mt-2 accent-pink-accent" aria-label="Weight slider" />
            </div>
          ) : (
            <div>
              <label htmlFor="bmr-lbs" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Weight (lbs)</label>
              <input
                id="bmr-lbs" type="number" min={40} max={700} value={lbs}
                onChange={(e) => setLbs(Number(e.target.value) || 0)}
                className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-pink-accent transition-all"
                inputMode="decimal"
              />
              <input type="range" min={60} max={400} value={lbs} onChange={(e) => setLbs(Number(e.target.value))} className="w-full mt-2 accent-pink-accent" aria-label="Weight slider" />
            </div>
          )}
        </div>

        {/* Results */}
        <div className="p-5 sm:p-7 bg-white border-t-[2.5px] border-ink-900">
          {/* BMR hero */}
          <div className="bg-lime-accent border-[2.5px] border-ink-900 rounded-2xl p-5 sm:p-6 shadow-sticker-sm mb-5">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Basal Metabolic Rate</div>
            <div className="flex items-end gap-3">
              <span className="text-5xl sm:text-6xl font-extrabold leading-none tabular-nums text-ink-900" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.05em' }}>
                {bmr > 0 ? Math.round(bmr).toLocaleString() : '—'}
              </span>
              <span className="text-xl font-extrabold text-ink-700 mb-1">kcal/day</span>
            </div>
            <p className="text-sm font-semibold text-ink-800 mt-2 !m-0 mt-2">
              Calories your body burns at complete rest: organs, breathing, circulation.
            </p>
          </div>

          {/* Activity multiplier table */}
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mb-3">Daily calorie needs by activity level</div>
          <div className="space-y-2">
            {ACTIVITY_LEVELS.map((level) => {
              const kcal = bmr > 0 ? Math.round(bmr * level.multiplier) : 0;
              const pct = bmr > 0 ? Math.round((kcal / barMax) * 100) : 0;
              return (
                <div key={level.label} className={`${level.color} border-[2.5px] border-ink-900 rounded-xl p-3.5 shadow-sticker-sm`}>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div>
                      <div className="font-extrabold text-ink-900 text-sm leading-tight" style={{ fontFamily: 'Inter Tight, Inter, sans-serif' }}>{level.label}</div>
                      <div className="text-xs font-semibold text-ink-700">{level.desc} · ×{level.multiplier}</div>
                    </div>
                    <div className="text-xl font-extrabold tabular-nums text-ink-900 shrink-0" style={{ fontFamily: 'Inter Tight, Inter, sans-serif' }}>
                      {kcal > 0 ? kcal.toLocaleString() : '—'}<span className="text-xs font-bold ml-1">kcal</span>
                    </div>
                  </div>
                  {bmr > 0 && (
                    <div className="h-1.5 bg-ink-900/20 rounded-full overflow-hidden">
                      <div className="h-full bg-ink-900 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · Mifflin-St Jeor Equation · For educational use only. Consult a dietitian for personal advice</div>
    </div>
  );
}
