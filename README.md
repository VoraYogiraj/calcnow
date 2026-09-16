# Calctube — Free Online Calculators

> **100+ free, fast, accurate calculators.** Mortgage, BMI, EMI, SIP, currency, tax, percentage, and more. No signup. Mobile-first. Free forever.

🔗 **Live site:** [calctube.com](https://calctube.com)

[![Built with Astro](https://img.shields.io/badge/Built_with-Astro_5-FF5D01?style=flat-square&logo=astro&logoColor=white)](https://astro.build)
[![React 18](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Cloudflare Pages](https://img.shields.io/badge/Hosted_on-Cloudflare_Pages-F38020?style=flat-square&logo=cloudflare&logoColor=white)](https://pages.cloudflare.com)
[![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

---

## What is Calctube?

A static-rendered hub of **1,400+ calculator pages** covering personal finance, health, math, conversions, and date/time. Built to be the fastest, cleanest, ad-light alternative to the SEO-heavy calculator sites that dominate Google results today.

- 🚀 **Static-first** — Every calculator is pre-rendered HTML; React only hydrates on interaction
- 🌍 **Geo-aware** — Auto-detects country and shows local currency + locale-specific calculators (mortgage with PMI for US, EMI for India, etc.)
- 🔍 **AEO-ready** — Optimized for AI search engines (GPTBot, PerplexityBot, ClaudeBot all allowed); rich FAQ schema on every page
- 📱 **Mobile-first** — Sticker-aesthetic design, optimized Core Web Vitals
- 🛡️ **Privacy-respecting** — Google Consent Mode v2 default-deny, GPC honored, certified CMP

---

## Calculator catalog

| Category | Highlights |
|---|---|
| 💰 **Finance** | Mortgage (with PMI/HOA/extra payments), EMI, SIP, FD, RD, PPF, GST, HRA, Compound Interest, Retirement, Inflation, Net Worth, Loan |
| 🏥 **Health** | BMI, BMR (Mifflin-St Jeor), TDEE, Calorie Deficit |
| 🔢 **Math** | Percentage, Fraction, Tip, Discount, Scientific |
| 🔄 **Conversions** | 50+ currency pairs (live rates), unit conversions |
| 📅 **Date & Time** | Age, Date Difference |
| 🏗️ **Construction** | Concrete, Paint |

**Programmatic SEO**: localized mortgage calculators for 150+ countries, bank-specific EMI calculators for 30+ Indian banks across 28 states.

Browse the full catalog → [calctube.com](https://calctube.com)

---

## Tech stack

- **Framework**: [Astro 5](https://astro.build) (SSG) with React 18 islands (`client:visible` hydration)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com) — sticker-card aesthetic with Inter Tight headings
- **Hosting**: [Cloudflare Pages](https://pages.cloudflare.com) (free tier) + Pages Functions for geo-redirect
- **Schema**: WebApplication + Calculator + Article + FAQ + Breadcrumb + Person (E-E-A-T author profiles)
- **CMP**: Google Funding Choices (IAB TCF compliant) for EU/UK/Swiss visitors
- **Analytics**: GTM + GA4 with Consent Mode v2 default-deny
- **Search submission**: Auto-pings IndexNow (Bing/Yandex/Seznam) on every deploy

---

## Project structure

```
calctube/
├── public/                      # Static assets (favicon, OG image, ads.txt, robots.txt)
├── functions/_middleware.ts     # Cloudflare Pages Function (geo-redirect + bot bypass)
├── src/
│   ├── components/
│   │   ├── calculators/         # 25+ React calculators (BMI, EMI, Mortgage, SIP, etc.)
│   │   └── ui/                  # Shared UI primitives
│   ├── data/
│   │   ├── authors.ts           # E-E-A-T author profiles for YMYL pages
│   │   └── *.ts                 # Programmatic data (bank-state grid, cities, currency pairs)
│   ├── layouts/BaseLayout.astro # SEO + JSON-LD + Consent Mode v2 + AdSense
│   ├── lib/
│   │   ├── seo.ts               # Schema builders (Calculator, FAQ, Breadcrumb, Person)
│   │   └── currency.ts          # Currency detection + formatting
│   ├── pages/                   # 1,400+ pre-rendered pages (file-based routing)
│   └── styles/global.css
├── scripts/
│   ├── generate-og-png.js       # SVG → PNG via @resvg/resvg-js
│   └── ping-indexnow.js         # Auto-submit sitemap to IndexNow on every build
├── astro.config.mjs             # Sitemap priority differentiation + integrations
└── package.json
```

---

## Local development

```bash
# Prerequisites: Node.js 20+
git clone https://github.com/Kabir5850/calctube.git
cd calctube
npm install
npm run dev          # http://localhost:4321
```

Build for production:

```bash
npm run build        # outputs to ./dist (1,400+ HTML files)
npm run preview      # serve dist locally
```

---

## Deployment

Pushes to `main` automatically deploy to Cloudflare Pages via GitHub Actions.

Required secrets in repo settings:
- `CLOUDFLARE_API_TOKEN` (with `Pages: Edit` permission)
- `CLOUDFLARE_ACCOUNT_ID`

After every successful build, `scripts/ping-indexnow.js` submits all URLs from the sitemap to IndexNow (Bing + Yandex). Google Search Console picks up the sitemap automatically via DNS-verified domain property.

---

## Why static + programmatic?

The dominant calculator sites (Calculator.net, RapidTables) are heavy WordPress builds with ads stacked on top of every input. Calctube's hypothesis: a static-first site with proper schema, fast Core Web Vitals, and respect for user attention will rank better — and feel better to use.

Numbers as of launch:
- **1,493 pages** built
- **Sub-1s LCP** on most pages (Cloudflare edge cache + minimal hydration)
- **8 free calculators** that the competitors lock behind newsletter signups
- **0 invasive ads in the calculator widget itself** — ads only render on opt-in, never inside the math UI

---

## Contributing

Found a calculator with a wrong formula or a typo? PRs welcome — especially:
- New calculators in underserved niches (cooking conversions, statistics, engineering)
- Localized versions of existing calculators (currency-aware variants)
- Schema improvements for AI search (AEO/GEO)

Open an issue first for anything bigger than a typo so we can align on approach.

---

## License

MIT. Copy, fork, learn from it. Attribution appreciated but not required.

---

## Acknowledgements

Author profiles (Aisha Rahman CFA, Priya Nair RD, Calctube Editorial) are illustrative pseudonymous reviewers used to maintain consistent voice and review standards on YMYL (Your Money, Your Life) pages. All formulas are sourced from authoritative references (BLS, IRS, Mifflin-St Jeor 1990, SEC, etc.) and cited on each calculator page.

Built with [Claude Code](https://claude.com/claude-code) as a coding partner.
