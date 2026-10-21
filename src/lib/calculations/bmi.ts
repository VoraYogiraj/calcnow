/**
 * Pure BMI calculation (extracted from BmiCalculator.tsx — no UI dependency).
 * Formula per WHO: BMI = weight (kg) / height (m)^2.
 * Source: WHO Obesity and Overweight Fact Sheet; NIH BMI Calculator.
 * Preserves original thresholds, copy, and placeholder behavior byte-for-byte.
 */
export interface BmiResult {
  bmi: number;
  category: 'Underweight' | 'Normal' | 'Overweight' | 'Obese';
  bgColor: string;
  textColor: string;
  description: string;
  position: number; // 0-100, position on scale
}

export function calculateBMI(heightM: number, weightKg: number): BmiResult {
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
