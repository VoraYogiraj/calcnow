# City × Bank combo entry — agent prompt template

You are generating TypeScript data entries for calctube.com city × bank pSEO pages at `/finance/mortgage-calculator/cities/[city]/[bank]/`.

## CRITICAL OUTPUT RULES (read twice)

- **Start output with `{`**. NO preamble.
- **End each entry with `},`**.
- **No trailing text** after the last entry.
- **No markdown fences**.
- **citySlug MUST match an existing slug in `src/data/india-cities.ts`** (e.g., `'mumbai'`, `'bengaluru'`, `'trivandrum'` — NOT `'thiruvananthapuram'`).
- **bankSlug MUST match an existing slug in `src/data/emi-banks.ts`** (e.g., `'hdfc'`, `'sbi'`, `'iob'` — NOT `'indian-overseas'`, `'state-bank-of-india'`).
- The lint script will reject the batch if any city or bank slug doesn't exist.

## Schema (every field required)

```ts
{
  citySlug: 'mumbai',
  bankSlug: 'hdfc',
  bankBranchesInCity: 350,
  cityAngle: 'Two to three sentences on this specific bank\'s positioning in this specific city — branch density, top employer pre-approval pipeline, niche segment.',
  preApprovalEmployers: ['Employer 1', 'Employer 2', ...],   // 8-12 names, city-specific
  disbursalDays: '3-5 days for pre-approved customers, 7-10 days for fresh applications',
  cityFAQs: [
    { q: '[Bank] home loan [city] [angle]?', a: 'Specific answer with rate range, branch info, comparison to competitor.' },
    { q: 'City-bank specific question 2?', a: '...' },
    { q: 'City-bank specific question 3?', a: '...' },
  ],
},
```

## Forbidden fields

`slug` — citybank uses composite key (citySlug, bankSlug), no single slug.
`topAngle`, `bestFor` — those are bank-level fields.

## Existing slug references

### City slugs (check before using):
agra, ahmedabad, aizawl, aligarh, amritsar, asansol, aurangabad, bareilly, belagavi, bengaluru, bhavnagar, bhopal, bhubaneswar, chandigarh, chennai, coimbatore, cuttack, dehradun, delhi-ncr, dhanbad, durgapur, erode, faridabad, gangtok, ghaziabad, goa, guwahati, gwalior, howrah, hubballi-dharwad, hyderabad, imphal, indore, itanagar, jabalpur, jaipur, jalandhar, jamshedpur, jodhpur, kannur, kanpur, kochi, kolkata, kollam, kota, kozhikode, lucknow, ludhiana, madurai, mangaluru, meerut, moradabad, mumbai, mysuru, nagpur, nashik, noida, patna, pondicherry, prayagraj, pune, raipur, rajkot, ranchi, saharanpur, salem, shillong, siliguri, surat, thrissur, tirupati, tirupur, trichy, trivandrum, udaipur, vadodara, varanasi, vellore, vijayawada, visakhapatnam, warangal

### Bank slugs (check before using):
aavas, airtel-payments-bank, aptus, au-sfb, axis, bajaj-finance, bajaj-housing-finance, bandhan, bank-of-baroda (bob), bank-of-india, bnp-paribas-india, canara, central-bank, cholamandalam, citi-india, city-union, cosmos-bank, csb, dbs-india, dbi, dcb, dewan-housing, dhfl, edelweiss, equitas-sfb, federal, five-star-finance, gic-housing, hdfc, hsbc-india, hudco, icici, idfc-first, india-shelter, indiabulls, indian-bank, indusind, iob (Indian Overseas Bank — NOT 'indian-overseas'), j-and-k, karur-vysya, kotak, l-and-t-finance, lic-housing, mahindra-finance, mahindra-rural, manappuram, motilal-oswal, muthoot-finance, paytm-payments-bank, pnb, pnb-housing, repco, rbl, saraswat-bank, sbi, shamrao-vithal, shriram-finance, south-indian, sc-india, tata-capital-housing, ujjivan-sfb, uco, union-bank, yes-bank

When in doubt about a slug, grep the data files. The lint script will catch mismatches but it costs you a round-trip.

## Quality bar

- `cityAngle` must be specific to that bank IN that city — branch count, named employer corridors, specific pre-approval pipeline. Generic statements ("XYZ Bank is a major lender") will fail the spot-check.
- `preApprovalEmployers` mixes (a) the bank itself + (b) 8-10 city-specific MNCs/PSUs/IT firms by name.
- `disbursalDays` distinguishes pre-approved vs fresh applications.
- FAQ #1 must include the bank's actual rate range in that city (e.g., "8.40-8.70% for top-grade IT salaried with [Bank] salary account").
- FAQ #2 should compare to a relevant competitor (HDFC vs SBI, Federal vs Canara, etc.).
- FAQ #3 often addresses a specific scenario (NRI on Gulf income, government employee, balance transfer).

## Combo list

[INSERT 10-25 city × bank combinations when invoking — format: `mumbai × hdfc (BKC pre-approval pipeline angle)`]

Output ONLY the entries, separated by commas, starting with `{`.
