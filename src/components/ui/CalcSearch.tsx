import { useState, useMemo, useRef, useEffect } from 'react';
import type { Calculator } from '../../data/calculators';

interface Props {
  calculators: Calculator[];
}

export default function CalcSearch({ calculators }: Props) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return calculators
      .filter((c) => {
        return (
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.keywords.some((k) => k.toLowerCase().includes(q)) ||
          c.category.toLowerCase().includes(q)
        );
      })
      .slice(0, 8);
  }, [query, calculators]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIdx(0);
  }, [results.length]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIdx]) {
      e.preventDefault();
      window.location.href = results[selectedIdx].href;
    } else if (e.key === 'Escape') {
      setFocused(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl mx-auto">
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-500 pointer-events-none z-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={handleKey}
          placeholder="Search 100+ calculators…"
          className="w-full pl-12 pr-12 py-4 text-base md:text-lg font-semibold rounded-2xl border-[2.5px] border-ink-900 bg-white shadow-sticker focus:outline-none focus:-translate-x-0.5 focus:-translate-y-0.5 focus:shadow-[6px_6px_0_0_rgba(15,23,42,0.9)] transition-all placeholder:font-medium placeholder:text-ink-400 text-ink-900"
          aria-label="Search calculators"
          aria-autocomplete="list"
          aria-controls="search-results"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-ink-500 hover:text-ink-900 hover:bg-ink-100 rounded-full transition-colors"
            aria-label="Clear search"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {focused && results.length > 0 && (
        <ul
          id="search-results"
          className="absolute top-full left-0 right-0 mt-3 bg-white border-[2.5px] border-ink-900 rounded-2xl shadow-sticker py-1.5 z-[60] max-h-[28rem] overflow-y-auto overflow-x-hidden"
          role="listbox"
        >
          {results.map((c, idx) => (
            <li key={c.slug} role="option" aria-selected={idx === selectedIdx} className="px-1.5">
              <a
                href={c.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl no-underline transition-colors ${
                  idx === selectedIdx
                    ? 'bg-lime-accent/40 ring-2 ring-ink-900'
                    : 'hover:bg-ink-50'
                }`}
                onMouseEnter={() => setSelectedIdx(idx)}
              >
                <span className="text-2xl flex-shrink-0 leading-none w-8 text-center" aria-hidden="true">{c.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-ink-900 truncate" style={{ fontFamily: "'Inter Tight', sans-serif" }}>{c.name}</span>
                    {c.status === 'coming-soon' && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-ink-100 text-ink-700 uppercase tracking-wide">
                        Soon
                      </span>
                    )}
                  </div>
                  <div className="text-xs sm:text-sm text-ink-600 truncate font-medium">{c.description}</div>
                </div>
                <svg className={`w-4 h-4 flex-shrink-0 text-ink-400 transition-transform ${idx === selectedIdx ? 'translate-x-0.5 text-ink-900' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      )}

      {focused && query.trim() && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white border-[2.5px] border-ink-900 rounded-2xl shadow-sticker p-6 z-[60] text-center">
          <div className="text-3xl mb-2">🔍</div>
          <div className="font-extrabold text-ink-900" style={{ fontFamily: "'Inter Tight', sans-serif" }}>No calculator found for "{query}"</div>
          <p className="text-sm text-ink-600 mt-2 font-medium">
            <a href="/contact/" className="font-bold underline decoration-2 underline-offset-2 decoration-lime-accent text-ink-900">Request this calculator</a> and we will build it.
          </p>
        </div>
      )}
    </div>
  );
}
