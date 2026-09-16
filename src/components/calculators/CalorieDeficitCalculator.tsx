import { useState, useMemo } from 'react';

type Unit = 'metric' | 'imperial';
type Sex = 'male' | 'female';
type Pace = 'slow' | 'moderate' | 'fast' | 'aggressive';

const ACTIVITY_OPTIONS = [
  { label: 'Sedentary', desc: 'Little/no exercise', multiplier: 1.2 },
  { label: 'Lightly Active', desc: '1–3 days/week', multiplier: 1.375 },
  { label: 'Moderately Active', desc: '3–5 days/week', multiplier: 1.55 },
  { label: 'Very Active', desc: '6–7 days/week', multiplier: 1.725 },
  { label: 'Extra Active', desc: 'Physical job', multiplier: 1.9 },
];

const PACE_OPTIONS: { key: Pace; label: string; deficit: number; color: string }[] = [
  { key: 'slow', label: 'Slow', deficit: 250, color: 'bg-cyan-accent' },
  { key: 'moderate', label: 'Moderate', deficit: 500, color: 'bg-lime-accent' },
  { key: 'fast', label: 'Fast', deficit: 750, color: 'bg-yellow-accent' },
  { key: 'aggressive', label: 'Aggressive', deficit: 1000, color: 'bg-pink-accent' },
];

function calcBMR(sex: Sex, age: number, heightCm: number, weightKg: number): number {
  if (heightCm <= 0 || weightKg <= 0 || age <= 0) return 0;
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex === 'male' ? base + 5 : base - 161;
}

