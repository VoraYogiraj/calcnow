import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  DEFAULT_CURRENCY,
  detectClientCurrency,
  rescaleAmount,
  formatMoney,
  setStoredCurrency,
  type CurrencyOption,
} from '../../lib/currency';
import CurrencySelect from '../ui/CurrencySelect';

interface LineItem {
  id: string;
  label: string;
  value: number;
}

let _id = 0;
function uid() { return `item-${++_id}`; }

const DEFAULT_ASSETS: LineItem[] = [
  { id: uid(), label: 'Home Value', value: 350000 },
  { id: uid(), label: 'Car Value', value: 25000 },
  { id: uid(), label: 'Savings / Cash', value: 45000 },
  { id: uid(), label: 'Investments', value: 80000 },
  { id: uid(), label: 'Retirement Accounts', value: 60000 },
  { id: uid(), label: 'Other Assets', value: 0 },
];

const DEFAULT_LIABILITIES: LineItem[] = [
  { id: uid(), label: 'Mortgage Balance', value: 200000 },
  { id: uid(), label: 'Car Loan', value: 15000 },
  { id: uid(), label: 'Student Loans', value: 20000 },
  { id: uid(), label: 'Credit Cards', value: 5000 },
  { id: uid(), label: 'Other Debts', value: 0 },
];

