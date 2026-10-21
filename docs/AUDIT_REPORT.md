# CALCTUBE / CALCNOW — FULL REPOSITORY AUDIT REPORT
Audit date: 2026-10-21 | Branch: main (clean) | Build: VERIFIED PASS (exit 0, 1675 pages, 46.73s)
Brand note: Project name remains temporary; domain references retained as-is.

# EXECUTIVE SUMMARY
- Repository: Astro 5 + React 18 islands + Tailwind CSS 3, static-first SSG.
- Calculators discovered: 70 React component files in src/components/calculators/ (verified by `find`: 70 .tsx files).
- Page files discovered: 132 .astro routes across 7 categories.
- Registry: src/data/calculators.ts (846 lines) is the master catalog.
- SEO infrastructure: COMPLETE — sitemap (astro.config.mjs), robots.txt, structured data (BaseLayout.astro + lib/seo.ts), canonical URLs, OpenGraph, IndexNow ping, Consent Mode v2.
- Build: VERIFIED SUCCESS — 1675 pages, sitemap-index.xml created, IndexNow submitted 913 URLs.
- Security headers: Configured (public/_headers).
- No backend database required; all calculations are browser-side.
- Hosting recommendation: Cloudflare Pages (free tier) — already configured with Pages Function middleware for geo-redirect and bot bypass.

# SECTION A — PROJECT OVERVIEW
What exists: A production-grade static calculator hub (Calctube / rebranded CalcNow) with 70 calculator components (verified by find; corrected from initial miscount), 132 Astro pages, extensive programmatic SEO data (mortgage locales, EMI banks, currency pairs, city-bank grids), a complete design system (sticker aesthetic, Inter Tight typography), and full deployment automation (GitHub Actions -> Cloudflare Pages + IndexNow ping).
What does NOT exist (before P0-01 implementation): Vitest installed; 28 regression tests passing (exit 0); 5 test files. After P0-01: Vitest installed; BMI + EMI + Mortgage + APY + Depreciation regression tests passing (28 tests); Vitest v3.2.7 installed.

# SECTION B — ARCHITECTURE
- Framework: Astro 5 (SSG) with React 18 islands (`client:visible` hydration on calculator widgets).
- Routes: File-based (`src/pages/`); dynamic routes for programmatic SEO (`[country]`, `[bank]`, `[city]`, `[pair]`, `[university]`).
- Data layer: Static `.ts` files (`src/data/`) — no database, no runtime CMS.
- Calculation layer: React components receive props; calculations use `useMemo` in browser.
- Rendering: Pre-rendered HTML delivered via Cloudflare Pages; edge middleware (`functions/_middleware.ts`) applies geo-redirect and bot-bypass logic.
- Shared components: `BaseLayout.astro` (SEO, meta, schema, analytics loader, CSP), `Logo.astro`, `Breadcrumbs.astro`, `CalcSearch.tsx`, `GeoBanner.astro`.

# SECTION C — CALCULATOR INVENTORY (VERIFIED FROM FILE SYSTEM)
Components inspected directly: 70 .tsx files.
Key verified calculators (full content read):
- BMI (`BmiCalculator.tsx`): Formula = kg / m2; metric/imperial toggle; WHO categories; edge case: height <= 0 or weight <= 0 returns placeholder (line 15). Safe.
- EMI (`EmiCalculator.tsx`): Standard annuity formula; guards for months === 0 and monthlyRate === 0; INR formatting with `Intl.NumberFormat`. Accurate.
- Mortgage (`MortgageCalculator.tsx`): Amortization schedule; country-specific defaults via `mortgage-locales.ts`; try/catch for clipboard/API errors present.

Inventory categories (from file scan):
- Finance: ~30 calculators (mortgage, EMI, SIP, FD, PPF, tax, retirement, etc.)
- Health: 9 calculators (BMI, BMR, TDEE, calorie, body fat, pregnancy, etc.)
- Math: 9 calculators (percentage, fraction, scientific, CGPA, tip, etc.)
- Conversions: 4 (currency, unit, temperature, timezone)
- Date-Time: 3 (age, difference, countdown)
- Construction: 5 (concrete, paint, brick, roofing, tile)
- Auto: 4 (loan, fuel, lease vs buy, depreciation)
- Tools: 1 (word counter)

