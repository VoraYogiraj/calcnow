# Calctube — Programmatic SEO Strategy

## TL;DR

Calctube has launched its first wave of programmatic SEO pages: **14 unique variants** generated from 2 dynamic templates with first-party locale and bank data. The next 4 waves will scale to **~250 indexable pages** following the same defensibility principles.

Status as of 2026-05-13: **29 pages live** on calctube.com, 14 of them programmatic, all uniquely written, schema-marked, and linked from parent calculators.

---

## Strategy Foundations

### Why these playbooks for Calctube

| Playbook | Why it fits | Differentiation |
|---|---|---|
| **Locations** (country variants) | Calculator math is universal, but rates/rules/currency are local. SERPs for "[calc] [country]" are weak outside the head-term. | Locale data, market context, tax notes, locale-specific FAQs |
| **Locations** (Indian bank variants) | India-specific moat. Bank-level EMI calc searches have massive volume; SERPs are dominated by each bank's own marketing page. | Cross-bank comparable rates, processing fees, prepayment policies, fast bank-vs-bank comparisons |
| **Templates** (term variants) | Long-tail "15-year mortgage calculator" has clean intent, less competition than head term. | Worked examples per term length, total interest comparison |
| **Conversions** (currency converter pages) | Massive volume, classic pSEO pattern. | Live rates + 30-day chart + historical context (Phase 3) |
| **Glossary** (what-is pages) | "What is EMI", "What is APR" — informational long-tail. | Pair with the relevant calculator on each glossary page (utility hook) |

### Defensibility hierarchy (per the playbook)

Our data sources, ranked:
1. **Proprietary** — Our locale matrices (rate ranges, market context, tax notes per country/bank). Hand-curated, not scraped. ✅
2. **Public + transformed** — RBI repo rate, Fed funds, ECB rate translated into market-typical mortgage rates. ✅
3. **Live API** — Currency rates, stock data (Phase 3, not built yet)

We never use pure-public data with no transformation. Every page is enriched with original context.

---

## Phase 1 (DONE — 2026-05-13): 14 pages

### Mortgage by country (8 pages)
| URL | Country | Currency | Rate | Term |
|---|---|---|---|---|
| `/finance/mortgage-calculator/india/` | India | INR | 8.5% | 20y |
| `/finance/mortgage-calculator/uk/` | United Kingdom | GBP | 4.5% | 25y |
| `/finance/mortgage-calculator/canada/` | Canada | CAD | 5.0% | 25y |
| `/finance/mortgage-calculator/australia/` | Australia | AUD | 6.0% | 30y |
| `/finance/mortgage-calculator/usa/` | USA | USD | 6.5% | 30y |
| `/finance/mortgage-calculator/germany/` | Germany | EUR | 3.8% | 20y |
| `/finance/mortgage-calculator/singapore/` | Singapore | SGD | 3.5% | 25y |
| `/finance/mortgage-calculator/uae/` | UAE | AED | 4.5% | 25y |

### EMI by bank (6 pages — India)
| URL | Bank | Home loan rate |
|---|---|---|
| `/finance/emi-calculator/hdfc/` | HDFC Bank | 8.45–9.5% |
| `/finance/emi-calculator/sbi/` | State Bank of India | 8.25–9.4% |
| `/finance/emi-calculator/icici/` | ICICI Bank | 8.6–9.65% |
| `/finance/emi-calculator/axis/` | Axis Bank | 8.75–9.4% |
| `/finance/emi-calculator/kotak/` | Kotak Mahindra | 8.7–9.4% |
| `/finance/emi-calculator/bob/` | Bank of Baroda | 8.4–10.4% |

### What's unique about each page (avoiding thin-content penalty)
- **Locale-specific quick answer** with computed real numbers (₹43,867 EMI for HDFC, $1,996 for USA, etc.)
- **Market context paragraph** — RBI vs Fed vs ECB; market structure; lender landscape
- **Rate-context paragraph** — why this specific rate is typical NOW (May 2026)
- **Tax and regulatory note** — Section 80C/24(b) for India, SDLT for UK, IRA mortgage interest deduction for USA, Grunderwerbsteuer for Germany, ABSD for Singapore, etc.
- **Worked example** with locale currency formatting
- **3 unique FAQs** — country-specific or bank-specific concerns
- **Product highlights** (bank pages) — SBI MaxGain, ICICI InstaHome, Axis Asha, etc.
- **Internal links to siblings** — every country page links to 4 other countries; every bank page links to 5 other banks

### Schema markup per page
- `WebApplication` (the calculator itself)
- `BreadcrumbList` (navigation)
- `FAQPage` (locale-specific FAQs — feeds AI Overview citations)

---

## Phase 2 (NEXT — target +60 pages)

### 2A: Term variants for top 3 calculators (18 pages)
Template: `/finance/[calc]/[N]-year/`
- Mortgage: 10/15/20/25/30/40-year variants
- Loan: 1/3/5/7/10-year variants
- Compound interest: 5/10/20/30/40-year scenarios

Differentiation per page: pre-filled defaults, comparison to other terms, worked example with interest savings/cost.

