import { useState, useMemo } from 'react';

function fmtINR(n: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(n);
}

type Mode = 'exclusive' | 'inclusive';

export default function GstCalculator() {
  const [amount, setAmount] = useState<number>(10000);
  const [rate, setRate] = useState<number>(18);
  const [mode, setMode] = useState<Mode>('exclusive');

  const result = useMemo(() => {
    if (mode === 'exclusive') {
      // Amount is pre-GST. Add GST.
      const gstAmount = (amount * rate) / 100;
      const totalAmount = amount + gstAmount;
      return { netAmount: amount, gstAmount, totalAmount };
    } else {
      // Amount is GST-inclusive. Extract GST.
      const totalAmount = amount;
      const netAmount = (amount * 100) / (100 + rate);
      const gstAmount = totalAmount - netAmount;
      return { netAmount, gstAmount, totalAmount };
    }
  }, [amount, rate, mode]);

  // Split GST into CGST + SGST (intra-state) or IGST (inter-state) — show both
  const cgst = result.gstAmount / 2;
  const sgst = result.gstAmount / 2;
  const igst = result.gstAmount;

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        <div className="bg-yellow-accent border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🧾</span>
            <h2 className="!text-lg sm:!text-xl !my-0 !text-ink-900 font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>GST Calculator</h2>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink-900">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ink-900 opacity-50"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-ink-900"></span>
            </span>
            Live
          </span>
        </div>

        {/* Mode toggle */}
        <div className="px-5 sm:px-7 py-4 bg-ink-50 border-b-2 border-ink-100">
          <label className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Mode</label>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setMode('exclusive')}
              className={`py-3 px-3 rounded-xl border-[2.5px] border-ink-900 text-sm font-extrabold transition-all ${mode === 'exclusive' ? 'bg-ink-900 text-white shadow-sticker-sm -translate-y-0.5' : 'bg-white text-ink-700 hover:bg-yellow-accent/40'}`}>
              Add GST
              <div className="text-[10px] font-normal opacity-80 mt-0.5">amount is pre-GST</div>
            </button>
            <button type="button" onClick={() => setMode('inclusive')}
              className={`py-3 px-3 rounded-xl border-[2.5px] border-ink-900 text-sm font-extrabold transition-all ${mode === 'inclusive' ? 'bg-ink-900 text-white shadow-sticker-sm -translate-y-0.5' : 'bg-white text-ink-700 hover:bg-yellow-accent/40'}`}>
              Remove GST
              <div className="text-[10px] font-normal opacity-80 mt-0.5">amount is GST-included</div>
            </button>
          </div>
        </div>

        {/* Inputs */}
        <div className="p-5 sm:p-7 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 bg-ink-50">
          <div>
            <label htmlFor="gst-amount" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">
              {mode === 'exclusive' ? 'Net Amount (before GST)' : 'Total Amount (including GST)'}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">₹</span>
              <input id="gst-amount" type="number" min={0} step={100} value={amount} onChange={(e) => setAmount(Number(e.target.value) || 0)}
                className="w-full pl-7 pr-3 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-yellow-accent transition-all"
                inputMode="numeric" />
            </div>
            <input type="range" min={0} max={1000000} step={500} value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full mt-2 accent-yellow-accent" aria-label="Amount slider" />
          </div>
          <div>
            <label htmlFor="gst-rate" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">GST Rate</label>
            <div className="relative">
              <input id="gst-rate" type="number" min={0} max={100} step={0.5} value={rate} onChange={(e) => setRate(Number(e.target.value) || 0)}
                className="w-full pl-3.5 pr-8 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-pink-accent transition-all"
                inputMode="decimal" />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">%</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[0, 5, 12, 18, 28].map((r) => (
                <button key={r} type="button" onClick={() => setRate(r)} className={`px-2.5 py-1 rounded-full text-xs font-bold border-2 border-ink-900 transition-all ${rate === r ? 'bg-pink-accent text-white shadow-sticker-sm' : 'bg-white text-ink-700 hover:bg-pink-accent/30'}`}>
                  {r}%
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="p-5 sm:p-7 bg-white grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 border-t-[2.5px] border-ink-900">
          <div className="bg-cyan-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Net Amount</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmtINR(result.netAmount)}</div>
            <div className="text-xs text-ink-800 mt-2 font-semibold">pre-GST value</div>
          </div>
          <div className="bg-pink-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-white mb-1">GST ({rate}%)</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmtINR(result.gstAmount)}</div>
            <div className="text-xs text-white/90 mt-2 font-semibold">tax payable</div>
          </div>
          <div className="bg-lime-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Total Amount</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmtINR(result.totalAmount)}</div>
            <div className="text-xs text-ink-800 mt-2 font-semibold">net + GST</div>
          </div>
        </div>

        {/* CGST + SGST / IGST split */}
        <div className="px-5 sm:px-7 pb-5 sm:pb-7 bg-white">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mb-3">GST split (intra-state vs inter-state)</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-ink-50 border-2 border-ink-900 rounded-2xl p-4">
              <div className="text-xs font-extrabold uppercase tracking-wider text-ink-800 mb-2">Intra-state (same state)</div>
              <div className="flex justify-between mb-1.5 text-sm">
                <span className="font-bold text-ink-700">CGST ({(rate / 2).toFixed(1)}%)</span>
                <code className="font-mono font-bold text-ink-900">{fmtINR(cgst)}</code>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-bold text-ink-700">SGST ({(rate / 2).toFixed(1)}%)</span>
                <code className="font-mono font-bold text-ink-900">{fmtINR(sgst)}</code>
              </div>
            </div>
            <div className="bg-ink-50 border-2 border-ink-900 rounded-2xl p-4">
              <div className="text-xs font-extrabold uppercase tracking-wider text-ink-800 mb-2">Inter-state (different state)</div>
              <div className="flex justify-between text-sm">
                <span className="font-bold text-ink-700">IGST ({rate}%)</span>
                <code className="font-mono font-bold text-ink-900">{fmtINR(igst)}</code>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · GST rates in India: 0%, 5%, 12%, 18%, 28% (cess on luxury/sin goods adds extra)</div>
    </div>
  );
}
