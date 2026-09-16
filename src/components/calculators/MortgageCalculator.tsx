import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  DEFAULT_CURRENCY,
  detectClientCurrency,
  rescaleAmount,
  formatMoney,
  getCurrency,
  setStoredCurrency,
  type CurrencyOption,
} from '../../lib/currency';
import CurrencySelect from '../ui/CurrencySelect';

interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

interface MortgageCalculatorProps {
  /**
   * ISO 4217 currency code to lock the calculator to (e.g., 'AED' for the UAE page).
   * Omit to let the user pick — the dropdown defaults to navigator.language detection.
   */
  currency?: string;
  /**
   * When true (or `currency` is set), hides the dropdown — user can't change currency.
   * Used on country-specific pages where the currency is part of the page identity.
   */
  locked?: boolean;
  /** Optional override for initial loan amount (defaults to 300k). */
  initialAmount?: number;
  /** Optional override for initial rate (defaults to 7.0). */
  initialRate?: number;
  /** Optional override for initial term in years (defaults to 30). */
  initialTerm?: number;
}

function calculateMortgage(
  principal: number,
  annualRatePct: number,
  years: number
): {
  monthlyPayment: number;
  totalInterest: number;
  totalPaid: number;
  schedule: AmortizationRow[];
} {
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

/** Simulates payoff with extra monthly payments, returns months to payoff and total interest paid. */
function calculateWithExtra(
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

function fmtMonths(m: number): string {
  const y = Math.floor(m / 12);
  const mo = m % 12;
  const parts: string[] = [];
  if (y > 0) parts.push(`${y}y`);
  if (mo > 0) parts.push(`${mo}mo`);
  return parts.join(' ') || '0mo';
}

export default function MortgageCalculator({
  currency: currencyProp,
  locked: lockedProp,
  initialAmount,
  initialRate = 7.0,
  initialTerm = 30,
}: MortgageCalculatorProps = {}) {
  const isLocked = lockedProp ?? Boolean(currencyProp);
  const [currency, setCurrency] = useState<CurrencyOption>(
    currencyProp ? getCurrency(currencyProp) : DEFAULT_CURRENCY
  );
  useEffect(() => {
    if (isLocked) return;
    const next = detectClientCurrency();
    setCurrency(next);
    // Example amounts are authored in USD; re-express them at the region's scale so
    // the defaults (and the hero "Quick answer" above) read natively.
    setLoanAmount((v) => rescaleAmount(v, DEFAULT_CURRENCY, next));
    setHomeValue((v) => rescaleAmount(v, DEFAULT_CURRENCY, next));
    setHoaFee((v) => rescaleAmount(v, DEFAULT_CURRENCY, next));
    setExtraPayment((v) => rescaleAmount(v, DEFAULT_CURRENCY, next));
  }, [isLocked]);

  // Read URL params on mount — allows shared links to pre-fill the calculator
  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      if (p.get('loan')) setLoanAmount(Number(p.get('loan')));
      if (p.get('hv')) setHomeValue(Number(p.get('hv')));
      if (p.get('rate')) setInterestRate(Number(p.get('rate')));
      if (p.get('term')) setLoanTerm(Number(p.get('term')));
      if (p.get('extra')) { setExtraPayment(Number(p.get('extra'))); setShowAdvanced(true); }
      if (p.get('bw') === '1') { setBiweekly(true); setShowAdvanced(true); }
    } catch { /* URL API not available (SSR) */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleCurrencyChange = (next: CurrencyOption) => {
    setLoanAmount((v) => rescaleAmount(v, currency, next));
    setHomeValue((v) => rescaleAmount(v, currency, next));
    setHoaFee((v) => rescaleAmount(v, currency, next));
    setExtraPayment((v) => rescaleAmount(v, currency, next));
    setCurrency(next);
    setStoredCurrency(next.code);
  };
  const fmt = (v: number) => formatMoney(v, currency);

  // ── Core inputs ──────────────────────────────────────────────
  const defaultLoan = initialAmount ?? 300_000;
  const [loanAmount, setLoanAmount] = useState<number>(defaultLoan);
  const [homeValue, setHomeValue] = useState<number>(Math.round(defaultLoan * 1.25));
  const [interestRate, setInterestRate] = useState<number>(initialRate);
  const [loanTerm, setLoanTerm] = useState<number>(initialTerm);

  // ── Advanced inputs ──────────────────────────────────────────
  const [propertyTaxRate, setPropertyTaxRate] = useState<number>(1.1);
  const [insuranceRate, setInsuranceRate] = useState<number>(0.5);
  const [hoaFee, setHoaFee] = useState<number>(0);
  const [pmiRatePct, setPmiRatePct] = useState<number>(0.52);
  const [extraPayment, setExtraPayment] = useState<number>(0);
  const [biweekly, setBiweekly] = useState<boolean>(false);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [showSchedule, setShowSchedule] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // ── Core calculation ─────────────────────────────────────────
  const result = useMemo(
    () => calculateMortgage(loanAmount, interestRate, loanTerm),
    [loanAmount, interestRate, loanTerm]
  );

  // ── Derived monthly costs ────────────────────────────────────
  const ltv = homeValue > 0 ? (loanAmount / homeValue) * 100 : 100;
  const hasPMI = ltv > 80;
  const monthlyPI = result.monthlyPayment;
  const monthlyTax = (homeValue * propertyTaxRate / 100) / 12;
  const monthlyInsurance = (homeValue * insuranceRate / 100) / 12;
  const monthlyPMI = hasPMI ? (loanAmount * pmiRatePct / 100) / 12 : 0;
  const totalMonthly = monthlyPI + monthlyTax + monthlyInsurance + monthlyPMI + hoaFee;

  // ── Extra payment / biweekly savings ────────────────────────
  const extraSavings = useMemo(() => {
    const effectiveExtra = extraPayment + (biweekly ? monthlyPI / 12 : 0);
    if (effectiveExtra <= 0) return null;
    const { months, totalInterest } = calculateWithExtra(loanAmount, interestRate, loanTerm, monthlyPI, effectiveExtra);
    const standardMonths = loanTerm * 12;
    return {
      monthsSaved: standardMonths - months,
      interestSaved: result.totalInterest - totalInterest,
      newMonths: months,
    };
  }, [extraPayment, biweekly, loanAmount, interestRate, loanTerm, monthlyPI, result.totalInterest]);

  // ── Year-by-year summary ─────────────────────────────────────
  const yearlySummary = useMemo(() => {
    const summary: Array<{
      year: number; yearlyPayment: number; yearlyPrincipal: number;
      yearlyInterest: number; endingBalance: number;
    }> = [];
    for (let y = 1; y <= loanTerm; y++) {
      const slice = result.schedule.slice((y - 1) * 12, y * 12);
      if (!slice.length) break;
      summary.push({
        year: y,
        yearlyPayment: slice.reduce((s, r) => s + r.payment, 0),
        yearlyPrincipal: slice.reduce((s, r) => s + r.principal, 0),
        yearlyInterest: slice.reduce((s, r) => s + r.interest, 0),
        endingBalance: slice[slice.length - 1].balance,
      });
    }
    return summary;
  }, [result, loanTerm]);

  const interestPct = result.totalInterest > 0
    ? Math.round((result.totalInterest / result.totalPaid) * 100)
    : 0;
  const principalPct = 100 - interestPct;

  // ── Share / copy link ────────────────────────────────────────
  const handleShare = useCallback(() => {
    try {
      const params = new URLSearchParams({
        loan: String(loanAmount),
        hv: String(homeValue),
        rate: String(interestRate),
        term: String(loanTerm),
      });
      if (extraPayment > 0) params.set('extra', String(extraPayment));
      if (biweekly) params.set('bw', '1');
      const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    } catch { /* clipboard not available */ }
  }, [loanAmount, homeValue, interestRate, loanTerm, extraPayment, biweekly]);

  // ── Breakdown rows ───────────────────────────────────────────
  const breakdownRows = [
    { label: 'Principal & Interest', value: monthlyPI, accent: 'bg-lime-accent/30 border-lime-accent/20' },
    { label: `Property Tax (${propertyTaxRate}%/yr)`, value: monthlyTax, accent: 'bg-cyan-accent/30 border-cyan-accent/20' },
    { label: `Homeowner's Insurance (${insuranceRate}%/yr)`, value: monthlyInsurance, accent: 'bg-yellow-accent/30 border-yellow-accent/20' },
    ...(hasPMI ? [{ label: `PMI (${pmiRatePct}%/yr · drops at 80% LTV)`, value: monthlyPMI, accent: 'bg-pink-accent/20 border-pink-accent/20' }] : []),
    ...(hoaFee > 0 ? [{ label: 'HOA Fees', value: hoaFee, accent: 'bg-violet-100 border-violet-200' }] : []),
  ];

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">

        {/* ── Header ── */}
        <div className="bg-lime-accent border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-2xl flex-shrink-0">🏠</span>
            <h2
              className="!text-lg sm:!text-xl !my-0 !text-ink-900 font-extrabold truncate"
              style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}
            >
              Mortgage Calculator
            </h2>
          </div>
          <CurrencySelect value={currency} onChange={handleCurrencyChange} locked={isLocked} />
        </div>

        {/* ── Core inputs ── */}
        <div className="p-5 sm:p-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 bg-ink-50">
          {/* Home Value */}
          <div>
            <label htmlFor="home-value" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">
              Home Value
            </label>
            <div className="relative">
              <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none ${currency.symbol.length > 1 ? 'text-xs' : ''}`}>
                {currency.symbol}
              </span>
              <input
                id="home-value" type="number" min={1000} step={5000} value={homeValue}
                onChange={(e) => setHomeValue(Number(e.target.value) || 0)}
                className={`w-full ${currency.symbol.length > 1 ? 'pl-12' : 'pl-7'} pr-3 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-cyan-accent transition-all`}
                inputMode="numeric"
              />
            </div>
            <input
              type="range" min={50000} max={5000000} step={5000} value={homeValue}
              onChange={(e) => setHomeValue(Number(e.target.value))}
              className="w-full mt-2 accent-cyan-accent" aria-label="Home value slider"
            />
            <div className={`mt-1.5 inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border-2 ${hasPMI ? 'bg-pink-accent/10 border-pink-accent/40 text-pink-700' : 'bg-emerald-50 border-emerald-300 text-emerald-700'}`}>
              LTV {ltv.toFixed(0)}% {hasPMI ? '· PMI applies' : '· No PMI ✓'}
            </div>
          </div>

          {/* Loan Amount */}
          <div>
            <label htmlFor="loan-amount" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">
              Loan Amount
            </label>
            <div className="relative">
              <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none ${currency.symbol.length > 1 ? 'text-xs' : ''}`}>
                {currency.symbol}
              </span>
              <input
                id="loan-amount" type="number" min={1000} step={1000} value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value) || 0)}
                className={`w-full ${currency.symbol.length > 1 ? 'pl-12' : 'pl-7'} pr-3 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-lime-accent transition-all`}
                inputMode="numeric"
              />
            </div>
            <input
              type="range" min={50000} max={2000000} step={5000} value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full mt-2 accent-lime-accent" aria-label="Loan amount slider"
            />
          </div>

          {/* Interest Rate */}
          <div>
            <label htmlFor="interest-rate" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">
              Interest Rate
            </label>
            <div className="relative">
              <input
                id="interest-rate" type="number" min={0} max={30} step={0.05} value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value) || 0)}
                className="w-full pl-3.5 pr-8 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-pink-accent transition-all"
                inputMode="decimal"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">%</span>
            </div>
            <input
              type="range" min={0.5} max={15} step={0.05} value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full mt-2 accent-pink-accent" aria-label="Interest rate slider"
            />
          </div>

          {/* Loan Term */}
          <div>
            <label htmlFor="loan-term" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">
              Term
            </label>
            <select
              id="loan-term" value={loanTerm}
              onChange={(e) => setLoanTerm(Number(e.target.value))}
              className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-yellow-accent transition-all cursor-pointer"
            >
              {[5, 10, 15, 20, 25, 30, 35, 40].map((y) => (
                <option key={y} value={y}>{y} years</option>
              ))}
            </select>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[15, 20, 30].map((y) => (
                <button
                  key={y} type="button" onClick={() => setLoanTerm(y)}
                  className={`px-2.5 py-1 rounded-full text-xs font-bold border-2 border-ink-900 transition-all ${loanTerm === y ? 'bg-yellow-accent text-ink-900 shadow-sticker-sm' : 'bg-white text-ink-700 hover:bg-yellow-accent/40'}`}
                >
                  {y}y
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Advanced toggle ── */}
        <div className="px-5 sm:px-7 pb-4 bg-ink-50 border-b-[2.5px] border-ink-900">
          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-ink-500 hover:text-ink-900 transition-colors group"
          >
            <span className={`w-5 h-5 rounded-full border-2 border-ink-400 group-hover:border-ink-900 flex items-center justify-center transition-colors ${showAdvanced ? 'bg-ink-900 border-ink-900' : ''}`}>
              <svg className={`w-2.5 h-2.5 transition-transform ${showAdvanced ? 'rotate-180 text-white' : 'text-ink-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
            {showAdvanced ? 'Hide' : 'Add'} taxes, insurance, HOA &amp; extra payment
          </button>
        </div>

        {/* ── Advanced inputs ── */}
        {showAdvanced && (
          <div className="px-5 sm:px-7 py-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 bg-ink-50/60 border-b-[2.5px] border-ink-900">
            {/* Property Tax */}
            <div>
              <label htmlFor="prop-tax" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-1">
                Property Tax <span className="font-normal normal-case tracking-normal text-ink-500">(annual %)</span>
              </label>
              <div className="relative">
                <input
                  id="prop-tax" type="number" min={0} max={5} step={0.05} value={propertyTaxRate}
                  onChange={(e) => setPropertyTaxRate(Number(e.target.value) || 0)}
                  className="w-full pl-3.5 pr-8 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-cyan-accent transition-all"
                  inputMode="decimal"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">%</span>
              </div>
              <p className="text-[10px] text-ink-500 mt-1 font-semibold">{fmt(monthlyTax)}/mo</p>
            </div>

            {/* Insurance */}
            <div>
              <label htmlFor="insurance" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-1">
                Homeowner's Insurance <span className="font-normal normal-case tracking-normal text-ink-500">(annual %)</span>
              </label>
              <div className="relative">
                <input
                  id="insurance" type="number" min={0} max={3} step={0.05} value={insuranceRate}
                  onChange={(e) => setInsuranceRate(Number(e.target.value) || 0)}
                  className="w-full pl-3.5 pr-8 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-cyan-accent transition-all"
                  inputMode="decimal"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">%</span>
              </div>
              <p className="text-[10px] text-ink-500 mt-1 font-semibold">{fmt(monthlyInsurance)}/mo</p>
            </div>

            {/* HOA */}
            <div>
              <label htmlFor="hoa" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-1">
                HOA Fees <span className="font-normal normal-case tracking-normal text-ink-500">(monthly)</span>
              </label>
              <div className="relative">
                <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none ${currency.symbol.length > 1 ? 'text-xs' : ''}`}>
                  {currency.symbol}
                </span>
                <input
                  id="hoa" type="number" min={0} step={25} value={hoaFee}
                  onChange={(e) => setHoaFee(Number(e.target.value) || 0)}
                  className={`w-full ${currency.symbol.length > 1 ? 'pl-12' : 'pl-7'} pr-3 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-cyan-accent transition-all`}
                  inputMode="numeric"
                />
              </div>
            </div>

            {/* PMI Rate (shown only when LTV > 80%) */}
            {hasPMI && (
              <div>
                <label htmlFor="pmi-rate" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-1">
                  PMI Rate <span className="font-normal normal-case tracking-normal text-ink-500">(annual %)</span>
                </label>
                <div className="relative">
                  <input
                    id="pmi-rate" type="number" min={0.1} max={2} step={0.05} value={pmiRatePct}
                    onChange={(e) => setPmiRatePct(Number(e.target.value) || 0.52)}
                    className="w-full pl-3.5 pr-8 py-3 bg-white border-[2.5px] border-pink-accent rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-pink-accent transition-all"
                    inputMode="decimal"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">%</span>
                </div>
                <p className="text-[10px] text-pink-700 mt-1 font-semibold">{fmt(monthlyPMI)}/mo · drops when LTV ≤ 80%</p>
              </div>
            )}

            {/* Extra Monthly Payment */}
            <div>
              <label htmlFor="extra-payment" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-1">
                Extra Monthly Payment
              </label>
              <div className="relative">
                <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none ${currency.symbol.length > 1 ? 'text-xs' : ''}`}>
                  {currency.symbol}
                </span>
                <input
                  id="extra-payment" type="number" min={0} step={50} value={extraPayment}
                  onChange={(e) => setExtraPayment(Number(e.target.value) || 0)}
                  className={`w-full ${currency.symbol.length > 1 ? 'pl-12' : 'pl-7'} pr-3 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-yellow-accent transition-all`}
                  inputMode="numeric"
                />
              </div>
              <input
                type="range" min={0} max={5000} step={50} value={extraPayment}
                onChange={(e) => setExtraPayment(Number(e.target.value))}
                className="w-full mt-2 accent-yellow-accent" aria-label="Extra payment slider"
              />
            </div>

            {/* Payment Schedule */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-1">
                Payment Schedule
              </label>
              <div className="flex rounded-xl border-[2.5px] border-ink-900 overflow-hidden h-[50px]">
                <button
                  type="button" onClick={() => setBiweekly(false)}
                  className={`flex-1 text-sm font-extrabold transition-all ${!biweekly ? 'bg-ink-900 text-white' : 'bg-white text-ink-700 hover:bg-ink-50'}`}
                >
                  Monthly
                </button>
                <button
                  type="button" onClick={() => setBiweekly(true)}
                  className={`flex-1 text-sm font-extrabold border-l-2 border-ink-900 transition-all ${biweekly ? 'bg-ink-900 text-white' : 'bg-white text-ink-700 hover:bg-ink-50'}`}
                >
                  Biweekly
                </button>
              </div>
              {biweekly && (
                <p className="text-[10px] text-ink-500 mt-1 font-semibold">{fmt(monthlyPI / 2)}/2 wks · 26 payments/yr</p>
              )}
            </div>
          </div>
        )}

        {/* ── Main results ── */}
        <div className="p-5 sm:p-7 bg-white grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 border-t-[2.5px] border-ink-900">
          {/* Total monthly (PITI) */}
          <div className="bg-lime-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">
              Total Monthly
            </div>
            <div
              className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-none"
              style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}
            >
              {fmt(totalMonthly)}
            </div>
            <div className="text-xs text-ink-800 mt-2 font-semibold">
              PITI{hoaFee > 0 ? ' + HOA' : ''}
            </div>
          </div>

          {/* P&I */}
          <div className="bg-pink-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-white mb-1">
              Principal + Interest
            </div>
            <div
              className="text-3xl sm:text-4xl font-extrabold text-white leading-none"
              style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}
            >
              {fmt(monthlyPI)}
            </div>
            <div className="text-xs text-white/90 mt-2 font-semibold">
              {interestPct}% goes to interest
            </div>
          </div>

          {/* Total Interest */}
          <div className="bg-yellow-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">
              Total Interest
            </div>
            <div
              className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-none"
              style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}
            >
              {fmt(result.totalInterest)}
            </div>
            <div className="text-xs text-ink-800 mt-2 font-semibold">
              over {loanTerm} years
            </div>
          </div>
        </div>

        {/* ── Monthly breakdown ── */}
        <div className="px-5 sm:px-7 pb-5 bg-white">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mb-3">
            Monthly Breakdown
          </div>
          <div className="bg-ink-50 border-2 border-ink-900 rounded-2xl overflow-hidden">
            {breakdownRows.map((row, i) => (
              <div
                key={row.label}
                className={`flex items-center justify-between px-4 py-2.5 ${row.accent} ${i > 0 ? 'border-t border-ink-200' : ''}`}
              >
                <span className="text-xs font-bold text-ink-700">{row.label}</span>
                <span className="text-sm font-extrabold text-ink-900 ml-2 tabular-nums">{fmt(row.value)}</span>
              </div>
            ))}
            <div className="flex items-center justify-between px-4 py-3 bg-ink-900 border-t-2 border-ink-900">
              <span className="text-xs font-extrabold text-white uppercase tracking-wider">Total Monthly</span>
              <span className="text-sm font-extrabold text-lime-accent tabular-nums">{fmt(totalMonthly)}</span>
            </div>
          </div>
        </div>

        {/* ── Savings insight ── */}
        {extraSavings && extraSavings.monthsSaved > 0 && (
          <div className="px-5 sm:px-7 pb-5 bg-white">
            <div className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-4 flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">🎯</span>
              <div>
                <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 mb-1">
                  {biweekly && extraPayment > 0 ? 'Biweekly + Extra' : biweekly ? 'Biweekly' : 'Extra Payment'} Savings
                </div>
                <p className="text-sm font-bold text-emerald-900">
                  Save <span className="text-emerald-700">{fmt(extraSavings.interestSaved)}</span> in interest. Pay off{' '}
                  <span className="text-emerald-700">{fmtMonths(extraSavings.monthsSaved)}</span> early.
                </p>
                <p className="text-xs text-emerald-600 mt-0.5">
                  Payoff in {fmtMonths(extraSavings.newMonths)} instead of {loanTerm}y.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Principal vs Interest bar ── */}
        <div className="px-5 sm:px-7 pb-5 sm:pb-7 bg-white">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mb-2">
            Principal vs Interest Split
          </div>
          <div className="relative h-10 rounded-full border-[2.5px] border-ink-900 overflow-hidden bg-white">
            <div
              className="absolute inset-y-0 left-0 bg-lime-accent flex items-center justify-center transition-all duration-300"
              style={{ width: `${principalPct}%` }}
            >
              {principalPct >= 15 && (
                <span className="text-[11px] sm:text-xs font-extrabold text-ink-900 whitespace-nowrap px-2">
                  {principalPct}% principal
                </span>
              )}
            </div>
            <div
              className="absolute inset-y-0 right-0 bg-pink-accent flex items-center justify-center transition-all duration-300"
              style={{ width: `${interestPct}%` }}
            >
              {interestPct >= 15 && (
                <span className="text-[11px] sm:text-xs font-extrabold text-white whitespace-nowrap px-2">
                  {interestPct}% interest
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Amortization toggle ── */}
        <div className="px-5 sm:px-7 pb-5 sm:pb-7 bg-white">
          <button
            type="button"
            onClick={() => setShowSchedule((v) => !v)}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border-[2.5px] border-ink-900 font-extrabold text-sm transition-all ${
              showSchedule
                ? 'bg-ink-900 text-white shadow-sticker-sm'
                : 'bg-white text-ink-900 hover:bg-cyan-accent shadow-sticker-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-sticker'
            }`}
          >
            <svg
              className={`w-4 h-4 transition-transform ${showSchedule ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
            {showSchedule ? 'Hide' : 'Show'} amortization schedule
          </button>
        </div>

        {/* ── Amortization table ── */}
        {showSchedule && (
          <div className="px-5 sm:px-7 pb-5 sm:pb-7 bg-white overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-ink-900 text-white">
                <tr>
                  <th className="text-left px-3 py-2.5 font-extrabold uppercase text-xs tracking-wider rounded-tl-xl">Year</th>
                  <th className="text-right px-3 py-2.5 font-extrabold uppercase text-xs tracking-wider">Payment</th>
                  <th className="text-right px-3 py-2.5 font-extrabold uppercase text-xs tracking-wider">Principal</th>
                  <th className="text-right px-3 py-2.5 font-extrabold uppercase text-xs tracking-wider">Interest</th>
                  <th className="text-right px-3 py-2.5 font-extrabold uppercase text-xs tracking-wider rounded-tr-xl">Balance</th>
                </tr>
              </thead>
              <tbody>
                {yearlySummary.map((row, idx) => (
                  <tr key={row.year} className={`border-b-2 border-ink-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-ink-50'}`}>
                    <td className="px-3 py-2.5 font-extrabold text-ink-900">{row.year}</td>
                    <td className="px-3 py-2.5 text-right font-semibold text-ink-900 tabular-nums">{fmt(row.yearlyPayment)}</td>
                    <td className="px-3 py-2.5 text-right font-semibold text-emerald-700 tabular-nums">{fmt(row.yearlyPrincipal)}</td>
                    <td className="px-3 py-2.5 text-right font-semibold text-pink-accent tabular-nums">{fmt(row.yearlyInterest)}</td>
                    <td className="px-3 py-2.5 text-right font-bold text-ink-900 tabular-nums">{fmt(row.endingBalance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Share + Print actions */}
      <div className="px-5 sm:px-7 pb-6 sm:pb-7 bg-white flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleShare}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-ink-900 text-xs font-extrabold transition-all ${
            copied ? 'bg-lime-accent text-ink-900 shadow-sticker-sm' : 'bg-white text-ink-700 hover:bg-lime-accent hover:shadow-sticker-sm'
          }`}
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share this calculation
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-ink-900 bg-white text-ink-700 text-xs font-extrabold hover:bg-ink-100 transition-all"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print
        </button>
      </div>

      {/* Footer note */}
      <div className="text-xs text-ink-500 mt-3 px-1 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="font-bold">✨ Live recalculation</span>
        <span>·</span>
        <span>
          Includes P&amp;I, property tax, insurance{hasPMI ? ', PMI' : ''}{hoaFee > 0 ? ', HOA' : ''}.
          Estimates only. Consult a licensed lender for exact rates.
        </span>
      </div>
    </div>
  );
}
