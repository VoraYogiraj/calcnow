import { useState, useMemo } from 'react';

type Op = 'add' | 'sub' | 'mul' | 'div';
const OP_SYMBOL: Record<Op, string> = { add: '+', sub: '−', mul: '×', div: '÷' };

function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a || 1;
}

function compute(n1: number, d1: number, n2: number, d2: number, op: Op) {
  if (d1 === 0 || d2 === 0) return null;
  let n = 0, d = 1;
  switch (op) {
    case 'add': n = n1 * d2 + n2 * d1; d = d1 * d2; break;
    case 'sub': n = n1 * d2 - n2 * d1; d = d1 * d2; break;
    case 'mul': n = n1 * n2; d = d1 * d2; break;
    case 'div': n = n1 * d2; d = d1 * n2; break;
  }
  if (d === 0) return null;
  if (d < 0) { n = -n; d = -d; } // keep denominator positive
  const g = gcd(n, d);
  const sn = n / g, sd = d / g;
  const decimal = sn / sd;
  const whole = Math.trunc(sn / sd);
  const remainder = Math.abs(sn % sd);
  return { sn, sd, decimal, whole, remainder };
}

function NumBox({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <input type="number" step={1} value={value} onChange={(e) => onChange(Math.trunc(Number(e.target.value) || 0))}
      className="w-20 sm:w-24 px-2 py-2.5 bg-white border-[2.5px] border-ink-900 rounded-xl text-lg font-extrabold text-center focus:outline-none focus:ring-4 focus:ring-cyan-accent transition-all"
      inputMode="numeric" aria-label={label} />
  );
}

export default function FractionCalculator() {
  const [n1, setN1] = useState(1);
  const [d1, setD1] = useState(2);
  const [n2, setN2] = useState(3);
  const [d2, setD2] = useState(4);
  const [op, setOp] = useState<Op>('add');

  const result = useMemo(() => compute(n1, d1, n2, d2, op), [n1, d1, n2, d2, op]);

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        <div className="bg-cyan-accent border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center gap-3">
          <span className="text-2xl flex-shrink-0">½</span>
          <h2 className="!text-lg sm:!text-xl !my-0 !text-ink-900 font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>Fraction Calculator</h2>
        </div>

        <div className="p-5 sm:p-7 bg-ink-50">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {/* Fraction 1 */}
            <div className="flex flex-col items-center gap-1">
              <NumBox label="First numerator" value={n1} onChange={setN1} />
              <div className="w-20 sm:w-24 h-[3px] bg-ink-900 rounded"></div>
              <NumBox label="First denominator" value={d1} onChange={setD1} />
            </div>
            {/* Operator */}
            <select value={op} onChange={(e) => setOp(e.target.value as Op)}
              className="px-3 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-xl font-extrabold focus:outline-none focus:ring-4 focus:ring-violet-300 transition-all" aria-label="Operation">
              {(Object.keys(OP_SYMBOL) as Op[]).map((o) => <option key={o} value={o}>{OP_SYMBOL[o]}</option>)}
            </select>
            {/* Fraction 2 */}
            <div className="flex flex-col items-center gap-1">
              <NumBox label="Second numerator" value={n2} onChange={setN2} />
              <div className="w-20 sm:w-24 h-[3px] bg-ink-900 rounded"></div>
              <NumBox label="Second denominator" value={d2} onChange={setD2} />
            </div>
            <span className="text-2xl font-extrabold text-ink-900">=</span>
          </div>
        </div>

        {/* Result */}
        <div className="p-5 sm:p-7 bg-white border-t-[2.5px] border-ink-900">
          {result ? (
            <div className="bg-cyan-accent border-[2.5px] border-ink-900 rounded-2xl p-5 sm:p-6 shadow-sticker-sm">
              <div className="flex items-center gap-5 flex-wrap">
                <div className="flex flex-col items-center">
                  <div className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight' }}>{result.sn}</div>
                  {result.sd !== 1 && <>
                    <div className="w-full min-w-[40px] h-[3px] bg-ink-900 rounded my-1"></div>
                    <div className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight' }}>{result.sd}</div>
                  </>}
                </div>
                <div className="text-sm font-bold text-ink-900 space-y-1">
                  {result.sd !== 1 && result.whole !== 0 && (
                    <div>Mixed number: <strong>{result.whole} {result.remainder}/{result.sd}</strong></div>
                  )}
                  <div>Decimal: <strong>{Number(result.decimal.toFixed(6))}</strong></div>
                  <div className="text-xs text-ink-700">Simplified {result.sd === 1 ? '(whole number)' : 'to lowest terms'}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-pink-accent border-[2.5px] border-ink-900 rounded-2xl p-5 text-white font-extrabold">Denominator can't be zero. Check your inputs.</div>
          )}
        </div>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · Reduces to lowest terms and shows mixed-number and decimal forms. Negative numerators are allowed.</div>
    </div>
  );
}
