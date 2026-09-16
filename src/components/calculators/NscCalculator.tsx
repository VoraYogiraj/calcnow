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

/** NSC VIII Issue runs a fixed five-year term, with no partial tenure. */
const TERM_YEARS = 5;
/** The rate notified for the current quarter, used as the default. */
const CURRENT_RATE = 7.7;
/** Section 80C caps the deposit deduction at ₹1.5 lakh a year. */
const SEC_80C_CAP = 150000;
/** A five-year tax-saving bank FD for the honest side-by-side, taxable interest. */
const FD_RATE = 6.5;

export default function NscCalculator() {
  const [amount, setAmount] = useState<number>(100000);
  const [rate, setRate] = useState<number>(CURRENT_RATE);

  const safe = useMemo(() => ({
    // Investment is accepted in multiples of ₹100, minimum ₹1,000, no statutory maximum.
    amount: clamp(Math.round(amount / 100) * 100, 1000, 100000000),
    rate: clamp(rate, 0, 15),
  }), [amount, rate]);

  // Interest compounds annually but is paid only at maturity, so each year's
  // interest is added to the balance and itself earns interest the next year.
  const schedule = useMemo(() => {
    const rows: Array<{ year: number; opening: number; interest: number; closing: number }> = [];
    let balance = safe.amount;
    for (let y = 1; y <= TERM_YEARS; y++) {
      const opening = balance;
      const interest = opening * (safe.rate / 100);
      const closing = opening + interest;
      rows.push({ year: y, opening, interest, closing });
      balance = closing;
    }
    return rows;
  }, [safe]);

  const maturity = schedule[TERM_YEARS - 1].closing;
  const principal = safe.amount;
  const totalInterest = maturity - principal;
  const maxBar = Math.max(maturity, 1);

  // 80C treatment: the deposit qualifies (capped at ₹1.5 lakh). Interest of years
  // 1 to 4 is deemed reinvested and also qualifies for 80C in those years; only the
  // final year's interest is taxable with no fresh 80C shelter.
  const eligibleDeposit = Math.min(principal, SEC_80C_CAP);
  const finalYearInterest = schedule[TERM_YEARS - 1].interest;
  const reinvestedInterest = totalInterest - finalYearInterest;

  // Same money in a five-year tax-saving FD (both 80C, both locked five years).
  const fd = useMemo(() => {
    // Bank FDs compound quarterly; interest here is taxable every year and no TDS on NSC.
    const m = safe.amount * Math.pow(1 + FD_RATE / 400, TERM_YEARS * 4);
    return { maturity: m, interest: m - safe.amount };
  }, [safe.amount]);

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        <div className="bg-lime-accent border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📜</span>
            <h2 className="!text-lg sm:!text-xl !my-0 !text-ink-900 font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>NSC Calculator</h2>
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
            <label htmlFor="nsc-amount" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Investment Amount</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">₹</span>
              <input id="nsc-amount" type="number" min={1000} max={10000000} step={100} value={amount} onChange={(e) => setAmount(Number(e.target.value) || 0)}
                className="w-full pl-7 pr-3 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-lime-accent transition-all"
                inputMode="numeric" />
            </div>
            <input type="range" min={1000} max={1500000} step={100} value={Math.min(safe.amount, 1500000)} onChange={(e) => setAmount(Number(e.target.value))} className="w-full mt-2 accent-lime-500" aria-label="Investment amount slider" />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[10000, 50000, 100000, 150000, 500000].map((a) => (
                <button key={a} type="button" onClick={() => setAmount(a)} className={`px-2.5 py-1 rounded-full text-xs font-bold border-2 border-ink-900 transition-all ${safe.amount === a ? 'bg-lime-accent text-ink-900 shadow-sticker-sm' : 'bg-white text-ink-700 hover:bg-lime-accent/40'}`}>
                  {fmtINRShort(a)}
                </button>
              ))}
            </div>
            <div className="text-[10px] text-ink-500 mt-1.5 font-bold">₹1,000 minimum, in multiples of ₹100, no upper limit</div>
          </div>
          <div>
            <label htmlFor="nsc-rate" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Interest Rate</label>
            <div className="relative">
              <input id="nsc-rate" type="number" min={0} max={15} step={0.05} value={rate} onChange={(e) => setRate(Number(e.target.value) || 0)}
                className="w-full pl-3.5 pr-8 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-cyan-accent transition-all"
                inputMode="decimal" />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">%</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[7.0, 7.7, 8.0].map((r) => (
                <button key={r} type="button" onClick={() => setRate(r)} className={`px-2.5 py-1 rounded-full text-xs font-bold border-2 border-ink-900 transition-all ${safe.rate === r ? 'bg-cyan-accent text-ink-900 shadow-sticker-sm' : 'bg-white text-ink-700 hover:bg-cyan-accent/40'}`}>
                  {r}%
                </button>
              ))}
            </div>
            <div className="text-[10px] text-ink-500 mt-1.5 font-bold">7.7% is the rate notified for the current quarter, the Ministry of Finance resets small-savings rates every quarter</div>
          </div>
        </div>

        <div className="p-5 sm:p-7 bg-white grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 border-t-[2.5px] border-ink-900">
          <div className="bg-lime-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Maturity Amount</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmtINRShort(maturity)}</div>
            <div className="text-xs text-ink-800 mt-2 font-semibold">paid as a lump sum at the end of year 5</div>
          </div>
          <div className="bg-cyan-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">You Invest</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmtINRShort(principal)}</div>
            <div className="text-xs text-ink-800 mt-2 font-semibold">a single deposit, no yearly top-ups</div>
          </div>
          <div className="bg-rose-500 border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-white mb-1">Interest Earned</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmtINRShort(totalInterest)}</div>
            <div className="text-xs text-white/90 mt-2 font-semibold">compounds yearly, paid only at maturity</div>
          </div>
        </div>

        <div className="px-5 sm:px-7 pb-5 sm:pb-7 bg-white">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mb-3">How the balance builds, year by year</div>
          <div className="bg-ink-50 border-2 border-ink-900 rounded-2xl p-4 overflow-x-auto">
            <div className="flex items-end gap-2 h-44 min-w-fit">
              {schedule.map((d) => {
                const totalHeight = (d.closing / maxBar) * 100;
                const principalHeight = d.closing > 0 ? (principal / d.closing) * 100 : 0;
                return (
                  <div key={d.year} className="relative flex-1 min-w-[42px] group"
                    title={`Year ${d.year}: opening ${fmtINR(d.opening)}, interest ${fmtINR(d.interest)}, closing ${fmtINR(d.closing)}`}>
                    <div className="relative w-full border-r border-ink-900 transition-all hover:opacity-80 rounded-t-sm" style={{ height: `${totalHeight}%`, backgroundColor: '#f43f5e' }}>
                      <div className="absolute bottom-0 inset-x-0 bg-cyan-accent" style={{ height: `${principalHeight}%` }} />
                    </div>
                    <div className="text-center text-[10px] font-bold text-ink-600 mt-1">Y{d.year}</div>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-[11px] font-bold">
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-cyan-accent border border-ink-900 rounded-sm"></span><span className="text-ink-700">Your original deposit</span></div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 border border-ink-900 rounded-sm" style={{ backgroundColor: '#f43f5e' }}></span><span className="text-ink-700">Accrued interest</span></div>
            </div>
          </div>

          <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mt-6 mb-3">Five-year accrual schedule</div>
          <div className="bg-ink-50 border-2 border-ink-900 rounded-2xl overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-ink-900">
                  <th className="text-left px-3 sm:px-4 py-2.5 font-extrabold text-ink-900 text-xs uppercase tracking-wider">Year</th>
                  <th className="text-right px-3 sm:px-4 py-2.5 font-extrabold text-ink-900 text-xs uppercase tracking-wider">Opening balance</th>
                  <th className="text-right px-3 sm:px-4 py-2.5 font-extrabold text-ink-900 text-xs uppercase tracking-wider">Interest this year</th>
                  <th className="text-right px-3 sm:px-4 py-2.5 font-extrabold text-ink-900 text-xs uppercase tracking-wider">Closing balance</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((d) => (
                  <tr key={d.year} className={`border-b border-ink-200 last:border-0 ${d.year === TERM_YEARS ? 'font-extrabold bg-lime-accent/30' : ''}`}>
                    <td className="px-3 sm:px-4 py-2 font-bold text-ink-800 whitespace-nowrap">
                      {d.year}
                      {d.year === TERM_YEARS && <span className="ml-1.5 text-[10px] font-extrabold uppercase text-rose-600">matures</span>}
                    </td>
                    <td className="px-3 sm:px-4 py-2 text-right font-bold text-ink-800 whitespace-nowrap">{fmtINR(d.opening)}</td>
                    <td className="px-3 sm:px-4 py-2 text-right font-bold text-ink-800 whitespace-nowrap">{fmtINR(d.interest)}</td>
                    <td className="px-3 sm:px-4 py-2 text-right font-extrabold text-ink-900 whitespace-nowrap">{fmtINR(d.closing)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-[11px] text-ink-500 mt-2 font-bold">Maturity value M = P × (1 + r/100)^5. No interest is paid out along the way, it all rides on the certificate to year 5.</div>

          {/* The 80C deemed-reinvestment nuance is the part most guides get wrong. */}
          <div className="mt-6 bg-yellow-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="flex items-start gap-3">
              <span className="text-xl leading-none">🧾</span>
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">The 80C twist on reinvested interest</div>
                <p className="text-sm font-bold text-ink-900 !m-0 leading-snug">
                  Your deposit of <strong>{fmtINR(eligibleDeposit)}</strong> claims Section 80C in year 1{principal > SEC_80C_CAP ? ` (the ₹1.5 lakh cap trims the rest of your ${fmtINR(principal)})` : ''}. The interest of years 1 to 4, <strong>{fmtINR(reinvestedInterest)}</strong> in all, is deemed reinvested and can be claimed under 80C again in each of those years, within the same ₹1.5 lakh ceiling. Only the final year's interest, <strong>{fmtINR(finalYearInterest)}</strong>, is taxable with no fresh 80C shelter. NSC has no TDS, so nothing is deducted at source, but the interest is still taxable in your hands.
                </p>
              </div>
            </div>
          </div>

          <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mt-6 mb-3">{fmtINR(principal)} for 5 years: NSC vs tax-saving FD vs PPF</div>
          <div className="bg-ink-50 border-2 border-ink-900 rounded-2xl overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-ink-900">
                  <th className="text-left px-4 py-2.5 font-extrabold text-ink-900 text-xs uppercase tracking-wider"></th>
                  <th className="text-right px-4 py-2.5 font-extrabold text-ink-900 text-xs uppercase tracking-wider">NSC</th>
                  <th className="text-right px-4 py-2.5 font-extrabold text-ink-900 text-xs uppercase tracking-wider">5-yr tax-saving FD</th>
                  <th className="text-right px-4 py-2.5 font-extrabold text-ink-900 text-xs uppercase tracking-wider">PPF</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-ink-200">
                  <td className="px-4 py-2.5 font-bold text-ink-800">Lock-in</td>
                  <td className="px-4 py-2.5 text-right font-extrabold text-ink-900">5 years</td>
                  <td className="px-4 py-2.5 text-right font-extrabold text-ink-900">5 years</td>
                  <td className="px-4 py-2.5 text-right font-extrabold text-ink-900">15 years</td>
                </tr>
                <tr className="border-b border-ink-200">
                  <td className="px-4 py-2.5 font-bold text-ink-800">80C on deposit</td>
                  <td className="px-4 py-2.5 text-right font-extrabold text-ink-900">Yes</td>
                  <td className="px-4 py-2.5 text-right font-extrabold text-ink-900">Yes</td>
                  <td className="px-4 py-2.5 text-right font-extrabold text-ink-900">Yes</td>
                </tr>
                <tr className="border-b border-ink-200">
                  <td className="px-4 py-2.5 font-bold text-ink-800">Interest taxable</td>
                  <td className="px-4 py-2.5 text-right font-extrabold text-ink-900">Yes, mostly 80C-shielded</td>
                  <td className="px-4 py-2.5 text-right font-extrabold text-ink-900">Yes, fully</td>
                  <td className="px-4 py-2.5 text-right font-extrabold text-ink-900">No, tax-free</td>
                </tr>
                <tr className="border-b border-ink-200">
                  <td className="px-4 py-2.5 font-bold text-ink-800">TDS</td>
                  <td className="px-4 py-2.5 text-right font-extrabold text-ink-900">None</td>
                  <td className="px-4 py-2.5 text-right font-extrabold text-ink-900">Yes, above ₹40k</td>
                  <td className="px-4 py-2.5 text-right font-extrabold text-ink-900">None</td>
                </tr>
                <tr className="bg-lime-accent/40">
                  <td className="px-4 py-2.5 font-bold text-ink-800">Value at year 5</td>
                  <td className="px-4 py-2.5 text-right font-extrabold text-ink-900">{fmtINR(maturity)}</td>
                  <td className="px-4 py-2.5 text-right font-extrabold text-ink-900">{fmtINR(fd.maturity)}</td>
                  <td className="px-4 py-2.5 text-right font-extrabold text-ink-900">still locked</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-[11px] sm:text-xs text-ink-600 font-semibold mt-3 !mb-0 leading-relaxed">
            NSC and a 5-year tax-saving FD are the closest match: both give 80C, both lock for five years. The FD figure above assumes a {FD_RATE}% rate compounded quarterly, and its interest is taxable every year with TDS once it crosses ₹40,000, so a top-slab saver keeps less than the headline. NSC has no TDS and its years 1 to 4 interest can be re-claimed under 80C. PPF sits in a different bracket: a 15-year lock-in, but fully tax-free interest and maturity. Full workings in the <a href="/finance/fd-calculator/" className="font-bold text-ink-900 underline">FD calculator</a> and the <a href="/finance/ppf-calculator/" className="font-bold text-ink-900 underline">PPF calculator</a>.
          </p>
        </div>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · National Savings Certificate (VIII Issue) · the rate is notified quarterly, so a 5-year projection at one fixed rate is an estimate, not a promise</div>
    </div>
  );
}
