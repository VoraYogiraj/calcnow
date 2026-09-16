/**
 * Map an ISO 4217 currency code to a country flag slug in public/flags/.
 *
 * 104 currencies covered. Multi-country currencies (EUR, XAF, XOF, XCD) fall
 * back to a representative supranational flag (EU) or null if unsupported.
 *
 * Returns null for unsupported codes — callers should fall back gracefully
 * (typically by hiding the icon or showing the currency symbol).
 */

const CURRENCY_TO_FLAG_SLUG: Record<string, string> = {
  // North America
  USD: 'usa',
  CAD: 'canada',
  MXN: 'mexico',
  CRC: 'costa-rica',
  PAB: 'panama',
  GTQ: 'guatemala',
  DOP: 'dominican-republic',
  HTG: 'haiti',
  JMD: 'jamaica',
  CUP: 'cuba',
  BSD: 'bahamas',
  BBD: 'barbados',
  TTD: 'trinidad-and-tobago',

  // Europe
  EUR: 'eu',
  GBP: 'uk',
  CHF: 'switzerland',
  NOK: 'norway',
  SEK: 'sweden',
  DKK: 'denmark',
  PLN: 'poland',
  CZK: 'czech-republic',
  HUF: 'hungary',
  RON: 'romania',
  BGN: 'bulgaria',
  RSD: 'serbia',
  HRK: 'croatia',
  ISK: 'iceland',
  ALL: 'albania',
  MKD: 'north-macedonia',
  BAM: 'bosnia-and-herzegovina',
  MDL: 'moldova',
  UAH: 'ukraine',
  RUB: 'russia',
  BYN: 'belarus',
  GEL: 'georgia',
  AMD: 'armenia',
  AZN: 'azerbaijan',

  // Middle East & North Africa
  AED: 'uae',
  SAR: 'saudi-arabia',
  QAR: 'qatar',
  KWD: 'kuwait',
  BHD: 'bahrain',
  OMR: 'oman',
  ILS: 'israel',
  JOD: 'jordan',
  TRY: 'turkey',
  EGP: 'egypt',
  MAD: 'morocco',
  TND: 'tunisia',
  DZD: 'algeria',
  LYD: 'libya',

  // Sub-Saharan Africa
  ZAR: 'south-africa',
  NGN: 'nigeria',
  KES: 'kenya',
  GHS: 'ghana',
  ETB: 'ethiopia',
  UGX: 'uganda',
  TZS: 'tanzania',
  RWF: 'rwanda',
  ZMW: 'zambia',
  MWK: 'malawi',
  MZN: 'mozambique',
  AOA: 'angola',
  BIF: 'burundi',
  BWP: 'botswana',
  MGA: 'madagascar',
  MUR: 'mauritius',
  // XAF (Central African CFA) and XOF (West African CFA) — multi-country, no single flag

  // South Asia
  INR: 'india',
  PKR: 'pakistan',
  BDT: 'bangladesh',
  LKR: 'sri-lanka',
  NPR: 'nepal',
  MVR: 'maldives',

  // East & Southeast Asia
  JPY: 'japan',
  CNY: 'china',
  KRW: 'south-korea',
  HKD: 'hong-kong',
  TWD: 'taiwan',
  SGD: 'singapore',
  MYR: 'malaysia',
  THB: 'thailand',
  IDR: 'indonesia',
  PHP: 'philippines',
  VND: 'vietnam',
  MMK: 'myanmar',

  // Central Asia
  KZT: 'kazakhstan',
  UZS: 'uzbekistan',

  // Oceania
  AUD: 'australia',
  NZD: 'new-zealand',
  FJD: 'fiji',
  PGK: 'papua-new-guinea',
  WST: 'samoa',
  TOP: 'tonga',
  // XCD (Eastern Caribbean) — multi-country, no single flag

  // South America
  BRL: 'brazil',
  ARS: 'argentina',
  CLP: 'chile',
  COP: 'colombia',
  PEN: 'peru',
  UYU: 'uruguay',
  PYG: 'paraguay',
  BOB: 'bolivia',
  VES: 'venezuela',
  SRD: 'suriname',
};

/**
 * Returns the country/region slug for a currency code, or null if unmapped.
 */
export function flagSlugForCurrency(code: string | undefined | null): string | null {
  if (!code) return null;
  return CURRENCY_TO_FLAG_SLUG[code.toUpperCase()] ?? null;
}
