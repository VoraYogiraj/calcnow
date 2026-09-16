import { useState, useMemo } from 'react';

/**
 * Capital Gains Tax Calculator (India) — post-Budget-2024 rules.
 *
 * IMPORTANT: These rules apply to transfers made ON OR AFTER 23 July 2024
 * (Union Budget 2024). Key changes from that date:
 *   - Listed equity / equity MF LTCG rate: 10% -> 12.5%; exemption 1L -> 1.25L
 *   - Listed equity / equity MF STCG rate: 15% -> 20%
 *   - Property / gold / unlisted LTCG: flat 12.5% WITHOUT indexation
 *     (grandfathering: property acquired before 23 Jul 2024 may still pick the
 *      old 20% WITH indexation and pay the lower of the two).
 *   - Debt MF bought on/after 1 Apr 2023: always taxed at slab, no LT benefit.
 *
 * This is an educational estimate, NOT tax advice. Verify current rates with the
 * Income Tax Department (incometax.gov.in) or a chartered accountant before filing.
 */

// ---------- ₹ helpers (₹ only, no LocalizeMoney) ----------
function fmtINR(n: number): string {
  const neg = n < 0;
  const v = Math.round(Math.abs(n));
  const s = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(v);
  return `${neg ? '-' : ''}₹${s}`;
}
function fmtINRShort(n: number): string {
  const neg = n < 0;
  const v = Math.abs(n);
  let out: string;
  if (v >= 10000000) out = `₹${(v / 10000000).toFixed(2)} Cr`;
  else if (v >= 100000) out = `₹${(v / 100000).toFixed(2)} L`;
  else out = `₹${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.round(v))}`;
  return `${neg ? '-' : ''}${out}`;
}

// ---------- Cost Inflation Index (official, hard-coded) ----------
// FY (April-March) -> CII. 2025-26 is provisional until officially notified.
const CII: Record<string, number> = {
  '2001-02': 100, '2002-03': 105, '2003-04': 109, '2004-05': 113, '2005-06': 117,
  '2006-07': 122, '2007-08': 129, '2008-09': 137, '2009-10': 148, '2010-11': 167,
  '2011-12': 184, '2012-13': 200, '2013-14': 220, '2014-15': 240, '2015-16': 254,
  '2016-17': 264, '2017-18': 272, '2018-19': 280, '2019-20': 289, '2020-21': 301,
  '2021-22': 317, '2022-23': 331, '2023-24': 348, '2024-25': 363, '2025-26': 376,
};

interface YMD { y: number; m: number; d: number }
function parseYMD(s: string): YMD | null {
  if (!s) return null;
  const parts = s.split('-').map(Number);
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return null;
  return { y: parts[0], m: parts[1], d: parts[2] };
}
function monthsBetween(start: YMD, end: YMD): number {
  let months = (end.y - start.y) * 12 + (end.m - start.m);
  if (end.d < start.d) months -= 1;
  return months;
}
// Map a date to its financial-year CII (clamped to the published 2001-02..2025-26 range).
function ciiFor(p: YMD): { key: string; cii: number; clamped: boolean } {
  let startYear = p.m >= 4 ? p.y : p.y - 1;
  let clamped = false;
  if (startYear < 2001) { startYear = 2001; clamped = true; }
  if (startYear > 2025) { startYear = 2025; clamped = true; }
  const key = `${startYear}-${String((startYear + 1) % 100).padStart(2, '0')}`;
  return { key, cii: CII[key], clamped };
}

type AssetType = 'equity' | 'debt' | 'property' | 'gold';

const ASSET_META: Record<AssetType, { label: string; ltMonths: number; icon: string }> = {
  equity: { label: 'Listed equity shares / equity mutual funds (STT paid)', ltMonths: 12, icon: '📈' },
  debt: { label: 'Debt mutual fund (bought on/after 1 Apr 2023)', ltMonths: 0, icon: '🏦' },
  property: { label: 'Property / immovable (land, building)', ltMonths: 24, icon: '🏠' },
  gold: { label: 'Gold / physical assets / unlisted shares', ltMonths: 24, icon: '🪙' },
};