### 2B: Indian state-specific tax calculators (16 pages)
Template: `/finance/income-tax-calculator-india/[state]/`
- One per major state (Maharashtra, Karnataka, Tamil Nadu, Gujarat, Delhi, Uttar Pradesh, West Bengal, Telangana, Andhra Pradesh, Rajasthan, Kerala, Punjab, Madhya Pradesh, Haryana, Bihar, Odisha)

Differentiation: state-specific professional tax (PT) slabs, cost-of-living examples, common deductions.

### 2C: International student insurance — Indian outbound (12 pages)
Template: `/health/student-insurance/indian-students-in-[country]/`
- Indian students in: USA, UK, Canada, Australia, Germany, Ireland, Singapore, France, Netherlands, New Zealand, Italy, Spain

Differentiation: country-specific health insurance mandates (NHS surcharge for UK, OSHC for Australia, mandatory student plans in Germany), embassy requirements, typical premium ranges, INR vs local-currency comparison.

### 2D: GLP-1 / fitness "high protein under X calories" (10 pages)
Template: `/health/recipes/[X]-protein-under-[Y]-calories/`
- 30g/35g/40g protein × under 300/400/500 calories scenarios

Differentiation: meal examples, macro breakdown, why-it-fits-GLP-1 angle (no Ozempic trademark exposure).

### 2E: Currency converter long-tail (live data — Phase 2 stretch goal)
Template: `/conversions/currency/[from]-to-[to]/`
- 30 major currencies × 30 = 900 potential pages
- Start with top 20 pairs (USD-INR, USD-EUR, USD-GBP, EUR-GBP, etc.)

Differentiation per page: live rate (Cloudflare Worker proxy to exchangerate-api.com), 30-day chart (SVG), historical low/high, common amount table (₹100, ₹1000, ₹10000 → ?), inflation note.

**Total Phase 2: ~66 pages**

---

## Phase 3 (4-6 weeks out — target +120 pages)

### 3A: Indian state × tax regime matrix (32 pages)
- 16 states × 2 regimes (old / new) = 32 pages
- Each shows breakeven point where old beats new for that state's typical income

### 3B: Mortgage refinance scenarios (24 pages)
- "Mortgage refinance at [N]%" — N = 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5%
- × 3 break-even scenarios = 24 pages

### 3C: Loan calculator by purpose (24 pages)
- Personal / Car / Education / Wedding / Medical / Home Improvement / Travel / Business × 3 typical-amount tiers

### 3D: City-level cost-of-living (40 pages)
- 40 major Indian cities — rent, groceries, transport, utilities, total
- Cross-link to salary calculator: "Is ₹X enough in [city]?"

**Total Phase 3: ~120 pages**

---

## Phase 4 (3 months out — target +60 pages)

### 4A: Comparison calculators (24 pages)
- 15-year vs 30-year mortgage by country (6 countries × 4 amount tiers)
- SIP vs lump-sum investment scenarios
- Old vs new tax regime comparison

### 4B: Calculator how-to glossary (20 pages)
- What is EMI / APR / amortization / compound interest / TDEE / BMI / etc.
- Each pairs with the relevant calculator on-page (engagement signal)

### 4C: Use-case landing pages (16 pages)
- "First-time home buyer mortgage calculator [country]"
- "Mortgage calculator with PMI"
- "Retirement EMI calculator"
- Etc.

**Total Phase 4: ~60 pages**

---

## Phase 5 (6 months out — target +200 pages)

Programmatic explosion via Indian state pSEO grid:
- `[Bank] home loan EMI in [State] [Year]` = 6 banks × 16 states × 1 year = 96 pages
- `[State] property tax calculator` = 16 pages
- `[State] stamp duty calculator` = 16 pages
- Various interest-rate scenarios

**Total Phase 5: ~200 pages**

---

## Cumulative roadmap

| Phase | New pages | Total live | Timeline |
|---|---|---|---|
| 1 (DONE) | 14 | 29 | 2026-05-13 ✅ |
| 2 | 66 | 95 | +6 weeks |
| 3 | 120 | 215 | +3 months |
| 4 | 60 | 275 | +5 months |
| 5 | 200 | 475 | +9 months |

At ~$0.30 RPM (calculator-niche average) and 80% of pages reaching 200 visits/month within 18 months of publishing:
- Phase 1 baseline: 95k visits/mo × $0.30 = ~$28k/mo
- Phase 5 mature: 475k visits/mo × $0.30 = ~$140k/mo

---

## Implementation patterns

### 1. Dynamic Astro routes
```ts
// src/pages/finance/mortgage-calculator/[country].astro
export async function getStaticPaths() {
  return mortgageLocales.map((locale) => ({
    params: { country: locale.slug },
    props: { locale },
  }));
}
```

Build time: each page is a static HTML file — Cloudflare Pages serves them from the edge with no runtime cost.

### 2. Data files as single source of truth
- `src/data/mortgage-locales.ts` — country data
- `src/data/emi-banks.ts` — bank data
- `src/data/calculators.ts` — top-level catalog

