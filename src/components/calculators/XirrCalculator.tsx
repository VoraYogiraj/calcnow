import { useState, useMemo } from 'react';

/* ---------- ₹ + number helpers (hard-coded ₹, no LocalizeMoney) ---------- */
function fmtINR(n: number): string {
  const sign = n < 0 ? '-' : '';
  return `${sign}₹${Math.round(Math.abs(n)).toLocaleString('en-IN')}`;
}
function fmtINRShort(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  if (abs >= 10000000) return `${sign}₹${(abs / 10000000).toFixed(2)} Cr`;
  if (abs >= 100000) return `${sign}₹${(abs / 100000).toFixed(2)} L`;
  return `${sign}₹${Math.round(abs).toLocaleString('en-IN')}`;
}
function fmtPct(n: number): string {
  return `${n < 0 ? '-' : ''}${Math.abs(n).toFixed(2)}%`;
}
function fmtNum(n: number, dp = 2): string {
  return n.toLocaleString('en-IN', { minimumFractionDigits: dp, maximumFractionDigits: dp });
}

/* ---------- Date parsing (UTC, SSR-safe: parses explicit strings only) ----------
 * We never call new Date() with no args at render time. Every date comes from a
 * YYYY-MM-DD string held in state, parsed into a UTC timestamp so the server and
 * the client compute identical day counts regardless of local timezone. */
function parseISO(s: string): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s.trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  const ms = Date.UTC(y, mo - 1, d);
  const back = new Date(ms);
  // Reject impossible dates like 2024-02-31 that JS would silently roll over.
  if (back.getUTCFullYear() !== y || back.getUTCMonth() !== mo - 1 || back.getUTCDate() !== d) return null;
  return ms;
}
const DAY_MS = 86400000;

/** Add whole months to a YYYY-MM-DD string with pure integer math (no Date-of-now).
 *  Runs only inside the add-row click handler, never during SSR. */
function addMonthsISO(iso: string, n: number): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!m) return '2026-01-01';
  let y = Number(m[1]);
  let mo = Number(m[2]) + n;
  const d = m[3];
  y += Math.floor((mo - 1) / 12);
  mo = ((mo - 1) % 12 + 12) % 12 + 1;
  const dd = Math.min(Number(d), 28); // clamp to 28 so every month is valid
  return `${y}-${String(mo).padStart(2, '0')}-${String(dd).padStart(2, '0')}`;
}

interface Flow { id: number; date: string; amount: string; }

/* Realistic SIP-then-redeem default: five staggered ₹10,000 investments, one
 * ₹65,000 redemption. Fixed strings so SSR and first client render agree. */
const DEFAULT_FLOWS: Flow[] = [
  { id: 1, date: '2024-01-01', amount: '-10000' },
  { id: 2, date: '2024-04-01', amount: '-10000' },
  { id: 3, date: '2024-07-01', amount: '-10000' },
  { id: 4, date: '2024-10-01', amount: '-10000' },
  { id: 5, date: '2025-01-01', amount: '-10000' },
  { id: 6, date: '2026-01-01', amount: '65000' },
];

let nextId = 7;

type ParsedFlow = { ms: number; amount: number };

/** NPV of dated flows discounted from the earliest date, at annual rate r. */
function npv(rate: number, flows: ParsedFlow[], base: number): number {
  let s = 0;
  for (const f of flows) {
    const t = (f.ms - base) / DAY_MS / 365;
    s += f.amount / Math.pow(1 + rate, t);
  }
  return s;
}

