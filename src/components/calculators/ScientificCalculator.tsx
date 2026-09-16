import { useState, useMemo } from 'react';

// Transform the human-readable display expression into a JS-evaluable string,
// then whitelist-validate before evaluating in a controlled scope.
function toJs(expr: string): string {
  return expr
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/π/g, 'PI')
    .replace(/(?<![a-zA-Z])e(?![a-zA-Z])/g, 'E')
    .replace(/√/g, 'sqrt')
    .replace(/\^/g, '**')
    .replace(/%/g, '/100')
    .replace(/(\d+(?:\.\d+)?)!/g, 'fact($1)');
}

const ALLOWED_WORDS = ['sqrt', 'sin', 'cos', 'tan', 'log', 'ln', 'PI', 'E', 'fact'];

function evaluate(expr: string, deg: boolean): { value: number | null; error: boolean } {
  if (!expr.trim()) return { value: null, error: false };
  let js = toJs(expr);
  let test = js;
  for (const w of ALLOWED_WORDS) test = test.split(w).join('');
  if (!/^[0-9+\-*/().\s]*$/.test(test)) return { value: null, error: true };
  const scope: Record<string, unknown> = {
    PI: Math.PI, E: Math.E,
    sqrt: Math.sqrt,
    ln: Math.log,
    log: (x: number) => Math.log10(x),
    sin: (x: number) => Math.sin(deg ? (x * Math.PI) / 180 : x),
    cos: (x: number) => Math.cos(deg ? (x * Math.PI) / 180 : x),
    tan: (x: number) => Math.tan(deg ? (x * Math.PI) / 180 : x),
    fact: (n: number) => {
      if (n < 0 || !Number.isInteger(n) || n > 170) return NaN;
      let r = 1;
      for (let i = 2; i <= n; i++) r *= i;
      return r;
    },
  };
  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function(...Object.keys(scope), `"use strict"; return (${js});`);
    const v = fn(...Object.values(scope));
    if (typeof v !== 'number' || !Number.isFinite(v)) return { value: null, error: true };
    return { value: v, error: false };
  } catch {
    return { value: null, error: true };
  }
}

const VALUE_END = /[0-9)πe%!]$/;

export default function ScientificCalculator() {
  const [expr, setExpr] = useState('');
  const [deg, setDeg] = useState(true);

  const preview = useMemo(() => evaluate(expr, deg), [expr, deg]);

  // Append a token, auto-inserting × before a value that follows a value-ender.
  const push = (token: string, isValue = false) => {
    setExpr((e) => {
      const mult = isValue && VALUE_END.test(e) ? '×' : '';
      return e + mult + token;
    });
  };
  const clearAll = () => setExpr('');
  const back = () => setExpr((e) => e.slice(0, -1));
  const equals = () => {
    if (preview.value !== null) setExpr(String(Number(preview.value.toPrecision(12))));
  };

  const B = ({ label, on, cls = '' }: { label: string; on: () => void; cls?: string }) => (
    <button type="button" onClick={on}
      className={`h-12 sm:h-14 rounded-xl border-2 border-ink-900 font-extrabold text-base sm:text-lg transition-all active:translate-y-0.5 ${cls}`}
      style={{ fontFamily: 'Inter Tight, Inter, sans-serif' }}>{label}</button>
  );

  const fn = 'bg-white text-ink-800 hover:bg-violet-300';
  const num = 'bg-ink-50 text-ink-900 hover:bg-white';
  const op = 'bg-cyan-accent text-ink-900 hover:brightness-95';
  const eq = 'bg-ink-900 text-white hover:bg-ink-800';

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        <div className="bg-violet-300 border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3"><span className="text-2xl">🔬</span>
            <h2 className="!text-lg sm:!text-xl !my-0 !text-ink-900 font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>Scientific Calculator</h2>
          </div>
          <div className="inline-flex bg-white border-2 border-ink-900 rounded-full p-0.5 text-xs font-bold">
            <button onClick={() => setDeg(true)} className={`px-3 py-1 rounded-full transition-all ${deg ? 'bg-ink-900 text-white' : 'text-ink-700'}`} type="button">DEG</button>
            <button onClick={() => setDeg(false)} className={`px-3 py-1 rounded-full transition-all ${!deg ? 'bg-ink-900 text-white' : 'text-ink-700'}`} type="button">RAD</button>
          </div>
        </div>

        {/* Display */}
        <div className="p-5 sm:p-6 bg-ink-900">
          <div className="text-right text-white/60 text-sm font-mono min-h-[20px] break-all">{expr || '0'}</div>
          <div className="text-right text-3xl sm:text-4xl font-extrabold break-all text-lime-accent min-h-[40px]" style={{ fontFamily: 'Inter Tight' }}>
            {preview.value !== null ? Number(preview.value.toPrecision(12)).toLocaleString('en-US', { maximumFractionDigits: 10 }) : ' '}
          </div>
        </div>

        {/* Keypad */}
        <div className="p-4 sm:p-5 bg-white grid grid-cols-5 gap-2 sm:gap-2.5">
          <B label="DEG" on={() => setDeg((d) => !d)} cls={fn + ' !text-xs'} />
          <B label="C" on={clearAll} cls="bg-pink-accent text-white hover:brightness-95" />
          <B label="⌫" on={back} cls={fn} />
          <B label="(" on={() => push('(', true)} cls={fn} />
          <B label=")" on={() => push(')')} cls={fn} />

          <B label="sin" on={() => push('sin(', true)} cls={fn + ' !text-sm'} />
          <B label="cos" on={() => push('cos(', true)} cls={fn + ' !text-sm'} />
          <B label="tan" on={() => push('tan(', true)} cls={fn + ' !text-sm'} />
          <B label="ln" on={() => push('ln(', true)} cls={fn + ' !text-sm'} />
          <B label="log" on={() => push('log(', true)} cls={fn + ' !text-sm'} />

          <B label="√" on={() => push('√(', true)} cls={fn} />
          <B label="xʸ" on={() => push('^')} cls={fn} />
          <B label="π" on={() => push('π', true)} cls={fn} />
          <B label="e" on={() => push('e', true)} cls={fn} />
          <B label="%" on={() => push('%')} cls={fn} />

          <B label="7" on={() => push('7')} cls={num} />
          <B label="8" on={() => push('8')} cls={num} />
          <B label="9" on={() => push('9')} cls={num} />
          <B label="÷" on={() => push('÷')} cls={op} />
          <B label="!" on={() => push('!')} cls={fn} />

          <B label="4" on={() => push('4')} cls={num} />
          <B label="5" on={() => push('5')} cls={num} />
          <B label="6" on={() => push('6')} cls={num} />
          <B label="×" on={() => push('×')} cls={op} />
          <B label="−" on={() => push('−')} cls={op} />

          <B label="1" on={() => push('1')} cls={num} />
          <B label="2" on={() => push('2')} cls={num} />
          <B label="3" on={() => push('3')} cls={num} />
          <B label="+" on={() => push('+')} cls={op} />
          <B label="=" on={equals} cls={eq} />

          <B label="0" on={() => push('0')} cls={num + ' col-span-2'} />
          <B label="." on={() => push('.')} cls={num} />
          <B label="00" on={() => push('00')} cls={num} />
          <B label="Ans×2" on={() => setExpr((e) => (preview.value !== null ? String(preview.value) + '×2' : e))} cls={fn + ' !text-xs'} />
        </div>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · Trig uses {deg ? 'degrees' : 'radians'} (toggle top-right). Supports π, e, powers (xʸ), √, log, ln and factorial (n!).</div>
    </div>
  );
}