function ItemRow({
  item,
  onLabelChange,
  onValueChange,
  onRemove,
  sym,
}: {
  item: LineItem;
  onLabelChange: (id: string, label: string) => void;
  onValueChange: (id: string, value: number) => void;
  onRemove: (id: string) => void;
  sym: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={item.label}
        onChange={(e) => onLabelChange(item.id, e.target.value)}
        className="flex-1 min-w-0 px-3 py-2 bg-white border-[2.5px] border-ink-900 rounded-xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-lime-accent transition-all"
        placeholder="Label"
        aria-label="Item label"
      />
      <div className="relative w-32 sm:w-40 flex-shrink-0">
        <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none ${sym.length > 1 ? 'text-[10px]' : 'text-sm'}`}>{sym}</span>
        <input
          type="number"
          min={0}
          step={1000}
          value={item.value || ''}
          onChange={(e) => onValueChange(item.id, Number(e.target.value) || 0)}
          className={`w-full ${sym.length > 1 ? 'pl-9' : 'pl-6'} pr-2 py-2 bg-white border-[2.5px] border-ink-900 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-cyan-accent transition-all tabular-nums`}
          inputMode="numeric"
          placeholder="0"
          aria-label="Item value"
        />
      </div>
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        className="flex-shrink-0 w-8 h-8 rounded-full bg-ink-100 hover:bg-pink-accent border-2 border-ink-900 flex items-center justify-center text-ink-700 hover:text-white font-extrabold text-sm transition-all"
        aria-label="Remove item"
      >
        ×
      </button>
    </div>
  );
}

export default function NetWorthCalculator() {
  const isLocked = false;
  const [currency, setCurrency] = useState<CurrencyOption>(DEFAULT_CURRENCY);
  useEffect(() => {
    const next = detectClientCurrency();
    setCurrency(next);
    // Example amounts are authored in USD; re-express them at the region's scale so
    // the defaults (and the hero "Quick answer" above) read natively.
    setAssets((prev) => prev.map((it) => ({ ...it, value: rescaleAmount(it.value, DEFAULT_CURRENCY, next) })));
    setLiabilities((prev) => prev.map((it) => ({ ...it, value: rescaleAmount(it.value, DEFAULT_CURRENCY, next) })));
  }, []);
  const handleCurrencyChange = (next: CurrencyOption) => {
    setAssets((prev) => prev.map((it) => ({ ...it, value: rescaleAmount(it.value, currency, next) })));
    setLiabilities((prev) => prev.map((it) => ({ ...it, value: rescaleAmount(it.value, currency, next) })));
    setCurrency(next);
    setStoredCurrency(next.code);
  };
  const fmt = (v: number) => formatMoney(v, currency);
  const sym = currency.symbol;

  const [assets, setAssets] = useState<LineItem[]>(DEFAULT_ASSETS);
  const [liabilities, setLiabilities] = useState<LineItem[]>(DEFAULT_LIABILITIES);

  const updateLabel = useCallback((list: LineItem[], setList: typeof setAssets, id: string, label: string) => {
    setList(list.map((item) => item.id === id ? { ...item, label } : item));
  }, []);

  const updateValue = useCallback((list: LineItem[], setList: typeof setAssets, id: string, value: number) => {
    setList(list.map((item) => item.id === id ? { ...item, value } : item));
  }, []);

  const removeItem = useCallback((list: LineItem[], setList: typeof setAssets, id: string) => {
    setList(list.filter((item) => item.id !== id));
  }, []);

  const addAsset = () => setAssets((prev) => [...prev, { id: uid(), label: 'New Asset', value: 0 }]);
  const addLiability = () => setLiabilities((prev) => [...prev, { id: uid(), label: 'New Debt', value: 0 }]);

  const { totalAssets, totalLiabilities, netWorth, debtRatio, assetPct, liabilityPct } = useMemo(() => {
    const totalAssets = assets.reduce((s, a) => s + a.value, 0);
    const totalLiabilities = liabilities.reduce((s, l) => s + l.value, 0);
    const netWorth = totalAssets - totalLiabilities;
    const debtRatio = totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0;
    const total = totalAssets + totalLiabilities;
    const assetPct = total > 0 ? Math.round((totalAssets / total) * 100) : 50;
    const liabilityPct = 100 - assetPct;
    return { totalAssets, totalLiabilities, netWorth, debtRatio, assetPct, liabilityPct };
  }, [assets, liabilities]);

  const isPositive = netWorth >= 0;

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">

        {/* Header */}
        <div className="bg-lime-accent border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-2xl flex-shrink-0">💰</span>
            <h2
              className="!text-lg sm:!text-xl !my-0 !text-ink-900 font-extrabold truncate"
              style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}
            >
              Net Worth Calculator
            </h2>
          </div>
          <CurrencySelect value={currency} onChange={handleCurrencyChange} locked={isLocked} />
        </div>

        {/* Inputs */}
        <div className="bg-ink-50 p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

          {/* Assets */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-ink-700 !m-0">
                Assets
              </h3>
              <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 border-2 border-emerald-300 rounded-full px-2.5 py-0.5">
                {fmt(totalAssets)}
              </span>
            </div>
            <div className="space-y-2">
              {assets.map((item) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  sym={sym}
                  onLabelChange={(id, label) => updateLabel(assets, setAssets, id, label)}
                  onValueChange={(id, value) => updateValue(assets, setAssets, id, value)}
                  onRemove={(id) => removeItem(assets, setAssets, id)}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={addAsset}
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full border-[2.5px] border-ink-900 bg-white hover:bg-lime-accent text-ink-900 text-xs font-extrabold uppercase tracking-wider transition-all shadow-sticker-sm hover:shadow-sticker hover:-translate-x-0.5 hover:-translate-y-0.5"
            >
              <span className="text-base leading-none">+</span> Add Asset
            </button>
          </div>

          {/* Liabilities */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-ink-700 !m-0">
                Liabilities
              </h3>
              <span className="text-xs font-extrabold text-red-700 bg-red-50 border-2 border-red-300 rounded-full px-2.5 py-0.5">
                {fmt(totalLiabilities)}
              </span>
            </div>
            <div className="space-y-2">
              {liabilities.map((item) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  sym={sym}
                  onLabelChange={(id, label) => updateLabel(liabilities, setLiabilities, id, label)}
                  onValueChange={(id, value) => updateValue(liabilities, setLiabilities, id, value)}
                  onRemove={(id) => removeItem(liabilities, setLiabilities, id)}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={addLiability}
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full border-[2.5px] border-ink-900 bg-white hover:bg-pink-accent text-ink-900 text-xs font-extrabold uppercase tracking-wider transition-all shadow-sticker-sm hover:shadow-sticker hover:-translate-x-0.5 hover:-translate-y-0.5"
            >
              <span className="text-base leading-none">+</span> Add Liability
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="p-5 sm:p-7 bg-white border-t-[2.5px] border-ink-900">

          {/* Net Worth hero */}
          <div className={`${isPositive ? 'bg-lime-accent' : 'bg-pink-accent'} border-[2.5px] border-ink-900 rounded-2xl p-6 shadow-sticker-sm mb-4`}>
            <div className={`text-[10px] font-extrabold uppercase tracking-wider mb-1 ${isPositive ? 'text-ink-900' : 'text-white'}`}>
              Net Worth
            </div>
            <div
              className={`text-4xl sm:text-5xl font-extrabold leading-none tabular-nums ${isPositive ? 'text-ink-900' : 'text-white'}`}
              style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}
            >
              {!isPositive && '-'}{fmt(Math.abs(netWorth))}
            </div>
            <div className={`text-xs mt-2 font-semibold ${isPositive ? 'text-ink-800' : 'text-white/90'}`}>
              {isPositive ? 'Assets exceed liabilities, positive net worth' : 'Liabilities exceed assets, negative net worth'}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Total Assets */}
            <div className="bg-lime-accent/30 border-[2.5px] border-ink-900 rounded-2xl p-4 shadow-sticker-sm">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Total Assets</div>
              <div className="text-xl font-extrabold text-ink-900 tabular-nums" style={{ fontFamily: 'Inter Tight, Inter, sans-serif' }}>
                {fmt(totalAssets)}
              </div>
            </div>

            {/* Total Liabilities */}
            <div className="bg-pink-accent/20 border-[2.5px] border-ink-900 rounded-2xl p-4 shadow-sticker-sm">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Total Liabilities</div>
              <div className="text-xl font-extrabold text-ink-900 tabular-nums" style={{ fontFamily: 'Inter Tight, Inter, sans-serif' }}>
                {fmt(totalLiabilities)}
              </div>
            </div>

            {/* Debt-to-Asset */}
            <div className="bg-yellow-accent border-[2.5px] border-ink-900 rounded-2xl p-4 shadow-sticker-sm">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Debt-to-Asset Ratio</div>
              <div className="text-xl font-extrabold text-ink-900" style={{ fontFamily: 'Inter Tight, Inter, sans-serif' }}>
                {debtRatio.toFixed(1)}%
              </div>
              <div className="text-[10px] text-ink-700 mt-1 font-semibold">
                {debtRatio < 30 ? '✓ Low: great shape' : debtRatio < 60 ? '⚠ Moderate: manageable' : '⚠ High: reduce debt'}
              </div>
            </div>
          </div>

          {/* Visual bar */}
          <div className="mt-5">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mb-2">
              Assets vs Liabilities
            </div>
            <div className="relative h-10 rounded-full border-[2.5px] border-ink-900 overflow-hidden bg-white">
              <div
                className="absolute inset-y-0 left-0 bg-lime-accent flex items-center justify-center transition-all duration-300"
                style={{ width: `${assetPct}%` }}
              >
                {assetPct >= 20 && (
                  <span className="text-[11px] sm:text-xs font-extrabold text-ink-900 whitespace-nowrap px-2">
                    {assetPct}% assets
                  </span>
                )}
              </div>
              <div
                className="absolute inset-y-0 right-0 bg-pink-accent flex items-center justify-center transition-all duration-300"
                style={{ width: `${liabilityPct}%` }}
              >
                {liabilityPct >= 20 && (
                  <span className="text-[11px] sm:text-xs font-extrabold text-white whitespace-nowrap px-2">
                    {liabilityPct}% debt
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-xs text-ink-500 mt-3 px-1">
        <span className="font-bold">✨ Live calculation</span>
        {' · '}Values are estimates. Consult a financial adviser for a comprehensive net worth assessment.
      </div>
    </div>
  );
}
