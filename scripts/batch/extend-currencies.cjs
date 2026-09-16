#!/usr/bin/env node
// Auto-extend the currencies dict in src/data/currency-pairs.ts with placeholder entries
// for ISO codes not yet defined. Uses a built-in static ISO 4217 + emoji map (no paid APIs).
//
// Usage:  node scripts/batch/extend-currencies.cjs CODE1 CODE2 ...

const fs = require('fs');
const path = require('path');

// Compact static dictionary of common currency codes. Add more as the long tail grows.
// Format: CODE: [symbol, name, flag, locale, popularUses (array, 1-3 short phrases)]
const DICT = {
  JMD: ['J$', 'Jamaican Dollar', '🇯🇲', 'en-JM', ['Jamaican diaspora remittances', 'Caribbean tourism', 'BPO payments']],
  BBD: ['Bds$', 'Barbadian Dollar', '🇧🇧', 'en-BB', ['Caribbean tourism', 'USD-pegged business', 'expat remittances']],
  BSD: ['B$', 'Bahamian Dollar', '🇧🇸', 'en-BS', ['Bahamas tourism', 'offshore banking', '1:1 USD peg']],
  XOF: ['CFA', 'West African CFA Franc', '🇸🇳', 'fr-SN', ['WAEMU regional trade', 'EUR-pegged business', 'diaspora remittances']],
  XAF: ['FCFA', 'Central African CFA Franc', '🇨🇲', 'fr-CM', ['CEMAC regional trade', 'oil exporter currency', 'EUR-pegged transactions']],
  RWF: ['FRw', 'Rwandan Franc', '🇷🇼', 'rw-RW', ['Rwanda diaspora remittances', 'Kigali tech hub trade', 'tourism']],
  ZMW: ['ZK', 'Zambian Kwacha', '🇿🇲', 'en-ZM', ['copper export trade', 'debt restructuring flows', 'diaspora remittances']],
  AOA: ['Kz', 'Angolan Kwanza', '🇦🇴', 'pt-AO', ['oil export trade', 'IMF programme flows', 'Portugal diaspora remittances']],
  MZN: ['MT', 'Mozambican Metical', '🇲🇿', 'pt-MZ', ['LNG project trade', 'South Africa migrant remittances', 'IMF-programme economy']],
  UZS: ["so'm", 'Uzbekistani Som', '🇺🇿', 'uz-UZ', ['Russia migrant remittances', 'post-2017 FX liberalization', 'gold export trade']],
  BOB: ['Bs.', 'Bolivian Boliviano', '🇧🇴', 'es-BO', ['USD peg use cases', 'gas export economy', 'parallel-market flows']],
  PYG: ['₲', 'Paraguayan Guarani', '🇵🇾', 'es-PY', ['soybean/beef export trade', 'LATAM stability haven', 'foreign retiree economy']],
  UYU: ['$U', 'Uruguayan Peso', '🇺🇾', 'es-UY', ['Uruguay banking hub', 'forestry FDI', 'investment-grade flows']],
  GTQ: ['Q', 'Guatemalan Quetzal', '🇬🇹', 'es-GT', ['US diaspora remittances', 'coffee/sugar trade', 'tourism']],
  FJD: ['FJ$', 'Fijian Dollar', '🇫🇯', 'en-FJ', ['Pacific tourism', 'seasonal worker remittances', 'basket-managed currency']],
  // Additional long-tail codes
  KZT: ['₸', 'Kazakhstani Tenge', '🇰🇿', 'kk-KZ', ['oil export trade', 'Russia migrant remittances', 'Astana finance hub']],
  TZS: ['TSh', 'Tanzanian Shilling', '🇹🇿', 'sw-TZ', ['East Africa trade', 'gold/agriculture exports', 'tourism']],
  UGX: ['USh', 'Ugandan Shilling', '🇺🇬', 'en-UG', ['East Africa trade', 'coffee exports', 'oil sector emergence']],
  XPF: ['F', 'CFP Franc', '🇵🇫', 'fr-PF', ['French Pacific territories', 'EUR peg', 'tourism economy']],
  MUR: ['Rs', 'Mauritian Rupee', '🇲🇺', 'en-MU', ['Mauritius offshore finance', 'tourism', 'Indian diaspora link']],
  MAD: ['DH', 'Moroccan Dirham', '🇲🇦', 'ar-MA', ['Morocco tourism', 'Europe-Africa trade', 'phosphate exports']],
  TND: ['DT', 'Tunisian Dinar', '🇹🇳', 'ar-TN', ['Tunisia tourism', 'Europe-Africa trade', 'olive oil exports']],
  DZD: ['DA', 'Algerian Dinar', '🇩🇿', 'ar-DZ', ['oil/gas exports', 'France diaspora remittances', 'Mediterranean trade']],
  LYD: ['LD', 'Libyan Dinar', '🇱🇾', 'ar-LY', ['oil exports', 'reconstruction economy', 'parallel-market FX']],
  SDG: ['SDG', 'Sudanese Pound', '🇸🇩', 'ar-SD', ['post-conflict economy', 'gold exports', 'diaspora remittances']],
  YER: ['YR', 'Yemeni Rial', '🇾🇪', 'ar-YE', ['post-conflict economy', 'diaspora remittances', 'humanitarian flows']],
  SYP: ['SP', 'Syrian Pound', '🇸🇾', 'ar-SY', ['post-conflict economy', 'sanctioned-corridor FX', 'parallel market']],
  AFN: ['Af', 'Afghan Afghani', '🇦🇫', 'ps-AF', ['post-Taliban economy', 'humanitarian flows', 'remittances']],
  TJS: ['SM', 'Tajikistani Somoni', '🇹🇯', 'tg-TJ', ['Russia migrant remittances', 'cotton/aluminum exports', 'CIS trade']],
  KGS: ['с', 'Kyrgyz Som', '🇰🇬', 'ky-KG', ['Russia migrant remittances', 'gold exports', 'EAEU trade']],
  TMT: ['T', 'Turkmenistani Manat', '🇹🇲', 'tk-TM', ['gas exports', 'closed economy', 'state-controlled FX']],
  MNT: ['₮', 'Mongolian Tögrög', '🇲🇳', 'mn-MN', ['mining exports', 'China trade', 'commodity-driven economy']],
  KHR: ['៛', 'Cambodian Riel', '🇰🇭', 'km-KH', ['tourism', 'garment exports', 'dollarized economy']],
  LAK: ['₭', 'Lao Kip', '🇱🇦', 'lo-LA', ['China trade', 'hydropower exports', 'Thailand corridor']],
  BND: ['B$', 'Brunei Dollar', '🇧🇳', 'en-BN', ['SGD peg', 'oil/gas exports', 'banking hub']],
  PGK: ['K', 'Papua New Guinea Kina', '🇵🇬', 'en-PG', ['LNG exports', 'gold/copper mining', 'Pacific trade']],
  WST: ['T', 'Samoan Tala', '🇼🇸', 'en-WS', ['Pacific tourism', 'diaspora remittances NZ/Aus', 'fisheries']],
  TOP: ['T$', 'Tongan Paʻanga', '🇹🇴', 'en-TO', ['Pacific tourism', 'diaspora remittances', 'agriculture exports']],
  VUV: ['VT', 'Vanuatu Vatu', '🇻🇺', 'en-VU', ['Pacific tourism', 'offshore finance', 'agriculture exports']],
  SBD: ['SI$', 'Solomon Islands Dollar', '🇸🇧', 'en-SB', ['Pacific tourism', 'logging/fisheries exports', 'AU/NZ aid flows']],
  SCR: ['SR', 'Seychelles Rupee', '🇸🇨', 'en-SC', ['Seychelles tourism', 'offshore finance', 'fisheries exports']],
  KMF: ['CF', 'Comorian Franc', '🇰🇲', 'fr-KM', ['EUR peg via XAF zone', 'vanilla/cloves exports', 'France diaspora']],
  DJF: ['Fdj', 'Djiboutian Franc', '🇩🇯', 'fr-DJ', ['USD peg', 'port/logistics hub', 'remittances']],
  SOS: ['Sh', 'Somali Shilling', '🇸🇴', 'so-SO', ['parallel-market FX', 'diaspora remittances', 'livestock exports']],
  SLE: ['Le', 'Sierra Leonean Leone', '🇸🇱', 'en-SL', ['mining exports', 'post-Ebola recovery', 'diaspora remittances']],
  LRD: ['L$', 'Liberian Dollar', '🇱🇷', 'en-LR', ['dual USD/LRD economy', 'iron ore/rubber exports', 'diaspora flows']],
  GMD: ['D', 'Gambian Dalasi', '🇬🇲', 'en-GM', ['tourism', 'groundnut exports', 'diaspora remittances']],
  CVE: ['$', 'Cape Verdean Escudo', '🇨🇻', 'pt-CV', ['EUR peg', 'tourism', 'Portugal diaspora']],
  STN: ['Db', 'São Tomé Dobra', '🇸🇹', 'pt-ST', ['EUR peg', 'cocoa exports', 'oil prospect economy']],
  ERN: ['Nfk', 'Eritrean Nakfa', '🇪🇷', 'ti-ER', ['state-controlled FX', 'remittances', 'mining exports']],
  SSP: ['SS£', 'South Sudanese Pound', '🇸🇸', 'en-SS', ['oil exports', 'post-conflict economy', 'parallel market']],
  HTG: ['G', 'Haitian Gourde', '🇭🇹', 'fr-HT', ['US diaspora remittances', 'parallel-market FX', 'post-quake economy']],
  NIO: ['C$', 'Nicaraguan Córdoba', '🇳🇮', 'es-NI', ['US diaspora remittances', 'coffee exports', 'crawling peg']],
  HNL: ['L', 'Honduran Lempira', '🇭🇳', 'es-HN', ['US diaspora remittances', 'coffee/textile exports', 'Central America trade']],
  SRD: ['SRD', 'Surinamese Dollar', '🇸🇷', 'nl-SR', ['oil/gold exports', 'Netherlands diaspora', 'IMF programme']],
  GYD: ['G$', 'Guyanese Dollar', '🇬🇾', 'en-GY', ['oil boom economy', 'Caribbean trade', 'diaspora flows']],
  ARS: ['$', 'Argentine Peso', '🇦🇷', 'es-AR', ['crawling-peg dollar control', 'parallel-market FX (blue dollar)', 'IMF programme economy']],
  VES: ['Bs.S', 'Venezuelan Bolivar', '🇻🇪', 'es-VE', ['hyperinflation aftermath', 'parallel-market FX', 'dollarized informal economy']],
  UAH: ['₴', 'Ukrainian Hryvnia', '🇺🇦', 'uk-UA', ['post-war reconstruction', 'EU integration trade', 'diaspora remittances from Poland/EU']],
  AMD: ['֏', 'Armenian Dram', '🇦🇲', 'hy-AM', ['Russia migrant remittances', 'tech sector growth (Yandex relocations)', 'diaspora from US/France']],
  GEL: ['₾', 'Georgian Lari', '🇬🇪', 'ka-GE', ['Russia/Belarus migrant inflows', 'EU candidate status', 'banking hub for region']],
  MDL: ['L', 'Moldovan Leu', '🇲🇩', 'ro-MD', ['EU accession path', 'Romania diaspora link', 'agriculture exports']],
  MVR: ['Rf', 'Maldivian Rufiyaa', '🇲🇻', 'dv-MV', ['Maldives tourism', 'managed USD peg around 15.42', 'resort economy USD-acceptance']],
  MAD: ['DH', 'Moroccan Dirham', '🇲🇦', 'ar-MA', ['Morocco tourism', 'France/Spain diaspora', '60/40 EUR-USD basket peg']],
  TZS: ['TSh', 'Tanzanian Shilling', '🇹🇿', 'sw-TZ', ['Serengeti/Zanzibar tourism', 'gold/cashew exports', 'EACOP oil pipeline economy']],
  UGX: ['USh', 'Ugandan Shilling', '🇺🇬', 'en-UG', ['coffee/gold exports', 'Lake Albert oil sector', 'MTN MoMo remittance corridor']],
  TND: ['DT', 'Tunisian Dinar', '🇹🇳', 'ar-TN', ['Carthage tourism', 'France/Italy diaspora', 'BCT-controlled non-deliverable currency']],
  DZD: ['DA', 'Algerian Dinar', '🇩🇿', 'ar-DZ', ['Sonatrach oil exports', 'France diaspora corridor', 'parallel market premium']],
  LYD: ['LD', 'Libyan Dinar', '🇱🇾', 'ar-LY', ['NOC oil export receipts', 'post-2021 CBL unification', 'oil services contractor payments']],
  JOD: ['JD', 'Jordanian Dinar', '🇯🇴', 'ar-JO', ['USD peg at 0.709 since 1995', 'refugee-hosting economy', 'IMF program disbursements']],
  ILS: ['₪', 'Israeli New Shekel', '🇮🇱', 'he-IL', ['tech ecosystem (Mobileye/Wix/Check Point)', 'dual-citizen aliyah flows', 'BoI managed float']],
  AZN: ['₼', 'Azerbaijani Manat', '🇦🇿', 'az-AZ', ['Caspian oil/gas exports', 'soft USD peg at 1.70', 'AMCGF social mortgage economy']],
  BYN: ['Br', 'Belarusian Ruble', '🇧🇾', 'be-BY', ['sanctioned economy', 'state-controlled banking', 'Russia-aligned trade']],
  MKD: ['ден', 'Macedonian Denar', '🇲🇰', 'mk-MK', ['de facto EUR peg ~61.5', 'EU candidate status', 'diaspora remittances Germany/Italy']],
  BAM: ['KM', 'Bosnia Convertible Mark', '🇧🇦', 'bs-BA', ['hard EUR peg 1.95583 currency board', 'diaspora property investment', 'post-war reconstruction economy']],
  ALL: ['L', 'Albanian Lek', '🇦🇱', 'sq-AL', ['Italian diaspora flows', 'Riviera tourism boom', 'Tirana property growth']],
  HTG: ['G', 'Haitian Gourde', '🇭🇹', 'fr-HT', ['US diaspora 20% of GDP', 'post-quake economy', 'severe inflation/depreciation']],
  SRD: ['SRD', 'Surinamese Dollar', '🇸🇷', 'nl-SR', ['offshore oil discoveries (Block 58)', 'Netherlands diaspora link', 'post-IMF stabilization']],
  XCD: ['EC$', 'East Caribbean Dollar', '🇩🇲', 'en-DM', ['hard USD peg at 2.70 since 1976', 'ECCU multi-state currency', 'CBI program economy']],
  WST: ['WS$', 'Samoan Tala', '🇼🇸', 'en-WS', ['Pacific tourism', 'AU/NZ diaspora remittances', 'basket-managed currency']],
  TOP: ['T$', 'Tongan Paʻanga', '🇹🇴', 'en-TO', ['NZ/AU/US diaspora 40%+ GDP', 'Pacific remittance-heavy economy', 'basket-managed currency']],
  CRC: ['₡', 'Costa Rican Colón', '🇨🇷', 'es-CR', ['US retiree/digital nomad inflows', 'tourism + Intel/medical device FDI', 'BCCR-managed float appreciation']],
  PAB: ['B/.', 'Panamanian Balboa', '🇵🇦', 'es-PA', ['1:1 USD peg since 1904', 'dollarized economy', 'Pensionado retiree corridor']],
  DOP: ['RD$', 'Dominican Peso', '🇩🇴', 'es-DO', ['US diaspora $10B+ annual remittances', 'tourism (Punta Cana) economy', 'managed float depreciation']],
  BGN: ['лв', 'Bulgarian Lev', '🇧🇬', 'bg-BG', ['hard EUR peg 1.95583', 'ERM II member since 2020', 'eurozone accession candidate']],
  KZT: ['₸', 'Kazakhstani Tenge', '🇰🇿', 'kk-KZ', ['oil/uranium export economy', 'Russia-sanctions bypass hub', 'Kaspi.kz super-app dominance']],
  TTD: ['TT$', 'Trinidad and Tobago Dollar', '🇹🇹', 'en-TT', ['LNG/methanol export economy', 'managed float ~6.75-6.80 USD', 'Carnival tourism + NY/Toronto diaspora']],
  CUP: ['₱', 'Cuban Peso', '🇨🇺', 'es-CU', ['dual-rate regime (official 24 vs informal 370)', 'OFAC sanctions block bank wires', 'Cuban-American Miami diaspora']],
  PGK: ['K', 'Papua New Guinea Kina', '🇵🇬', 'en-PG', ['LNG and gold export receipts', 'managed float with periodic FX rationing', 'expat oil/mining workers']],
  BIF: ['FBu', 'Burundian Franc', '🇧🇮', 'fr-BI', ['aid-dependent fragile economy', 'NGO/USAID disbursement-driven', 'coffee/tea export receipts']],
  ISK: ['kr', 'Icelandic Krona', '🇮🇸', 'is-IS', ['tourism-driven economy', 'aluminum + geothermal data centers', 'cashless society USD card-tap']],
  RSD: ['дин', 'Serbian Dinar', '🇷🇸', 'sr-RS', ['informal EUR peg ~117 RSD', 'Belgrade tech outsourcing hub', 'Germany/Austria diaspora remittances']],
  MGA: ['Ar', 'Malagasy Ariary', '🇲🇬', 'mg-MG', ['vanilla export economy (80% global supply)', 'sapphire mining', 'ecotourism niche']],
  BWP: ['P', 'Botswana Pula', '🇧🇼', 'en-BW', ['De Beers diamond royalty economy', 'crawling peg vs ZAR-SDR basket', 'one of Africa\'s most stable currencies']],
  MWK: ['MK', 'Malawian Kwacha', '🇲🇼', 'en-MW', ['aid-dependent economy', '44% devaluation Nov 2023 (IMF)', 'tobacco export receipts']],
};

