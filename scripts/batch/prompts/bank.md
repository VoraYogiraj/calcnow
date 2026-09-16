# Indian bank/HFC/NBFC entry — agent prompt template

You are generating TypeScript data entries for calctube.com bank EMI calculator pages at `/finance/emi-calculator/[slug]/`.

## CRITICAL OUTPUT RULES (read twice)

- **Start output with `{`** — first entry's opening brace. NO preamble. Start immediately.
- **End each entry with `},`**.
- **No trailing text** after the last entry.
- **No markdown fences**.
- **emoji MUST be a single emoji character** — `'🏦'`, `'🏘️'`, `'💳'`, `'🚜'`, `'💰'`. NEVER multi-character text codes like `'LICHF'`, `'PNBHFL'`, `'BAJAJ'`.
- **All rate min/max/typical values MUST be > 0.** Even for Payments Banks (which can't lend), use placeholder high values like 14/24/18 — never zero. (Page will note lending is restricted in `marketContext`.)
- **slug MUST be clean kebab-case** (e.g., `'bajaj-housing-finance'`, `'au-sfb'`).

## Schema (every field required)

```ts
{
  slug: 'bajaj-housing-finance',
  bankName: 'Bajaj Housing Finance',
  fullName: 'Bajaj Housing Finance Limited',
  emoji: '🏘️',
  hqLocation: 'Pune, Maharashtra',
  homeLoanRate: { min: 8.50, max: 12.50, typical: 9.40 },
  personalLoanRate: { min: 11.00, max: 24.00, typical: 14.50 },
  carLoanRate: { min: 9.50, max: 15.00, typical: 11.25 },
  processingFee: '0.5% of loan amount (capped at Rs. 25,000)',   // STRING, not object
  prepaymentPolicy: 'Zero foreclosure charges on floating-rate home loans per RBI guidelines. 2-5% charges on fixed-rate, vehicle, and personal loans.',  // STRING
  marketContext: 'Three to four sentences on the bank/NBFC — scale (AUM), recent strategic moves (IPO, merger, RBI action), target segment.',
  uniqueAngle: 'Two to three sentences on what makes this lender distinct vs HDFC/SBI/ICICI — digital experience, NRI workflow, rural reach, gold loan expertise, etc.',
  productHighlights: [
    'Bullet 1 — specific product feature',
    'Bullet 2 — ticket size or tenure range',
    'Bullet 3 — pre-approval or speed advantage',
    'Bullet 4 — concession or unique program',
    'Bullet 5 — top-up or balance transfer feature',
  ],   // 3-5 bullets, each one sentence
  faqs: [
    { q: 'What is the minimum CIBIL score for [Bank] home loan?', a: 'Specific answer with numbers.' },
    { q: 'How does [Bank] compare to HDFC/SBI?', a: 'Specific comparison with rate spreads.' },
    { q: 'Eligibility for [Bank] loans?', a: 'Age, income, vintage requirements.' },
    { q: 'Processing time at [Bank]?', a: 'Days for pre-approved vs fresh applications.' },
  ],
  metaKeywords: ['kw1', 'kw2', 'kw3', 'kw4', 'kw5'],
},
```

## Forbidden fields (do NOT include — these will fail build)

`topAngle` — use `uniqueAngle` instead.
`bestFor` — use `productHighlights` instead.
`processingFeePct`, `processingFeeMax`, `preApprovalPossible`, `womenBorrowerDiscount`, `bankType`, `established`, `branches` — none of these are in the BankData interface. Roll them into `marketContext` or `uniqueAngle` if relevant.

## Quality bar

- `marketContext` must cite real numbers (AUM, branch count, recent IPO, merger date).
- `processingFee` is a STRING describing the fee structure, not a numeric percentage.
- `prepaymentPolicy` is a STRING. Floating-rate home loans have zero foreclosure per RBI; mention any fixed-rate or non-home-loan exceptions.
- For Payments Banks (Paytm PB, Airtel PB, Fino, India Post PB): use placeholder rate values (~14/24/18) and explain in `marketContext` that lending is statutorily prohibited; loans on their apps are partner NBFCs.
- For Small Finance Banks (AU, Equitas, Ujjivan, Suryoday, ESAF, etc.): note SFB regulatory status and typical 50-150 bps deposit-rate premium vs large banks.
- For Cooperative Banks (Saraswat, Cosmos, SVC, Apna Sahakari, NKGSB, etc.): note RBI + State Cooperative Societies Act dual regulation, DICGC insurance up to Rs 5 lakh.

## Bank list

[INSERT 10-25 bank/HFC/NBFC names when invoking]

Output ONLY the entries, separated by commas, starting with `{`.
