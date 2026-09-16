import { useState, useMemo } from 'react';

function fmtINR(n: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

export default function HraCalculator() {
  const [basicSalary, setBasicSalary] = useState<number>(50000);
  const [hraReceived, setHraReceived] = useState<number>(20000);
  const [rentPaid, setRentPaid] = useState<number>(25000);
  const [isMetro, setIsMetro] = useState<boolean>(true);

  const result = useMemo(() => {
    // HRA exemption = least of three values:
    // 1. Actual HRA received
    // 2. 50% of basic (metro) or 40% of basic (non-metro)
    // 3. Rent paid - 10% of basic
    const a = hraReceived;
    const b = basicSalary * (isMetro ? 0.5 : 0.4);
    const c = Math.max(0, rentPaid - 0.1 * basicSalary);

    const exempt = Math.min(a, b, c);
    const taxable = Math.max(0, hraReceived - exempt);

    return { a, b, c, exempt, taxable };
  }, [basicSalary, hraReceived, rentPaid, isMetro]);

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        <div className="bg-lime-accent border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏠</span>
            <h2 className="!text-lg sm:!text-xl !my-0 !text-ink-900 font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>HRA Calculator</h2>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink-900">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ink-900 opacity-50"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-ink-900"></span>
            </span>
            Live
          </span>
        </div>

        {/* Metro toggle */}
        <div className="px-5 sm:px-7 py-4 bg-ink-50 border-b-2 border-ink-100">
          <label className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">City Tier (HRA Rule)</label>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setIsMetro(true)}
              className={`py-3 px-3 rounded-xl border-[2.5px] border-ink-900 text-sm font-extrabold transition-all ${isMetro ? 'bg-ink-900 text-white shadow-sticker-sm -translate-y-0.5' : 'bg-white text-ink-700 hover:bg-lime-accent/40'}`}>
              Metro (50%)
              <div className="text-[10px] font-normal opacity-80 mt-0.5">Mumbai, Delhi, Kolkata, Chennai</div>
            </button>
            <button type="button" onClick={() => setIsMetro(false)}
              className={`py-3 px-3 rounded-xl border-[2.5px] border-ink-900 text-sm font-extrabold transition-all ${!isMetro ? 'bg-ink-900 text-white shadow-sticker-sm -translate-y-0.5' : 'bg-white text-ink-700 hover:bg-lime-accent/40'}`}>
              Non-Metro (40%)
              <div className="text-[10px] font-normal opacity-80 mt-0.5">Bangalore, Pune, Hyderabad, others</div>
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-7 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 bg-ink-50">
          <div>
            <label htmlFor="hra-basic" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Basic Salary (monthly)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">₹</span>
              <input id="hra-basic" type="number" min={0} step={1000} value={basicSalary} onChange={(e) => setBasicSalary(Number(e.target.value) || 0)}
                className="w-full pl-7 pr-3 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-lime-accent transition-all"
                inputMode="numeric" />
            </div>
            <input type="range" min={0} max={300000} step={1000} value={basicSalary} onChange={(e) => setBasicSalary(Number(e.target.value))} className="w-full mt-2 accent-lime-accent" aria-label="Basic salary slider" />
            <div className="text-[10px] text-ink-500 mt-1.5 font-bold">Basic + DA from Form 16 / payslip</div>
          </div>
          <div>
            <label htmlFor="hra-received" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">HRA Received (monthly)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">₹</span>
              <input id="hra-received" type="number" min={0} step={500} value={hraReceived} onChange={(e) => setHraReceived(Number(e.target.value) || 0)}
                className="w-full pl-7 pr-3 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-pink-accent transition-all"
                inputMode="numeric" />
            </div>
            <input type="range" min={0} max={150000} step={500} value={hraReceived} onChange={(e) => setHraReceived(Number(e.target.value))} className="w-full mt-2 accent-pink-accent" aria-label="HRA received slider" />
          </div>
          <div>
            <label htmlFor="hra-rent" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Rent Paid (monthly)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">₹</span>
              <input id="hra-rent" type="number" min={0} step={500} value={rentPaid} onChange={(e) => setRentPaid(Number(e.target.value) || 0)}
                className="w-full pl-7 pr-3 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-cyan-accent transition-all"
                inputMode="numeric" />
            </div>
            <input type="range" min={0} max={200000} step={500} value={rentPaid} onChange={(e) => setRentPaid(Number(e.target.value))} className="w-full mt-2 accent-cyan-accent" aria-label="Rent paid slider" />
          </div>
        </div>

        {/* Three components */}
        <div className="px-5 sm:px-7 pb-5 bg-white border-t-[2.5px] border-ink-900">
          <div className="text-xs font-extrabold uppercase tracking-wider text-ink-700 mt-5 mb-3">HRA exemption = LEAST of three</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className={`border-2 rounded-2xl p-4 ${result.exempt === result.a ? 'border-ink-900 bg-yellow-accent/30 shadow-sticker-sm' : 'border-ink-200 bg-ink-50'}`}>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mb-1">A: Actual HRA</div>
              <div className="text-lg font-extrabold text-ink-900">{fmtINR(result.a)}</div>
              <div className="text-[10px] text-ink-600 mt-1 font-semibold">Received from employer</div>
            </div>
            <div className={`border-2 rounded-2xl p-4 ${result.exempt === result.b ? 'border-ink-900 bg-yellow-accent/30 shadow-sticker-sm' : 'border-ink-200 bg-ink-50'}`}>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mb-1">B: {isMetro ? '50%' : '40%'} of Basic</div>
              <div className="text-lg font-extrabold text-ink-900">{fmtINR(result.b)}</div>
              <div className="text-[10px] text-ink-600 mt-1 font-semibold">{isMetro ? 'Metro' : 'Non-metro'} tier limit</div>
            </div>
            <div className={`border-2 rounded-2xl p-4 ${result.exempt === result.c ? 'border-ink-900 bg-yellow-accent/30 shadow-sticker-sm' : 'border-ink-200 bg-ink-50'}`}>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mb-1">C: Rent − 10% of Basic</div>
              <div className="text-lg font-extrabold text-ink-900">{fmtINR(result.c)}</div>
              <div className="text-[10px] text-ink-600 mt-1 font-semibold">Excess rent over 10% basic</div>
            </div>
          </div>
        </div>

        {/* Final result */}
        <div className="p-5 sm:p-7 bg-white grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 border-t-[2.5px] border-ink-900">
          <div className="bg-lime-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">HRA Exempt (Monthly)</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmtINR(result.exempt)}</div>
            <div className="text-xs text-ink-800 mt-2 font-semibold">{fmtINR(result.exempt * 12)} per year</div>
          </div>
          <div className="bg-pink-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-white mb-1">HRA Taxable (Monthly)</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmtINR(result.taxable)}</div>
            <div className="text-xs text-white/90 mt-2 font-semibold">{fmtINR(result.taxable * 12)} added to income</div>
          </div>
        </div>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · HRA exemption requires actual rent receipts; landlord PAN needed for rent &gt; ₹1L/yr; only available in Old Tax Regime</div>
    </div>
  );
}
