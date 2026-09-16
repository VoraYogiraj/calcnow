import { useState, useMemo } from 'react';

const parseDate = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};

const toDateString = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

interface DiffResult {
  totalDays: number;
  years: number;
  months: number;
  days: number;
  weeks: number;
  remainderDays: number;
  workingDays: number;
  valid: boolean;
  negative: boolean;
}

function calcDiff(startStr: string, endStr: string): DiffResult {
  const empty: DiffResult = { totalDays: 0, years: 0, months: 0, days: 0, weeks: 0, remainderDays: 0, workingDays: 0, valid: false, negative: false };
  if (!startStr || !endStr) return empty;
  const start = parseDate(startStr);
  const end = parseDate(endStr);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return empty;

  const negative = end < start;
  const [from, to] = negative ? [end, start] : [start, end];

  const msPerDay = 86400000;
  const totalDays = Math.round((to.getTime() - from.getTime()) / msPerDay);

  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const weeks = Math.floor(totalDays / 7);
  const remainderDays = totalDays % 7;

  // Working days approximation
  const fullWeeks = Math.floor(totalDays / 7);
  const leftoverDays = totalDays % 7;
  const workingDays = fullWeeks * 5 + Math.min(leftoverDays, 5);

  return { totalDays, years, months, days, weeks, remainderDays, workingDays, valid: true, negative };
}

export default function DateDifferenceCalculator() {
  const today = toDateString(new Date());
  const [startDate, setStartDate] = useState('2020-01-01');
  const [endDate, setEndDate] = useState(today);

  const result = useMemo(() => calcDiff(startDate, endDate), [startDate, endDate]);

  const handleSwap = () => {
    setStartDate(endDate);
    setEndDate(startDate);
  };

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        {/* Header */}
        <div className="bg-lime-accent border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📅</span>
            <h2 className="!text-lg sm:!text-xl !my-0 !text-ink-900 font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>Date Difference Calculator</h2>
          </div>
          <button
            onClick={handleSwap}
            type="button"
            className="px-3 py-1.5 bg-white border-2 border-ink-900 rounded-full text-xs font-bold text-ink-900 shadow-sticker-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
          >
            ⇄ Swap
          </button>
        </div>

        {/* Inputs */}
        <div className="p-5 sm:p-7 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-ink-50">
          <div>
            <label htmlFor="diff-start" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Start Date</label>
            <input
              id="diff-start"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-lime-accent transition-all"
            />
          </div>
          <div>
            <label htmlFor="diff-end" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">End Date</label>
            <input
              id="diff-end"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-cyan-accent transition-all"
            />
          </div>
        </div>

        {/* Results */}
        <div className="p-5 sm:p-7 bg-white border-t-[2.5px] border-ink-900">
          {!result.valid ? (
            <div className="text-center py-8 text-ink-500 font-semibold">Enter two dates to calculate the difference.</div>
          ) : (
            <>
              {result.negative && (
                <div className="mb-4 px-4 py-2 bg-yellow-accent border-[2.5px] border-ink-900 rounded-xl text-xs font-extrabold text-ink-900">
                  Note: End date is before start date, showing absolute difference.
                </div>
              )}
              {/* Hero: total days */}
              <div className="bg-lime-accent border-[2.5px] border-ink-900 rounded-2xl p-5 sm:p-6 shadow-sticker-sm mb-4">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Total Days</div>
                <div className="text-4xl sm:text-5xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{result.totalDays.toLocaleString()}</div>
                <div className="text-sm font-bold text-ink-700 mt-2">{result.weeks.toLocaleString()} weeks {result.remainderDays > 0 ? `${result.remainderDays} days` : ''}</div>
              </div>

              {/* Breakdown */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: 'Years', value: result.years, bg: 'bg-cyan-accent', text: 'text-ink-900' },
                  { label: 'Months', value: result.months, bg: 'bg-pink-accent', text: 'text-white' },
                  { label: 'Days', value: result.days, bg: 'bg-yellow-accent', text: 'text-ink-900' },
                ].map((card) => (
                  <div key={card.label} className={`${card.bg} border-[2.5px] border-ink-900 rounded-2xl p-4 shadow-sticker-sm text-center`}>
                    <div className={`text-[10px] font-extrabold uppercase tracking-wider ${card.text} mb-1`}>{card.label}</div>
                    <div className={`text-3xl sm:text-4xl font-extrabold leading-none ${card.text}`} style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{card.value}</div>
                  </div>
                ))}
              </div>

              {/* Working days */}
              <div className="flex items-center gap-3 bg-ink-50 border-[2.5px] border-ink-900 rounded-2xl p-4 shadow-sticker-sm">
                <div className="text-2xl">💼</div>
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mb-0.5">Working Days (approx.)</div>
                  <div className="text-xl font-extrabold text-ink-900" style={{ fontFamily: 'Inter Tight, Inter, sans-serif' }}>{result.workingDays.toLocaleString()} days</div>
                  <div className="text-xs font-medium text-ink-500">Mon–Fri estimate · excludes public holidays</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · Working days are an approximation (no holiday calendar)</div>
    </div>
  );
}
