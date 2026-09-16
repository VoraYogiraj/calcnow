/**
 * Generate the country flag suite + bank brand-circle suite.
 *
 *   public/flags/{slug}.svg   — 163 round country flags (downloaded from hatscripts/circle-flags, MIT-licensed)
 *   public/banks/{slug}.svg   — 72 brand-circle SVGs (acronym on hashed-but-stable color)
 *
 * Run: node scripts/generate-country-bank-logos.js
 *      npm run logos:countries-banks
 *
 * Re-run after editing src/data/mortgage-locales.ts or src/data/emi-banks.ts.
 */
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const flagsDir = path.join(projectRoot, 'public', 'flags');
const banksDir = path.join(projectRoot, 'public', 'banks');
fs.mkdirSync(flagsDir, { recursive: true });
fs.mkdirSync(banksDir, { recursive: true });

// ============================================================================
// COUNTRY FLAGS — slug → ISO 3166-1 alpha-2
// ============================================================================
const SLUG_TO_ISO = {
  india: 'in', uk: 'gb', canada: 'ca', australia: 'au', usa: 'us',
  germany: 'de', singapore: 'sg', spain: 'es', italy: 'it', france: 'fr',
  'new-zealand': 'nz', japan: 'jp', brazil: 'br', mexico: 'mx', 'south-africa': 'za',
  uae: 'ae', netherlands: 'nl', belgium: 'be', sweden: 'se', norway: 'no',
  poland: 'pl', ireland: 'ie', portugal: 'pt', switzerland: 'ch', malaysia: 'my',
  'saudi-arabia': 'sa', pakistan: 'pk', bangladesh: 'bd', indonesia: 'id', philippines: 'ph',
  thailand: 'th', qatar: 'qa', kuwait: 'kw', 'south-korea': 'kr', 'hong-kong': 'hk',
  turkey: 'tr', argentina: 'ar', egypt: 'eg', vietnam: 'vn', greece: 'gr',
  'czech-republic': 'cz', hungary: 'hu', israel: 'il', nigeria: 'ng', kenya: 'ke',
  iceland: 'is', chile: 'cl', colombia: 'co', russia: 'ru', morocco: 'ma',
  austria: 'at', finland: 'fi', denmark: 'dk', kazakhstan: 'kz', bulgaria: 'bg',
  slovenia: 'si', slovakia: 'sk', 'sri-lanka': 'lk', myanmar: 'mm', cambodia: 'kh',
  luxembourg: 'lu', malta: 'mt', cyprus: 'cy', estonia: 'ee', latvia: 'lv',
  lithuania: 'lt', mongolia: 'mn', bahrain: 'bh', albania: 'al', serbia: 'rs',
  croatia: 'hr', ukraine: 'ua', ghana: 'gh', tanzania: 'tz', ethiopia: 'et',
  uganda: 'ug', tunisia: 'tn', algeria: 'dz', iraq: 'iq', lebanon: 'lb',
  jordan: 'jo', venezuela: 've', 'costa-rica': 'cr', panama: 'pa', ecuador: 'ec',
  'dominican-republic': 'do', 'trinidad-and-tobago': 'tt', maldives: 'mv', bhutan: 'bt', brunei: 'bn',
  nepal: 'np', iran: 'ir', jamaica: 'jm', barbados: 'bb', bahamas: 'bs',
  senegal: 'sn', 'cote-divoire': 'ci', cameroon: 'cm', rwanda: 'rw', zambia: 'zm',
  angola: 'ao', mozambique: 'mz', uzbekistan: 'uz', kyrgyzstan: 'kg', bolivia: 'bo',
  paraguay: 'py', uruguay: 'uy', guatemala: 'gt', honduras: 'hn', fiji: 'fj',
  'papua-new-guinea': 'pg', eswatini: 'sz', oman: 'om', taiwan: 'tw', laos: 'la',
  tajikistan: 'tj', afghanistan: 'af', madagascar: 'mg', mauritius: 'mu', botswana: 'bw',
  namibia: 'na', zimbabwe: 'zw', malawi: 'mw', lesotho: 'ls', sudan: 'sd',
  libya: 'ly', mali: 'ml', cuba: 'cu', 'el-salvador': 'sv', nicaragua: 'ni',
  guyana: 'gy', belize: 'bz', moldova: 'md', belarus: 'by', 'bosnia-and-herzegovina': 'ba',
  'north-macedonia': 'mk', montenegro: 'me', kosovo: 'xk', armenia: 'am', azerbaijan: 'az',
  georgia: 'ge', liechtenstein: 'li', 'burkina-faso': 'bf', niger: 'ne', chad: 'td',
  benin: 'bj', togo: 'tg', liberia: 'lr', 'sierra-leone': 'sl', guinea: 'gn',
  gabon: 'ga', 'cape-verde': 'cv', 'antigua-and-barbuda': 'ag', 'saint-lucia': 'lc', grenada: 'gd',
  haiti: 'ht', suriname: 'sr', samoa: 'ws', tonga: 'to', vanuatu: 'vu',
  'solomon-islands': 'sb', 'cook-islands': 'ck', dominica: 'dm',
  // Extras seen in some pSEO routes
  china: 'cn',
  // Supranational / multi-country flags used by currencies (EUR, XAF, XOF, XCD)
  eu: 'eu',
};

