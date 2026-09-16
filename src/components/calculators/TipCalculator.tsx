import { useState, useMemo } from 'react';

const QUICK_TIPS = [10, 15, 18, 20, 25];

export default function TipCalculator() {
  const [bill, setBill] = useState<string>('85');
  const [tipPct, setTipPct] = useState<number>(18);
  const [customTip, setCustomTip] = useState<number>(18);
  const [useCustom, setUseCustom] = useState(false);
  const [people, setPeople] = useState<number>(4);

  const activeTip = useCustom ? customTip : tipPct;
  const billNum = parseFloat(bill) || 0;

  const result = useMemo(() => {
    const tipAmount = billNum * (activeTip / 100);
    const total = billNum + tipAmount;
    const perPerson = people > 0 ? total / people : total;
    const tipPerPerson = people > 0 ? tipAmount / people : tipAmount;
    return { tipAmount, total, perPerson, tipPerPerson };
  }, [billNum, activeTip, people]);

  const decreasePeople = () => setPeople((p) => Math.max(1, p - 1));
  const increasePeople = () => setPeople((p) => Math.min(20, p + 1));

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        {/* Header */}
        <div className="bg-lime-accent border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center gap-3">
          <span className="text-2xl">🍽️</span>
          <h2 className="!text-lg sm:!text-xl !my-0 !text-ink-900 font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>Tip Calculator</h2>
        </div>

        {/* Inputs */}
        <div className="p-5 sm:p-7 space-y-5 bg-ink-50">
          {/* Bill Amount */}
          <div>
            <label htmlFor="tip-bill" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Bill Amount</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-extrabold text-base pointer-events-none">$</span>
              <input
                id="tip-bill"
                type="number"
                min={0}
                step={0.01}
                value={bill}
                onChange={(e) => setBill(e.target.value)}
                inputMode="decimal"
                className="w-full pl-8 pr-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-lime-accent transition-all"
              />
            </div>
          </div>

          {/* Tip % */}
          <div>
            <div className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Tip Percentage</div>
            <div className="flex flex-wrap gap-2 mb-3">
              {QUICK_TIPS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => { setTipPct(t); setUseCustom(false); }}
                  className={`px-4 py-1.5 rounded-full border-2 border-ink-900 text-sm font-extrabold shadow-sticker-sm transition-all ${!useCustom && tipPct === t ? 'bg-ink-900 text-white shadow-none translate-x-0.5 translate-y-0.5' : 'bg-white text-ink-900 hover:bg-ink-50'}`}
                >
                  {t}%
                </button>
              ))}
              <button
                type="button"
                onClick={() => setUseCustom(true)}
                className={`px-4 py-1.5 rounded-full border-2 border-ink-900 text-sm font-extrabold shadow-sticker-sm transition-all ${useCustom ? 'bg-ink-900 text-white shadow-none translate-x-0.5 translate-y-0.5' : 'bg-white text-ink-900 hover:bg-ink-50'}`}
              >
                Custom
              </button>
            </div>
            {useCustom && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-ink-600">Custom tip</span>
                  <span className="text-sm font-extrabold text-ink-900">{customTip}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={30}
                  step={1}
                  value={customTip}
                  onChange={(e) => setCustomTip(Number(e.target.value))}
                  className="w-full accent-lime-accent"
                  aria-label="Custom tip percentage"
                />
                <div className="flex justify-between text-[10px] font-bold text-ink-400 mt-0.5">
                  <span>0%</span><span>15%</span><span>30%</span>
                </div>
              </div>
            )}
          </div>

          {/* Split */}
          <div>
            <div className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Split Between</div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={decreasePeople}
                className="w-10 h-10 rounded-full border-2 border-ink-900 bg-white text-ink-900 font-extrabold text-xl shadow-sticker-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center justify-center"
                aria-label="Decrease people"
              >−</button>
              <div className="flex-1 text-center">
                <span className="text-3xl font-extrabold text-ink-900" style={{ fontFamily: 'Inter Tight, Inter, sans-serif' }}>{people}</span>
                <span className="text-sm font-bold text-ink-500 ml-1">{people === 1 ? 'person' : 'people'}</span>
              </div>
              <button
                type="button"
                onClick={increasePeople}
                className="w-10 h-10 rounded-full border-2 border-ink-900 bg-white text-ink-900 font-extrabold text-xl shadow-sticker-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center justify-center"
                aria-label="Increase people"
              >+</button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="p-5 sm:p-7 bg-white border-t-[2.5px] border-ink-900">
          {/* Per person — hero */}
          <div className="bg-pink-accent border-[2.5px] border-ink-900 rounded-2xl p-5 sm:p-6 shadow-sticker-sm mb-4 text-center">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-white mb-1">Per Person</div>
            <div className="text-4xl sm:text-5xl font-extrabold text-white leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>
              ${result.perPerson.toFixed(2)}
            </div>
            <div className="text-sm font-bold text-white/80 mt-1">incl. ${result.tipPerPerson.toFixed(2)} tip each</div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Tip Amount', value: `$${result.tipAmount.toFixed(2)}`, bg: 'bg-lime-accent', text: 'text-ink-900' },
              { label: 'Total Bill', value: `$${result.total.toFixed(2)}`, bg: 'bg-cyan-accent', text: 'text-ink-900' },
              { label: 'Tip / Person', value: `$${result.tipPerPerson.toFixed(2)}`, bg: 'bg-yellow-accent', text: 'text-ink-900' },
            ].map((card) => (
              <div key={card.label} className={`${card.bg} border-[2.5px] border-ink-900 rounded-2xl p-4 shadow-sticker-sm text-center`}>
                <div className={`text-[10px] font-extrabold uppercase tracking-wider ${card.text} mb-1`}>{card.label}</div>
                <div className={`text-xl sm:text-2xl font-extrabold leading-none ${card.text}`} style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.03em' }}>{card.value}</div>
              </div>
            ))}
          </div>

          <div className="mt-3 text-center text-xs font-bold text-ink-500">
            Bill ${billNum.toFixed(2)} · {activeTip}% tip · ÷ {people} {people === 1 ? 'person' : 'people'}
          </div>
        </div>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · Results update instantly</div>
    </div>
  );
}
