# CalcTube — Launch & Operations Guide

Everything you need to redeploy, attach a domain, submit to search engines, and get ads
approved. Written for the site owner, not the codebase.

---

## 1. Live URL

| What | Value |
|---|---|
| **Production URL** | https://calctube.pages.dev |
| Cloudflare Pages project | `calctube` |
| Cloudflare account ID | `da54206dc32518a54017e389d384e2ed` |
| Repo | https://github.com/VoraYogiraj/calcnow.git (branch `main`) |
| Build output | `dist/` (Astro static output) |
| Pages count | ~1,676 static pages |

The site is a fully static Astro build. There is no server, no database, and no paid
service anywhere in the stack.

---

## 2. How to deploy

### A. Automatic (recommended) — every push to `main` deploys

The GitHub Actions workflow `.github/workflows/deploy.yml` builds and deploys on every push
to `main`. It needs two repository secrets:

| Secret | Value |
|---|---|
| `CLOUDFLARE_API_TOKEN` | An API token scoped to **Cloudflare Pages: Edit** |
| `CLOUDFLARE_ACCOUNT_ID` | `da54206dc32518a54017e389d384e2ed` |

**Create the token (do this yourself, don't paste it into chat):**

1. Log in at https://dash.cloudflare.com/
2. Click your profile icon (top right) → **My Profile** → **API Tokens** tab
3. Click **Create Token**
4. Either pick the **"Edit Cloudflare Pages"** template (it already has the right scope),
   or choose **"Create Custom Token"** and set:
   - **Permissions:** Account → `Cloudflare Pages` → `Edit`
   - **Account Resources:** `Include` → `All accounts` (or just the `calctube` account)
   - **Zone Resources:** `Include` → `All zones in this account` (not strictly needed for a
     Pages deploy, but harmless and avoids surprises later)
5. Click **Continue to summary** → **Create Token**
6. Copy the token — it is shown **once only**

**Add both secrets to GitHub:**

```bash
# Account ID (safe to run as-is)
gh secret set CLOUDFLARE_ACCOUNT_ID --repo VoraYogiraj/calcnow --body 'da54206dc32518a54017e389d384e2ed'

# API token — replace the placeholder with the token you just copied
gh secret set CLOUDFLARE_API_TOKEN --repo VoraYogiraj/calcnow --body 'PASTE_YOUR_TOKEN_HERE'
```

Verify:

```bash
gh secret list --repo VoraYogiraj/calcnow
```

To confirm the pipeline works, make any commit and push, then watch:

```bash
gh run watch --repo VoraYogiraj/calcnow
```

### B. Manual (one-off deploys, or if CI is broken)

```bash
npm ci
npm test
npm run build
npx wrangler pages deploy dist --project-name calctube --branch main --commit-dirty=true
```

`wrangler` is already a devDependency, so no global install is needed. The OAuth login it
uses is already active for your account; on a fresh machine run `npx wrangler login` and
click **Allow** in the browser.

Note: `npm run build` runs a `postbuild` hook that pings IndexNow. That call currently
returns HTTP 422 (a Bing-side rejection, not a build failure) — it does not block the
build and is safe to ignore.

---

## 3. Attaching a custom domain (do this later, yourself)

You do **not** need a domain to run the site — `calctube.pages.dev` is fully functional
and indexed as-is. When you are ready for a branded domain (e.g. `calctube.com`):

### Step 1 — Decide the domain

You need a domain you actually own. Register one at Cloudflare Registrar (Cloudflare
sells at wholesale cost, no markup) or any registrar.

### Step 2 — Add it to Cloudflare

1. https://dash.cloudflare.com/ → **Websites** → **Add a site**
2. Enter your domain, pick the **Free** plan
3. Cloudflare shows you two nameservers. At your registrar, replace the domain's
   nameservers with those two. This is the only DNS step that matters — everything below
   happens in Cloudflare.

### Step 3 — Attach to the Pages project

1. https://dash.cloudflare.com/ → **Workers & Pages** → `calctube` → **Custom domains**
2. Click **Set up a custom domain**
3. Enter your domain (e.g. `calctube.com`) → **Continue**
4. Cloudflare adds a CNAME automatically (because the zone is on the same Cloudflare
   account). Nothing to configure by hand.

### Step 4 — Wait for the certificate

Cloudflare provisions TLS automatically. The domain shows **Active** in ~1–15 minutes
(occasionally longer if the domain's nameserver change has not fully propagated).

### Step 5 — Redirect `www` if you want it

**Rules** → **Redirect Rules** → **Single Redirect**:

- From: `www.calctube.com`
- To: `calctube.com`
- Status: `301 Permanent Redirect`

### Step 6 — Update the one config value and redeploy

The production URL lives in **two** places. Both must be updated or your canonicals,
sitemap, and OG tags will still point at `pages.dev`:

1. `astro.config.mjs` → `site: 'https://calctube.pages.dev'` → change to your domain
2. `src/lib/seo.ts` → `url: 'https://calctube.pages.dev'` → change to your domain
3. `public/robots.txt` → the `Sitemap:` line → change to your domain

Then:

```bash
npm run build
npx wrangler pages deploy dist --project-name calctube --branch main --commit-dirty=true
```

> To keep this to a **single** config value, replace the three hardcoded strings with an
> env var (`import.meta.env.PUBLIC_SITE_URL` in `src/lib/seo.ts`, read the same var in
> `astro.config.mjs` via `process.env.PUBLIC_SITE_URL`, and template it in
> `public/robots.txt` via a small `robots.txt.ts` route). Do this before you attach the
> domain so future URL changes are one edit.

### Step 7 — Update the email addresses

The site uses `hello@`, `bugs@`, `ideas@`, `privacy@`, `legal@`, `partners@` at
`calctube.com`. Once you own the domain, set up a real mailbox (Google Workspace,
Cloudflare Email Routing → a forwarder, or Fastmail). AdSense reviewers read the contact
page and expect it to work — a bouncing address is a common approval blocker.

---

## 4. Submitting to Google Search Console

1. Go to https://search.google.com/search-console
2. Sign in with the Google account you want to use (use a personal account, not a shared
   team one — it is simpler and ownership transfers are painless)
3. **Add a property** → **URL prefix** → enter `https://calctube.pages.dev`
   (include the scheme and trailing slash; Cloudflare Pages needs the prefix form for
   verification)
4. **Add a property** → **Domain** → enter `calctube.pages.dev` if you want subdomain
   coverage. The DNS TXT verification requires access to the zone's DNS — for
   `pages.dev` you cannot edit that DNS, so **skip the Domain property** and use the URL
   prefix instead
5. **Sitemaps** → under "Your site", enter `sitemap-index.xml` → **Submit**
   - Cloudflare Pages redirects `/sitemap.xml` → `/sitemap-index.xml` (a 301 configured in
     `public/_redirects`), because Google defaults to `/sitemap.xml` when validating
6. **URL Inspection** → paste the homepage → **Request indexing**
7. Repeat for your top 10–20 calculator URLs. Do not submit all 1,676 — there is no
   benefit and it wastes crawl budget

**Expected timeline:** 1–3 days for the first crawl, 1–3 weeks for meaningful impressions.

---

## 5. Submitting to Bing Webmaster Tools

1. Go to https://www.bing.com/webmasters
2. Sign in (a Microsoft account; the same account as IndexNow if you want the API)
3. **Add site** → `https://calctube.pages.dev`
4. Verify with the **XML file** or **meta tag** method (both work without DNS access —
   prefer these over the CNAME method for a `pages.dev` subdomain)
5. Once verified, go to **Sitemaps** → enter `https://calctube.pages.dev/sitemap-index.xml`
   → **Submit**
6. Enable **IndexNow** if you want faster indexing. The site already pings IndexNow on
   every build (`scripts/ping-indexnow.js`); you just need to supply your IndexNow key in
   that script. Bing currently returns 422 to those pings — check the key format in the
   script and the IndexNow dashboard for the exact value
7. **URL Submission** (the free API) lets you push individual URLs without waiting for a
   crawl. Use it for new calculator launches

Also worth doing: submit the same sitemap to **Google Search Console** first (done above)
and let Bing's **IndexNow** pick up changes.

---

## 6. Ad approval checklist

AdSense approval is the single most common failure point for a new calculator site.
Work through this list in order.

### Already done

- [x] `public/ads.txt` at the domain root with the correct publisher ID
      (`google.com, pub-1115172981829710, DIRECT, f08c47fec0942fa0`)
- [x] `/legal/privacy/` — privacy policy (required, must be reachable from every page)
- [x] `/legal/terms/` — terms of service
- [x] `/legal/cookies/` — cookie policy
- [x] `/legal/disclaimer/` — "calculators are for information only" disclaimer
- [x] `/about/` — real about page describing who builds the site
- [x] `/contact/` — contact page **with a working email address**
- [x] "Information only" notice on finance and health calculator pages
- [x] Ad slots reserved in the layout with **zero layout shift** (`src/components/ui/AdSlot.astro`)
- [x] Ads **disabled by default** via a single flag (`ADS_ENABLED = false` in `src/config/ads.ts`)
- [x] Google-certified CMP for EEA/UK/CH consent (Consent Mode v2 defaults are denied in
      those regions, granted elsewhere)
- [x] `/robots.txt` and `/sitemap-index.xml` in place

### You must do

- [ ] **Own a real domain.** AdSense almost always rejects `pages.dev` subdomains.
      Reviewers require a registered domain with a working mail server. This is the
      prerequisite for everything else below
- [ ] **Set up working email** — `hello@`, `bugs@`, `privacy@` on your domain. A dead
      contact address is an automatic rejection
- [ ] **Fill in ads.txt** if you register a *different* AdSense publisher ID. The line in
      `public/ads.txt` must match the ID in your AdSense account exactly
- [ ] **Turn ads on.** One line, in `src/config/ads.ts`:
      ```ts
      export const ADS_ENABLED = true;
      ```
      Then rebuild and deploy. This single flag enables the `adsbygoogle.js` loader, the
      `<ins>` slots, and the CMP in one go — no other file needs to change
- [ ] **Create the ad units** in the AdSense dashboard and put their IDs into
      `AD_SLOTS` in `src/config/ads.ts` (currently placeholders: `calctube-header`,
      `calctube-in-content`, `calctube-footer`)
- [ ] **Wait 2–4 weeks** with ads live and real content before applying. AdSense rejects
      sites with no ad units and thin content. Apply from the AdSense dashboard →
      **Overview** → **Get started**
- [ ] **Fill out the AdSense application honestly**: site category "Finance" (or
      "Lifestyle"), and describe the site as a free calculator reference site
- [ ] **Check your status** at https://adsense.google.com → **Overview**. If rejected,
      the reason is shown on the page — usually "Low Value Content" (add more calculators
      and guides) or "Insufficient Traffic" (keep building)
- [ ] **Add an ads.txt line for each additional network** you get approved for (AppNexus,
      Amazon, etc.) — see the commented examples in `public/ads.txt`. Only list sellers you
      are actually approved with; listing an unauthorized seller is a policy violation

### Common rejection reasons and the fix

| Rejection reason | Fix |
|---|---|
| "Low Value Content" | Add 15–20 more calculators with unique copy. Avoid templated near-duplicate pages. The site already noindexes the two thin programmatic tiers |
| "Insufficient Traffic" | Keep the site live for a few weeks; drive some real visitors from social or outreach |
| "No privacy policy" | Already fixed — `/legal/privacy/` is live and linked in the footer |
| "Unclear ownership / no contact" | Own a domain and use a working `hello@` address |
| "Site is under construction" | The site must be fully live before applying |
| "Navigation is broken" | Fixed — all internal links verified 200 |

### After approval

- [ ] Turn on **Auto Ads** or keep the manual slots
- [ ] Set **Site Privacy** → your `/legal/cookies/` URL in the AdSense dashboard
- [ ] Review ad placements monthly; check **Site → Ad placement** reports for "below fold"
      and blocked results
- [ ] Watch **Core Web Vitals** in AdSense → **Site → Core Web Vitals** after ads go live.
      Ad units are the most common cause of a CLS regression on an otherwise fast site.
      The `AdSlot` component reserves its height to prevent this — verify on a real
      device

---

## 7. Quick reference

```bash
# Local dev
npm run dev

# Full gate before every deploy
npm ci && npm test && npm run build

# Deploy
npx wrangler pages deploy dist --project-name calctube --branch main --commit-dirty=true

# Watch CI
gh run watch --repo VoraYogiraj/calcnow

# Check the live site
curl -I https://calctube.pages.dev/
curl https://calctube.pages.dev/sitemap-index.xml | head
```

### Key files

| File | What it controls |
|---|---|
| `astro.config.mjs` | `site:` — the canonical production URL (sitemap, canonicals, OG) |
| `src/lib/seo.ts` | `SITE.url` — the URL used in JSON-LD and meta tags |
| `src/config/ads.ts` | `ADS_ENABLED` — the single ad on/off switch |
| `src/components/ui/AdSlot.astro` | Ad slot markup, layout-shift-safe |
| `public/_headers` | Security headers and cache rules |
| `public/_redirects` | `/sitemap.xml` → `/sitemap-index.xml`, slug cleanups |
| `public/robots.txt` | Crawl rules and the sitemap pointer |
| `.github/workflows/deploy.yml` | Auto-deploy on push to `main` |
