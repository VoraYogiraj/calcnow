/**
 * Ad configuration — single source of truth for ad behaviour.
 *
 * ADS_ENABLED is the one switch that turns ad serving on and off.
 * It defaults to FALSE so a fresh clone (and every CI build) ships a clean,
 * ad-free site. Flip it to true only after Google AdSense approval is live
 * on the domain, otherwise AdSense serves only "unfilled" placeholders.
 *
 * To switch on after approval:
 *   1. Set ADS_ENABLED = true below (one line).
 *   2. Confirm public/ads.txt lists your publisher ID.
 *   3. Redeploy. No other file needs to change.
 */

export const ADS_ENABLED = false;

/** Google AdSense publisher ID (the `pub-` number, without the `ca-` prefix). */
export const ADSENSE_CLIENT = 'ca-pub-1115172981829710';

/** Ad slot unit names — the ad unit IDs come from your AdSense dashboard. */
export const AD_SLOTS = {
  header: 'freecalculations-header',
  inContent: 'freecalculations-in-content',
  footer: 'freecalculations-footer',
} as const;

export type AdSlotName = keyof typeof AD_SLOTS;
