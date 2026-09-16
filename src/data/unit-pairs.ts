/**
 * Data model for the programmatic unit-conversion tier
 * (/conversions/unit-converter/[from]-to-[to]/).
 *
 * Each unit stores its factor to the category's base unit (linear categories),
 * plus the matching symbol used by the interactive <UnitConverter> so the widget
 * can be pre-set to this exact pair. Temperature is affine, handled separately.
 *
 * Factors are IDENTICAL to those in UnitConverter.tsx so the static conversion
 * tables and the interactive widget never disagree.
 */

export type UCat = 'length' | 'weight' | 'volume' | 'speed' | 'area' | 'data' | 'temperature';

export interface Unit {
  key: string;        // URL slug token, e.g. 'km' → .../km-to-miles/
  name: string;       // singular, e.g. 'kilometer'
  plural: string;     // 'kilometers'
  symbol: string;     // 'km'  (also the <UnitConverter> internal symbol)
  category: UCat;
  factor: number;     // to category base unit (unused for temperature)
  usage: string;      // one-line "where it's used" blurb for unique prose
}

export const UNITS: Record<string, Unit> = {
  // LENGTH — base metre
  mm:      { key: 'mm', name: 'millimeter', plural: 'millimeters', symbol: 'mm', category: 'length', factor: 0.001, usage: 'small dimensions in engineering, screens and rainfall' },
  cm:      { key: 'cm', name: 'centimeter', plural: 'centimeters', symbol: 'cm', category: 'length', factor: 0.01, usage: 'body measurements, height and everyday lengths in metric countries' },
  meters:  { key: 'meters', name: 'meter', plural: 'meters', symbol: 'm', category: 'length', factor: 1, usage: 'the SI base length unit (rooms, fabric, athletics tracks)' },
  km:      { key: 'km', name: 'kilometer', plural: 'kilometers', symbol: 'km', category: 'length', factor: 1000, usage: 'road distances and running events across most of the world' },
  inches:  { key: 'inches', name: 'inch', plural: 'inches', symbol: 'in', category: 'length', factor: 0.0254, usage: 'screen sizes, and everyday lengths in the US and UK' },
  feet:    { key: 'feet', name: 'foot', plural: 'feet', symbol: 'ft', category: 'length', factor: 0.3048, usage: 'height and room dimensions in the US and UK' },
  yards:   { key: 'yards', name: 'yard', plural: 'yards', symbol: 'yd', category: 'length', factor: 0.9144, usage: 'fabric, American football and landscaping in imperial countries' },
  miles:   { key: 'miles', name: 'mile', plural: 'miles', symbol: 'mi', category: 'length', factor: 1609.344, usage: 'road distances and speed limits in the US and UK' },

  // WEIGHT — base gram
  grams:   { key: 'grams', name: 'gram', plural: 'grams', symbol: 'g', category: 'weight', factor: 1, usage: 'cooking ingredients and small masses in metric countries' },
  kg:      { key: 'kg', name: 'kilogram', plural: 'kilograms', symbol: 'kg', category: 'weight', factor: 1000, usage: 'body weight and groceries almost everywhere except the US' },
  ounces:  { key: 'ounces', name: 'ounce', plural: 'ounces', symbol: 'oz', category: 'weight', factor: 28.349523, usage: 'food portions and postage in the US' },
  lbs:     { key: 'lbs', name: 'pound', plural: 'pounds', symbol: 'lb', category: 'weight', factor: 453.59237, usage: 'body weight and groceries in the US and UK' },
  stone:   { key: 'stone', name: 'stone', plural: 'stone', symbol: 'st', category: 'weight', factor: 6350.29318, usage: 'body weight in the UK and Ireland' },

  // VOLUME — base litre (US customary)
  ml:          { key: 'ml', name: 'milliliter', plural: 'milliliters', symbol: 'ml', category: 'volume', factor: 0.001, usage: 'recipes, medicine doses and drinks in metric countries' },
  liters:      { key: 'liters', name: 'liter', plural: 'liters', symbol: 'L', category: 'volume', factor: 1, usage: 'fuel, drinks and engine sizes in most of the world' },
  cups:        { key: 'cups', name: 'cup', plural: 'cups', symbol: 'cup', category: 'volume', factor: 0.2365882, usage: 'US recipes and baking' },
  tablespoons: { key: 'tablespoons', name: 'tablespoon', plural: 'tablespoons', symbol: 'tbsp', category: 'volume', factor: 0.01478676, usage: 'cooking measurements' },
  gallons:     { key: 'gallons', name: 'gallon', plural: 'gallons', symbol: 'gal', category: 'volume', factor: 3.7854118, usage: 'fuel and large liquids in the US' },

  // SPEED — base m/s
  mps:   { key: 'mps', name: 'meter per second', plural: 'meters per second', symbol: 'm/s', category: 'speed', factor: 1, usage: 'the SI speed unit (physics and wind speed)' },
  kmh:   { key: 'kmh', name: 'kilometer per hour', plural: 'kilometers per hour', symbol: 'km/h', category: 'speed', factor: 0.2777778, usage: 'vehicle speed and limits in most countries' },
  mph:   { key: 'mph', name: 'mile per hour', plural: 'miles per hour', symbol: 'mph', category: 'speed', factor: 0.44704, usage: 'vehicle speed and limits in the US and UK' },
  knots: { key: 'knots', name: 'knot', plural: 'knots', symbol: 'kn', category: 'speed', factor: 0.5144444, usage: 'aviation, sailing and marine navigation' },

  // AREA — base m²
  sqm:      { key: 'sqm', name: 'square meter', plural: 'square meters', symbol: 'm²', category: 'area', factor: 1, usage: 'floor area and property size in metric countries' },
  sqft:     { key: 'sqft', name: 'square foot', plural: 'square feet', symbol: 'ft²', category: 'area', factor: 0.09290304, usage: 'property and floor area in the US, UK and India' },
  acres:    { key: 'acres', name: 'acre', plural: 'acres', symbol: 'acre', category: 'area', factor: 4046.8564, usage: 'land and farm plots in imperial countries' },
  hectares: { key: 'hectares', name: 'hectare', plural: 'hectares', symbol: 'ha', category: 'area', factor: 10000, usage: 'agricultural land and large plots worldwide' },

  // DATA — base byte (decimal SI)
  kb: { key: 'kb', name: 'kilobyte', plural: 'kilobytes', symbol: 'KB', category: 'data', factor: 1000, usage: 'small files and documents' },
  mb: { key: 'mb', name: 'megabyte', plural: 'megabytes', symbol: 'MB', category: 'data', factor: 1_000_000, usage: 'photos, songs and app sizes' },
  gb: { key: 'gb', name: 'gigabyte', plural: 'gigabytes', symbol: 'GB', category: 'data', factor: 1_000_000_000, usage: 'mobile data plans, storage and video' },
  tb: { key: 'tb', name: 'terabyte', plural: 'terabytes', symbol: 'TB', category: 'data', factor: 1_000_000_000_000, usage: 'hard drives and large backups' },

  // TEMPERATURE — affine, factor unused
  celsius:    { key: 'celsius', name: 'Celsius', plural: 'degrees Celsius', symbol: '°C', category: 'temperature', factor: 0, usage: 'everyday temperature in most of the world' },
  fahrenheit: { key: 'fahrenheit', name: 'Fahrenheit', plural: 'degrees Fahrenheit', symbol: '°F', category: 'temperature', factor: 0, usage: 'everyday temperature in the US' },
  kelvin:     { key: 'kelvin', name: 'Kelvin', plural: 'Kelvin', symbol: 'K', category: 'temperature', factor: 0, usage: 'the SI temperature unit, used in science' },
};

