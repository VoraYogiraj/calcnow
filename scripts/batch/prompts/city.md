# Indian city mortgage entry — agent prompt template

You are generating TypeScript data entries for calctube.com Indian city pSEO pages at `/finance/mortgage-calculator/cities/[slug]/`.

## CRITICAL OUTPUT RULES (read twice)

- **Start output with `{`** — first entry's opening brace. NO preamble. NO "Here are the entries". NO "I'll write 20 entries". Start immediately with `{`.
- **End each entry with `},`**.
- **No trailing text** after the last entry.
- **No markdown fences**.
- **slug MUST be clean kebab-case city name** — `'trichy'`, `'noida'`, `'kozhikode'`. NEVER prefix with `home-loan-emi-calculator-` or similar template strings.
- **All rates > 0.**
- **flag is a single emoji** representing the city (🏙️ for metros, 🏛️ for heritage, 🏗️ for industrial, etc.).

## Schema (every field required)

```ts
{
  slug: 'trichy',
  name: 'Tiruchirappalli',
  stateName: 'Tamil Nadu',
  stateSlug: 'tamil-nadu',
  flag: '🏛️',
  hraTier: 'non-metro',          // 'metro' | 'non-metro' (50% vs 40% HRA)
  stampDutyPct: 7.0,
  registrationPct: 4.0,
  womenStampDutyDiscount: 0,     // % discount off stampDutyPct for women buyers
  typicalLoanAmount: 3200000,
  typicalRate: 8.7,
  typicalTerm: 20,
  amountRange: [800000, 15000000],
  micromarkets: ['Locality 1', 'Locality 2', ...],   // 5-10 residential micromarkets
  topEmployers: ['Employer 1', 'Employer 2', ...],   // 8-12 names: PSUs, IT firms, hospitals, universities
  marketContext: 'Three to four sentences on residential pricing, dominant employer corridors, supply mix (apartments vs plots).',
  uniqueAngle: 'Two to three sentences on what makes this city distinctive — PSU borrower base, stamp duty burden, NRI corridor, etc.',
  topLenders: [
    'Bank Name: positioning note in this city',
    'Bank Name 2: positioning note',
    ...  // 4-5 lenders
  ],
  faqs: [
    { q: 'Question 1?', a: 'Answer with specific numbers (EMI on Rs X at Y% for Z years).' },
    { q: 'Question 2?', a: '...' },
    { q: 'Question 3?', a: '...' },
  ],
  metaKeywords: ['kw1', 'kw2', 'kw3', 'kw4'],
},
```

## Forbidden fields

`topAngle`, `bestFor`, `preApprovalEmployers` — those are city×bank fields, not city fields.

## Quality bar

- Micromarkets must be real localities (not made up).
- Top employers must be city-specific (no generic "Infosys" without city qualifier where appropriate).
- Stamp duty + registration must match the state's actual rates (Tamil Nadu 7+4, Maharashtra 6+1, Karnataka 5+1, Gujarat 4.9+1, Delhi 6+1, Haryana 7+1, UP 7+1, etc.).
- `hraTier` 'metro' = Mumbai, Delhi, Bengaluru, Chennai, Kolkata, Hyderabad ONLY. Everything else is 'non-metro'.
- FAQ #1 should include a worked EMI example with actual numbers.

## City list

[INSERT 10-25 city names with state context when invoking]

Output ONLY the entries, separated by commas, starting with `{`.
