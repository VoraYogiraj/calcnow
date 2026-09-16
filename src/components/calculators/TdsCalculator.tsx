import { useState, useMemo } from 'react';

// Hard-coded ₹ formatter (INR only, no LocalizeMoney). en-IN grouping.
function fmtINR(n: number): string {
  const v = Number.isFinite(n) ? Math.max(0, n) : 0;
  const rounded = Math.round(v * 100) / 100;
  return '₹' + rounded.toLocaleString('en-IN', { maximumFractionDigits: 2 });
}

// Compact ₹ (lakh / crore) for large thresholds like ₹50 lakh.
function fmtINRShort(n: number): string {
  const v = Number.isFinite(n) ? Math.max(0, n) : 0;
  if (v >= 10000000) return `₹${(v / 10000000).toFixed(v % 10000000 === 0 ? 0 : 2)} Cr`;
  if (v >= 100000) return `₹${(v / 100000).toFixed(v % 100000 === 0 ? 0 : 2)} L`;
  return '₹' + v.toLocaleString('en-IN');
}

interface SubTypeOption {
  value: string;
  label: string;
  rate: number;
}

interface TdsSection {
  key: string;
  section: string;
  label: string;
  rate: number; // default / base rate
  threshold: number;
  note: string;
  excessOnly?: boolean; // 194Q: TDS on the amount over the threshold, not the whole payment
  salary?: boolean; // 192: slab-rate guidance, not a flat %
  subType?: { label: string; options: SubTypeOption[] };
}

// FY 2025-26 / AY 2026-27, resident payees. Verify against the latest Finance Act / CBDT circulars.
const SECTIONS: TdsSection[] = [
  {
    key: '192',
    section: '192',
    label: 'Salary',
    rate: 0,
    threshold: 0,
    note: 'TDS on salary is deducted at the employee’s average income-tax slab rate for the year, not a flat percentage. Use the income tax or salary calculator instead of computing a flat rate here.',
    salary: true,
  },
  {
    key: '194A',
    section: '194A',
    label: 'Interest other than on securities (bank / post-office deposits)',
    rate: 10,
    threshold: 50000,
    note: 'Default threshold shown is ₹50,000 for interest from banks, post offices and co-operative banks (FY 2025-26). For senior citizens the bank-interest threshold is ₹1,00,000. For interest from non-bank payers (company deposits, individuals) the threshold is only ₹5,000.',
  },
  {
    key: '194C',
    section: '194C',
    label: 'Payment to contractor / sub-contractor',
    rate: 1,
    threshold: 30000,
    note: 'TDS applies once a single payment exceeds ₹30,000 or the aggregate to that contractor exceeds ₹1,00,000 in the financial year. The rate depends on the payee type.',
    subType: {
      label: 'Payee type',
      options: [
        { value: 'individual', label: 'Individual / HUF', rate: 1 },
        { value: 'company', label: 'Company / firm', rate: 2 },
      ],
    },
  },
  {
    key: '194H',
    section: '194H',
    label: 'Commission or brokerage',
    rate: 2,
    threshold: 20000,
    note: 'Rate reduced from 5% to 2% with effect from 1 October 2024. Threshold ₹20,000 in the financial year.',
  },
  {
    key: '194I',
    section: '194I',
    label: 'Rent',
    rate: 10,
    threshold: 600000,
    note: 'Annual threshold raised to ₹6,00,000 in Budget 2025 (was ₹2,40,000). The rate depends on what is being rented.',
    subType: {
      label: 'What is rented',
      options: [
        { value: 'building', label: 'Land / building / furniture', rate: 10 },
        { value: 'plant', label: 'Plant / machinery / equipment', rate: 2 },
      ],
    },
  },
  {
    key: '194J',
    section: '194J',
    label: 'Professional or technical services',
    rate: 10,
    threshold: 50000,
    note: 'Threshold raised to ₹50,000 in Budget 2025 (was ₹30,000). Professional fees are deducted at 10%; technical services and call-centre payments at 2%.',
    subType: {
      label: 'Service type',
      options: [
        { value: 'professional', label: 'Professional fees', rate: 10 },
        { value: 'technical', label: 'Technical service / call centre', rate: 2 },
      ],
    },
  },
  {
    key: '194O',
    section: '194O',
    label: 'E-commerce operator payment to seller',
    rate: 0.1,
    threshold: 500000,
    note: 'Applies to the gross amount paid to a resident individual / HUF seller once gross sales through the platform exceed ₹5,00,000 in the year. Rate cut from 1% to 0.1% with effect from 1 October 2024.',
  },
  {
    key: '194Q',
    section: '194Q',
    label: 'Purchase of goods',
    rate: 0.1,
    threshold: 5000000,
    note: 'A buyer with turnover above ₹10 crore deducts 0.1% TDS, but only on the value of purchases from a single seller that EXCEEDS ₹50,00,000 in the financial year, not on the whole amount.',
    excessOnly: true,
  },
];

