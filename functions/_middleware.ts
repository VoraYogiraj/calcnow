/**
 * Cloudflare Pages Middleware — runs at the edge before serving any static page.
 *
 * Behavior:
 *   • If user requests `/` AND we have a mortgage page for their country
 *     AND they haven't dismissed geo-redirect, return a 302 to /finance/mortgage-calculator/[slug]/
 *   • Bots (Googlebot, Bingbot, etc.) ALWAYS bypass redirect — they must crawl `/` as-is.
 *   • Users with cookie `geo-pref=stay` always bypass.
 *   • Users with `?nogeo=1` query bypass.
 *   • Users with `?geo=auto` are flagged as "came from auto-redirect" so the destination
 *     page can show a "showing UAE because you're in UAE — switch?" banner.
 *
 * Country detection uses Cloudflare's `request.cf.country` (ISO 3166-1 alpha-2).
 */

interface CountryEntry {
  slug: string;
  locale: string;
}

// Inlined here (worker can't import from src/). Mirror src/data/country-redirect-map.ts.
const COUNTRY_MAP: Record<string, CountryEntry> = {
  IN: { slug: 'india', locale: 'en-IN' },
  GB: { slug: 'uk', locale: 'en-GB' },
  CA: { slug: 'canada', locale: 'en-CA' },
  AU: { slug: 'australia', locale: 'en-AU' },
  US: { slug: 'usa', locale: 'en-US' },
  DE: { slug: 'germany', locale: 'de-DE' },
  SG: { slug: 'singapore', locale: 'en-SG' },
  ES: { slug: 'spain', locale: 'es-ES' },
  IT: { slug: 'italy', locale: 'it-IT' },
  FR: { slug: 'france', locale: 'fr-FR' },
  NZ: { slug: 'new-zealand', locale: 'en-NZ' },
  JP: { slug: 'japan', locale: 'ja-JP' },
  BR: { slug: 'brazil', locale: 'pt-BR' },
  MX: { slug: 'mexico', locale: 'es-MX' },
  ZA: { slug: 'south-africa', locale: 'en-ZA' },
  AE: { slug: 'uae', locale: 'en-AE' },
  NL: { slug: 'netherlands', locale: 'nl-NL' },
  BE: { slug: 'belgium', locale: 'nl-BE' },
  SE: { slug: 'sweden', locale: 'sv-SE' },
  NO: { slug: 'norway', locale: 'nb-NO' },
  PL: { slug: 'poland', locale: 'pl-PL' },
  IE: { slug: 'ireland', locale: 'en-IE' },
  PT: { slug: 'portugal', locale: 'pt-PT' },
  CH: { slug: 'switzerland', locale: 'de-CH' },
  MY: { slug: 'malaysia', locale: 'ms-MY' },
  SA: { slug: 'saudi-arabia', locale: 'ar-SA' },
  PK: { slug: 'pakistan', locale: 'en-PK' },
  BD: { slug: 'bangladesh', locale: 'bn-BD' },
  ID: { slug: 'indonesia', locale: 'id-ID' },
  PH: { slug: 'philippines', locale: 'en-PH' },
  TH: { slug: 'thailand', locale: 'th-TH' },
  QA: { slug: 'qatar', locale: 'ar-QA' },
  KW: { slug: 'kuwait', locale: 'ar-KW' },
  KR: { slug: 'south-korea', locale: 'ko-KR' },
  HK: { slug: 'hong-kong', locale: 'en-HK' },
  TR: { slug: 'turkey', locale: 'tr-TR' },
  AR: { slug: 'argentina', locale: 'es-AR' },
  EG: { slug: 'egypt', locale: 'ar-EG' },
  VN: { slug: 'vietnam', locale: 'vi-VN' },
  GR: { slug: 'greece', locale: 'el-GR' },
  CZ: { slug: 'czech-republic', locale: 'cs-CZ' },
  HU: { slug: 'hungary', locale: 'hu-HU' },
  IL: { slug: 'israel', locale: 'he-IL' },
  NG: { slug: 'nigeria', locale: 'en-NG' },
  KE: { slug: 'kenya', locale: 'en-KE' },
  IS: { slug: 'iceland', locale: 'is-IS' },
  CL: { slug: 'chile', locale: 'es-CL' },
  CO: { slug: 'colombia', locale: 'es-CO' },
  RU: { slug: 'russia', locale: 'ru-RU' },
  MA: { slug: 'morocco', locale: 'fr-MA' },
  AT: { slug: 'austria', locale: 'de-AT' },
  FI: { slug: 'finland', locale: 'fi-FI' },
  DK: { slug: 'denmark', locale: 'da-DK' },
  KZ: { slug: 'kazakhstan', locale: 'kk-KZ' },
  BG: { slug: 'bulgaria', locale: 'bg-BG' },
  SI: { slug: 'slovenia', locale: 'sl-SI' },
  SK: { slug: 'slovakia', locale: 'sk-SK' },
  LK: { slug: 'sri-lanka', locale: 'si-LK' },
  MM: { slug: 'myanmar', locale: 'my-MM' },
  KH: { slug: 'cambodia', locale: 'km-KH' },
  LU: { slug: 'luxembourg', locale: 'fr-LU' },
  MT: { slug: 'malta', locale: 'mt-MT' },
  CY: { slug: 'cyprus', locale: 'el-CY' },
  EE: { slug: 'estonia', locale: 'et-EE' },
  LV: { slug: 'latvia', locale: 'lv-LV' },
  LT: { slug: 'lithuania', locale: 'lt-LT' },
  MN: { slug: 'mongolia', locale: 'mn-MN' },
  BH: { slug: 'bahrain', locale: 'ar-BH' },
  AL: { slug: 'albania', locale: 'sq-AL' },
  RS: { slug: 'serbia', locale: 'sr-RS' },
  HR: { slug: 'croatia', locale: 'hr-HR' },
  UA: { slug: 'ukraine', locale: 'uk-UA' },
  GH: { slug: 'ghana', locale: 'en-GH' },
  TZ: { slug: 'tanzania', locale: 'en-TZ' },
  ET: { slug: 'ethiopia', locale: 'en-ET' },
  UG: { slug: 'uganda', locale: 'en-UG' },
  TN: { slug: 'tunisia', locale: 'fr-TN' },
  DZ: { slug: 'algeria', locale: 'fr-DZ' },
  IQ: { slug: 'iraq', locale: 'ar-IQ' },
  LB: { slug: 'lebanon', locale: 'en-LB' },
  JO: { slug: 'jordan', locale: 'en-JO' },
  VE: { slug: 'venezuela', locale: 'es-VE' },
  CR: { slug: 'costa-rica', locale: 'es-CR' },
  PA: { slug: 'panama', locale: 'es-PA' },
  EC: { slug: 'ecuador', locale: 'es-EC' },
  DO: { slug: 'dominican-republic', locale: 'es-DO' },
  TT: { slug: 'trinidad-and-tobago', locale: 'en-TT' },
  MV: { slug: 'maldives', locale: 'en-MV' },
  BT: { slug: 'bhutan', locale: 'en-BT' },
  BN: { slug: 'brunei', locale: 'en-BN' },
  NP: { slug: 'nepal', locale: 'en-NP' },
  IR: { slug: 'iran', locale: 'fa-IR' },
  JM: { slug: 'jamaica', locale: 'en-JM' },
  BB: { slug: 'barbados', locale: 'en-BB' },
  BS: { slug: 'bahamas', locale: 'en-BS' },
  SN: { slug: 'senegal', locale: 'fr-SN' },
  CI: { slug: 'cote-divoire', locale: 'fr-CI' },
  CM: { slug: 'cameroon', locale: 'fr-CM' },
  RW: { slug: 'rwanda', locale: 'en-RW' },
  ZM: { slug: 'zambia', locale: 'en-ZM' },
  AO: { slug: 'angola', locale: 'pt-AO' },
  MZ: { slug: 'mozambique', locale: 'pt-MZ' },
  UZ: { slug: 'uzbekistan', locale: 'uz-UZ' },
  KG: { slug: 'kyrgyzstan', locale: 'ky-KG' },
  BO: { slug: 'bolivia', locale: 'es-BO' },
  PY: { slug: 'paraguay', locale: 'es-PY' },
  UY: { slug: 'uruguay', locale: 'es-UY' },
  GT: { slug: 'guatemala', locale: 'es-GT' },
  HN: { slug: 'honduras', locale: 'es-HN' },
  FJ: { slug: 'fiji', locale: 'en-FJ' },
  PG: { slug: 'papua-new-guinea', locale: 'en-PG' },
  SZ: { slug: 'eswatini', locale: 'en-SZ' },
  OM: { slug: 'oman', locale: 'ar-OM' },
  TW: { slug: 'taiwan', locale: 'zh-TW' },
  LA: { slug: 'laos', locale: 'lo-LA' },
  TJ: { slug: 'tajikistan', locale: 'tg-TJ' },
  AF: { slug: 'afghanistan', locale: 'ps-AF' },
  MG: { slug: 'madagascar', locale: 'fr-MG' },
  MU: { slug: 'mauritius', locale: 'en-MU' },
  BW: { slug: 'botswana', locale: 'en-BW' },
  NA: { slug: 'namibia', locale: 'en-NA' },
  ZW: { slug: 'zimbabwe', locale: 'en-ZW' },
  MW: { slug: 'malawi', locale: 'en-MW' },
  LS: { slug: 'lesotho', locale: 'en-LS' },
  SD: { slug: 'sudan', locale: 'ar-SD' },
  LY: { slug: 'libya', locale: 'ar-LY' },
  ML: { slug: 'mali', locale: 'fr-ML' },
  CU: { slug: 'cuba', locale: 'es-CU' },
  SV: { slug: 'el-salvador', locale: 'es-SV' },
  NI: { slug: 'nicaragua', locale: 'es-NI' },
  GY: { slug: 'guyana', locale: 'en-GY' },
  BZ: { slug: 'belize', locale: 'en-BZ' },
  MD: { slug: 'moldova', locale: 'ro-MD' },
  BY: { slug: 'belarus', locale: 'be-BY' },
  BA: { slug: 'bosnia-and-herzegovina', locale: 'bs-BA' },
  MK: { slug: 'north-macedonia', locale: 'mk-MK' },
  ME: { slug: 'montenegro', locale: 'sr-ME' },
  XK: { slug: 'kosovo', locale: 'sq-XK' },
  AM: { slug: 'armenia', locale: 'hy-AM' },
  AZ: { slug: 'azerbaijan', locale: 'az-AZ' },
  GE: { slug: 'georgia', locale: 'ka-GE' },
  LI: { slug: 'liechtenstein', locale: 'de-LI' },
  BF: { slug: 'burkina-faso', locale: 'fr-BF' },
  NE: { slug: 'niger', locale: 'fr-NE' },
  TD: { slug: 'chad', locale: 'fr-TD' },
  BJ: { slug: 'benin', locale: 'fr-BJ' },
  TG: { slug: 'togo', locale: 'fr-TG' },
  LR: { slug: 'liberia', locale: 'en-LR' },
  SL: { slug: 'sierra-leone', locale: 'en-SL' },
  GN: { slug: 'guinea', locale: 'fr-GN' },
  GA: { slug: 'gabon', locale: 'fr-GA' },
  CV: { slug: 'cape-verde', locale: 'pt-CV' },
  AG: { slug: 'antigua-and-barbuda', locale: 'en-AG' },
  LC: { slug: 'saint-lucia', locale: 'en-LC' },
  GD: { slug: 'grenada', locale: 'en-GD' },
  HT: { slug: 'haiti', locale: 'fr-HT' },
  SR: { slug: 'suriname', locale: 'nl-SR' },
  WS: { slug: 'samoa', locale: 'en-WS' },
  TO: { slug: 'tonga', locale: 'en-TO' },
  VU: { slug: 'vanuatu', locale: 'en-VU' },
  SB: { slug: 'solomon-islands', locale: 'en-SB' },
  CK: { slug: 'cook-islands', locale: 'en-CK' },
  DM: { slug: 'dominica', locale: 'en-DM' },
};

