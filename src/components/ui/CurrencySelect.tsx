/**
 * Reusable currency dropdown. Used inside every money calculator.
 * Renders as a compact pill: "🇦🇪 AED ▾" — clicking opens a 30-currency list.
 *
 * State is owned by the parent (controlled component). The parent decides whether
 * to:
 *   • lock the currency (country pages — don't render this picker, or render readonly)
 *   • allow change (global hub pages — use detectClientCurrency() as default)
 */
import { useState, useRef, useEffect } from 'react';
import { CURRENCIES, type CurrencyOption } from '../../lib/currency';

interface Props {
  value: CurrencyOption;
  onChange: (next: CurrencyOption) => void;
  /** When true, renders read-only chip (no dropdown). For country pages. */
  locked?: boolean;
  /** Optional CSS classes for the wrapper. */
  className?: string;
}

export default function CurrencySelect({ value, onChange, locked = false, className = '' }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  if (locked) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink-900 px-2.5 py-1 rounded-lg bg-ink-100 border border-ink-200 ${className}`}
        title={`Showing ${value.label} (locked for this region)`}
      >
        <span aria-hidden="true">{value.flag}</span>
        <span>{value.code}</span>
      </span>
    );
  }

  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink-900 px-2.5 py-1 rounded-lg bg-white border-2 border-ink-900 hover:bg-lime-accent/30 hover:shadow-sticker-sm hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
      >
        <span aria-hidden="true">{value.flag}</span>
        <span>{value.code}</span>
        <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Select currency"
          className="absolute z-50 right-0 top-full mt-2 w-64 max-h-80 overflow-y-auto bg-white border-[2.5px] border-ink-900 rounded-2xl shadow-sticker py-1.5"
        >
          {CURRENCIES.map((c) => (
            <li key={c.code} role="option" aria-selected={c.code === value.code} className="px-1.5">
              <button
                type="button"
                onClick={() => {
                  onChange(c);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors ${
                  c.code === value.code ? 'bg-lime-accent/40 ring-2 ring-ink-900' : 'hover:bg-ink-50'
                }`}
              >
                <span className="text-lg leading-none flex-shrink-0 w-6 text-center" aria-hidden="true">{c.flag}</span>
                <span className="font-extrabold text-ink-900 text-sm tabular-nums w-12 flex-shrink-0">{c.code}</span>
                <span className="text-sm text-ink-600 font-medium truncate">{c.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
