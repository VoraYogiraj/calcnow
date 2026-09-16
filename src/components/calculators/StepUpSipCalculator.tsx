import { useState, useMemo } from 'react';

function fmtINR(n: number): string {
  if (!isFinite(n)) n = 0;
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

function fmtINRShort(value: number): string {
  if (!isFinite(value)) value = 0;
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
  return `₹${Math.round(value).toLocaleString('en-IN')}`;
}

interface YearRow {
  year: number;
  monthly: number;
  invested: number;
  balance: number;
}

interface Plan {
  balance: number;
  invested: number;
  gain: number;
  rows: YearRow[];
}

export default function StepUpSipCalculator() {
  const [initial, setInitial] = useState<number>(10000);
  const [stepUp, setStepUp] = useState<number>(10);
  const [annualReturn, setAnnualReturn] = useState<number>(12);
  const [years, setYears] = useState<number>(10);

  const sim = useMemo(() => {
    const P = Math.max(0, initial || 0);
    const stepPct = Math.max(0, stepUp || 0);
    const r = Math.max(0, annualReturn || 0);
    const n = Math.max(1, Math.min(50, Math.floor(years || 1)));
    const i = r / 1200;

    // Month-by-month simulation. Each month the running balance grows one month,
    // then that month's contribution is added: balance = balance*(1+i) + monthly.
    // The monthly amount is raised by the step-up % at the start of every new
    // year after year 1.
    function run(step: number): Plan {
      let balance = 0;
      let invested = 0;
      let monthly = P;
      const rows: YearRow[] = [];
      for (let y = 1; y <= n; y++) {
        if (y > 1) monthly *= 1 + step / 100;
        for (let m = 0; m < 12; m++) {
          // Annuity-due (start-of-month contribution), matching SipCalculator so
          // the flat-SIP comparison agrees with the base SIP calculator.
          balance += monthly;
          balance *= 1 + i;
          invested += monthly;
        }
        rows.push({ year: y, monthly, invested, balance });
      }
      return { balance, invested, gain: balance - invested, rows };
    }

    const step = run(stepPct);
    const flat = run(0);
    return {
      step,
      flat,
      extraCorpus: Math.max(0, step.balance - flat.balance),
      extraInvested: Math.max(0, step.invested - flat.invested),
      n,
    };
  }, [initial, stepUp, annualReturn, years]);

  const { step, flat, extraCorpus, extraInvested, n } = sim;
  const maxBalance = Math.max(...step.rows.map((d) => d.balance), 1);
  const gainPct = step.balance > 0 ? (step.gain / step.balance) * 100 : 0;

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        <div className="bg-lime-accent border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📈</span>
            <h2 className="!text-lg sm:!text-xl !my-0 !text-ink-900 font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>Step-Up SIP Calculator</h2>
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
            <label htmlFor="stepup-initial" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Starting Monthly SIP</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">₹</span>
              <input id="stepup-initial" type="number" min={0} step={500} value={initial} onChange={(e) => setInitial(Math.max(0, Number(e.target.value) || 0))}
                className="w-full pl-7 pr-3 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-lime-accent transition-all"
                inputMode="numeric" />
            </div>
            <input type="range" min={500} max={100000} step={500} value={Math.min(initial, 100000)} onChange={(e) => setInitial(Number(e.target.value))} className="w-full mt-2 accent-lime-accent" aria-label="Starting monthly SIP slider" />
          </div>
          <div>
            <label htmlFor="stepup-rate" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Annual Step-Up</label>
            <div className="relative">
              <input id="stepup-rate" type="number" min={0} max={50} step={1} value={stepUp} onChange={(e) => setStepUp(Math.max(0, Number(e.target.value) || 0))}
                className="w-full pl-3.5 pr-8 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-cyan-accent transition-all"
                inputMode="decimal" />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">%</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[5, 7, 10, 15].map((p) => (
                <button key={p} type="button" onClick={() => setStepUp(p)} className={`px-2.5 py-1 rounded-full text-xs font-bold border-2 border-ink-900 transition-all ${stepUp === p ? 'bg-cyan-accent text-ink-900 shadow-sticker-sm' : 'bg-white text-ink-700 hover:bg-cyan-accent/40'}`}>
                  +{p}%/yr
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="stepup-return" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Expected Annual Return</label>
            <div className="relative">
              <input id="stepup-return" type="number" min={0} max={30} step={0.5} value={annualReturn} onChange={(e) => setAnnualReturn(Math.max(0, Number(e.target.value) || 0))}
                className="w-full pl-3.5 pr-8 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-pink-accent transition-all"
                inputMode="decimal" />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">%</span>
            </div>
            <input type="range" min={0} max={25} step={0.5} value={Math.min(annualReturn, 25)} onChange={(e) => setAnnualReturn(Number(e.target.value))} className="w-full mt-2 accent-pink-accent" aria-label="Expected annual return slider" />
          </div>
          <div>
            <label htmlFor="stepup-years" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Investment Period (Years)</label>
            <input id="stepup-years" type="number" min={1} max={50} step={1} value={years} onChange={(e) => setYears(Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
              className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-yellow-accent transition-all"
              inputMode="numeric" />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[5, 10, 15, 20, 25, 30].map((y) => (
                <button key={y} type="button" onClick={() => setYears(y)} className={`px-2.5 py-1 rounded-full text-xs font-bold border-2 border-ink-900 transition-all ${years === y ? 'bg-yellow-accent text-ink-900 shadow-sticker-sm' : 'bg-white text-ink-700 hover:bg-yellow-accent/40'}`}>
                  {y}y
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-7 bg-white grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 border-t-[2.5px] border-ink-900">
          <div className="bg-lime-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Maturity Value</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmtINRShort(step.balance)}</div>
            <div className="text-xs text-ink-800 mt-2 font-semibold">after {n} year{n > 1 ? 's' : ''}, stepped up {Math.max(0, stepUp || 0)}%/yr</div>
          </div>
          <div className="bg-cyan-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Total Invested</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmtINRShort(step.invested)}</div>
            <div className="text-xs text-ink-800 mt-2 font-semibold">your rising contribution</div>
          </div>
          <div className="bg-pink-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-white mb-1">Wealth Gained</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmtINRShort(step.gain)}</div>
            <div className="text-xs text-white/90 mt-2 font-semibold">{gainPct.toFixed(0)}% of maturity</div>
          </div>
        </div>

        <div className="px-5 sm:px-7 pb-5 sm:pb-7 bg-white">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mb-3">Step-up vs a flat SIP (same ₹{Math.round(Math.max(0, initial || 0)).toLocaleString('en-IN')}/mo start)</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-ink-900 border-[2.5px] border-ink-900 rounded-2xl p-5">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-lime-accent mb-1">Step-Up SIP</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmtINRShort(step.balance)}</div>
              <div className="text-xs text-white/70 mt-2 font-semibold">from {fmtINRShort(step.invested)} invested</div>
            </div>
            <div className="bg-white border-[2.5px] border-ink-900 rounded-2xl p-5">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-500 mb-1">Flat SIP (no step-up)</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmtINRShort(flat.balance)}</div>
              <div className="text-xs text-ink-600 mt-2 font-semibold">from {fmtINRShort(flat.invested)} invested</div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-yellow-accent border-2 border-ink-900 rounded-2xl px-5 py-4 flex items-center justify-between gap-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-ink-900">Extra corpus</span>
              <span className="text-xl sm:text-2xl font-extrabold text-ink-900" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.03em' }}>+{fmtINRShort(extraCorpus)}</span>
            </div>
            <div className="bg-ink-50 border-2 border-ink-900 rounded-2xl px-5 py-4 flex items-center justify-between gap-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-ink-700">Extra invested</span>
              <span className="text-xl sm:text-2xl font-extrabold text-ink-900" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.03em' }}>+{fmtINRShort(extraInvested)}</span>
            </div>
          </div>
        </div>

        <div className="px-5 sm:px-7 pb-5 sm:pb-7 bg-white">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mb-3">Year-by-year corpus growth</div>
          <div className="bg-ink-50 border-2 border-ink-900 rounded-2xl p-4 overflow-x-auto">
            <div className="flex items-end gap-1 h-48 min-w-fit">
              {step.rows.map((d) => {
                const totalHeight = (d.balance / maxBalance) * 100;
                const investedHeight = d.balance > 0 ? (d.invested / d.balance) * 100 : 0;
                return (
                  <div key={d.year} className="relative flex-1 min-w-[12px] group" title={`Year ${d.year}: ${fmtINR(d.balance)} (SIP ${fmtINR(d.monthly)}/mo)`}>
                    <div className="relative w-full bg-pink-accent border-r border-ink-900 transition-all hover:opacity-80" style={{ height: `${totalHeight}%` }}>
                      <div className="absolute bottom-0 inset-x-0 bg-cyan-accent" style={{ height: `${investedHeight}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-3 text-[10px] font-bold text-ink-600">
              <span>Year 1</span>
              <span>Year {n}</span>
            </div>
            <div className="flex items-center gap-4 mt-3 text-[11px] font-bold">
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-cyan-accent border border-ink-900 rounded-sm"></span><span className="text-ink-700">Invested to date</span></div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-pink-accent border border-ink-900 rounded-sm"></span><span className="text-ink-700">Returns earned</span></div>
            </div>
          </div>
        </div>

        <div className="px-5 sm:px-7 pb-6 sm:pb-8 bg-white">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mb-3">The rising SIP, year by year</div>
          <div className="overflow-x-auto border-2 border-ink-900 rounded-2xl">
            <table className="w-full text-sm border-separate border-spacing-0">
              <thead>
                <tr className="bg-ink-900 text-white">
                  <th className="text-left p-3 font-extrabold">Year</th>
                  <th className="text-right p-3 font-extrabold">Monthly SIP</th>
                  <th className="text-right p-3 font-extrabold">Invested to date</th>
                  <th className="text-right p-3 font-extrabold">Value to date</th>
                </tr>
              </thead>
              <tbody>
                {step.rows.map((d, idx) => (
                  <tr key={d.year} className={idx % 2 ? 'bg-ink-50' : 'bg-white'}>
                    <td className="p-3 font-bold text-ink-900">Year {d.year}</td>
                    <td className="p-3 text-right font-mono text-ink-700">{fmtINR(d.monthly)}</td>
                    <td className="p-3 text-right font-mono text-ink-700">{fmtINR(d.invested)}</td>
                    <td className="p-3 text-right font-mono font-extrabold text-ink-900">{fmtINR(d.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · A step-up raises your monthly SIP each year to track rising income. Returns are illustrative, not guaranteed; actual mutual fund returns vary year to year.</div>
    </div>
  );
}
