import { useState, useEffect, useMemo } from 'react';

const DAY = 86400000;
function isoInDays(days: number): string {
  return new Date(Date.now() + days * DAY).toISOString().slice(0, 10);
}

export default function CountdownCalculator() {
  const [target, setTarget] = useState<string>(isoInDays(30));
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const parts = useMemo(() => {
    if (!target) return null;
    const t = new Date(target + 'T00:00:00').getTime();
    if (isNaN(t)) return null;
    let diff = t - now;
    const past = diff < 0;
    diff = Math.abs(diff);
    const days = Math.floor(diff / DAY);
    const hours = Math.floor((diff % DAY) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    const totalDays = Math.ceil((t - now) / DAY);
    return { days, hours, mins, secs, past, totalDays };
  }, [target, now]);

  const quick = (label: string, iso: string) => (
    <button type="button" onClick={() => setTarget(iso)}
      className="px-3 py-2 rounded-xl border-2 border-ink-900 bg-white hover:bg-sky-200 text-ink-900 text-sm font-extrabold transition-colors">{label}</button>
  );

  // Compute a few common upcoming targets client-side.
  const d = new Date();
  const year = d.getFullYear();
  const nextNY = `${year + 1}-01-01`;
  const xmas = `${d.getMonth() === 11 && d.getDate() > 25 ? year + 1 : year}-12-25`;

  const Cell = ({ n, label }: { n: number; label: string }) => (
    <div className="bg-white/70 border-2 border-ink-900 rounded-xl p-2 sm:p-3 text-center">
      <div className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-none tabular-nums" style={{ fontFamily: 'Inter Tight' }}>{String(n).padStart(2, '0')}</div>
      <div className="text-[10px] font-bold text-ink-700 uppercase tracking-wider mt-1">{label}</div>
    </div>
  );

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        <div className="bg-sky-300 border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center gap-3">
          <span className="text-2xl flex-shrink-0">⏳</span>
          <h2 className="!text-lg sm:!text-xl !my-0 !text-ink-900 font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>Countdown & Days Until</h2>
        </div>

        <div className="p-5 sm:p-7 bg-ink-50">
          <label htmlFor="cd-target" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Target date</label>
          <input id="cd-target" type="date" value={target} onChange={(e) => setTarget(e.target.value)}
            className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-sky-300 transition-all" />
          <div className="flex flex-wrap gap-2 mt-3">
            {quick('New Year', nextNY)}
            {quick('Christmas', xmas)}
            {quick('In 100 days', isoInDays(100))}
            {quick('In 1 year', isoInDays(365))}
          </div>
        </div>

        <div className="p-5 sm:p-7 bg-white border-t-[2.5px] border-ink-900">
          {parts ? (
            <div className="bg-sky-300 border-[2.5px] border-ink-900 rounded-2xl p-5 sm:p-6 shadow-sticker-sm">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-3">
                {parts.past ? 'Time since target' : `${Math.abs(parts.totalDays)} days to go`}
              </div>
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                <Cell n={parts.days} label="Days" />
                <Cell n={parts.hours} label="Hours" />
                <Cell n={parts.mins} label="Minutes" />
                <Cell n={parts.secs} label="Seconds" />
              </div>
              {parts.past && <p className="text-sm text-ink-900 font-bold mt-3 !m-0">That date has already passed, showing time elapsed since.</p>}
            </div>
          ) : (
            <div className="text-ink-600 font-bold">Pick a target date to start the countdown.</div>
          )}
        </div>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · Ticks every second in your local time zone. Counts down to midnight of the target date.</div>
    </div>
  );
}
