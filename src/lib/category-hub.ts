/**
 * Builds the calculator cards shown on a category hub page (/finance/, /health/, …)
 * from the `calculators` registry, so a hub can never silently fall behind it.
 *
 * Hubs used to keep their own hardcoded list. That drifted: six calculators added
 * to the registry on 2026-07-21 built fine but never appeared on /finance/, and
 * three finance calculators that had shipped long before were missing from the
 * registry entirely. Deriving the list means adding a registry entry is enough.
 */

import { calculators, type CalcCategory } from '../data/calculators';

/** A calculator card as rendered on a category hub. */
export interface HubCard {
  slug: string;
  name: string;
  href: string;
  desc: string;
  icon: string;
}

/**
 * Hub-specific copy for one calculator. The registry's `name` and `description`
 * are deliberately terse — they have to fit the homepage grid and the search
 * dropdown. Hubs have room for a fuller name and a longer blurb, so they can
 * override either. Anything left unset falls back to the registry, which is what
 * makes a newly registered calculator show up on its hub immediately: with plain
 * copy rather than not at all.
 */
export interface HubCopy {
  name?: string;
  desc?: string;
  /** Only override where the registry icon collides with another card on the same hub. */
  icon?: string;
}

export interface HubCardOptions {
  /** Per-slug copy overrides. */
  copy?: Record<string, HubCopy>;
  /** Live calculators from other categories to list here too, by slug. */
  alsoInclude?: string[];
  /** Curated display order, by slug. Anything unlisted is appended in registry order. */
  order?: string[];
}

export function buildHubCards(category: CalcCategory, options: HubCardOptions = {}): HubCard[] {
  const { copy = {}, alsoInclude = [], order = [] } = options;

  // Fail the build on a stale override rather than silently rendering registry
  // copy that someone thought they had replaced.
  for (const slug of Object.keys(copy)) {
    if (!calculators.some((c) => c.slug === slug)) {
      throw new Error(`[category-hub] ${category}: copy override for unknown slug "${slug}"`);
    }
  }

  const own = calculators.filter((c) => c.category === category && c.status === 'live');

  const borrowed = alsoInclude.map((slug) => {
    const found = calculators.find((c) => c.slug === slug);
    if (!found) throw new Error(`[category-hub] ${category}: alsoInclude slug "${slug}" is not in the registry`);
    if (found.status !== 'live') throw new Error(`[category-hub] ${category}: alsoInclude slug "${slug}" is not live`);
    return found;
  });

  const rank = new Map(order.map((slug, i) => [slug, i]));
  const last = order.length;

  return [...own, ...borrowed]
    // Stable sort: unranked calculators keep registry order and land at the end,
    // so a new entry is visible without being silently slotted mid-list.
    .sort((a, b) => (rank.get(a.slug) ?? last) - (rank.get(b.slug) ?? last))
    .map((c) => ({
      slug: c.slug,
      name: copy[c.slug]?.name ?? c.name,
      href: c.href,
      desc: copy[c.slug]?.desc ?? c.description,
      icon: copy[c.slug]?.icon ?? c.icon,
    }));
}
