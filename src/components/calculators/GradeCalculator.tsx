import { useState, useMemo } from 'react';

interface Item { id: number; name: string; score: number; weight: number; }
let nextId = 5;

function letter(pct: number): string {
  if (pct >= 93) return 'A';
  if (pct >= 90) return 'A-';
  if (pct >= 87) return 'B+';
  if (pct >= 83) return 'B';
  if (pct >= 80) return 'B-';
  if (pct >= 77) return 'C+';
  if (pct >= 73) return 'C';
  if (pct >= 70) return 'C-';
  if (pct >= 67) return 'D+';
  if (pct >= 60) return 'D';
  return 'F';
}

export default function GradeCalculator() {
  const [mode, setMode] = useState<'weighted' | 'final'>('weighted');

  // Weighted mode
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: 'Homework', score: 92, weight: 20 },
    { id: 2, name: 'Midterm', score: 78, weight: 30 },
    { id: 3, name: 'Project', score: 88, weight: 20 },
  ]);
  const weighted = useMemo(() => {
    let w = 0, s = 0;
    for (const it of items) { const ww = Number(it.weight) || 0; w += ww; s += ((Number(it.score) || 0) * ww) / 100; }
    const pct = w > 0 ? (s / w) * 100 : 0;
    return { pct, totalWeight: w };
  }, [items]);
  const update = (id: number, patch: Partial<Item>) => setItems((xs) => xs.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  const addRow = () => setItems((xs) => [...xs, { id: nextId++, name: 'Assignment', score: 80, weight: 10 }]);
  const removeRow = (id: number) => setItems((xs) => (xs.length > 1 ? xs.filter((x) => x.id !== id) : xs));

  // Final-needed mode
  const [current, setCurrent] = useState(82);
  const [desired, setDesired] = useState(90);
  const [finalWeight, setFinalWeight] = useState(30);
  const needed = useMemo(() => {
    const fw = finalWeight / 100;
    if (fw <= 0) return null;
    return (desired - current * (1 - fw)) / fw;
  }, [current, desired, finalWeight]);

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        <div className="bg-cyan-accent border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center gap-3">
          <span className="text-2xl flex-shrink-0">📝</span>
          <h2 className="!text-lg sm:!text-xl !my-0 !text-ink-900 font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>Grade Calculator</h2>
        </div>

        <div className="p-5 sm:p-7 bg-ink-50">
          <div className="grid grid-cols-2 gap-2 mb-5">
            {([['weighted', 'Weighted grade'], ['final', 'Grade needed on final']] as const).map(([m, label]) => (
              <button key={m} type="button" onClick={() => setMode(m)}
                className={`py-2.5 px-2 rounded-xl border-2 border-ink-900 text-sm font-extrabold transition-all ${mode === m ? 'bg-ink-900 text-white shadow-sticker-sm -translate-y-0.5' : 'bg-white text-ink-700 hover:bg-cyan-accent'}`}>
                {label}
              </button>
            ))}
          </div>

          {mode === 'weighted' ? (
            <>
              <div className="hidden sm:grid grid-cols-[1fr_90px_90px_40px] gap-3 mb-2 px-1">
                <span className="text-xs font-extrabold uppercase tracking-wider text-ink-500">Category</span>
                <span className="text-xs font-extrabold uppercase tracking-wider text-ink-500">Score %</span>
                <span className="text-xs font-extrabold uppercase tracking-wider text-ink-500">Weight %</span>
                <span></span>
              </div>
              <div className="space-y-2">
                {items.map((it) => (
                  <div key={it.id} className="grid grid-cols-[1fr_70px_70px_36px] sm:grid-cols-[1fr_90px_90px_40px] gap-2 sm:gap-3 items-center">
                    <input type="text" value={it.name} onChange={(e) => update(it.id, { name: e.target.value })}
                      className="w-full px-3 py-2.5 bg-white border-2 border-ink-900 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-cyan-accent transition-all" aria-label="Category name" />
                    <input type="number" min={0} max={150} value={it.score} onChange={(e) => update(it.id, { score: Number(e.target.value) || 0 })}
                      className="w-full px-2 py-2.5 bg-white border-2 border-ink-900 rounded-xl text-sm font-bold text-center focus:outline-none focus:ring-4 focus:ring-lime-accent transition-all" inputMode="decimal" aria-label="Score percent" />
                    <input type="number" min={0} max={100} value={it.weight} onChange={(e) => update(it.id, { weight: Number(e.target.value) || 0 })}
                      className="w-full px-2 py-2.5 bg-white border-2 border-ink-900 rounded-xl text-sm font-bold text-center focus:outline-none focus:ring-4 focus:ring-yellow-accent transition-all" inputMode="decimal" aria-label="Weight percent" />
                    <button type="button" onClick={() => removeRow(it.id)} className="w-9 h-9 flex items-center justify-center rounded-xl border-2 border-ink-900 bg-white hover:bg-pink-accent text-ink-900 font-extrabold transition-colors" aria-label="Remove">×</button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addRow} className="mt-4 px-4 py-2.5 rounded-xl border-2 border-ink-900 bg-white hover:bg-lime-accent text-ink-900 text-sm font-extrabold transition-colors shadow-sticker-sm">+ Add category</button>
            </>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="gc-current" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Current grade %</label>
                <input id="gc-current" type="number" min={0} max={100} value={current} onChange={(e) => setCurrent(Number(e.target.value) || 0)}
                  className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-cyan-accent transition-all" inputMode="decimal" />
              </div>
              <div>
                <label htmlFor="gc-desired" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Desired grade %</label>
                <input id="gc-desired" type="number" min={0} max={100} value={desired} onChange={(e) => setDesired(Number(e.target.value) || 0)}
                  className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-lime-accent transition-all" inputMode="decimal" />
              </div>
              <div>
                <label htmlFor="gc-fw" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Final worth %</label>
                <input id="gc-fw" type="number" min={1} max={100} value={finalWeight} onChange={(e) => setFinalWeight(Number(e.target.value) || 0)}
                  className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-yellow-accent transition-all" inputMode="decimal" />
              </div>
            </div>
          )}
        </div>

        {/* Result */}
        <div className="p-5 sm:p-7 bg-white border-t-[2.5px] border-ink-900">
          {mode === 'weighted' ? (
            <div className="bg-cyan-accent border-[2.5px] border-ink-900 rounded-2xl p-5 sm:p-6 shadow-sticker-sm grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Overall grade</div>
                <div className="text-5xl sm:text-6xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight', letterSpacing: '-0.04em' }}>{weighted.pct.toFixed(1)}%</div>
              </div>
              <div className="sm:col-span-2">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Letter · weight entered</div>
                <p className="text-2xl font-extrabold text-ink-900 !m-0">{letter(weighted.pct)} <span className="text-sm font-bold">· {weighted.totalWeight}% of grade</span></p>
                {weighted.totalWeight !== 100 && <p className="text-xs text-ink-800 mt-1 font-semibold">Tip: weights currently total {weighted.totalWeight}%. The result is normalized to what you've entered.</p>}
              </div>
            </div>
          ) : (
            <div className="bg-cyan-accent border-[2.5px] border-ink-900 rounded-2xl p-5 sm:p-6 shadow-sticker-sm">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">You need on the final</div>
              <div className="text-5xl sm:text-6xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight', letterSpacing: '-0.04em' }}>{needed === null ? '—' : `${needed.toFixed(1)}%`}</div>
              {needed !== null && (
                <p className="text-sm text-ink-900 font-bold mt-3 !m-0">
                  {needed > 100 ? 'Even 100% on the final won\'t reach your target. Aim for the highest you can, or adjust the goal.'
                    : needed <= 0 ? 'You\'ve already secured your target. Anything on the final keeps you there.'
                    : `Score ${needed.toFixed(1)}% on a final worth ${finalWeight}% to finish with ${desired}%.`}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · Letter bands use a common US scale (A ≥ 93, B ≥ 83…). Your syllabus's cut-offs may differ.</div>
    </div>
  );
}
