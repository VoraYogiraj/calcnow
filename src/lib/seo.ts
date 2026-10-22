/**
 * SEO/AEO utility functions and shared JSON-LD generators.
 * Used by every page to ensure consistent schema and meta.
 */

export const SITE = {
  name: 'Calctube',
  domain: 'calctube.pages.dev',
  url: 'https://calctube.pages.dev',
  description:
    'Free online calculators for finance, health, math, conversions, and more. Fast, accurate, no signup required.',
  twitter: '@calctube',
  defaultOgImage: '/og-default.png',
};

/** Canonical trailing-slash form of an internal path, so JSON-LD url/@id values
 *  match the served (canonical) URL and never point at a redirecting variant.
 *  Pages define `path` without a trailing slash; the built page is served at
 *  `path + '/'`, so emitting the bare path in schema created "Page with redirect"
 *  crawls in Search Console. */
export function slashPath(p: string): string {
  return !p || p === '/' ? '/' : p.endsWith('/') ? p : p + '/';
}

export interface CalculatorMeta {
  slug: string;
  name: string;
  description: string;
  category: 'finance' | 'health' | 'math' | 'conversion' | 'date-time' | 'construction' | 'auto' | 'other';
  keywords: string[];
  lastUpdated: string; // ISO date
  ratingValue?: string;
  ratingCount?: string;
}

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE.url}/#organization`,
    name: SITE.name,
    url: SITE.url,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE.url}/logo.png`,
      width: 512,
      height: 512,
    },
    description: SITE.description,
    foundingDate: '2026',
    knowsAbout: [
      'Personal finance',
      'Mortgage calculations',
      'EMI calculations',
      'Currency conversion',
      'Tax planning',
      'Investment calculations',
      'Loan amortization',
    ],
    publishingPrinciples: `${SITE.url}/about/`,
    sameAs: [
      `https://twitter.com/${SITE.twitter.replace('@', '')}`,
      'https://www.linkedin.com/company/calctube/',
    ],
  };
}

/**
 * E-E-A-T author/editor entity. Surfaces Experience, Expertise, Authoritativeness, Trust signals
 * that Google's quality raters and AI citation systems look for.
 */
export function buildEditorialTeamSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE.url}/#editorial-team`,
    name: `${SITE.name} Editorial Team`,
    parentOrganization: { '@id': `${SITE.url}/#organization` },
    description:
      'The Calctube editorial team researches lender rates, tax regulations, and currency flows from primary sources (RBI, SAMA, HMRC, Bank Indonesia, CBO, and equivalent regulators), and updates page content quarterly. Calculator formulas are derived from standard financial mathematics (annuity, simple interest, compound interest) and verified against published bank EMI schedules.',
    knowsAbout: [
      'Indian banking products (RBI repo-linked loans, MCLR, PMAY-CLSS)',
      'Mortgage products across 22 countries',
      'Currency remittance corridors and exchange rate mechanisms',
      'Income tax regimes (India old vs new, country-specific tax treatment)',
      'Islamic finance structures (Murabaha, Ijara)',
    ],
  };
}

/**
 * Speakable schema flags Q&A and Quick Answer blocks as voice-assistant and AI-snippet eligible.
 * Used by Google Assistant, Alexa, Siri, ChatGPT search, and Perplexity to identify
 * the answer-first content suitable for spoken or AI-overview surfacing.
 */
export function buildSpeakableSchema(path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${SITE.url}${slashPath(path)}#speakable`,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.speakable-answer', '.speakable-summary'],
    },
    url: `${SITE.url}${slashPath(path)}`,
  };
}

/**
 * HowTo schema flags calculator pages as step-by-step instructions.
 * Heavily used by Google AI Overviews and Bing Copilot for "how to calculate X" queries.
 */
export function buildHowToSchema(opts: {
  name: string;
  description: string;
  steps: Array<{ name: string; text: string }>;
  totalTime?: string; // ISO 8601 duration, e.g., 'PT2M'
  estimatedCost?: { value: string; currency: string };
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: opts.name,
    description: opts.description,
    ...(opts.totalTime ? { totalTime: opts.totalTime } : {}),
    ...(opts.estimatedCost
      ? {
          estimatedCost: {
            '@type': 'MonetaryAmount',
            currency: opts.estimatedCost.currency,
            value: opts.estimatedCost.value,
          },
        }
      : {}),
    step: opts.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

export function buildWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    publisher: { '@id': `${SITE.url}/#organization` },
    // No SearchAction: /search does not exist as a page (site search is an
    // on-page island), and advertising a 404 target on every page just
    // invites Googlebot to crawl /search?q=... and log soft errors.
  };
}

export function buildCalculatorSchema(meta: CalculatorMeta, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': `${SITE.url}${slashPath(path)}#app`,
    name: meta.name,
    url: `${SITE.url}${slashPath(path)}`,
    description: meta.description,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any (Web)',
    browserRequirements: 'Requires JavaScript',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    publisher: { '@id': `${SITE.url}/#organization` },
    datePublished: meta.lastUpdated,
    dateModified: meta.lastUpdated,
    keywords: meta.keywords.join(', '),
    ...(meta.ratingValue && meta.ratingCount
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: meta.ratingValue,
            ratingCount: meta.ratingCount,
          },
        }
      : {}),
  };
}

export function buildBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE.url}${slashPath(item.url)}`,
    })),
  };
}

export function buildFAQSchema(faqs: Array<{ q: string; a: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };
}