// Crawler user-agent fragments that MUST see the homepage (`/`) un-redirected.
// Critical for SEO — never auto-redirect a search bot or Google won't index `/`.
const BOT_UA_FRAGMENTS = [
  'googlebot', 'bingbot', 'duckduckbot', 'yandexbot', 'baiduspider',
  'slurp', 'applebot', 'facebookexternalhit', 'twitterbot', 'linkedinbot',
  'whatsapp', 'discordbot', 'telegrambot', 'pinterestbot',
  'gptbot', 'oai-searchbot', 'chatgpt-user', 'perplexitybot',
  'claudebot', 'anthropic-ai', 'claude-web',
  'meta-externalagent', 'ccbot', 'crawler', 'spider', 'bot/',
  'lighthouse', 'pingdom', 'uptimerobot',
  'ahrefsbot', 'semrushbot', 'mj12bot',
  // Google AdSense / Ads verification crawlers
  'adsbot-google', 'adsbot', 'mediapartners-google',
];

function isBot(userAgent: string | null): boolean {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return BOT_UA_FRAGMENTS.some((frag) => ua.includes(frag));
}

interface PagesContext {
  request: Request & { cf?: { country?: string } };
  next: () => Promise<Response>;
}

export const onRequest: PagesFunction = async (context: PagesContext) => {
  const { request, next } = context;
  const url = new URL(request.url);

  // Canonical host: 301 www → apex for EVERY path, including bots.
  // www.calctube.com was serving the full site (HTTP 200) as a duplicate, which
  // GSC flagged as "Alternate page with proper canonical tag" and which splits
  // crawl signals. A permanent redirect consolidates everything onto calctube.com.
  // Runs before the bot/geo logic below so it applies site-wide, not just on `/`.
  if (url.hostname === 'www.calctube.com') {
    url.hostname = 'calctube.com';
    return Response.redirect(url.toString(), 301);
  }

  // Embeddable widgets must be framable by anyone — that is the entire point.
  // public/_headers sets `frame-ancestors 'self' …` on /*, and a second, laxer CSP
  // header would NOT loosen it: browsers enforce every CSP header they receive, so
  // two policies intersect and the strictest wins. The only way to widen it is to
  // replace the header on the response, which is what this does.
  if (url.pathname.startsWith('/embed/')) {
    const response = await next();
    const headers = new Headers(response.headers);
    headers.set('Content-Security-Policy', "frame-ancestors *");
    // X-Frame-Options has no "any origin" value and would override the CSP in
    // older browsers, so it must be absent rather than permissive.
    headers.delete('X-Frame-Options');
    // Spreading a Response would drop status/statusText — they are prototype
    // getters, not own properties, so a 404 here would be served as a 200.
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  // Only decorate the homepage with geo info. Deep pages serve as-requested.
  if (url.pathname !== '/' && url.pathname !== '/index.html') {
    return next();
  }

  // NO redirect: the homepage always serves 200 for everyone (users AND bots).
  // Auto-redirecting `/` to a deep country page handed all root-URL equity to one
  // calculator, bounced brand-search visitors, and (because bots were exempted)
  // served users and Googlebot different responses. Instead, we set a short-lived
  // cookie with the visitor's suggested country slug; the homepage reads it
  // client-side and shows a dismissible "try your country's calculator" banner.
  const country = request.cf?.country?.toUpperCase();
  const entry = country ? COUNTRY_MAP[country] : undefined;
  const response = await next();
  if (entry && !isBot(request.headers.get('user-agent'))) {
    const decorated = new Response(response.body, response);
    decorated.headers.append(
      'Set-Cookie',
      `geo-suggest=${entry.slug}; Path=/; Max-Age=86400; SameSite=Lax`
    );
    return decorated;
  }
  return response;
};

export const onRequestPost: PagesFunction = async (context) => context.next();
