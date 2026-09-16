import { useState, useMemo } from 'react';

function fmtINR(n: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}
function fmtINRShort(value: number): string {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
  return `₹${value.toLocaleString('en-IN')}`;
}

type Compounding = 4 | 12 | 1;

export default function FdCalculator() {
  const [principal, setPrincipal] = useState<number>(500000);
  const [rate, setRate] = useState<number>(7.25);
  const [tenureMonths, setTenureMonths] = useState<number>(60);
  const [compound, setCompound] = useState<Compounding>(4);

  const result = useMemo(() => {
    const r = rate / 100;
    const t = tenureMonths / 12;
    const n = compound;
    const maturity = principal * Math.pow(1 + r / n, n * t);
    const interest = maturity - principal;
    return { maturity, interest };
  }, [principal, rate, tenureMonths, compound]);

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        <div className="bg-cyan-accent border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏦</span>
            <h2 className="!text-lg sm:!text-xl !my-0 !text-ink-900 font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>FD Calculator</h2>
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
            <label htmlFor="fd-principal" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Deposit Amount</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">₹</span>
              <input id="fd-principal" type="number" min={5000} step={5000} value={principal} onChange={(e) => setPrincipal(Number(e.target.value) || 0)}
                className="w-full pl-7 pr-3 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-cyan-accent transition-all"
                inputMode="numeric" />
            </div>
            <input type="range" min={5000} max={5000000} step={5000} value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} className="w-full mt-2 accent-cyan-accent" aria-label="Principal slider" />
          </div>
          <div>
            <label htmlFor="fd-rate" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Interest Rate (p.a.)</label>
            <div className="relative">
              <input id="fd-rate" type="number" min={0} max={15} step={0.05} value={rate} onChange={(e) => setRate(Number(e.target.value) || 0)}
                className="w-full pl-3.5 pr-8 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-pink-accent transition-all"
                inputMode="decimal" />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">%</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[6.5, 7, 7.25, 7.5, 8].map((r) => (
                <button key={r} type="button" onClick={() => setRate(r)} className={`px-2.5 py-1 rounded-full text-xs font-bold border-2 border-ink-900 transition-all ${rate === r ? 'bg-pink-accent text-white shadow-sticker-sm' : 'bg-white text-ink-700 hover:bg-pink-accent/30'}`}>
                  {r}%
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="fd-tenure" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Tenure (months)</label>
            <input id="fd-tenure" type="number" min={1} max={240} step={1} value={tenureMonths} onChange={(e) => setTenureMonths(Number(e.target.value) || 1)}
              className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-yellow-accent transition-all"
              inputMode="numeric" />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[{l: '1y', v: 12}, {l: '2y', v: 24}, {l: '3y', v: 36}, {l: '5y', v: 60}, {l: '7y', v: 84}, {l: '10y', v: 120}].map((t) => (
                <button key={t.v} type="button" onClick={() => setTenureMonths(t.v)} className={`px-2.5 py-1 rounded-full text-xs font-bold border-2 border-ink-900 transition-all ${tenureMonths === t.v ? 'bg-yellow-accent text-ink-900 shadow-sticker-sm' : 'bg-white text-ink-700 hover:bg-yellow-accent/40'}`}>
                  {t.l}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Compounding</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { v: 4 as Compounding, l: 'Quarterly' },
                { v: 12 as Compounding, l: 'Monthly' },
                { v: 1 as Compounding, l: 'Annually' },
              ].map((c) => (
                <button key={c.v} type="button" onClick={() => setCompound(c.v)} className={`py-2.5 px-2 rounded-xl border-2 border-ink-900 text-xs font-extrabold transition-all ${compound === c.v ? 'bg-ink-900 text-white shadow-sticker-sm' : 'bg-white text-ink-700 hover:bg-lime-accent'}`}>
                  {c.l}
                </button>
              ))}
            </div>
            <div className="text-[10px] text-ink-500 mt-1.5 font-bold">Most Indian banks compound FD interest quarterly</div>
          </div>
        </div>

        <div className="p-5 sm:p-7 bg-white grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 border-t-[2.5px] border-ink-900">
          <div className="bg-cyan-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Maturity Value</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmtINRShort(result.maturity)}</div>
            <div className="text-xs text-ink-800 mt-2 font-semibold">at end of tenure</div>
          </div>
          <div className="bg-lime-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Principal</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmtINRShort(principal)}</div>
            <div className="text-xs text-ink-800 mt-2 font-semibold">your deposit</div>
          </div>
          <div className="bg-pink-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-white mb-1">Interest Earned</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmtINRShort(result.interest)}</div>
            <div className="text-xs text-white/90 mt-2 font-semibold">{((result.interest / result.maturity) * 100).toFixed(1)}% of maturity</div>
          </div>
        </div>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · FD interest is taxed at your slab rate; senior citizens get +0.5% rate + ₹50K interest exemption</div>
    </div>
  );
}
