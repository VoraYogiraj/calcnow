import { useState, useMemo } from 'react';

type Unit = 'metric' | 'imperial';

interface BmiResult {
  bmi: number;
  category: 'Underweight' | 'Normal' | 'Overweight' | 'Obese';
  bgColor: string;
  textColor: string;
  description: string;
  position: number; // 0-100, position on scale
}

function calculateBMI(heightM: number, weightKg: number): BmiResult {
  if (heightM <= 0 || weightKg <= 0) {
    return { bmi: 0, category: 'Normal', bgColor: 'bg-lime-accent', textColor: 'text-ink-900', description: 'Enter your height and weight.', position: 0 };
  }
  const bmi = weightKg / (heightM * heightM);
  let category: BmiResult['category'];
  let bgColor: string;
  let textColor: string;
  let description: string;

  if (bmi < 18.5) {
    category = 'Underweight';
    bgColor = 'bg-cyan-accent';
    textColor = 'text-ink-900';
    description = "Below the healthy weight range. Consider speaking with a healthcare provider.";
  } else if (bmi < 25) {
    category = 'Normal';
    bgColor = 'bg-lime-accent';
    textColor = 'text-ink-900';
    description = "You're in the healthy weight range. Keep it up.";
  } else if (bmi < 30) {
    category = 'Overweight';
    bgColor = 'bg-yellow-accent';
    textColor = 'text-ink-900';
    description = 'Above the healthy range. Small lifestyle changes can help.';
  } else {
    category = 'Obese';
    bgColor = 'bg-pink-accent';
    textColor = 'text-white';
    description = 'Significantly above the healthy range. Consider consulting a doctor.';
  }

  // Position on visual scale (10 to 40 BMI maps to 0–100%)
  const position = Math.max(0, Math.min(100, ((bmi - 10) / 30) * 100));
  return { bmi, category, bgColor, textColor, description, position };
}