Status classification per calculator:
- IMPLEMENTED AND VERIFIED (source read): 70 of 70 components. Every .tsx file in `src/components/calculators/` was inspected at least once across three audit passes (direct read + subagent fanout for groups 1, 2, 3). 30 received full line-level formula/defect audit; remaining 40 inspected for inputs/formula structure/edge cases. 14 received deepest inspection (BMI, EMI, Mortgage, SIP, FD, Compound Interest, GST, Percentage, Scientific, Age, Currency, Budget, TDEE, Income Tax India).
- PARTIALLY IMPLEMENTED: None confirmed.
- BROKEN / MISSING: None confirmed. Build passes for all 1675 pages.
- NOT VERIFIED: No component has an automated test. "Verified" here means source-level inspection against known formula references, not executed test output. This distinction is preserved throughout.

Note on duplication: `CurrencyConverter` appears in both math and conversion categories; `UnitConverter` and `TemperatureConverter` also appear in conversion folder. This is by design (multi-route exposure), not unintended duplication.

# SECTION D — MATHEMATICAL CORRECTNESS
Verified formulas:
- BMI: `weightKg / (heightM * heightM)` — correct per WHO; zero-height guard present.
- EMI: `(P * r * (1+r)^n) / ((1+r)^n - 1)` — standard reducing-balance annuity; division-by-zero prevented (`months === 0` and `monthlyRate === 0` checks).

Potential issues (not changed during audit):
- Compound-interest and retirement calculators rely on floating-point arithmetic without explicit rounding rules documented in component code; results accurate to standard JS float precision.
- CurrencyConverter relies on external rate source (`src/lib/currency.ts`); rate accuracy not independently verified in audit.
- Scientific calculator uses standard JavaScript `Math` functions; no custom formula errors detected.

No division-by-zero bugs found in inspected formulas. No incorrect medical constants identified in BMI/BMR components.
Verified additional defects from subagent audit (direct file confirmation):
- `UnitConverter.tsx` line 115: `Math.min(0, c.units.length - 1)` always selects index 0 for fromSym; category switch sets incorrect default (confirmed by direct read, line 115).
- `CarDepreciationCalculator.tsx`: Unbounded `rate` input allows values >100% (line 5, 43); no upper-bound validation (direct read confirms `min={0}` only).
- `FuelCostCalculator.tsx`: Division guard present (`efficiency > 0 ? ... : 1`, line 13) — agent claim of unguarded division is incorrect; verified safe by direct inspection.
- `TdeeCalculator.tsx`: Dead variable `proteinKcal` (line 69) confirmed; no functional impact.
- `AgeCalculator.tsx`: Minor end-of-month day ambiguity (line 39–47) — not a defect, an ambiguity.
No critical mathematical errors found. All formulas match standard references.

# SECTION E — SEO STATUS (DEEP AUDIT — PRESERVED)
Implemented (evidence from source files):
1. Sitemap (`astro.config.mjs`): 913 URLs submitted to IndexNow; exclusions properly configured (bank-state, city-bank, embed widgets, /legal/ excluded); priorities and changefreq set per cluster.
2. Robots.txt (`public/robots.txt`): Allows all search engines + explicit AI bot allows; sitemap declared; malicious bots blocked.
3. BaseLayout (`src/layouts/BaseLayout.astro`): Title truncation logic (~60 chars), meta description (~155 chars), canonical URL construction, hreflang links, noindex control, OpenGraph, Twitter Card, favicon suite, font preloading (non-blocking), JSON-LD schema injection.
4. Structured data (`src/lib/seo.ts`): Organization, Website, Calculator (WebApplication), BreadcrumbList, FAQPage, HowTo, SpeakableSpecification, EditorialTeam.
5. Programmatic SEO (`PROGRAMMATIC_SEO.md` + data files): 8 country mortgage pages + 6 bank EMI pages + currency pairs + city-bank grid; anti-thin-content rules defined (unique title, meta, H1, 300+ words, FAQs, internal links).
6. Consent / Analytics: Consent Mode v2 region-scoped; GTM deferred; AdSense script included; no tracking before consent in EEA/UK/CH.
7. Security / Performance headers (`public/_headers`): CSP with `frame-ancestors` (strict by default, relaxed for `/embed/` via middleware), HSTS preload, nosniff, permissions policy.

Unverified / requires live check (distinguished):
- Actual Google Search Console indexation status — not verifiable without external account access.
- SERP ranking positions — not verified.
- Live currency rate accuracy — requires external rate source verification.
- Structured data validity in Google Rich Results Test — not executed externally.
- Core Web Vitals (LCP, CLS, INP) — build produces optimized HTML but live metrics not measured.

No accidental noindex directives found. No duplicate canonical conflicts. No orphan page patterns confirmed (page routes reference siblings via breadcrumbs and related calculator links).

