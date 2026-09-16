import { useState, useMemo } from 'react';

function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a || 1;
}

// Parse a field: empty string => unknown (null), else number.
function parse(v: string): number | null {
  if (v.trim() === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export default function RatioCalculator() {
  // Proportion A : B = C : D — leave exactly one field blank to solve for it.
  const [a, setA] = useState('1');
  const [b, setB] = useState('2');
  const [c, setC] = useState('4');
  const [d, setD] = useState('');

  const solved = useMemo(() => {
    const va = parse(a), vb = parse(b), vc = parse(c), vd = parse(d);
    const vals = [va, vb, vc, vd];
    const blanks = vals.filter((v) => v === null).length;
    if (blanks !== 1) return { ok: false, msg: 'Leave exactly one box blank to solve for it.' };
    // A/B = C/D  ->  A*D = B*C
    let res: number, which: string;
    if (va === null) { if (vd === 0) return { ok: false, msg: 'Can\'t divide by zero.' }; res = (vb! * vc!) / vd!; which = 'A'; }
    else if (vb === null) { if (vc === 0) return { ok: false, msg: 'Can\'t divide by zero.' }; res = (va! * vd!) / vc!; which = 'B'; }
    else if (vc === null) { if (vb === 0) return { ok: false, msg: 'Can\'t divide by zero.' }; res = (va! * vd!) / vb!; which = 'C'; }
    else { if (va === 0) return { ok: false, msg: 'Can\'t divide by zero.' }; res = (vb! * vc!) / va!; which = 'D'; }
    return { ok: true, which, value: res };
  }, [a, b, c, d]);

  // Simplify A : B when both known
  const simplified = useMemo(() => {
    const va = parse(a), vb = parse(b);
    if (va === null || vb === null || vb === 0 || va === 0) return null;
    const g = gcd(va, vb);
    return { x: va / g, y: vb / g };
  }, [a, b]);

  const fieldCls = 'w-full px-3 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-lg font-extrabold text-center focus:outline-none focus:ring-4 focus:ring-lime-accent transition-all';

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        <div className="bg-lime-accent border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center gap-3">
          <span className="text-2xl flex-shrink-0">➗</span>
          <h2 className="!text-lg sm:!text-xl !my-0 !text-ink-900 font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>Ratio Calculator</h2>
        </div>

        <div className="p-5 sm:p-7 bg-ink-50">
          <p className="text-xs font-extrabold uppercase tracking-wider text-ink-500 mb-3 text-center">Solve the proportion: leave one box blank</p>
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <div className="w-20 sm:w-24"><input value={a} onChange={(e) => setA(e.target.value)} className={fieldCls} inputMode="decimal" aria-label="A" placeholder="A" /></div>
            <span className="text-2xl font-extrabold text-ink-900">:</span>
            <div className="w-20 sm:w-24"><input value={b} onChange={(e) => setB(e.target.value)} className={fieldCls} inputMode="decimal" aria-label="B" placeholder="B" /></div>
            <span className="text-2xl font-extrabold text-ink-900 px-1">=</span>
            <div className="w-20 sm:w-24"><input value={c} onChange={(e) => setC(e.target.value)} className={fieldCls} inputMode="decimal" aria-label="C" placeholder="C" /></div>
            <span className="text-2xl font-extrabold text-ink-900">:</span>
            <div className="w-20 sm:w-24"><input value={d} onChange={(e) => setD(e.target.value)} className={fieldCls} inputMode="decimal" aria-label="D" placeholder="D" /></div>
          </div>
        </div>

        {/* Result */}
        <div className="p-5 sm:p-7 bg-white border-t-[2.5px] border-ink-900 space-y-4">
          {solved.ok ? (
            <div className="bg-lime-accent border-[2.5px] border-ink-900 rounded-2xl p-5 sm:p-6 shadow-sticker-sm">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Solved for {solved.which}</div>
              <div className="text-4xl sm:text-5xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight', letterSpacing: '-0.04em' }}>
                {solved.which} = {Number(solved.value!.toFixed(4))}
              </div>
            </div>
          ) : (
            <div className="bg-white border-2 border-ink-200 rounded-2xl p-4 text-ink-600 font-bold text-sm">{solved.msg}</div>
          )}
          {simplified && (
            <div className="bg-cyan-accent border-2 border-ink-900 rounded-2xl p-4 shadow-sticker-sm">
              <span className="text-sm font-extrabold text-ink-900">Ratio A : B simplified → {simplified.x} : {simplified.y}</span>
            </div>
          )}
        </div>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · Enter any three of A : B = C : D and leave the fourth blank. Also reduces A : B to lowest terms.</div>
    </div>
  );
}
