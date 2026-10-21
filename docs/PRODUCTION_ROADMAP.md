# CALCTUBE — PRODUCTION ROADMAP
Based on evidence from full repository audit (2026-10-21). No code modified during audit.
Brand: Temporary (CalcTube / CalcNow); domain kept as-is.

# P0 — CRITICAL (DO BEFORE SCALING)
## P0-01: Add formula regression tests for top calculators
Evidence: Zero automated tests exist; build passes but correctness unverified programmatically.
Files: `src/components/calculators/` (60 .tsx files); create `tests/` directory.
Approach: Use Vitest or Jest; create reference-output fixtures for BMI, EMI, Mortgage, SIP, Tax.
Acceptance: P0 calculators have at least one reference-output test; CI runs `npm test`.
Dependencies: None.

## P0-02: Verify currency rate source and document refresh schedule
Evidence: `CurrencyConverter` relies on external source (`src/lib/currency.ts`); no schedule documented.
Files: `src/lib/currency.ts`, `src/components/calculators/CurrencyConverter.tsx`.
Approach: Inspect source; add inline documentation; create data-file note.
Acceptance: Source URL, refresh interval, and fallback behavior documented.
Dependencies: None.

# P1 — IMPORTANT (FUNCTIONALITY / SEO / QUALITY)
## P1-01: Systematic validation review of all 60 calculators
Evidence: Only BMI and EMI fully verified; remaining 57 not individually tested for division-by-zero, negative inputs, boundary conditions.
Files: All `src/components/calculators/*.tsx`.
Approach: Read each component; add guard clauses for zero/negative where missing; document formula reference.
Acceptance: Each component includes input validation and documented formula reference.
Dependencies: P0-01 (test framework helps validate fixes).

## P1-02: Confirm sitemap exclusions match SEO intent
Evidence: `astro.config.mjs` excludes bank-state, city-bank, embed widgets, `/legal/`; verify no over-exclusion.
Files: `astro.config.mjs`.
Approach: Cross-reference exclusions against `PROGRAMMATIC_SEO.md` anti-thin-content rules.
Acceptance: Confirmed exclusions align; no unintended indexable pages excluded.
Dependencies: None.

# P2 — SEO / UX / PERFORMANCE
## P2-01: Add structured data validation to CI
Evidence: Schema emitted by `src/lib/seo.ts` (WebApplication, BreadcrumbList, FAQPage, etc.) not externally validated.
Files: `.github/workflows/deploy.yml`, `scripts/`.
Approach: Add step using Schema.org validator or Google Rich Results Test (dry-run URL check).
Acceptance: Build fails if JSON-LD syntax is invalid.
Dependencies: None.

## P2-02: Verify embed CSP and mobile rendering
Evidence: Middleware loosens CSP for `/embed/`; mobile-first design but no automated responsive test.
Files: `functions/_middleware.ts`, `public/_headers`, calculator pages.
Approach: Manual/browser verification of embed widget framing; mobile viewport test on 3 calculators.
Acceptance: Embed widgets load correctly; mobile layout intact.
Dependencies: None.

# P3 — PERFORMANCE / MAINTAINABILITY
## P3-01: Add test script and CI check
Evidence: `package.json` has no `test` script; `npm test` does not exist.
Files: `package.json`, `.github/workflows/deploy.yml`.
Approach: Add `test` script; add step to deploy workflow.
Acceptance: `npm test` runs; CI includes it.
Dependencies: P0-01.

## P3-02: Monitor Core Web Vitals (live metrics)
Evidence: Build is optimized (pre-rendered HTML, deferred analytics) but no live measurement.
Files: None (external monitoring tool, e.g., Cloudflare Web Analytics or Google PageSpeed Insights).
Approach: Set up monitoring after deployment.
Acceptance: LCP < 2.5s, CLS < 0.1 confirmed on 5 key pages.
Dependencies: Production deployment.

# P4 — OPTIONAL ENHANCEMENTS
## P4-01: Additional localization / calculator categories
Evidence: Data files support many locales; only subset deployed. README mentions new niches.
Files: `src/data/`.
Approach: Append new country/bank/term entries to data files; build generates pages automatically.
Acceptance: New pages build successfully; sitemap includes them.
Dependencies: P1-01 (validation pipeline ready).

# HOSTING ARCHITECTURE RECOMMENDATION (VERIFIED)
Platform: Cloudflare Pages (free tier) — already configured.
Build command: `npm run build` (verified exit 0, 46.73s, 1675 pages).
Output: `dist/`.
Edge function: `functions/_middleware.ts` (geo redirect, bot bypass, embed CSP override).
Deployment: `.github/workflows/deploy.yml` automates build + deploy via `wrangler-action@v4`.
Free-tier limits: 500 build minutes/mo, 100 GB bandwidth/mo — sufficient for current scale.
Upgrade triggers: Exceeding build minutes (scale > monthly deploys) or bandwidth (high traffic growth).
Alternative: Netlify or Vercel for static hosting (would require migrating middleware to edge functions or removing geo redirect).
No backend/database required.

# NEXT ACTION RECOMMENDED (SECTION J — SUMMARY)
Perform P0-01: Add formula regression tests for BMI, EMI, and Mortgage first.
Rationale: Highest-value safeguard for verified infrastructure; protects SEO investment; lowest-cost fix.

# EVIDENCE REFERENCES (FILE PATHS)
- `README.md`
- `astro.config.mjs`
- `package.json`
- `src/layouts/BaseLayout.astro`
- `src/lib/seo.ts`
- `src/components/calculators/BmiCalculator.tsx`
- `src/components/calculators/EmiCalculator.tsx`
- `src/components/calculators/MortgageCalculator.tsx`
- `public/robots.txt`
- `public/_headers`
- `functions/_middleware.ts`
- `.github/workflows/deploy.yml`
- `programmatic_seo.md` (in repo root, uppercase in filesystem)