export default function TdsCalculator() {
  const [sectionKey, setSectionKey] = useState<string>('194J');
  const [amount, setAmount] = useState<number>(100000);
  const [hasPan, setHasPan] = useState<boolean>(true);
  const [subValues, setSubValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const s of SECTIONS) if (s.subType) init[s.key] = s.subType.options[0].value;
    return init;
  });

  const section = SECTIONS.find((s) => s.key === sectionKey) || SECTIONS[0];

  const result = useMemo(() => {
    const rawAmount = Number.isFinite(amount) ? Math.max(0, amount) : 0;

    let baseRate = section.rate;
    let subLabel = '';
    if (section.subType) {
      const chosen =
        section.subType.options.find((o) => o.value === subValues[section.key]) ||
        section.subType.options[0];
      baseRate = chosen.rate;
      subLabel = chosen.label;
    }

    const noPan = !hasPan;
    // Section 206AA: no PAN => deduct at the higher of the section rate or 20% (not for salary).
    const panBumped = noPan && !section.salary && 20 > baseRate;
    const effectiveRate = noPan && !section.salary ? Math.max(baseRate, 20) : baseRate;

    const crossed = rawAmount > section.threshold;
    const taxableBase = section.excessOnly ? Math.max(0, rawAmount - section.threshold) : rawAmount;
    const tds = section.salary ? 0 : crossed ? (effectiveRate / 100) * taxableBase : 0;
    const net = Math.max(0, rawAmount - tds);

    return { rawAmount, baseRate, effectiveRate, panBumped, crossed, taxableBase, tds, net, subLabel };
  }, [amount, section, subValues, hasPan]);

  const sliderMax = Math.max(200000, Math.round(section.threshold * 2.5) || 200000);
  const sliderStep = sliderMax > 2000000 ? 50000 : sliderMax > 500000 ? 5000 : 1000;

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        {/* Header bar */}
        <div className="bg-cyan-accent border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🧾</span>
            <h2 className="!text-lg sm:!text-xl !my-0 !text-ink-900 font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>TDS Calculator</h2>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink-900">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ink-900 opacity-50"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-ink-900"></span>
            </span>
            Live
          </span>
        </div>

        {/* Section picker */}
        <div className="px-5 sm:px-7 py-4 bg-ink-50 border-b-2 border-ink-100">
          <label htmlFor="tds-section" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Payment type (TDS section)</label>
          <div className="relative">
            <select id="tds-section" value={sectionKey} onChange={(e) => setSectionKey(e.target.value)}
              className="w-full pl-3.5 pr-8 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-cyan-accent appearance-none transition-all">
              {SECTIONS.map((s) => (
                <option key={s.key} value={s.key}>{s.section} - {s.label}</option>
              ))}
            </select>
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-500 pointer-events-none">▾</span>
          </div>
          <div className="text-[10px] text-ink-500 mt-1.5 font-bold">{section.note}</div>
        </div>

        {/* Sub-type toggle (194C payee / 194I rent / 194J service) */}
        {section.subType && (
          <div className="px-5 sm:px-7 py-4 bg-ink-50 border-b-2 border-ink-100">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">{section.subType.label}</label>
            <div className="grid grid-cols-2 gap-2">
              {section.subType.options.map((opt) => {
                const active = (subValues[section.key] || section.subType!.options[0].value) === opt.value;
                return (
                  <button key={opt.value} type="button"
                    onClick={() => setSubValues((prev) => ({ ...prev, [section.key]: opt.value }))}
                    className={`py-3 px-3 rounded-xl border-[2.5px] border-ink-900 text-sm font-extrabold transition-all ${active ? 'bg-ink-900 text-white shadow-sticker-sm -translate-y-0.5' : 'bg-white text-ink-700 hover:bg-cyan-accent/40'}`}>
                    {opt.label}
                    <div className="text-[10px] font-normal opacity-80 mt-0.5">{opt.rate}% rate</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Inputs: amount + PAN */}
        <div className="p-5 sm:p-7 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 bg-ink-50">
          <div>
            <label htmlFor="tds-amount" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Payment amount</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">₹</span>
              <input id="tds-amount" type="number" min={0} step={1000} value={amount} onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))}
                className="w-full pl-7 pr-3 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-cyan-accent transition-all"
                inputMode="numeric" />
            </div>
            <input type="range" min={0} max={sliderMax} step={sliderStep} value={Math.min(amount, sliderMax)} onChange={(e) => setAmount(Number(e.target.value))} className="w-full mt-2 accent-cyan-accent" aria-label="Payment amount slider" />
            <div className="text-[10px] text-ink-500 mt-1.5 font-bold">Section threshold: {fmtINRShort(section.threshold)}{section.salary ? ' (n/a for salary)' : ' / year'}</div>
          </div>
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Does the payee have a PAN?</label>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setHasPan(true)}
                className={`py-3 px-3 rounded-xl border-[2.5px] border-ink-900 text-sm font-extrabold transition-all ${hasPan ? 'bg-ink-900 text-white shadow-sticker-sm -translate-y-0.5' : 'bg-white text-ink-700 hover:bg-lime-accent/40'}`}>
                Yes, PAN available
                <div className="text-[10px] font-normal opacity-80 mt-0.5">normal section rate</div>
              </button>
              <button type="button" onClick={() => setHasPan(false)}
                className={`py-3 px-3 rounded-xl border-[2.5px] border-ink-900 text-sm font-extrabold transition-all ${!hasPan ? 'bg-ink-900 text-white shadow-sticker-sm -translate-y-0.5' : 'bg-white text-ink-700 hover:bg-pink-accent/30'}`}>
                No PAN
                <div className="text-[10px] font-normal opacity-80 mt-0.5">Section 206AA: min 20%</div>
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {section.salary ? (
          <div className="p-5 sm:p-7 bg-white border-t-[2.5px] border-ink-900">
            <div className="bg-yellow-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
              <div className="text-xs font-extrabold uppercase tracking-wider text-ink-900 mb-1">Section 192: salary</div>
              <p className="text-ink-900 font-semibold leading-relaxed !m-0">
                TDS on salary is <strong>not a flat percentage</strong>. Your employer deducts it at your <strong>average income-tax slab rate</strong> for the year, after your exemptions and deductions. To estimate it, use the{' '}
                <a href="/finance/income-tax-india/" className="underline font-bold text-ink-900">income tax calculator</a> or the{' '}
                <a href="/finance/salary-calculator/" className="underline font-bold text-ink-900">salary calculator</a> instead.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="p-5 sm:p-7 bg-white grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 border-t-[2.5px] border-ink-900">
              <div className="bg-yellow-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Applicable rate</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{result.effectiveRate}%</div>
                <div className="text-xs text-ink-800 mt-2 font-semibold">{result.panBumped ? 'no PAN: 206AA 20%' : `Section ${section.section}`}</div>
              </div>
              <div className="bg-pink-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-white mb-1">TDS to deduct</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmtINR(result.tds)}</div>
                <div className="text-xs text-white/90 mt-2 font-semibold">{result.crossed ? 'threshold crossed' : 'below threshold: ₹0'}</div>
              </div>
              <div className="bg-lime-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Net payable to payee</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.04em' }}>{fmtINR(result.net)}</div>
                <div className="text-xs text-ink-800 mt-2 font-semibold">payment minus TDS</div>
              </div>
            </div>

            {/* Threshold status strip */}
            <div className="px-5 sm:px-7 pb-2 bg-white">
              <div className={`rounded-2xl border-2 border-ink-900 p-4 text-sm font-bold ${result.crossed ? 'bg-lime-accent/40 text-ink-900' : 'bg-ink-50 text-ink-700'}`}>
                {result.crossed ? (
                  <>Payment of {fmtINR(result.rawAmount)} is <strong>above</strong> the {fmtINRShort(section.threshold)} threshold, so TDS is deducted{section.excessOnly ? ` on the ${fmtINR(result.taxableBase)} that exceeds ${fmtINRShort(section.threshold)}.` : '.'}</>
                ) : (
                  <>Payment of {fmtINR(result.rawAmount)} is <strong>at or below</strong> the {fmtINRShort(section.threshold)} threshold, so no TDS is deducted (₹0).</>
                )}
              </div>
            </div>

            {/* Step-by-step rule applied */}
            <div className="px-5 sm:px-7 pb-5 sm:pb-7 bg-white">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mb-3 mt-3">Rule applied, step by step</div>
              <ol className="space-y-2">
                <li className="flex gap-3 items-start bg-ink-50 border-2 border-ink-900 rounded-xl p-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-ink-900 text-white text-xs font-extrabold flex items-center justify-center">1</span>
                  <span className="text-sm font-semibold text-ink-800">Section <strong>{section.section}</strong>{result.subLabel ? ` · ${result.subLabel}` : ` · ${section.label}`}. Base rate <strong>{result.baseRate}%</strong>.</span>
                </li>
                <li className="flex gap-3 items-start bg-ink-50 border-2 border-ink-900 rounded-xl p-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-ink-900 text-white text-xs font-extrabold flex items-center justify-center">2</span>
                  <span className="text-sm font-semibold text-ink-800">{result.panBumped
                    ? <>No PAN: <strong>Section 206AA</strong> applies, deduct at the higher of {result.baseRate}% or 20% = <strong>20%</strong>.</>
                    : hasPan
                      ? <>PAN available, so the normal section rate of <strong>{result.effectiveRate}%</strong> applies.</>
                      : <>No PAN, but the section rate ({result.baseRate}%) already meets or beats the 206AA floor of 20%, so <strong>{result.effectiveRate}%</strong> applies.</>}</span>
                </li>
                <li className="flex gap-3 items-start bg-ink-50 border-2 border-ink-900 rounded-xl p-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-ink-900 text-white text-xs font-extrabold flex items-center justify-center">3</span>
                  <span className="text-sm font-semibold text-ink-800">Threshold <strong>{fmtINRShort(section.threshold)}</strong>. Payment {fmtINR(result.rawAmount)} {result.crossed ? 'exceeds it, so TDS applies' : 'does not exceed it, so TDS is ₹0'}.</span>
                </li>
                <li className="flex gap-3 items-start bg-ink-50 border-2 border-ink-900 rounded-xl p-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-ink-900 text-white text-xs font-extrabold flex items-center justify-center">4</span>
                  <span className="text-sm font-semibold text-ink-800">{result.crossed
                    ? <>TDS = {result.effectiveRate}% of {fmtINR(result.taxableBase)}{section.excessOnly ? ' (amount over the threshold)' : ''} = <strong>{fmtINR(result.tds)}</strong>.</>
                    : <>No TDS to deduct: <strong>₹0</strong>.</>}</span>
                </li>
                <li className="flex gap-3 items-start bg-lime-accent/40 border-2 border-ink-900 rounded-xl p-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-ink-900 text-white text-xs font-extrabold flex items-center justify-center">5</span>
                  <span className="text-sm font-semibold text-ink-900">Net paid to payee = {fmtINR(result.rawAmount)} minus {fmtINR(result.tds)} = <strong>{fmtINR(result.net)}</strong>. The TDS is deposited with the government and shows in the payee’s Form 26AS / AIS.</span>
                </li>
              </ol>
            </div>
          </>
        )}
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · FY 2025-26 (AY 2026-27), resident payees · Thresholds change most Budgets: verify against the latest Finance Act / CBDT circulars.</div>
    </div>
  );
}
