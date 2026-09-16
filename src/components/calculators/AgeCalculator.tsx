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

interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalHours: number;
  nextBirthdayDate: Date;
  nextBirthdayDays: number;
  valid: boolean;
}

function calcAge(dobStr: string, asOfStr: string): AgeResult {
  const empty: AgeResult = { years: 0, months: 0, days: 0, totalDays: 0, totalWeeks: 0, totalHours: 0, nextBirthdayDate: new Date(), nextBirthdayDays: 0, valid: false };
  if (!dobStr || !asOfStr) return empty;
  const dob = parseDate(dobStr);
  const asOf = parseDate(asOfStr);
  if (isNaN(dob.getTime()) || isNaN(asOf.getTime())) return empty;
  if (asOf < dob) return empty;

  let years = asOf.getFullYear() - dob.getFullYear();
  let months = asOf.getMonth() - dob.getMonth();
  let days = asOf.getDate() - dob.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(asOf.getFullYear(), asOf.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const msPerDay = 86400000;
  const totalDays = Math.floor((asOf.getTime() - dob.getTime()) / msPerDay);
  const totalWeeks = Math.floor(totalDays / 7);
  const totalHours = totalDays * 24;

  // Next birthday
  let nextBirthdayYear = asOf.getFullYear();
  let nextBirthday = new Date(nextBirthdayYear, dob.getMonth(), dob.getDate());
  if (nextBirthday <= asOf) {
    nextBirthdayYear++;
    nextBirthday = new Date(nextBirthdayYear, dob.getMonth(), dob.getDate());
  }
  const nextBirthdayDays = Math.ceil((nextBirthday.getTime() - asOf.getTime()) / msPerDay);

  return { years, months, days, totalDays, totalWeeks, totalHours, nextBirthdayDate: nextBirthday, nextBirthdayDays, valid: true };
}

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function fmt(d: Date) {
  return `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export default function AgeCalculator() {
  const today = toDateString(new Date());
  const [dob, setDob] = useState('1990-03-15');
  const [asOf, setAsOf] = useState(today);

  const result = useMemo(() => calcAge(dob, asOf), [dob, asOf]);

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        {/* Header */}
        <div className="bg-lime-accent border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center gap-3">
          <span className="text-2xl">🎂</span>
          <h2 className="!text-lg sm:!text-xl !my-0 !text-ink-900 font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>Age Calculator</h2>
        </div>

        {/* Inputs */}
        <div className="p-5 sm:p-7 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-ink-50">
          <div>
            <label htmlFor="age-dob" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Date of Birth</label>
            <input
              id="age-dob"
              type="date"
              max={today}
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-lime-accent transition-all"
            />
          </div>
          <div>
            <label htmlFor="age-asof" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Calculate As Of</label>
            <input
              id="age-asof"
              type="date"
              value={asOf}
              onChange={(e) => setAsOf(e.target.value)}
              className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-cyan-accent transition-all"
            />
          </div>
        </div>

        {/* Results */}
        <div className="p-5 sm:p-7 bg-white border-t-[2.5px] border-ink-900">
          {!result.valid ? (
            <div className="text-center py-8 text-ink-500 font-semibold">Enter a valid date of birth to see your age.</div>
          ) : (
            <>
              {/* Main 3 cards */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {[
                  { label: 'Years', value: result.years, bg: 'bg-lime-accent', text: 'text-ink-900' },
                  { label: 'Months', value: result.months, bg: 'bg-cyan-accent', text: 'text-ink-900' },
                  { label: 'Days', value: result.days, bg: 'bg-pink-accent', text: 'text-white' },
                ].map((card) => (
                  <div key={card.label} className={`${card.bg} border-[2.5px] border-ink-900 rounded-2xl p-4 sm:p-5 shadow-sticker-sm text-center`}>
                    <div className={`text-[10px] font-extrabold uppercase tracking-wider ${card.text} mb-1`}>{card.label}</div>
                    <div className={`text-3xl sm:text-4xl font-extrabold leading-none ${card.text}`} style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{card.value}</div>
                  </div>
                ))}
              </div>

              {/* Next birthday */}
              <div className="mt-4 bg-yellow-accent border-[2.5px] border-ink-900 rounded-2xl p-4 sm:p-5 shadow-sticker-sm">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Next Birthday</div>
                <div className="text-base font-bold text-ink-900">
                  {result.nextBirthdayDays === 0
                    ? '🎉 Happy Birthday! Today is your birthday!'
                    : `Your next birthday is in ${result.nextBirthdayDays} day${result.nextBirthdayDays !== 1 ? 's' : ''} (${fmt(result.nextBirthdayDate)})`}
                </div>
              </div>

              {/* Fun facts */}
              <div className="mt-4">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mb-3">Fun Facts</div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Total Days', value: result.totalDays.toLocaleString() },
                    { label: 'Total Hours', value: `~${result.totalHours.toLocaleString()}` },
                    { label: 'Total Weeks', value: result.totalWeeks.toLocaleString() },
                  ].map((fact) => (
                    <div key={fact.label} className="bg-ink-50 border-[2.5px] border-ink-900 rounded-2xl p-3 sm:p-4 text-center shadow-sticker-sm">
                      <div className="text-[9px] font-extrabold uppercase tracking-wider text-ink-600 mb-1">{fact.label}</div>
                      <div className="text-lg sm:text-xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif' }}>{fact.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · Results update as you type</div>
    </div>
  );
}
