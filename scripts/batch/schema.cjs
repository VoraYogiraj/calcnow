// Data shape contracts for each pSEO entry type.
// Used by lint.cjs to catch agent output drift BEFORE it hits the build.

const SINGLE_EMOJI = /^(\p{Extended_Pictographic}(\u{FE0F})?(\u{200D}\p{Extended_Pictographic}(\u{FE0F})?)*(\p{Emoji_Modifier})?|\p{Emoji_Component}+|🏛️|🏙️|🇦-🇿{2}|.{1,4})$/u;
const ISO_4217 = /^[A-Z]{3}$/;
const SLUG = /^[a-z][a-z0-9-]*[a-z0-9]$/;

const schemas = {
  country: {
    targetFile: 'src/data/mortgage-locales.ts',
    marker: "];\n\n// Helpers\nexport function getLocaleBySlug",
    arrayName: 'mortgageLocales',
    slugField: 'slug',
    required: [
      'slug', 'country', 'flag', 'language', 'currency', 'currencySymbol',
      'locale', 'termLocalName', 'typicalAmount', 'typicalRate', 'typicalTerm',
      'amountRange', 'rateRange', 'marketContext', 'rateContext',
      'taxAndRegulation', 'faqs', 'workedExample', 'metaKeywords',
    ],
    forbidden: ['trendNote', 'searchVolume', 'category', 'commonAmounts', 'topAngle', 'bestFor'],
    rules: [
      { field: 'currency', test: v => ISO_4217.test(stripQ(v)), msg: 'currency must be 3-letter ISO 4217' },
      { field: 'typicalRate', test: v => Number(v) > 0, msg: 'typicalRate must be > 0' },
      { field: 'typicalAmount', test: v => Number(v) > 0, msg: 'typicalAmount must be > 0' },
      { field: 'typicalTerm', test: v => Number(v) > 0 && Number(v) <= 50, msg: 'typicalTerm must be 1-50' },
      { field: 'slug', test: v => SLUG.test(stripQ(v)), msg: 'slug must be kebab-case' },
    ],
  },
  city: {
    targetFile: 'src/data/india-cities.ts',
    marker: "];\n\nexport function getCityBySlug",
    arrayName: 'indiaCities',
    slugField: 'slug',
    required: [
      'slug', 'name', 'stateName', 'stateSlug', 'flag', 'hraTier',
      'stampDutyPct', 'registrationPct', 'womenStampDutyDiscount',
      'typicalLoanAmount', 'typicalRate', 'typicalTerm', 'amountRange',
      'micromarkets', 'topEmployers', 'marketContext', 'uniqueAngle',
      'topLenders', 'faqs', 'metaKeywords',
    ],
    forbidden: ['topAngle', 'bestFor', 'preApprovalEmployers'],
    rules: [
      { field: 'hraTier', test: v => /^'(metro|non-metro)'$/.test(v), msg: "hraTier must be 'metro' or 'non-metro'" },
      { field: 'typicalRate', test: v => Number(v) > 0, msg: 'typicalRate must be > 0' },
      { field: 'slug', test: v => SLUG.test(stripQ(v)) && !v.includes('home-loan-emi-calculator'), msg: 'slug must be clean kebab-case (no template prefix)' },
      { field: 'stampDutyPct', test: v => Number(v) >= 0 && Number(v) <= 15, msg: 'stampDutyPct must be 0-15' },
    ],
  },
  currency: {
    targetFile: 'src/data/currency-pairs.ts',
    marker: "];\n\nexport function getPairBySlug",
    arrayName: 'currencyPairs',
    slugField: 'slug',
    required: ['slug', 'from', 'to', 'rate', 'lastUpdated', 'yearAgoRate', 'fiveYearAgoRate', 'popularity', 'context', 'faqs', 'metaKeywords'],
    forbidden: ['trendNote', 'searchVolume', 'category', 'commonAmounts'],
    rules: [
      { field: 'from', test: v => ISO_4217.test(stripQ(v)), msg: 'from must be ISO 4217' },
      { field: 'to', test: v => ISO_4217.test(stripQ(v)), msg: 'to must be ISO 4217' },
      { field: 'rate', test: v => Number(v) > 0, msg: 'rate must be > 0' },
      { field: 'yearAgoRate', test: v => Number(v) > 0, msg: 'yearAgoRate must be > 0' },
      { field: 'fiveYearAgoRate', test: v => Number(v) > 0, msg: 'fiveYearAgoRate must be > 0' },
      { field: 'popularity', test: v => /^'(huge|high|medium)'$/.test(v), msg: "popularity must be 'huge', 'high', or 'medium'" },
      { field: 'slug', test: v => /^'[a-z]{3}-to-[a-z]{3}'$/.test(v), msg: "slug must be 'xxx-to-yyy' format" },
    ],
  },
  bank: {
    targetFile: 'src/data/emi-banks.ts',
    marker: "];\n\nexport function getBankBySlug",
    arrayName: 'emiBanks',
    slugField: 'slug',
    required: [
      'slug', 'bankName', 'fullName', 'emoji', 'hqLocation',
      'homeLoanRate', 'personalLoanRate', 'carLoanRate',
      'processingFee', 'prepaymentPolicy',
      'marketContext', 'uniqueAngle', 'productHighlights',
      'faqs', 'metaKeywords',
    ],
    forbidden: ['topAngle', 'bestFor', 'processingFeePct', 'processingFeeMax', 'preApprovalPossible', 'womenBorrowerDiscount', 'bankType', 'established', 'branches'],
    rules: [
      { field: 'emoji', test: v => { const s = stripQ(v); return s.length <= 4 && !/^[A-Z]{2,}$/.test(s); }, msg: 'emoji must be a single emoji char, not text code like LICHF' },
      { field: 'processingFee', test: v => v.startsWith("'") || v.startsWith('"'), msg: 'processingFee must be a string, not an object' },
      { field: 'prepaymentPolicy', test: v => v.startsWith("'") || v.startsWith('"'), msg: 'prepaymentPolicy must be a string' },
      { field: 'slug', test: v => SLUG.test(stripQ(v)) && !v.includes('home-loan-emi-calculator') && !v.includes('emi-calculator-'), msg: 'slug must be clean kebab-case (no template prefix)' },
    ],
    // Nested rate-object rules
    nestedRules: [
      { field: 'homeLoanRate', subfields: ['min', 'max', 'typical'], test: v => v > 0, msg: 'homeLoanRate values must be > 0' },
      { field: 'personalLoanRate', subfields: ['min', 'max', 'typical'], test: v => v > 0, msg: 'personalLoanRate values must be > 0' },
      { field: 'carLoanRate', subfields: ['min', 'max', 'typical'], test: v => v > 0, msg: 'carLoanRate values must be > 0' },
    ],
  },
  citybank: {
    targetFile: 'src/data/city-bank-grid.ts',
    marker: "];\n\nexport function getCityBankCombo",
    arrayName: 'cityBankCombos',
    slugField: null, // composite key
    required: ['citySlug', 'bankSlug', 'bankBranchesInCity', 'cityAngle', 'preApprovalEmployers', 'disbursalDays', 'cityFAQs'],
    forbidden: ['slug', 'topAngle', 'bestFor'],
    rules: [
      { field: 'citySlug', test: v => SLUG.test(stripQ(v)) && !v.includes('home-loan-emi-calculator'), msg: 'citySlug must be clean kebab-case' },
      { field: 'bankSlug', test: v => SLUG.test(stripQ(v)), msg: 'bankSlug must be kebab-case' },
      { field: 'bankBranchesInCity', test: v => Number(v) >= 0, msg: 'bankBranchesInCity must be >= 0' },
    ],
  },
  bankstate: {
    targetFile: 'src/data/bank-state-grid.ts',
    marker: "];\n\nexport function getComboBySlugs",
    arrayName: 'bankStateCombos',
    slugField: null, // composite key (bankSlug + stateSlug)
    required: ['bankSlug', 'stateSlug', 'bankBranchesInState', 'stateStampDutyPct', 'averageLoanTicket', 'marketAngle', 'uniqueInsight', 'faqs'],
    forbidden: ['slug', 'topAngle', 'bestFor', 'cityAngle', 'preApprovalEmployers', 'cityFAQs', 'disbursalDays'],
    rules: [
      { field: 'bankSlug', test: v => SLUG.test(stripQ(v)), msg: 'bankSlug must be kebab-case' },
      { field: 'stateSlug', test: v => SLUG.test(stripQ(v)), msg: 'stateSlug must be kebab-case' },
      { field: 'bankBranchesInState', test: v => Number(v) > 0, msg: 'bankBranchesInState must be > 0' },
      { field: 'stateStampDutyPct', test: v => Number(v) > 0 && Number(v) < 15, msg: 'stateStampDutyPct must be 0-15' },
      { field: 'averageLoanTicket', test: v => Number(v) > 0, msg: 'averageLoanTicket must be > 0' },
    ],
  },
};

function stripQ(v) {
  if (typeof v !== 'string') return v;
  return v.replace(/^['"]|['"]$/g, '');
}

module.exports = { schemas, stripQ };
