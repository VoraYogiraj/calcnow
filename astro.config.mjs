import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://calctube.com',
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      // No lastmod: stamping every URL with the build time on each deploy makes
      // the field meaningless (Google ignores lastmod once it proves unreliable).
      // Better to omit it than to lie about 796 pages changing daily.
      // Exclude pages marked noindex — no point signaling Google to crawl them.
      // Two thin combo tiers are noindexed (templated doorway content, AdSense
      // low-value flag, "Crawled - currently not indexed" in GSC) and kept out of
      // the sitemap to avoid a contradictory crawl signal:
      //   • bank×state  (/finance/emi-calculator/{bank}/{state}/)
      //   • city×bank   (/finance/mortgage-calculator/cities/{city}/{bank}/)
      // The HUB pages — bank hubs (/finance/emi-calculator/{bank}/) and city hubs
      // (/finance/mortgage-calculator/cities/{city}/) — stay indexed and in the
      // sitemap; those carry genuinely unique per-page content.
      // The embed widgets (/embed/{slug}/) are noindex too — they mirror a
      // calculator that already ranks on its own URL, so they must not compete
      // with it. The /embed/ gallery itself DOES stay indexed: that is the page
      // publishers land on to grab a snippet.
      filter: (page) => {
        const path = new URL(page).pathname;
        const prefixExcluded = ['/og-preview/', '/logo-gallery/', '/contact/'].some(
          (p) => path === p || path.startsWith(p)
        );
        // Exact match only. /legal/ is a 62-word navigation stub that just links to
        // the three real documents, so it is noindexed and kept out of the sitemap.
        // Its children (/legal/privacy/, /legal/terms/, /legal/cookies/) must stay
        // indexed — AdSense requires a reachable, indexable privacy policy.
        const exactExcluded = ['/legal/'].includes(path);
        // Individual embed widgets, but not the /embed/ gallery index.
        const isEmbedWidget = /^\/embed\/[^/]+\/?$/.test(path);
        // Bank×state = exactly two path segments after /finance/emi-calculator/
        const isBankState = /^\/finance\/emi-calculator\/[^/]+\/[^/]+\/?$/.test(path);
        // City×bank = exactly two path segments after /finance/mortgage-calculator/cities/
        const isCityBank = /^\/finance\/mortgage-calculator\/cities\/[^/]+\/[^/]+\/?$/.test(path);
        return !prefixExcluded && !exactExcluded && !isBankState && !isCityBank && !isEmbedWidget;
      },
      // Differentiate priorities so Google focuses crawl budget on important pages.
      // Homepage 1.0, category hubs 0.9, calculator hubs 0.8, long-tail spokes 0.5.
      serialize(item) {
        const url = new URL(item.url);
        const path = url.pathname;

        // HONEST per-cluster lastmod — bump the matching date ONLY when that
        // cluster's underlying data/content genuinely changes. Never use the
        // build timestamp: stamping 796 URLs "changed" on every deploy teaches
        // Google the field is unreliable and it gets ignored.
        // All clusters bumped 2026-07-22: the em-dash rewrite changed visible FAQ
        // and prose copy in every data file feeding these pages (currency-pairs,
        // india-cities, emi-banks, mortgage-locales, bank/city grids), and the
        // authorship removal changed every calculator page's body and JSON-LD.
        // This is a genuine content change, not a deploy-timestamp lie, and it
        // matters: most "Crawled - currently not indexed" URLs in GSC were last
        // crawled before this overhaul, so their verdict predates the rewrite.
        const CLUSTER_LASTMOD = [
          [/^\/finance\/mortgage-calculator\/cities\//, '2026-07-22'], // india-cities copy rewrite
          [/^\/finance\/mortgage-calculator\//, '2026-07-22'],         // mortgage-locales copy rewrite
          [/^\/finance\/emi-calculator\//, '2026-07-22'],              // emi-banks + grids copy rewrite
          [/^\/finance\/income-tax-india\//, '2026-07-22'],            // india-states copy rewrite
          [/^\/conversions\/currency\//, '2026-07-22'],                // currency-pairs copy rewrite
          [/^\/conversions\/unit-converter\//, '2026-07-22'],          // page copy rewrite
          [/^\/math\/cgpa-to-percentage\//, '2026-07-22'],             // page copy rewrite
          [/^\/$/, '2026-07-22'],                                      // homepage copy rewrite
        ];
        const match = CLUSTER_LASTMOD.find(([re]) => re.test(path));
        if (match) item.lastmod = match[1];

        // Homepage
        if (path === '/') {
          item.priority = 1.0;
          item.changefreq = 'daily';
          return item;
        }

        // Category indexes
        if (
          path === '/finance/' ||
          path === '/health/' ||
          path === '/math/' ||
          path === '/conversions/' ||
          path === '/date-time/' ||
          path === '/construction/' ||
          path === '/auto/'
        ) {
          item.priority = 0.9;
          item.changefreq = 'weekly';
          return item;
        }

        // Calculator-hub pages (each calculator's main URL)
        if (
          path === '/finance/mortgage-calculator/' ||
          path === '/finance/emi-calculator/' ||
          path === '/finance/loan-calculator/' ||
          path === '/finance/sip-calculator/' ||
          path === '/finance/compound-interest-calculator/' ||
          path === '/finance/fd-calculator/' ||
          path === '/finance/ppf-calculator/' ||
          path === '/finance/rd-calculator/' ||
          path === '/finance/hra-calculator/' ||
          path === '/finance/gst-calculator/' ||
          path === '/health/bmi-calculator/' ||
          path === '/health/bmr-calculator/' ||
          path === '/health/tdee-calculator/' ||
          path === '/health/calorie-calculator/' ||
          path === '/math/percentage-calculator/' ||
          path === '/math/tip-calculator/' ||
          path === '/math/discount-calculator/' ||
          path === '/date-time/age-calculator/' ||
          path === '/date-time/date-difference-calculator/' ||
          path === '/finance/retirement-calculator/' ||
          path === '/finance/inflation-calculator/' ||
          path === '/finance/net-worth-calculator/' ||
          path === '/conversions/currency/' ||
          path === '/conversions/unit-converter/' ||
          path === '/conversions/temperature-converter/' ||
          path === '/math/cgpa-to-percentage-calculator/' ||
          path === '/math/gpa-calculator/' ||
          path === '/finance/mortgage-calculator/cities/'
        ) {
          item.priority = 0.85;
          item.changefreq = 'weekly';
          return item;
        }

        // Long-tail programmatic SEO spokes
        if (
          path.startsWith('/conversions/currency/') ||
          path.startsWith('/conversions/unit-converter/') ||
          path.startsWith('/math/cgpa-to-percentage/') ||
          path.startsWith('/finance/mortgage-calculator/') ||
          path.startsWith('/finance/emi-calculator/') ||
          path.startsWith('/finance/income-tax-india/')
        ) {
          item.priority = 0.5;
          item.changefreq = 'monthly';
          return item;
        }

        // Author pages
        if (path.startsWith('/authors/')) {
          item.priority = 0.6;
          item.changefreq = 'monthly';
          return item;
        }

        // Comparison/static pages (about, legal, etc.)
        item.priority = 0.4;
        item.changefreq = 'monthly';
        return item;
      },
    }),
  ],
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'viewport',
  },
  build: {
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
});
