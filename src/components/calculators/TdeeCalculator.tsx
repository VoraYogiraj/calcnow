import { useState, useMemo } from 'react';

type Unit = 'metric' | 'imperial';
type Sex = 'male' | 'female';
type Goal = 'lose' | 'maintain' | 'gain';

const ACTIVITY_OPTIONS = [
  { label: 'Sedentary', desc: 'Little or no exercise', multiplier: 1.2 },
  { label: 'Lightly Active', desc: 'Exercise 1–3 days/week', multiplier: 1.375 },
  { label: 'Moderately Active', desc: 'Exercise 3–5 days/week', multiplier: 1.55 },
  { label: 'Very Active', desc: 'Hard exercise 6–7 days/week', multiplier: 1.725 },
  { label: 'Extra Active', desc: 'Very hard exercise / physical job', multiplier: 1.9 },
];

const GOAL_ADJUSTMENTS: Record<Goal, number> = {
  lose: -500,
  maintain: 0,
  gain: 300,
};

const GOAL_LABELS: Record<Goal, { label: string; desc: string; color: string }> = {
  lose: { label: 'Lose Weight', desc: '−500 kcal/day deficit', color: 'bg-pink-accent' },
  maintain: { label: 'Maintain', desc: 'Match TDEE exactly', color: 'bg-cyan-accent' },
  gain: { label: 'Gain Muscle', desc: '+300 kcal/day surplus', color: 'bg-lime-accent' },
};

function calcBMR(sex: Sex, age: number, heightCm: number, weightKg: number): number {
  if (heightCm <= 0 || weightKg <= 0 || age <= 0) return 0;
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex === 'male' ? base + 5 : base - 161;
}

