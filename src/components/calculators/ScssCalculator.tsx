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

/** SCSS runs a 5-year base term. */
const BASE_YEARS = 5;
/** It can be extended once by 3 years, so the full life is 8 years. */
const EXTENDED_YEARS = 8;
/** Statutory floor and ceiling on a single SCSS account. The ceiling rose from
 *  ₹15 lakh to ₹30 lakh in the 2023 Budget. */
const MIN_DEPOSIT = 1000;
const MAX_DEPOSIT = 3000000;
/** Deposits sized in the sensitivity table, so retirees can size a cheque. */
const SIZING_DEPOSITS = [500000, 1000000, 1500000, 3000000];

export default function ScssCalculator() {
  const [deposit, setDeposit] = useState<number>(1500000);
  const [rate, setRate] = useState<number>(8.2);

  /** Clamp the ₹30 lakh ceiling right in the handler so a typed 40,00,000 snaps
   *  back to the legal maximum; the ₹1,000 floor is applied only for the maths. */
  const onDeposit = (raw: number) => {
    const v = Number.isFinite(raw) ? raw : 0;
    setDeposit(Math.min(Math.max(v, 0), MAX_DEPOSIT));
  };

  const safe = useMemo(() => ({
    deposit: clamp(Math.round(deposit), MIN_DEPOSIT, MAX_DEPOSIT),
    rate: clamp(rate, 0, 15),
  }), [deposit, rate]);

  const calc = useMemo(() => {
    const d = safe.deposit;
    const r = safe.rate;
    // Simple interest, paid out quarterly. Nothing compounds.
    const quarterly = (d * r) / 400;
    const monthlyEquivalent = (d * r) / 1200;
    const annual = (d * r) / 100;
    const total5 = annual * BASE_YEARS;
    const total8 = annual * EXTENDED_YEARS;
    return { quarterly, monthlyEquivalent, annual, total5, total8, principal: d };
  }, [safe]);

  const schedule = useMemo(() => {
    const rows: Array<{ year: number; quarterly: number; annual: number; cumulative: number; isExtension: boolean }> = [];
    for (let y = 1; y <= EXTENDED_YEARS; y++) {
      rows.push({
        year: y,
        quarterly: calc.quarterly,
        annual: calc.annual,
        cumulative: calc.annual * y,
        isExtension: y > BASE_YEARS,
      });
    }
    return rows;
  }, [calc]);

  const sizing = useMemo(() => SIZING_DEPOSITS.map((d) => ({
    deposit: d,
    quarterly: (d * safe.rate) / 400,
    monthly: (d * safe.rate) / 1200,
    annual: (d * safe.rate) / 100,
    total5: ((d * safe.rate) / 100) * BASE_YEARS,
  })), [safe.rate]);

  const tdsFlag = calc.annual > 50000;

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        <div className="bg-cyan-accent border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">👴</span>
            <h2 className="!text-lg sm:!text-xl !my-0 !text-ink-900 font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>SCSS Calculator</h2>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink-900">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ink-900 opacity-50"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-ink-900"></span>
            </span>
            Live
          </span>
        </div>

        <div className="p-5 sm:p-7 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 bg-ink-50">
          <div>
            <label htmlFor="scss-deposit" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Deposit Amount</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">₹</span>
              <input id="scss-deposit" type="number" min={MIN_DEPOSIT} max={MAX_DEPOSIT} step={50000} value={deposit} onChange={(e) => onDeposit(Number(e.target.value))}
                className="w-full pl-7 pr-3 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-cyan-accent transition-all"
                inputMode="numeric" />
            </div>
            <input type="range" min={MIN_DEPOSIT} max={MAX_DEPOSIT} step={10000} value={safe.deposit} onChange={(e) => onDeposit(Number(e.target.value))} className="w-full mt-2 accent-cyan-accent" aria-label="Deposit slider" />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[{ l: '₹5L', v: 500000 }, { l: '₹10L', v: 1000000 }, { l: '₹15L', v: 1500000 }, { l: '₹30L max', v: 3000000 }].map((d) => (
                <button key={d.v} type="button" onClick={() => onDeposit(d.v)} className={`px-2.5 py-1 rounded-full text-xs font-bold border-2 border-ink-900 transition-all ${safe.deposit === d.v ? 'bg-cyan-accent text-ink-900 shadow-sticker-sm' : 'bg-white text-ink-700 hover:bg-cyan-accent/40'}`}>
                  {d.l}
                </button>
              ))}
            </div>
            <div className="text-[10px] text-ink-500 mt-1.5 font-bold">₹1,000 minimum · ₹30 lakh is the cap per person (raised from ₹15 lakh in the 2023 Budget)</div>
          </div>
          <div>
            <label htmlFor="scss-rate" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Interest Rate (p.a.)</label>
            <div className="relative">
              <input id="scss-rate" type="number" min={0} max={15} step={0.05} value={rate} onChange={(e) => setRate(Number(e.target.value) || 0)}
                className="w-full pl-3.5 pr-8 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-pink-accent transition-all"
                inputMode="decimal" />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">%</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[7.6, 8, 8.2].map((r) => (
                <button key={r} type="button" onClick={() => setRate(r)} className={`px-2.5 py-1 rounded-full text-xs font-bold border-2 border-ink-900 transition-all ${rate === r ? 'bg-pink-accent text-white shadow-sticker-sm' : 'bg-white text-ink-700 hover:bg-pink-accent/30'}`}>
                  {r}%
                </button>
              ))}
            </div>
            <div className="text-[10px] text-ink-500 mt-1.5 font-bold">8.2% is the rate notified for the current quarter · the Ministry of Finance revises small-savings rates every quarter</div>
          </div>
        </div>

        <div className="p-5 sm:p-7 bg-white grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 border-t-[2.5px] border-ink-900">
          <div className="bg-cyan-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Quarterly Payout</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmtINR(calc.quarterly)}</div>
            <div className="text-xs text-ink-800 mt-2 font-semibold">credited every 3 months</div>
          </div>
          <div className="bg-lime-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Annual Income</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmtINR(calc.annual)}</div>
            <div className="text-xs text-ink-800 mt-2 font-semibold">{fmtINR(calc.monthlyEquivalent)} a month, on average</div>
          </div>
          <div className="bg-pink-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-white mb-1">Interest Over 5 Years</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmtINRShort(calc.total5)}</div>
            <div className="text-xs text-white/90 mt-2 font-semibold">principal {fmtINRShort(calc.principal)} comes back whole</div>
          </div>
        </div>

        {/* The single most misread thing about SCSS: it does not compound. */}
        <div className="px-5 sm:px-7 pb-5 sm:pb-7 bg-white">
          <div className="bg-yellow-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="flex items-start gap-3">
              <span className="text-xl leading-none">💡</span>
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">How the payout works</div>
                <p className="text-sm font-bold text-ink-900 !m-0 leading-snug">
                  SCSS pays <strong>simple interest, out to your bank every quarter</strong>. It does not compound, so the {fmtINR(calc.quarterly)} you receive does not sit in the account earning more. Your {fmtINRShort(calc.principal)} principal is untouched and is returned in full at maturity. Over the 5-year term you draw <strong>{fmtINR(calc.total5)}</strong> as income; extend once by 3 years and the 8-year draw reaches <strong>{fmtINR(calc.total8)}</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payout breakdown: the three cadences plus the 5-vs-8 comparison. */}
        <div className="px-5 sm:px-7 pb-5 sm:pb-7 bg-white">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mb-3">Income at every cadence</div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-ink-50 border-2 border-ink-900 rounded-2xl p-4 text-center">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-500 mb-1">Monthly (equivalent)</div>
              <div className="text-lg sm:text-xl font-extrabold text-ink-900" style={{ fontFamily: 'Inter Tight, Inter, sans-serif' }}>{fmtINR(calc.monthlyEquivalent)}</div>
            </div>
            <div className="bg-ink-50 border-2 border-ink-900 rounded-2xl p-4 text-center">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-500 mb-1">Quarterly (actual)</div>
              <div className="text-lg sm:text-xl font-extrabold text-ink-900" style={{ fontFamily: 'Inter Tight, Inter, sans-serif' }}>{fmtINR(calc.quarterly)}</div>
            </div>
            <div className="bg-ink-50 border-2 border-ink-900 rounded-2xl p-4 text-center">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-500 mb-1">Annual</div>
              <div className="text-lg sm:text-xl font-extrabold text-ink-900" style={{ fontFamily: 'Inter Tight, Inter, sans-serif' }}>{fmtINR(calc.annual)}</div>
            </div>
          </div>
          <div className="text-[11px] text-ink-500 mt-2 font-bold">The monthly figure is the quarterly payout divided by three. SCSS actually credits interest four times a year, not twelve.</div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            <div className="bg-lime-accent/40 border-2 border-ink-900 rounded-2xl p-4">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mb-1">5-year term (base)</div>
              <div className="text-2xl font-extrabold text-ink-900" style={{ fontFamily: 'Inter Tight, Inter, sans-serif' }}>{fmtINR(calc.total5)}</div>
              <div className="text-[11px] text-ink-600 mt-1 font-bold">total income drawn over 20 quarters</div>
            </div>
            <div className="bg-cyan-accent/30 border-2 border-ink-900 rounded-2xl p-4">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mb-1">8-year term (extended once by 3 years)</div>
              <div className="text-2xl font-extrabold text-ink-900" style={{ fontFamily: 'Inter Tight, Inter, sans-serif' }}>{fmtINR(calc.total8)}</div>
              <div className="text-[11px] text-ink-600 mt-1 font-bold">total income drawn over 32 quarters</div>
            </div>
          </div>
        </div>

        {/* Year-by-year draw. Every year is identical since nothing compounds; the
            cumulative column is the useful part. */}
        <div className="px-5 sm:px-7 pb-5 sm:pb-7 bg-white">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mb-3">Year-by-year payout schedule</div>
          <div className="bg-ink-50 border-2 border-ink-900 rounded-2xl overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-ink-900">
                  <th className="text-left px-3 sm:px-4 py-2.5 font-extrabold text-ink-900 text-xs uppercase tracking-wider">Year</th>
                  <th className="text-right px-3 sm:px-4 py-2.5 font-extrabold text-ink-900 text-xs uppercase tracking-wider">Quarterly ×4</th>
                  <th className="text-right px-3 sm:px-4 py-2.5 font-extrabold text-ink-900 text-xs uppercase tracking-wider">Income this year</th>
                  <th className="text-right px-3 sm:px-4 py-2.5 font-extrabold text-ink-900 text-xs uppercase tracking-wider">Cumulative income</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((d) => (
                  <tr key={d.year} className={`border-b border-ink-200 last:border-0 ${d.isExtension ? 'bg-yellow-accent/30' : ''} ${d.year === BASE_YEARS || d.year === EXTENDED_YEARS ? 'font-extrabold' : ''}`}>
                    <td className="px-3 sm:px-4 py-2 font-bold text-ink-800 whitespace-nowrap">
                      {d.year}
                      {d.year === BASE_YEARS && <span className="ml-1.5 text-[10px] font-extrabold uppercase text-cyan-700">matures</span>}
                      {d.year === EXTENDED_YEARS && <span className="ml-1.5 text-[10px] font-extrabold uppercase text-pink-600">extended end</span>}
                    </td>
                    <td className="px-3 sm:px-4 py-2 text-right font-semibold text-ink-600 whitespace-nowrap">{fmtINR(d.quarterly)}</td>
                    <td className="px-3 sm:px-4 py-2 text-right font-bold text-ink-800 whitespace-nowrap">{fmtINR(d.annual)}</td>
                    <td className="px-3 sm:px-4 py-2 text-right font-extrabold text-ink-900 whitespace-nowrap">{fmtINR(d.cumulative)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-[11px] text-ink-500 mt-2 font-bold">Shaded rows are the 3-year extension. The principal of {fmtINRShort(calc.principal)} is not shown here: it is not paid until maturity, and it is returned unchanged.</div>
        </div>

        {/* Sensitivity table: quarterly income at four common deposit sizes. */}
        <div className="px-5 sm:px-7 pb-5 sm:pb-7 bg-white">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mb-3">Quarterly payout by deposit size, at {safe.rate}%</div>
          <div className="bg-ink-50 border-2 border-ink-900 rounded-2xl overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-ink-900">
                  <th className="text-left px-3 sm:px-4 py-2.5 font-extrabold text-ink-900 text-xs uppercase tracking-wider">Deposit</th>
                  <th className="text-right px-3 sm:px-4 py-2.5 font-extrabold text-ink-900 text-xs uppercase tracking-wider">Quarterly</th>
                  <th className="text-right px-3 sm:px-4 py-2.5 font-extrabold text-ink-900 text-xs uppercase tracking-wider">Monthly</th>
                  <th className="text-right px-3 sm:px-4 py-2.5 font-extrabold text-ink-900 text-xs uppercase tracking-wider">Annual</th>
                  <th className="text-right px-3 sm:px-4 py-2.5 font-extrabold text-ink-900 text-xs uppercase tracking-wider">5-yr interest</th>
                </tr>
              </thead>
              <tbody>
                {sizing.map((s) => (
                  <tr key={s.deposit} className={`border-b border-ink-200 last:border-0 ${s.deposit === safe.deposit ? 'bg-cyan-accent/20' : ''}`}>
                    <td className="px-3 sm:px-4 py-2 font-bold text-ink-800 whitespace-nowrap">{fmtINRShort(s.deposit)}</td>
                    <td className="px-3 sm:px-4 py-2 text-right font-extrabold text-ink-900 whitespace-nowrap">{fmtINR(s.quarterly)}</td>
                    <td className="px-3 sm:px-4 py-2 text-right font-semibold text-ink-600 whitespace-nowrap">{fmtINR(s.monthly)}</td>
                    <td className="px-3 sm:px-4 py-2 text-right font-bold text-ink-800 whitespace-nowrap">{fmtINR(s.annual)}</td>
                    <td className="px-3 sm:px-4 py-2 text-right font-bold text-ink-800 whitespace-nowrap">{fmtINR(s.total5)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-[11px] text-ink-500 mt-2 font-bold">₹30 lakh is the most a single person can deposit. A couple can hold one account each, taking a joint household ceiling to ₹60 lakh.</div>

          {/* Tax cue tied to the live numbers. */}
          <div className={`mt-4 border-2 border-ink-900 rounded-2xl p-4 ${tdsFlag ? 'bg-pink-accent/20' : 'bg-lime-accent/30'}`}>
            <div className="flex items-start gap-3">
              <span className="text-lg leading-none">{tdsFlag ? '⚠️' : '✅'}</span>
              <p className="text-sm font-bold text-ink-900 !m-0 leading-snug">
                Your annual interest of {fmtINR(calc.annual)} is {tdsFlag ? 'above' : 'within'} the ₹50,000 senior-citizen threshold, so the bank {tdsFlag ? 'will deduct TDS unless you file Form 15H (and your total income is below the taxable limit)' : 'should not deduct TDS, though the interest is still added to your income and taxed at your slab'}. Section 80TTB lets a senior deduct up to ₹50,000 of interest income a year.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · Senior Citizen Savings Scheme, 2019 · simple interest, paid quarterly, not compounded · rate is notified quarterly, so a projection at one fixed rate is an estimate</div>
    </div>
  );
}
