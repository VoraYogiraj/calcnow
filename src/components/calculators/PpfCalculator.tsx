import { useState, useMemo } from 'react';

function fmtINR(n: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}
function fmtINRShort(value: number): string {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
  return `₹${value.toLocaleString('en-IN')}`;
}

export default function PpfCalculator() {
  const [annualContribution, setAnnualContribution] = useState<number>(150000);
  const [rate, setRate] = useState<number>(7.1);
  const [years, setYears] = useState<number>(15);

  const yearlyData = useMemo(() => {
    const data: Array<{ year: number; balance: number; contributed: number; interest: number }> = [];
    let balance = 0;
    let totalContributed = 0;
    for (let y = 1; y <= years; y++) {
      // Contribution at start of year, then interest at end
      balance += annualContribution;
      totalContributed += annualContribution;
      balance *= 1 + rate / 100;
      data.push({
        year: y,
        balance,
        contributed: totalContributed,
        interest: balance - totalContributed,
      });
    }
    return data;
  }, [annualContribution, rate, years]);

  const final = yearlyData[yearlyData.length - 1] || { balance: 0, contributed: 0, interest: 0 };
  const maxBalance = Math.max(...yearlyData.map((d) => d.balance), 1);

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        <div className="bg-pink-accent border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏛️</span>
            <h2 className="!text-lg sm:!text-xl !my-0 !text-white font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>PPF Calculator</h2>
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
            <label htmlFor="ppf-contrib" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Annual Contribution</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">₹</span>
              <input id="ppf-contrib" type="number" min={500} max={150000} step={500} value={annualContribution} onChange={(e) => setAnnualContribution(Number(e.target.value) || 0)}
                className="w-full pl-7 pr-3 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-pink-accent transition-all"
                inputMode="numeric" />
            </div>
            <input type="range" min={500} max={150000} step={500} value={annualContribution} onChange={(e) => setAnnualContribution(Number(e.target.value))} className="w-full mt-2 accent-pink-accent" aria-label="Contribution slider" />
            <div className="text-[10px] text-ink-500 mt-1.5 font-bold">PPF annual cap: ₹1.5 lakh (also 80C cap)</div>
          </div>
          <div>
            <label htmlFor="ppf-rate" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Interest Rate</label>
            <div className="relative">
              <input id="ppf-rate" type="number" min={0} max={15} step={0.05} value={rate} onChange={(e) => setRate(Number(e.target.value) || 0)}
                className="w-full pl-3.5 pr-8 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-cyan-accent transition-all"
                inputMode="decimal" />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">%</span>
            </div>
            <div className="text-[10px] text-ink-500 mt-1.5 font-bold">2026 PPF rate: 7.1% (set by Govt of India quarterly)</div>
          </div>
          <div>
            <label htmlFor="ppf-years" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Years</label>
            <input id="ppf-years" type="number" min={15} max={50} step={1} value={years} onChange={(e) => setYears(Number(e.target.value) || 15)}
              className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-yellow-accent transition-all"
              inputMode="numeric" />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[15, 20, 25, 30, 35].map((y) => (
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
            <div className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmtINRShort(final.balance)}</div>
            <div className="text-xs text-ink-800 mt-2 font-semibold">after {years} year{years > 1 ? 's' : ''}</div>
          </div>
          <div className="bg-cyan-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Total Contributed</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmtINRShort(final.contributed)}</div>
            <div className="text-xs text-ink-800 mt-2 font-semibold">your contribution</div>
          </div>
          <div className="bg-pink-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-white mb-1">Tax-Free Interest</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmtINRShort(final.interest)}</div>
            <div className="text-xs text-white/90 mt-2 font-semibold">EEE, fully tax-exempt</div>
          </div>
        </div>

        <div className="px-5 sm:px-7 pb-5 sm:pb-7 bg-white">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mb-3">Year-by-year PPF growth</div>
          <div className="bg-ink-50 border-2 border-ink-900 rounded-2xl p-4 overflow-x-auto">
            <div className="flex items-end gap-1 h-48 min-w-fit">
              {yearlyData.map((d) => {
                const totalHeight = (d.balance / maxBalance) * 100;
                const contribHeight = (d.contributed / d.balance) * 100;
                return (
                  <div key={d.year} className="relative flex-1 min-w-[14px] group" title={`Year ${d.year}: ${fmtINR(d.balance)}`}>
                    <div className="relative w-full bg-pink-accent border-r border-ink-900 transition-all hover:opacity-80" style={{ height: `${totalHeight}%` }}>
                      <div className="absolute bottom-0 inset-x-0 bg-cyan-accent" style={{ height: `${contribHeight}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-3 text-[10px] font-bold text-ink-600">
              <span>Year 1</span>
              <span>Year {years}</span>
            </div>
            <div className="flex items-center gap-4 mt-3 text-[11px] font-bold">
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-cyan-accent border border-ink-900 rounded-sm"></span><span className="text-ink-700">Contributions</span></div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-pink-accent border border-ink-900 rounded-sm"></span><span className="text-ink-700">Tax-free interest</span></div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · PPF is EEE: contributions deductible under 80C, interest tax-free, maturity tax-free</div>
    </div>
  );
}