Adding a new variant: append entry to data file → page builds automatically on next deploy. **Total cost per new page: ~5 minutes of unique research + content.**

### 3. Internal linking architecture
- Parent calculator pages list ALL variants (cross-link hub)
- Each variant links to 4-5 sibling variants
- Breadcrumbs link back up to parent
- Result: **zero orphan pages**, mesh connectivity

### 4. Schema markup (auto-generated)
- Each variant page emits `WebApplication` + `FAQPage` + `BreadcrumbList`
- Schemas are produced from the same data file (no manual duplication)

---

## Anti-thin-content checklist (per page)

- ✅ Unique title (locale/bank prefix)
- ✅ Unique meta description (computed real numbers per page)
- ✅ Unique H1
- ✅ Unique "quick answer" with computed locale-specific numbers
- ✅ ≥300 words of unique market/regulatory context per page
- ✅ Locale-specific worked example with real numbers
- ✅ 3 unique FAQs per page (no copy-paste)
- ✅ Unique internal links (4 siblings + parent)
- ✅ Same calculator widget (functionality), but different defaults per locale

---

## What we are NOT doing (deliberately)

- ❌ Pure city-name swap pages ("Mortgage Calculator in [City]" — no extra value)
- ❌ Auto-generated content with no human review
- ❌ Spinning content from competitors
- ❌ Pages with no real search demand (validated each pattern against Google's autocomplete + Reddit traffic)
- ❌ Doorway pages (each page is a fully working calculator + content)

---

## Maintenance

### Quarterly review
- Update rate ranges (interest rates change quarterly)
- Refresh "as of [date]" stamps
- Track GSC for queries we're ranking on but page doesn't directly answer → add to FAQ

### Annual review
- Tax slab updates (India, USA tax brackets change yearly)
- Add new variants as new search patterns emerge in GSC
- Prune any pages with <50 visits over 12 months (consolidate or 301)

---

## How to add a new variant (3-step recipe)

### Add a new country (e.g., Spain)
1. Open `src/data/mortgage-locales.ts`
2. Append an entry with slug, country name, currency, typical rate, typical amount, market context, tax/regulatory note, 3 FAQs, worked example
3. `npm run build && wrangler pages deploy dist --project-name=calctube`

Done. New page lives at `/finance/mortgage-calculator/spain/`, auto-linked from parent + sitemap.

### Add a new bank (e.g., IndusInd)
1. Open `src/data/emi-banks.ts`
2. Append entry with bank name, slug, rate ranges, processing fee, prepayment policy, market context, unique angle, product highlights, 3 FAQs
3. Build + deploy

### Add a new template (e.g., refinance calculator by country)
1. Create `src/data/refinance-locales.ts` (or extend existing)
2. Create `src/pages/finance/refinance-calculator/[country].astro` with `getStaticPaths()`
3. Reuse existing components (`MortgageCalculator.tsx` or build a refinance-specific one)
4. Link from main refinance page

---

## Metrics to track (post-launch)

### Google Search Console (weekly)
- Indexation rate of new pSEO pages (target: 100% within 30 days)
- First impressions appearing within 2-4 weeks
- Average position trajectory for target keywords

### Cloudflare Web Analytics (daily)
- New pSEO page traffic split: which countries / banks rank fastest
- Compare to parent calculator traffic (cannibalization check)

### Manual SERP check (monthly)
- Search "[calc] [country]" in incognito for each variant
- Note position and which competitors appear

---

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| Google flags thin variants | Strict content-uniqueness rule: ≥300 unique words per page; never deploy a variant without it |
| Rate data becomes stale | Quarterly review calendar; "Last updated" stamp visible on page |
| Cannibalization with parent | Parent targets head term; variants target [parent] + [modifier]; canonicals point at self |
| Bank trademark issues | All bank pages use bank's public name only; no logos used; clearly editorial content (no impersonation) |
| Indian regulatory changes | Tax/regulatory notes link to source (Income Tax Act sections), not "current as of" claims |

---

## Glossary of patterns to add next

Future programmatic patterns to consider, ordered by ROI:

1. `[N]-year mortgage calculator` (terms 5-40)
2. `[Bank] home loan EMI [State]` (bank × state grid)
3. `Currency [A] to [B]` (currency conversion long-tail)
4. `[Calc] for [audience]` (first-time buyer, retiree, etc.)
5. `What is [term]` (glossary playbook)
6. `[Calc] vs [Calc]` (comparison playbook)
7. `Best [calc] for [use-case]` (curation playbook)
8. `[Service] calculator [city]` (locations × calc grid, lower priority)

---

## Files in this implementation

```
src/
├── data/
│   ├── mortgage-locales.ts    ← 8 country configs
│   └── emi-banks.ts            ← 6 bank configs
└── pages/finance/
    ├── mortgage-calculator.astro                ← Parent with variant grid
    ├── mortgage-calculator/[country].astro      ← Dynamic country variants
    ├── emi-calculator.astro                     ← Parent with variant grid
    └── emi-calculator/[bank].astro              ← Dynamic bank variants
```

Total LOC added in Phase 1: **~2,200 lines** (data + templates). Zero duplication, maximum reuse.