export default function CalorieDeficitCalculator() {
  const [unit, setUnit] = useState<Unit>('metric');
  const [sex, setSex] = useState<Sex>('female');
  const [age, setAge] = useState<number>(28);
  const [heightCm, setHeightCm] = useState<number>(165);
  const [feet, setFeet] = useState<number>(5);
  const [inches, setInches] = useState<number>(5);
  const [weightKg, setWeightKg] = useState<number>(75);
  const [lbs, setLbs] = useState<number>(165);
  const [targetKg, setTargetKg] = useState<number>(65);
  const [targetLbs, setTargetLbs] = useState<number>(143);
  const [activityIdx, setActivityIdx] = useState<number>(2);
  const [pace, setPace] = useState<Pace>('moderate');

  const resolvedHeight = useMemo(() => {
    if (unit === 'metric') return heightCm;
    return (feet * 12 + inches) * 2.54;
  }, [unit, heightCm, feet, inches]);

  const resolvedWeight = useMemo(() => {
    if (unit === 'metric') return weightKg;
    return lbs * 0.453592;
  }, [unit, weightKg, lbs]);

  const resolvedTarget = useMemo(() => {
    if (unit === 'metric') return targetKg;
    return targetLbs * 0.453592;
  }, [unit, targetKg, targetLbs]);

  const bmr = useMemo(() => calcBMR(sex, age, resolvedHeight, resolvedWeight), [sex, age, resolvedHeight, resolvedWeight]);

  const tdee = useMemo(() => {
    if (bmr <= 0) return 0;
    return Math.round(bmr * ACTIVITY_OPTIONS[activityIdx].multiplier);
  }, [bmr, activityIdx]);

  const paceInfo = useMemo(() => PACE_OPTIONS.find((p) => p.key === pace)!, [pace]);

  const dailyTarget = useMemo(() => {
    if (tdee <= 0) return 0;
    return Math.max(1200, tdee - paceInfo.deficit);
  }, [tdee, paceInfo]);

  const weeksToGoal = useMemo(() => {
    const weightDiffKg = resolvedWeight - resolvedTarget;
    if (weightDiffKg <= 0 || paceInfo.deficit <= 0) return null;
    const totalKcalDeficit = weightDiffKg * 7700; // 1 kg fat ≈ 7700 kcal (≈ 3500 kcal/lb)
    const weeklyDeficit = paceInfo.deficit * 7;
    return Math.ceil(totalKcalDeficit / weeklyDeficit);
  }, [resolvedWeight, resolvedTarget, paceInfo]);

  const isAggressiveWarning = paceInfo.deficit > 1000 || (tdee > 0 && (tdee - dailyTarget) > 1000);

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        {/* Header */}
        <div className="bg-lime-accent border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🍎</span>
            <h2 className="!text-lg sm:!text-xl !my-0 !text-ink-900 font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>
              Calorie Deficit Calculator
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
            <label htmlFor="cal-age" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Age (years)</label>
            <input
              id="cal-age" type="number" min={10} max={90} value={age}
              onChange={(e) => setAge(Number(e.target.value) || 0)}
              className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-lime-accent transition-all"
              inputMode="numeric"
            />
            <input type="range" min={10} max={90} value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full mt-2 accent-lime-accent" aria-label="Age slider" />
          </div>

          {/* Height */}
          {unit === 'metric' ? (
            <div>
              <label htmlFor="cal-height" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Height (cm)</label>
              <input
                id="cal-height" type="number" min={50} max={250} value={heightCm}
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

          {/* Current Weight */}
          {unit === 'metric' ? (
            <div>
              <label htmlFor="cal-weight" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Current Weight (kg)</label>
              <input
                id="cal-weight" type="number" min={20} max={300} value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value) || 0)}
                className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-pink-accent transition-all"
                inputMode="decimal"
              />
              <input type="range" min={30} max={200} value={weightKg} onChange={(e) => setWeightKg(Number(e.target.value))} className="w-full mt-2 accent-pink-accent" aria-label="Current weight slider" />
            </div>
          ) : (
            <div>
              <label htmlFor="cal-lbs" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Current Weight (lbs)</label>
              <input
                id="cal-lbs" type="number" min={40} max={700} value={lbs}
                onChange={(e) => setLbs(Number(e.target.value) || 0)}
                className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-pink-accent transition-all"
                inputMode="decimal"
              />
              <input type="range" min={60} max={400} value={lbs} onChange={(e) => setLbs(Number(e.target.value))} className="w-full mt-2 accent-pink-accent" aria-label="Weight slider" />
            </div>
          )}

          {/* Target Weight */}
          {unit === 'metric' ? (
            <div>
              <label htmlFor="cal-target" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Target Weight (kg)</label>
              <input
                id="cal-target" type="number" min={20} max={300} value={targetKg}
                onChange={(e) => setTargetKg(Number(e.target.value) || 0)}
                className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-yellow-accent transition-all"
                inputMode="decimal"
              />
              <input type="range" min={30} max={200} value={targetKg} onChange={(e) => setTargetKg(Number(e.target.value))} className="w-full mt-2 accent-yellow-accent" aria-label="Target weight slider" />
            </div>
          ) : (
            <div>
              <label htmlFor="cal-target-lbs" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Target Weight (lbs)</label>
              <input
                id="cal-target-lbs" type="number" min={40} max={700} value={targetLbs}
                onChange={(e) => setTargetLbs(Number(e.target.value) || 0)}
                className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-yellow-accent transition-all"
                inputMode="decimal"
              />
              <input type="range" min={60} max={400} value={targetLbs} onChange={(e) => setTargetLbs(Number(e.target.value))} className="w-full mt-2 accent-yellow-accent" aria-label="Target weight slider" />
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

          {/* Pace */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Weight Loss Pace</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PACE_OPTIONS.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setPace(p.key)}
                  className={`px-3 py-3 rounded-xl border-2 text-xs font-extrabold transition-all ${pace === p.key ? 'bg-ink-900 text-white border-ink-900' : 'bg-white text-ink-700 border-ink-900 hover:bg-ink-50'}`}
                >
                  <div>{p.label}</div>
                  <div className={`text-[10px] font-semibold mt-0.5 ${pace === p.key ? 'text-lime-accent' : 'text-ink-500'}`}>−{p.deficit} kcal/day</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="p-5 sm:p-7 bg-white border-t-[2.5px] border-ink-900">
          {/* Aggressive deficit warning */}
          {isAggressiveWarning && tdee > 0 && (
            <div className="mb-4 bg-pink-accent border-[2.5px] border-ink-900 rounded-2xl p-4 flex gap-3 items-start shadow-sticker-sm">
              <span className="text-xl shrink-0">⚠️</span>
              <p className="text-sm font-semibold text-ink-900 !m-0">
                A deficit above 1,000 kcal/day can lead to muscle loss, nutrient deficiencies, and metabolic slowdown. Consider a <strong>moderate</strong> pace for sustainable results.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Daily target */}
            <div className="bg-lime-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Daily Calorie Target</div>
              <div className="text-3xl sm:text-4xl font-extrabold leading-none tabular-nums text-ink-900" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>
                {dailyTarget > 0 ? dailyTarget.toLocaleString() : '—'}
              </div>
              <div className="text-xs font-bold text-ink-700 mt-1">kcal/day</div>
              {tdee > 0 && (
                <div className="text-[10px] font-semibold text-ink-700 mt-2">
                  {paceInfo.deficit} kcal below TDEE
                </div>
              )}
            </div>

            {/* Weeks to goal */}
            <div className="bg-cyan-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Estimated Time</div>
              {weeksToGoal !== null && weeksToGoal > 0 ? (
                <>
                  <div className="text-3xl sm:text-4xl font-extrabold leading-none tabular-nums text-ink-900" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>
                    {weeksToGoal}
                  </div>
                  <div className="text-xs font-bold text-ink-700 mt-1">weeks to goal</div>
                  <div className="text-[10px] font-semibold text-ink-700 mt-2">≈ {Math.ceil(weeksToGoal / 4.3)} months</div>
                </>
              ) : resolvedWeight <= resolvedTarget ? (
                <div className="text-sm font-extrabold text-ink-900 mt-2">Already at or below goal!</div>
              ) : (
                <div className="text-3xl font-extrabold text-ink-900">—</div>
              )}
            </div>

            {/* TDEE */}
            <div className="bg-yellow-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Your TDEE</div>
              <div className="text-3xl sm:text-4xl font-extrabold leading-none tabular-nums text-ink-900" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>
                {tdee > 0 ? tdee.toLocaleString() : '—'}
              </div>
              <div className="text-xs font-bold text-ink-700 mt-1">kcal/day (maintenance)</div>
              {bmr > 0 && (
                <div className="text-[10px] font-semibold text-ink-700 mt-2">BMR: {Math.round(bmr).toLocaleString()} kcal</div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · Mifflin-St Jeor · 1 kg fat ≈ 7,700 kcal · 1,200 kcal/day minimum enforced · For educational use only</div>
    </div>
  );
}