// Temperature helpers (affine): convert via Celsius.
function tempToCelsius(v: number, key: string): number {
  if (key === 'celsius') return v;
  if (key === 'fahrenheit') return (v - 32) * 5 / 9;
  return v - 273.15; // kelvin
}
function celsiusTo(v: number, key: string): number {
  if (key === 'celsius') return v;
  if (key === 'fahrenheit') return v * 9 / 5 + 32;
  return v + 273.15; // kelvin
}

/** Convert a value from one unit to another (same category). */
export function convert(value: number, fromKey: string, toKey: string): number {
  const from = UNITS[fromKey], to = UNITS[toKey];
  if (from.category === 'temperature') {
    return celsiusTo(tempToCelsius(value, fromKey), toKey);
  }
  return (value * from.factor) / to.factor;
}

/** Linear factor: 1 fromUnit = N toUnit. (Not meaningful for temperature.) */
export function linearFactor(fromKey: string, toKey: string): number {
  return UNITS[fromKey].factor / UNITS[toKey].factor;
}

/** Format a number for display: trims trailing zeros, sensible precision. */
export function fmt(n: number): string {
  if (!Number.isFinite(n)) return '—';
  if (n === 0) return '0';
  const abs = Math.abs(n);
  let s: string;
  if (abs >= 1e9 || abs < 1e-4) s = n.toExponential(4);
  else if (abs >= 100) s = n.toLocaleString('en-US', { maximumFractionDigits: 2 });
  else s = Number(n.toPrecision(6)).toLocaleString('en-US', { maximumFractionDigits: 6 });
  return s;
}