async function downloadFlag(slug, iso) {
  const out = path.join(flagsDir, `${slug}.svg`);
  if (fs.existsSync(out)) return { slug, status: 'cached' };
  const url = `https://hatscripts.github.io/circle-flags/flags/${iso}.svg`;
  try {
    const res = await fetch(url);
    if (!res.ok) return { slug, status: `HTTP ${res.status}`, url };
    const svg = await res.text();
    fs.writeFileSync(out, svg);
    return { slug, status: 'ok', size: svg.length };
  } catch (e) {
    return { slug, status: `error: ${e.message}`, url };
  }
}

async function generateFlags() {
  console.log(`\n🌍 Downloading ${Object.keys(SLUG_TO_ISO).length} country flags from circle-flags…`);
  const results = await Promise.all(
    Object.entries(SLUG_TO_ISO).map(([slug, iso]) => downloadFlag(slug, iso))
  );
  const ok = results.filter((r) => r.status === 'ok' || r.status === 'cached');
  const failed = results.filter((r) => !['ok', 'cached'].includes(r.status));
  console.log(`  ✓ ${ok.length} flags downloaded`);
  if (failed.length) {
    console.log(`  ✗ ${failed.length} failed:`);
    failed.forEach((r) => console.log(`     ${r.slug}: ${r.status}`));
  }
}

// ============================================================================
// BANK LOGOS — generate branded SVG circles
// ============================================================================
// Stable per-slug color via FNV-1a hash → 12-color palette (tasteful, not garish).
const BRAND_PALETTE = [
  '#2563eb', // blue-600
  '#dc2626', // red-600
  '#16a34a', // green-600
  '#9333ea', // purple-600
  '#ea580c', // orange-600
  '#0891b2', // cyan-600
  '#db2777', // pink-600
  '#65a30d', // lime-600
  '#475569', // slate-600
  '#7c3aed', // violet-600
  '#0d9488', // teal-600
  '#b45309', // amber-700
];

