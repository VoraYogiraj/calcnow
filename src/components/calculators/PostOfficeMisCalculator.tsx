import { useState, useMemo } from 'react';

function fmtINR(n: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}
function fmtINRShort(value: number): string {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
  return `₹${Math.round(value).toLocaleString('en-IN')}`;
}
function clamp(n: number, lo: number, hi: number): number {
  if (!Number.isFinite(n)) return lo;
  return Math.min(hi, Math.max(lo, n));
}

/** POMIS runs for a fixed 5-year term. */
const TERM_YEARS = 5;
/** Single-account ceiling, raised from ₹4.5L in the 2023 Budget. */
const SINGLE_MAX = 900000;
/** Joint-account ceiling, raised from ₹9L in the 2023 Budget. */
const JOINT_MAX = 1500000;
/** Minimum deposit, accepted in multiples of ₹1,000. */
const MIN_DEPOSIT = 1000;

type AccountType = 'single' | 'joint';

export default function PostOfficeMisCalculator() {
  const [deposit, setDeposit] = useState<number>(900000);
  const [accountType, setAccountType] = useState<AccountType>('single');
  const [rate, setRate] = useState<number>(7.4);

  const activeMax = accountType === 'single' ? SINGLE_MAX : JOINT_MAX;

  const safe = useMemo(() => {
    // POMIS deposits are accepted only in multiples of ₹1,000, so round then clamp.
    const rounded = Math.round((Number(deposit) || 0) / 1000) * 1000;
    return {
      deposit: clamp(rounded, MIN_DEPOSIT, activeMax),
      rate: clamp(Number(rate) || 0, 0, 15),
    };
  }, [deposit, rate, activeMax]);

  const result = useMemo(() => {
    const monthly = (safe.deposit * safe.rate) / 1200;
    const annual = (safe.deposit * safe.rate) / 100;
    const quarterly = monthly * 3;
    const totalInterest = annual * TERM_YEARS;
    return {
      monthly,
      quarterly,
      annual,
      totalInterest,
      principalReturned: safe.deposit,
      totalReceived: safe.deposit + totalInterest,
    };
  }, [safe]);

  // Sensitivity: monthly income at the current rate across the four headline deposits.
  const sensitivity = useMemo(() => {
    return [
      { label: '₹1 lakh', note: 'entry ticket', deposit: 100000 },
      { label: '₹4.5 lakh', note: 'old single cap', deposit: 450000 },
      { label: '₹9 lakh', note: 'single-account max', deposit: 900000 },
      { label: '₹15 lakh', note: 'joint-account max', deposit: 1500000 },
    ].map((row) => ({
      ...row,
      monthly: (row.deposit * safe.rate) / 1200,
      annual: (row.deposit * safe.rate) / 100,
      active: row.deposit === safe.deposit,
    }));
  }, [safe.rate, safe.deposit]);

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        <div className="bg-yellow-accent border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📮</span>
            <h2 className="!text-lg sm:!text-xl !my-0 !text-ink-900 font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>Post Office MIS Calculator</h2>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink-900">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ink-900 opacity-50"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-ink-900"></span>
            </span>
            Live
          </span>
        </div>

        <div className="p-5 sm:p-7 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 bg-ink-50">
          <div>
            <label htmlFor="mis-deposit" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Deposit Amount</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">₹</span>
              <input id="mis-deposit" type="number" min={MIN_DEPOSIT} max={activeMax} step={1000} value={deposit} onChange={(e) => setDeposit(Number(e.target.value) || 0)}
                className="w-full pl-7 pr-3 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-yellow-accent transition-all"
                inputMode="numeric" />
            </div>
            <input type="range" min={MIN_DEPOSIT} max={activeMax} step={1000} value={safe.deposit} onChange={(e) => setDeposit(Number(e.target.value))} className="w-full mt-2 accent-yellow-accent" aria-label="Deposit amount slider" />
            <div className="text-[10px] text-ink-500 mt-1.5 font-bold">₹1,000 minimum, in multiples of ₹1,000 · {accountType === 'single' ? '₹9 lakh single-account cap' : '₹15 lakh joint-account cap'}</div>
          </div>
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Account Type</label>
            <div className="grid grid-cols-2 gap-2">
              {([
                { v: 'single' as AccountType, l: 'Single', cap: '₹9L' },
                { v: 'joint' as AccountType, l: 'Joint', cap: '₹15L' },
              ]).map((a) => (
                <button key={a.v} type="button" onClick={() => setAccountType(a.v)} className={`py-2.5 px-2 rounded-xl border-2 border-ink-900 text-xs font-extrabold transition-all ${accountType === a.v ? 'bg-ink-900 text-white shadow-sticker-sm' : 'bg-white text-ink-700 hover:bg-yellow-accent/40'}`}>
                  <span className="block">{a.l}</span>
                  <span className={`block text-[10px] font-bold ${accountType === a.v ? 'text-white/80' : 'text-ink-500'}`}>max {a.cap}</span>
                </button>
              ))}
            </div>
            <div className="text-[10px] text-ink-500 mt-1.5 font-bold">Joint accounts allow up to three adults; the ₹15 lakh cap is shared</div>
          </div>
          <div>
            <label htmlFor="mis-rate" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Interest Rate (p.a.)</label>
            <div className="relative">
              <input id="mis-rate" type="number" min={0} max={15} step={0.05} value={rate} onChange={(e) => setRate(Number(e.target.value) || 0)}
                className="w-full pl-3.5 pr-8 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-cyan-accent transition-all"
                inputMode="decimal" />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">%</span>
            </div>
            <div className="text-[10px] text-ink-500 mt-1.5 font-bold">7.4% is the rate notified for the current quarter · the Ministry of Finance resets small-savings rates every quarter</div>
          </div>
        </div>

        <div className="p-5 sm:p-7 bg-white grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 border-t-[2.5px] border-ink-900">
          <div className="bg-lime-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Monthly Income</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmtINR(result.monthly)}</div>
            <div className="text-xs text-ink-800 mt-2 font-semibold">paid every month for 5 years</div>
          </div>
          <div className="bg-cyan-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Annual Income</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmtINR(result.annual)}</div>
            <div className="text-xs text-ink-800 mt-2 font-semibold">12 monthly payouts a year</div>
          </div>
          <div className="bg-pink-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-white mb-1">Interest Over 5 Years</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmtINR(result.totalInterest)}</div>
            <div className="text-xs text-white/90 mt-2 font-semibold">on top of your deposit back</div>
          </div>
        </div>

        {/* The payout breakdown is the unique computed content: nothing compounds, principal comes back whole. */}
        <div className="px-5 sm:px-7 pb-5 sm:pb-7 bg-white">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mb-3">Your payout, broken down</div>
          <div className="bg-ink-50 border-2 border-ink-900 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-ink-200">
                  <td className="px-4 py-3 font-bold text-ink-800">Monthly income</td>
                  <td className="px-4 py-3 text-right font-extrabold text-ink-900 whitespace-nowrap">{fmtINR(result.monthly)}</td>
                </tr>
                <tr className="border-b border-ink-200">
                  <td className="px-4 py-3 font-bold text-ink-800">Quarterly equivalent</td>
                  <td className="px-4 py-3 text-right font-extrabold text-ink-900 whitespace-nowrap">{fmtINR(result.quarterly)}</td>
                </tr>
                <tr className="border-b border-ink-200">
                  <td className="px-4 py-3 font-bold text-ink-800">Annual income</td>
                  <td className="px-4 py-3 text-right font-extrabold text-ink-900 whitespace-nowrap">{fmtINR(result.annual)}</td>
                </tr>
                <tr className="border-b border-ink-200">
                  <td className="px-4 py-3 font-bold text-ink-800">Total interest over 5 years</td>
                  <td className="px-4 py-3 text-right font-extrabold text-ink-900 whitespace-nowrap">{fmtINR(result.totalInterest)}</td>
                </tr>
                <tr className="border-b border-ink-200">
                  <td className="px-4 py-3 font-bold text-ink-800">Principal returned at maturity</td>
                  <td className="px-4 py-3 text-right font-extrabold text-ink-900 whitespace-nowrap">{fmtINR(result.principalReturned)}</td>
                </tr>
                <tr className="bg-lime-accent/40">
                  <td className="px-4 py-3 font-bold text-ink-800">Total you receive (payouts + principal)</td>
                  <td className="px-4 py-3 text-right font-extrabold text-ink-900 whitespace-nowrap">{fmtINR(result.totalReceived)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-3 bg-yellow-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="flex items-start gap-3">
              <span className="text-xl leading-none">📌</span>
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Nothing compounds here</div>
                <p className="text-sm font-bold text-ink-900 !m-0 leading-snug">
                  POMIS pays interest out every month, so it never rolls back into the balance. Your full <strong>{fmtINR(result.principalReturned)}</strong> deposit is returned intact at the end of year 5. That is the trade: guaranteed monthly cash flow instead of compounding growth. If you want the money to grow, sweep each payout into an RD or SIP.
                </p>
              </div>
            </div>
          </div>

          <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mt-6 mb-3">Monthly income by deposit, at {safe.rate}%</div>
          <div className="bg-ink-50 border-2 border-ink-900 rounded-2xl overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-ink-900">
                  <th className="text-left px-4 py-2.5 font-extrabold text-ink-900 text-xs uppercase tracking-wider">Deposit</th>
                  <th className="text-right px-4 py-2.5 font-extrabold text-ink-900 text-xs uppercase tracking-wider">Monthly income</th>
                  <th className="text-right px-4 py-2.5 font-extrabold text-ink-900 text-xs uppercase tracking-wider">Annual income</th>
                </tr>
              </thead>
              <tbody>
                {sensitivity.map((row) => (
                  <tr key={row.deposit} className={`border-b border-ink-200 last:border-0 ${row.active ? 'bg-lime-accent/40' : ''}`}>
                    <td className="px-4 py-2.5 font-bold text-ink-800 whitespace-nowrap">
                      {row.label}
                      <span className="ml-1.5 text-[10px] font-bold text-ink-500 uppercase tracking-wide">{row.note}</span>
                    </td>
                    <td className="px-4 py-2.5 text-right font-extrabold text-ink-900 whitespace-nowrap">{fmtINR(row.monthly)}</td>
                    <td className="px-4 py-2.5 text-right font-bold text-ink-700 whitespace-nowrap">{fmtINR(row.annual)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-[11px] text-ink-500 mt-2 font-bold">Figures scale straight-line with the rate: monthly income = deposit × rate ÷ 1200. No TDS is deducted, but the interest is fully taxable at your slab.</div>
        </div>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · Post Office Monthly Income Scheme · 5-year fixed term · rate is notified quarterly, so a mid-term reset changes only new accounts, not yours</div>
    </div>
  );
}
