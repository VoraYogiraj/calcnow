/**
 * Pure mortgage amortization (extracted from MortgageCalculator.tsx).
 * Formula: standard reducing-balance annuity, identical to EMI but with a
 * per-month schedule and a zero-balance clamp to absorb float accumulation.
 */
export interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface MortgageResult {
  monthlyPayment: number;
  totalInterest: number;
  totalPaid: number;
  schedule: AmortizationRow[];
}

export function calculateMortgage(
  principal: number,
  annualRatePct: number,
  years: number
): MortgageResult {
  const monthlyRate = annualRatePct / 100 / 12;
  const numPayments = years * 12;

  if (monthlyRate === 0 || numPayments === 0) {
    const payment = numPayments > 0 ? principal / numPayments : 0;
    return { monthlyPayment: payment, totalInterest: 0, totalPaid: principal, schedule: [] };
  }

  const monthlyPayment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
    (Math.pow(1 + monthlyRate, numPayments) - 1);

  const schedule: AmortizationRow[] = [];
  let balance = principal;
  for (let m = 1; m <= numPayments; m++) {
    const interest = balance * monthlyRate;
    const principalPaid = monthlyPayment - interest;
    balance -= principalPaid;
    schedule.push({
      month: m,
      payment: monthlyPayment,
      principal: principalPaid,
      interest,
      balance: Math.max(0, balance),
    });
  }

  return {
    monthlyPayment,
    totalInterest: monthlyPayment * numPayments - principal,
    totalPaid: monthlyPayment * numPayments,
    schedule,
  };
}

/** Simulates payoff with extra monthly payments; returns months to payoff and total interest paid. */
export function calculateWithExtra(
  principal: number,
  annualRatePct: number,
  years: number,
  basePayment: number,
  extraMonthly: number
): { months: number; totalInterest: number } {
  if (extraMonthly <= 0) return { months: years * 12, totalInterest: 0 };
  const rate = annualRatePct / 100 / 12;
  let balance = principal;
  let totalInterest = 0;
  let months = 0;
  const maxMonths = years * 12 + 1; // safety cap
  while (balance > 0.01 && months < maxMonths) {
    const interest = balance * rate;
    totalInterest += interest;
    const available = basePayment + extraMonthly - interest;
    if (available <= 0) break;
    const principalPaid = Math.min(balance, available);
    balance -= principalPaid;
    months++;
  }
  return { months, totalInterest };
}