function colorForSlug(slug) {
  let h = 2166136261;
  for (let i = 0; i < slug.length; i++) {
    h ^= slug.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return BRAND_PALETTE[h % BRAND_PALETTE.length];
}

// Initials: prefer all uppercase letters in bankName (e.g., "HDFC" → "HDFC", "Axis Bank" → "AB"),
// fall back to first 2 letters of the slug.
function initialsFor(bankName, slug) {
  const ups = (bankName.match(/[A-Z]/g) || []).join('').slice(0, 4);
  if (ups.length >= 2) return ups;
  return slug
    .split('-')
    .filter((p) => !['bank', 'co', 'op'].includes(p))
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join('') || slug.slice(0, 2).toUpperCase();
}

function bankSvg(initials, color) {
  // 64×64 viewBox, font size scales with initial length
  const fontSize = initials.length <= 2 ? 28 : initials.length === 3 ? 22 : 18;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <circle cx="32" cy="32" r="32" fill="${color}"/>
  <text x="32" y="32" text-anchor="middle" dominant-baseline="central"
        font-family="Inter Tight, -apple-system, system-ui, sans-serif"
        font-weight="800" font-size="${fontSize}" fill="#ffffff" letter-spacing="-0.02em">${initials}</text>
</svg>`;
}

async function generateBankLogos() {
  // Read emi-banks.ts; pluck slug + bankName pairs via regex (avoids needing to import TS)
  const tsSource = fs.readFileSync(path.join(projectRoot, 'src', 'data', 'emi-banks.ts'), 'utf-8');
  const banks = [];
  const re = /slug:\s*['"]([^'"]+)['"][\s\S]*?bankName:\s*['"]([^'"]+)['"]/g;
  let m;
  while ((m = re.exec(tsSource)) !== null) {
    banks.push({ slug: m[1], bankName: m[2] });
  }
  console.log(`\n🏦 Generating ${banks.length} bank brand-circle SVGs…`);
  let count = 0;
  for (const { slug, bankName } of banks) {
    const initials = initialsFor(bankName, slug);
    const color = colorForSlug(slug);
    const svg = bankSvg(initials, color);
    fs.writeFileSync(path.join(banksDir, `${slug}.svg`), svg);
    count++;
  }
  console.log(`  ✓ ${count} bank logos written to public/banks/`);
}

// ============================================================================
// INDIAN STATE LOGOS — branded circles with 2-letter state abbreviation
// ============================================================================
const statesDir = path.join(projectRoot, 'public', 'states');
fs.mkdirSync(statesDir, { recursive: true });

// Standard Indian state postal codes (2-letter). Slugs that don't map fall back
// to first-2-letters-of-slug uppercase.
const STATE_ABBR = {
  maharashtra: 'MH', karnataka: 'KA', 'tamil-nadu': 'TN', delhi: 'DL',
  'uttar-pradesh': 'UP', gujarat: 'GJ', 'west-bengal': 'WB', telangana: 'TG',
  rajasthan: 'RJ', haryana: 'HR', punjab: 'PB', kerala: 'KL',
  'andhra-pradesh': 'AP', 'madhya-pradesh': 'MP', bihar: 'BR', odisha: 'OD',
  assam: 'AS', jharkhand: 'JH', chhattisgarh: 'CG', uttarakhand: 'UK',
  'himachal-pradesh': 'HP', goa: 'GA', tripura: 'TR', manipur: 'MN',
  meghalaya: 'ML', nagaland: 'NL', mizoram: 'MZ', sikkim: 'SK',
  'jammu-and-kashmir': 'JK', ladakh: 'LA', puducherry: 'PY',
  'andaman-and-nicobar': 'AN', chandigarh: 'CH', 'dadra-nagar-haveli': 'DN',
  lakshadweep: 'LD', 'arunachal-pradesh': 'AR',
};

function stateSvg(abbr, color) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <circle cx="32" cy="32" r="32" fill="${color}"/>
  <text x="32" y="32" text-anchor="middle" dominant-baseline="central"
        font-family="Inter Tight, -apple-system, system-ui, sans-serif"
        font-weight="800" font-size="26" fill="#ffffff" letter-spacing="-0.02em">${abbr}</text>
</svg>`;
}

async function generateStateLogos() {
  const tsSource = fs.readFileSync(path.join(projectRoot, 'src', 'data', 'india-states.ts'), 'utf-8');
  const states = [];
  const re = /slug:\s*['"]([^'"]+)['"][\s\S]*?name:\s*['"]([^'"]+)['"]/g;
  let m;
  while ((m = re.exec(tsSource)) !== null) {
    states.push({ slug: m[1], name: m[2] });
  }
  console.log(`\n🏛️  Generating ${states.length} state circle SVGs…`);
  let count = 0;
  for (const { slug, name } of states) {
    const abbr = STATE_ABBR[slug] || slug.slice(0, 2).toUpperCase();
    const color = colorForSlug(slug);
    fs.writeFileSync(path.join(statesDir, `${slug}.svg`), stateSvg(abbr, color));
    count++;
  }
  console.log(`  ✓ ${count} state logos written to public/states/`);
}

// ============================================================================
// Main
// ============================================================================
await generateFlags();
await generateBankLogos();
await generateStateLogos();
console.log('\n✅ Country + bank + state logo generation complete.');
