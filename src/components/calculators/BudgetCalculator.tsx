import { useState, useMemo } from 'react';

export default function BudgetCalculator() {
  const [income, setIncome] = useState(50000);
  const [needsPct, setNeedsPct] = useState(50);
  const [wantsPct, setWantsPct] = useState(30);

  const savingsPct = Math.max(0, 100 - needsPct - wantsPct);
  const fmt = (n: number) => Math.round(n).toLocaleString('en-IN');

  const rows = useMemo(() => [
    { label: 'Needs', desc: 'Rent, food, utilities, EMIs, transport', pct: needsPct, amt: (income * needsPct) / 100, color: 'bg-cyan-accent' },
    { label: 'Wants', desc: 'Dining out, subscriptions, shopping, travel', pct: wantsPct, amt: (income * wantsPct) / 100, color: 'bg-yellow-accent' },
    { label: 'Savings & debt', desc: 'Investments, emergency fund, extra debt payoff', pct: savingsPct, amt: (income * savingsPct) / 100, color: 'bg-lime-accent' },
  ], [income, needsPct, wantsPct, savingsPct]);

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        <div className="bg-lime-accent border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center gap-3">
          <span className="text-2xl flex-shrink-0">📊</span>
          <h2 className="!text-lg sm:!text-xl !my-0 !text-ink-900 font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>50/30/20 Budget</h2>
        </div>

        <div className="p-5 sm:p-7 bg-ink-50">
          <div className="mb-5">
            <label htmlFor="bg-income" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Monthly take-home income</label>
            <input id="bg-income" type="number" min={0} value={income} onChange={(e) => setIncome(Number(e.target.value) || 0)}
              className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-lg font-extrabold focus:outline-none focus:ring-4 focus:ring-cyan-accent transition-all" inputMode="decimal" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="bg-needs" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Needs %</label>
              <input id="bg-needs" type="number" min={0} max={100} value={needsPct} onChange={(e) => setNeedsPct(Math.min(100, Number(e.target.value) || 0))}
                className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-cyan-accent transition-all" inputMode="numeric" />
            </div>
            <div>
              <label htmlFor="bg-wants" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Wants %</label>
              <input id="bg-wants" type="number" min={0} max={100} value={wantsPct} onChange={(e) => setWantsPct(Math.min(100, Number(e.target.value) || 0))}
                className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-yellow-accent transition-all" inputMode="numeric" />
            </div>
          </div>
          <p className="text-xs text-ink-500 mt-2 font-semibold">Savings & debt takes the rest: <strong className="text-ink-900">{savingsPct}%</strong>. The classic rule is 50 / 30 / 20.</p>
        </div>

        <div className="p-5 sm:p-7 bg-white border-t-[2.5px] border-ink-900 space-y-3">
          {rows.map((r) => (
            <div key={r.label} className={`${r.color} border-[2.5px] border-ink-900 rounded-2xl p-4 sm:p-5 shadow-sticker-sm flex items-center justify-between gap-4`}>
              <div className="min-w-0">
                <div className="text-base sm:text-lg font-extrabold text-ink-900">{r.label} <span className="text-sm font-bold">· {r.pct}%</span></div>
                <p className="text-xs text-ink-800 font-semibold !m-0 truncate">{r.desc}</p>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-ink-900 whitespace-nowrap" style={{ fontFamily: 'Inter Tight' }}>{fmt(r.amt)}</div>
            </div>
          ))}
          {needsPct + wantsPct > 100 && <p className="text-xs text-pink-600 font-bold">Needs + Wants exceed 100%. Reduce one so there's room to save.</p>}
        </div>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · Based on take-home (post-tax) pay. Amounts shown in your currency's units. Adjust the splits to fit your situation.</div>
    </div>
  );
}
