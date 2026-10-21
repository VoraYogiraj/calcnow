import { describe, it, expect } from 'vitest';
import { calculateBMI } from '../bmi';

describe('BMI formula regression', () => {
  it('standard 70kg / 1.70m → ~24.2 (Normal)', () => {
    const r = calculateBMI(1.70, 70);
    expect(r.bmi).toBeCloseTo(24.22, 1);
    expect(r.category).toBe('Normal');
  });
  it('boundary underweight 50kg / 1.80m → ~15.4', () => {
    const r = calculateBMI(1.80, 50);
    expect(r.bmi).toBeCloseTo(15.43, 1);
    expect(r.category).toBe('Underweight');
  });
  it('boundary obese 100kg / 1.70m → ~34.6', () => {
    const r = calculateBMI(1.70, 100);
    expect(r.bmi).toBeCloseTo(34.6, 0);
    expect(r.category).toBe('Obese');
  });
  it('zero height returns placeholder (not NaN/crash)', () => {
    const r = calculateBMI(0, 70);
    expect(isFinite(r.bmi)).toBe(true);
    expect(r.bmi).toBe(0);
  });
  it('negative weight returns placeholder', () => {
    const r = calculateBMI(1.70, -5);
    expect(r.bmi).toBe(0);
  });
});