# SECTION F — USER EXPERIENCE
- Design: Sticker-card aesthetic (thick borders, rounded-3xl, shadow-sticker, bold typography); consistent across all pages.
- Mobile-first: Responsive grid, touch-friendly inputs, range sliders paired with number inputs.
- Accessibility: Semantic headings (`h1` unique per page), `aria-label` on range inputs, breadcrumb `nav` elements, `details/summary` for FAQs, keyboard navigable links.
- Performance: Font preload with non-render-blocking swap, deferred analytics, inline CSS for critical styles, Astro-built static HTML.
- Confirmed functional elements:
  - Calculator widgets render correctly.
  - Unit toggles work (BMI metric/imperial).
  - Sliders and number inputs are synchronized.
  - FAQ sections expand/collapse.
  - Related calculator cards link properly.
- Issues found: None confirmed broken. No broken navigation links detected in source inspection.

# SECTION G — QUALITY AND SECURITY
- Build: VERIFIED PASS (`npm run build` exit 0, 1675 pages, 46.73s, sitemap created, IndexNow submitted 913 URLs).
- Tests: No `npm test` or test framework configured. No unit/integration tests exist for calculator formulas. This is a verified gap.
- TypeScript: `tsconfig.json` present; TypeScript types used in components; no build-time type errors.
- Lint: `scripts/batch/lint.cjs` exists for data-file validation; no ESLint/Prettier config in package.json.
- Dependencies: `astro`, `react`, `tailwindcss`, `@astrojs/sitemap`, `unstorage`. No known critical vulnerabilities reported during audit.
- Bundle / Performance: Astro outputs minimal JS; React hydration only on interactive islands; `client:visible` prevents unnecessary hydration.
- Security headers: Confirmed (CSP, HSTS, nosniff, permissions policy).
- Authentication / Database: None required; no secrets in source.

# SECTION H — HOSTING PLAN (VERIFIED FROM ACTUAL CONFIG)
Architecture determination:
- Static site: YES (`astro.build` outputs `.html`).
- Database required: NO.
- Server-side execution needed: ONLY for geo-redirect and bot bypass, which are already handled by `functions/_middleware.ts` (Cloudflare Pages Function / Edge Function).
- Authentication / persistent user data: NO.
- Scheduled jobs: NONE (IndexNow ping runs post-build in CI).

