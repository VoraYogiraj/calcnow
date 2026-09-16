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

/** Deposits are accepted only for the first 15 years from the date of opening. */
const DEPOSIT_YEARS = 15;
/** The account matures 21 years from opening, so years 16–21 compound with no fresh money. */
const TERM_YEARS = 21;
/** The account is assumed to be opened in the current year. */
const OPENING_YEAR = 2026;
/** PPF rate used for the side-by-side, for the January–March 2026 quarter. */
const PPF_RATE = 7.1;

export default function SukanyaSamriddhiCalculator() {
  const [annualDeposit, setAnnualDeposit] = useState<number>(150000);
  const [girlAge, setGirlAge] = useState<number>(5);
  const [rate, setRate] = useState<number>(8.2);

  const safe = useMemo(() => ({
    deposit: clamp(Math.round(annualDeposit), 250, 150000),
    age: clamp(Math.round(girlAge), 0, 10),
    rate: clamp(rate, 0, 15),
  }), [annualDeposit, girlAge, rate]);

  const schedule = useMemo(() => {
    const rows: Array<{
      year: number; endYear: number; girlAge: number; depositThisYear: number;
      openingBalance: number; interest: number; balance: number;
      totalDeposited: number; totalInterest: number; isDepositYear: boolean;
    }> = [];
    let balance = 0;
    let totalDeposited = 0;
    for (let y = 1; y <= TERM_YEARS; y++) {
      const isDepositYear = y <= DEPOSIT_YEARS;
      const depositThisYear = isDepositYear ? safe.deposit : 0;
      balance += depositThisYear;
      totalDeposited += depositThisYear;
      const openingBalance = balance;
      balance = balance * (1 + safe.rate / 100);
      rows.push({
        year: y,
        endYear: OPENING_YEAR + y,
        girlAge: safe.age + y,
        depositThisYear,
        openingBalance,
        interest: balance - openingBalance,
        balance,
        totalDeposited,
        totalInterest: balance - totalDeposited,
        isDepositYear,
      });
    }
    return rows;
  }, [safe]);

  const atYear15 = schedule[DEPOSIT_YEARS - 1];
  const final = schedule[TERM_YEARS - 1];
  const maturity = final.balance;
  const totalDeposited = final.totalDeposited;
  const totalInterest = maturity - totalDeposited;
  const silentGrowth = maturity - atYear15.balance;
  const ageAtMaturity = safe.age + TERM_YEARS;
  const maturityYear = OPENING_YEAR + TERM_YEARS;
  const maxBalance = Math.max(maturity, 1);

  /** Same annual deposit parked in PPF, which stops at its own 15-year term. */
  const ppf = useMemo(() => {
    let b = 0;
    for (let y = 1; y <= 15; y++) {
      b += safe.deposit;
      b *= 1 + PPF_RATE / 100;
    }
    return { maturity: b, deposited: safe.deposit * 15, interest: b - safe.deposit * 15 };
  }, [safe.deposit]);

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        <div className="bg-rose-500 border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌸</span>
            <h2 className="!text-lg sm:!text-xl !my-0 !text-white font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>Sukanya Samriddhi Calculator</h2>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-50"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            Live
          </span>
        </div>

        <div className="p-5 sm:p-7 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 bg-ink-50">
          <div>
            <label htmlFor="ssy-deposit" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Deposit Per Year</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">₹</span>
              <input id="ssy-deposit" type="number" min={250} max={150000} step={250} value={annualDeposit} onChange={(e) => setAnnualDeposit(Number(e.target.value) || 0)}
                className="w-full pl-7 pr-3 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-rose-300 transition-all"
                inputMode="numeric" />
            </div>
            <input type="range" min={250} max={150000} step={250} value={safe.deposit} onChange={(e) => setAnnualDeposit(Number(e.target.value))} className="w-full mt-2 accent-rose-500" aria-label="Annual deposit slider" />
            <div className="text-[10px] text-ink-500 mt-1.5 font-bold">₹250 keeps it active · ₹1.5 lakh is the yearly ceiling</div>
          </div>
          <div>
            <label htmlFor="ssy-age" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Daughter's Age Today</label>
            <input id="ssy-age" type="number" min={0} max={10} step={1} value={girlAge} onChange={(e) => setGirlAge(Number(e.target.value) || 0)}
              className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-yellow-accent transition-all"
              inputMode="numeric" />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[0, 1, 3, 5, 8].map((a) => (
                <button key={a} type="button" onClick={() => setGirlAge(a)} className={`px-2.5 py-1 rounded-full text-xs font-bold border-2 border-ink-900 transition-all ${safe.age === a ? 'bg-yellow-accent text-ink-900 shadow-sticker-sm' : 'bg-white text-ink-700 hover:bg-yellow-accent/40'}`}>
                  {a === 0 ? 'Newborn' : `${a}y`}
                </button>
              ))}
            </div>
            <div className="text-[10px] text-ink-500 mt-1.5 font-bold">She must be under 10 on the opening date</div>
          </div>
          <div>
            <label htmlFor="ssy-rate" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Interest Rate</label>
            <div className="relative">
              <input id="ssy-rate" type="number" min={0} max={15} step={0.05} value={rate} onChange={(e) => setRate(Number(e.target.value) || 0)}
                className="w-full pl-3.5 pr-8 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-cyan-accent transition-all"
                inputMode="decimal" />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">%</span>
            </div>
            <div className="text-[10px] text-ink-500 mt-1.5 font-bold">8.2% is the rate notified for the current quarter · the Ministry of Finance resets small-savings rates every quarter</div>
          </div>
        </div>

        <div className="p-5 sm:p-7 bg-white grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 border-t-[2.5px] border-ink-900">
          <div className="bg-lime-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Maturity Amount</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmtINRShort(maturity)}</div>
            <div className="text-xs text-ink-800 mt-2 font-semibold">in {maturityYear}, when she turns {ageAtMaturity}</div>
          </div>
          <div className="bg-cyan-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">You Put In</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmtINRShort(totalDeposited)}</div>
            <div className="text-xs text-ink-800 mt-2 font-semibold">{fmtINR(safe.deposit)} × 15 years</div>
          </div>
          <div className="bg-rose-500 border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-white mb-1">Interest Earned</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmtINRShort(totalInterest)}</div>
            <div className="text-xs text-white/90 mt-2 font-semibold">EEE: none of it is taxed</div>
          </div>
        </div>

        {/* The 15-vs-21 gap is what most people get wrong, so it gets its own panel. */}
        <div className="px-5 sm:px-7 pb-5 sm:pb-7 bg-white">
          <div className="bg-yellow-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="flex items-start gap-3">
              <span className="text-xl leading-none">⏳</span>
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">The six silent years</div>
                <p className="text-sm font-bold text-ink-900 !m-0 leading-snug">
                  Your last deposit lands in year 15, when the balance is <strong>{fmtINR(atYear15.balance)}</strong>. Nothing more goes in, yet the account keeps compounding to <strong>{fmtINR(maturity)}</strong> by year 21, <strong>{fmtINR(silentGrowth)}</strong> earned without a rupee of fresh money. Closing early throws that away.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 sm:px-7 pb-5 sm:pb-7 bg-white">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mb-3">21 years of the account, year by year</div>
          <div className="bg-ink-50 border-2 border-ink-900 rounded-2xl p-4 overflow-x-auto">
            <div className="flex items-end gap-1 h-48 min-w-fit">
              {schedule.map((d) => {
                const totalHeight = (d.balance / maxBalance) * 100;
                const depositHeight = d.balance > 0 ? (d.totalDeposited / d.balance) * 100 : 0;
                return (
                  <div key={d.year} className={`relative flex-1 min-w-[14px] group ${d.year === 16 ? 'ml-3 border-l-2 border-dashed border-ink-900 pl-2' : ''}`}
                    title={`Year ${d.year} (age ${d.girlAge}): ${d.isDepositYear ? `deposit ${fmtINR(d.depositThisYear)}` : 'no deposit, growth only'}, balance ${fmtINR(d.balance)}`}>
                    <div
                      className="relative w-full border-r border-ink-900 transition-all hover:opacity-80"
                      style={
                        d.isDepositYear
                          ? { height: `${totalHeight}%`, backgroundColor: '#f43f5e' }
                          : { height: `${totalHeight}%`, backgroundImage: 'repeating-linear-gradient(45deg, #f43f5e 0 5px, #fda4af 5px 10px)' }
                      }
                    >
                      <div className="absolute bottom-0 inset-x-0 bg-cyan-accent" style={{ height: `${depositHeight}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-3 text-[10px] font-bold text-ink-600">
              <span>Year 1: deposits start</span>
              <span>Year 15: deposits stop</span>
              <span>Year 21: maturity</span>
            </div>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-[11px] font-bold">
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-cyan-accent border border-ink-900 rounded-sm"></span><span className="text-ink-700">What you deposited</span></div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 border border-ink-900 rounded-sm" style={{ backgroundColor: '#f43f5e' }}></span><span className="text-ink-700">Interest, deposit years 1–15</span></div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 border border-ink-900 rounded-sm" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #f43f5e 0 4px, #fda4af 4px 8px)' }}></span><span className="text-ink-700">Growth-only years 16–21</span></div>
            </div>
          </div>

          <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mt-6 mb-3">Full 21-year schedule</div>
          <div className="bg-ink-50 border-2 border-ink-900 rounded-2xl overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-ink-50">
                <tr className="border-b-2 border-ink-900">
                  <th className="text-left px-3 sm:px-4 py-2.5 font-extrabold text-ink-900 text-xs uppercase tracking-wider">Year</th>
                  <th className="text-left px-3 sm:px-4 py-2.5 font-extrabold text-ink-900 text-xs uppercase tracking-wider">Her age</th>
                  <th className="text-right px-3 sm:px-4 py-2.5 font-extrabold text-ink-900 text-xs uppercase tracking-wider">Deposit</th>
                  <th className="text-right px-3 sm:px-4 py-2.5 font-extrabold text-ink-900 text-xs uppercase tracking-wider">Interest</th>
                  <th className="text-right px-3 sm:px-4 py-2.5 font-extrabold text-ink-900 text-xs uppercase tracking-wider">Balance</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((d) => (
                  <tr key={d.year} className={`border-b border-ink-200 last:border-0 ${d.isDepositYear ? '' : 'bg-yellow-accent/30'} ${d.year === TERM_YEARS ? 'font-extrabold' : ''}`}>
                    <td className="px-3 sm:px-4 py-2 font-bold text-ink-800 whitespace-nowrap">
                      {d.year}
                      {d.year === TERM_YEARS && <span className="ml-1.5 text-[10px] font-extrabold uppercase text-rose-600">matures</span>}
                    </td>
                    <td className="px-3 sm:px-4 py-2 font-semibold text-ink-600 whitespace-nowrap">{d.girlAge}</td>
                    <td className="px-3 sm:px-4 py-2 text-right font-bold text-ink-800 whitespace-nowrap">{d.isDepositYear ? fmtINR(d.depositThisYear) : <span className="text-ink-500">no deposit</span>}</td>
                    <td className="px-3 sm:px-4 py-2 text-right font-bold text-ink-800 whitespace-nowrap">{fmtINR(d.interest)}</td>
                    <td className="px-3 sm:px-4 py-2 text-right font-extrabold text-ink-900 whitespace-nowrap">{fmtINR(d.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-[11px] text-ink-500 mt-2 font-bold">Shaded rows are years 16–21: no deposit is accepted, interest is still credited.</div>

          <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mt-6 mb-3">Same {fmtINR(safe.deposit)} a year: SSY vs PPF</div>
          <div className="bg-ink-50 border-2 border-ink-900 rounded-2xl overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-ink-900">
                  <th className="text-left px-4 py-2.5 font-extrabold text-ink-900 text-xs uppercase tracking-wider"></th>
                  <th className="text-right px-4 py-2.5 font-extrabold text-ink-900 text-xs uppercase tracking-wider">Sukanya Samriddhi</th>
                  <th className="text-right px-4 py-2.5 font-extrabold text-ink-900 text-xs uppercase tracking-wider">PPF</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-ink-200">
                  <td className="px-4 py-2.5 font-bold text-ink-800">Rate this quarter</td>
                  <td className="px-4 py-2.5 text-right font-extrabold text-ink-900">{safe.rate}%</td>
                  <td className="px-4 py-2.5 text-right font-extrabold text-ink-900">{PPF_RATE}%</td>
                </tr>
                <tr className="border-b border-ink-200">
                  <td className="px-4 py-2.5 font-bold text-ink-800">Deposit years</td>
                  <td className="px-4 py-2.5 text-right font-extrabold text-ink-900">15</td>
                  <td className="px-4 py-2.5 text-right font-extrabold text-ink-900">15</td>
                </tr>
                <tr className="border-b border-ink-200">
                  <td className="px-4 py-2.5 font-bold text-ink-800">Term before payout</td>
                  <td className="px-4 py-2.5 text-right font-extrabold text-ink-900">21 years</td>
                  <td className="px-4 py-2.5 text-right font-extrabold text-ink-900">15 years</td>
                </tr>
                <tr className="border-b border-ink-200">
                  <td className="px-4 py-2.5 font-bold text-ink-800">Total deposited</td>
                  <td className="px-4 py-2.5 text-right font-extrabold text-ink-900">{fmtINR(totalDeposited)}</td>
                  <td className="px-4 py-2.5 text-right font-extrabold text-ink-900">{fmtINR(ppf.deposited)}</td>
                </tr>
                <tr className="border-b border-ink-200">
                  <td className="px-4 py-2.5 font-bold text-ink-800">Interest earned</td>
                  <td className="px-4 py-2.5 text-right font-extrabold text-ink-900">{fmtINR(totalInterest)}</td>
                  <td className="px-4 py-2.5 text-right font-extrabold text-ink-900">{fmtINR(ppf.interest)}</td>
                </tr>
                <tr className="bg-lime-accent/40">
                  <td className="px-4 py-2.5 font-bold text-ink-800">Amount you receive</td>
                  <td className="px-4 py-2.5 text-right font-extrabold text-ink-900">{fmtINR(maturity)}</td>
                  <td className="px-4 py-2.5 text-right font-extrabold text-ink-900">{fmtINR(ppf.maturity)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-[11px] sm:text-xs text-ink-600 font-semibold mt-3 !mb-0 leading-relaxed">
            Not a like-for-like race. SSY wins on two counts at once (a higher notified rate and six extra compounding years), so roughly {maturity > ppf.maturity ? fmtINR(maturity - ppf.maturity) : fmtINR(0)} of the gap comes from term as much as from rate. A PPF account extended in 5-year blocks past year 15 keeps compounding too, and PPF has no age or gender condition, no 15-year deposit cut-off, and can be opened by anyone. Both are EEE and both draw on the same ₹1.5 lakh Section 80C ceiling, so funding one fully leaves nothing for the other.
          </p>
        </div>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · Sukanya Samriddhi Account Scheme, 2019 · rate is notified quarterly, so a 21-year projection at one fixed rate is an estimate, not a promise</div>
    </div>
  );
}
