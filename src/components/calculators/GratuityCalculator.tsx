import { useState, useMemo } from 'react';

function fmtINR(n: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}
function fmtINRShort(value: number): string {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
  return `₹${Math.round(value).toLocaleString('en-IN')}`;
}

/** Tax-exemption ceiling under Section 10(10)(ii), raised to ₹20 lakh in March 2018. */
const EXEMPTION_CAP = 2000000;

export default function GratuityCalculator() {
  const [salary, setSalary] = useState<number>(50000);
  const [years, setYears] = useState<number>(10);
  const [months, setMonths] = useState<number>(0);
  const [covered, setCovered] = useState<boolean>(true);

  const result = useMemo(() => {
    // Under the Act, service beyond six months in the final year rounds up to a
    // full year. Employers outside the Act count only completed years.
    const effectiveYears = covered ? years + (months > 6 ? 1 : 0) : years;
    const divisor = covered ? 26 : 30;
    const gratuity = (15 * salary * effectiveYears) / divisor;
    const eligible = years >= 5;
    const exempt = Math.min(gratuity, EXEMPTION_CAP);
    const taxable = Math.max(0, gratuity - EXEMPTION_CAP);
    return { effectiveYears, divisor, gratuity, eligible, exempt, taxable };
  }, [salary, years, months, covered]);

  // Same salary, different tenures — shows how gratuity scales with service.
  const tenureTable = useMemo(() => {
    return [5, 10, 15, 20, 25, 30].map((y) => ({
      years: y,
      amount: (15 * salary * y) / (covered ? 26 : 30),
    }));
  }, [salary, covered]);

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        <div className="bg-cyan-accent border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💼</span>
            <h2 className="!text-lg sm:!text-xl !my-0 !text-ink-900 font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>Gratuity Calculator</h2>
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
            <label htmlFor="grat-salary" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Last Drawn Salary</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">₹</span>
              <input id="grat-salary" type="number" min={1000} max={2000000} step={1000} value={salary} onChange={(e) => setSalary(Number(e.target.value) || 0)}
                className="w-full pl-7 pr-3 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-cyan-accent transition-all"
                inputMode="numeric" />
            </div>
            <input type="range" min={10000} max={500000} step={1000} value={salary} onChange={(e) => setSalary(Number(e.target.value))} className="w-full mt-2 accent-cyan-accent" aria-label="Salary slider" />
            <div className="text-[10px] text-ink-500 mt-1.5 font-bold">Basic + Dearness Allowance only (not gross CTC)</div>
          </div>
          <div>
            <label htmlFor="grat-years" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Years of Service</label>
            <input id="grat-years" type="number" min={0} max={50} step={1} value={years} onChange={(e) => setYears(Number(e.target.value) || 0)}
              className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-lime-accent transition-all"
              inputMode="numeric" />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[5, 10, 15, 20, 25].map((y) => (
                <button key={y} type="button" onClick={() => setYears(y)} className={`px-2.5 py-1 rounded-full text-xs font-bold border-2 border-ink-900 transition-all ${years === y ? 'bg-lime-accent text-ink-900 shadow-sticker-sm' : 'bg-white text-ink-700 hover:bg-lime-accent/40'}`}>
                  {y}y
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="grat-months" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Additional Months</label>
            <input id="grat-months" type="number" min={0} max={11} step={1} value={months} onChange={(e) => setMonths(Math.min(11, Math.max(0, Number(e.target.value) || 0)))}
              className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-yellow-accent transition-all"
              inputMode="numeric" />
            <label className="flex items-start gap-2 mt-3 cursor-pointer">
              <input type="checkbox" checked={covered} onChange={(e) => setCovered(e.target.checked)} className="mt-0.5 w-4 h-4 accent-cyan-accent border-2 border-ink-900" />
              <span className="text-[11px] font-bold text-ink-700 leading-snug">Covered by the Gratuity Act<br /><span className="text-ink-500 font-semibold">(employer has 10+ employees)</span></span>
            </label>
          </div>
        </div>

        {!result.eligible && (
          <div className="mx-5 sm:mx-7 mb-1 bg-yellow-accent border-[2.5px] border-ink-900 rounded-2xl p-4 shadow-sticker-sm">
            <div className="flex items-start gap-2.5">
              <span className="text-lg leading-none">⚠️</span>
              <p className="text-xs sm:text-sm font-bold text-ink-900 !m-0 leading-snug">
                Below the 5-year eligibility threshold. Gratuity normally requires 5 years of continuous service. The amount below is shown for reference only. It becomes payable if service reaches 5 years, or immediately in case of death or disablement, where the 5-year rule is waived.
              </p>
            </div>
          </div>
        )}

        <div className="p-5 sm:p-7 bg-white grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 border-t-[2.5px] border-ink-900">
          <div className="bg-lime-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Gratuity Payable</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmtINRShort(result.gratuity)}</div>
            <div className="text-xs text-ink-800 mt-2 font-semibold">{result.effectiveYears} year{result.effectiveYears === 1 ? '' : 's'} counted</div>
          </div>
          <div className="bg-cyan-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Tax-Exempt</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmtINRShort(result.exempt)}</div>
            <div className="text-xs text-ink-800 mt-2 font-semibold">capped at ₹20 lakh lifetime</div>
          </div>
          <div className="bg-pink-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-white mb-1">Taxable Portion</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmtINRShort(result.taxable)}</div>
            <div className="text-xs text-white/90 mt-2 font-semibold">{result.taxable > 0 ? 'taxed at your slab rate' : 'fully exempt'}</div>
          </div>
        </div>

        <div className="px-5 sm:px-7 pb-5 sm:pb-7 bg-white">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mb-3">Your formula, step by step</div>
          <div className="bg-ink-50 border-2 border-ink-900 rounded-2xl p-4 sm:p-5">
            <div className="font-mono text-xs sm:text-sm font-bold text-ink-900 break-words">
              (15 × {fmtINR(salary)} × {result.effectiveYears}) ÷ {result.divisor} = <span className="text-pink-accent">{fmtINR(result.gratuity)}</span>
            </div>
            <p className="text-[11px] sm:text-xs text-ink-600 font-semibold mt-3 !mb-0 leading-relaxed">
              15 days of wages for every completed year, divided by {result.divisor} {covered ? 'working days in a month (employers covered by the Act)' : 'calendar days in a month (employers outside the Act)'}.
              {covered && months > 6 && <> Your {months} extra months exceed six, so the final year rounds up to a full year.</>}
              {covered && months > 0 && months <= 6 && <> Your {months} extra month{months === 1 ? '' : 's'} do not exceed six, so they do not add a year.</>}
            </p>
          </div>

          <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mt-6 mb-3">Gratuity at {fmtINR(salary)} salary by tenure</div>
          <div className="bg-ink-50 border-2 border-ink-900 rounded-2xl overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-ink-900">
                  <th className="text-left px-4 py-2.5 font-extrabold text-ink-900 text-xs uppercase tracking-wider">Service</th>
                  <th className="text-right px-4 py-2.5 font-extrabold text-ink-900 text-xs uppercase tracking-wider">Gratuity</th>
                </tr>
              </thead>
              <tbody>
                {tenureTable.map((row) => (
                  <tr key={row.years} className={`border-b border-ink-200 last:border-0 ${row.years === result.effectiveYears ? 'bg-lime-accent/40' : ''}`}>
                    <td className="px-4 py-2.5 font-bold text-ink-800">{row.years} years</td>
                    <td className="px-4 py-2.5 text-right font-extrabold text-ink-900">{fmtINR(row.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · Payment of Gratuity Act, 1972 · exemption capped at ₹20 lakh across your career</div>
    </div>
  );
}
