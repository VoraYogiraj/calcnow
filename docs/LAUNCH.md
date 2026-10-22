# FreeCalculations — Launch & Operations Guide

Brand: FreeCalculations. Domain: https://freecalculations.online (not yet owned — purchase and attach before switching). Current live URL: https://calctube.pages.dev. Internal Pages project name remains `calctube`.

---

## 1. Live URL

| What | Value |
|---|---|
| **Production URL** | https://calctube.pages.dev (switch to https://freecalculations.online after domain purchase) |
| Cloudflare Pages project | `calctube` |
| Cloudflare account ID | `da54206dc32518a54017e389d384e2ed` |
| Repo | https://github.com/VoraYogiraj/calcnow.git (branch `main`) |
| Build output | `dist/` (Astro static output) |
| Pages count | ~1,676 static pages |

The site is a fully static Astro build. No server, no database, no paid service.

---

## 2. Single config value: SITE_URL

`SITE_URL` is set in two places and must stay identical:

- `astro.config.mjs` → `site:` (canonical, sitemap, OG)
- `src/lib/seo.ts` → `SITE.url` (JSON-LD, meta tags)

Keep as `https://calctube.pages.dev` until the custom domain is live. Once `https://freecalculations.online` responds with HTTP 200 and has a valid TLS certificate in the `calctube` Pages project, switch both to `https://freecalculations.online`, rebuild, and redeploy.

---

## 3. How to deploy

```bash
npm ci && npm test && npm run build
npx wrangler pages deploy dist --project-name calctube --branch main --commit-dirty=true
```

---

## 4. Steps to finish once you own freecalculations.online

1. Confirm `freecalculations.online` zone is in your Cloudflare account.
2. Attach domain to the `calctube` Pages project (Workers & Pages → Custom domains → Set up custom domain).
3. Wait for Active status and valid certificate.
4. Update `astro.config.mjs` `site:` → `https://freecalculations.online`.
5. Update `src/lib/seo.ts` `SITE.url` → `https://freecalculations.online`.
6. Update `public/robots.txt` Sitemap line to `https://freecalculations.online/sitemap-index.xml`.
7. Rebuild: `npm run build`.
8. Redeploy via wrangler (or push to `main` for CI deploy).
9. Add a Pages redirect/transform: 301 redirect `calctube.pages.dev` → `https://freecalculations.online` preserving path (no loop — only redirect when host is pages.dev).
10. Submit sitemap to Google Search Console and Bing Webmaster Tools using the new domain.
11. Fix IndexNow by ensuring the key file is served at `SITE_URL/<key>.txt` and resubmit.

---

## 5. Submitting to Google Search Console

1. https://search.google.com/search-console → Add property → Domain or URL prefix.
2. Use `https://freecalculations.online` once live.
3. Submit `sitemap-index.xml`.
4. Request indexing for homepage + top 10 calculators.

---

## 6. Submitting to Bing Webmaster Tools

1. https://www.bing.com/webmasters → Add site.
2. Verify with meta tag or XML file.
3. Submit sitemap.
4. Enable IndexNow (key file at domain root, host matches site URL).

---

## 7. Ad approval checklist

- `public/ads.txt` contains `google.com, pub-1115172981829710, DIRECT, f08c47fec0942fa0`.
- `ADS_ENABLED = false` in `src/config/ads.ts`.
- To turn ads on after AdSense approval: set `ADS_ENABLED = true`, confirm ad slot IDs in `AD_SLOTS`, rebuild and deploy.

---

## 8. Trust pages (rewritten for new brand)

- `/about/`, `/contact/`, `/legal/privacy/`, `/legal/terms/`, `/legal/cookies/`, `/legal/disclaimer/` — all reference FreeCalculations.

---

## 9. Final verification checklist (post-deploy)

- [ ] Homepage, 5 calculators (real computed result each), search, category page load 200.
- [ ] 404 page works; sitemap.xml and sitemap-index.xml present; robots.txt correct.
- [ ] ads.txt serves with real publisher ID.
- [ ] Canonical and OG tags show `https://calctube.pages.dev`.
- [ ] JSON-LD validates (Organization, WebSite, FAQPage on home; Calculator on pages).
- [ ] Request form (`/contact/`) responds; mailto links work.
- [ ] No console errors; no leftover `Calctube` / `Calctube` brand strings in user-facing text.
- [ ] Redirect from pages.dev not needed until custom domain is live.

---

## 10. What you must do manually

- Purchase `freecalculations.online`.
- Confirm domain zone in Cloudflare account.
- Attach domain, wait for Active + TLS.
- Switch SITE_URL in the two config files.
- Add 301 redirect rule.
- Submit sitemap to GSC and Bing.
- Fix IndexNow 422 (serve key file at root, match host).
- Apply for AdSense when traffic is sufficient.
