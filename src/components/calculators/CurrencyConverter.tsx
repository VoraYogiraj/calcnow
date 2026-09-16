import { useState, useMemo, useEffect } from 'react';

interface Props {
  fromCode: string;
  fromSymbol: string;
  fromName: string;
  fromFlag: string;
  toCode: string;
  toSymbol: string;
  toName: string;
  toFlag: string;
  rate: number;
  lastUpdated: string;
}

function fmt(value: number, code: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: code,
    maximumFractionDigits: code === 'JPY' || code === 'PKR' ? 0 : 2,
  }).format(value);
}

export default function CurrencyConverter({
  fromCode, fromSymbol, fromName, fromFlag,
  toCode, toSymbol, toName, toFlag,
  rate, lastUpdated,
}: Props) {
  const [amount, setAmount] = useState<number>(1);
  const [direction, setDirection] = useState<'from-to' | 'to-from'>('from-to');

  // Live mid-market rate (open.er-api.com — free, daily ECB-style refresh, no key).
  // Falls back silently to the build-time rate if the fetch fails or the pair is missing.
  const [liveRate, setLiveRate] = useState<number | null>(null);
  const [liveDate, setLiveDate] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    fetch(`https://open.er-api.com/v6/latest/${fromCode}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data || data.result !== 'success') return;
        const r = data.rates?.[toCode];
        if (typeof r === 'number' && r > 0) {
          setLiveRate(r);
          try {
            setLiveDate(new Date(data.time_last_update_utc).toISOString().slice(0, 10));
          } catch { setLiveDate('today'); }
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [fromCode, toCode]);

  const effectiveRate = liveRate ?? rate;

  const result = useMemo(() => {
    if (direction === 'from-to') return amount * effectiveRate;
    return amount / effectiveRate;
  }, [amount, effectiveRate, direction]);

  const activeFrom = direction === 'from-to' ? { code: fromCode, symbol: fromSymbol, name: fromName, flag: fromFlag } : { code: toCode, symbol: toSymbol, name: toName, flag: toFlag };
  const activeTo = direction === 'from-to' ? { code: toCode, symbol: toSymbol, name: toName, flag: toFlag } : { code: fromCode, symbol: fromSymbol, name: fromName, flag: fromFlag };

  // Common amounts table (computed both ways)
  const commonAmounts = [1, 10, 100, 500, 1000, 5000, 10000, 50000, 100000];

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        <div className="bg-cyan-accent border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💱</span>
            <h2 className="!text-lg sm:!text-xl !my-0 !text-ink-900 font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>
              {activeFrom.code} → {activeTo.code} Converter
            </h2>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink-900">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ink-900 opacity-50"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-ink-900"></span>
            </span>
            {liveRate ? `Live rate · ${liveDate}` : `Rate as of ${lastUpdated}`}
          </span>
        </div>

        {/* Direction toggle */}
        <div className="p-5 sm:p-7 bg-ink-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">
                {activeFrom.flag} From {activeFrom.code} ({activeFrom.name})
              </label>
              <div className="relative">
                {/* Multi-char symbols (NZ$, AED, Mex$) shrink and get wider input padding
                    so the typed value never renders underneath the prefix. */}
                <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none ${activeFrom.symbol.length > 1 ? 'text-xs' : ''}`}>{activeFrom.symbol}</span>
                <input
                  type="number" min={0} step={0.01} value={amount}
                  onChange={(e) => setAmount(Number(e.target.value) || 0)}
                  className={`w-full ${activeFrom.symbol.length > 1 ? 'pl-14' : 'pl-9'} pr-3 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-lg font-bold focus:outline-none focus:ring-4 focus:ring-cyan-accent transition-all`}
                  inputMode="decimal"
                />
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <button
                onClick={() => setDirection(direction === 'from-to' ? 'to-from' : 'from-to')}
                className="w-12 h-12 rounded-full bg-yellow-accent border-[2.5px] border-ink-900 shadow-sticker-sm hover:shadow-sticker hover:-translate-y-0.5 transition-all flex items-center justify-center"
                aria-label="Swap currencies"
                title="Swap currencies"
              >
                <svg className="w-6 h-6 text-ink-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m-4 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </button>
            </div>
          </div>
          <button
            onClick={() => setDirection(direction === 'from-to' ? 'to-from' : 'from-to')}
            className="md:hidden w-full mt-3 py-2 bg-yellow-accent border-[2.5px] border-ink-900 rounded-full text-sm font-bold shadow-sticker-sm hover:shadow-sticker hover:-translate-y-0.5 transition-all"
          >
            ↕ Swap currencies
          </button>
        </div>

        {/* Result */}
        <div className="p-5 sm:p-7 bg-white border-t-[2.5px] border-ink-900">
          <div className="bg-lime-accent border-[2.5px] border-ink-900 rounded-2xl p-5 sm:p-6 shadow-sticker-sm">
            <div className="text-xs font-extrabold uppercase tracking-wider text-ink-900 mb-2">
              {activeFrom.flag} {fmt(amount, activeFrom.code)} = {activeTo.flag}
            </div>
            <div className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-ink-900 leading-none break-all" style={{ fontFamily: 'Inter Tight', letterSpacing: '-0.04em' }}>
              {fmt(result, activeTo.code)}
            </div>
            <div className="text-xs text-ink-800 mt-3 font-semibold">
              Rate: 1 {activeFrom.code} = {direction === 'from-to' ? effectiveRate.toFixed(4) : (1 / effectiveRate).toFixed(6)} {activeTo.code}{liveRate ? ' (live)' : ''}
            </div>
          </div>
        </div>

        {/* Common amounts table */}
        <div className="px-5 sm:px-7 pb-5 sm:pb-7 bg-white">
          <div className="text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-3">
            Common conversions
          </div>
          <div className="bg-ink-50 border-2 border-ink-900 rounded-2xl overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-ink-900 text-white">
                <tr>
                  <th className="text-left px-3 py-2 font-extrabold uppercase text-xs tracking-wider">{activeFrom.flag} {activeFrom.code}</th>
                  <th className="text-right px-3 py-2 font-extrabold uppercase text-xs tracking-wider">{activeTo.flag} {activeTo.code}</th>
                </tr>
              </thead>
              <tbody>
                {commonAmounts.map((a, idx) => {
                  const converted = direction === 'from-to' ? a * effectiveRate : a / effectiveRate;
                  return (
                    <tr key={a} className={`border-b border-ink-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-ink-50'}`}>
                      <td className="px-3 py-2 font-bold text-ink-900">{fmt(a, activeFrom.code)}</td>
                      <td className="px-3 py-2 text-right font-bold text-ink-900">{fmt(converted, activeTo.code)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">
        ✨ Mid-market rate · {liveRate ? `live, updated ${liveDate}` : `as of ${lastUpdated}`} · Real-world transfer rates may differ 0.5-3% depending on provider · Not financial advice
      </div>
    </div>
  );
}
