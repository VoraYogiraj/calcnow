/**
 * Term-specific personal loan data for programmatic SEO pages.
 * Each entry produces a unique page at /finance/[term]-year-loan-calculator/
 *
 * Personal loans differ from mortgages:
 *  - Shorter terms (3-10 years typical)
 *  - Unsecured = higher rates
 *  - Origination fees common
 *  - Used for debt consolidation, home improvement, medical, education
 */

export interface LoanTermVariant {
  years: number;
  slug: string;
  defaultAmount: number;
  defaultRate: number;
  rateMin: number;
  rateMax: number;
  popularity: 'most-common' | 'common' | 'long-tail';
  positioning: string;
  bestFor: string[];
  pros: string[];
  cons: string[];
  uniqueAngle: string;
  faqs: Array<{ q: string; a: string }>;
  metaKeywords: string[];
}

export const loanTerms: LoanTermVariant[] = [
  // ===================== 3-YEAR =====================
  {
    years: 3,
    slug: '3-year',
    defaultAmount: 15000,
    defaultRate: 8.5,
    rateMin: 7.0,
    rateMax: 18.0,
    popularity: 'common',
    positioning:
      'The short-cycle loan. Higher monthly payment but minimal total interest. Best for debt consolidation when you can afford an aggressive payoff.',
    bestFor: [
      'Credit-card debt consolidation (replacing 22%+ APR with single 8.5% loan)',
      'Small home improvement projects under $25K',
      'Medical or emergency expenses with strong cash flow',
      'Buyers who hate carrying debt and want to be done fast',
    ],
    pros: [
      'Lowest interest rate available for personal loans',
      'Total interest typically 60-70% less than a 7-year of same amount',
      'Fast equity-free payoff, debt-free in 36 months',
      'Lenders see short-term loans as lower risk = best APR offers',
    ],
    cons: [
      'Monthly payment ~3× higher than a 7-year term',
      'Strict income/DTI requirements to qualify',
      'No room for cash-flow disruption (job change, medical)',
      'Better lenders may not even offer 3-year terms on amounts under $5K',
    ],
    uniqueAngle:
      'A $15,000 loan at 8.5% over 3 years = $474/month and $2,049 total interest. The same loan at 8.5% over 7 years = $237/month but $4,899 total interest. The 3-year payment is exactly 2× higher, but total interest is 58% lower. The math punishes longer terms harder for unsecured loans than mortgages.',
    faqs: [
      {
        q: 'Should I take a 3-year or 5-year personal loan?',
        a: 'Pick 3-year if you can comfortably afford the higher monthly payment AND credit-score-wise you qualify for the same rate at both terms (some lenders price 3-year at slightly lower APRs). Pick 5-year if cash flow flexibility matters, or if you can\'t qualify for the 3-year payment under the lender\'s 35-40% DTI cap.',
      },
      {
        q: 'What is the minimum income for a 3-year personal loan?',
        a: 'Depends on loan size. Major US lenders typically require: monthly payment ≤ 35-40% of pre-tax monthly income. For a $15K loan at 8.5% (3-year), payment ≈ $474 → minimum income ~$1,185-1,355/month gross. SoFi, Marcus, and LightStream tend to be stricter (700+ FICO). Upgrade and LendingClub more flexible (660+ FICO).',
      },
      {
        q: 'Can I refinance a 3-year loan if rates drop?',
        a: 'Yes, but it rarely pays off. Refinancing closing costs (1-5% origination) usually exceed the interest savings on the short remaining term. Make extra payments instead. Most US personal loans have no prepayment penalty.',
      },
    ],
    metaKeywords: ['3 year personal loan calculator', '3 year loan calculator', 'short term loan calculator'],
  },

  // ===================== 5-YEAR =====================
  {
    years: 5,
    slug: '5-year',
    defaultAmount: 20000,
    defaultRate: 10.5,
    rateMin: 8.0,
    rateMax: 22.0,
    popularity: 'most-common',
    positioning:
      'The mainstream personal loan. Five years is the most-offered term by US online lenders, long enough to keep payments manageable, short enough to keep total interest reasonable. Roughly 50% of all personal loans in 2026 are 5-year.',
    bestFor: [
      'Mid-size debt consolidation ($10K-$50K)',
      'Home improvement projects requiring contractor payments',
      'Medical bills with payment plan limits',
      'Major life events (wedding, adoption, relocation)',
      'Borrowers with 660-740 FICO seeking the best rate-vs-payment balance',
    ],
    pros: [
      'Most lender competition = best rate marketplace access',
      'Manageable monthly payment for most middle-class budgets',
      'Reasonable total interest cost vs longer terms',
      '60 months is the standard servicing window for fintech lenders (SoFi, Marcus, Upstart)',
    ],
    cons: [
      'Total interest higher than 3-year (typically 70% more)',
      'Lenders may charge 1-6% origination fee on top',
      'Tied to lender for 5 years (no easy escape if better rates emerge)',
    ],
    uniqueAngle:
      'A $20,000 loan at 10.5% over 5 years = $430/month and $5,793 total interest. The same loan at 10.5% over 7 years = $339/month but $8,500 total interest. The 5-year saves $2,707 in interest at the cost of $91/month, almost always the winning trade for borrowers who can afford it.',
    faqs: [
      {
        q: 'Why are 5-year personal loans the most common?',
        a: 'Three reasons converge: (1) Fintech lenders (SoFi, Marcus, Upstart) standardized 36/60/84-month terms. 60 months balances payment + interest. (2) 60 months matches typical car-loan terms, mentally anchoring borrowers. (3) Regulatory limits. Many states cap personal-loan terms at 84 months total, making 60 the comfortable middle.',
      },
      {
        q: '5-year personal loan vs credit card balance transfer?',
        a: 'For >12 months of debt: 5-year personal loan usually wins. A 0% balance transfer (12-21 month promo) sounds free but typically charges 3-5% transfer fee + jumps to 20%+ APR after promo. A 5-year personal loan at 10% with no penalty for paying early lets you treat the loan as an aggressive payoff plan with a hard rate cap.',
      },
      {
        q: 'What FICO score do I need for a 5-year personal loan?',
        a: 'Online lenders: 660+ FICO is the typical entry; 720+ for the best rates. Below 660, look at LendingClub (580+), Upstart (300+ with income/education weighting), or credit unions (often 600+ with relationship banking). 740+ FICO at SoFi/Marcus/LightStream gets you sub-10% APR offers.',
      },
    ],
    metaKeywords: ['5 year personal loan calculator', '5 year loan calculator', '60 month loan calculator'],
  },

  // ===================== 7-YEAR =====================
  {
    years: 7,
    slug: '7-year',
    defaultAmount: 30000,
    defaultRate: 12.5,
    rateMin: 9.5,
    rateMax: 25.0,
    popularity: 'common',
    positioning:
      'The cash-flow-priority loan. Stretches payments to 84 months for the lowest monthly. Used for larger loan amounts and home improvement. Carries a meaningful rate premium over 5-year.',
    bestFor: [
      'Larger debt consolidation ($30K-$100K)',
      'Major home improvement (new roof, HVAC, full kitchen)',
      'Borrowers prioritizing cash flow over total interest',
      'Self-employed borrowers needing payment predictability',
    ],
    pros: [
      'Lowest monthly payment of any common personal loan term',
      'Allows larger loan amounts within typical DTI caps',
      'Better cash-flow buffer for income variability',
    ],
    cons: [
      'Rate is typically 1.5-2.5% higher than 5-year (lenders price longer risk)',
      'Total interest can exceed principal on higher-APR loans',
      'Origination fees compound the effective cost',
      'Fewer lenders offer 84-month terms, limiting comparison shopping',
    ],
    uniqueAngle:
      'A $30,000 loan at 12.5% over 7 years = $537/month and $15,116 total interest. The same loan at 11.0% over 5 years = $652/month and $9,140 total interest. The 7-year saves $115/month but costs $5,976 more in total interest. Worth it ONLY if the $115/month buffer truly enables financial stability, not just delays it.',
    faqs: [
      {
        q: 'When does a 7-year personal loan make sense?',
        a: 'Three valid scenarios: (1) Loan amount above $25K where the 5-year payment exceeds 30% of monthly income. (2) Variable-income earners (self-employed, commission) who need conservative monthly obligations. (3) Borrowers using the loan for income-generating purposes (home improvement that boosts rental yield, business expansion), where lower monthly preserves operating cash flow.',
      },
      {
        q: 'Are 7-year personal loans hard to find?',
        a: 'Yes, limited lender pool. Major options in 2026: LightStream (84-month for prime borrowers), SoFi (84-month for amounts $5K+), Upgrade (84-month), Best Egg (84-month). Major banks (Wells Fargo, Chase, BofA) typically cap personal loans at 60 months. Credit unions vary widely.',
      },
      {
        q: 'Can I prepay a 7-year personal loan?',
        a: 'Almost always yes, without penalty. All major US online lenders (SoFi, LightStream, Marcus, Upstart, Upgrade) allow free prepayment. Some state-licensed lenders impose 1-2% prepayment penalties. Verify in your loan agreement before signing.',
      },
    ],
    metaKeywords: ['7 year personal loan calculator', '7 year loan', '84 month loan calculator'],
  },

  // ===================== 10-YEAR =====================
  {
    years: 10,
    slug: '10-year',
    defaultAmount: 50000,
    defaultRate: 14.0,
    rateMin: 11.0,
    rateMax: 28.0,
    popularity: 'long-tail',
    positioning:
      'The extended unsecured loan. Rare in mainstream personal lending. Most banks cap personal loans at 7 years. Available only from select fintech lenders and HELOC-style products. Best for very large amounts or secured-loan structures.',
    bestFor: [
      'Large home-improvement projects ($50K+)',
      'Major medical bills with structured payment plans',
      'Borrowers using secured collateral (HELOC, securities-backed line)',
      'Education or career-transition loans with deferred income',
    ],
    pros: [
      'Lowest monthly payment available, useful for very large amounts',
      'Allows much higher loan principal under standard DTI math',
      'When secured (HELOC), rates drop to 6-9% range',
    ],
    cons: [
      'Rate premium of 2-3.5% over 5-year (severe for unsecured)',
      'Total interest typically exceeds loan principal',
      'Very few lenders offer this for unsecured loans',
      'Often disguised as a HELOC or 401(k) loan with separate risks',
    ],
    uniqueAngle:
      'A $50,000 loan at 14% over 10 years = $776/month and $43,151 total interest. The 10-year loan costs you nearly the original principal again in interest. The same loan at 11.5% over 5 years = $1,099/month and $15,940 total interest. The 10-year saves $323/month, but costs $27,211 more. For any unsecured personal loan over 7 years, consider whether a HELOC (typically 7-9% APR) is the better structure.',
    faqs: [
      {
        q: 'Can I get a 10-year personal loan?',
        a: 'Possible but rare. LightStream offers up to 144-month terms for home improvement specifically. SoFi caps at 84 months for true personal loans. For 10+ year horizons on amounts above $25K, you\'re typically better served by a HELOC (Home Equity Line of Credit) at 7-9% APR, or a securities-backed line at 5-7%.',
      },
      {
        q: '10-year personal loan vs HELOC: which is better?',
        a: 'HELOC almost always wins on math. A HELOC at 8% over 10 years on $50K = $607/month and $22,791 total interest (vs $776 and $43,151 for unsecured 10-year). The catch: HELOC requires home equity (you secure the loan against your property), and rates are typically variable. If you have the equity, HELOC is the cheaper structure.',
      },
      {
        q: 'When does a 10-year unsecured loan make sense?',
        a: 'Limited scenarios: (1) You don\'t have home equity for a HELOC. (2) You need very large principal ($75K+) and accept the interest cost. (3) You\'re in a career transition (medical residency, MBA → big tech) and need low payments now with confident future income. Even then, compare against 401(k) loan or family lending first.',
      },
    ],
    metaKeywords: ['10 year personal loan calculator', '10 year loan', 'long term personal loan'],
  },
];

export function getLoanTermBySlug(slug: string): LoanTermVariant | undefined {
  return loanTerms.find((t) => t.slug === slug);
}

export function computeLoanComparison(amount: number) {
  return loanTerms.map((t) => {
    const monthlyRate = t.defaultRate / 100 / 12;
    const numPayments = t.years * 12;
    const monthly =
      monthlyRate === 0
        ? amount / numPayments
        : (amount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
          (Math.pow(1 + monthlyRate, numPayments) - 1);
    const totalPaid = monthly * numPayments;
    const totalInterest = totalPaid - amount;
    return {
      years: t.years,
      slug: t.slug,
      rate: t.defaultRate,
      monthly,
      totalInterest,
      totalPaid,
    };
  });
}