export default function XirrCalculator() {
  const [flows, setFlows] = useState<Flow[]>(DEFAULT_FLOWS);

  const result = useMemo(() => {
    // --- Guard 1: enough rows to have both an outflow and an inflow.
    if (flows.length < 2) {
      return { ok: false as const, error: 'Add at least two cash flows. XIRR needs one date when money went in and one when money came out. A single line has nothing to solve.' };
    }

    // --- Guard 2: every date and amount must parse cleanly.
    const parsed: ParsedFlow[] = [];
    for (let i = 0; i < flows.length; i++) {
      const row = flows[i];
      const ms = parseISO(row.date);
      if (ms === null) {
        return { ok: false as const, error: `Row ${i + 1} has an invalid date. Use the format YYYY-MM-DD, for example 2024-01-01. Check for a blank field or an impossible day like 2024-02-31.` };
      }
      const raw = row.amount.trim();
      const amt = Number(raw);
      if (raw === '' || !Number.isFinite(amt)) {
        return { ok: false as const, error: `Row ${i + 1} has a blank or non-numeric amount. Enter the rupee value: negative for money you put in, positive for money you took out.` };
      }
      parsed.push({ ms, amount: amt });
    }

    const base = Math.min(...parsed.map((f) => f.ms));
    const lastMs = Math.max(...parsed.map((f) => f.ms));

    // --- Guard 3: all dates identical means every flow sits at t = 0, so NPV is
    // just their sum and no rate can change it. There is nothing to annualise.
    if (lastMs === base) {
      return { ok: false as const, error: 'All your cash flows share the same date. With zero elapsed time there is no period to annualise over, so XIRR is undefined. Spread the flows across at least two different dates.' };
    }

    // --- Guard 4: need at least one negative and one positive flow.
    const totalNeg = parsed.filter((f) => f.amount < 0).reduce((a, f) => a + f.amount, 0);
    const totalPos = parsed.filter((f) => f.amount > 0).reduce((a, f) => a + f.amount, 0);
    if (totalNeg === 0 || totalPos === 0) {
      return { ok: false as const, error: 'Cannot compute: no sign change. XIRR needs at least one negative cash flow (money invested) and one positive cash flow (money redeemed or the current value). Right now every amount points the same way.' };
    }

    // --- Bisection on [-0.9999, 100] i.e. -99.99% to +10000% per year.
    const LO = -0.9999;
    const HI = 100;
    let lo = LO;
    let hi = HI;
    let fLo = npv(lo, parsed, base);
    const fHi = npv(hi, parsed, base);

    // A genuine sign change in the cash flows still, in rare multi-root cases,
    // may not bracket a root at these endpoints. Guard rather than return NaN.
    if (fLo === 0) {
      return finish(lo, parsed, base, totalNeg, totalPos, lastMs);
    }
    if (fHi === 0) {
      return finish(hi, parsed, base, totalNeg, totalPos, lastMs);
    }
    if (fLo * fHi > 0) {
      return { ok: false as const, error: 'Cannot compute: the rate does not cross zero inside the searchable range (-99.99% to +10000% per year). This usually means the cash flows change sign more than once (for example money going in, then out, then in again), which can have several or no real XIRR. Simplify to one investment phase and one redemption.' };
    }

    let root = (lo + hi) / 2;
    for (let i = 0; i < 200; i++) {
      const mid = (lo + hi) / 2;
      root = mid;
      const fMid = npv(mid, parsed, base);
      if (Math.abs(fMid) < 1e-7) break;
      if (fLo * fMid < 0) {
        hi = mid;
      } else {
        lo = mid;
        fLo = fMid;
      }
    }

    return finish(root, parsed, base, totalNeg, totalPos, lastMs);
  }, [flows]);

  const update = (id: number, patch: Partial<Flow>) =>
    setFlows((fs) => fs.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  const addRow = () =>
    setFlows((fs) => {
      const last = fs[fs.length - 1];
      const nextDate = last ? addMonthsISO(last.date, 3) : '2026-01-01';
      return [...fs, { id: nextId++, date: nextDate, amount: '-10000' }];
    });
  const removeRow = (id: number) =>
    setFlows((fs) => (fs.length > 2 ? fs.filter((f) => f.id !== id) : fs));
  const reset = () => setFlows(DEFAULT_FLOWS.map((f) => ({ ...f })));

  const negative = result.ok && result.xirr < 0;

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        <div className="bg-sky-500 border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📊</span>
            <h2 className="!text-lg sm:!text-xl !my-0 !text-white font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>XIRR Calculator</h2>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-50"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            Live
          </span>
        </div>

        {/* Cash-flow editor */}
        <div className="p-5 sm:p-7 bg-ink-50">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="text-xs font-extrabold uppercase tracking-wider text-ink-700">Your cash flows</div>
            <button type="button" onClick={reset} className="text-[11px] font-extrabold text-ink-600 hover:text-ink-900 underline underline-offset-2">Reset to example</button>
          </div>
          <div className="hidden sm:grid grid-cols-[150px_1fr_40px] gap-3 mb-2 px-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-ink-500">Date</span>
            <span className="text-xs font-extrabold uppercase tracking-wider text-ink-500">Amount (₹)</span>
            <span></span>
          </div>
          <div className="space-y-2">
            {flows.map((f, i) => {
              const amtNum = Number(f.amount);
              const isOut = Number.isFinite(amtNum) && amtNum < 0;
              const isIn = Number.isFinite(amtNum) && amtNum > 0;
              return (
                <div key={f.id} className="grid grid-cols-[120px_1fr_36px] sm:grid-cols-[150px_1fr_40px] gap-2 sm:gap-3 items-center">
                  <input type="date" value={f.date} onChange={(e) => update(f.id, { date: e.target.value })}
                    className="w-full px-2.5 py-2.5 bg-white border-2 border-ink-900 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-sky-500 transition-all"
                    aria-label={`Date for cash flow ${i + 1}`} />
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">₹</span>
                    <input type="number" step={1000} value={f.amount} onChange={(e) => update(f.id, { amount: e.target.value })}
                      className={`w-full pl-7 pr-3 py-2.5 bg-white border-2 border-ink-900 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 transition-all ${isOut ? 'focus:ring-pink-accent text-pink-accent' : isIn ? 'focus:ring-lime-accent text-ink-900' : 'focus:ring-yellow-accent'}`}
                      inputMode="numeric" aria-label={`Amount for cash flow ${i + 1}`} />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-extrabold uppercase tracking-wide pointer-events-none">
                      {isOut ? <span className="text-pink-accent">invested</span> : isIn ? <span className="text-lime-600">received</span> : ''}
                    </span>
                  </div>
                  <button type="button" onClick={() => removeRow(f.id)} disabled={flows.length <= 2}
                    className="w-9 h-9 flex items-center justify-center rounded-xl border-2 border-ink-900 bg-white hover:bg-pink-accent hover:text-white text-ink-900 font-extrabold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label={`Remove cash flow ${i + 1}`}>×</button>
                </div>
              );
            })}
          </div>
          <button type="button" onClick={addRow} className="mt-4 px-4 py-2.5 rounded-xl border-2 border-ink-900 bg-white hover:bg-lime-accent text-ink-900 text-sm font-extrabold transition-colors shadow-sticker-sm">+ Add cash flow</button>
          <p className="text-[11px] text-ink-500 font-bold mt-3 !mb-0 leading-relaxed">
            Negative amount = money you put in (a purchase or SIP instalment). Positive amount = money you got back (a redemption, dividend, or today's value). You need at least one of each.
          </p>
        </div>

        {/* Error state */}
        {!result.ok && (
          <div className="mx-5 sm:mx-7 mb-5 sm:mb-7 bg-yellow-accent border-[2.5px] border-ink-900 rounded-2xl p-4 shadow-sticker-sm">
            <div className="flex items-start gap-2.5">
              <span className="text-lg leading-none">⚠️</span>
              <p className="text-xs sm:text-sm font-bold text-ink-900 !m-0 leading-snug">{result.error}</p>
            </div>
          </div>
        )}

        {/* Negative XIRR note */}
        {result.ok && negative && (
          <div className="mx-5 sm:mx-7 -mt-1 mb-1 bg-yellow-accent border-[2.5px] border-ink-900 rounded-2xl p-4 shadow-sticker-sm">
            <div className="flex items-start gap-2.5">
              <span className="text-lg leading-none">📉</span>
              <p className="text-xs sm:text-sm font-bold text-ink-900 !m-0 leading-snug">
                Your XIRR is negative, which is a valid result, not an error. Weighted for the timing of every flow, the money shrank at {fmtPct(Math.abs(result.xirr))} a year. You put in {fmtINR(result.invested)} and got back {fmtINR(result.returned)}.
              </p>
            </div>
          </div>
        )}

        {result.ok && (
          <>
            {/* Headline result cards */}
            <div className="p-5 sm:p-7 bg-white grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 border-t-[2.5px] border-ink-900">
              <div className="bg-lime-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">XIRR (annualised)</div>
                <div className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmtPct(result.xirr)}</div>
                <div className="text-xs text-ink-800 mt-2 font-semibold">per year, timing-weighted</div>
              </div>
              <div className="bg-cyan-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Absolute return</div>
                <div className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmtPct(result.absReturn)}</div>
                <div className="text-xs text-ink-800 mt-2 font-semibold">{result.gain >= 0 ? 'gain' : 'loss'} of {fmtINRShort(Math.abs(result.gain))} in total</div>
              </div>
              <div className="bg-pink-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-white mb-1">Invested vs returned</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.03em' }}>{fmtINRShort(result.invested)}</div>
                <div className="text-xs text-white/90 mt-2 font-semibold">in, {fmtINRShort(result.returned)} back over {fmtNum(result.spanYears, 2)} yr</div>
              </div>
            </div>

            {/* Plain-language read */}
            <div className="px-5 sm:px-7 pb-1 bg-white">
              <div className="bg-ink-50 border-2 border-ink-900 rounded-2xl p-4 sm:p-5">
                <p className="text-sm sm:text-base font-bold text-ink-900 !m-0 leading-relaxed">
                  Your money grew at <span className="text-pink-accent">{fmtPct(result.xirr)} per year</span>, accounting for the timing of each investment. You committed {fmtINR(result.invested)} across {result.investCount} dated {result.investCount === 1 ? 'flow' : 'flows'} and received {fmtINR(result.returned)}, an absolute gain of {fmtINR(result.gain)} ({fmtPct(result.absReturn)}). Because the rupees you added earlier compounded for longer than the ones you added last, XIRR is the honest single rate that ties every dated flow together.
                </p>
              </div>
            </div>

            {/* Cash-flow table with present values at the solved rate */}
            <div className="px-5 sm:px-7 pt-6 pb-5 sm:pb-7 bg-white">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mb-3">How the solver balances your flows at {fmtPct(result.xirr)}</div>
              <div className="bg-ink-50 border-2 border-ink-900 rounded-2xl overflow-x-auto">
                <table className="w-full text-sm min-w-[520px]">
                  <thead>
                    <tr className="border-b-2 border-ink-900">
                      <th className="text-left px-4 py-2.5 font-extrabold text-ink-900 text-xs uppercase tracking-wider">Date</th>
                      <th className="text-right px-4 py-2.5 font-extrabold text-ink-900 text-xs uppercase tracking-wider">Days from start</th>
                      <th className="text-right px-4 py-2.5 font-extrabold text-ink-900 text-xs uppercase tracking-wider">Cash flow</th>
                      <th className="text-right px-4 py-2.5 font-extrabold text-ink-900 text-xs uppercase tracking-wider">Discounted value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.rows.map((r, i) => (
                      <tr key={i} className="border-b border-ink-200 last:border-0">
                        <td className="px-4 py-2.5 font-bold text-ink-800">{r.date}</td>
                        <td className="px-4 py-2.5 text-right font-bold text-ink-700">{r.days}</td>
                        <td className={`px-4 py-2.5 text-right font-extrabold ${r.amount < 0 ? 'text-pink-accent' : 'text-ink-900'}`}>{fmtINR(r.amount)}</td>
                        <td className={`px-4 py-2.5 text-right font-bold ${r.pv < 0 ? 'text-pink-accent' : 'text-ink-700'}`}>{fmtINR(r.pv)}</td>
                      </tr>
                    ))}
                    <tr className="border-t-2 border-ink-900 bg-lime-accent/40">
                      <td className="px-4 py-2.5 font-extrabold text-ink-900" colSpan={3}>Sum of discounted values (target = ₹0)</td>
                      <td className="px-4 py-2.5 text-right font-extrabold text-ink-900">{fmtINR(result.npvCheck)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] sm:text-xs text-ink-600 font-semibold mt-3 leading-relaxed">
                XIRR is the one annual rate at which every flow, discounted by its own number of days from the first date, cancels out to zero. The final row shows the sum landing on (near) ₹0, which is what "solved" means. Each day count is the actual gap from your earliest date, so a leap year or an odd-length month is handled exactly, not rounded to whole months.
              </p>

              {/* Why XIRR differs from CAGR / absolute return */}
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mt-6 mb-3">Why XIRR is not the same as CAGR or absolute return</div>
              <div className="bg-ink-50 border-2 border-ink-900 rounded-2xl p-4 sm:p-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="bg-white border-2 border-ink-900 rounded-xl p-3.5">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-500 mb-1">Absolute return</div>
                    <div className="text-xl font-extrabold text-ink-900">{fmtPct(result.absReturn)}</div>
                    <div className="text-[11px] text-ink-600 font-semibold mt-1">Ignores time entirely. {fmtINR(result.returned)} on {fmtINR(result.invested)}.</div>
                  </div>
                  <div className="bg-white border-2 border-ink-900 rounded-xl p-3.5">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-500 mb-1">Naive CAGR</div>
                    <div className="text-xl font-extrabold text-ink-900">{result.naiveCagr !== null ? fmtPct(result.naiveCagr) : 'n/a'}</div>
                    <div className="text-[11px] text-ink-600 font-semibold mt-1">Treats all {fmtINR(result.invested)} as one lump on day one. Understates a staggered plan.</div>
                  </div>
                  <div className="bg-white border-2 border-ink-900 rounded-xl p-3.5">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-500 mb-1">XIRR</div>
                    <div className="text-xl font-extrabold text-pink-accent">{fmtPct(result.xirr)}</div>
                    <div className="text-[11px] text-ink-600 font-semibold mt-1">Weights every rupee by how long it actually stayed invested.</div>
                  </div>
                </div>
                <p className="text-[11px] sm:text-xs text-ink-600 font-semibold mt-3 !mb-0 leading-relaxed">
                  Absolute return is just total profit over total outlay with no clock at all. A naive CAGR pretends your whole {fmtINR(result.invested)} arrived on the first date, so for a SIP it typically reads too low, because most instalments were invested for far less than the full span. XIRR fixes both by discounting each dated flow on its own timeline. When there is exactly one investment and one redemption, XIRR and CAGR agree to the decimal.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · Solved by bisection on the date-weighted NPV. A negative XIRR is a real loss rate, not a bug. Multiple sign changes can have several answers.</div>
    </div>
  );
}