export default function TdeeCalculator() {
  const [unit, setUnit] = useState<Unit>('metric');
  const [sex, setSex] = useState<Sex>('male');
  const [age, setAge] = useState<number>(28);
  const [heightCm, setHeightCm] = useState<number>(180);
  const [feet, setFeet] = useState<number>(5);
  const [inches, setInches] = useState<number>(11);
  const [weightKg, setWeightKg] = useState<number>(80);
  const [lbs, setLbs] = useState<number>(176);
  const [activityIdx, setActivityIdx] = useState<number>(2);
  const [goal, setGoal] = useState<Goal>('lose');

  const resolvedHeight = useMemo(() => {
    if (unit === 'metric') return heightCm;
    return (feet * 12 + inches) * 2.54;
  }, [unit, heightCm, feet, inches]);

  const resolvedWeight = useMemo(() => {
    if (unit === 'metric') return weightKg;
    return lbs * 0.453592;
  }, [unit, weightKg, lbs]);

  const bmr = useMemo(() => calcBMR(sex, age, resolvedHeight, resolvedWeight), [sex, age, resolvedHeight, resolvedWeight]);

  const tdee = useMemo(() => {
    if (bmr <= 0) return 0;
    return Math.round(bmr * ACTIVITY_OPTIONS[activityIdx].multiplier);
  }, [bmr, activityIdx]);

  const goalCalories = useMemo(() => {
    if (tdee <= 0) return 0;
    return Math.max(1200, tdee + GOAL_ADJUSTMENTS[goal]);
  }, [tdee, goal]);

  const macros = useMemo(() => {
    if (goalCalories <= 0) return { protein: 0, fat: 0, carbs: 0 };
    const proteinKcal = resolvedWeight * 2.2 * 0.4 * 4; // grams × 4 kcal/g
    const proteinG = Math.round((goalCalories * 0.30) / 4);
    const fatG = Math.round((goalCalories * 0.25) / 9);
    const carbsG = Math.round((goalCalories - proteinG * 4 - fatG * 9) / 4);
    return { protein: proteinG, fat: fatG, carbs: Math.max(0, carbsG) };
  }, [goalCalories, resolvedWeight]);

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        {/* Header */}
        <div className="bg-lime-accent border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚡</span>
            <h2 className="!text-lg sm:!text-xl !my-0 !text-ink-900 font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>
              TDEE Calculator
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
            <label htmlFor="tdee-age" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Age (years)</label>
            <input
              id="tdee-age" type="number" min={10} max={90} value={age}
              onChange={(e) => setAge(Number(e.target.value) || 0)}
              className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-lime-accent transition-all"
              inputMode="numeric"
            />
            <input type="range" min={10} max={90} value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full mt-2 accent-lime-accent" aria-label="Age slider" />
          </div>

          {/* Height */}
          {unit === 'metric' ? (
            <div>
              <label htmlFor="tdee-height" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Height (cm)</label>
              <input
                id="tdee-height" type="number" min={50} max={250} value={heightCm}
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
              <label htmlFor="tdee-weight" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Weight (kg)</label>
              <input
                id="tdee-weight" type="number" min={20} max={300} value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value) || 0)}
                className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-pink-accent transition-all"
                inputMode="decimal"
              />
              <input type="range" min={30} max={200} value={weightKg} onChange={(e) => setWeightKg(Number(e.target.value))} className="w-full mt-2 accent-pink-accent" aria-label="Weight slider" />
            </div>
          ) : (
            <div>
              <label htmlFor="tdee-lbs" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Weight (lbs)</label>
              <input
                id="tdee-lbs" type="number" min={40} max={700} value={lbs}
                onChange={(e) => setLbs(Number(e.target.value) || 0)}
                className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-pink-accent transition-all"
                inputMode="decimal"
              />
              <input type="range" min={60} max={400} value={lbs} onChange={(e) => setLbs(Number(e.target.value))} className="w-full mt-2 accent-pink-accent" aria-label="Weight slider" />
            </div>
          )}

          {/* Activity */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Activity Level</label>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              {ACTIVITY_OPTIONS.map((opt, idx) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setActivityIdx(idx)}
                  className={`px-3 py-2.5 rounded-xl border-2 text-xs font-extrabold text-left transition-all ${activityIdx === idx ? 'bg-ink-900 text-white border-ink-900' : 'bg-white text-ink-700 border-ink-900 hover:bg-ink-50'}`}
                >
                  <div className="leading-tight">{opt.label}</div>
                  <div className={`text-[10px] font-semibold mt-0.5 ${activityIdx === idx ? 'text-lime-accent' : 'text-ink-500'}`}>×{opt.multiplier}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Goal */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Goal</label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(GOAL_LABELS) as Goal[]).map((g) => {
                const info = GOAL_LABELS[g];
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGoal(g)}
                    className={`px-3 py-3 rounded-xl border-2 text-xs font-extrabold transition-all ${goal === g ? 'bg-ink-900 text-white border-ink-900' : 'bg-white text-ink-700 border-ink-900 hover:bg-ink-50'}`}
                  >
                    <div>{info.label}</div>
                    <div className={`text-[10px] font-semibold mt-0.5 ${goal === g ? 'text-lime-accent' : 'text-ink-500'}`}>{info.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="p-5 sm:p-7 bg-white border-t-[2.5px] border-ink-900">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            {/* TDEE */}
            <div className="bg-pink-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">TDEE (Maintenance)</div>
              <div className="text-3xl sm:text-4xl font-extrabold leading-none tabular-nums text-ink-900" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>
                {tdee > 0 ? tdee.toLocaleString() : '—'}
              </div>
              <div className="text-xs font-bold text-ink-700 mt-1">kcal/day</div>
            </div>

            {/* Goal calories */}
            <div className="bg-cyan-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">
                {GOAL_LABELS[goal].label} Target
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold leading-none tabular-nums text-ink-900" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>
                {goalCalories > 0 ? goalCalories.toLocaleString() : '—'}
              </div>
              <div className="text-xs font-bold text-ink-700 mt-1">kcal/day</div>
            </div>

            {/* BMR */}
            <div className="bg-lime-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">BMR (Resting)</div>
              <div className="text-3xl sm:text-4xl font-extrabold leading-none tabular-nums text-ink-900" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>
                {bmr > 0 ? Math.round(bmr).toLocaleString() : '—'}
              </div>
              <div className="text-xs font-bold text-ink-700 mt-1">kcal/day</div>
            </div>
          </div>

          {/* Macros */}
          <div className="bg-yellow-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-4">Estimated Macros (for {goalCalories > 0 ? goalCalories.toLocaleString() : '—'} kcal goal)</div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Protein', g: macros.protein, pct: '30%', kcalPer: 4 },
                { label: 'Fat', g: macros.fat, pct: '25%', kcalPer: 9 },
                { label: 'Carbs', g: macros.carbs, pct: '45%', kcalPer: 4 },
              ].map((m) => (
                <div key={m.label} className="text-center">
                  <div className="text-2xl sm:text-3xl font-extrabold tabular-nums text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>
                    {m.g > 0 ? m.g : '—'}
                  </div>
                  <div className="text-xs font-extrabold text-ink-900 mt-0.5">g / day</div>
                  <div className="text-[10px] font-bold text-ink-700 mt-1">{m.label}</div>
                </div>
              ))}
            </div>
            {/* Bar viz */}
            {goalCalories > 0 && (
              <div className="mt-4 flex h-3 rounded-full overflow-hidden border-2 border-ink-900 gap-0">
                <div className="bg-pink-accent transition-all" style={{ width: '30%' }} title="Protein 30%" />
                <div className="bg-cyan-accent transition-all" style={{ width: '25%' }} title="Fat 25%" />
                <div className="bg-lime-accent transition-all" style={{ width: '45%' }} title="Carbs 45%" />
              </div>
            )}
            <div className="flex gap-4 mt-2 text-[10px] font-extrabold text-ink-900">
              <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-sm bg-pink-accent border border-ink-900" />Protein</span>
              <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-sm bg-cyan-accent border border-ink-900" />Fat</span>
              <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-sm bg-lime-accent border border-ink-900" />Carbs</span>
            </div>
          </div>
        </div>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · Mifflin-St Jeor Equation · Macros are estimates. Adjust to personal needs</div>
    </div>
  );
}
