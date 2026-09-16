# Country mortgage entry — agent prompt template

You are generating TypeScript data entries for calctube.com programmatic-SEO mortgage calculator pages. Each entry becomes a live page at `/finance/mortgage-calculator/[slug]/`.

## CRITICAL OUTPUT RULES (read twice)

- **Start output with `{`** — the first entry's opening brace. NO preamble. NO "Here are the entries". NO "I'll generate". Start immediately with `{`.
- **End each entry with `},`** (comma after closing brace).
- **No trailing text** after the last entry.
- **No markdown fences** (no ```ts). Raw TS only.
- **All numeric rates and amounts must be > 0.** No zero values anywhere.
- **flag MUST be a 2-character country emoji** (e.g., `'🇯🇲'`), never text codes.
- **slug MUST be clean kebab-case** (e.g., `'jamaica'`, `'papua-new-guinea'`). Never prefix with template names.

## Schema (every field is required)

```ts
{
  slug: 'kebab-case-country-slug',
  country: 'Display Name',
  flag: '🇯🇲',                 // 2-char country emoji
  language: 'en-JM',              // BCP 47
  currency: 'JMD',                // ISO 4217 (3 letters)
  currencySymbol: 'J$',
  locale: 'en-JM',                // Intl locale
  termLocalName: 'mortgage',      // local term: 'home loan EMI', 'ipoteka', 'hypothèque', etc.
  typicalAmount: 18000000,        // typical loan in local currency, > 0
  typicalRate: 10.5,              // typical rate %, > 0
  typicalTerm: 25,                // years, 1-50
  amountRange: [3000000, 150000000],
  rateRange: [9.0, 12.0],
  marketContext: 'Two to three sentences on local mortgage market — major lenders, regulator, demand drivers, recent rate cycle.',
  rateContext: 'One sentence explaining why this rate is typical (policy rate + spread, peg, subsidies).',
  taxAndRegulation: 'Two to three sentences on stamp duty, transfer tax, mortgage regulator, and any borrower protections.',
  faqs: [
    { q: 'Locale-specific question 1?', a: 'Specific answer with real lender names and numbers.' },
    { q: 'Locale-specific question 2?', a: '...' },
    { q: 'Locale-specific question 3?', a: '...' },
  ],
  workedExample: {
    description: 'A mortgage of $5,000,000 at 10.5% over 25 years',
    amount: 5000000,
    rate: 10.5,
    term: 25,
  },
  metaKeywords: ['kw1', 'kw2', 'kw3', 'kw4'],
},
```

## Forbidden fields (do NOT include)

`trendNote`, `searchVolume`, `category`, `commonAmounts`, `topAngle`, `bestFor` — these belong to other entry types.

## Quality bar

- `marketContext` must name 2-3 real lenders or regulators (NCB Jamaica, Bank Maskan, KfW, Maybank, etc.).
- `rateContext` must explain the rate (policy + spread, peg, subsidy program).
- `taxAndRegulation` must cite real statutes or programs where possible.
- FAQs must be locale-specific, not generic. Address actual purchase mechanics.
- Rates must reflect 2026 reality (IMF programs, post-default restructuring, peg defenses).
- `termLocalName` should use the local language where natural (Spanish-speaking: "hipoteca", French: "hypothèque", Russian: "ипотека", etc.).

## Country list

[INSERT 10-30 country names here when invoking]

Output ONLY the entries, separated by commas, starting with `{`.
