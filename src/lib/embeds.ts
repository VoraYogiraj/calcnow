/**
 * Which calculators are offered as embeddable widgets, and which React component
 * powers each one.
 *
 * Embeds exist to earn links: a publisher who drops a calculator into their post
 * keeps the "Powered by Calctube" attribution, which is a genuine editorial link
 * from a topically relevant page. Deriving the list from the calculators registry
 * means a newly registered calculator becomes embeddable automatically.
 */

import { calculators, type Calculator } from '../data/calculators';

/**
 * Slugs whose component name isn't the PascalCase of the slug.
 * The authoritative slug -> component wiring is the COMPONENTS map in
 * src/pages/embed/[calculator].astro; this mirrors it for tooling.
 */
const COMPONENT_ALIASES: Record<string, string> = {
  'calorie-calculator': 'CalorieDeficitCalculator',
  'cgpa-to-percentage-calculator': 'CgpaCalculator',
  'countdown-timer': 'CountdownCalculator',
  'income-tax-india': 'IncomeTaxIndiaCalculator',
};

/**
 * Live calculators deliberately not offered as embeds.
 * `currency-converter-hub` is a directory page rather than a single calculator.
 */
const NOT_EMBEDDABLE = new Set<string>(['currency-converter-hub']);

const pascal = (slug: string) =>
  slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');

/** The component filename (without extension) that renders a given calculator. */
export function componentNameFor(slug: string): string {
  return COMPONENT_ALIASES[slug] ?? pascal(slug);
}

/** Every live calculator we publish an embed for, in registry order. */
export const embeddableCalculators: Calculator[] = calculators.filter(
  (c) => c.status === 'live' && !NOT_EMBEDDABLE.has(c.slug)
);

/** Canonical embed URL path for a calculator. */
export const embedPath = (slug: string) => `/embed/${slug}/`;
