/**
 * Central site configuration for FreeCalculations.
 * Used by SEO, schemas, and components across the site.
 */

export const SITE = {
  name: 'FreeCalculations',
  url: 'https://freecalculations.online',
  tagline: 'Free online calculators for everyday needs.',
  description: '70+ free online calculators for EMI, SIP, income tax, GST, mortgage, BMI and more. No signup, no limits, instant results right in your browser.',
  twitter: '@freecalculations',
  defaultOgImage: '/og-default.png',
};

/** Canonical trailing-slash form of an internal path */
export function slashPath(p: string): string {
  return !p || p === '/' ? '/' : p.endsWith('/') ? p : p + '/';
}