const [, , ...codes] = process.argv;
if (codes.length === 0) {
  console.error('Usage: node scripts/batch/extend-currencies.cjs CODE1 CODE2 ...');
  console.error('Available codes in static dict:', Object.keys(DICT).join(', '));
  process.exit(2);
}

const targetFile = path.resolve(__dirname, '..', '..', 'src/data/currency-pairs.ts');
const src = fs.readFileSync(targetFile, 'utf8');

// Find the closing of the currencies dict — locate the `};` that ends the `currencies: Record<string, Currency> = {...}` block.
// Strategy: find the start of the dict, then find the matching `};` on its own line that follows the last `  XXX: { ... },` line.
const dictStart = src.search(/currencies:\s*Record<string,\s*Currency>\s*=\s*\{/);
if (dictStart === -1) {
  console.error('Could not locate currencies dict in src/data/currency-pairs.ts');
  process.exit(1);
}
// Find the first `^};$` after dictStart
const tail = src.slice(dictStart);
const closeRel = tail.search(/\n\};\n/);
if (closeRel === -1) {
  console.error('Could not locate closing of currencies dict');
  process.exit(1);
}
const closeAbs = dictStart + closeRel;

const existingCodes = new Set();
const codeRe = /^\s+([A-Z]{3}):\s*\{/gm;
let mm;
while ((mm = codeRe.exec(src)) !== null) existingCodes.add(mm[1]);

const toInsert = [];
const missing = [];
for (const code of codes) {
  if (existingCodes.has(code)) continue;
  if (!DICT[code]) {
    missing.push(code);
    continue;
  }
  const [symbol, name, flag, locale, uses] = DICT[code];
  const safeSymbol = symbol.replace(/'/g, "\\'");
  const usesStr = uses.map(u => `'${u.replace(/'/g, "\\'")}'`).join(', ');
  toInsert.push(`  ${code}: { code: '${code}', symbol: '${safeSymbol}', name: '${name}', flag: '${flag}', locale: '${locale}', popularUses: [${usesStr}] },`);
}

if (missing.length > 0) {
  console.error(`❌ No static definitions for: ${missing.join(', ')}`);
  console.error(`   Add them manually to scripts/batch/extend-currencies.cjs DICT first.`);
  process.exit(1);
}

if (toInsert.length === 0) {
  console.log('All codes already defined. No changes.');
  process.exit(0);
}

// Splice new entries in just before `\n};\n` at closeAbs
const newSrc = src.slice(0, closeAbs) + '\n' + toInsert.join('\n') + src.slice(closeAbs);

if (newSrc === src) {
  console.error('Failed to splice — closeAbs anchor incorrect.');
  process.exit(1);
}

fs.writeFileSync(targetFile, newSrc);
console.log(`✅ Added ${toInsert.length} currency definitions: ${toInsert.map(l => l.match(/^  ([A-Z]{3}):/)[1]).join(', ')}`);
