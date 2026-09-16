# Currency pair entry — agent prompt template

You are generating TypeScript data entries for calctube.com currency conversion pages at `/conversions/currency/[slug]/`.

## CRITICAL OUTPUT RULES (read twice)

- **Start output with `{`** — first entry's opening brace. NO preamble. NO "Here are the pairs". Start immediately with `{`.
- **End each entry with `},`**.
- **No trailing text** after the last entry.
- **No markdown fences**.
- **slug MUST be `'xxx-to-yyy'` lowercase ISO format** — `'usd-to-inr'`, `'inr-to-aed'`. Never any other format.
- **All rates (rate, yearAgoRate, fiveYearAgoRate) MUST be > 0.**
- **from and to are uppercase ISO 4217 codes** — 3 letters exactly.

## Schema (every field required)

```ts
{
  slug: 'usd-to-jmd',
  from: 'USD',
  to: 'JMD',
  rate: 156.5,                    // current mid-market rate
  lastUpdated: '2026-05-17',      // ISO date
  yearAgoRate: 156.0,
  fiveYearAgoRate: 149.0,
  popularity: 'medium',           // 'huge' | 'high' | 'medium'
  context: 'Two to three sentences on why this pair is searched — diaspora corridor, peg dynamics, trade flows. Maps to existing `context` field in CurrencyPair interface.',
  faqs: [
    { q: 'Who typically converts X to Y?', a: 'Specific use case — diaspora flow, tourism, trade settlement.' },
    { q: 'Best way to send X to Y?', a: 'Name actual providers (Wise, Remitly, ICICI Money2World, Western Union, etc.) with rough spreads.' },
    { q: 'Pair-specific question 3?', a: '...' },
  ],
  metaKeywords: ['kw1', 'kw2', 'kw3', 'kw4'],
},
```

## Forbidden fields (do NOT include)

`trendNote`, `searchVolume`, `category`, `commonAmounts` — these are NOT in the CurrencyPair interface. Use `context` instead of `trendNote`.

## Quality bar

- Rate must reflect approximate May 2026 reality. Use plausible estimates:
  - USD/JMD ~156, USD/BBD =2.0 pegged, USD/BSD =1.0 pegged
  - USD/XOF ~595, USD/XAF ~595 (both EUR-pegged via euro)
  - USD/RWF ~1380, USD/PYG ~7400, USD/UYU ~40
- `context` must explain why this pair has search volume (diaspora, trade, peg, remittance corridor).
- FAQs name actual remittance providers with realistic fee structures.
- Trend notes should reflect 2026 macro context (IMF programs, dollarization, peg defenses, BoJ normalization).

## ISO 4217 codes for less-common currencies

If you use a currency code not in this list, the build will FAIL. Verify each `from`/`to` exists in src/data/currency-pairs.ts currencies dict OR run scripts/batch/extend-currencies.cjs first.

Common: USD, EUR, GBP, INR, JPY, CHF, CAD, AUD, NZD, SGD, HKD, CNY, KRW, AED, SAR, QAR, OMR, KWD, BHD, PKR, BDT, NPR, LKR, MYR, PHP, THB, IDR, VND, MXN, BRL, ZAR, NGN, KES, EGP, TRY, RUB, PLN, CZK, HUF, RON, NOK, SEK, DKK, CLP, COP, PEN, MMK, TWD, ETB, GHS, JMD, BBD, BSD, XOF, XAF, RWF, ZMW, AOA, MZN, UZS, BOB, PYG, UYU, GTQ, FJD

## Pair list

[INSERT pair list when invoking — format: `inr-to-myr (India-Malaysia diaspora reverse)`]

Output ONLY the entries, separated by commas, starting with `{`.
