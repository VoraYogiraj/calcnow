import { useState, useMemo } from 'react';

const DAY = 86400000;
const fmtDate = (d: Date) => d.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });

function isoDaysAgo(days: number): string {
  const d = new Date(Date.now() - days * DAY);
  return d.toISOString().slice(0, 10);
}

export default function PregnancyCalculator() {
  // Default LMP to 8 weeks ago so the page shows a meaningful example on load.
  const [lmp, setLmp] = useState<string>(isoDaysAgo(56));
  const [cycle, setCycle] = useState<number>(28);

  const result = useMemo(() => {
    if (!lmp) return null;
    const lmpDate = new Date(lmp + 'T00:00:00');
    if (isNaN(lmpDate.getTime())) return null;
    const adjust = cycle - 28; // longer cycles push ovulation & due date later
    const edd = new Date(lmpDate.getTime() + (280 + adjust) * DAY);
    const conception = new Date(lmpDate.getTime() + (14 + adjust) * DAY);
    const today = new Date();
    const gestDays = Math.floor((today.getTime() - lmpDate.getTime()) / DAY);
    const weeks = Math.floor(gestDays / 7);
    const days = gestDays - weeks * 7;
    const daysToGo = Math.ceil((edd.getTime() - today.getTime()) / DAY);
    const trimester = weeks < 0 ? '—' : weeks < 14 ? 'First trimester' : weeks < 28 ? 'Second trimester' : weeks <= 42 ? 'Third trimester' : 'Past due date';
    const pct = Math.max(0, Math.min(100, (gestDays / 280) * 100));
    return { edd, conception, weeks, days, daysToGo, trimester, pct, valid: gestDays >= 0 && gestDays <= 320 };
  }, [lmp, cycle]);

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        <div className="bg-rose-300 border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center gap-3">
          <span className="text-2xl flex-shrink-0">🤰</span>
          <h2 className="!text-lg sm:!text-xl !my-0 !text-ink-900 font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>Pregnancy Due Date</h2>
        </div>

        <div className="p-5 sm:p-7 bg-ink-50 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="pg-lmp" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">First day of last period (LMP)</label>
            <input id="pg-lmp" type="date" value={lmp} onChange={(e) => setLmp(e.target.value)}
              className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-rose-300 transition-all" />
          </div>
          <div>
            <label htmlFor="pg-cycle" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Average cycle length (days)</label>
            <input id="pg-cycle" type="number" min={20} max={45} value={cycle} onChange={(e) => setCycle(Number(e.target.value) || 28)}
              className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-cyan-accent transition-all" inputMode="numeric" />
          </div>
        </div>

        <div className="p-5 sm:p-7 bg-white border-t-[2.5px] border-ink-900">
          {result ? (
            <>
              <div className="bg-rose-300 border-[2.5px] border-ink-900 rounded-2xl p-5 sm:p-6 shadow-sticker-sm">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Estimated due date</div>
                <div className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-tight" style={{ fontFamily: 'Inter Tight', letterSpacing: '-0.03em' }}>{fmtDate(result.edd)}</div>
                {result.valid && (
                  <p className="text-sm text-ink-900 font-bold mt-3 !m-0">
                    You're about <strong>{result.weeks} weeks {result.days} days</strong> along · {result.trimester} · {result.daysToGo > 0 ? `${result.daysToGo} days to go` : 'due date reached'}
                  </p>
                )}
              </div>
              {result.valid && (
                <div className="mt-5">
                  <div className="flex justify-between text-[10px] font-extrabold uppercase tracking-wider text-ink-500 mb-2">
                    <span>LMP</span><span>40 weeks</span>
                  </div>
                  <div className="h-4 rounded-full border-2 border-ink-900 bg-white overflow-hidden">
                    <div className="h-full bg-rose-300" style={{ width: `${result.pct}%` }}></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-5 text-sm">
                    <div className="bg-ink-50 border-2 border-ink-200 rounded-xl p-3"><span className="text-ink-500 font-bold text-xs block">Estimated conception</span><strong className="text-ink-900">{fmtDate(result.conception)}</strong></div>
                    <div className="bg-ink-50 border-2 border-ink-200 rounded-xl p-3"><span className="text-ink-500 font-bold text-xs block">Progress</span><strong className="text-ink-900">{result.pct.toFixed(0)}% of 40 weeks</strong></div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-ink-600 font-bold">Enter the first day of your last period to see your due date.</div>
          )}
        </div>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · Estimate only (Naegele's rule, LMP + 280 days). An ultrasound dating scan is more accurate. Always follow your doctor or midwife.</div>
    </div>
  );
}