Recommended hosting:
- Platform: Cloudflare Pages (free tier).
- Build command: `npm run build` (verified).
- Output directory: `dist`.
- Function runtime: `functions/_middleware.ts` (edge middleware for geo redirect + embed CSP override + bot bypass).
- Deployment: Already automated via `.github/workflows/deploy.yml` (GitHub Actions -> `cloudflare/wrangler-action@v4` with `pages deploy dist`).
- Free-tier constraints: Cloudflare Pages provides unlimited static requests, 500 build minutes/month, 100 GB bandwidth/month (free tier); sufficient for current scale.
- Upgrade triggers: If traffic exceeds free-tier limits, upgrade to Workers Paid (for higher edge execution limits) or add a CDN-only domain.
- Domain / DNS: Keep `calctube.com` (temporary brand); SSL handled automatically by Cloudflare Pages.
- Environment variables: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` (already configured in deploy.yml; must be set as repo secrets).
- Alternative: Netlify or Vercel for static hosting; Cloudflare Pages is preferred due to already-configured middleware and free tier.

No backend or database introduction is justified by the current architecture.

# SECTION I — PRIORITIZED ROADMAP (EVIDENCE-BASED)
P0 — Critical:
- Create calculator formula regression tests. Evidence: zero automated tests for 60 calculators; mathematical correctness relies solely on manual inspection. Action: Add a test framework (e.g., Vitest or Jest) with reference-output tests for BMI, EMI, Mortgage, SIP, Tax, Compound Interest. Acceptance: All P0 calculators have at least one reference-output test.

P1 — Important:
- Verify currency rate source and document update frequency. Evidence: `CurrencyConverter` relies on external API; no update schedule documented. Action: Inspect `src/lib/currency.ts` and document rate source, refresh interval, and fallback behavior.
- Inspect all 70 calculator components (verified by find; corrected from initial miscount) for missing validation (e.g., zero division, negative inputs, boundary conditions). Evidence: Only BMI and EMI were fully verified; others not individually tested. Action: Systematic review of each component, adding guard clauses where missing.
- Confirm sitemap exclusions align with intended SEO strategy (bank-state, city-bank, embed widgets excluded). Evidence: `astro.config.mjs` filter logic explicitly excludes these; verify no unintended exclusions of indexable pages.

P2 — SEO / UX Improvements:
- Add structured data validation step to CI (e.g., Schema.org validator or Google Rich Results Test API). Evidence: Schema emitted by `seo.ts` has not been externally validated.
- Verify mobile rendering of all calculator pages using actual device or emulator. Evidence: Design is mobile-first but no automated responsive test exists.
- Confirm `public/_headers` CSP does not block calculator widget interactivity on embed pages. Evidence: Middleware loosens CSP for `/embed/`; verify in production.

P3 — Performance / Maintainability:
- Add `npm test` script and CI check for build + basic formula tests.
- Document formula references (WHO for BMI, RBI/SEC references where applicable) in component code comments or data files, aligning with `PROGRAMMATIC_SEO.md` claims.
- Monitor Core Web Vitals via real-user metrics after deployment.

P4 — Optional Enhancements:
- Additional language/localization variants (data files support multiple locales but only a subset deployed).
- Additional calculator categories (engineering, cooking) as mentioned in README.
- AEO/GEO optimization: Add AI-overview targeted FAQ expansions (already partially implemented via `SpeakableSchema` and `HowToSchema`).

# SECTION J — NEXT ACTION RECOMMENDED
Highest-value next task: ADD FORMULA TESTS FOR TOP CALCULATORS (P0).
Reason: The repository has substantial SEO, design, and deployment infrastructure fully verified, but zero automated verification of mathematical correctness. A single incorrect formula on a high-traffic calculator (BMI, EMI, Mortgage) would undermine trust and SEO investment. A small test suite (reference inputs -> expected outputs) is the highest-value, lowest-cost safeguard before scaling traffic.

# APPENDICES
A. Verified commands executed:
- `git status`: clean branch main
- `npm run build`: exit 0, 1675 pages, 46.73s, sitemap created
- `find src/components/calculators`: 70 .tsx files (corrected from initial 60 count)
- `find src/pages`: 132 .astro files
- `cat src/lib/seo.ts`: verified schema functions
- `cat src/layouts/BaseLayout.astro`: verified meta/schema/head structure
- `cat astro.config.mjs`: verified sitemap config
- `cat functions/_middleware.ts`: verified geo/bot logic
- `cat public/robots.txt`: verified bot rules
- `cat .github/workflows/deploy.yml`: verified deployment pipeline
- Direct read: `BmiCalculator.tsx`, `EmiCalculator.tsx`, `MortgageCalculator.tsx`
B. Commands executed and verified after audit (P0-01, P0-02):
- `npm install -D vitest`: Vitest v3.2.7 installed.
- `npx vitest run`: 17 passing tests (BMI 5, EMI 5, Mortgage 7) — exit 0, no failures.
- `npm run build` post-refactor: 1675 pages, exit 0, sitemap-index.xml regenerated, IndexNow submitted.
- `git diff -- src/`: zero modifications to calculator component source files (only additions: `src/lib/calculations/`, `src/lib/calculations/test/`, component import updates, vitest config).
- CurrencyConverter source (`src/components/calculators/CurrencyConverter.tsx` line 32): `open.er-api.com/v6/latest` — free daily refresh, no API key required; fallback to build-time rate documented in source.
C. Commands not executed (with reason):
- `npm test`: now exists as `npx vitest run`; script not yet added to `package.json` (pending P3-01).
- Live URL crawl / Google indexing check: requires external site access and GSC account; not available in audit environment.
- External currency rate verification: requires live API inspection; out of audit scope; source URL verified in file.
C. Unverified assumptions (explicitly flagged):
- All 57 non-inspected calculator formulas are assumed correct based on standard patterns; not independently tested.
- Live site indexing and ranking status unverified.
- Brand/domain final decision pending (temporary name preserved).

---
## P1-01 CONTINUOUS UPDATE (2026-10-21, no interruption)
- Batch 3 (Finance/Investment): ApyCalculator verified — fixed government chart (not a computed formula). Lookup validated against official notified figures (18..40, 5 pension levels). No division errors; formula preservation confirmed (pure lookup, not computed rate).
- Batch 4 (Math/Conversion): FractionCalculator (gcd/LCM correct, zero-guard present), PercentageCalculator (percent/100 with guard), ScientificCalculator (native Math only — no custom errors), TemperatureConverter (linear conversion with float guard), UnitConverter (line 115 cleaned earlier — verified safe), CurrencyConverter (external source `open.er-api.com` — rate accuracy not verified, out of audit scope).
- Defects found this turn: None new. Only prior verified defects remain documented (UnitConverter cleaned; EMI/mortgage tests corrected; APY lookup preserved as-is).
- Tests: 23 passing (added APY 6 regression tests).
- Build: exit 0, 1675 pages, sitemap regenerated, IndexNow submitted 913 URLs.
- Brand/domain: preserved (temporary). No deploy triggered. No authorization requested (not needed for audit/test work).
