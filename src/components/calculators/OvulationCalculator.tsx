import { useState, useMemo } from 'react';

const DAY = 86400000;
const fmt = (d: Date) => d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
const add = (d: Date, days: number) => new Date(d.getTime() + days * DAY);

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function OvulationCalculator() {
  const [lmp, setLmp] = useState<string>(todayIso());
  const [cycle, setCycle] = useState<number>(28);

  const result = useMemo(() => {
    if (!lmp) return null;
    const lmpDate = new Date(lmp + 'T00:00:00');
    if (isNaN(lmpDate.getTime())) return null;
    const c = Math.max(20, Math.min(45, cycle));
    // Luteal phase ~14 days: ovulation = next period − 14
    const cycles = [0, 1, 2].map((i) => {
      const start = add(lmpDate, i * c);
      const ovulation = add(start, c - 14);
      return {
        periodStart: start,
        ovulation,
        fertileStart: add(ovulation, -5),
        fertileEnd: add(ovulation, 1),
        nextPeriod: add(start, c),
      };
    });
    return cycles;
  }, [lmp, cycle]);

  const first = result?.[0];

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        <div className="bg-pink-accent border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center gap-3">
          <span className="text-2xl flex-shrink-0">🌸</span>
          <h2 className="!text-lg sm:!text-xl !my-0 !text-white font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>Ovulation & Fertile Window</h2>
        </div>

        <div className="p-5 sm:p-7 bg-ink-50 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="ov-lmp" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">First day of last period</label>
            <input id="ov-lmp" type="date" value={lmp} onChange={(e) => setLmp(e.target.value)}
              className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-pink-accent transition-all" />
          </div>
          <div>
            <label htmlFor="ov-cycle" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Average cycle length (days)</label>
            <input id="ov-cycle" type="number" min={20} max={45} value={cycle} onChange={(e) => setCycle(Number(e.target.value) || 28)}
              className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-cyan-accent transition-all" inputMode="numeric" />
          </div>
        </div>

        <div className="p-5 sm:p-7 bg-white border-t-[2.5px] border-ink-900">
          {first ? (
            <>
              <div className="bg-pink-accent border-[2.5px] border-ink-900 rounded-2xl p-5 sm:p-6 shadow-sticker-sm">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-white mb-1">Most fertile, likely ovulation</div>
                <div className="text-3xl sm:text-4xl font-extrabold text-white leading-tight" style={{ fontFamily: 'Inter Tight', letterSpacing: '-0.03em' }}>{fmt(first.ovulation)}</div>
                <p className="text-sm text-white font-bold mt-3 !m-0">Fertile window: <strong>{fmt(first.fertileStart)} → {fmt(first.fertileEnd)}</strong> (about 6 days).</p>
              </div>
              <div className="mt-5 overflow-x-auto">
                <table className="w-full border-[2.5px] border-ink-900 rounded-2xl overflow-hidden border-separate border-spacing-0 text-sm">
                  <thead><tr className="bg-ink-900 text-white">
                    <th className="text-left p-3 font-extrabold">Cycle</th>
                    <th className="text-left p-3 font-extrabold">Fertile window</th>
                    <th className="text-right p-3 font-extrabold">Ovulation</th>
                  </tr></thead>
                  <tbody>
                    {result!.map((cyc, i) => (
                      <tr key={i} className={`border-b-2 border-ink-100 ${i % 2 ? 'bg-ink-50' : 'bg-white'}`}>
                        <td className="p-3 font-bold text-ink-900">{i === 0 ? 'This cycle' : `+${i} cycle${i > 1 ? 's' : ''}`}</td>
                        <td className="p-3 font-semibold text-ink-700">{fmt(cyc.fertileStart)} – {fmt(cyc.fertileEnd)}</td>
                        <td className="p-3 text-right font-bold text-ink-900">{fmt(cyc.ovulation)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="text-ink-600 font-bold">Enter the first day of your last period to see your fertile window.</div>
          )}
        </div>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · Calendar estimate (ovulation ≈ next period − 14 days). Not a contraceptive method. Cycles vary. Ovulation kits or tracking are more precise.</div>
    </div>
  );
}