export default function BmiCalculator() {
  const [unit, setUnit] = useState<Unit>('metric');
  const [heightCm, setHeightCm] = useState<number>(170);
  const [weightKg, setWeightKg] = useState<number>(70);
  const [feet, setFeet] = useState<number>(5);
  const [inches, setInches] = useState<number>(7);
  const [lbs, setLbs] = useState<number>(154);

  const heightM = useMemo(() => {
    if (unit === 'metric') return heightCm / 100;
    return (feet * 12 + inches) * 0.0254;
  }, [unit, heightCm, feet, inches]);

  const weight = useMemo(() => (unit === 'metric' ? weightKg : lbs * 0.453592), [unit, weightKg, lbs]);

  const result = useMemo(() => calculateBMI(heightM, weight), [heightM, weight]);

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        <div className="bg-rose-300 border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚖️</span>
            <h2 className="!text-lg sm:!text-xl !my-0 !text-ink-900 font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>BMI Calculator</h2>
          </div>
          {/* Unit toggle */}
          <div className="inline-flex bg-white border-2 border-ink-900 rounded-full p-0.5 text-xs font-bold">
            <button onClick={() => setUnit('metric')} className={`px-3 py-1 rounded-full transition-all ${unit === 'metric' ? 'bg-ink-900 text-white' : 'text-ink-700'}`} type="button">Metric</button>
            <button onClick={() => setUnit('imperial')} className={`px-3 py-1 rounded-full transition-all ${unit === 'imperial' ? 'bg-ink-900 text-white' : 'text-ink-700'}`} type="button">Imperial</button>
          </div>
        </div>

        <div className="p-5 sm:p-7 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 bg-ink-50">
          {unit === 'metric' ? (
            <>
              <div>
                <label htmlFor="bmi-height" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Height (cm)</label>
                <input id="bmi-height" type="number" min={50} max={250} value={heightCm} onChange={(e) => setHeightCm(Number(e.target.value) || 0)}
                  className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-cyan-accent transition-all"
                  inputMode="decimal" />
                <input type="range" min={120} max={220} value={heightCm} onChange={(e) => setHeightCm(Number(e.target.value))} className="w-full mt-2 accent-cyan-accent" aria-label="Height slider" />
              </div>
              <div>
                <label htmlFor="bmi-weight" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Weight (kg)</label>
                <input id="bmi-weight" type="number" min={20} max={300} value={weightKg} onChange={(e) => setWeightKg(Number(e.target.value) || 0)}
                  className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-pink-accent transition-all"
                  inputMode="decimal" />
                <input type="range" min={30} max={200} value={weightKg} onChange={(e) => setWeightKg(Number(e.target.value))} className="w-full mt-2 accent-pink-accent" aria-label="Weight slider" />
              </div>
            </>
          ) : (
            <>
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
              <div>
                <label htmlFor="bmi-lbs" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Weight (lbs)</label>
                <input id="bmi-lbs" type="number" min={40} max={700} value={lbs} onChange={(e) => setLbs(Number(e.target.value) || 0)}
                  className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-pink-accent transition-all"
                  inputMode="decimal" />
                <input type="range" min={60} max={400} value={lbs} onChange={(e) => setLbs(Number(e.target.value))} className="w-full mt-2 accent-pink-accent" aria-label="Weight slider" />
              </div>
            </>
          )}
        </div>

        {/* Big result */}
        <div className="p-5 sm:p-7 bg-white border-t-[2.5px] border-ink-900">
          <div className={`${result.bgColor} border-[2.5px] border-ink-900 rounded-2xl p-6 md:p-7 shadow-sticker-sm`}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div>
                <div className={`text-[10px] font-extrabold uppercase tracking-wider ${result.textColor} mb-1`}>Your BMI</div>
                <div className={`text-5xl sm:text-6xl font-extrabold leading-none ${result.textColor}`} style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.05em' }}>{result.bmi.toFixed(1)}</div>
              </div>
              <div className="sm:col-span-2">
                <div className={`text-[10px] font-extrabold uppercase tracking-wider ${result.textColor} mb-1`}>Category</div>
                <div className={`text-2xl sm:text-3xl font-extrabold ${result.textColor} mb-2`} style={{ fontFamily: 'Inter Tight, Inter, sans-serif' }}>{result.category}</div>
                <p className={`text-sm ${result.textColor} font-semibold !m-0`}>{result.description}</p>
              </div>
            </div>
          </div>

          {/* BMI scale visualization */}
          <div className="mt-6">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mb-3">Where you fall on the BMI scale</div>
            <div className="relative">
              <div className="flex h-12 rounded-full border-[2.5px] border-ink-900 overflow-hidden">
                <div className="flex-1 bg-cyan-accent flex items-center justify-center text-[10px] font-extrabold text-ink-900">&lt; 18.5</div>
                <div className="flex-1 bg-lime-accent flex items-center justify-center text-[10px] font-extrabold text-ink-900">18.5 – 25</div>
                <div className="flex-1 bg-yellow-accent flex items-center justify-center text-[10px] font-extrabold text-ink-900">25 – 30</div>
                <div className="flex-1 bg-pink-accent flex items-center justify-center text-[10px] font-extrabold text-white">30+</div>
              </div>
              {/* Marker */}
              <div className="absolute top-0 -translate-x-1/2 transition-all duration-300" style={{ left: `${result.position}%` }}>
                <div className="w-3 h-12 bg-ink-900 rounded-full"></div>
                <div className="absolute top-14 left-1/2 -translate-x-1/2 px-2 py-1 bg-ink-900 text-white text-[10px] font-extrabold rounded whitespace-nowrap">YOU</div>
              </div>
              <div className="flex justify-between text-[10px] font-bold text-ink-500 mt-6">
                <span>Underweight</span>
                <span>Normal</span>
                <span>Overweight</span>
                <span>Obese</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · BMI is a screening tool, not a diagnosis · Consult a doctor for medical advice</div>
    </div>
  );
}
