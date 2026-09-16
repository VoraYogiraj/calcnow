import { useState, useMemo } from 'react';

export default function LeaseVsBuyCalculator() {
  // BUY inputs
  const [price, setPrice] = useState(30000);
  const [buyDown, setBuyDown] = useState(3000);
  const [apr, setApr] = useState(7);
  const [loanTerm, setLoanTerm] = useState(60);   // months
  const [resale, setResale] = useState(12000);
  // LEASE inputs
  const [leaseMonthly, setLeaseMonthly] = useState(350);
  const [leaseDown, setLeaseDown] = useState(2000);
  const [leaseTerm, setLeaseTerm] = useState(36);  // months

  const r = useMemo(() => {
    const horizon = leaseTerm; // compare both options over the lease term
    const P = price - buyDown;
    const rate = apr / 1200;
    const n = loanTerm;
    const monthly = n <= 0 ? 0 : rate === 0 ? P / n : (P * rate) / (1 - Math.pow(1 + rate, -n));
    const buyPayMonths = Math.min(horizon, loanTerm);
    const buyPayments = monthly * buyPayMonths;
    const buyTotal = buyDown + buyPayments - resale;
    const leaseTotal = leaseDown + leaseMonthly * leaseTerm;
    const buyCheaper = buyTotal <= leaseTotal;
    const savings = Math.abs(buyTotal - leaseTotal);
    return {
      horizon, monthly, buyPayMonths, buyPayments, buyTotal, leaseTotal, buyCheaper, savings,
    };
  }, [price, buyDown, apr, loanTerm, resale, leaseMonthly, leaseDown, leaseTerm]);

  const fmt = (n: number) => Math.round(n).toLocaleString();

  const field = (id: string, label: string, val: number, set: (n: number) => void, ring: string, step = 1) => (
    <div>
      <label htmlFor={id} className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">{label}</label>
      <input id={id} type="number" min={0} step={step} value={val} onChange={(e) => set(Math.max(0, Number(e.target.value) || 0))}
        className={`w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 ${ring} transition-all`} inputMode="decimal" />
    </div>
  );

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        <div className="bg-cyan-accent border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3"><span className="text-2xl">🚗</span>
            <h2 className="!text-lg sm:!text-xl !my-0 !text-ink-900 font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>Lease vs Buy Calculator</h2>
          </div>
          <div className="inline-flex bg-white border-2 border-ink-900 rounded-full px-3 py-1 text-xs font-bold text-ink-900">Over {r.horizon} mo</div>
        </div>

        <div className="p-5 sm:p-7 bg-ink-50">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-ink-500 mb-3">🏦 Buy (finance)</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {field('lvb-price', 'Car price', price, setPrice, 'focus:ring-cyan-accent', 500)}
            {field('lvb-bdown', 'Down payment', buyDown, setBuyDown, 'focus:ring-lime-accent', 250)}
            {field('lvb-apr', 'Loan APR (%)', apr, setApr, 'focus:ring-yellow-accent', 0.1)}
            {field('lvb-term', 'Loan term (months)', loanTerm, setLoanTerm, 'focus:ring-violet-300', 6)}
            {field('lvb-resale', 'Resale value at end', resale, setResale, 'focus:ring-pink-accent', 500)}
          </div>

          <div className="text-[11px] font-extrabold uppercase tracking-wider text-ink-500 mt-6 mb-3">📄 Lease</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {field('lvb-lmonthly', 'Monthly lease payment', leaseMonthly, setLeaseMonthly, 'focus:ring-cyan-accent', 10)}
            {field('lvb-ldown', 'Lease down / drive-off', leaseDown, setLeaseDown, 'focus:ring-lime-accent', 250)}
            {field('lvb-lterm', 'Lease term (months)', leaseTerm, setLeaseTerm, 'focus:ring-yellow-accent', 6)}
          </div>
        </div>

        <div className="p-5 sm:p-7 bg-white border-t-[2.5px] border-ink-900">
          <div className="bg-cyan-accent border-[2.5px] border-ink-900 rounded-2xl p-5 sm:p-6 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Cheaper over {r.horizon} months</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight', letterSpacing: '-0.04em' }}>
              {r.buyCheaper ? 'Buying' : 'Leasing'} <span className="text-lg">saves {fmt(r.savings)}</span>
            </div>
            <div className="text-sm text-ink-900 font-bold mt-1">Buy finance payment ≈ {fmt(r.monthly)} / mo over {loanTerm} months.</div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
              <div className={`border-[2.5px] border-ink-900 rounded-xl p-4 ${r.buyCheaper ? 'bg-lime-accent' : 'bg-white/70'}`}>
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900">Buy total</div>
                  {r.buyCheaper && <span className="text-[10px] font-extrabold uppercase bg-ink-900 text-white rounded-full px-2 py-0.5">Cheaper</span>}
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-ink-900 leading-none mt-1" style={{ fontFamily: 'Inter Tight', letterSpacing: '-0.03em' }}>{fmt(r.buyTotal)}</div>
                <div className="text-[11px] text-ink-800 font-bold mt-1.5 leading-snug">{fmt(buyDown)} down + {fmt(r.buyPayments)} payments − {fmt(resale)} resale</div>
              </div>
              <div className={`border-[2.5px] border-ink-900 rounded-xl p-4 ${!r.buyCheaper ? 'bg-lime-accent' : 'bg-white/70'}`}>
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900">Lease total</div>
                  {!r.buyCheaper && <span className="text-[10px] font-extrabold uppercase bg-ink-900 text-white rounded-full px-2 py-0.5">Cheaper</span>}
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-ink-900 leading-none mt-1" style={{ fontFamily: 'Inter Tight', letterSpacing: '-0.03em' }}>{fmt(r.leaseTotal)}</div>
                <div className="text-[11px] text-ink-800 font-bold mt-1.5 leading-snug">{fmt(leaseDown)} down + {fmt(leaseMonthly)} × {leaseTerm} mo (own nothing at end)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · Simplified: ignores taxes, fees, maintenance, insurance and the time value of money. Leasing suits frequent upgrades; buying suits long-term keepers.</div>
    </div>
  );
}
