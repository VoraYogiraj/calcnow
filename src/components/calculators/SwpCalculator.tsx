import { useState, useMemo } from 'react';

function fmtINR(n: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(
    Number.isFinite(n) ? n : 0,
  );
}
function fmtINRShort(value: number): string {
  const v = Number.isFinite(value) ? value : 0;
  if (v >= 10000000) return `₹${(v / 10000000).toFixed(2)} Cr`;
  if (v >= 100000) return `₹${(v / 100000).toFixed(2)} L`;
  return `₹${Math.round(v).toLocaleString('en-IN')}`;
}

interface YearRow {
  year: number;
  open: number;
  withdrawn: number;
  growth: number;
  close: number;
  depletedHere: boolean;
}

export default function SwpCalculator() {
  const [corpus, setCorpus] = useState<number>(1000000);
  const [annualReturn, setAnnualReturn] = useState<number>(8);
  const [withdrawal, setWithdrawal] = useState<number>(10000);
  const [years, setYears] = useState<number>(5);

  // Clamp every input before it touches the maths so a blank field, a negative
  // number or a pasted string can never produce NaN or a negative balance.
  const safe = useMemo(() => {
    const c = Number.isFinite(corpus) ? Math.max(0, corpus) : 0;
    const r = Number.isFinite(annualReturn) ? Math.max(0, Math.min(50, annualReturn)) : 0;
    const w = Number.isFinite(withdrawal) ? Math.max(0, withdrawal) : 0;
    const y = Number.isFinite(years) ? Math.max(0, Math.min(50, Math.floor(years))) : 0;
    return { corpus: c, rate: r, withdrawal: w, years: y };
  }, [corpus, annualReturn, withdrawal, years]);

  // Month-by-month simulation: each month the balance grows at i = r/1200, then
  // the fixed withdrawal is taken. If the grown balance cannot cover the full
  // withdrawal, the last rupees are paid out, the balance is set to zero and the
  // corpus is recorded as exhausted. The closed form
  // FV = P(1+i)^n - W((1+i)^n - 1)/i (or P - W*n when i = 0) matches this loop.
  const sim = useMemo(() => {
    const i = safe.rate / 1200;
    const n = safe.years * 12;
    let balance = safe.corpus;
    let totalWithdrawn = 0;
    let totalGrowth = 0;
    let depletionMonth: number | null = null;
    const yearly: YearRow[] = [];
    let cur: YearRow | null = null;

    for (let m = 1; m <= n; m++) {
      const opening = balance;
      const growth = balance * i;
      const afterGrowth = balance + growth; // balance * (1 + i)
      let paid = safe.withdrawal;
      let closing: number;
      if (afterGrowth <= safe.withdrawal) {
        // Corpus cannot fund a full withdrawal this month: pay out what remains.
        paid = Math.max(0, afterGrowth);
        closing = 0;
        depletionMonth = m;
      } else {
        closing = afterGrowth - safe.withdrawal;
      }
      totalWithdrawn += paid;
      totalGrowth += growth;

      const yr = Math.ceil(m / 12);
      if (!cur || cur.year !== yr) {
        cur = { year: yr, open: opening, withdrawn: 0, growth: 0, close: closing, depletedHere: false };
        yearly.push(cur);
      }
      cur.withdrawn += paid;
      cur.growth += growth;
      cur.close = closing;
      if (depletionMonth === m) cur.depletedHere = true;

      balance = closing;
      if (depletionMonth !== null) break;
    }

    const finalBalance = balance;
    const withdrawalRate = safe.corpus > 0 ? (safe.withdrawal * 12) / safe.corpus * 100 : 0;
    const firstMonthGrowth = safe.corpus * i;
    return { i, n, finalBalance, totalWithdrawn, totalGrowth, depletionMonth, yearly, withdrawalRate, firstMonthGrowth };
  }, [safe]);

  const maxBalance = Math.max(safe.corpus, ...sim.yearly.map((d) => d.close), 1);
  const depleted = sim.depletionMonth !== null;
  const depYear = depleted ? Math.ceil((sim.depletionMonth as number) / 12) : 0;
  const depMonthInYear = depleted ? ((sim.depletionMonth as number) - 1) % 12 + 1 : 0;
  const zeroYears = safe.years === 0;

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        <div className="bg-violet-500 border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📉</span>
            <h2 className="!text-lg sm:!text-xl !my-0 !text-white font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>SWP Calculator</h2>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-50"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            Live
          </span>
        </div>

        <div className="p-5 sm:p-7 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 bg-ink-50">
          <div>
            <label htmlFor="swp-corpus" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Total Investment (Corpus)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">₹</span>
              <input id="swp-corpus" type="number" min={0} step={50000} value={corpus} onChange={(e) => setCorpus(Math.max(0, Number(e.target.value) || 0))}
                className="w-full pl-7 pr-3 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-violet-500 transition-all"
                inputMode="numeric" />
            </div>
            <input type="range" min={50000} max={50000000} step={50000} value={Math.min(Math.max(corpus, 50000), 50000000)} onChange={(e) => setCorpus(Number(e.target.value))} className="w-full mt-2 accent-violet-500" aria-label="Corpus slider" />
            <div className="text-[10px] text-ink-500 mt-1.5 font-bold">The lump sum you invest once, then draw an income from</div>
          </div>
          <div>
            <label htmlFor="swp-return" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Expected Annual Return</label>
            <div className="relative">
              <input id="swp-return" type="number" min={0} max={30} step={0.5} value={annualReturn} onChange={(e) => setAnnualReturn(Number(e.target.value) || 0)}
                className="w-full pl-3.5 pr-8 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-pink-accent transition-all"
                inputMode="decimal" />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">%</span>
            </div>
            <input type="range" min={0} max={25} step={0.5} value={Math.min(Math.max(annualReturn, 0), 25)} onChange={(e) => setAnnualReturn(Number(e.target.value))} className="w-full mt-2 accent-pink-accent" aria-label="Return slider" />
            <div className="text-[10px] text-ink-500 mt-1.5 font-bold">Equity 10–12% · hybrid 8–10% · debt 6–8%</div>
          </div>
          <div>
            <label htmlFor="swp-withdrawal" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Monthly Withdrawal</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">₹</span>
              <input id="swp-withdrawal" type="number" min={0} step={500} value={withdrawal} onChange={(e) => setWithdrawal(Math.max(0, Number(e.target.value) || 0))}
                className="w-full pl-7 pr-3 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-cyan-accent transition-all"
                inputMode="numeric" />
            </div>
            <input type="range" min={0} max={500000} step={500} value={Math.min(Math.max(withdrawal, 0), 500000)} onChange={(e) => setWithdrawal(Number(e.target.value))} className="w-full mt-2 accent-cyan-accent" aria-label="Monthly withdrawal slider" />
            <div className="text-[10px] text-ink-500 mt-1.5 font-bold">The fixed income you take out every month</div>
          </div>
          <div>
            <label htmlFor="swp-years" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Withdrawal Period (Years)</label>
            <input id="swp-years" type="number" min={0} max={50} step={1} value={years} onChange={(e) => setYears(Math.max(0, Math.min(50, Math.floor(Number(e.target.value) || 0))))}
              className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-yellow-accent transition-all"
              inputMode="numeric" />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[3, 5, 10, 15, 20, 25].map((y) => (
                <button key={y} type="button" onClick={() => setYears(y)} className={`px-2.5 py-1 rounded-full text-xs font-bold border-2 border-ink-900 transition-all ${years === y ? 'bg-yellow-accent text-ink-900 shadow-sticker-sm' : 'bg-white text-ink-700 hover:bg-yellow-accent/40'}`}>
                  {y}y
                </button>
              ))}
            </div>
          </div>
        </div>

        {zeroYears && (
          <div className="mx-5 sm:mx-7 mb-1 bg-yellow-accent border-[2.5px] border-ink-900 rounded-2xl p-4 shadow-sticker-sm">
            <div className="flex items-start gap-2.5">
              <span className="text-lg leading-none">⚠️</span>
              <p className="text-xs sm:text-sm font-bold text-ink-900 !m-0 leading-snug">
                Withdrawal period is zero, so no withdrawals have happened yet. Your balance still equals the corpus you put in. Set a tenure of at least one year to run the plan.
              </p>
            </div>
          </div>
        )}

        <div className="p-5 sm:p-7 bg-white grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 border-t-[2.5px] border-ink-900">
          <div className="bg-lime-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Final Balance</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmtINRShort(sim.finalBalance)}</div>
            <div className="text-xs text-ink-800 mt-2 font-semibold">{depleted ? 'corpus exhausted' : `left after ${safe.years} year${safe.years === 1 ? '' : 's'}`}</div>
          </div>
          <div className="bg-cyan-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Total Withdrawn</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmtINRShort(sim.totalWithdrawn)}</div>
            <div className="text-xs text-ink-800 mt-2 font-semibold">income drawn out</div>
          </div>
          <div className="bg-pink-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-white mb-1">Return Earned</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmtINRShort(sim.totalGrowth)}</div>
            <div className="text-xs text-white/90 mt-2 font-semibold">growth the fund added</div>
          </div>
          <div className="bg-violet-500 border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-white mb-1">Withdrawal Rate</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{sim.withdrawalRate.toFixed(1)}%</div>
            <div className="text-xs text-white/90 mt-2 font-semibold">of corpus per year</div>
          </div>
        </div>

        {!zeroYears && depleted && (
          <div className="mx-5 sm:mx-7 mb-1 bg-red-500 border-[2.5px] border-ink-900 rounded-2xl p-4 shadow-sticker-sm">
            <div className="flex items-start gap-2.5">
              <span className="text-lg leading-none">🚨</span>
              <p className="text-xs sm:text-sm font-bold text-white !m-0 leading-snug">
                Corpus exhausted in month {sim.depletionMonth} (Year {depYear}, month {depMonthInYear} of the plan). The withdrawal is larger than the fund can sustain, so the balance runs out before your {safe.years}-year target. Lower the monthly withdrawal, raise the corpus, or shorten the tenure to make the income last.
              </p>
            </div>
          </div>
        )}

        {!zeroYears && !depleted && (
          <div className="mx-5 sm:mx-7 mb-1 bg-lime-accent border-[2.5px] border-ink-900 rounded-2xl p-4 shadow-sticker-sm">
            <div className="flex items-start gap-2.5">
              <span className="text-lg leading-none">✅</span>
              <p className="text-xs sm:text-sm font-bold text-ink-900 !m-0 leading-snug">
                The corpus lasts the full {safe.years} year{safe.years === 1 ? '' : 's'} and still leaves {fmtINR(sim.finalBalance)} invested. At {safe.rate}% the first month adds about {fmtINR(sim.firstMonthGrowth)} of growth against a {fmtINR(safe.withdrawal)} withdrawal, so the balance {sim.firstMonthGrowth >= safe.withdrawal ? 'keeps rising' : 'drifts down slowly'}.
              </p>
            </div>
          </div>
        )}

        {sim.yearly.length > 0 && (
          <div className="px-5 sm:px-7 pb-5 sm:pb-7 bg-white">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mt-4 mb-3">Balance at the end of each year</div>
            <div className="bg-ink-50 border-2 border-ink-900 rounded-2xl p-4 overflow-x-auto">
              <div className="flex items-end gap-1 h-48 min-w-fit">
                {sim.yearly.map((d) => {
                  const h = (d.close / maxBalance) * 100;
                  return (
                    <div key={d.year} className="relative flex-1 min-w-[14px] group" title={`Year ${d.year}: ${fmtINR(d.close)} left`}>
                      <div className="relative w-full bg-violet-500 border-r border-ink-900 transition-all hover:opacity-80" style={{ height: `${Math.max(h, d.close > 0 ? 1.5 : 0)}%` }} />
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between mt-3 text-[10px] font-bold text-ink-600">
                <span>Year 1</span>
                <span>Year {sim.yearly.length}</span>
              </div>
              <div className="flex items-center gap-4 mt-3 text-[11px] font-bold">
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-violet-500 border border-ink-900 rounded-sm"></span><span className="text-ink-700">Corpus remaining at year end</span></div>
              </div>
            </div>

            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mt-6 mb-3">Year-by-year breakdown</div>
            <div className="bg-ink-50 border-2 border-ink-900 rounded-2xl overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-ink-900">
                    <th className="text-left px-3 sm:px-4 py-2.5 font-extrabold text-ink-900 text-xs uppercase tracking-wider">Year</th>
                    <th className="text-right px-3 sm:px-4 py-2.5 font-extrabold text-ink-900 text-xs uppercase tracking-wider">Opening</th>
                    <th className="text-right px-3 sm:px-4 py-2.5 font-extrabold text-ink-900 text-xs uppercase tracking-wider">Withdrawn</th>
                    <th className="text-right px-3 sm:px-4 py-2.5 font-extrabold text-ink-900 text-xs uppercase tracking-wider hidden xs:table-cell">Growth</th>
                    <th className="text-right px-3 sm:px-4 py-2.5 font-extrabold text-ink-900 text-xs uppercase tracking-wider">Closing</th>
                  </tr>
                </thead>
                <tbody>
                  {sim.yearly.map((d) => (
                    <tr key={d.year} className={`border-b border-ink-200 last:border-0 ${d.depletedHere ? 'bg-red-500/10' : ''}`}>
                      <td className="px-3 sm:px-4 py-2.5 font-bold text-ink-800">{d.year}{d.depletedHere ? ' *' : ''}</td>
                      <td className="px-3 sm:px-4 py-2.5 text-right font-bold text-ink-700">{fmtINR(d.open)}</td>
                      <td className="px-3 sm:px-4 py-2.5 text-right font-bold text-ink-700">{fmtINR(d.withdrawn)}</td>
                      <td className="px-3 sm:px-4 py-2.5 text-right font-bold text-ink-700 hidden xs:table-cell">{fmtINR(d.growth)}</td>
                      <td className="px-3 sm:px-4 py-2.5 text-right font-extrabold text-ink-900">{fmtINR(d.close)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] sm:text-xs text-ink-600 font-semibold mt-3 !mb-0 leading-relaxed">
              Each year the balance grows at {safe.rate}% and {fmtINR(safe.withdrawal * 12)} is withdrawn across the twelve months.
              {depleted
                ? ` The row marked * is where the corpus runs out: the last withdrawal is only partial and the closing balance is zero.`
                : sim.finalBalance < safe.corpus
                  ? ` The yearly withdrawal outpaces the growth, so the corpus shrinks a little every year and ends at ${fmtINR(sim.finalBalance)}.`
                  : ` The growth covers the withdrawals, so the corpus holds up and ends at ${fmtINR(sim.finalBalance)}.`}
            </p>
          </div>
        )}
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · Returns are assumed constant for the model; real fund returns vary year to year, so treat the depletion month as a guide, not a guarantee</div>
    </div>
  );
}
