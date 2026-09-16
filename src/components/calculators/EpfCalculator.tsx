import { useState, useMemo } from 'react';

function fmtINR(n: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(
    Number.isFinite(n) ? n : 0
  );
}
function fmtINRShort(value: number): string {
  const v = Number.isFinite(value) ? value : 0;
  if (v >= 10000000) return `₹${(v / 10000000).toFixed(2)} Cr`;
  if (v >= 100000) return `₹${(v / 100000).toFixed(2)} L`;
  return `₹${Math.round(v).toLocaleString('en-IN')}`;
}

/** 8.33% of the ₹15,000 statutory wage ceiling — the hard monthly cap on the
 *  employer's EPS (pension) diversion. Anything above it stays in EPF. */
const EPS_CAP = 1250;

const EMPLOYEE_RATE = 0.12;
const EMPLOYER_RATE = 0.12;
const EPS_RATE = 0.0833;

/** Coerce user input to a finite, non-negative number inside [min, max]. */
function clean(value: number, min: number, max: number): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}

export default function EpfCalculator() {
  const [salary, setSalary] = useState<number>(30000);
  const [age, setAge] = useState<number>(25);
  const [retireAge, setRetireAge] = useState<number>(58);
  const [openingBalance, setOpeningBalance] = useState<number>(0);
  const [increment, setIncrement] = useState<number>(5);
  const [rate, setRate] = useState<number>(8.25);

  const result = useMemo(() => {
    const s0 = clean(salary, 0, 10000000);
    const a0 = clean(age, 15, 75);
    const a1 = clean(retireAge, 15, 80);
    const bal0 = clean(openingBalance, 0, 1000000000);
    const inc = clean(increment, 0, 50);
    const r = clean(rate, 0, 20);

    const months = Math.max(0, Math.round((a1 - a0) * 12));
    const monthlyRate = r / 12 / 100;

    let currentSalary = s0;
    let balance = bal0;
    let totalEmployee = 0;
    let totalEmployerEpf = 0;
    let totalEps = 0;
    let totalInterest = 0;

    const yearly: Array<{
      year: number;
      age: number;
      salary: number;
      balance: number;
      contributed: number;
      interest: number;
      eps: number;
    }> = [];

    for (let m = 0; m < months; m++) {
      // Increment lands at the start of each new 12-month block.
      if (m > 0 && m % 12 === 0) currentSalary = currentSalary * (1 + inc / 100);

      const employeeShare = EMPLOYEE_RATE * currentSalary;
      // 8.33% of wages diverted to the pension pool, capped at the ₹15,000 ceiling.
      const epsShare = Math.min(EPS_RATE * currentSalary, EPS_CAP);
      const employerEpfShare = EMPLOYER_RATE * currentSalary - epsShare;

      balance += employeeShare + employerEpfShare; // EPS is NOT part of the EPF corpus
      const interest = balance * monthlyRate;
      balance += interest;

      totalEmployee += employeeShare;
      totalEmployerEpf += employerEpfShare;
      totalEps += epsShare;
      totalInterest += interest;

      if (m % 12 === 11 || m === months - 1) {
        yearly.push({
          year: yearly.length + 1,
          age: Math.round(a0 + yearly.length + 1),
          salary: currentSalary,
          balance,
          contributed: bal0 + totalEmployee + totalEmployerEpf,
          interest: totalInterest,
          eps: totalEps,
        });
      }
    }

    // Present-month split, shown in the step-by-step breakdown.
    const nowEmployee = EMPLOYEE_RATE * s0;
    const nowEps = Math.min(EPS_RATE * s0, EPS_CAP);
    const nowEmployerEpf = EMPLOYER_RATE * s0 - nowEps;
    const epsCapped = EPS_RATE * s0 > EPS_CAP;
    const employerEpfPct = s0 > 0 ? (nowEmployerEpf / s0) * 100 : 0;

    return {
      months,
      years: months / 12,
      balance,
      totalEmployee,
      totalEmployerEpf,
      totalEps,
      totalInterest,
      finalSalary: currentSalary,
      yearly,
      nowEmployee,
      nowEps,
      nowEmployerEpf,
      nowMonthlyCredit: nowEmployee + nowEmployerEpf,
      epsCapped,
      employerEpfPct,
      salary: s0,
      openingBalance: bal0,
      invalidHorizon: months <= 0,
    };
  }, [salary, age, retireAge, openingBalance, increment, rate]);

  const maxBalance = Math.max(...result.yearly.map((d) => d.balance), 1);

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        <div className="bg-lime-accent border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏦</span>
            <h2 className="!text-lg sm:!text-xl !my-0 !text-ink-900 font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>EPF Calculator</h2>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink-900">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ink-900 opacity-40"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-ink-900"></span>
            </span>
            Live
          </span>
        </div>

        <div className="p-5 sm:p-7 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 bg-ink-50">
          <div>
            <label htmlFor="epf-salary" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Monthly Basic + DA</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">₹</span>
              <input id="epf-salary" type="number" min={0} max={1000000} step={500} value={salary} onChange={(e) => setSalary(Number(e.target.value) || 0)}
                className="w-full pl-7 pr-3 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-lime-accent transition-all"
                inputMode="numeric" />
            </div>
            <input type="range" min={5000} max={200000} step={500} value={result.salary} onChange={(e) => setSalary(Number(e.target.value))} className="w-full mt-2 accent-lime-accent" aria-label="Basic plus DA slider" />
            <div className="text-[10px] text-ink-500 mt-1.5 font-bold">Basic + Dearness Allowance only, not gross CTC</div>
          </div>
          <div>
            <label htmlFor="epf-age" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Current Age</label>
            <input id="epf-age" type="number" min={15} max={75} step={1} value={age} onChange={(e) => setAge(Number(e.target.value) || 0)}
              className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-cyan-accent transition-all"
              inputMode="numeric" />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[22, 25, 30, 35, 40].map((a) => (
                <button key={a} type="button" onClick={() => setAge(a)} className={`px-2.5 py-1 rounded-full text-xs font-bold border-2 border-ink-900 transition-all ${age === a ? 'bg-cyan-accent text-ink-900 shadow-sticker-sm' : 'bg-white text-ink-700 hover:bg-cyan-accent/40'}`}>
                  {a}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="epf-retire" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Retirement Age</label>
            <input id="epf-retire" type="number" min={15} max={80} step={1} value={retireAge} onChange={(e) => setRetireAge(Number(e.target.value) || 0)}
              className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-yellow-accent transition-all"
              inputMode="numeric" />
            <div className="text-[10px] text-ink-500 mt-1.5 font-bold">EPFO superannuation age is 58</div>
          </div>
          <div>
            <label htmlFor="epf-balance" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Current EPF Balance</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">₹</span>
              <input id="epf-balance" type="number" min={0} max={100000000} step={1000} value={openingBalance} onChange={(e) => setOpeningBalance(Number(e.target.value) || 0)}
                className="w-full pl-7 pr-3 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-pink-accent transition-all"
                inputMode="numeric" />
            </div>
            <div className="text-[10px] text-ink-500 mt-1.5 font-bold">From your passbook on the EPFO member portal</div>
          </div>
          <div>
            <label htmlFor="epf-increment" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Annual Increment</label>
            <div className="relative">
              <input id="epf-increment" type="number" min={0} max={50} step={0.5} value={increment} onChange={(e) => setIncrement(Number(e.target.value) || 0)}
                className="w-full pl-3.5 pr-8 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-cyan-accent transition-all"
                inputMode="decimal" />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">%</span>
            </div>
            <div className="text-[10px] text-ink-500 mt-1.5 font-bold">Applied to Basic + DA every 12 months</div>
          </div>
          <div>
            <label htmlFor="epf-rate" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Interest Rate</label>
            <div className="relative">
              <input id="epf-rate" type="number" min={0} max={20} step={0.05} value={rate} onChange={(e) => setRate(Number(e.target.value) || 0)}
                className="w-full pl-3.5 pr-8 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-yellow-accent transition-all"
                inputMode="decimal" />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">%</span>
            </div>
            <div className="text-[10px] text-ink-500 mt-1.5 font-bold">8.25%, set by the EPFO Board of Trustees</div>
          </div>
        </div>

        {result.invalidHorizon && (
          <div className="mx-5 sm:mx-7 mb-1 bg-yellow-accent border-[2.5px] border-ink-900 rounded-2xl p-4 shadow-sticker-sm">
            <div className="flex items-start gap-2.5">
              <span className="text-lg leading-none">⚠️</span>
              <p className="text-xs sm:text-sm font-bold text-ink-900 !m-0 leading-snug">
                Retirement age must be higher than your current age. Set a retirement age above {Math.round(clean(age, 15, 75))} to project a corpus.
              </p>
            </div>
          </div>
        )}

        <div className="p-5 sm:p-7 bg-white grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 border-t-[2.5px] border-ink-900">
          <div className="bg-lime-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">EPF Corpus at Retirement</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmtINRShort(result.balance)}</div>
            <div className="text-xs text-ink-800 mt-2 font-semibold">after {Math.round(result.years)} year{Math.round(result.years) === 1 ? '' : 's'} · {result.months} months</div>
          </div>
          <div className="bg-cyan-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Interest Earned</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmtINRShort(result.totalInterest)}</div>
            <div className="text-xs text-ink-800 mt-2 font-semibold">compounded monthly at {clean(rate, 0, 20)}%</div>
          </div>
          <div className="bg-pink-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-white mb-1">EPS Pension Pool</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmtINRShort(result.totalEps)}</div>
            <div className="text-xs text-white/90 mt-2 font-semibold">separate: funds a monthly pension, not a lump sum</div>
          </div>
        </div>

        <div className="px-5 sm:px-7 pb-2 bg-white grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-ink-50 border-2 border-ink-900 rounded-2xl p-4">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mb-1">Your Total Contribution</div>
            <div className="text-2xl font-extrabold text-ink-900" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.03em' }}>{fmtINR(result.totalEmployee)}</div>
            <div className="text-[11px] text-ink-600 mt-1 font-semibold">12% of Basic + DA, every month</div>
          </div>
          <div className="bg-ink-50 border-2 border-ink-900 rounded-2xl p-4">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mb-1">Employer&rsquo;s EPF Contribution</div>
            <div className="text-2xl font-extrabold text-ink-900" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.03em' }}>{fmtINR(result.totalEmployerEpf)}</div>
            <div className="text-[11px] text-ink-600 mt-1 font-semibold">12% minus the EPS diversion</div>
          </div>
        </div>

        <div className="px-5 sm:px-7 pt-5 sm:pt-6 pb-5 sm:pb-7 bg-white">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mb-3">Where your first month&rsquo;s 24% actually goes</div>
          <div className="bg-ink-50 border-2 border-ink-900 rounded-2xl p-4 sm:p-5">
            <ol className="!m-0 !pl-0 list-none space-y-3">
              <li className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-lime-accent border-2 border-ink-900 text-[11px] font-extrabold text-ink-900 flex items-center justify-center">1</span>
                <div className="text-xs sm:text-sm font-semibold text-ink-800 leading-snug">
                  <strong className="text-ink-900">You contribute 12%</strong> of {fmtINR(result.salary)} = <strong className="text-ink-900">{fmtINR(result.nowEmployee)}</strong>. All of it lands in your EPF account.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-cyan-accent border-2 border-ink-900 text-[11px] font-extrabold text-ink-900 flex items-center justify-center">2</span>
                <div className="text-xs sm:text-sm font-semibold text-ink-800 leading-snug">
                  <strong className="text-ink-900">Your employer matches 12%</strong> = {fmtINR(EMPLOYER_RATE * result.salary)}, but this one splits in two.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-pink-accent border-2 border-ink-900 text-[11px] font-extrabold text-white flex items-center justify-center">3</span>
                <div className="text-xs sm:text-sm font-semibold text-ink-800 leading-snug">
                  <strong className="text-ink-900">8.33% goes to EPS</strong> (pension) = <strong className="text-ink-900">{fmtINR(result.nowEps)}</strong>.{' '}
                  {result.epsCapped ? (
                    <>8.33% of {fmtINR(result.salary)} would be {fmtINR(EPS_RATE * result.salary)}, but the diversion is capped at 8.33% of the ₹15,000 wage ceiling, so it stops at ₹1,250 a month.</>
                  ) : (
                    <>Your Basic + DA is at or below the ₹15,000 wage ceiling, so the full 8.33% is diverted. The ₹1,250 cap does not bite yet.</>
                  )}
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-yellow-accent border-2 border-ink-900 text-[11px] font-extrabold text-ink-900 flex items-center justify-center">4</span>
                <div className="text-xs sm:text-sm font-semibold text-ink-800 leading-snug">
                  <strong className="text-ink-900">The remaining {result.employerEpfPct.toFixed(2)}%</strong> of your employer&rsquo;s share = <strong className="text-ink-900">{fmtINR(result.nowEmployerEpf)}</strong> goes into EPF alongside yours.
                </div>
              </li>
            </ol>
            <div className="mt-4 pt-4 border-t-2 border-ink-900/15 font-mono text-xs sm:text-sm font-bold text-ink-900 break-words">
              {fmtINR(result.nowEmployee)} + {fmtINR(result.nowEmployerEpf)} = <span className="text-pink-accent">{fmtINR(result.nowMonthlyCredit)}</span> credited to EPF each month
            </div>
            <p className="text-[11px] sm:text-xs text-ink-600 font-semibold mt-3 !mb-0 leading-relaxed">
              The {fmtINR(result.nowEps)} in EPS is <strong>not</strong> part of your EPF corpus and is never paid out as a lump sum at 58. It buys you a monthly pension for life under the Employees&rsquo; Pension Scheme, 1995, calculated as (pensionable salary × pensionable service) ÷ 70.
            </p>
          </div>

          <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mt-6 mb-3">Year-by-year EPF growth</div>
          <div className="bg-ink-50 border-2 border-ink-900 rounded-2xl p-4 overflow-x-auto">
            {result.yearly.length > 0 ? (
              <>
                <div className="flex items-end gap-1 h-48 min-w-fit">
                  {result.yearly.map((d) => {
                    const totalHeight = (d.balance / maxBalance) * 100;
                    const contribHeight = d.balance > 0 ? Math.min(100, (d.contributed / d.balance) * 100) : 0;
                    return (
                      <div key={d.year} className="relative flex-1 min-w-[10px] group" title={`Age ${d.age} · Year ${d.year}: ${fmtINR(d.balance)}`}>
                        <div className="relative w-full bg-lime-accent border-r border-ink-900 transition-all hover:opacity-80" style={{ height: `${totalHeight}%` }}>
                          <div className="absolute bottom-0 inset-x-0 bg-cyan-accent" style={{ height: `${contribHeight}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between mt-3 text-[10px] font-bold text-ink-600">
                  <span>Age {result.yearly[0].age}</span>
                  <span>Age {result.yearly[result.yearly.length - 1].age}</span>
                </div>
                <div className="flex items-center gap-4 mt-3 text-[11px] font-bold">
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-cyan-accent border border-ink-900 rounded-sm"></span><span className="text-ink-700">Contributions</span></div>
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-lime-accent border border-ink-900 rounded-sm"></span><span className="text-ink-700">Interest</span></div>
                </div>
              </>
            ) : (
              <p className="text-xs font-bold text-ink-600 !m-0">Enter a retirement age above your current age to see the growth curve.</p>
            )}
          </div>

          {result.yearly.length > 0 && (
            <>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mt-6 mb-3">Balance at the end of each year</div>
              <div className="bg-ink-50 border-2 border-ink-900 rounded-2xl overflow-hidden">
                <div className="max-h-72 overflow-y-auto overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-ink-50">
                      <tr className="border-b-2 border-ink-900">
                        <th className="text-left px-3 sm:px-4 py-2.5 font-extrabold text-ink-900 text-xs uppercase tracking-wider">Age</th>
                        <th className="text-right px-3 sm:px-4 py-2.5 font-extrabold text-ink-900 text-xs uppercase tracking-wider">Basic + DA</th>
                        <th className="text-right px-3 sm:px-4 py-2.5 font-extrabold text-ink-900 text-xs uppercase tracking-wider">EPF Balance</th>
                        <th className="text-right px-3 sm:px-4 py-2.5 font-extrabold text-ink-900 text-xs uppercase tracking-wider hidden sm:table-cell">Interest so far</th>
                        <th className="text-right px-3 sm:px-4 py-2.5 font-extrabold text-ink-900 text-xs uppercase tracking-wider hidden sm:table-cell">EPS so far</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.yearly.map((d) => (
                        <tr key={d.year} className="border-b border-ink-200 last:border-0">
                          <td className="px-3 sm:px-4 py-2 font-bold text-ink-800">{d.age}</td>
                          <td className="px-3 sm:px-4 py-2 text-right font-semibold text-ink-700">{fmtINR(d.salary)}</td>
                          <td className="px-3 sm:px-4 py-2 text-right font-extrabold text-ink-900">{fmtINR(d.balance)}</td>
                          <td className="px-3 sm:px-4 py-2 text-right font-semibold text-ink-700 hidden sm:table-cell">{fmtINR(d.interest)}</td>
                          <td className="px-3 sm:px-4 py-2 text-right font-semibold text-ink-700 hidden sm:table-cell">{fmtINR(d.eps)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · EPF corpus excludes EPS · interest compounded monthly on the running balance</div>
    </div>
  );
}
