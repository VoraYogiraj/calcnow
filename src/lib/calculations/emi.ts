/**
 * Pure EMI calculation (extracted from EmiCalculator.tsx).
 */
export interface EmiResult {
  emi: number;
  totalInterest: number;
  totalPaid: number;
}

export function calculateEMI(principal: number, annualRatePct: number, months: number): EmiResult {
  const monthlyRate = annualRatePct / 100 / 12;
  if (months === 0) return { emi: 0, totalInterest: 0, totalPaid: 0 };
  if (monthlyRate === 0) return { emi: principal / months, totalInterest: 0, totalPaid: principal };
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  return { emi, totalInterest: emi * months - principal, totalPaid: emi * months };
}