/* Assemble the success payload once a rate is found, so the two exit paths
 * (exact zero at an endpoint, or bisected root) share identical output shape. */
function finish(rate: number, parsed: ParsedFlow[], base: number, totalNeg: number, totalPos: number, lastMs: number) {
  const invested = -totalNeg; // shown positive
  const returned = totalPos;
  const gain = returned - invested;
  const absReturn = invested !== 0 ? (gain / invested) * 100 : 0;
  const spanYears = (lastMs - base) / DAY_MS / 365;

  const rows = parsed.map((f) => {
    const days = Math.round((f.ms - base) / DAY_MS);
    const t = (f.ms - base) / DAY_MS / 365;
    const pv = f.amount / Math.pow(1 + rate, t);
    return { date: new Date(f.ms).toISOString().slice(0, 10), days, amount: f.amount, pv };
  });
  const npvCheck = rows.reduce((a, r) => a + r.pv, 0);

  const investCount = parsed.filter((f) => f.amount < 0).length;

  // Naive CAGR treats the whole invested sum as a single day-zero lump.
  const naiveCagr =
    spanYears > 0 && invested > 0 && returned > 0
      ? (Math.pow(returned / invested, 1 / spanYears) - 1) * 100
      : null;

  return {
    ok: true as const,
    xirr: rate * 100,
    invested,
    returned,
    gain,
    absReturn,
    spanYears,
    rows,
    npvCheck,
    investCount,
    naiveCagr,
    error: null,
  };
}
