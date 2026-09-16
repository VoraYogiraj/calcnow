/**
 * Per-university CGPA→percentage tier (/math/cgpa-to-percentage/[university]/).
 *
 * Each university uses a DIFFERENT, officially-published conversion formula.
 * `formulaKey` matches a preset in CgpaCalculator.tsx so the widget loads pre-set.
 * Always paired with an on-page disclaimer: formulas vary by regulation year /
 * program, so students must confirm with their official grade card or circular.
 */

import type { FormulaKey } from '../components/calculators/CgpaCalculator';

export interface University {
  slug: string;
  shortName: string;   // 'VTU'
  fullName: string;    // 'Visvesvaraya Technological University'
  formulaKey: FormulaKey;
  formulaText: string; // human-readable formula
  toPct: (cgpa: number) => number;
  region: string;
  blurb: string;       // one-line context
}

export const universities: University[] = [
  {
    slug: 'vtu',
    shortName: 'VTU',
    fullName: 'Visvesvaraya Technological University',
    formulaKey: 'vtu',
    formulaText: 'Percentage = (CGPA − 0.75) × 10',
    toPct: (c) => (c - 0.75) * 10,
    region: 'Karnataka',
    blurb: 'VTU affiliates most engineering colleges in Karnataka and publishes the −0.75 conversion in its grade-card guidelines.',
  },
  {
    slug: 'anna-university',
    shortName: 'Anna University',
    fullName: 'Anna University',
    formulaKey: 'anna',
    formulaText: 'Percentage = (CGPA − 0.5) × 10',
    toPct: (c) => (c - 0.5) * 10,
    region: 'Tamil Nadu',
    blurb: 'Anna University, which affiliates Tamil Nadu\'s engineering colleges, commonly uses the −0.5 conversion under its CBCS regulations.',
  },
  {
    slug: 'mumbai-university',
    shortName: 'Mumbai University',
    fullName: 'University of Mumbai',
    formulaKey: 'mu',
    formulaText: 'Percentage = 7.1 × CGPA + 11',
    toPct: (c) => 7.1 * c + 11,
    region: 'Maharashtra',
    blurb: 'The University of Mumbai\'s seven-point-average scheme uses a linear 7.1 × CGPA + 11 conversion rather than a simple multiplier.',
  },
  {
    slug: 'gtu',
    shortName: 'GTU',
    fullName: 'Gujarat Technological University',
    formulaKey: 'gtu',
    formulaText: 'Percentage = (CGPA − 0.5) × 10',
    toPct: (c) => (c - 0.5) * 10,
    region: 'Gujarat',
    blurb: 'GTU affiliates engineering, pharmacy and management colleges across Gujarat and publishes the −0.5 conversion.',
  },
  {
    slug: 'makaut',
    shortName: 'MAKAUT',
    fullName: 'Maulana Abul Kalam Azad University of Technology (formerly WBUT)',
    formulaKey: 'makaut',
    formulaText: 'Percentage = (CGPA − 0.75) × 10',
    toPct: (c) => (c - 0.75) * 10,
    region: 'West Bengal',
    blurb: 'MAKAUT (formerly WBUT) affiliates technical colleges across West Bengal and uses the −0.75 DGPA/CGPA conversion.',
  },
];

export function getUniversity(slug: string): University | undefined {
  return universities.find((u) => u.slug === slug);
}
