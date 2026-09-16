import { useState, useMemo } from 'react';

type Mode = 'add' | 'remove';

export default function SalesTaxCalculator() {
  const [mode, setMode] = useState<Mode>('add');
  const [amount, setAmount] = useState(1000);
  const [rate, setRate] = useState(18);

  const r = rate / 100;
  const { net, tax, gross } = useMemo(() => {
    if (mode === 'add') {
      const net = amount;
      const tax = net * r;
      return { net, tax, gross: net + tax };
    }
    // remove: amount is gross (tax-inclusive)
    const gross = amount;
    const net = gross / (1 + r);
    return { net, tax: gross - net, gross };
  }, [mode, amount, r]);

  const fmt = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        <div className="bg-lime-accent border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center gap-3">
          <span className="text-2xl flex-shrink-0">🧾</span>
          <h2 className="!text-lg sm:!text-xl !my-0 !text-ink-900 font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>Sales Tax / VAT</h2>
        </div>

        <div className="p-5 sm:p-7 bg-ink-50">
          <div className="grid grid-cols-2 gap-2 mb-5">
            {([['add', 'Add tax (net → gross)'], ['remove', 'Remove tax (gross → net)']] as const).map(([m, label]) => (
              <button key={m} type="button" onClick={() => setMode(m)}
                className={`py-2.5 px-2 rounded-xl border-2 border-ink-900 text-sm font-extrabold transition-all ${mode === m ? 'bg-ink-900 text-white shadow-sticker-sm -translate-y-0.5' : 'bg-white text-ink-700 hover:bg-lime-accent'}`}>
                {label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="st-amt" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">{mode === 'add' ? 'Amount before tax' : 'Amount incl. tax'}</label>
              <input id="st-amt" type="number" min={0} value={amount} onChange={(e) => setAmount(Number(e.target.value) || 0)}
                className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-cyan-accent transition-all" inputMode="decimal" />
            </div>
            <div>
              <label htmlFor="st-rate" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Tax rate (%)</label>
              <input id="st-rate" type="number" min={0} max={100} step={0.1} value={rate} onChange={(e) => setRate(Number(e.target.value) || 0)}
                className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-yellow-accent transition-all" inputMode="decimal" />
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-7 bg-white border-t-[2.5px] border-ink-900">
          <div className="bg-lime-accent border-[2.5px] border-ink-900 rounded-2xl p-5 sm:p-6 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">{mode === 'add' ? 'Total incl. tax' : 'Net (before tax)'}</div>
            <div className="text-4xl sm:text-5xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight', letterSpacing: '-0.04em' }}>{fmt(mode === 'add' ? gross : net)}</div>
            <div className="grid grid-cols-3 gap-3 mt-5 text-center">
              <div className="bg-white/70 border-2 border-ink-900 rounded-xl p-2"><div className="text-[10px] font-bold text-ink-700 uppercase">Net</div><div className="text-base font-extrabold text-ink-900">{fmt(net)}</div></div>
              <div className="bg-white/70 border-2 border-ink-900 rounded-xl p-2"><div className="text-[10px] font-bold text-ink-700 uppercase">Tax ({rate}%)</div><div className="text-base font-extrabold text-ink-900">{fmt(tax)}</div></div>
              <div className="bg-white/70 border-2 border-ink-900 rounded-xl p-2"><div className="text-[10px] font-bold text-ink-700 uppercase">Gross</div><div className="text-base font-extrabold text-ink-900">{fmt(gross)}</div></div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · Works for VAT, GST and US sales tax. "Remove tax" back-calculates the net from a tax-inclusive price: net = gross ÷ (1 + rate).</div>
    </div>
  );
}