export interface UnitPair {
  slug: string;      // 'km-to-miles'
  from: string;      // unit key
  to: string;        // unit key
  category: UCat;
  popular?: boolean; // surfaced on the hub
}

// Curated, real-demand pairs (both directions where both are searched).
const RAW_PAIRS: Array<[string, string, boolean?]> = [
  // length
  ['km', 'miles', true], ['miles', 'km', true],
  ['cm', 'inches', true], ['inches', 'cm', true],
  ['meters', 'feet', true], ['feet', 'meters', true],
  ['feet', 'cm'], ['cm', 'feet'],
  ['mm', 'inches'], ['inches', 'mm'],
  ['meters', 'yards'], ['yards', 'meters'],
  // weight
  ['kg', 'lbs', true], ['lbs', 'kg', true],
  ['kg', 'stone'], ['stone', 'kg'],
  ['grams', 'ounces'], ['ounces', 'grams'],
  ['lbs', 'ounces'], ['ounces', 'lbs'],
  // volume
  ['liters', 'gallons', true], ['gallons', 'liters'],
  ['cups', 'ml'], ['ml', 'cups'],
  ['tablespoons', 'ml'], ['ml', 'tablespoons'],
  // speed
  ['mph', 'kmh', true], ['kmh', 'mph', true],
  ['mps', 'kmh'], ['kmh', 'mps'],
  ['knots', 'mph'], ['mph', 'knots'],
  // area
  ['sqft', 'sqm', true], ['sqm', 'sqft'],
  ['acres', 'hectares'], ['hectares', 'acres'],
  // data
  ['mb', 'gb', true], ['gb', 'mb'],
  ['gb', 'tb'], ['tb', 'gb'],
  ['kb', 'mb'], ['mb', 'kb'],
  // temperature
  ['celsius', 'fahrenheit', true], ['fahrenheit', 'celsius', true],
  ['celsius', 'kelvin'], ['kelvin', 'celsius'],
  ['fahrenheit', 'kelvin'], ['kelvin', 'fahrenheit'],
];

export const unitPairs: UnitPair[] = RAW_PAIRS.map(([from, to, popular]) => ({
  slug: `${from}-to-${to}`,
  from,
  to,
  category: UNITS[from].category,
  popular: !!popular,
}));

export function getPair(slug: string): UnitPair | undefined {
  return unitPairs.find((p) => p.slug === slug);
}

// Table input values by category (in the FROM unit).
export const TABLE_AMOUNTS: Record<UCat, number[]> = {
  length: [1, 2, 3, 5, 10, 20, 25, 50, 100, 1000],
  weight: [1, 2, 3, 5, 10, 20, 25, 50, 100, 1000],
  volume: [0.5, 1, 2, 3, 4, 5, 10, 20, 50, 100],
  speed: [1, 5, 10, 20, 30, 40, 50, 60, 80, 100],
  area: [1, 2, 5, 10, 20, 50, 100, 500, 1000, 5000],
  data: [1, 2, 5, 10, 50, 100, 250, 500, 1000, 2000],
  temperature: [], // per-unit overrides below
};

// Meaningful temperature reference points, per FROM unit.
export const TEMP_AMOUNTS: Record<string, number[]> = {
  celsius: [-40, -20, 0, 10, 20, 25, 30, 37, 40, 100],
  fahrenheit: [-40, 0, 32, 50, 68, 72, 90, 98.6, 100, 212],
  kelvin: [0, 100, 200, 273.15, 293.15, 300, 310, 373.15],
};