const EQUITY_EXEMPTION = 125000; // ₹1.25 lakh per year (raised from ₹1L on 23 Jul 2024)
const CUTOFF = { y: 2024, m: 7, d: 23 }; // 23 July 2024

function beforeCutoff(p: YMD): boolean {
  if (p.y !== CUTOFF.y) return p.y < CUTOFF.y;
  if (p.m !== CUTOFF.m) return p.m < CUTOFF.m;
  return p.d < CUTOFF.d;
}

interface Step { label: string; value: string; strong?: boolean }

export default function CapitalGainsCalculator() {
  const [assetType, setAssetType] = useState<AssetType>('equity');
  const [purchasePrice, setPurchasePrice] = useState<number>(500000);
  const [salePrice, setSalePrice] = useState<number>(800000);
  const [purchaseDate, setPurchaseDate] = useState<string>('2022-01-01');
  const [saleDate, setSaleDate] = useState<string>('2024-08-01');
  const [slabRate, setSlabRate] = useState<number>(30); // 5 / 20 / 30

  const r = useMemo(() => {
    const p = parseYMD(purchaseDate);
    const s = parseYMD(saleDate);
    const cost = Math.max(0, Number(purchasePrice) || 0);
    const sale = Math.max(0, Number(salePrice) || 0);
    const gain = sale - cost;
    const isLoss = gain < 0;

    const meta = ASSET_META[assetType];
    const holdingMonths = p && s ? monthsBetween(p, s) : 0;
    const dateError = !p || !s ? 'Enter valid purchase and sale dates.' : holdingMonths < 0 ? 'Sale date is before the purchase date.' : '';
    const validHolding = Math.max(0, holdingMonths);

    // Debt MF (post 1 Apr 2023): always slab, no LT benefit regardless of holding.
    const isDebt = assetType === 'debt';
    const isLong = isDebt ? false : validHolding > meta.ltMonths;
    const ltThreshold = meta.ltMonths;

    const steps: Step[] = [];
    const notes: string[] = [];

    // --- Header steps common to all ---
    if (isDebt) {
      steps.push({ label: 'Holding period', value: `${validHolding} month${validHolding === 1 ? '' : 's'} (debt MF post 1 Apr 2023: no long-term benefit)` });
    } else {
      steps.push({ label: 'Holding period', value: `${validHolding} month${validHolding === 1 ? '' : 's'} (${isLong ? 'more than' : 'up to'} ${ltThreshold} months)` });
    }
    steps.push({ label: isLong ? 'Term' : 'Term', value: isDebt ? 'Taxed at slab rate' : isLong ? 'LONG term' : 'SHORT term' });
    steps.push({ label: 'Capital gain', value: `${fmtINR(sale)} - ${fmtINR(cost)} = ${fmtINR(gain)}`, strong: true });

    if (isLoss) {
      notes.push('This is a CAPITAL LOSS, not a gain. No tax is payable. The loss can be set off against other capital gains this year and carried forward for up to 8 assessment years (short-term loss offsets both STCG and LTCG; long-term loss offsets only LTCG). File your return on time to preserve carry-forward.');
    }

    // Result container
    let primaryLabel = '';
    let primaryRate = '';
    let exemption = 0;
    let taxableGain = 0;
    let tax = 0;

    // Property grandfathering comparison
    let showChoice = false;
    let noIndex: { gain: number; tax: number } | null = null;
    let withIndex: { indexedCost: number; indexedGain: number; tax: number; ciiP: number; ciiS: number; keyP: string; keyS: string } | null = null;
    let chosen: 'noindex' | 'index' | null = null;

    if (isLoss) {
      // Loss path: zero tax across the board.
      primaryLabel = 'Capital loss';
      primaryRate = '0%';
      exemption = assetType === 'equity' && isLong ? 0 : 0;
      taxableGain = 0;
      tax = 0;
    } else if (assetType === 'equity') {
      if (isLong) {
        primaryLabel = 'LTCG @ 12.5% (no indexation)';
        primaryRate = '12.5%';
        exemption = Math.min(EQUITY_EXEMPTION, gain);
        taxableGain = Math.max(0, gain - EQUITY_EXEMPTION);
        tax = taxableGain * 0.125;
        steps.push({ label: 'Less: LTCG exemption', value: `- ${fmtINR(exemption)} (₹1.25 lakh/year)` });
        steps.push({ label: 'Taxable LTCG', value: fmtINR(taxableGain) });
        steps.push({ label: 'LTCG tax @ 12.5%', value: fmtINR(tax), strong: true });
      } else {
        primaryLabel = 'STCG @ 20%';
        primaryRate = '20%';
        taxableGain = gain;
        tax = gain * 0.20;
        steps.push({ label: 'Taxable STCG', value: fmtINR(taxableGain) });
        steps.push({ label: 'STCG tax @ 20%', value: fmtINR(tax), strong: true });
      }
    } else if (isDebt) {
      primaryLabel = `Taxed at slab rate (${slabRate}%)`;
      primaryRate = `${slabRate}%`;
      taxableGain = gain;
      tax = gain * (slabRate / 100);
      steps.push({ label: 'Taxable gain (at slab)', value: fmtINR(taxableGain) });
      steps.push({ label: `Tax @ ${slabRate}% slab`, value: fmtINR(tax), strong: true });
      notes.push('Debt mutual funds bought on or after 1 April 2023 have no long-term capital gains benefit. The entire gain is added to your income and taxed at your slab rate, whatever the holding period.');
    } else if (assetType === 'property') {
      if (!isLong) {
        primaryLabel = `STCG at slab rate (${slabRate}%)`;
        primaryRate = `${slabRate}%`;
        taxableGain = gain;
        tax = gain * (slabRate / 100);
        steps.push({ label: 'Taxable STCG (at slab)', value: fmtINR(taxableGain) });
        steps.push({ label: `STCG tax @ ${slabRate}% slab`, value: fmtINR(tax), strong: true });
      } else {
        // Long-term property. Method A: 12.5% no indexation.
        const taxNoIndex = gain * 0.125;
        noIndex = { gain, tax: taxNoIndex };
        const eligible = p ? beforeCutoff(p) : false;
        if (eligible) {
          // Method B: 20% with indexation (grandfathering for pre-23-Jul-2024 property).
          const cp = ciiFor(p as YMD);
          const cs = ciiFor(s as YMD);
          const indexedCost = cost * (cs.cii / cp.cii);
          const indexedGain = Math.max(0, sale - indexedCost);
          const taxWithIndex = indexedGain * 0.20;
          withIndex = { indexedCost, indexedGain, tax: taxWithIndex, ciiP: cp.cii, ciiS: cs.cii, keyP: cp.key, keyS: cs.key };
          showChoice = true;
          chosen = taxWithIndex <= taxNoIndex ? 'index' : 'noindex';
          tax = Math.min(taxNoIndex, taxWithIndex);
          primaryLabel = chosen === 'index' ? 'Old method: 20% WITH indexation (lower)' : 'New method: 12.5% WITHOUT indexation (lower)';
          primaryRate = chosen === 'index' ? '20% + indexation' : '12.5%';
          taxableGain = chosen === 'index' ? indexedGain : gain;

          steps.push({ label: 'Method A - 12.5% no indexation', value: `12.5% x ${fmtINR(gain)} = ${fmtINR(taxNoIndex)}` });
          steps.push({ label: `Indexed cost (CII ${cs.cii}/${cp.cii})`, value: `${fmtINR(cost)} x ${cs.cii}/${cp.cii} = ${fmtINR(indexedCost)}` });
          steps.push({ label: 'Method B - indexed gain', value: `${fmtINR(sale)} - ${fmtINR(indexedCost)} = ${fmtINR(indexedGain)}` });
          steps.push({ label: 'Method B - 20% with indexation', value: `20% x ${fmtINR(indexedGain)} = ${fmtINR(taxWithIndex)}` });
          steps.push({ label: 'You pay the LOWER of the two', value: fmtINR(tax), strong: true });
          if (cp.clamped || cs.clamped) {
            notes.push('One of your dates falls outside the published CII range (FY 2001-02 to FY 2025-26). For property bought before 1 April 2001, the law lets you substitute the fair market value as on 1 April 2001 as the cost; this tool clamps to the nearest published index, so treat the indexed figure as indicative only.');
          }
          notes.push('Grandfathering: because this property was acquired before 23 July 2024, a resident individual or HUF may choose either method and pay the lower tax. The indexation option is not available for property acquired on or after 23 July 2024, nor for shares, mutual funds, gold or other assets.');
        } else {
          // Acquired on/after 23 Jul 2024: only 12.5% no indexation.
          tax = taxNoIndex;
          primaryLabel = 'LTCG @ 12.5% (no indexation)';
          primaryRate = '12.5%';
          taxableGain = gain;
          steps.push({ label: 'Taxable LTCG', value: fmtINR(gain) });
          steps.push({ label: 'LTCG tax @ 12.5%', value: fmtINR(tax), strong: true });
          notes.push('Property acquired on or after 23 July 2024 is taxed only at 12.5% without indexation. The 20%-with-indexation option is not available for these acquisitions.');
        }
      }
    } else {
      // gold / physical / unlisted
      if (isLong) {
        primaryLabel = 'LTCG @ 12.5% (no indexation)';
        primaryRate = '12.5%';
        taxableGain = gain;
        tax = gain * 0.125;
        steps.push({ label: 'Taxable LTCG', value: fmtINR(gain) });
        steps.push({ label: 'LTCG tax @ 12.5%', value: fmtINR(tax), strong: true });
        notes.push('Since 23 July 2024, gold, unlisted shares and other assets held long term are taxed at a flat 12.5% without indexation. There is no annual exemption for these (unlike the ₹1.25 lakh equity exemption).');
      } else {
        primaryLabel = `STCG at slab rate (${slabRate}%)`;
        primaryRate = `${slabRate}%`;
        taxableGain = gain;
        tax = gain * (slabRate / 100);
        steps.push({ label: 'Taxable STCG (at slab)', value: fmtINR(taxableGain) });
        steps.push({ label: `STCG tax @ ${slabRate}% slab`, value: fmtINR(tax), strong: true });
      }
    }

    tax = Math.max(0, Math.round(tax));
    const netGain = gain - tax;

    const showSlab =
      assetType === 'debt' ||
      ((assetType === 'property' || assetType === 'gold') && !isLong && !isLoss);

    return {
      meta, holdingMonths: validHolding, isLong, isDebt, ltThreshold, dateError,
      gain, isLoss, primaryLabel, primaryRate, exemption, taxableGain, tax, netGain,
      showChoice, noIndex, withIndex, chosen, steps, notes, showSlab,
    };
  }, [assetType, purchasePrice, salePrice, purchaseDate, saleDate, slabRate]);

  return (
    <div className="relative not-prose">
      <div className="bg-white border-[2.5px] border-ink-900 rounded-3xl overflow-hidden shadow-sticker">
        {/* Header bar */}
        <div className="bg-pink-accent border-b-[2.5px] border-ink-900 px-5 sm:px-7 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💹</span>
            <h2 className="!text-lg sm:!text-xl !my-0 !text-white font-extrabold" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.02em' }}>
              Capital Gains Tax Calculator
            </h2>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-50"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            Post 23 Jul 2024
          </span>
        </div>

        {/* Inputs */}
        <div className="p-5 sm:p-7 bg-ink-50 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          <div className="md:col-span-2">
            <label htmlFor="cg-asset" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Asset type</label>
            <select
              id="cg-asset" value={assetType} onChange={(e) => setAssetType(e.target.value as AssetType)}
              className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-pink-accent transition-all cursor-pointer"
            >
              <option value="equity">📈 Listed equity / equity mutual funds (STT paid)</option>
              <option value="debt">🏦 Debt mutual fund (bought on/after 1 Apr 2023)</option>
              <option value="property">🏠 Property / immovable (land, building)</option>
              <option value="gold">🪙 Gold / physical assets / unlisted shares</option>
            </select>
            <div className="text-[10px] text-ink-500 mt-1.5 font-bold">
              {assetType === 'equity' && 'Long term if held more than 12 months. LTCG 12.5% over ₹1.25L exemption; STCG 20%.'}
              {assetType === 'debt' && 'Always taxed at your slab rate. No long-term benefit for units bought on/after 1 Apr 2023.'}
              {assetType === 'property' && 'Long term if held more than 24 months. Grandfathering applies if acquired before 23 Jul 2024.'}
              {assetType === 'gold' && 'Long term if held more than 24 months. LTCG flat 12.5% without indexation, no exemption.'}
            </div>
          </div>

          <div>
            <label htmlFor="cg-buy" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Purchase price (cost)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">₹</span>
              <input id="cg-buy" type="number" min={0} step={10000} value={purchasePrice} onChange={(e) => setPurchasePrice(Number(e.target.value) || 0)}
                className="w-full pl-7 pr-3 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-pink-accent transition-all" inputMode="numeric" />
            </div>
          </div>
          <div>
            <label htmlFor="cg-sell" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Sale price</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 font-bold pointer-events-none">₹</span>
              <input id="cg-sell" type="number" min={0} step={10000} value={salePrice} onChange={(e) => setSalePrice(Number(e.target.value) || 0)}
                className="w-full pl-7 pr-3 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-cyan-accent transition-all" inputMode="numeric" />
            </div>
          </div>
          <div>
            <label htmlFor="cg-buydate" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Purchase date</label>
            <input id="cg-buydate" type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)}
              className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-yellow-accent transition-all" />
          </div>
          <div>
            <label htmlFor="cg-selldate" className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Sale date</label>
            <input id="cg-selldate" type="date" value={saleDate} onChange={(e) => setSaleDate(e.target.value)}
              className="w-full px-3.5 py-3 bg-white border-[2.5px] border-ink-900 rounded-xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-yellow-accent transition-all" />
          </div>

          {r.showSlab && (
            <div className="md:col-span-2">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-ink-700 mb-2">Your income-tax slab rate</label>
              <div className="flex flex-wrap gap-2">
                {[5, 20, 30].map((sr) => (
                  <button key={sr} type="button" onClick={() => setSlabRate(sr)}
                    className={`px-4 py-2 rounded-full text-sm font-bold border-2 border-ink-900 transition-all ${slabRate === sr ? 'bg-pink-accent text-white shadow-sticker-sm' : 'bg-white text-ink-700 hover:bg-pink-accent/10'}`}>
                    {sr}%
                  </button>
                ))}
              </div>
              <div className="text-[10px] text-ink-500 mt-1.5 font-bold">Short-term / debt gains are added to income and taxed at this slab. Pick the rate closest to your top slab.</div>
            </div>
          )}
        </div>

        {/* Date error */}
        {r.dateError && (
          <div className="px-5 sm:px-7 py-3 bg-yellow-accent/40 border-t-[2.5px] border-ink-900 text-sm font-bold text-ink-900">⚠️ {r.dateError}</div>
        )}

        {/* Result cards */}
        <div className="p-5 sm:p-7 bg-white border-t-[2.5px] border-ink-900 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-cyan-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">Holding period</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.03em' }}>{r.holdingMonths} mo</div>
            <div className="text-xs text-ink-800 mt-2 font-semibold">{r.isDebt ? 'Slab (no LT benefit)' : r.isLong ? 'Long term' : 'Short term'}</div>
          </div>
          <div className={`${r.isLoss ? 'bg-yellow-accent' : 'bg-lime-accent'} border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm`}>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-900 mb-1">{r.isLoss ? 'Capital loss' : 'Capital gain'}</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.03em' }}>{fmtINRShort(r.gain)}</div>
            <div className="text-xs text-ink-800 mt-2 font-semibold">{r.isLoss ? 'Set off / carry forward' : `Taxable: ${fmtINRShort(r.taxableGain)}`}</div>
          </div>
          <div className="bg-pink-accent border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-white mb-1">Tax payable</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white leading-none" style={{ fontFamily: 'Inter Tight, Inter, sans-serif', letterSpacing: '-0.03em' }}>{fmtINRShort(r.tax)}</div>
            <div className="text-xs text-white/90 mt-2 font-semibold">{r.primaryRate}{r.isLoss ? '' : ' effective'}</div>
          </div>
        </div>

        {/* Property with-vs-without indexation comparison */}
        {r.showChoice && r.noIndex && r.withIndex && (
          <div className="px-5 sm:px-7 pb-2 bg-white">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mb-3">Property: choose the lower tax (grandfathering)</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className={`${r.chosen === 'noindex' ? 'bg-lime-accent' : 'bg-white'} border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm relative`}>
                {r.chosen === 'noindex' && <span className="absolute -top-3 -right-3 chip-lime !text-xs border-2 border-ink-900">✓ Lower</span>}
                <div className="text-xs font-extrabold uppercase tracking-wider text-ink-900 mb-1">12.5% no indexation</div>
                <div className="text-3xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight', letterSpacing: '-0.04em' }}>{fmtINR(r.noIndex.tax)}</div>
                <div className="text-xs text-ink-800 mt-2 font-semibold">on gain {fmtINR(r.noIndex.gain)}</div>
              </div>
              <div className={`${r.chosen === 'index' ? 'bg-lime-accent' : 'bg-white'} border-[2.5px] border-ink-900 rounded-2xl p-5 shadow-sticker-sm relative`}>
                {r.chosen === 'index' && <span className="absolute -top-3 -right-3 chip-lime !text-xs border-2 border-ink-900">✓ Lower</span>}
                <div className="text-xs font-extrabold uppercase tracking-wider text-ink-900 mb-1">20% with indexation</div>
                <div className="text-3xl font-extrabold text-ink-900 leading-none" style={{ fontFamily: 'Inter Tight', letterSpacing: '-0.04em' }}>{fmtINR(r.withIndex.tax)}</div>
                <div className="text-xs text-ink-800 mt-2 font-semibold">on indexed gain {fmtINR(r.withIndex.indexedGain)}</div>
              </div>
            </div>
          </div>
        )}

        {/* Step-by-step computation (unique content) */}
        <div className="px-5 sm:px-7 pb-5 sm:pb-7 pt-4 bg-white">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-700 mb-3">Step-by-step computation</div>
          <div className="bg-ink-50 border-2 border-ink-900 rounded-2xl divide-y-2 divide-ink-100 overflow-hidden">
            {r.steps.map((st, i) => (
              <div key={i} className={`flex items-start justify-between gap-4 px-4 py-3 ${st.strong ? 'bg-lime-accent/40' : ''}`}>
                <span className="text-sm font-bold text-ink-700">{st.label}</span>
                <span className={`text-sm text-right ${st.strong ? 'font-extrabold text-ink-900' : 'font-semibold text-ink-800'}`}>{st.value}</span>
              </div>
            ))}
            {!r.isLoss && (
              <div className="flex items-start justify-between gap-4 px-4 py-3 bg-cyan-accent/40">
                <span className="text-sm font-bold text-ink-700">Net gain after tax</span>
                <span className="text-sm text-right font-extrabold text-ink-900">{fmtINR(r.netGain)}</span>
              </div>
            )}
          </div>

          {r.notes.map((n, i) => (
            <div key={i} className="mt-3 bg-yellow-accent/30 border-2 border-ink-900 rounded-xl px-4 py-3 text-xs font-semibold text-ink-800 leading-relaxed">💡 {n}</div>
          ))}
        </div>
      </div>
      <div className="text-xs text-ink-500 mt-3 px-1 font-bold">✨ Live · Rules for transfers on/after 23 Jul 2024 (Budget 2024) · Tax shown is the base LTCG/STCG amount before 4% health &amp; education cess and any surcharge · Educational estimate, not tax advice · Verify current rates with the Income Tax Department or a CA.</div>
    </div>
  );
}
