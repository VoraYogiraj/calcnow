/**
 * Term-specific mortgage data for programmatic SEO pages.
 * Each entry produces a unique page at /finance/[term]-year-mortgage-calculator/
 *
 * Each page is differentiated by:
 *  - Pre-filled default term in the calculator
 *  - Comparison table to other terms (showing real interest savings/cost)
 *  - Term-specific FAQs (why pick 15-year? why pick 40-year? etc.)
 *  - Worked example with this term's numbers
 *  - Pros and cons unique to this term
 */

export interface TermVariant {
  years: number;             // The term in years
  slug: string;              // URL slug like "15-year"
  popularity: 'common' | 'uncommon' | 'rare';
  defaultAmount: number;     // Typical loan size for this term in USD
  defaultRate: number;       // Typical rate for this term (shorter = lower rate)
  positioning: string;       // 1-sentence headline angle
  whoItsFor: string[];       // Bulleted ideal-borrower list
  pros: string[];
  cons: string[];
  uniqueAngle: string;       // Distinctive insight for this term
  faqs: Array<{ q: string; a: string }>;
  metaKeywords: string[];
}

export const mortgageTerms: TermVariant[] = [
  // ===================== 10-YEAR =====================
  {
    years: 10,
    slug: '10-year',
    popularity: 'rare',
    defaultAmount: 300000,
    defaultRate: 5.75,
    positioning:
      'The aggressive-payoff mortgage. Pay roughly twice the monthly payment of a 30-year, but save over $300,000 in interest on a $400,000 loan.',
    whoItsFor: [
      'High-income borrowers with ample monthly cash flow',
      'Refinancers in their 50s looking to be mortgage-free by retirement',
      'Buyers in low-cost-of-living areas with 50%+ down payments',
      'Those prioritizing wealth-building through forced equity',
    ],
    pros: [
      'Lowest interest rate (typically 0.5-1.0% below 30-year)',
      'Massive total-interest savings vs longer terms',
      'Builds equity rapidly, 100% paid in 10 years',
      'No PMI removal anxiety as equity climbs fast',
    ],
    cons: [
      'Monthly payment nearly 2× a 30-year on same principal',
      'Less cash flow flexibility for emergencies/investing elsewhere',
      'Limits how much home you can afford for the same income',
      'Lost opportunity cost vs investing the payment difference',
    ],
    uniqueAngle:
      'A $400,000 loan at 5.75% over 10 years = $4,393/month and $127,118 total interest. The same loan at 6.5% over 30 years = $2,528/month but $510,178 total interest. The 10-year saves $383,060 in interest, but at the cost of $1,865/month in cash flow for a decade.',
    faqs: [
      {
        q: 'Is a 10-year mortgage worth it?',
        a: 'For borrowers with strong cash flow and a goal of being mortgage-free quickly, yes, the interest savings vs 30-year are typically 60-75% of total interest. The trade-off: you sacrifice roughly $1,500-$2,000/month in cash flow flexibility, which would have funded retirement accounts, emergencies, or other investments.',
      },
      {
        q: '10-year mortgage vs 15-year: what is the difference?',
        a: 'The 10-year rate is typically 15-25 basis points lower than a 15-year, but the monthly payment is 25-35% higher. On a $400K loan: 10-year ≈ $4,393/mo and $127K interest; 15-year ≈ $3,322/mo and $198K interest. The 5 extra years of payments cost ~$71K more in interest.',
      },
      {
        q: 'Can you get a 10-year mortgage in 2026?',
        a: 'Yes, most major US lenders (Bank of America, Chase, Wells Fargo, US Bank, Quicken/Rocket) offer 10-year fixed mortgages. They\'re less common than 15- or 30-year because the higher monthly payment limits the eligible borrower pool. Best rates require a 740+ FICO and stable W-2 income.',
      },
    ],
    metaKeywords: ['10 year mortgage calculator', '10 year fixed rate mortgage', 'aggressive mortgage payoff'],
  },

  // ===================== 15-YEAR =====================
  {
    years: 15,
    slug: '15-year',
    popularity: 'common',
    defaultAmount: 350000,
    defaultRate: 6.0,
    positioning:
      'The wealth-builder. Pay roughly 35% more per month than a 30-year, but cut total interest by more than half. The most popular accelerated-payoff option in the US.',
    whoItsFor: [
      'Dual-income households with comfortable monthly margins',
      'Buyers who plan to stay in the home long term',
      'Refinancers within 10 years of retirement',
      'Anyone wanting to be debt-free before college tuition years',
    ],
    pros: [
      'Significantly lower rate than 30-year (typically 0.5-0.75% lower)',
      'Total interest typically 55-65% less than 30-year',
      'Faster equity build = more refinance/HELOC options later',
      'Aligns mortgage payoff with major life milestones',
    ],
    cons: [
      'Monthly payment ~35% higher than 30-year on same principal',
      'Restricts how much home you can qualify for',
      'Less flexibility during income disruption',
      'May reduce capacity to max retirement contributions',
    ],
    uniqueAngle:
      'A $350,000 loan at 6.0% over 15 years = $2,953/month and $181,548 total interest. The same loan at 6.5% over 30 years = $2,212/month but $446,408 total interest. The 15-year costs $741/month more but saves $264,860, effectively a 12-15% guaranteed return on the extra payment vs a 30-year.',
    faqs: [
      {
        q: 'Is a 15-year mortgage better than a 30-year?',
        a: 'Mathematically, yes, for the same loan amount, a 15-year saves roughly 55-65% in total interest because you pay for half the time at a lower rate. The trade-off: the monthly payment is ~35% higher. Use a 15-year if you can comfortably afford the higher payment AND have already maxed retirement contributions.',
      },
      {
        q: 'How much do I need to earn for a 15-year mortgage?',
        a: 'Lenders typically cap mortgage + taxes + insurance at 28-31% of gross monthly income. For a $350K loan at 6% (15-year payment ~$2,953/mo + ~$700 taxes/insurance ≈ $3,650), you\'d need household gross income of ~$140K-$155K/year to qualify comfortably.',
      },
      {
        q: '15-year mortgage vs invest the difference: which builds more wealth?',
        a: 'Historical math: investing the monthly difference ($741 in our example) in stocks averaging 7% real returns over 15 years yields roughly $230K. The 15-year mortgage saves $265K in interest. The 15-year wins by ~$35K, and that\'s before factoring in the guaranteed return + lower stress + behavioral advantage of forced savings.',
      },
      {
        q: 'Can I make extra payments on a 30-year to mimic a 15-year payoff?',
        a: 'Yes, and most US mortgages allow this without penalty. The catch: a 30-year with extra payments costs more than a true 15-year because the base interest rate is 0.5-0.75% higher. You also rely on discipline rather than the structure of the loan itself.',
      },
    ],
    metaKeywords: ['15 year mortgage calculator', '15 year fixed rate', 'best 15 year mortgage', '15 year vs 30 year mortgage'],
  },

  // ===================== 20-YEAR =====================
  {
    years: 20,
    slug: '20-year',
    popularity: 'uncommon',
    defaultAmount: 380000,
    defaultRate: 6.25,
    positioning:
      'The middle path. Costs roughly 15% more per month than a 30-year, but cuts total interest by about 35%. Underused. Most borrowers default to 15 or 30 without considering this option.',
    whoItsFor: [
      'Buyers who want to pay off mortgage faster than 30-year but can\'t stretch to a 15-year payment',
      'Refinancers extending or shortening from an existing loan',
      'Borrowers in mid-career who want to be mortgage-free in their 50s',
      'Those balancing aggressive payoff with retirement savings',
    ],
    pros: [
      'Lower rate than 30-year (~25-50 bps less)',
      'Total interest savings of ~35% vs 30-year',
      'More manageable monthly payment than 15-year',
      'Strong middle ground for risk-balanced families',
    ],
    cons: [
      'Less common, so fewer lenders offer it',
      'Less marketing attention than 15- or 30-year',
      'Rate spread vs 30-year is smaller than 15-year vs 30-year',
      'May not be the optimal interest-saving option vs 15-year',
    ],
    uniqueAngle:
      'A $380,000 loan at 6.25% over 20 years = $2,778/month and $286,795 total interest. The same loan at 6.5% over 30 years = $2,402/month but $484,605 total interest. The 20-year costs $376/month more but saves $197,810, a meaningful middle-ground for borrowers who find 15-year unaffordable.',
    faqs: [
      {
        q: 'Why is a 20-year mortgage less common than 15 or 30?',
        a: 'Two reasons: (1) The interest-rate discount vs 30-year is smaller than 15-year vs 30-year, making the savings math less dramatic. (2) Marketing inertia. Fannie Mae and Freddie Mac standardized around 15 and 30, and most lenders default to those terms. But 20-year is available from major banks and credit unions.',
      },
      {
        q: '20-year mortgage vs 15-year mortgage: which to pick?',
        a: 'If you can afford the 15-year payment, pick it. Savings are larger and the rate is lower. If the 15-year payment strains your budget, the 20-year is a smart compromise. The 20-year still saves ~$95K-$130K in interest vs a 30-year on a typical $400K loan.',
      },
      {
        q: 'Can I refinance from a 30-year to a 20-year?',
        a: 'Yes. If you\'re 5-10 years into a 30-year and have built equity + improved credit, refinancing into a 20-year is a common move. It shortens total mortgage life without the payment shock of a 15-year. Run the break-even on closing costs (typically 2-3 years).',
      },
    ],
    metaKeywords: ['20 year mortgage calculator', '20 year fixed mortgage', '20 year vs 30 year', 'mid-term mortgage'],
  },

  // ===================== 25-YEAR =====================
  {
    years: 25,
    slug: '25-year',
    popularity: 'uncommon',
    defaultAmount: 400000,
    defaultRate: 6.4,
    positioning:
      'The 5-years-shorter option. The standard term in Canada, UK, and Australia, and a quiet alternative in the US. Modest payment increase, modest interest savings.',
    whoItsFor: [
      'Canadian, UK, Australian, and Singapore borrowers (where 25-year is standard)',
      'US borrowers who want to shave 5 years off a 30-year without stress',
      'Buyers in their 40s wanting payoff before standard retirement age',
      'Refinancers reducing remaining loan life',
    ],
    pros: [
      'Standard term in most Commonwealth countries',
      'Modest monthly payment increase vs 30-year',
      'Saves ~$70-100K in interest on typical loans vs 30-year',
      'Aligns with 25-year career and retirement timing',
    ],
    cons: [
      'Less common in the US, fewer rate quotes',
      'Smaller interest savings than 20-year option',
      'Smaller rate discount vs 30-year',
    ],
    uniqueAngle:
      'In Canada, UK, Australia, and Singapore, 25 years is the STANDARD mortgage amortization (not 30). A C$500,000 mortgage at 5% over 25 years = C$2,908/month and C$372,400 total interest. The longer-than-15-year horizon allows higher property prices in those markets where housing-to-income ratios are stretched.',
    faqs: [
      {
        q: 'Why is 25-year the standard in Canada and UK?',
        a: 'Both markets historically capped amortization at 25 years to ensure mortgages were paid off within a working lifetime. Canada\'s 30-year amortization is uninsurable (requires 20%+ down). The UK has no formal cap but lender risk models default to 25-30 years. The 25-year standard keeps mortgage-payoff within a typical career.',
      },
      {
        q: '25-year vs 30-year mortgage on the same loan?',
        a: 'A $400K loan at 6.4% (25yr) ≈ $2,683/mo and $404,940 interest. Same loan at 6.5% (30yr) ≈ $2,528/mo and $510,178 interest. 25-year costs $155/mo more but saves ~$105K total interest, solid trade-off for buyers comfortable with the slightly higher payment.',
      },
      {
        q: 'Is a 25-year mortgage available in the US?',
        a: 'Yes, most major US lenders offer 25-year fixed mortgages, though they\'re less promoted than 15 or 30. Rates are typically 5-15 bps below a 30-year. If your goal is "5 years shorter than 30 without a 15-year payment," a 25-year is the obvious answer.',
      },
    ],
    metaKeywords: ['25 year mortgage calculator', '25 year fixed mortgage', 'canadian mortgage 25 year', 'uk 25 year mortgage'],
  },

  // ===================== 30-YEAR =====================
  {
    years: 30,
    slug: '30-year',
    popularity: 'common',
    defaultAmount: 400000,
    defaultRate: 6.5,
    positioning:
      'The default American mortgage. Lowest monthly payment, highest total interest. The structure made famous by Fannie Mae and Freddie Mac. ~85% of US first-time buyers choose this term.',
    whoItsFor: [
      'First-time home buyers maximizing affordability',
      'Anyone prioritizing monthly cash flow over total interest',
      'Buyers in high-cost markets where shorter terms are unaffordable',
      'Borrowers planning to use the difference to fund 401(k)/IRA/investments',
      'Those who may sell or refinance within 7-10 years anyway',
    ],
    pros: [
      'Lowest monthly payment of any standard mortgage',
      'Maximizes home-buying affordability',
      'Frees cash flow for retirement contributions and emergencies',
      'Massive lender competition = best rate access',
      'Tax-deductible mortgage interest (US, primary residence)',
    ],
    cons: [
      'Highest total interest cost (often 75%+ more than 15-year)',
      'Slow equity build in early years',
      'Rate is typically 0.5-0.75% higher than 15-year',
      'Mortgage outlives your career if you start at 35+',
    ],
    uniqueAngle:
      'A $400,000 loan at 6.5% over 30 years = $2,528/month and $510,178 total interest. You pay $910,178 to borrow $400,000, meaning interest costs more than the original loan principal. The 30-year fixed exists because Fannie Mae and Freddie Mac securitize them, which is unique to the US mortgage market.',
    faqs: [
      {
        q: 'Why is 30 years the standard mortgage term in the US?',
        a: 'Fannie Mae and Freddie Mac (government-sponsored enterprises created in 1938 and 1970) buy 30-year fixed-rate mortgages from banks and securitize them, making them safe and cheap to originate. This US-only structure spreads payments long enough to make homes affordable on middle-class incomes. Most other countries cap at 25 years.',
      },
      {
        q: 'How much do I save by paying off a 30-year mortgage early?',
        a: 'Big. On a $400K loan at 6.5%, paying an extra $200/month (≈$2,400/year) cuts the loan from 30 years to ~25 years and saves ~$95K in interest. An extra $500/month finishes in ~20 years and saves ~$200K.',
      },
      {
        q: 'Is a 30-year mortgage a bad idea?',
        a: 'Not at all. It\'s a tool. For first-time buyers and those in expensive markets, the 30-year often is the only viable option. The "bad" scenario is taking a 30-year, never making extra payments, and never refinancing as rates drop. The good scenario: take a 30-year, max your 401(k), make occasional principal pre-payments.',
      },
      {
        q: '30-year mortgage refinance: when does it make sense?',
        a: 'The rule of thumb: refinance when current rates are at least 0.75-1.0% below your locked rate AND you plan to stay in the home long enough to recoup closing costs (typically 2-3 years). After 2024-25 rate cuts, refinancing a 2023-rate mortgage often makes sense.',
      },
    ],
    metaKeywords: ['30 year mortgage calculator', '30 year fixed rate', '30 year fixed mortgage', 'best 30 year mortgage'],
  },

  // ===================== 40-YEAR =====================
  {
    years: 40,
    slug: '40-year',
    popularity: 'rare',
    defaultAmount: 500000,
    defaultRate: 7.0,
    positioning:
      'The extreme-affordability mortgage. Stretches payments to 40 years for the lowest possible monthly. Used in high-cost markets, by FHA modification programs, and in some Asian markets. Not a typical choice.',
    whoItsFor: [
      'Borrowers in extremely high-cost markets (California, Hawaii, NYC)',
      'FHA loan-modification participants',
      'Asian markets where 35-50 year terms exist',
      'Buyers facing financial hardship who need lower payment',
    ],
    pros: [
      'Lowest possible monthly payment',
      'Helps qualify in expensive markets',
      'Available for FHA loan modifications',
      'Maximum cash flow for other priorities',
    ],
    cons: [
      'Highest total interest of any common term',
      'Available only from select lenders (or modification only)',
      'Higher interest rate (typically 50-75 bps above 30-year)',
      'Equity builds at a glacial pace',
      'Mortgage outlives your working career',
    ],
    uniqueAngle:
      'A $500,000 loan at 7.0% over 40 years = $3,107/month and $991,469 total interest. The same loan at 6.5% over 30 years = $3,160/month and $637,723 total interest. The 40-year saves only $53/month, but costs $353,746 more in total interest. Only worth it for hardship or qualification edge-cases.',
    faqs: [
      {
        q: 'Why would anyone choose a 40-year mortgage?',
        a: 'Three main scenarios: (1) FHA loan modifications. FHA introduced the 40-year mod in 2023 for borrowers facing hardship. (2) Extremely high-cost markets where a 30-year still doesn\'t fit budget. (3) Some Asian markets (Japan, South Korea) where multi-generational mortgages are normalized.',
      },
      {
        q: '40-year vs 30-year mortgage: what is the math?',
        a: 'On a $500K loan: 40-year at 7.0% = $3,107/mo and $991,469 interest. 30-year at 6.5% = $3,160/mo and $637,723 interest. The 40-year only saves $53/month (barely meaningful) but costs $353,746 more in total interest. Almost never a winning trade unless you genuinely can\'t make the 30-year payment.',
      },
      {
        q: 'Where can I get a 40-year mortgage?',
        a: 'Not from typical conventional lenders. Available primarily through: (1) FHA loan modification for distressed borrowers, (2) Some portfolio lenders for jumbo loans (e.g., Carrington, NewRez), (3) Specialty non-QM lenders. Rate premiums of 50-75 bps over 30-year are typical.',
      },
    ],
    metaKeywords: ['40 year mortgage calculator', '40 year mortgage', 'extended mortgage term', 'fha 40 year modification'],
  },
];

export function getMortgageTermBySlug(slug: string): TermVariant | undefined {
  return mortgageTerms.find((t) => t.slug === slug);
}

// Pre-compute comparison table for any given term — what the same loan would cost at OTHER terms
export function computeComparison(amount: number, baseRate: number) {
  return mortgageTerms.map((t) => {
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
