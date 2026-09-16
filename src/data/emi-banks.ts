/**
 * Bank-specific EMI data for Indian programmatic SEO pages.
 * Each entry produces a unique page at /finance/emi-calculator/[bank-slug]/
 */

export interface BankData {
  slug: string;
  bankName: string;
  fullName: string;
  emoji: string;
  hqLocation: string;
  homeLoanRate: { min: number; max: number; typical: number };
  personalLoanRate: { min: number; max: number; typical: number };
  carLoanRate: { min: number; max: number; typical: number };
  processingFee: string;
  prepaymentPolicy: string;
  marketContext: string;
  uniqueAngle: string;          // What's unique about this bank's loans
  productHighlights: string[];   // 3-5 bullet points
  faqs: Array<{ q: string; a: string }>;
  metaKeywords: string[];
}

export const emiBanks: BankData[] = [
  // ============ HDFC ============
  {
    slug: 'hdfc',
    bankName: 'HDFC Bank',
    fullName: 'HDFC Bank Limited',
    emoji: '🏦',
    hqLocation: 'Mumbai, Maharashtra',
    homeLoanRate: { min: 8.45, max: 9.5, typical: 8.65 },
    personalLoanRate: { min: 10.5, max: 24, typical: 11.0 },
    carLoanRate: { min: 8.85, max: 13.5, typical: 9.2 },
    processingFee: '0.50% of loan amount (max ₹11,800 for home loans, ₹4,999 for personal loans)',
    prepaymentPolicy: 'Zero foreclosure charges on floating-rate home loans for individuals. 2-4% charges on fixed-rate or business loans.',
    marketContext: 'HDFC Bank (merged with HDFC Ltd in 2023) is India\'s largest private-sector lender and historically dominated the home loan market. Post-merger, the home loan book grew to over ₹7 lakh crore. Known for fast disbursal (5-7 days for pre-approved customers) and strong digital application flow.',
    uniqueAngle: 'Best-in-class digital experience and pre-approved offers for HDFC Bank salary-account holders. Often 5-10 basis points cheaper than smaller banks for repeat customers.',
    productHighlights: [
      'Home loans up to ₹10 crore with 30-year tenure',
      'Personal loans up to ₹40 lakh with same-day approval',
      'Pre-approved offers for HDFC salary account holders',
      'Step-up EMI option for early-career professionals',
      'Top-up loan facility on existing home loans',
    ],
    faqs: [
      {
        q: 'What is the minimum CIBIL score for HDFC Bank home loan?',
        a: 'HDFC Bank typically requires a CIBIL score of 720 or above for the best home loan rates. Scores between 680-720 may still qualify but at 25-50 bps higher rates. Below 680, approval becomes difficult unless co-applicant has strong credit.',
      },
      {
        q: 'How fast does HDFC Bank disburse a home loan?',
        a: 'For pre-approved HDFC Bank customers with salary account, disbursal can happen in 3-5 working days post property verification. For new customers, the full timeline (application → sanction → disbursal) typically takes 7-15 working days.',
      },
      {
        q: 'Does HDFC Bank charge prepayment penalty?',
        a: 'No. HDFC Bank waives foreclosure charges on all floating-rate home loans taken by individuals (per RBI guidelines). For fixed-rate or business-purpose loans, 2-4% prepayment charges apply.',
      },
    ],
    metaKeywords: ['hdfc emi calculator', 'hdfc home loan emi', 'hdfc bank emi', 'hdfc personal loan emi'],
  },

  // ============ SBI ============
  {
    slug: 'sbi',
    bankName: 'SBI',
    fullName: 'State Bank of India',
    emoji: '🏛️',
    hqLocation: 'Mumbai, Maharashtra',
    homeLoanRate: { min: 8.25, max: 9.4, typical: 8.5 },
    personalLoanRate: { min: 11.0, max: 14.5, typical: 11.45 },
    carLoanRate: { min: 8.75, max: 9.65, typical: 8.95 },
    processingFee: '0.35% of loan amount (min ₹2,000, max ₹10,000 for home loans)',
    prepaymentPolicy: 'Zero foreclosure on floating-rate home loans. Up to 3% on fixed-rate or NRI loans.',
    marketContext: 'SBI is India\'s largest bank and home loan lender by book size (~₹8 lakh crore home loan book). As a public-sector bank, SBI offers some of the lowest rates in the market, typically 10-25 bps cheaper than private banks. The trade-off: slower processing (10-21 days) and more documentation.',
    uniqueAngle: 'Lowest rates in the market for prime borrowers, especially via the SBI MaxGain home loan (overdraft-linked structure where parked surplus reduces interest). MaxGain is uniquely beneficial for self-employed/businesspeople with variable cash flow.',
    productHighlights: [
      'SBI Regular Home Loan: 8.25-9.4% with up to ₹10 crore loan size',
      'SBI MaxGain: overdraft-linked home loan (save interest by parking surplus)',
      'SBI Privilege: subsidized rates for government employees (-25 bps)',
      'SBI Shaurya: subsidized rates for defense personnel',
      'YONO app for end-to-end digital application',
    ],
    faqs: [
      {
        q: 'What is SBI MaxGain home loan and is it worth it?',
        a: 'SBI MaxGain is an overdraft-linked home loan: you have a current account linked to the loan, and any surplus you park in it reduces the interest-charging principal daily. Excellent for businesspeople with variable cash flow. The catch: you must maintain the account actively, and there\'s an additional ~25 bps rate premium vs Regular Home Loan.',
      },
      {
        q: 'Is SBI cheaper than HDFC for home loans?',
        a: 'Typically yes. SBI is 10-25 basis points cheaper at any given LTV. The trade-offs: SBI processing is slower (10-15 days vs 5-7 for HDFC), documentation is more rigorous, and SBI doesn\'t pre-approve as aggressively. Match the bank to your urgency.',
      },
      {
        q: 'Does SBI offer EMI moratorium?',
        a: 'SBI offers an "EMI holiday" of up to 3-6 months in cases of job loss or medical emergency (subject to approval, accrued interest is capitalized). For new home buyers, SBI also offers a pre-EMI period during under-construction phase.',
      },
    ],
    metaKeywords: ['sbi emi calculator', 'sbi home loan emi', 'sbi bank emi', 'state bank of india home loan'],
  },

  // ============ ICICI ============
  {
    slug: 'icici',
    bankName: 'ICICI Bank',
    fullName: 'ICICI Bank Limited',
    emoji: '🏢',
    hqLocation: 'Mumbai, Maharashtra',
    homeLoanRate: { min: 8.6, max: 9.65, typical: 8.75 },
    personalLoanRate: { min: 10.85, max: 16.65, typical: 11.5 },
    carLoanRate: { min: 8.95, max: 13.0, typical: 9.45 },
    processingFee: '0.50-1.0% of loan amount (variable based on profile)',
    prepaymentPolicy: 'Zero foreclosure on floating-rate retail home loans (per RBI mandate). 2-4% on fixed/business loans.',
    marketContext: 'ICICI Bank is India\'s second-largest private bank with a strong digital-first positioning. Home loan book around ₹4 lakh crore. ICICI is known for aggressive pre-approved offers and innovative products like the "Saral Rural Housing Loan" for tier-2/3 markets.',
    uniqueAngle: 'Strongest pre-approval engine in India. ICICI iMobile users with salary credits often see one-tap home loan offers up to ₹50 lakh with disbursal in 24-72 hours.',
    productHighlights: [
      'Home loans up to ₹15 crore with 30-year tenure',
      'iMobile-based one-tap pre-approved offers',
      'Step-up EMI for early-career and step-down for retirees',
      'Insta home loan for high-CIBIL pre-approved customers',
      'Balance transfer with top-up facility',
    ],
    faqs: [
      {
        q: 'How does ICICI Bank InstaHome Loan work?',
        a: 'InstaHome is ICICI\'s pre-approved offer for high-CIBIL existing customers, typically delivers a sanction in 24-72 hours with minimal paperwork. Eligibility is based on existing relationship: salary credits, fixed deposits, mutual funds, or credit card spend.',
      },
      {
        q: 'ICICI vs HDFC home loan: which is better?',
        a: 'They\'re very close: ICICI averages ~10 bps higher rate but offers stronger pre-approval. HDFC has better service consistency post-disbursal. If you\'re an existing ICICI customer with iMobile, ICICI wins on speed. For first-timers, HDFC is often easier to navigate.',
      },
      {
        q: 'Can I switch from ICICI floating to fixed rate?',
        a: 'Yes. ICICI allows mid-loan conversion from floating to fixed (and vice versa) for a one-time fee of 0.5-1% of outstanding principal. Fixed rate is typically 50-100 bps higher than floating at any given time.',
      },
    ],
    metaKeywords: ['icici emi calculator', 'icici home loan emi', 'icici bank emi calculator', 'icici personal loan emi'],
  },

  // ============ AXIS ============
  {
    slug: 'axis',
    bankName: 'Axis Bank',
    fullName: 'Axis Bank Limited',
    emoji: '🏪',
    hqLocation: 'Mumbai, Maharashtra',
    homeLoanRate: { min: 8.75, max: 9.4, typical: 8.85 },
    personalLoanRate: { min: 11.25, max: 20, typical: 12.0 },
    carLoanRate: { min: 9.25, max: 14, typical: 9.55 },
    processingFee: '1.0% of loan amount or ₹10,000 (whichever lower) on home loans',
    prepaymentPolicy: 'Zero on floating retail home loans. 4% on fixed/business loans.',
    marketContext: 'Axis Bank is India\'s third-largest private lender with ~₹2.5 lakh crore home loan book. Known for competitive rates on premium-segment loans (Burgundy banking customers) and strong tier-2 city presence.',
    uniqueAngle: 'Best rates for Burgundy Private/Privée banking customers (HNI segment with ₹20L+ relationship value). Also strong on under-construction project financing with builder tie-ups.',
    productHighlights: [
      'Home loan up to ₹5 crore with 30-year tenure',
      'Asha Home Loan: lower-income segment loans starting ₹1 lakh',
      'Burgundy Private rates for HNI customers',
      'Power Home Loan: rate reduces 10 bps for every 6 months on-time EMIs',
      'Quick Pay home loan with shorter approval cycle',
    ],
    faqs: [
      {
        q: 'What is the Axis Bank Asha Home Loan?',
        a: 'Asha Home Loan targets affordable-housing buyers, with loan size from ₹1 lakh to ₹35 lakh for income groups earning ₹8,000-30,000/month. PMAY subsidy is automatically processed. Disbursal can happen even on under-construction properties.',
      },
      {
        q: 'Does Axis Bank reward on-time EMI payments?',
        a: 'Yes, via the "Power" home loan: every 6 months of on-time EMIs reduce your rate by 10 bps (up to 60 bps lifetime). Effectively a behavioral discount that compounds over the loan life.',
      },
      {
        q: 'How long does Axis Bank take to approve a home loan?',
        a: 'For salaried customers with clean documentation: 5-10 working days from application to sanction. Self-employed: 10-15 days. Burgundy customers get priority processing in 3-5 days.',
      },
    ],
    metaKeywords: ['axis bank emi calculator', 'axis home loan emi', 'axis personal loan emi', 'axis car loan emi'],
  },

  // ============ KOTAK ============
  {
    slug: 'kotak',
    bankName: 'Kotak Mahindra Bank',
    fullName: 'Kotak Mahindra Bank Limited',
    emoji: '🏦',
    hqLocation: 'Mumbai, Maharashtra',
    homeLoanRate: { min: 8.7, max: 9.4, typical: 8.85 },
    personalLoanRate: { min: 10.99, max: 18, typical: 11.5 },
    carLoanRate: { min: 9.5, max: 14, typical: 9.8 },
    processingFee: '0.5% of loan amount (min ₹3,000, max ₹10,000)',
    prepaymentPolicy: 'Zero on floating retail home loans. 2.5% on fixed-rate loans.',
    marketContext: 'Kotak Mahindra Bank, founded as a financial services group by Uday Kotak, has grown into one of India\'s leading private-sector banks. Strong on premium-segment and SME lending. Home loan book around ₹1 lakh crore.',
    uniqueAngle: 'Best digital home loan experience after HDFC. Kotak Mobile App and 811 digital banking deliver fast pre-approval. Strong on self-employed segment with non-standard income.',
    productHighlights: [
      'Home loan up to ₹5 crore, 30-year tenure',
      '811 digital onboarding with home loan integration',
      'Special rates for women borrowers (-5 bps)',
      'Step-up EMI for younger borrowers',
      'Quick balance transfer with rate-match guarantee',
    ],
    faqs: [
      {
        q: 'Does Kotak offer women-borrower discount?',
        a: 'Yes. Kotak (like SBI, HDFC, and ICICI) offers a 5 basis points discount on home loans for women as the primary or co-applicant borrower. The discount compounds significantly over a 20-year loan.',
      },
      {
        q: 'Is Kotak good for self-employed home loans?',
        a: 'Kotak is one of the better banks for self-employed/business income segment. They accept 2-year ITR + 6-month bank statements (vs 3-year ITR at many other banks). Rate premium for self-employed is typically 25-50 bps over salaried.',
      },
      {
        q: 'Can I get a Kotak home loan against rental income?',
        a: 'Yes. Kotak discounts rental income at 65-75% when assessing serviceability (vs 50-60% at many banks). For investors with multiple rental properties, this materially increases borrowing capacity.',
      },
    ],
    metaKeywords: ['kotak emi calculator', 'kotak home loan emi', 'kotak mahindra emi', 'kotak personal loan'],
  },

  // ============ BoB ============
  {
    slug: 'bob',
    bankName: 'Bank of Baroda',
    fullName: 'Bank of Baroda',
    emoji: '🏛️',
    hqLocation: 'Vadodara, Gujarat',
    homeLoanRate: { min: 8.4, max: 10.4, typical: 8.65 },
    personalLoanRate: { min: 10.9, max: 17.05, typical: 11.5 },
    carLoanRate: { min: 8.9, max: 12.7, typical: 9.4 },
    processingFee: '0.50% of loan amount (max ₹10,000 for home loans)',
    prepaymentPolicy: 'Zero on floating retail home loans. Variable on fixed-rate.',
    marketContext: 'Bank of Baroda is one of India\'s largest public-sector banks post the 2019 merger with Dena Bank and Vijaya Bank. Strong presence in semi-urban and rural India. Home loan book around ₹1.2 lakh crore.',
    uniqueAngle: 'Best rates after SBI in the public-sector segment. Especially strong for affordable-housing PMAY beneficiaries with subsidy direct-credit to loan account.',
    productHighlights: [
      'Baroda Home Loan: 8.4-10.4% with up to ₹10 crore size',
      'Baroda Pre-Approved Home Loan for existing customers',
      'PMAY direct credit subsidy processing',
      'BoB Repo-linked home loan (transparent floating)',
      'Special rates for defense personnel and senior citizens',
    ],
    faqs: [
      {
        q: 'Is Bank of Baroda cheaper than SBI for home loans?',
        a: 'Marginally. BoB is typically 10-25 bps higher than SBI at any given LTV. BoB\'s advantage: faster processing in tier-2/3 cities where SBI branches can be slow. For metro customers, SBI usually wins on rate.',
      },
      {
        q: 'How does BoB process PMAY subsidy?',
        a: 'BoB directly receives the PMAY-CLSS subsidy from the National Housing Bank and credits it to your home loan principal (typically ₹2.30-2.67 lakh subsidy for EWS/LIG segments). No paperwork hassle on your end. You just submit eligibility documents at application time.',
      },
      {
        q: 'What is BoB Repo-linked home loan?',
        a: 'Per RBI mandate (since Oct 2019), retail floating-rate loans must be linked to an external benchmark. BoB uses the RBI repo rate. Your home loan rate = repo rate + spread (typically 2-3%). When RBI changes repo, your rate adjusts within 3 months.',
      },
    ],
    metaKeywords: ['bank of baroda emi calculator', 'bob home loan emi', 'baroda emi calculator', 'bob personal loan'],
  },

  // ============ PNB ============
  {
    slug: 'pnb',
    bankName: 'Punjab National Bank',
    fullName: 'Punjab National Bank',
    emoji: '🏛️',
    hqLocation: 'New Delhi',
    homeLoanRate: { min: 8.45, max: 10.25, typical: 8.65 },
    personalLoanRate: { min: 10.4, max: 17.95, typical: 12.75 },
    carLoanRate: { min: 8.7, max: 10.5, typical: 9.1 },
    processingFee: '0.35% of loan amount (max ₹15,000 for home loans). Concession during festival quarters.',
    prepaymentPolicy: 'Zero on floating-rate retail loans. 2% on fixed-rate prepayments.',
    marketContext: 'Punjab National Bank is India\'s second-largest public-sector bank after SBI, with about ₹15 lakh crore in deposits. Following the 2020 merger with United Bank and Oriental Bank of Commerce, PNB has a ~10,000-branch footprint, weighted toward North India. Home loan book is around ₹95,000 crore and growing at 18%/yr.',
    uniqueAngle: 'PNB has the largest agricultural and MSME lending book among PSBs after SBI, so it\'s typically the cheapest for borrowers whose income includes farm or small-business revenue. Government-sector employees also get priority processing.',
    productHighlights: [
      'PNB Gen-Next Housing Loan: 8.45-9.25% for under-35 salaried with up to 90% LTV',
      'PNB Pride Housing Loan: special rates for defense personnel (Army/Navy/Air Force/Police)',
      'PNB Max-Saver: home loan with overdraft, like SBI MaxGain',
      'PMAY-CLSS direct credit handling',
      'Top-up loans up to 70% of original loan amount for existing customers',
    ],
    faqs: [
      {
        q: 'PNB Gen-Next vs regular home loan: which is better?',
        a: 'PNB Gen-Next is a niche product for salaried borrowers under 35 working in central/state government, PSUs, listed corporates, or MNCs. Rate is 20-40 bps below standard floating rate and LTV goes up to 90%. The eligibility filter is strict. If you qualify, take it.',
      },
      {
        q: 'How does PNB Max-Saver compare to SBI MaxGain?',
        a: 'Both are home-loan overdraft hybrids that let you park surplus cash and reduce interest. PNB Max-Saver is structurally identical to SBI MaxGain but has lower minimum-balance friction and slightly higher rates (~10-15 bps). For high-cash-flow professionals, the convenience may be worth the small rate premium.',
      },
      {
        q: 'Is PNB safe after the Nirav Modi fraud?',
        a: 'Yes. The 2018 fraud was a one-off LoU-issuance episode; PNB has since cleaned up its books, returned to profitability, and met all RBI PCA exit criteria. Deposits are guaranteed up to ₹5 lakh per depositor by DICGC like every Indian bank, and PNB is classified as a Domestic Systemically Important Bank.',
      },
    ],
    metaKeywords: ['pnb emi calculator', 'punjab national bank emi', 'pnb home loan emi', 'pnb personal loan calculator'],
  },

  // ============ CANARA ============
  {
    slug: 'canara',
    bankName: 'Canara Bank',
    fullName: 'Canara Bank',
    emoji: '🏛️',
    hqLocation: 'Bengaluru, Karnataka',
    homeLoanRate: { min: 8.4, max: 10.3, typical: 8.55 },
    personalLoanRate: { min: 10.65, max: 16.1, typical: 12.25 },
    carLoanRate: { min: 8.75, max: 10.7, typical: 9.05 },
    processingFee: '0.50% of loan amount (max ₹10,000 for home loans). Often waived in festive promotions.',
    prepaymentPolicy: 'Zero on floating-rate retail home loans. 1% on fixed-rate.',
    marketContext: 'Canara Bank, headquartered in Bengaluru, is one of India\'s largest PSBs after the 2020 merger with Syndicate Bank. It now operates around 9,800 branches with strong southern India dominance. Home loan book exceeds ₹90,000 crore, with disproportionate share in Karnataka, Kerala, and Tamil Nadu.',
    uniqueAngle: 'Canara is the cheapest mainstream bank for South India real estate purchases due to processing-fee waivers and on-the-ground valuation networks in tier-2 South Indian cities. Repo-linked rates are among the lowest in PSB segment.',
    productHighlights: [
      'Canara Housing Loan: 8.40-9.40% repo-linked floating rate',
      'Canara Special Housing for Women: 5 bps additional rate concession',
      'Canara Home Loan to Senior Citizens (up to age 75 at maturity)',
      'PMAY-CLSS subsidy direct credit',
      'Canara Site Loan for plot-only purchases (separate product from construction)',
    ],
    faqs: [
      {
        q: 'Is Canara Bank cheaper than SBI in South India?',
        a: 'Often yes. Canara prices its repo-linked spread at 2.85-3.0% (vs SBI\'s 2.65-2.90%), but its processing fee structure and faster turnaround for South Indian properties usually nets out cheaper total cost of ownership. For Karnataka and Kerala specifically, Canara is the price leader.',
      },
      {
        q: 'Can I get a Canara plot-only loan?',
        a: 'Yes. Canara Site Loan finances pure plot purchases (no construction yet) up to ₹2 crore with 75% LTV and 15-year tenor. You can convert it to a regular home loan within 3 years of plot purchase if you build, often at preferential rates.',
      },
      {
        q: 'What\'s the maximum age for Canara home loans?',
        a: 'Loan maturity is capped at 70 years for salaried borrowers and 75 years for pensioners or self-employed with stable income proof. So a 60-year-old salaried applicant can borrow for a maximum 10-year term. Canara is more senior-friendly than HDFC/Kotak on this dimension.',
      },
    ],
    metaKeywords: ['canara bank emi calculator', 'canara home loan emi', 'canara bank personal loan emi', 'canara car loan emi'],
  },

  // ============ YES BANK ============
  {
    slug: 'yes-bank',
    bankName: 'Yes Bank',
    fullName: 'Yes Bank Limited',
    emoji: '🟦',
    hqLocation: 'Mumbai, Maharashtra',
    homeLoanRate: { min: 8.95, max: 11.4, typical: 9.5 },
    personalLoanRate: { min: 11.25, max: 21.0, typical: 13.5 },
    carLoanRate: { min: 9.25, max: 13.0, typical: 9.95 },
    processingFee: '1% of loan amount (min ₹10,000) for home loans. Personal loans often higher (up to 2.5%).',
    prepaymentPolicy: 'Zero on floating-rate retail loans post-12 EMIs. Lock-in for fixed-rate.',
    marketContext: 'Yes Bank is a mid-tier private-sector bank with about 1,200 branches and a focus on urban affluent customers. Post the 2020 RBI-led restructuring (SBI + 7 banks recapitalized it), Yes has stabilized at ~₹2.5 lakh crore in deposits. Home loan book is small (~₹15,000 crore) but growing as the bank rebuilds.',
    uniqueAngle: 'Yes Bank is one of the few mid-size private banks willing to do "non-standard" income profiles, gig workers with platform earnings (Zomato, Swiggy, Urban Company), crypto-trader filings, and freelance professionals, all at competitive rates.',
    productHighlights: [
      'Yes Home: 8.95-10.65% for salaried, fast online approval',
      'Yes Mid-Market Home Loan: for self-employed professionals (CAs, doctors, lawyers)',
      'Yes Pro-Loan: for gig and platform workers with 2+ years platform earnings',
      'Yes Personal Loan: digital approval in <30 mins for existing customers',
      'Pre-approved car loans for Yes Bank salary-account holders',
    ],
    faqs: [
      {
        q: 'Is Yes Bank safe after the 2020 moratorium?',
        a: 'Yes. Yes Bank exited PCA in late 2021 and has been consistently profitable since. SBI still owns 24% as anchor shareholder, with Carlyle and Advent International holding ~16.1% combined. Capital adequacy is at 17.3%, well above RBI\'s 11.5% requirement. Deposits are DICGC-insured up to ₹5 lakh per depositor like any Indian bank.',
      },
      {
        q: 'Can Zomato/Swiggy delivery partners get a Yes Bank loan?',
        a: 'Yes. Yes Pro-Loan specifically targets gig workers with 18+ months of platform earnings traceable via UPI/bank statements. Loan amounts up to ₹15 lakh, rates typically 200-300 bps above standard salaried rates due to income volatility risk. Documentation is platform-statement-driven, not Form 16.',
      },
      {
        q: 'Are Yes Bank home loan rates competitive?',
        a: 'Yes Bank prices home loans 50-100 bps above HDFC/SBI for prime salaried borrowers, so they are not the price leader. Their value is in approval speed (often same-day for pre-approved customers) and willingness to lend to non-standard income profiles that HDFC/SBI may reject.',
      },
    ],
    metaKeywords: ['yes bank emi calculator', 'yes bank home loan emi', 'yes pro loan calculator', 'yes bank personal loan'],
  },

  // ============ IDFC FIRST ============
  {
    slug: 'idfc-first',
    bankName: 'IDFC First Bank',
    fullName: 'IDFC First Bank Limited',
    emoji: '🔷',
    hqLocation: 'Mumbai, Maharashtra',
    homeLoanRate: { min: 8.85, max: 11.25, typical: 9.35 },
    personalLoanRate: { min: 10.49, max: 22.0, typical: 12.5 },
    carLoanRate: { min: 8.99, max: 14.5, typical: 9.7 },
    processingFee: '0.50-1.5% of loan amount (max ₹15,000 for home loans). Often discounted online.',
    prepaymentPolicy: 'Zero on floating-rate retail loans. Personal loan: foreclosure free after 6 EMIs.',
    marketContext: 'IDFC First Bank was formed by the 2018 merger of Capital First (an NBFC) and IDFC Bank. It now operates around 1,000 branches with a heavy focus on retail credit. Retail accounts for 76% of loan book vs ~50% at typical PSBs. Total advances around ₹2.4 lakh crore as of FY2025.',
    uniqueAngle: 'IDFC First is India\'s most digitally-native bank for personal loans: full e-KYC, soft-pull credit check, and disbursal in under 2 hours for existing customers. Also among the few banks offering monthly-reducing-balance personal loans transparently (vs hidden flat-rate at smaller lenders).',
    productHighlights: [
      'IDFC First Home Loan: 8.85-9.85% with 30-year term',
      'IDFC First Personal Loan: rates from 10.49% with full digital journey',
      'IDFC First Easy Home Loan for under-30 first-jobbers (lighter docs)',
      'Zero-charge savings account integration (bundled with loans)',
      'WealthFirst loans against mutual funds and equity holdings',
    ],
    faqs: [
      {
        q: 'Why is IDFC First Bank personal loan so popular?',
        a: 'Three reasons: (1) fully digital application with disbursal in 2 hours, (2) genuinely lower rates than most private banks for prime credit (CIBIL 800+), and (3) flexible foreclosure post-6 EMIs without charges. The combination of speed + price is rare in Indian retail credit.',
      },
      {
        q: 'IDFC First Easy Home Loan: what makes it different?',
        a: 'Easy Home Loan accepts younger first-time borrowers (typically 25-30 years) with less income history. The bank uses bank-statement-based scoring instead of full Form 16 + 3-year ITR. LTV is capped at 80% and rate is ~25-40 bps above standard, but eligibility is much broader.',
      },
      {
        q: 'Does IDFC First do loans against mutual funds?',
        a: 'Yes. WealthFirst Loan Against MF lets you borrow up to 50% of equity MF NAV and 75% of debt MF NAV without redeeming. Rates start around 9.5% and the line stays open as long as your MFs remain pledged. Useful for short-term liquidity without triggering capital gains.',
      },
    ],
    metaKeywords: ['idfc first emi calculator', 'idfc first home loan emi', 'idfc personal loan calculator', 'idfc first bank emi'],
  },

  // ============ INDUSIND ============
  {
    slug: 'indusind',
    bankName: 'IndusInd Bank',
    fullName: 'IndusInd Bank Limited',
    emoji: '🟪',
    hqLocation: 'Mumbai, Maharashtra (Pune registered)',
    homeLoanRate: { min: 8.7, max: 11.0, typical: 9.2 },
    personalLoanRate: { min: 10.49, max: 26.0, typical: 13.85 },
    carLoanRate: { min: 8.85, max: 12.5, typical: 9.45 },
    processingFee: '0.50-2.0% of loan amount (varies by product). Premier accounts get fee waivers.',
    prepaymentPolicy: 'Zero on floating retail home loans. 2% on fixed personal/auto loans.',
    marketContext: 'IndusInd Bank is a mid-large private-sector bank with roughly 3,000 branches across India and the Hinduja Group as anchor promoter. Total advances around ₹3.7 lakh crore as of FY2025, with strong commercial vehicle financing (largest in private banks) and microfinance subsidiary Bharat Financial Inclusion.',
    uniqueAngle: 'IndusInd is the market leader for vehicle financing in India, particularly commercial vehicles, two-wheelers in tier-3/4 markets, and used cars. Home loan rates are typical for mid-tier private, but their digital car loan approval is industry-best.',
    productHighlights: [
      'IndusInd Home Loan: 8.70-10.20% with up to 30-year tenor',
      'IndusInd Easy Car Loan: 100% on-road financing for new cars',
      'IndusInd Used Car Loan: pre-owned car financing at 9.5-13%',
      'Two-wheeler loans (including superbikes) up to ₹25 lakh',
      'IndusEasy Home Loan: digital-first for under-35 salaried',
    ],
    faqs: [
      {
        q: 'Why is IndusInd Bank known for car loans?',
        a: 'IndusInd is India\'s largest car/CV financier in the private-sector bank space, with ~15% market share in new-car financing. Their digital approval flow takes <30 minutes for pre-approved Indus customers and includes ex-showroom + insurance + registration in one disbursal. They also do 100% on-road financing for select car models, rare in the industry.',
      },
      {
        q: 'Is IndusInd safe? I heard about MFI book stress.',
        a: 'IndusInd Bharat Financial Inclusion (the microfinance subsidiary) saw stress in FY2025 with rising delinquencies in the unsecured rural-MFI book. Provisioning impacted profitability. The core bank remained well-capitalized (CRAR ~16%) and the MFI book is ~8% of total assets, so contagion to depositors is unlikely. DICGC ₹5 lakh insurance applies.',
      },
      {
        q: 'IndusInd two-wheeler loan: superbike financing?',
        a: 'Yes. IndusInd is one of the few banks that finances premium two-wheelers (Ducati, Triumph, Royal Enfield big-cubic-capacity, KTM) up to ₹25 lakh ex-showroom. Tenor up to 5 years, rate around 11-13% for prime credit. Useful for buyers who would otherwise be forced into showroom financing at 15%+.',
      },
    ],
    metaKeywords: ['indusind emi calculator', 'indusind bank home loan emi', 'indusind car loan calculator', 'indusind personal loan emi'],
  },

  // ============ FEDERAL BANK ============
  {
    slug: 'federal',
    bankName: 'Federal Bank',
    fullName: 'The Federal Bank Limited',
    emoji: '🟧',
    hqLocation: 'Aluva, Kerala',
    homeLoanRate: { min: 8.5, max: 10.55, typical: 8.85 },
    personalLoanRate: { min: 10.49, max: 17.99, typical: 11.95 },
    carLoanRate: { min: 8.85, max: 11.5, typical: 9.4 },
    processingFee: '0.50% of loan amount (min ₹3,000, max ₹7,500 for home loans).',
    prepaymentPolicy: 'Zero on floating-rate retail home loans. Variable on personal/auto.',
    marketContext: 'Federal Bank is a Kerala-headquartered mid-size private-sector bank with about 1,500 branches, including disproportionate presence in Kerala, Karnataka, Tamil Nadu, and the Gulf NRI corridor. Total advances around ₹2.5 lakh crore. NRI banking accounts for ~35% of deposits, among the highest of any Indian bank.',
    uniqueAngle: 'Federal Bank is the go-to lender for Gulf-NRI home loans. They have dedicated relationship desks in UAE, Saudi, Qatar, Bahrain, Oman, and Kuwait. Their NRI home loan documentation is friction-free for property purchases in Kerala, Karnataka, and Tamil Nadu.',
    productHighlights: [
      'Federal Home Loan: 8.50-9.50% repo-linked floating rate',
      'Federal NRI Home Loan: doorstep documentation across GCC',
      'Federal Smart Home Loan: home loan + overdraft hybrid (like MaxGain)',
      'Federal Pravasi Special: special rates for repatriating NRIs',
      'Federal Two-Wheeler Loan with online disbursal',
    ],
    faqs: [
      {
        q: 'Best bank for NRI home loans: is Federal a top pick?',
        a: 'Yes. Federal Bank is one of the top 3 NRI home loan lenders alongside SBI and ICICI, and arguably the most convenient if you\'re GCC-based. They have local relationship managers in major GCC cities, accept salary statements in foreign currency at standard exchange rate, and process repatriation of property sale proceeds through the same account.',
      },
      {
        q: 'Federal Smart Home Loan vs regular home loan?',
        a: 'Smart Home Loan is Federal\'s overdraft-linked product (analogous to SBI MaxGain). Surplus deposits reduce daily interest calculation while remaining accessible for withdrawal. For NRIs receiving lumpy income (yearly bonus from GCC employer), the cash-management flexibility easily covers the small rate premium (~10-15 bps).',
      },
      {
        q: 'Does Federal Bank lend to UAE or Saudi residents directly?',
        a: 'Yes, for property purchases in India. Federal Bank\'s GCC representative offices in Dubai, Abu Dhabi, Doha, Riyadh, Kuwait City, and Muscat handle full documentation: KYC, income proof in AED/SAR/QAR/KWD/OMR, property valuation in India, and final disbursal. You don\'t need to fly back to India for any signing.',
      },
    ],
    metaKeywords: ['federal bank emi calculator', 'federal bank home loan emi', 'federal nri home loan', 'federal bank personal loan emi'],
  },

  // ============ RBL ============
  {
    slug: 'rbl',
    bankName: 'RBL Bank',
    fullName: 'RBL Bank Limited',
    emoji: '🟥',
    hqLocation: 'Mumbai, Maharashtra',
    homeLoanRate: { min: 9.0, max: 11.5, typical: 9.65 },
    personalLoanRate: { min: 12.95, max: 23.0, typical: 14.5 },
    carLoanRate: { min: 9.5, max: 13.5, typical: 10.25 },
    processingFee: '1-2% of loan amount (min ₹5,000) for personal loans. Home loans 0.5-1% (max ₹15,000).',
    prepaymentPolicy: 'Zero on floating-rate retail home loans. 2-4% on fixed-rate personal loan prepayments.',
    marketContext: 'RBL Bank (formerly Ratnakar Bank, renamed 2014) is a mid-tier private-sector bank with about 525 branches and a focus on retail and SME banking. Total advances around ₹85,000 crore as of FY2025. RBL is a major credit card issuer in partnership with Bajaj Finance, having issued ~5 million cards, the 4th largest in India. The 2022 leadership change (Subramaniakumar replaced Vishwavir Ahuja) stabilized the bank after asset-quality concerns in 2019-2021.',
    uniqueAngle: 'RBL is the dominant private-bank partner for Bajaj Finance-issued credit cards in India and runs one of the most aggressive personal loan pre-approval engines for Bajaj Finserv customers. For Bajaj EMI Card holders specifically, RBL pre-approved offers are typically 50-100 bps below standard rate cards.',
    productHighlights: [
      'RBL Home Loan: 9.0-10.0% repo-linked floating rate',
      'RBL Personal Loan: digital approval in 30 minutes for pre-approved customers',
      'RBL Bajaj Finserv co-branded credit cards (largest portfolio)',
      'RBL Salary Account home loans with relationship-based discounts',
      'RBL CreditCard EMI conversion at competitive rates',
    ],
    faqs: [
      {
        q: 'Is RBL Bank safe? I remember concerns from 2019.',
        a: 'RBL had asset-quality stress in 2019-2021, particularly in unsecured retail and microfinance. The 2022 leadership change brought R. Subramaniakumar (ex-IOB CEO) who reduced unsecured exposure, increased provisioning, and restored CAR to 16.7%. The 2023 Mahindra Group strategic stake (3.5%) added an anchor shareholder. As of FY2025, RBL is profitable and CAR is well above RBI requirements. Deposits are DICGC-insured up to ₹5 lakh per depositor like every Indian bank.',
      },
      {
        q: 'RBL Bajaj Finserv credit cards: why are they popular?',
        a: 'RBL issues most Bajaj Finserv-co-branded credit cards in India, leveraging Bajaj\'s 100 million-strong customer base from consumer durable loans. Cards come with EMI conversion, rewards on Bajaj-network purchases, and lifetime fee waivers on certain spend thresholds. For consumers already in the Bajaj credit ecosystem, the RBL co-branded card is the natural upgrade path.',
      },
      {
        q: 'RBL home loan vs HDFC/ICICI: competitive?',
        a: 'For prime salaried borrowers below ₹1 crore loan size: RBL is typically 30-60 bps more expensive than HDFC/ICICI and slower on processing. RBL\'s sweet spot is the existing-customer segment. Bajaj Finserv credit card holders and RBL salary account holders get materially better pre-approved offers (sometimes matching HDFC). For non-RBL-customer fresh applications, HDFC/ICICI/Axis are better choices.',
      },
    ],
    metaKeywords: ['rbl emi calculator', 'rbl bank home loan emi', 'rbl personal loan calculator', 'ratnakar bank emi calculator'],
  },

  // ============ BANDHAN ============
  {
    slug: 'bandhan',
    bankName: 'Bandhan Bank',
    fullName: 'Bandhan Bank Limited',
    emoji: '🔴',
    hqLocation: 'Kolkata, West Bengal',
    homeLoanRate: { min: 9.15, max: 12.0, typical: 9.85 },
    personalLoanRate: { min: 12.5, max: 21.0, typical: 14.25 },
    carLoanRate: { min: 9.5, max: 13.0, typical: 10.5 },
    processingFee: '1% of loan amount (min ₹5,000, max ₹20,000) for home loans. Personal loans 1-2.5%.',
    prepaymentPolicy: 'Zero on floating-rate retail home loans. 2-3% on personal/auto loan foreclosure within 12 months.',
    marketContext: 'Bandhan Bank started as a microfinance institution (Bandhan Financial Services, 2001) and became a universal bank in 2015, the first MFI ever to receive an RBI universal banking license. It operates around 6,200 banking outlets concentrated in East and Northeast India. Total advances around ₹1.4 lakh crore, ~25% microbanking and ~75% commercial/retail post-diversification. The 2019 acquisition of Gruh Finance (HDFC subsidiary) added a meaningful affordable-housing book.',
    uniqueAngle: 'Bandhan is uniquely positioned for East India affordable housing. Through the Gruh Finance acquisition, it has deep affordable-segment underwriting expertise rare among new-private-sector banks. For West Bengal, Assam, Odisha, and Northeast home loan buyers in the under-₹40 lakh segment, Bandhan often beats SBI on speed and matches on rate.',
    productHighlights: [
      'Bandhan Home Loan: 9.15-10.5% with PMAY-CLSS direct credit',
      'Bandhan Gruh affordable housing product (legacy Gruh Finance customers)',
      'Bandhan Group Loan (microfinance: JLG model, original product)',
      'Bandhan Personal Loan: rates from 12.5% with fast digital approval',
      'Bandhan Two-Wheeler Loan with PSU-employee tie-ups',
    ],
    faqs: [
      {
        q: 'Bandhan Bank for affordable housing in East India?',
        a: 'Yes. Bandhan is one of the top 3 lenders for affordable housing (under ₹40 lakh) in West Bengal, Assam, Odisha, Tripura, and other Northeast states. The Gruh Finance acquisition (2019) brought decades of affordable-segment underwriting expertise. Bandhan processes PMAY-CLSS subsidies (₹2.30-2.67 lakh) directly with NHB and credits to loan principal. For Kolkata, Guwahati, Bhubaneswar first-time buyers earning under ₹18 lakh/year, Bandhan is competitive with SBI on rate plus often faster processing.',
      },
      {
        q: 'Is Bandhan Bank safe? What happened to the Gruh Finance team?',
        a: 'Bandhan is RBI-regulated as a scheduled commercial bank with full BR Act protections. The 2024-2025 microbanking portfolio saw stress (rising NPAs in unsecured group loans across the sector), driving Bandhan to increase provisioning and slow MFI growth. Capital adequacy remains above 16%. The Gruh Finance team was largely integrated post-acquisition; some senior leadership departed but the affordable-housing book continues to grow under Bandhan branding. DICGC ₹5 lakh insurance applies.',
      },
      {
        q: 'Bandhan vs SBI for Kolkata home loan?',
        a: 'SBI is cheaper by 10-25 bps and has deeper branch density across Kolkata. Bandhan is faster on processing (5-8 days vs 12-20 days at SBI) and has more aggressive pre-approved offers for Bandhan salary account holders. For sub-₹40 lakh affordable segment with PMAY eligibility: Bandhan is meaningfully better on combined experience. For premium South Kolkata (Alipore, Ballygunge) ₹1 crore+ purchases: HDFC, ICICI, or SBI dominate.',
      },
    ],
    metaKeywords: ['bandhan bank emi calculator', 'bandhan home loan emi', 'gruh finance home loan', 'bandhan personal loan'],
  },

  // ============ IDBI ============
  {
    slug: 'idbi',
    bankName: 'IDBI Bank',
    fullName: 'IDBI Bank Limited',
    emoji: '🏛️',
    hqLocation: 'Mumbai, Maharashtra',
    homeLoanRate: { min: 8.55, max: 10.65, typical: 8.85 },
    personalLoanRate: { min: 10.5, max: 17.95, typical: 12.75 },
    carLoanRate: { min: 8.9, max: 12.4, typical: 9.5 },
    processingFee: '0.50% of loan amount (max ₹7,500 for home loans). Personal loans 1-2.5%.',
    prepaymentPolicy: 'Zero on floating-rate retail home loans. Variable on personal/auto.',
    marketContext: 'IDBI Bank was originally a development finance institution (Industrial Development Bank of India, est. 1964) converted to a universal bank in 2005. After years of stress and PCA framework, LIC acquired 49.24% controlling stake in 2019 and the government further reduced its holding. Total advances around ₹1.95 lakh crore. The 2022-2026 LIC + government divestment process has been ongoing, with strategic buyer bidding from Fairfax, Kotak Mahindra, and Emirates NBD reported across various rounds.',
    uniqueAngle: 'IDBI Bank gets disproportionate benefit from being LIC-controlled. LIC agent network cross-sells IDBI banking products to LIC policyholders (250+ million strong), driving deposit and retail loan acquisition. For LIC policyholders, IDBI offers preferential home loan rates and bundled policy-backed loan facilities not available elsewhere.',
    productHighlights: [
      'IDBI Home Loan: 8.55-9.85% repo-linked with LIC policyholder discount',
      'IDBI Loan Against LIC Policy at preferential rates',
      'IDBI Personal Loan with EMI-tied-to-policy-premium options',
      'IDBI Sugam Express Home Loan for digital pre-approval',
      'IDBI Reverse Mortgage for senior citizens (rare offering)',
    ],
    faqs: [
      {
        q: 'IDBI home loan: am I eligible if I have an LIC policy?',
        a: 'Yes. LIC policyholders get preferential treatment at IDBI Bank including 5-15 bps rate discount on home loans, fast-track processing (often 5-7 days), and bundled loan-against-policy facilities. The LIC + IDBI relationship is one of India\'s most integrated insurance-banking partnerships. Walk into any IDBI branch with your LIC policy details and you\'ll be offered the policyholder rate card.',
      },
      {
        q: 'IDBI Bank ownership: government, LIC, or private?',
        a: 'As of 2026, LIC holds 49.24% and the Government of India holds 45.5%, with the residual 5.26% in public float. The government has been pursuing strategic divestment since 2022 with bids from Fairfax-led consortium, Kotak Mahindra Bank, and Emirates NBD reported in different rounds. As of early 2026, the divestment is still pending closure but expected to conclude in 2026-2027. The bank operates as a private sector bank for regulatory purposes despite government ownership.',
      },
      {
        q: 'IDBI Bank Reverse Mortgage: how does it work?',
        a: 'IDBI is one of the few major Indian banks offering reverse mortgages for senior citizens (60+). Structure: bank pays you monthly cash against your home equity (typically up to 80% of property value, monthly payments over 15-20 years), and the property is sold to settle the loan at your death or move-out. No EMIs paid by you during the term. Useful for asset-rich, cash-poor seniors. Other banks (SBI, PNB) offer similar products but IDBI was the first to market and has the largest book.',
      },
    ],
    metaKeywords: ['idbi emi calculator', 'idbi bank home loan emi', 'idbi personal loan calculator', 'idbi reverse mortgage'],
  },

  // ============ INDIAN BANK ============
  {
    slug: 'indian-bank',
    bankName: 'Indian Bank',
    fullName: 'Indian Bank',
    emoji: '🏛️',
    hqLocation: 'Chennai, Tamil Nadu',
    homeLoanRate: { min: 8.45, max: 10.4, typical: 8.65 },
    personalLoanRate: { min: 10.65, max: 16.85, typical: 12.5 },
    carLoanRate: { min: 8.85, max: 11.3, typical: 9.25 },
    processingFee: '0.40% of loan amount (max ₹10,000 for home loans). Often waived in festival promotions.',
    prepaymentPolicy: 'Zero on floating-rate retail home loans. 1% on fixed-rate personal loans.',
    marketContext: 'Indian Bank, headquartered in Chennai, is one of India\'s major PSBs post the 2020 merger with Allahabad Bank. It now operates around 6,000 branches with dominant presence in Tamil Nadu, Kerala, Andhra Pradesh, and West Bengal (from the Allahabad legacy). Total advances around ₹5.7 lakh crore. Indian Bank is the #1 home loan lender in Tamil Nadu by branch count and originations, ahead of even SBI in tier-2/3 Tamil Nadu cities.',
    uniqueAngle: 'Indian Bank dominates Tamil Nadu home loans, a combination of deep branch network (1,500+ Tamil Nadu branches), competitive repo-linked spread (2.75-2.85%, among the lowest in PSB segment), and Tamil Nadu government employee payroll arrangements. For Chennai, Coimbatore, Madurai, Tiruchi, and Salem home buyers, Indian Bank is typically the cheapest mainstream lender.',
    productHighlights: [
      'IB Home Loan: 8.45-9.45% repo-linked floating rate',
      'IB Pravasi Bharatiya Home Loan: NRI-specific product with GCC desks',
      'IB Doctor Home Loan: special tier for medical professionals',
      'IB Plot Purchase Loan: standalone plot financing up to ₹2 crore',
      'PMAY-CLSS subsidy direct credit handling',
    ],
    faqs: [
      {
        q: 'Indian Bank home loan in Chennai: is it the cheapest?',
        a: 'Yes, for mainstream salaried Tamil Nadu home loans, Indian Bank is typically the cheapest mainstream lender: 8.45-8.65% repo-linked rate vs 8.55-8.85% at SBI, 8.50-8.85% at Canara, 8.65-9.50% at HDFC/ICICI/Axis. The combination of low spread, deep TN branch network, and TN government payroll integration makes Indian Bank the default first stop for Tamil Nadu buyers seeking rate-optimized home loans.',
      },
      {
        q: 'Indian Bank IB Doctor Home Loan: what makes it special?',
        a: 'IB Doctor Home Loan is targeted at medical professionals (MBBS, MD, MS, DNB, BDS) with separate rate tier, often 25-50 bps below standard. Eligibility: MCI or NMC registration, 2+ years post-qualification, minimum income tier. Includes overdraft facility against the loan account and easier underwriting for self-employed doctors (clinic income statements accepted in place of full ITR). Useful for doctors purchasing clinic-cum-residence properties common in tier-2/3 Tamil Nadu.',
      },
      {
        q: 'Indian Bank NRI home loan via Pravasi Bharatiya?',
        a: 'IB Pravasi Bharatiya is one of the top 3 NRI home loan products in India alongside SBI NRI and Federal Pravasi Special. Indian Bank has dedicated NRI desks in major GCC cities (UAE, Saudi, Qatar, Bahrain, Oman, Kuwait) with local relationship managers. Document handling is door-to-door (you don\'t need to fly back to India for signing). Particularly strong for Tamil and Telugu NRIs in GCC buying property in Chennai, Coimbatore, Hyderabad, or Bangalore.',
      },
    ],
    metaKeywords: ['indian bank emi calculator', 'indian bank home loan emi', 'ib home loan calculator', 'indian bank personal loan'],
  },

  // ============ UNION BANK ============
  {
    slug: 'union-bank',
    bankName: 'Union Bank of India',
    fullName: 'Union Bank of India',
    emoji: '🏛️',
    hqLocation: 'Mumbai, Maharashtra',
    homeLoanRate: { min: 8.5, max: 10.5, typical: 8.75 },
    personalLoanRate: { min: 10.85, max: 16.85, typical: 12.65 },
    carLoanRate: { min: 8.9, max: 11.5, typical: 9.35 },
    processingFee: '0.50% of loan amount (max ₹15,000 for home loans).',
    prepaymentPolicy: 'Zero on floating-rate retail home loans. 1-2% on fixed-rate.',
    marketContext: 'Union Bank of India is one of India\'s major PSBs after the 2020 merger with Andhra Bank and Corporation Bank. It now operates around 8,500 branches with strong presence across Andhra Pradesh (Andhra Bank legacy), Maharashtra, Karnataka, and Kerala (Corporation Bank legacy). Total advances around ₹9 lakh crore, the 5th largest PSB after SBI, PNB, BoB, Canara. The home loan book is around ₹1.1 lakh crore growing at ~18%/yr.',
    uniqueAngle: 'Union Bank has the deepest PSU presence in coastal Andhra Pradesh, coastal Karnataka, and Telangana. Branch density inherited from the Andhra Bank and Corporation Bank merger means Union Bank is often the only major PSB within 20km in many tier-3 South Indian towns. For Andhra Pradesh and Telangana home buyers, particularly in tier-2/3 cities, Union Bank is typically the rate leader.',
    productHighlights: [
      'Union Home Loan: 8.50-9.50% repo-linked floating rate',
      'Union Awas: PMAY-CLSS focused affordable housing product',
      'Union NRI Home Loan with Andhra/Telugu NRI corridor focus',
      'Union Smart Loan: home loan + overdraft hybrid',
      'Union Sangam Home Loan: special women-borrower discount tier',
    ],
    faqs: [
      {
        q: 'Union Bank for Andhra Pradesh and Telangana home loans?',
        a: 'Yes. Union Bank inherited Andhra Bank\'s dense AP/Telangana branch network (300+ branches in each state) and combines it with Union Bank\'s lower spread (typically 25-50 bps below HDFC/ICICI). For Hyderabad, Visakhapatnam, Vijayawada, Tirupati, and Guntur home buyers, Union Bank is competitive with SBI on rate and usually faster than SBI on processing due to deeper branch concentration.',
      },
      {
        q: 'Union Bank Sangam Home Loan for women: what is the discount?',
        a: 'Union Sangam offers 5 bps rate concession to women primary borrowers (or co-borrowers where the property is in joint name with woman as first applicant). Combined with state-level women stamp duty discounts (typically 1% in Maharashtra, Karnataka, Delhi), the all-in cost saving over a 20-year ₹80 lakh loan can be ₹1.5-2 lakh. Most PSU banks now have similar women-borrower programs but Union\'s branch-level processing on this is efficient.',
      },
      {
        q: 'Union Bank Telugu NRI corridor: how does it work?',
        a: 'Union Bank has dedicated Telugu NRI desks (legacy Andhra Bank) in major GCC cities (Saudi Arabia, UAE, Qatar) and the US (specifically in Texas, New Jersey, Chicago, all areas with large Telugu IT professional populations). Documentation for NRI home loans in Hyderabad, Vizag, Vijayawada is streamlined: salary statements in foreign currency, embassy-attested documents accepted, and family-member POA arrangements for property signings. LTV typically 70% (vs 80% for resident applicants).',
      },
    ],
    metaKeywords: ['union bank emi calculator', 'union bank home loan emi', 'union awas calculator', 'union bank of india personal loan'],
  },

  // ============ IOB ============
  {
    slug: 'iob',
    bankName: 'Indian Overseas Bank',
    fullName: 'Indian Overseas Bank',
    emoji: '🏛️',
    hqLocation: 'Chennai, Tamil Nadu',
    homeLoanRate: { min: 8.4, max: 10.5, typical: 8.6 },
    personalLoanRate: { min: 10.85, max: 16.25, typical: 12.5 },
    carLoanRate: { min: 8.85, max: 11.45, typical: 9.25 },
    processingFee: '0.50% of loan amount (max ₹10,000 for home loans). Concession during festival quarters.',
    prepaymentPolicy: 'Zero on floating-rate retail home loans. 1-2% on fixed-rate.',
    marketContext: 'Indian Overseas Bank, headquartered in Chennai, is a mid-tier PSU with about 3,200 branches concentrated in Tamil Nadu (its home state), Karnataka, Andhra Pradesh, and overseas branches in Hong Kong, Bangkok, Singapore, and Sri Lanka. Total advances around ₹2.3 lakh crore. IOB exited the RBI PCA framework in September 2021 after recapitalization and has been consistently profitable since FY2022. Home loan book around ₹35,000 crore growing at 20%/year.',
    uniqueAngle: 'IOB has the largest overseas branch presence among Indian PSU banks (4 international branches in Hong Kong, Bangkok, Singapore, Colombo), giving it unique advantages for NRI home loan customers in Southeast Asia. IOB also has a deep Tamil Nadu rural and semi-urban network. It is the bank that "knows" tier-3 Tamil Nadu property markets better than HDFC/ICICI.',
    productHighlights: [
      'IOB Home Loan: 8.4-9.4% repo-linked floating rate',
      'IOB Subha Gruha: special PMAY-CLSS focused affordable housing',
      'IOB NRI Home Loan with HK/Singapore/Bangkok branch handling',
      'IOB Doctor Home Loan: medical professional tier',
      'IOB Plot Loan: standalone plot purchase financing',
    ],
    faqs: [
      {
        q: 'Is IOB safe? It was under RBI PCA: what changed?',
        a: 'IOB was placed under RBI\'s Prompt Corrective Action framework in 2015 due to high NPAs. After government recapitalization (~₹16,000 crore total infusion over 2015-2021), provisioning, and bad-loan resolution, IOB exited PCA in September 2021. Since FY2022, the bank has been consistently profitable, capital adequacy is around 16-17%, and gross NPA has fallen from peak 25% to under 4%. RBI now classifies IOB as fully compliant with all regulatory norms. DICGC ₹5 lakh deposit insurance applies as for any Indian bank.',
      },
      {
        q: 'IOB NRI home loan via Singapore/HK branches: how does it work?',
        a: 'IOB has fully-functional branches in Singapore, Hong Kong, Bangkok, and Colombo where Indian-origin residents can directly apply for India home loans. Documents (KYC, income proof, employment proof) submitted at the foreign branch flow to the Chennai head office for processing. LTV typically 70% (vs 80% for resident applicants). For Singapore/HK-based Indian tech professionals buying property in Chennai, Bangalore, or Hyderabad, IOB offers door-to-door service rare among Indian PSU banks abroad.',
      },
      {
        q: 'IOB for tier-3 Tamil Nadu rural property purchase?',
        a: 'IOB is one of the strongest banks for tier-3 Tamil Nadu (Erode, Tirunelveli, Thanjavur, Cuddalore, Karur, Karaikudi) home loans. The branch density (~1,200 Tamil Nadu branches) and local valuer networks mean IOB can process rural property loans faster than HDFC/ICICI (who often don\'t have branches in these towns). For agricultural-linked households and traditional Tamil Nadu retail families, IOB is often the bank with the longest-standing relationship, sometimes 50+ years across multiple generations.',
      },
    ],
    metaKeywords: ['iob emi calculator', 'indian overseas bank home loan emi', 'iob personal loan calculator', 'iob nri home loan'],
  },

  // ============ BANK OF INDIA ============
  {
    slug: 'bank-of-india',
    bankName: 'Bank of India',
    fullName: 'Bank of India',
    emoji: '🏛️',
    hqLocation: 'Mumbai, Maharashtra',
    homeLoanRate: { min: 8.5, max: 10.5, typical: 8.75 },
    personalLoanRate: { min: 10.85, max: 16.85, typical: 12.5 },
    carLoanRate: { min: 8.85, max: 12.0, typical: 9.35 },
    processingFee: '0.25% of loan amount (max ₹15,000 for home loans). One of the lowest in the PSB segment.',
    prepaymentPolicy: 'Zero on floating-rate retail home loans. 1% on fixed-rate.',
    marketContext: 'Bank of India is one of India\'s oldest PSU banks (est. 1906, nationalized 1969), headquartered in Mumbai with about 5,100 branches across India and 24 international offices. Total advances around ₹6 lakh crore. BoI has historically been strong in Maharashtra and Gujarat with a large MSME and agricultural lending book. The home loan book is around ₹70,000 crore, growing at ~16%/year. BoI exited RBI PCA in 2019 after recapitalization.',
    uniqueAngle: 'Bank of India has the largest international branch network among Indian PSUs (24 branches in 18 countries including London, New York, Singapore, Tokyo, Paris, Hong Kong), making it the dominant NRI bank for Europe-based and Asia-Pacific Indians. For Indian-origin professionals in London, Paris, Frankfurt, Singapore, and Tokyo buying property back home, BoI offers door-to-door home loan processing.',
    productHighlights: [
      'BoI Star Home Loan: 8.5-9.5% repo-linked rate',
      'BoI Star Diamond Home Loan for premium customers (HNI segment)',
      'BoI NRI Home Loan with global branch network handling',
      'BoI Pre-Approved Personal Loan for Star salary account holders',
      'BoI Reverse Mortgage Loan Enabled Annuity (senior citizens)',
    ],
    faqs: [
      {
        q: 'Bank of India for NRI home loans in Europe?',
        a: 'BoI is one of the top 3 Indian banks for European NRI home loans alongside SBI and ICICI. The London, Paris, and Frankfurt branches handle full home loan documentation locally: salary statements in EUR/GBP, embassy attestation, and property paperwork all processed without flying to India. Particularly strong for Indian-origin professionals in finance (London), tech (Berlin, Munich), and pharma (Switzerland-based Indians) buying property in Mumbai, Pune, Bangalore, Hyderabad, or Chennai.',
      },
      {
        q: 'BoI Star Diamond Home Loan: what makes it different?',
        a: 'Star Diamond is BoI\'s HNI-segment home loan product with negotiable rates typically 25-50 bps below the standard rate card. Eligibility: net worth above ₹2 crore or AUM with BoI above ₹50 lakh. Includes dedicated relationship manager, priority processing (3-5 day disbursal vs 10-15 standard), and bundled wealth-advisory services. Most useful for senior corporate executives and business owners with ₹2-10 crore home purchases in Mumbai, Delhi, Bangalore metros.',
      },
      {
        q: 'BoI reverse mortgage annuity: how is it different from IDBI?',
        a: 'Both BoI and IDBI offer reverse mortgages to senior citizens but with different structures. BoI\'s "Star Reverse Mortgage Loan Enabled Annuity" pays you a fixed monthly annuity for a specified period (5-20 years) against your home equity, then settles via property sale at term end or your death. IDBI\'s product is more flexible on payment structure but with a smaller maximum loan size. For seniors who want predictable monthly income without estate-planning complexity, BoI\'s structured annuity is often preferred.',
      },
    ],
    metaKeywords: ['bank of india emi calculator', 'boi home loan emi', 'star home loan calculator', 'bank of india nri home loan'],
  },

  // ============ CENTRAL BANK OF INDIA ============
  {
    slug: 'central-bank',
    bankName: 'Central Bank of India',
    fullName: 'Central Bank of India',
    emoji: '🏛️',
    hqLocation: 'Mumbai, Maharashtra',
    homeLoanRate: { min: 8.45, max: 10.45, typical: 8.7 },
    personalLoanRate: { min: 10.55, max: 16.35, typical: 12.25 },
    carLoanRate: { min: 8.7, max: 11.5, typical: 9.15 },
    processingFee: '0.50% of loan amount (max ₹15,000 for home loans).',
    prepaymentPolicy: 'Zero on floating-rate retail home loans. Variable on fixed-rate.',
    marketContext: 'Central Bank of India is India\'s oldest commercial bank (est. 1911, first Indian-owned commercial bank), headquartered in Mumbai with about 4,500 branches concentrated in Madhya Pradesh, Maharashtra, Uttar Pradesh, and Bihar. Total advances around ₹2.7 lakh crore. The bank was under RBI PCA framework from 2017 to 2022 due to NPA stress, exited after government recapitalization (~₹14,000 crore total) and operational turnaround. Home loan book around ₹35,000 crore.',
    uniqueAngle: 'Central Bank has one of the deepest Madhya Pradesh and Bihar branch networks among Indian PSUs, often the only major bank within 20km in many tier-3 MP and Bihar towns. For these geographies, particularly for affordable housing and PMAY-CLSS segment first-time buyers, Central Bank is the rate-competitive natural choice with strong local underwriting expertise.',
    productHighlights: [
      'CB Home Loan: 8.45-9.45% repo-linked floating rate',
      'Cent Awas: PMAY-CLSS focused affordable housing product',
      'Cent NRI Home Loan with Gulf NRI desk',
      'Cent Senior Home Loan for ages 50+',
      'Cent Plot Loan: pure plot purchase up to ₹2 crore',
    ],
    faqs: [
      {
        q: 'Central Bank of India for Madhya Pradesh home loans?',
        a: 'Yes. Central Bank has the deepest MP branch network among national banks (~700 branches across Bhopal, Indore, Gwalior, Jabalpur, and tier-3 cities). The combination of competitive 2.85% repo-linked spread, processing-fee-friendly festival promotions, and well-established local valuer networks means Central Bank is typically the rate-leader for Madhya Pradesh first-time home buyers. For Bhopal and Indore mid-segment purchases (₹30-70 lakh), Central Bank often beats HDFC/ICICI by 30-60 bps on all-in cost.',
      },
      {
        q: 'Cent Awas vs PMAY-CLSS standard processing?',
        a: 'Cent Awas is Central Bank\'s dedicated affordable-housing product fine-tuned for PMAY-CLSS subsidy eligibility: pre-validated documentation templates, faster NHB subsidy submission, and direct credit of the ₹2.30-2.67 lakh subsidy to your home loan principal. For families earning under ₹18 lakh/year buying primary residence under ₹35 lakh in tier-2/3 cities, Cent Awas is one of the smoothest PMAY application paths in the PSU bank segment.',
      },
      {
        q: 'Central Bank exited PCA in 2022: is it safe now?',
        a: 'Yes. Central Bank exited RBI\'s Prompt Corrective Action framework in September 2022 after meeting all four exit criteria (capital adequacy, NPA ratios, profitability, leverage). Since exit, the bank has been consistently profitable with capital adequacy around 15.5%. Gross NPA has fallen from peak 22% in 2018 to under 5% in 2025. DICGC ₹5 lakh deposit insurance applies, and Central Bank is classified as a fully compliant scheduled commercial bank.',
      },
    ],
    metaKeywords: ['central bank emi calculator', 'central bank of india home loan emi', 'cent awas calculator', 'central bank personal loan'],
  },

  // ============ SOUTH INDIAN BANK ============
  {
    slug: 'south-indian-bank',
    bankName: 'South Indian Bank',
    fullName: 'The South Indian Bank Limited',
    emoji: '🟧',
    hqLocation: 'Thrissur, Kerala',
    homeLoanRate: { min: 8.7, max: 10.85, typical: 9.05 },
    personalLoanRate: { min: 11.5, max: 18.0, typical: 13.0 },
    carLoanRate: { min: 9.05, max: 11.85, typical: 9.65 },
    processingFee: '0.50% of loan amount (min ₹3,000, max ₹7,500 for home loans).',
    prepaymentPolicy: 'Zero on floating-rate retail home loans.',
    marketContext: 'South Indian Bank, headquartered in Thrissur, Kerala, is a mid-size private-sector bank with about 950 branches and over 1 million NRI customers concentrated in Kerala and the Gulf NRI corridor. Total advances around ₹85,000 crore. NRI deposits account for ~30% of total deposits, among the highest of any Indian bank. The bank emerged from the 2020 leadership-change turmoil under MD Murali Ramakrishnan and has been consistently profitable since FY2022.',
    uniqueAngle: 'South Indian Bank is one of the top 3 banks for Kerala NRI home loans alongside Federal Bank and SBI. SIB has dedicated NRI relationship offices in all 6 GCC countries (UAE, Saudi, Qatar, Bahrain, Oman, Kuwait) and accepts salary in GCC currencies with embassy-attested documentation. For Malayali expats buying property in Kochi, Thrissur, Kozhikode, Trivandrum, or Kannur, SIB is typically the fastest and most flexible mainstream lender.',
    productHighlights: [
      'SIB Home Loan: 8.7-9.85% with NRI eligibility',
      'SIB Pravasi Home Loan: NRI-specific with GCC relationship desk',
      'SIB Home-Sweet-Home Loan: women borrower special rate',
      'SIB Plot Loan: standalone plot purchase financing',
      'SIB Personal Loan: pre-approved digital approval',
    ],
    faqs: [
      {
        q: 'South Indian Bank for Kerala NRI home loans?',
        a: 'SIB is one of the top 3 lenders for Kerala NRI home loans, particularly for Gulf-based Malayalis. The bank has GCC representative offices in Dubai, Abu Dhabi, Doha, Riyadh, Kuwait City, Manama, and Muscat with local relationship managers handling KYC, salary verification, and property due diligence. For NRIs buying property in Kerala (Kochi, Thrissur, Kozhikode, Trivandrum), SIB processes loans in 7-10 days end-to-end without requiring travel to India.',
      },
      {
        q: 'SIB vs Federal Bank for Kerala home loan?',
        a: 'Federal Bank is bigger (1,500+ branches vs SIB\'s 950) and has slightly cheaper rates (typically 10-20 bps below SIB). SIB compensates with more flexible underwriting for self-employed Kerala business owners, faster turnaround in tier-2/3 Kerala towns, and longer-tenure NRI relationship managers. For salaried Gulf NRIs: Federal usually wins on rate; for self-employed or family-business Kerala buyers: SIB often wins on processing flexibility.',
      },
      {
        q: 'SIB stability after the 2020 leadership crisis?',
        a: 'In 2020, SIB faced internal governance issues including a board-CEO dispute that briefly disrupted operations. Under Murali Ramakrishnan (MD from October 2020) and current MD P.R. Seshadri (from October 2023), the bank has stabilized: provisioning increased, NPAs reduced from peak 6.97% in FY21 to under 4.5% in FY25, capital adequacy at 17.2%. The Kerala-based depositor and NRI base has remained loyal through the transition. DICGC ₹5 lakh insurance applies.',
      },
    ],
    metaKeywords: ['south indian bank emi calculator', 'sib home loan emi', 'south indian bank nri home loan', 'sib pravasi home loan'],
  },

  // ============ KARUR VYSYA ============
  {
    slug: 'karur-vysya',
    bankName: 'Karur Vysya Bank',
    fullName: 'Karur Vysya Bank Limited',
    emoji: '🟨',
    hqLocation: 'Karur, Tamil Nadu',
    homeLoanRate: { min: 8.85, max: 11.0, typical: 9.25 },
    personalLoanRate: { min: 11.0, max: 17.5, typical: 13.0 },
    carLoanRate: { min: 9.0, max: 12.0, typical: 9.5 },
    processingFee: '0.50% of loan amount (max ₹10,000 for home loans). Often waived for existing customers.',
    prepaymentPolicy: 'Zero on floating-rate retail home loans. 1-2% on fixed-rate.',
    marketContext: 'Karur Vysya Bank (KVB), headquartered in Karur, Tamil Nadu, is a 109-year-old mid-size private-sector bank (est. 1916) with about 825 branches concentrated heavily in Tamil Nadu, Andhra Pradesh, Telangana, and Karnataka. Total advances around ₹80,000 crore. KVB has strong SME and traditional retail banking relationships, particularly with Tamil Nadu textile, automotive components, and agri-trade communities. The home loan book is around ₹15,000 crore but growing at 22%/yr, among the fastest in mid-tier private banks.',
    uniqueAngle: 'KVB is the dominant lender for Tamil Nadu textile cluster (Tirupur, Erode, Karur, Coimbatore) and South Tamil Nadu business-family home loans. Multi-generational banking relationships with textile, jewelry, and agri-trade families mean KVB underwriters know self-employed income patterns better than national private banks. For self-employed Tamil Nadu and South Andhra Pradesh borrowers, KVB often approves loans that HDFC/ICICI reject for documentation reasons.',
    productHighlights: [
      'KVB Happy Home Loan: 8.85-9.85% repo-linked floating',
      'KVB Vyapar Plus: self-employed business owner home loans',
      'KVB Smart Home Loan: home loan + overdraft hybrid',
      'KVB NRI Home Loan with Tamil Nadu NRI desk',
      'KVB Plot Loan: standalone plot financing in TN/AP',
    ],
    faqs: [
      {
        q: 'KVB for Tamil Nadu textile family business home loans?',
        a: 'KVB is the natural first choice for Tirupur, Karur, Erode, and Coimbatore textile family home loans. The bank\'s underwriting accepts traditional textile-trade income documentation (bank statements + GST + textile-trade-association records) that national private banks often reject. Self-employed Tirupur garment exporters with 5+ years of KVB business banking relationships routinely get pre-approved home loan offers within their established credit limits, something HDFC/ICICI struggle to match for these income profiles.',
      },
      {
        q: 'KVB Smart Home Loan vs KVB Happy Home Loan?',
        a: 'Smart Home Loan is the overdraft-linked variant (like SBI MaxGain). Surplus deposits reduce daily interest calculation while remaining accessible. Happy Home Loan is the standard EMI-only product. Smart is priced at 10-15 bps premium over Happy but is meaningfully better for self-employed customers with lumpy income (textile season cycles, jewelry-trade Diwali bursts). For salaried customers with steady monthly EMIs: Happy Home Loan is simpler and cheaper.',
      },
      {
        q: 'KVB branch density in South India?',
        a: 'KVB has 825+ branches with heavy concentration in: Tamil Nadu (490+ branches, particularly textile/agri belts), Andhra Pradesh (130+, particularly Rayalaseema), Telangana (80+), Karnataka (50+). The branch network is engineered for the bank\'s legacy business banking relationships rather than uniform retail coverage, meaning KVB is dominant in specific clusters (Tirupur, Karur, Erode, Coimbatore, Tirunelveli, Tirupati, Vellore) but light in others (Chennai South, Bangalore tech corridors). Match your purchase location to KVB\'s strengths.',
      },
    ],
    metaKeywords: ['karur vysya bank emi calculator', 'kvb home loan emi', 'kvb personal loan calculator', 'kvb happy home loan'],
  },

  // ============ TMB ============
  {
    slug: 'tmb',
    bankName: 'Tamilnad Mercantile Bank',
    fullName: 'Tamilnad Mercantile Bank Limited',
    emoji: '🟪',
    hqLocation: 'Thoothukudi (Tuticorin), Tamil Nadu',
    homeLoanRate: { min: 8.85, max: 11.25, typical: 9.35 },
    personalLoanRate: { min: 12.0, max: 18.5, typical: 13.5 },
    carLoanRate: { min: 9.1, max: 12.25, typical: 9.65 },
    processingFee: '0.50% of loan amount (max ₹7,500 for home loans).',
    prepaymentPolicy: 'Zero on floating-rate retail home loans. 1% on fixed-rate.',
    marketContext: 'Tamilnad Mercantile Bank (TMB), headquartered in Thoothukudi (Tuticorin), is a Tamil Nadu-focused private-sector bank (est. 1921) with about 575 branches predominantly in Tamil Nadu (~75% of branches). Total advances around ₹40,000 crore. TMB completed its IPO in September 2022, after years of regulatory delays around shareholding compliance. The bank is heavily concentrated on Tamil Nadu Nadar trading community and South Tamil Nadu MSME/agri-trade lending, a niche that has generated above-average ROA.',
    uniqueAngle: 'TMB is one of the most profitable private-sector banks in India (ROA consistently 1.5%+) because of its deep community-banking relationships with the Tamil Nadu Nadar trading community. For South Tamil Nadu (Tirunelveli, Tuticorin, Nagercoil, Madurai) buyers, particularly self-employed traders and agri-business owners, TMB is the rate-competitive natural choice with multi-generational banking trust.',
    productHighlights: [
      'TMB Home Loan: 8.85-9.85% repo-linked floating rate',
      'TMB NRI Home Loan with Tamil Nadu Gulf desk',
      'TMB MSME-Linked Home Loan for business owners',
      'TMB Pre-Approved Home Loan for premium account holders',
      'TMB Plot Loan for standalone plot purchases',
    ],
    faqs: [
      {
        q: 'TMB for South Tamil Nadu (Tirunelveli, Tuticorin) home loans?',
        a: 'TMB is the dominant lender in South Tamil Nadu for community-banking relationships with the Nadar trading community and broader self-employed segment. The Tuticorin head office and Tirunelveli regional office handle the highest volume of self-employed home loans per branch in TMB\'s network. For traditional South Tamil Nadu business families with multi-generational TMB banking, the bank offers preferential pricing (typically 20-40 bps below card rates) plus fast turnaround (5-8 days vs 12-15 at national banks).',
      },
      {
        q: 'Is TMB safe after the 2022 IPO?',
        a: 'Yes. TMB completed its delayed IPO in September 2022 at ₹510/share, raising ₹808 crore. Post-IPO, the bank has full SEBI compliance for shareholding norms (the issue that delayed IPO for years was resolved during the issue process). TMB is consistently profitable (ROA 1.7%+ in FY25), capital adequacy 18.5%, gross NPA under 1.5%, among the best asset quality in Indian banks. DICGC ₹5 lakh deposit insurance applies as for any Indian bank.',
      },
      {
        q: 'TMB branch presence outside Tamil Nadu?',
        a: 'TMB has ~430 Tamil Nadu branches and ~145 branches outside Tamil Nadu (Karnataka, Kerala, Andhra Pradesh, Maharashtra, Delhi, Gujarat). The non-TN presence is primarily in cities with significant Nadar diaspora communities. TMB is meaningfully present in Bangalore, Hyderabad, Mumbai (BKC), Chennai outer suburbs, and Cochin, but for Karnataka/Andhra mainstream home loans, larger banks (Canara, SBI, HDFC) are typically better choices.',
      },
    ],
    metaKeywords: ['tmb emi calculator', 'tamilnad mercantile bank home loan', 'tmb tuticorin home loan', 'tmb personal loan'],
  },

  // ============ CITY UNION BANK ============
  {
    slug: 'city-union',
    bankName: 'City Union Bank',
    fullName: 'City Union Bank Limited',
    emoji: '🟫',
    hqLocation: 'Kumbakonam, Tamil Nadu',
    homeLoanRate: { min: 8.85, max: 11.0, typical: 9.2 },
    personalLoanRate: { min: 11.45, max: 17.5, typical: 13.0 },
    carLoanRate: { min: 9.0, max: 11.85, typical: 9.5 },
    processingFee: '0.50% of loan amount (max ₹7,500 for home loans).',
    prepaymentPolicy: 'Zero on floating-rate retail home loans.',
    marketContext: 'City Union Bank (CUB), headquartered in Kumbakonam, Tamil Nadu, is a 121-year-old private-sector bank (est. 1904) with about 800 branches concentrated heavily in Tamil Nadu (~70% of branches). Total advances around ₹50,000 crore. CUB is one of the most digitally-advanced mid-size banks in India, with a strong focus on MSME and self-employed lending. The bank operates with notably low cost-to-income ratio (~40%) and consistently high ROA (1.5%+).',
    uniqueAngle: 'CUB is the dominant Tamil Nadu private-sector bank for MSME and agri-trade self-employed home loans, particularly in tier-2 and tier-3 Tamil Nadu towns like Kumbakonam, Thanjavur, Karaikudi, Tiruvarur, and Mayiladuthurai where national banks have light coverage. For Tamil Brahmin and Chettiar trading-community customers with multi-generational CUB banking, the bank offers preferential pricing plus deep relationship-based underwriting.',
    productHighlights: [
      'CUB Home Loan: 8.85-9.85% repo-linked floating rate',
      'CUB MSME-Linked Home Loan for business owner customers',
      'CUB NRI Home Loan for Tamil NRI diaspora',
      'CUB Plot Loan: standalone plot purchase financing',
      'CUB Pre-Approved Home Loan: digital flow for existing customers',
    ],
    faqs: [
      {
        q: 'City Union Bank for tier-2 Tamil Nadu home loans?',
        a: 'CUB is the dominant lender for Kumbakonam, Thanjavur, Karaikudi, Tiruvarur, Mayiladuthurai, Tiruchi, and broader Cauvery Delta tier-2/3 Tamil Nadu home loans. The bank\'s branch density and local valuer networks in these towns mean processing in 5-8 days vs 12-20 at HDFC/ICICI (which often don\'t have branches in these towns). Combined with rate-competitive 8.85-9.20% pricing for prime salaried borrowers, CUB is the natural first choice in central Tamil Nadu.',
      },
      {
        q: 'CUB MSME-Linked Home Loan: how does it work?',
        a: 'CUB MSME-Linked Home Loan allows self-employed business owners with existing CUB business banking relationships (CC/OD limits, term loans) to leverage that history for home loan underwriting. Income verification uses 3 years of bank statements + business turnover + GST returns rather than the full ITR scrutiny that national private banks demand. Approval is typically within 7-10 days for business owners with established CUB current account history. This is one of CUB\'s most distinctive value propositions for South Tamil Nadu small business owners.',
      },
      {
        q: 'CUB digital banking: competitive with HDFC/ICICI?',
        a: 'Yes. CUB has been one of the most digitally-advanced mid-size banks in India, with strong UPI/mobile banking infrastructure and a well-rated mobile app. The CUB-DigiBank platform handles most retail banking online without branch visits. For salaried CUB customers, home loan pre-approval and document upload can be done end-to-end on the app, with only final property verification requiring branch visit. The digital maturity rivals private bank standards despite CUB\'s mid-tier size.',
      },
    ],
    metaKeywords: ['city union bank emi calculator', 'cub home loan emi', 'city union bank personal loan', 'cub msme home loan'],
  },

  // ============ UCO BANK ============
  {
    slug: 'uco',
    bankName: 'UCO Bank',
    fullName: 'UCO Bank',
    emoji: '🏛️',
    hqLocation: 'Kolkata, West Bengal',
    homeLoanRate: { min: 8.45, max: 10.45, typical: 8.7 },
    personalLoanRate: { min: 10.85, max: 16.6, typical: 12.5 },
    carLoanRate: { min: 8.8, max: 11.6, typical: 9.25 },
    processingFee: '0.50% of loan amount (max ₹10,000 for home loans).',
    prepaymentPolicy: 'Zero on floating-rate retail home loans. 1% on fixed-rate.',
    marketContext: 'UCO Bank (originally United Commercial Bank, est. 1943 by GD Birla), headquartered in Kolkata, is a mid-size PSU bank with about 3,200 branches across India and 4 overseas branches (Hong Kong, Singapore). Total advances around ₹2 lakh crore. UCO has historical strength in West Bengal, Bihar, Jharkhand, and Odisha, areas where competing private banks have lighter coverage. Exited RBI PCA framework in September 2021 after years of NPA stress and recapitalization.',
    uniqueAngle: 'UCO Bank is one of the leading lenders for Eastern India rural and tier-3 home loans, with deep branch networks in West Bengal, Bihar, Jharkhand, and Odisha. Combined with the competitive 2.85% repo-linked spread and PMAY-CLSS direct subsidy handling, UCO is often the most rate-competitive mainstream lender in Eastern India outside Kolkata metro.',
    productHighlights: [
      'UCO Home Loan: 8.45-9.45% repo-linked floating rate',
      'UCO Pravasi Bharatiya Home Loan: NRI-specific product',
      'UCO Smart Home Loan: home loan + overdraft hybrid',
      'UCO Two-Wheeler Loan competitively priced for rural East India',
      'PMAY-CLSS direct credit subsidy processing',
    ],
    faqs: [
      {
        q: 'UCO Bank for Bihar, Jharkhand, and rural West Bengal home loans?',
        a: 'UCO is one of the top PSU banks for tier-3 Eastern India (Patna, Ranchi, Bhubaneswar, Asansol, Darbhanga, Bhagalpur) home loans. The bank has 600+ branches in Bihar alone, often the only major bank with a meaningful local presence in tier-3 districts. Combined with competitive 8.45-8.7% rates and full PMAY-CLSS subsidy handling, UCO is the natural first choice for Eastern India affordable and mid-segment home buyers.',
      },
      {
        q: 'Is UCO Bank safe after exiting PCA in 2021?',
        a: 'Yes. UCO was under RBI PCA framework from 2017 to 2021 due to high NPAs. After government recapitalization (~₹3,000 crore total), provisioning, and bad-loan resolution, UCO exited PCA in September 2021. Since FY22, the bank has been consistently profitable. Capital adequacy is around 17%, gross NPA under 4%. DICGC ₹5 lakh deposit insurance applies as for any Indian bank.',
      },
      {
        q: 'UCO Bank Hong Kong/Singapore branches: for NRI banking?',
        a: 'UCO has full-fledged branches in Hong Kong and Singapore (legacy from its established Asia trade-finance position) that serve Indian-origin residents in those cities for NRE/NRO account opening, FCNR deposits, and home loan documentation. For Hong Kong and Singapore-based Indian professionals buying property back in India (particularly Eastern India), UCO offers door-to-door processing through the local branches, a rare service among Indian PSU banks abroad.',
      },
    ],
    metaKeywords: ['uco bank emi calculator', 'uco home loan emi', 'uco bank personal loan', 'uco pravasi home loan'],
  },

  // ============ CSB BANK ============
  {
    slug: 'csb',
    bankName: 'CSB Bank',
    fullName: 'CSB Bank Limited (formerly Catholic Syrian Bank)',
    emoji: '🟧',
    hqLocation: 'Thrissur, Kerala',
    homeLoanRate: { min: 8.85, max: 11.0, typical: 9.25 },
    personalLoanRate: { min: 11.5, max: 18.0, typical: 13.5 },
    carLoanRate: { min: 9.0, max: 12.0, typical: 9.65 },
    processingFee: '0.50% of loan amount (min ₹3,000, max ₹7,500 for home loans).',
    prepaymentPolicy: 'Zero on floating-rate retail home loans.',
    marketContext: 'CSB Bank (formerly Catholic Syrian Bank, rebranded 2019), headquartered in Thrissur, Kerala, is a 105-year-old private-sector bank (est. 1920) with about 800 branches concentrated in Kerala, Tamil Nadu, Karnataka, and Andhra Pradesh. Total advances around ₹35,000 crore. After the 2018 Fairfax Group acquisition of the controlling 51% stake (~₹1,200 crore), CSB has been undergoing significant strategic repositioning under MD CV Rajendran, focusing on gold loans (60%+ of book), retail SME, and Kerala-NRI banking.',
    uniqueAngle: 'CSB Bank is one of India\'s leading gold loan lenders. Gold loans make up over 60% of CSB\'s total advances. The bank serves the traditional Kerala Christian (Syrian Catholic) community and broader Kerala retail/SME segment with multi-generational banking relationships. For Kerala home loan buyers wanting to leverage gold-backed top-up facilities or with strong CSB gold loan history, the bank offers integrated home + gold loan packages.',
    productHighlights: [
      'CSB Home Loan: 8.85-9.85% repo-linked floating rate',
      'CSB Gold-Backed Home Loan Top-Up: leverage gold for additional financing',
      'CSB Pravasi Home Loan: NRI-specific with Kerala-Gulf desk',
      'CSB SME-Linked Home Loan: business owner home loans',
      'CSB Two-Wheeler Loan: competitive rural Kerala pricing',
    ],
    faqs: [
      {
        q: 'CSB Bank gold-backed top-up loan for home: how does it work?',
        a: 'CSB Bank uniquely allows existing gold loan customers to leverage their pledged gold for home loan top-up facilities. Structure: existing gold loan (typically ₹50K-₹50L) plus home loan principal plus optional top-up secured against the same gold pledge. The gold-backed portion is priced at 75-150 bps above standard home loan rate but is meaningfully easier to access than fresh unsecured top-ups. Useful for Kerala traditional families with multi-generational gold holdings looking to fund home upgrades or stamp duty.',
      },
      {
        q: 'CSB Bank vs Federal Bank for Kerala NRI home loan?',
        a: 'Federal Bank is the dominant Kerala-NRI bank with deeper GCC representative office network and larger NRI deposit base. CSB is competitive specifically for: (1) Syrian Christian Kerala community with multi-generational CSB banking, (2) Kerala gold-loan customers leveraging existing relationships for home loan top-ups, (3) borrowers wanting integrated gold + home loan packages. For mass-market Kerala NRI home loans, Federal usually wins; for community-banking and gold-loan-linked customers, CSB is the natural choice.',
      },
      {
        q: 'Is CSB Bank safe after the Fairfax Group acquisition?',
        a: 'Yes. Fairfax Financial Holdings (Prem Watsa-led Canadian conglomerate) acquired the controlling 51% stake in CSB in 2018 for ~₹1,200 crore, one of the largest private-sector bank investments by a foreign strategic buyer in India. Under Fairfax stewardship and MD CV Rajendran, CSB has reduced NPAs from peak 7.9% to under 4%, doubled the gold loan book, and returned to consistent profitability. Capital adequacy is around 22% (well above PCA thresholds). DICGC ₹5 lakh insurance applies.',
      },
    ],
    metaKeywords: ['csb bank emi calculator', 'csb home loan emi', 'csb gold loan top up', 'catholic syrian bank emi'],
  },

  // ============ DHANLAXMI BANK ============
  {
    slug: 'dhanlaxmi',
    bankName: 'Dhanlaxmi Bank',
    fullName: 'Dhanlaxmi Bank Limited',
    emoji: '🟥',
    hqLocation: 'Thrissur, Kerala',
    homeLoanRate: { min: 9.0, max: 11.25, typical: 9.5 },
    personalLoanRate: { min: 11.5, max: 18.5, typical: 13.5 },
    carLoanRate: { min: 9.25, max: 12.0, typical: 9.85 },
    processingFee: '0.50% of loan amount (max ₹7,500 for home loans).',
    prepaymentPolicy: 'Zero on floating-rate retail home loans.',
    marketContext: 'Dhanlaxmi Bank, headquartered in Thrissur, Kerala, is a 99-year-old private-sector bank (est. 1927), among India\'s smallest scheduled commercial banks with about 250 branches predominantly in Kerala. Total advances around ₹10,000 crore. The bank has had a turbulent history including a 2009-2012 expansion-driven loss period, regulatory restrictions imposed by RBI in 2012-2018, and gradual recovery under successive management changes. As of 2026, Dhanlaxmi operates with stable financials and is no longer under any RBI restrictions.',
    uniqueAngle: 'Dhanlaxmi serves a niche Kerala community-banking segment (particularly Thrissur and Ernakulam) with multi-generational customer relationships. For Kerala salaried and self-employed customers in the Thrissur-Ernakulam corridor who value community-banking trust over private-sector scale, Dhanlaxmi offers rate-competitive products and personalized branch service that larger banks like HDFC/ICICI/Federal Bank struggle to match in tier-3 Kerala towns.',
    productHighlights: [
      'Dhanlaxmi Home Loan: 9.0-9.85% repo-linked floating rate',
      'Dhanlaxmi NRI Home Loan: Kerala-Gulf corridor focus',
      'Dhanlaxmi Two-Wheeler Loan: small-ticket retail Kerala focus',
      'Dhanlaxmi Pre-Approved Personal Loan: existing customer offers',
      'Dhanlaxmi Gold Loan: integrated with home loan top-ups',
    ],
    faqs: [
      {
        q: 'Is Dhanlaxmi Bank safe given its history?',
        a: 'Yes, with appropriate context. Dhanlaxmi had significant financial stress during 2009-2012 due to over-aggressive expansion under former leadership, leading to RBI-imposed restrictions on branch expansion and lending. These restrictions were progressively lifted through 2018. Since the 2019 management change and capital raise, Dhanlaxmi has been consistently profitable. Capital adequacy is around 15%, gross NPA under 5%. As a scheduled commercial bank with DICGC ₹5 lakh deposit insurance, depositors are protected on the standard basis.',
      },
      {
        q: 'Dhanlaxmi Bank for Thrissur or Ernakulam home loan?',
        a: 'For Kerala community-banking customers in Thrissur-Ernakulam corridor with multi-generational Dhanlaxmi relationships: yes, the bank offers competitive rates, fast local processing (5-8 days), and personalized service. For mainstream Kerala salaried home loan applications without existing Dhanlaxmi banking: Federal Bank, SBI, or Canara are usually faster and more rate-competitive due to deeper branch networks and processing infrastructure.',
      },
      {
        q: 'Dhanlaxmi NRI home loan: competitive vs Federal Bank?',
        a: 'Federal Bank is the dominant Kerala-NRI lender with comprehensive Gulf representative office network. Dhanlaxmi has more limited NRI infrastructure (no formal Gulf representative offices) and processes NRI applications via Kerala branches only. For Kerala-Gulf NRI buyers needing Gulf-side documentation handling: Federal Bank wins. For NRI buyers willing to travel back to Kerala for documentation, Dhanlaxmi can be competitive on rate and processing flexibility for community-banking customers.',
      },
    ],
    metaKeywords: ['dhanlaxmi bank emi calculator', 'dhanlaxmi home loan emi', 'dhanlaxmi bank personal loan', 'dhanlaxmi nri home loan'],
  },

  // ============ KARNATAKA BANK ============
  {
    slug: 'karnataka-bank',
    bankName: 'Karnataka Bank',
    fullName: 'The Karnataka Bank Limited',
    emoji: '🟨',
    hqLocation: 'Mangaluru (Mangalore), Karnataka',
    homeLoanRate: { min: 8.75, max: 11.0, typical: 9.15 },
    personalLoanRate: { min: 11.25, max: 17.5, typical: 13.0 },
    carLoanRate: { min: 8.95, max: 11.85, typical: 9.5 },
    processingFee: '0.50% of loan amount (max ₹7,500 for home loans).',
    prepaymentPolicy: 'Zero on floating-rate retail home loans. 1% on fixed-rate.',
    marketContext: 'Karnataka Bank, headquartered in Mangaluru (Mangalore), is a 101-year-old private-sector bank (est. 1924) with about 925 branches concentrated in Karnataka, Andhra Pradesh, Telangana, Tamil Nadu, and Maharashtra. Total advances around ₹65,000 crore. The bank has strong roots in the coastal Karnataka Gowda Saraswat Brahmin (GSB) and Konkani community, with multi-generational banking relationships. Karnataka Bank is consistently among the most profitable mid-tier private banks (ROA 1.0%+).',
    uniqueAngle: 'Karnataka Bank dominates coastal Karnataka (Mangaluru, Udupi, Kasaragod border, Karkala, Kundapura) home loans. The bank\'s relationships with the GSB and Konkani trading communities, many with Gulf-NRI family members, make it the natural first choice for these segments. Combined with Karnataka\'s 5% stamp duty (3% for women) and Karnataka Bank\'s competitive 2.85% repo-linked spread, the all-in cost for coastal Karnataka women buyers is among the cheapest in Karnataka.',
    productHighlights: [
      'KBL Home Loan: 8.75-9.75% repo-linked floating rate',
      'KBL Apna Ghar: special women-borrower discount tier',
      'KBL NRI Home Loan: GSB/Konkani Gulf NRI corridor focus',
      'KBL Easy Ride: digital two-wheeler loan',
      'KBL Plot Loan: standalone plot financing in coastal Karnataka',
    ],
    faqs: [
      {
        q: 'Karnataka Bank for coastal Karnataka (Mangaluru, Udupi) home loans?',
        a: 'Karnataka Bank is the dominant private-sector lender for Mangaluru, Udupi, Kasaragod, Karkala, Kundapura, and the broader coastal Karnataka belt. The bank\'s 200+ coastal Karnataka branches and deep relationships with GSB/Konkani trading communities mean preferential pricing, faster processing, and easier underwriting for traditional self-employed business families. For coastal Karnataka buyers with multi-generational Karnataka Bank relationships, it\'s typically the natural first choice, competitive with Canara Bank on rate and often faster on processing fee waivers.',
      },
      {
        q: 'KBL Apna Ghar women borrower scheme?',
        a: 'KBL Apna Ghar offers women primary borrowers 5 bps rate concession plus reduced processing fees on home loans. Stacked with Karnataka\'s 3% women stamp duty (vs 5% for men), the combined effect on a ₹78 lakh average Bengaluru/Mangaluru purchase: ~₹1.56 lakh stamp duty saving plus ~₹60K interest saving over 20 years = ~₹2.2 lakh total advantage. Particularly meaningful for first-time women buyers in coastal Karnataka where Karnataka Bank dominates.',
      },
      {
        q: 'Karnataka Bank vs Canara for Bengaluru home loan?',
        a: 'Canara is Karnataka\'s home-state PSU with 1,850 branches and the most aggressive repo-linked spread (8.4-8.55% typical). Karnataka Bank is private-sector with 925 branches and 8.75-9.15% typical pricing, meaningfully more expensive than Canara for mainstream Bengaluru salaried purchases. Karnataka Bank wins specifically for: (1) coastal Karnataka community banking, (2) GSB/Konkani community relationships, (3) self-employed customers with flexible underwriting needs. For mass-market Bengaluru tech professionals: Canara, HDFC, or ICICI are better picks than Karnataka Bank.',
      },
    ],
    metaKeywords: ['karnataka bank emi calculator', 'kbl home loan emi', 'karnataka bank personal loan', 'kbl apna ghar'],
  },

  // ============ DCB BANK ============
  {
    slug: 'dcb',
    bankName: 'DCB Bank',
    fullName: 'DCB Bank Limited (Development Credit Bank)',
    emoji: '🟦',
    hqLocation: 'Mumbai, Maharashtra',
    homeLoanRate: { min: 8.95, max: 11.5, typical: 9.5 },
    personalLoanRate: { min: 11.5, max: 18.5, typical: 13.5 },
    carLoanRate: { min: 9.25, max: 13.0, typical: 9.85 },
    processingFee: '0.50-1% of loan amount (max ₹15,000 for home loans). Personal loans 1-2.5%.',
    prepaymentPolicy: 'Zero on floating-rate retail home loans post-12 EMIs.',
    marketContext: 'DCB Bank (formerly Development Credit Bank), headquartered in Mumbai, is a mid-size private-sector bank with about 450 branches concentrated in Maharashtra, Gujarat, Andhra Pradesh, Telangana, and Karnataka. Total advances around ₹45,000 crore. DCB has a unique focus on tier-2/3 city retail lending. Over 60% of branches are in tier-2/3 cities, an unusually high concentration for a private bank. Aga Khan Fund for Economic Development (AKFED) is the anchor shareholder with ~14.5% holding.',
    uniqueAngle: 'DCB Bank is unusually focused on tier-2/3 city retail lending for a private bank, with a branch network deliberately built away from Mumbai-Delhi-Bangalore metro saturation. For tier-2/3 city buyers in Maharashtra (Aurangabad, Nashik, Solapur, Kolhapur), Gujarat (Rajkot, Vadodara outer), and Andhra Pradesh (Vijayawada, Tirupati), DCB offers more relationship-based underwriting than HDFC/ICICI without the slower processing of PSU banks.',
    productHighlights: [
      'DCB Home Loan: 8.95-10.0% repo-linked floating rate',
      'DCB Aspire Home Loan: under-35 first-time buyer product',
      'DCB Express Home Loan: digital-first for pre-approved customers',
      'DCB MSME-Linked Home Loan: business owner home loans',
      'DCB NRI Home Loan: tier-2/3 city property focus',
    ],
    faqs: [
      {
        q: 'DCB Bank for tier-2 Maharashtra home loans (Aurangabad, Nashik, Solapur)?',
        a: 'DCB has deliberately built its branch network in tier-2/3 cities: 60%+ of branches outside Mumbai-Delhi-Bangalore metros. For Aurangabad, Nashik, Solapur, Kolhapur, Sangli, and broader tier-2 Maharashtra home loan buyers, DCB offers private-sector underwriting speed (7-10 days) at rates competitive with HDFC/ICICI tier-2 pricing. For self-employed business owners in tier-2 Maharashtra with existing DCB business banking, the bank often provides faster and more flexible approvals than HDFC/ICICI for these income profiles.',
      },
      {
        q: 'DCB Aspire: for first-time buyers under 35?',
        a: 'DCB Aspire is the bank\'s product targeted at under-35 first-time salaried buyers. Eligibility: age 21-35, salaried employment for 2+ years, primary residence purchase. The product offers slightly higher LTV (up to 85% vs standard 80%) and accepts shorter income documentation (2-year ITR + 6-month bank statements vs 3-year ITR standard). Rate is at the same tier as standard DCB Home Loan but processing is fast-tracked (5-7 days) for the target segment.',
      },
      {
        q: 'Is DCB Bank safe? It\'s a smaller private bank.',
        a: 'Yes. DCB has been a profitable scheduled commercial bank consistently since 2011 (after a 2008-2010 stress period). Capital adequacy is around 16%, gross NPA under 4%. AKFED (Aga Khan Fund for Economic Development) anchor shareholding provides governance stability. As a SEBI-listed bank with DICGC ₹5 lakh deposit insurance, depositors get standard protection. Bank size (₹45K crore advances) is small vs HDFC/ICICI/Axis but DCB is consistently profitable and well-capitalized.',
      },
    ],
    metaKeywords: ['dcb bank emi calculator', 'dcb home loan emi', 'dcb bank personal loan', 'dcb aspire home loan'],
  },

  // ============ AU SMALL FINANCE BANK ============
  {
    slug: 'au-sfb',
    bankName: 'AU Small Finance Bank',
    fullName: 'AU Small Finance Bank Limited',
    emoji: '🟧',
    hqLocation: 'Jaipur, Rajasthan',
    homeLoanRate: { min: 9.25, max: 12.0, typical: 9.85 },
    personalLoanRate: { min: 11.99, max: 24.0, typical: 14.5 },
    carLoanRate: { min: 9.5, max: 13.5, typical: 10.5 },
    processingFee: '1-2% of loan amount (min ₹5,000) for home loans. Personal loans 1.5-2.5%.',
    prepaymentPolicy: 'Zero on floating-rate retail home loans post-12 EMIs. Variable on fixed-rate.',
    marketContext: 'AU Small Finance Bank (originally AU Financiers, an NBFC since 1996) became a Small Finance Bank in 2017 under RBI\'s SFB licensing framework. Headquartered in Jaipur, AU is the largest SFB in India with about 2,400 banking touchpoints and total advances around ₹95,000 crore. The 2024 merger with Fincare SFB expanded AU\'s footprint into South India significantly. AU has historically focused on commercial vehicle finance, MSME, and increasingly retail lending including home loans.',
    uniqueAngle: 'AU SFB is the largest and most-trusted Small Finance Bank in India, with particularly strong presence in Rajasthan, Madhya Pradesh, Gujarat, and (post-Fincare merger) Karnataka and Andhra Pradesh. For tier-2/3 city customers in these regions, particularly self-employed and MSME-linked borrowers, AU offers more flexible underwriting than commercial private banks (HDFC/ICICI/Axis) with rates competitive vs PSU banks for the segment.',
    productHighlights: [
      'AU SFB Home Loan: 9.25-10.5% for salaried customers',
      'AU MSME-Backed Home Loan: business owner home financing',
      'AU Affordable Home Loan: PMAY-CLSS focused product',
      'AU Two-Wheeler Loan: legacy strength from AU Financiers heritage',
      'AU Commercial Vehicle Loan: historic AU strength, market leader in segment',
    ],
    faqs: [
      {
        q: 'AU Small Finance Bank: is it as safe as commercial banks?',
        a: 'Yes. AU SFB is RBI-licensed scheduled commercial bank with full BR Act protections. The Small Finance Bank category was created by RBI in 2014 with specific regulatory requirements (75% PSL lending, max 50% loans over ₹25 lakh, etc.) but otherwise operates under standard banking norms. AU is the largest SFB by far, listed on BSE/NSE, with capital adequacy around 23% (vs RBI requirement of 11.5%). DICGC ₹5 lakh deposit insurance applies as for any Indian bank.',
      },
      {
        q: 'AU SFB after the Fincare merger: what changed?',
        a: 'The April 2024 merger of Fincare SFB with AU SFB created India\'s largest Small Finance Bank by branches (~2,400 touchpoints) and total advances (~₹95,000 crore). Fincare brought strong South Indian presence (Karnataka, Andhra Pradesh, Tamil Nadu) complementing AU\'s North/West dominance. Combined entity has more diversified loan book, better geographic risk distribution, and stronger competitive position vs DCB/RBL/Federal in mid-tier private bank space.',
      },
      {
        q: 'AU SFB vs DCB for tier-2 home loan: who is better?',
        a: 'Both target tier-2/3 retail home lending. AU is larger (~2,400 touchpoints vs DCB\'s 450), has stronger commercial vehicle / MSME legacy, and post-Fincare merger has wider geographic reach. DCB is more focused on tier-2/3 Maharashtra/Gujarat/Andhra. For Rajasthan, Madhya Pradesh, Karnataka, or Andhra Pradesh tier-2/3 home loans: AU usually wins on branch convenience. For Maharashtra/Gujarat tier-2/3: DCB and AU are comparable. Rates are similar (within 25 bps); processing speed depends on local branch quality at both.',
      },
    ],
    metaKeywords: ['au sfb emi calculator', 'au small finance bank home loan', 'au bank emi calculator', 'au sfb personal loan'],
  },

  // ============ EQUITAS SFB ============
  {
    slug: 'equitas-sfb',
    bankName: 'Equitas Small Finance Bank',
    fullName: 'Equitas Small Finance Bank Limited',
    emoji: '🟦',
    hqLocation: 'Chennai, Tamil Nadu',
    homeLoanRate: { min: 9.35, max: 12.25, typical: 10.0 },
    personalLoanRate: { min: 12.5, max: 23.0, typical: 14.85 },
    carLoanRate: { min: 9.65, max: 13.85, typical: 10.5 },
    processingFee: '1-2% of loan amount (min ₹5,000) for home loans.',
    prepaymentPolicy: 'Zero on floating-rate retail home loans post-12 EMIs.',
    marketContext: 'Equitas Small Finance Bank started as a microfinance company in Chennai (2007) and became an SFB in 2016. Headquartered in Chennai with about 950 banking touchpoints, Equitas is the second-largest SFB after AU. Total advances around ₹35,000 crore. The bank has strong presence in Tamil Nadu, Karnataka, Maharashtra, and Madhya Pradesh, with the majority of branches in tier-2/3 cities. Equitas merged its holding company structure in 2023 to become a single listed banking entity.',
    uniqueAngle: 'Equitas SFB is the dominant SFB in Tamil Nadu, with ~40% of branches concentrated in Tamil Nadu and adjacent Karnataka/Andhra/Telangana. For Tamil Nadu and Southern India tier-2/3 home loan buyers, particularly self-employed customers, gig workers, and MSME-linked households, Equitas offers more flexible underwriting than commercial private banks with rates competitive vs PSU banks for affordable housing.',
    productHighlights: [
      'Equitas Home Loan: 9.35-10.85% with PMAY-CLSS direct credit',
      'Equitas Used Car Loan: refinance and used-car financing specialty',
      'Equitas Two-Wheeler Loan: tier-2/3 retail focus',
      'Equitas MSME Loan with linked home loan top-ups',
      'Equitas Pre-Approved Personal Loan for existing customers',
    ],
    faqs: [
      {
        q: 'Equitas SFB for Chennai or tier-2 Tamil Nadu home loan?',
        a: 'Equitas is the natural first stop for tier-2 Tamil Nadu home loan buyers (Madurai, Tiruchirappalli, Coimbatore, Salem, Tirupur, Erode). The bank\'s 950+ branches with heavy Tamil Nadu concentration give it deeper local presence than HDFC/ICICI in tier-3 Tamil Nadu. Combined with flexible self-employed underwriting and PMAY-CLSS handling, Equitas often beats commercial private banks on combined experience for sub-₹40 lakh tier-2/3 TN purchases.',
      },
      {
        q: 'Is Equitas SFB safe? It started as microfinance.',
        a: 'Yes. Equitas SFB is RBI-licensed scheduled commercial bank since 2016, with full BR Act protections. The microfinance origin is shared by Bandhan Bank, Ujjivan SFB, and several other Indian banks. Capital adequacy is around 22% (well above RBI requirement). Listed on BSE/NSE post-2023 merger. DICGC ₹5 lakh deposit insurance applies. Microfinance origins typically translate to strong tier-2/3 underwriting expertise and high-quality retail risk management.',
      },
      {
        q: 'Equitas vs Ujjivan SFB: who is better?',
        a: 'Both have similar MFI origins and target tier-2/3 retail lending. Equitas is Tamil Nadu-headquartered with deeper South India presence (~40% TN/AP/Karnataka branches). Ujjivan is Bengaluru-headquartered but has more nationally-distributed branch network. For Tamil Nadu and South India tier-2/3 home loans: Equitas usually has stronger local presence. For East India or pan-India needs: Ujjivan may be more practical. Rates and product structures are broadly similar between the two.',
      },
    ],
    metaKeywords: ['equitas sfb emi calculator', 'equitas home loan emi', 'equitas small finance bank loan', 'equitas personal loan'],
  },

  // ============ UJJIVAN SFB ============
  {
    slug: 'ujjivan-sfb',
    bankName: 'Ujjivan Small Finance Bank',
    fullName: 'Ujjivan Small Finance Bank Limited',
    emoji: '🟪',
    hqLocation: 'Bengaluru, Karnataka',
    homeLoanRate: { min: 9.5, max: 12.5, typical: 10.25 },
    personalLoanRate: { min: 13.0, max: 24.0, typical: 15.5 },
    carLoanRate: { min: 9.85, max: 14.0, typical: 10.75 },
    processingFee: '1-2.5% of loan amount (min ₹5,000) for home loans.',
    prepaymentPolicy: 'Zero on floating-rate retail home loans post-12 EMIs.',
    marketContext: 'Ujjivan Small Finance Bank started as Ujjivan Financial Services (a microfinance NBFC since 2004) and became an SFB in 2017. Headquartered in Bengaluru with about 750 banking touchpoints, Ujjivan operates pan-India with strong presence in Karnataka, West Bengal, Tamil Nadu, and Maharashtra. Total advances around ₹30,000 crore. Ujjivan merged its holding company structure in 2024 to become a single listed banking entity (similar to Equitas\' 2023 merger).',
    uniqueAngle: 'Ujjivan SFB is the most-nationally-distributed Small Finance Bank with branches in 24 states and union territories, broader geographic coverage than AU or Equitas. For tier-2/3 city retail home loans across diverse Indian geographies (especially Karnataka, West Bengal, Bihar, Jharkhand, Madhya Pradesh, Rajasthan), Ujjivan offers SFB-style flexible underwriting with reasonably standardized service.',
    productHighlights: [
      'Ujjivan Home Loan: 9.5-11.0% for salaried + self-employed',
      'Ujjivan Affordable Housing Loan: PMAY-CLSS focused product',
      'Ujjivan Business Loan with home loan top-ups',
      'Ujjivan Two-Wheeler Loan: rural and semi-urban focus',
      'Ujjivan Personal Loan: digital approval for existing customers',
    ],
    faqs: [
      {
        q: 'Ujjivan SFB for affordable housing: am I eligible?',
        a: 'Ujjivan\'s Affordable Housing Loan product is designed for first-time buyers in affordable housing segments, with strong PMAY-CLSS subsidy handling. Eligibility: salaried or self-employed with income proof (3-year ITR or 12-month bank statements), property under ₹50 lakh in approved residential project, primary residence. LTV up to 90% for affordable segment. The PMAY subsidy (₹2.30-2.67 lakh) is directly credited to loan principal post-NHB approval, typically within 3-4 months of disbursal.',
      },
      {
        q: 'Ujjivan branch network across India?',
        a: 'Ujjivan operates in 24 states and union territories with 750+ banking touchpoints. Key geographic concentrations: Karnataka (HQ state, ~120 branches), West Bengal (~90), Tamil Nadu (~80), Maharashtra (~70), Madhya Pradesh (~60), Bihar (~50). The wide geographic spread makes Ujjivan one of the most accessible SFBs for diverse Indian customer locations, particularly meaningful for buyers in states where SFB peers (AU concentrated in North/West, Equitas in South) have lighter coverage.',
      },
      {
        q: 'Ujjivan after the 2024 reverse merger: what changed?',
        a: 'In 2024, Ujjivan Financial Services (the holding company) merged with Ujjivan Small Finance Bank to create a single listed entity. This was the second SFB to complete this structural simplification (after Equitas in 2023) and was driven by RBI\'s preference for direct bank listings over holding-company-bank structures. Operationally, the merger created tax efficiencies and removed cross-holding complexity. For customers and depositors, nothing changed materially. DICGC ₹5 lakh insurance still applies to deposits.',
      },
    ],
    metaKeywords: ['ujjivan sfb emi calculator', 'ujjivan home loan emi', 'ujjivan small finance bank loan', 'ujjivan personal loan'],
  },

  // ============ ESAF SFB ============
  {
    slug: 'esaf-sfb',
    bankName: 'ESAF Small Finance Bank',
    fullName: 'ESAF Small Finance Bank Limited',
    emoji: '🟩',
    hqLocation: 'Thrissur, Kerala',
    homeLoanRate: { min: 9.45, max: 12.5, typical: 10.15 },
    personalLoanRate: { min: 12.5, max: 23.0, typical: 14.85 },
    carLoanRate: { min: 9.85, max: 13.5, typical: 10.65 },
    processingFee: '1-2% of loan amount (min ₹5,000) for home loans.',
    prepaymentPolicy: 'Zero on floating-rate retail home loans post-12 EMIs.',
    marketContext: 'ESAF Small Finance Bank started as Evangelical Social Action Forum (a Kerala-based microfinance NGO since 1992) and became an SFB in 2017. Headquartered in Thrissur, Kerala, making it the third bank HQ\'d in Thrissur alongside South Indian Bank, CSB Bank, and Dhanlaxmi Bank (the "Bank Capital of India"). ESAF has about 750 banking touchpoints, total advances around ₹20,000 crore. The bank listed on BSE/NSE in November 2023.',
    uniqueAngle: 'ESAF is the largest Kerala-headquartered SFB with deep community-banking roots in Kerala, Tamil Nadu, Karnataka, and broader South India. For Kerala tier-2/3 home loan buyers, particularly Syrian Christian community customers with multi-generational ESAF/legacy-NGO relationships, the bank offers community-banking trust plus standard SFB-style flexible underwriting. Strong PMAY-CLSS handling for Kerala affordable housing.',
    productHighlights: [
      'ESAF Home Loan: 9.45-10.85% with PMAY-CLSS direct credit',
      'ESAF MSME-Linked Home Loan for self-employed Kerala traders',
      'ESAF NRI Home Loan for Kerala-Gulf corridor',
      'ESAF Two-Wheeler Loan with rural Kerala focus',
      'ESAF Pre-Approved Personal Loan for existing customers',
    ],
    faqs: [
      {
        q: 'ESAF SFB for Kerala affordable housing?',
        a: 'ESAF is the largest Kerala-based SFB and has strong infrastructure for PMAY-CLSS affordable housing subsidy processing. For first-time buyers in Kerala earning under ₹18 lakh/year and purchasing primary residence under ₹50 lakh in approved projects: ESAF processes the ₹2.30-2.67 lakh PMAY subsidy directly with NHB and credits to loan principal in 3-4 months. Combined with competitive 9.45-10.0% rates, ESAF is well-positioned for Kerala affordable housing.',
      },
      {
        q: 'ESAF SFB vs South Indian Bank for Kerala home loan?',
        a: 'South Indian Bank is a larger, established commercial bank (~950 branches) with broader product range and deeper NRI infrastructure. ESAF is a Small Finance Bank with ~750 banking touchpoints, focused more on retail microfinance graduates and affordable housing segment. For mainstream Kerala salaried home loans above ₹50 lakh: SIB usually wins. For sub-₹50 lakh PMAY-eligible affordable housing: ESAF can be competitive with strong subsidy processing.',
      },
      {
        q: 'ESAF IPO November 2023: how did it go?',
        a: 'ESAF SFB listed on BSE/NSE on November 10, 2023 at issue price of ₹60/share, raising ₹463 crore. The IPO was oversubscribed and traded at modest premium initially. Post-listing, ESAF has faced general SFB-sector challenges including MFI book stress in 2024-2025, with quarterly NPA fluctuations. Capital adequacy remains adequate (around 19%). DICGC ₹5 lakh insurance applies as for any Indian bank.',
      },
    ],
    metaKeywords: ['esaf sfb emi calculator', 'esaf home loan emi', 'esaf small finance bank loan', 'esaf personal loan'],
  },

  // ============ JANA SFB ============
  {
    slug: 'jana-sfb',
    bankName: 'Jana Small Finance Bank',
    fullName: 'Jana Small Finance Bank Limited',
    emoji: '🟫',
    hqLocation: 'Bengaluru, Karnataka',
    homeLoanRate: { min: 9.5, max: 12.5, typical: 10.25 },
    personalLoanRate: { min: 12.5, max: 23.5, typical: 15.0 },
    carLoanRate: { min: 9.85, max: 13.85, typical: 10.85 },
    processingFee: '1-2% of loan amount (min ₹5,000) for home loans.',
    prepaymentPolicy: 'Zero on floating-rate retail home loans post-12 EMIs.',
    marketContext: 'Jana Small Finance Bank started as Janalakshmi Financial Services (a microfinance institution since 2008) and became an SFB in 2018. Headquartered in Bengaluru, Jana operates about 800 banking touchpoints concentrated in Karnataka, Tamil Nadu, Maharashtra, Andhra Pradesh, and Telangana. Total advances around ₹27,000 crore. Jana listed on BSE/NSE in February 2024.',
    uniqueAngle: 'Jana SFB has strong presence in South India tier-2/3 cities (Karnataka, Tamil Nadu, Andhra Pradesh, Telangana) with deep MFI heritage. For self-employed and gig-economy borrowers in South Indian tier-2/3 markets who have established Jana Group lending relationships, the bank offers integrated MFI-graduate-to-home-loan paths that are unique in the SFB segment.',
    productHighlights: [
      'Jana Home Loan: 9.5-11.0% for salaried + self-employed',
      'Jana Affordable Housing Loan: PMAY-CLSS focused product',
      'Jana MFI-Graduate Home Loan: transition path for legacy MFI borrowers',
      'Jana Two-Wheeler Loan: rural and semi-urban focus',
      'Jana Pre-Approved Personal Loan for existing customers',
    ],
    faqs: [
      {
        q: 'Jana SFB MFI-graduate home loan: what is it?',
        a: 'Jana SFB has the distinctive program of "graduating" successful microfinance customers to formal banking products. Customers with established Janalakshmi MFI repayment history (typically 3-5 years of clean group-loan track records) get streamlined access to formal home loans with simpler documentation and slightly preferential rates. This is a unique program among SFBs and reflects Jana\'s strong MFI heritage, the natural pipeline from microfinance to retail banking that the SFB framework was designed to enable.',
      },
      {
        q: 'Jana SFB IPO 2024: what\'s the outlook?',
        a: 'Jana SFB listed on BSE/NSE in February 2024 at ₹414/share, raising ₹570 crore. The bank has been profitable consistently since FY2023 after years of MFI-stress-driven losses. Capital adequacy is around 19%, gross NPA around 7% (highest among major SFBs, reflecting unsecured MFI legacy exposure). The 2024-2025 MFI sector stress affected Jana more than commercial-bank-style peers like AU. Post-listing performance has been mixed; investor focus is on book diversification trajectory and NPA normalization.',
      },
      {
        q: 'Jana SFB for South India MFI customer upgrade?',
        a: 'Yes, if you have established Janalakshmi or Jana MFI customer history (3+ years of clean repayment), Jana SFB\'s MFI-graduate-to-home-loan program is one of the smoothest paths from informal-credit to formal home ownership in India. Particularly relevant in Karnataka, Tamil Nadu, and Andhra Pradesh tier-2/3 markets where Jana\'s MFI legacy is deepest. For fresh applicants without Jana MFI history: Equitas, Ujjivan, or AU SFB may be more rate-competitive.',
      },
    ],
    metaKeywords: ['jana sfb emi calculator', 'jana home loan emi', 'jana small finance bank loan', 'jana personal loan'],
  },

  // ============ KARNATAKA BANK (already exists as `karnataka-bank`, skipping) — adding new entries below ============

  // ============ J&K BANK ============
  {
    slug: 'jk-bank',
    bankName: 'J&K Bank',
    fullName: 'Jammu & Kashmir Bank Limited',
    emoji: '🏔️',
    hqLocation: 'Srinagar, Jammu & Kashmir',
    homeLoanRate: { min: 8.55, max: 10.85, typical: 8.95 },
    personalLoanRate: { min: 10.65, max: 17.5, typical: 12.75 },
    carLoanRate: { min: 8.9, max: 11.85, typical: 9.45 },
    processingFee: '0.50% of loan amount (max ₹10,000 for home loans).',
    prepaymentPolicy: 'Zero on floating-rate retail home loans.',
    marketContext: 'Jammu & Kashmir Bank (J&K Bank), headquartered in Srinagar, is a unique private-sector bank that operates with the government of Jammu & Kashmir as a major shareholder (~59%). Established in 1938, J&K Bank operates about 1,000 branches with overwhelming concentration in J&K UT and Ladakh, plus presence across India in cities with significant Kashmiri diaspora populations (Delhi, Mumbai, Bangalore). Total advances around ₹85,000 crore. J&K Bank has unique cross-border banking arrangements supporting Kashmiri trade with PoK.',
    uniqueAngle: 'J&K Bank is the dominant home loan lender in Jammu & Kashmir UT and Ladakh. For residents of Srinagar, Jammu, Leh, Kargil, and broader J&K, J&K Bank is the natural first choice with multi-generational customer relationships, deep local underwriting expertise, and access to J&K state-specific subsidy programs. Outside J&K, the bank serves the Kashmiri diaspora particularly in Delhi, Mumbai, and Bangalore.',
    productHighlights: [
      'JKB Home Loan: 8.55-9.55% repo-linked floating rate',
      'JKB Apna Ghar: special women borrower discount tier',
      'JKB NRI Home Loan for Kashmiri diaspora abroad',
      'JKB Two-Wheeler Loan: Kashmir rural and tier-3 focus',
      'JKB Plot Loan: standalone plot financing in J&K',
    ],
    faqs: [
      {
        q: 'J&K Bank for Kashmir Valley / Jammu / Ladakh home loan?',
        a: 'Yes. J&K Bank is the dominant lender across J&K UT and Ladakh, with 800+ J&K branches plus full presence in Leh and Kargil. For Kashmiri buyers in Srinagar, Anantnag, Baramulla, Sopore, plus Jammu/Udhampur/Kathua/Samba and Ladakh: J&K Bank offers unmatched local underwriting expertise plus access to J&K-state-specific subsidy programs (Mission Youth, Tribal Sub-Plan, etc.). For mainland Indian home loans by J&K residents: J&K Bank has 100+ branches in Delhi, Mumbai, and Bangalore serving the diaspora.',
      },
      {
        q: 'J&K Bank ownership: is it private or government?',
        a: 'J&K Bank is technically a private-sector scheduled commercial bank but with the Government of Jammu & Kashmir as the majority shareholder (~59%). This unique hybrid structure dates to the bank\'s 1938 establishment under the Maharaja of Jammu and Kashmir government. Despite J&K UT government ownership, the bank operates with full commercial banking flexibility under RBI regulation. Capital adequacy around 13%, gross NPA under 5% as of FY25. DICGC ₹5 lakh insurance applies.',
      },
      {
        q: 'J&K Bank Delhi/Mumbai diaspora home loan?',
        a: 'J&K Bank has 100+ branches outside J&K UT, concentrated in Delhi (60+), Mumbai (25+), Bangalore (15+), and other Indian cities with significant Kashmiri diaspora populations. For Kashmiri-origin professionals in these cities buying property in Delhi/Mumbai/Bangalore: J&K Bank offers community-banking trust plus standard 8.55-9.55% rates. For non-Kashmiri origin buyers in these cities: HDFC/ICICI/SBI typically offer more competitive pre-approval pipelines.',
      },
    ],
    metaKeywords: ['j&k bank emi calculator', 'jk bank home loan emi', 'kashmir bank home loan', 'jk bank personal loan'],
  },

  // ============ TAMILNAD MERCANTILE COOPERATIVE — Karur ============
  {
    slug: 'lakshmi-vilas',
    bankName: 'Lakshmi Vilas (DBS legacy)',
    fullName: 'DBS Bank India (Legacy Lakshmi Vilas Bank)',
    emoji: '🟦',
    hqLocation: 'Mumbai, Maharashtra (Karur legacy)',
    homeLoanRate: { min: 8.85, max: 11.0, typical: 9.25 },
    personalLoanRate: { min: 11.0, max: 17.5, typical: 13.0 },
    carLoanRate: { min: 9.05, max: 11.85, typical: 9.65 },
    processingFee: '0.50-1% of loan amount (min ₹5,000) for home loans.',
    prepaymentPolicy: 'Zero on floating-rate retail home loans.',
    marketContext: 'DBS Bank India (formerly Lakshmi Vilas Bank, merged with DBS in November 2020 under RBI direction) is Singapore-headquartered DBS Group\'s Indian subsidiary. The 2020 merger followed Lakshmi Vilas Bank\'s severe asset-quality stress and was India\'s first amalgamation of a private-sector bank with a foreign bank\'s Indian subsidiary. DBS India operates about 580 branches with strong Tamil Nadu, Karnataka, Andhra Pradesh presence (legacy LVB) plus DBS\'s metropolitan presence in Delhi, Mumbai, Bangalore.',
    uniqueAngle: 'DBS India offers a unique hybrid of: (1) legacy Lakshmi Vilas Bank\'s deep Tamil Nadu and South India tier-2/3 community banking presence, (2) DBS Group\'s digital-first banking technology and Singapore-banking-standards customer experience. For Tamil Nadu and South Indian buyers preferring digital-native banking experience with mid-tier private bank rates, DBS India offers a distinctive value proposition between national private banks (HDFC/ICICI) and regional private banks (KVB, TMB, CUB).',
    productHighlights: [
      'DBS Home Loan: 8.85-10.0% with digital-first application',
      'DBS NRI Home Loan: Singapore corridor focus',
      'DBS Personal Loan: pre-approved digital flow',
      'DBS Treasures (HNI tier): negotiated home loan rates for ₹1cr+ AUM',
      'DBS Plot Loan: standalone plot financing in TN/AP/Karnataka',
    ],
    faqs: [
      {
        q: 'DBS India after Lakshmi Vilas Bank merger: what changed?',
        a: 'In November 2020, RBI directed DBS Bank India to acquire Lakshmi Vilas Bank (LVB) after LVB\'s severe asset-quality stress (gross NPA >25%) made it unviable as a standalone entity. The merger was India\'s first scheme of amalgamation involving a foreign bank\'s Indian subsidiary acquiring a domestic private-sector bank. Post-merger: LVB depositors became DBS India customers seamlessly with no impact, branches kept operating, and DBS invested ~₹2,500 crore in additional capital. DBS India operates as a fully-licensed scheduled commercial bank with DICGC ₹5 lakh insurance.',
      },
      {
        q: 'DBS Bank India for Tamil Nadu / South India home loan?',
        a: 'DBS Bank India\'s legacy Lakshmi Vilas branch network gives it deep South Indian presence, particularly Tamil Nadu (200+ branches), Karnataka, and Andhra Pradesh. For Tamil Nadu mainstream salaried home loans: DBS offers competitive rates (8.85-9.85% range), strong digital application flow (Singapore-banking-standard), and processing in 7-10 days. Rate is typically 25-40 bps above PSU lenders (Indian Bank) but DBS offers superior customer experience for digital-native customers.',
      },
      {
        q: 'DBS Treasures HNI banking: home loan benefits?',
        a: 'DBS Treasures is DBS India\'s HNI banking tier (₹25 lakh+ AUM eligibility, ₹1 crore+ for Treasures Private). Treasures customers get: (1) negotiated home loan rates typically 25-40 bps below standard, (2) dedicated relationship manager handling property due-diligence, (3) Singapore-side banking integration for Indian-origin Singapore residents. For Singapore-NRI Indian customers buying Indian property: DBS India\'s SGD-INR corridor handling is best-in-class.',
      },
    ],
    metaKeywords: ['dbs bank india emi calculator', 'dbs home loan emi', 'lakshmi vilas bank legacy', 'dbs treasures home loan'],
  },

  // ============ NORTH EAST SFB ============
  {
    slug: 'north-east-sfb',
    bankName: 'North East Small Finance Bank',
    fullName: 'North East Small Finance Bank Limited',
    emoji: '🌲',
    hqLocation: 'Guwahati, Assam',
    homeLoanRate: { min: 9.5, max: 12.5, typical: 10.25 },
    personalLoanRate: { min: 12.5, max: 22.0, typical: 14.85 },
    carLoanRate: { min: 9.85, max: 13.85, typical: 10.85 },
    processingFee: '1-2% of loan amount (min ₹5,000) for home loans.',
    prepaymentPolicy: 'Zero on floating-rate retail home loans post-12 EMIs.',
    marketContext: 'North East Small Finance Bank (NESFB), headquartered in Guwahati, Assam, started as RGVN North East Microfinance Limited (a microfinance NBFC since 2008) and became an SFB in 2017. NESFB is the only Small Finance Bank with Northeast-India-focused operations, with about 230 banking touchpoints concentrated in Assam, Arunachal Pradesh, Manipur, Meghalaya, Mizoram, Nagaland, Sikkim, and Tripura. Total advances around ₹6,000 crore. The bank serves a uniquely underbanked geography with limited commercial bank presence.',
    uniqueAngle: 'NESFB is the only SFB dedicated to Northeast India, a region historically underserved by commercial banks due to geographic and political-economy challenges. For Assamese, Khasi, Mizo, Naga, and other Northeast community customers, NESFB offers community-banking trust plus regulated formal banking access. The bank has been the primary financial inclusion vehicle for Northeast India\'s tribal and rural populations.',
    productHighlights: [
      'NESFB Home Loan: 9.5-11.0% for Northeast salaried + self-employed',
      'NESFB Affordable Housing Loan: PMAY-CLSS focused with Northeast outreach',
      'NESFB MFI-Graduate Home Loan: legacy MFI customer pathway',
      'NESFB Two-Wheeler Loan: dominant in Northeast rural markets',
      'NESFB Personal Loan: established for tea-garden worker segments',
    ],
    faqs: [
      {
        q: 'North East SFB for Assam / Manipur / Nagaland home loan?',
        a: 'Yes. NESFB is the only Small Finance Bank dedicated to Northeast India operations, with 230+ branches across Assam (~120), Arunachal Pradesh, Manipur, Meghalaya, Mizoram, Nagaland, Sikkim, and Tripura. For Northeast residents in Guwahati, Imphal, Shillong, Aizawl, Itanagar, Kohima: NESFB offers regulated home loan products with rates competitive vs national SFBs (~9.5-11% range) plus deeper local underwriting expertise for the underbanked Northeast segment. PMAY-CLSS subsidy handling is well-established.',
      },
      {
        q: 'NESFB for tea-garden / plantation worker segments?',
        a: 'NESFB\'s microfinance heritage (legacy RGVN North East Microfinance) gives it deep relationships with tea-garden worker communities and broader rural Assamese/Northeast populations. For tea-garden worker households with established NESFB MFI customer history (typically 3+ years of clean group-loan repayment), the bank\'s MFI-graduate home loan pathway provides streamlined access to formal home financing, useful for Northeast tier-3 and rural buyers historically excluded from commercial bank lending.',
      },
      {
        q: 'Is North East SFB safe? It\'s small and regional.',
        a: 'NESFB is RBI-licensed scheduled commercial bank since 2017 with full BR Act protections. Total advances around ₹6,000 crore (small but stable). Capital adequacy around 22% (well above RBI requirement). The bank has been consistently profitable since FY2023. As an SFB, NESFB operates under specific regulatory requirements (75% PSL lending, max 50% loans over ₹25 lakh) tailored to the underbanked Northeast segment. DICGC ₹5 lakh deposit insurance applies as for any Indian bank.',
      },
    ],
    metaKeywords: ['north east sfb emi calculator', 'nesfb home loan', 'assam home loan emi', 'northeast bank home loan'],
  },

  // ============ SURYODAY SFB ============
  {
    slug: 'suryoday-sfb',
    bankName: 'Suryoday Small Finance Bank',
    fullName: 'Suryoday Small Finance Bank Limited',
    emoji: '🌅',
    hqLocation: 'Navi Mumbai, Maharashtra',
    homeLoanRate: { min: 9.45, max: 12.5, typical: 10.2 },
    personalLoanRate: { min: 12.0, max: 22.5, typical: 14.5 },
    carLoanRate: { min: 9.85, max: 13.5, typical: 10.85 },
    processingFee: '1-2% of loan amount (min ₹5,000) for home loans.',
    prepaymentPolicy: 'Zero on floating-rate retail home loans post-12 EMIs.',
    marketContext: 'Suryoday Small Finance Bank, headquartered in Navi Mumbai, started as Suryoday Microfinance (since 2009) and became an SFB in 2017. The bank operates about 660 banking touchpoints concentrated in Maharashtra (especially Mumbai metro tier-2 areas), Tamil Nadu, Karnataka, and Odisha. Total advances around ₹9,500 crore. Suryoday listed on BSE/NSE in March 2021, one of the earlier SFB listings.',
    uniqueAngle: 'Suryoday has distinctive Maharashtra concentration for an SFB. Most peer SFBs (AU, Equitas, Ujjivan, Jana) are headquartered outside Maharashtra. For Mumbai metro tier-2 zones (Navi Mumbai outer, Kalyan, Dombivli, Panvel, Karjat) and broader Maharashtra tier-3 markets, Suryoday offers SFB-style flexible underwriting with rate-competitive pricing for self-employed and MSME-linked customers.',
    productHighlights: [
      'Suryoday Home Loan: 9.45-10.85% with PMAY-CLSS handling',
      'Suryoday Affordable Housing Loan: tier-2/3 Maharashtra focus',
      'Suryoday MFI-Graduate Home Loan: legacy MFI customer pathway',
      'Suryoday Two-Wheeler Loan: rural Maharashtra and Tamil Nadu',
      'Suryoday Personal Loan: digital-first for existing customers',
    ],
    faqs: [
      {
        q: 'Suryoday SFB for Navi Mumbai / Panvel / Karjat home loan?',
        a: 'Yes. Suryoday is one of the few SFBs with meaningful Mumbai metro presence (headquartered in Navi Mumbai). For Navi Mumbai outer (Panvel, Karjat, Khopoli, Kalyan, Ulhasnagar) home loan buyers, particularly self-employed customers, gig workers, and MSME-linked households, Suryoday offers flexible underwriting plus rate competitiveness vs commercial private banks for the affordable segment. Combined with Maharashtra\'s 5-6% stamp duty and PMAY-CLSS handling, Suryoday is a viable option for the Mumbai metro affordable tier.',
      },
      {
        q: 'Suryoday SFB vs Equitas vs Ujjivan: who is better?',
        a: 'Equitas dominates Tamil Nadu, Ujjivan is nationally distributed, AU is largest with North/West concentration plus Karnataka/AP via Fincare. Suryoday has distinctive Maharashtra presence, particularly Mumbai metro tier-2 areas and broader Maharashtra tier-3. For Maharashtra-focused buyers needing SFB-style flexible underwriting: Suryoday often wins on local branch density. For pan-India or other states: Equitas/Ujjivan/AU typically better. Rates broadly similar across the four (~9.5-10.5% range for home loans).',
      },
      {
        q: 'Suryoday IPO 2021 performance: bank stability?',
        a: 'Suryoday listed on BSE/NSE in March 2021 at ₹305/share, raising ₹582 crore. Post-listing performance has been mixed with general SFB sector challenges including MFI book stress in 2024-2025. The bank has remained profitable with capital adequacy around 28% (well above RBI requirement) and gross NPA around 4-5%. As a SEBI-listed and DICGC-insured scheduled commercial bank, Suryoday operates under standard banking protections. Standard ₹5 lakh deposit insurance applies.',
      },
    ],
    metaKeywords: ['suryoday sfb emi calculator', 'suryoday home loan emi', 'suryoday small finance bank loan', 'suryoday navi mumbai home loan'],
  },
  {
    slug: 'hsbc-india',
    bankName: 'HSBC India',
    fullName: 'The Hongkong and Shanghai Banking Corporation Limited, India',
    emoji: '🔴',
    hqLocation: 'Mumbai, Maharashtra',
    homeLoanRate: { min: 8.6, max: 9.8, typical: 8.95 },
    personalLoanRate: { min: 10.5, max: 16.0, typical: 11.75 },
    carLoanRate: { min: 9.25, max: 11.5, typical: 9.85 },
    processingFee: '0.5-1% of loan amount (max ₹25,000) for HSBC Premier home loans. Personal loans 1-2% with fee waivers for Premier and Jade customers.',
    prepaymentPolicy: 'Zero foreclosure charges on floating-rate home loans for individual borrowers. 3-4% on fixed-rate personal loan prepayments within 12 months.',
    marketContext: 'HSBC India is the local arm of London-headquartered HSBC Holdings, one of the oldest foreign banks in India with continuous operations since 1853. It runs about 26 branches across 14 Indian cities, having sold the bulk of its mass-retail book to ICICI Bank in 2003. The bank has since rebuilt around premier and private banking, with India contributing meaningfully to HSBC\'s Asia wealth strategy. Total India assets are roughly ₹2.5 lakh crore as of FY2025, with the wealth and personal banking segment growing double digits annually.',
    uniqueAngle: 'HSBC India is the bank of choice for globally-mobile Indians and NRIs who want a single relationship that travels across HSBC\'s 60+ country footprint. Premier status earned in India is recognised in London, Singapore, Dubai, and Hong Kong with cross-border account opening in 48 hours.',
    productHighlights: [
      'HSBC Premier Home Loan: 8.6-9.5% for customers with ₹40 lakh TRV',
      'HSBC Jade private banking with ₹25 crore investable threshold',
      'HSBC Smart Money personal loan for Premier customers',
      'HSBC Global View account linking for NRI customers across 21 countries',
      'HSBC Cashback Credit Card with 1.5% unlimited cashback',
    ],
    faqs: [
      { q: 'Can anyone get an HSBC India home loan, or is it Premier-only?', a: 'HSBC relaunched retail home loans in 2023 but lending is effectively limited to HSBC Premier customers, meaning you need to hold a Total Relationship Value of ₹40 lakh with the bank (savings, FD, mutual funds, or insurance combined) or a salary credit of ₹4 lakh+ per month. HSBC does not market home loans to walk-in non-Premier customers and the digital application gates eligibility on Premier status upfront.' },
      { q: 'How does HSBC Premier compare to ICICI Private or HDFC Imperia?', a: 'HSBC Premier\'s differentiator is global portability, your Premier status, credit history, and account opening privileges work in 60+ countries, which ICICI Private and HDFC Imperia cannot match. However, HSBC has only 26 Indian branches versus thousands for ICICI and HDFC, so domestic branch access is limited. Premier suits NRIs, frequent travellers, and Indians with overseas children studying or working abroad.' },
      { q: 'Did HSBC really exit Indian retail banking?', a: 'HSBC sold its retail asset book (credit cards, personal loans, mortgages) to ICICI Bank in May 2003 for around $241 million, but it never fully exited. It retained the affluent and NRI segments. Since 2019 HSBC has actively rebuilt Indian retail under the Premier and Jade banners, adding wealth advisory, mortgages, and credit cards back to the product shelf. It is a deliberate up-market strategy, not a return to mass retail.' },
    ],
    metaKeywords: ['hsbc india emi calculator', 'hsbc premier home loan emi', 'hsbc personal loan calculator india', 'hsbc india loan emi'],
  },
  {
    slug: 'standard-chartered-india',
    bankName: 'Standard Chartered India',
    fullName: 'Standard Chartered Bank (India Branch)',
    emoji: '🟦',
    hqLocation: 'Mumbai, Maharashtra',
    homeLoanRate: { min: 8.65, max: 9.85, typical: 9.1 },
    personalLoanRate: { min: 11.49, max: 20.0, typical: 13.5 },
    carLoanRate: { min: 9.4, max: 11.75, typical: 9.95 },
    processingFee: '0.5-1.5% of loan amount (min ₹5,000) for home loans. Personal loans 1.5-2.5% with Priority Banking waivers available.',
    prepaymentPolicy: 'Zero foreclosure charges on floating-rate home loans. 3-5% on personal loan prepayments before 12 months; nil thereafter.',
    marketContext: 'Standard Chartered Bank has been in India since 1858 and is the largest foreign bank in the country by branch count, operating roughly 100 branches across 43 cities. Unlike HSBC or Citi, StanChart never exited Indian retail. It has consistently run a mass-affluent personal banking, mortgage, and credit card business alongside corporate banking. Total India assets are around ₹2 lakh crore with mortgages and unsecured retail forming a meaningful chunk of the book. India is among StanChart\'s top three markets globally by profit contribution.',
    uniqueAngle: 'Standard Chartered is the only large foreign bank that still serves mass-affluent retail customers in India at scale. You do not need ₹40 lakh of relationship value to access a home loan or credit card, making it the most accessible foreign-bank option for the ₹15-50 lakh salaried segment.',
    productHighlights: [
      'StanChart MortgageOne: home loan with linked current account that offsets interest',
      'Standard Chartered Priority Banking with ₹30 lakh TRV threshold',
      'StanChart Ultimate Credit Card with 3.3% return on spends',
      'StanChart Personal Loan: pre-approved in-app for existing customers',
      'StanChart Saadiq Islamic banking suite (one of few in India)',
    ],
    faqs: [
      { q: 'What is the StanChart MortgageOne offset home loan and is it worth it?', a: 'MortgageOne links your home loan to a current account. Any balance you park in that account is offset against the outstanding loan principal for daily interest calculation. So if you have ₹5 lakh sitting idle and a ₹50 lakh loan, you only pay interest on ₹45 lakh that day, but the money stays liquid and you can withdraw anytime. It works brilliantly for self-employed borrowers or salaried folks with lumpy cash flows. The headline rate is 30-50 bps higher than vanilla home loans but the effective rate is usually lower.' },
      { q: 'Why is Standard Chartered still in Indian retail when HSBC and Citi pulled back?', a: 'StanChart\'s global strategy is anchored in Asia, Africa, and the Middle East, markets where retail relationships feed FX, wealth, and remittance revenue. India is one of its top three profit pools and the bank doubled down on retail in 2020-2024 by upgrading the digital app, relaunching MortgageOne, and expanding Priority Banking. HSBC and Citi by contrast prioritised North America and chose to scale back Indian retail to focus on private banking.' },
      { q: 'Standard Chartered Ultimate vs HDFC Infinia: which premium card wins?', a: 'StanChart Ultimate offers a flat 3.3% return on all spends (5 points per ₹150) with no category restrictions and free unlimited domestic and international lounge access at a ₹5,000 annual fee. HDFC Infinia caps at 3.3% only on smart-buy spends and is invite-only with a much higher TRV bar. For pure return-on-spend simplicity, Ultimate wins; for the broader HDFC ecosystem benefits and concierge, Infinia wins.' },
    ],
    metaKeywords: ['standard chartered emi calculator', 'stanchart home loan emi india', 'standard chartered personal loan calculator', 'scb india loan emi'],
  },
  {
    slug: 'citibank-india',
    bankName: 'Citibank India',
    fullName: 'Citibank N.A., India Branch',
    emoji: '🔵',
    hqLocation: 'Mumbai, Maharashtra',
    homeLoanRate: { min: 8.7, max: 9.85, typical: 9.0 },
    personalLoanRate: { min: 11.0, max: 17.5, typical: 12.5 },
    carLoanRate: { min: 9.5, max: 11.85, typical: 10.0 },
    processingFee: 'Not applicable for new retail products. Citibank exited Indian consumer banking in March 2023. Existing retail accounts now Axis Bank Burgundy Private; Citi Private Bank fees negotiated bilaterally. Rates shown reflect equivalent Axis Burgundy pricing for legacy customers.',
    prepaymentPolicy: 'Legacy Citi home loans are now Axis Bank loans. Axis Bank\'s foreclosure policy applies (zero on floating-rate). Citi Private Bank lending to HNI clients follows bespoke private-banking terms.',
    marketContext: 'Citibank India operated one of the most respected foreign-bank consumer franchises in India for nearly 120 years (since 1902), pioneering credit cards, ATMs, and phone banking in the country. In March 2022, Citi announced the global exit from 13 retail markets including India, and on March 1, 2023 transferred its entire Indian consumer business (about 2.4 million customers, ₹27,000 crore of deposits, and the credit card portfolio) to Axis Bank for around ₹11,600 crore. Today Citibank India operates only its Institutional Clients Group (corporate banking, treasury, markets, custody) and Citi Private Bank for ultra-HNI clients with $25 million+ investable assets.',
    uniqueAngle: 'Citi Private Bank India is one of only three true global private banks operating in India (alongside UBS and JP Morgan). It serves around 200 ultra-HNI families and offers booking centres in Singapore, Hong Kong, London, and New York, which domestic private banks like Kotak and IIFL cannot replicate.',
    productHighlights: [
      'Citi Institutional Banking: cash management for 60% of India\'s Fortune 500',
      'Citi Private Bank: $25M+ investable asset threshold, global booking centres',
      'Citi Commercial Bank for mid-market firms with $10-3,000M revenue',
      'Citi Markets & Securities Services (custody and FX)',
      'Legacy retail accounts now serviced by Axis Bank (Citi-branded until 2024)',
    ],
    faqs: [
      { q: 'Can I still get a home loan or personal loan from Citibank India in 2026?', a: 'No. Citibank exited Indian consumer banking on March 1, 2023, when the entire retail business (credit cards, personal loans, mortgages, wealth management for sub-private-bank clients) transferred to Axis Bank. If you want a Citi-style relationship, you now apply to Axis Bank Burgundy Private. The only retail-adjacent lending Citi still does is bespoke mortgage and Lombard lending through Citi Private Bank, available only if you have $25 million+ in investable assets.' },
      { q: 'I had a Citi home loan before 2023: what happened to it?', a: 'Your loan was novated to Axis Bank on March 1, 2023. The contractual rate, tenure, and EMI remained unchanged on transfer, but any rate resets after March 2023 follow Axis Bank\'s repo-linked benchmark rather than Citi\'s erstwhile MCLR. Your EMI is now debited from your Axis account (your old Citi account number was mapped to a new Axis number) and customer service runs through Axis branches and the Axis Mobile app.' },
      { q: 'What does Citi Private Bank actually offer that domestic private banks don\'t?', a: 'Citi Private Bank gives onshore Indian clients direct access to the global Citi Markets desk, meaning you can hold and trade US equities, European bonds, Asia hedge funds, and global structured products through booking centres in Singapore, Hong Kong, London, and New York under a single relationship. Domestic banks can offer some of this through LRS routing but not as a unified global custody platform. It also offers true cross-border lending: Lombard credit against a US-listed share portfolio for an Indian-resident client.' },
    ],
    metaKeywords: ['citibank india emi calculator', 'citi axis bank loan transfer', 'citibank exit india 2023', 'citi private bank india'],
  },
  {
    slug: 'deutsche-bank-india',
    bankName: 'Deutsche Bank India',
    fullName: 'Deutsche Bank AG, India Branch',
    emoji: '🟨',
    hqLocation: 'Mumbai, Maharashtra',
    homeLoanRate: { min: 8.7, max: 9.9, typical: 9.05 },
    personalLoanRate: { min: 10.99, max: 17.5, typical: 12.5 },
    carLoanRate: { min: 9.5, max: 11.85, typical: 10.15 },
    processingFee: '0.5-1% of loan amount (max ₹50,000) on home loans for db Wealth and db Private clients. Personal loans 1.5-2% with full waivers for db Private relationships.',
    prepaymentPolicy: 'Zero foreclosure charges on floating-rate retail home loans. Personal loans charged 3-4% on prepayment within 12 months of disbursement.',
    marketContext: 'Deutsche Bank has operated in India since 1980 and runs about 17 branches across major metros: Mumbai, Delhi, Bengaluru, Chennai, Kolkata, Pune, Aurangabad, Kolhapur, and Ludhiana. Unlike most foreign banks, Deutsche has historically punched above its weight in retail by deliberately serving the mass-affluent and HNI Indian segment through db Wealth and db Private programmes. Total India assets are roughly ₹1.5 lakh crore with corporate and institutional banking being the largest contributor, but retail mortgages, personal loans, and wealth management add a meaningful long-tail. India is one of Deutsche\'s top three Asia-Pacific markets by revenue.',
    uniqueAngle: 'Deutsche Bank India is the only mid-sized foreign bank that combines a full retail home-loan and personal-loan shelf with private-banking depth. Its db Private programme (₹5 crore investable threshold) is the lowest-entry true private bank in India, sitting between mass-affluent priority banking and ultra-HNI Citi/UBS private banking.',
    productHighlights: [
      'Deutsche Bank Home Loan: 8.7-9.5% repo-linked for db Wealth clients',
      'db Private banking: ₹5 crore investable asset threshold',
      'db Wealth: ₹50 lakh TRV mass-affluent programme',
      'Deutsche Bank Personal Loan: 100% digital with same-day disbursal',
      'db Treasury services for resident HNI cross-border investments',
    ],
    faqs: [
      { q: 'Is Deutsche Bank India safe given the parent\'s 2016-2019 troubles?', a: 'Deutsche Bank AG went through a multi-year restructuring from 2019, exiting equities sales and trading, cutting 18,000 jobs, and rebuilding around corporate banking, private banking, and investment banking advisory. Since 2022 the parent has posted record profits, raised CET1 capital to 13.8%, and rebuilt its credit rating to A+ (Fitch). The India branch is separately capitalised, regulated by RBI, and CRAR is around 16%. From an Indian depositor standpoint, DICGC insurance covers ₹5 lakh and the branch has never had a stress event.' },
      { q: 'db Private vs Kotak Private Banking: what\'s the difference?', a: 'db Private (₹5 crore threshold) gives you a global Deutsche Bank relationship. You can hold accounts in Frankfurt, London, Singapore, and Dubai under one relationship manager, with cross-border lending and FX execution at institutional spreads. Kotak Private (₹5 crore threshold) is a domestic powerhouse with deeper Indian product breadth (alternates, real estate funds, structured PMS) but cannot match Deutsche\'s European booking centres or USD/EUR Lombard lending. Choose Deutsche if you have offshore wealth or international family; choose Kotak for pure Indian alpha.' },
      { q: 'Why is Deutsche home loan EMI typically higher than HDFC for the same borrower?', a: 'Deutsche Bank prices home loans 30-70 bps above HDFC for the same credit profile because (a) it has only 17 Indian branches, so cost-to-serve per loan is higher, (b) it does not chase mass-retail volume, focusing instead on db Wealth and db Private clients where the relationship economics include wealth-management fees and FX revenue, and (c) it does not run aggressive balance-transfer campaigns. The trade-off you get is a private-banker-style mortgage experience, deeper underwriting flexibility for variable-income borrowers, and faster turnaround for ₹5 crore+ ticket sizes.' },
    ],
    metaKeywords: ['deutsche bank india emi calculator', 'db wealth home loan emi', 'deutsche bank personal loan india', 'db private banking emi calculator'],
  },
  {
    slug: 'bnp-paribas-india',
    bankName: 'BNP Paribas India',
    fullName: 'BNP Paribas, India Branch',
    emoji: '🟩',
    hqLocation: 'Mumbai, Maharashtra',
    homeLoanRate: { min: 9.0, max: 10.25, typical: 9.45 },
    personalLoanRate: { min: 11.5, max: 18.0, typical: 13.25 },
    carLoanRate: { min: 9.6, max: 12.0, typical: 10.4 },
    processingFee: '0.75-1.25% of loan amount on Wealth Management home financing (max ₹1 lakh). Corporate real estate facilities negotiated bilaterally. No mass-retail personal loan shelf.',
    prepaymentPolicy: 'Zero foreclosure on floating-rate Wealth Management home loans. Corporate real estate financing follows bespoke covenants with structured prepayment grids.',
    marketContext: 'BNP Paribas operates in India since 1860 (originally as Comptoir d\'Escompte de Paris) and is the longest-established French bank in the country, running about 8 branches across Mumbai, Delhi, Bengaluru, Chennai, Kolkata, Hyderabad, Pune, and Ahmedabad. Unlike StanChart or HSBC, BNP has deliberately stayed out of mass-retail in India, its book is dominated by corporate banking, institutional securities services, and the joint-venture Geojit BNP Paribas brokerage. Total India assets are around ₹85,000 crore, with corporate loans, India-to-Europe trade finance, and custody services for foreign portfolio investors forming the core. Retail exists only as an adjunct to BNP Paribas Wealth Management for HNI individuals.',
    uniqueAngle: 'BNP Paribas is the only foreign bank in India that ties retail home financing directly to its Wealth Management franchise. There is no walk-in mortgage product, but Wealth Management clients (~$3 million investable assets) get bespoke home loans, often against pledged portfolios, with European-style relationship pricing that most Indian private banks cannot match.',
    productHighlights: [
      'BNP Paribas Wealth Management: ~$3M investable threshold for India clients',
      'BNP Paribas Corporate Real Estate financing for commercial property',
      'BNP Paribas Securities Services: largest foreign custodian for India FPIs',
      'Geojit BNP Paribas brokerage joint venture (~30% stake)',
      'BNP Paribas Personal Investors structured products for HNI',
    ],
    faqs: [
      { q: 'Can I walk into a BNP Paribas branch and apply for a home loan?', a: 'No. BNP Paribas does not operate a mass-retail mortgage shelf in India. There is no published rate card on the website, no branch-walk-in process, and no DSA channel. Home financing is available only as a private-banking service to BNP Paribas Wealth Management clients (typically requiring around $3 million of investable assets with the bank) and is structured case-by-case, often as a Lombard-style loan against a pledged investment portfolio rather than a conventional EMI mortgage.' },
      { q: 'What does BNP Paribas actually do in India then?', a: 'Three things dominate the India book. First, corporate and investment banking. BNP is a top-five bookrunner for Indian companies issuing euro bonds and arranges India-Europe trade finance for the likes of Tata, Mahindra, and the L\'Oreal India operation. Second, BNP Paribas Securities Services is one of the two largest foreign custodians for Foreign Portfolio Investors investing into Indian equities and bonds. Third, Wealth Management for resident and non-resident Indian HNIs with European booking centres.' },
      { q: 'BNP Paribas Wealth Management vs Julius Baer India: what\'s the difference?', a: 'Both target the ~$3-25 million HNI segment with European booking centres, but the flavour differs. BNP Paribas has the strongest French and European corporate-credit footprint, useful if you have business interests, real estate, or family in France, Belgium, Luxembourg, or Italy, and want banking and lending integrated across those geographies. Julius Baer is a pure-play Swiss private bank with deeper investment-management capability and zero corporate-banking entanglement. Pick BNP if your wealth has a European business angle; pick Julius Baer if you want pure independent advisory.' },
    ],
    metaKeywords: ['bnp paribas india emi calculator', 'bnp paribas wealth management home loan', 'bnp paribas corporate real estate india', 'french bank loan emi india'],
  },
  {
    slug: 'lic-housing',
    bankName: 'LIC Housing Finance',
    fullName: 'LIC Housing Finance Limited',
    emoji: '🏘️',
    hqLocation: 'Mumbai, Maharashtra',
    homeLoanRate: { min: 8.50, max: 11.50, typical: 9.00 },
    personalLoanRate: { min: 12.0, max: 18.0, typical: 13.5 },
    carLoanRate: { min: 9.5, max: 13.0, typical: 10.5 },
    processingFee: '0.25-0.50% of loan amount (min ₹3,000, max ₹15,000) for home loans. Frequent festive-season fee waivers and rate concessions for women borrowers and salaried applicants.',
    prepaymentPolicy: 'Zero foreclosure/prepayment charges on floating-rate home loans for individual borrowers (RBI mandate). Fixed-rate or non-individual loans attract 2% prepayment penalty.',
    marketContext: 'LIC Housing Finance, incorporated in 1989 and promoted by Life Insurance Corporation of India, is the second-largest HFC in India after the HDFC Ltd-HDFC Bank merger absorbed the erstwhile #1. The company has an outstanding loan book of approximately ₹2.9 lakh crore as of FY26, with home loans contributing nearly 80%. LICHFL operates through 280+ marketing offices and 25+ back-office processing centres, with particularly deep penetration in Tier-2 and Tier-3 towns across Maharashtra, Gujarat, Tamil Nadu, Telangana, and Uttar Pradesh. Backed by LIC\'s 40%+ shareholding, it enjoys AAA credit ratings from CRISIL and CARE, allowing it to borrow at near-bank rates from the bond market.',
    uniqueAngle: 'LIC Housing Finance is the only HFC with the implicit sovereign-adjacent comfort of LIC parentage, which lets it price aggressively close to PSU banks while specializing in mass-market and affordable home loans down to ₹5 lakh ticket sizes. It is particularly strong among salaried PSU and government employees who already hold LIC insurance policies, with cross-sell tie-ups that few competitors can match.',
    productHighlights: [
      'Griha Varishtha: home loan for senior citizens and pensioners',
      'Griha Suvidha: top-up loan against existing LICHFL home loan',
      'Home Loan for NRIs: dedicated NRI desk with rupee/foreign-income underwriting',
      'Plot Loan + Construction Loan combo',
      'Griha Setu: home loan balance transfer with top-up'
    ],
    faqs: [
      {
        q: 'How is LIC Housing Finance different from a commercial bank home loan?',
        a: 'LICHFL is a dedicated HFC regulated by the National Housing Bank (now under RBI supervision post-2019), not a universal bank. It cannot offer savings accounts, credit cards, or current accounts, but specializes exclusively in housing finance, which means deeper underwriting flexibility on self-employed and informal-income borrowers, faster sanctions in Tier-2/3 towns, and longer-tenure products (up to 30 years) than most banks. Rates are typically 25-50 bps higher than SBI/HDFC Bank but with lower paperwork friction.'
      },
      {
        q: 'Who is the ideal LIC Housing Finance borrower?',
        a: 'LICHFL is best suited for salaried government/PSU employees, LIC policyholders, pensioners under the Griha Varishtha scheme, and mass-affluent self-employed professionals in Tier-2/3 cities. Borrowers seeking ₹15 lakh-₹75 lakh tickets in non-metro locations often find LICHFL faster and more flexible than large private banks.'
      },
      {
        q: 'Is LIC Housing Finance safe given it is not a bank?',
        a: 'Yes. LICHFL is AAA-rated by CRISIL and CARE, has LIC (a sovereign-owned insurer) as its largest shareholder with 40%+ stake, and is regulated by RBI/NHB. It has been listed on BSE/NSE since 1994 and has never defaulted on any debt obligation. Customer home loan accounts are also fully secured by mortgage of the underlying property, so HFC solvency risk does not affect the customer\'s ownership.'
      }
    ],
    metaKeywords: ['LIC Housing Finance EMI calculator', 'LICHFL home loan rate 2026', 'LIC home loan eligibility', 'LIC Housing prepayment charges'],
  },
  {
    slug: 'pnb-housing',
    bankName: 'PNB Housing Finance',
    fullName: 'PNB Housing Finance Limited',
    emoji: '🏘️',
    hqLocation: 'New Delhi',
    homeLoanRate: { min: 8.75, max: 14.00, typical: 9.25 },
    personalLoanRate: { min: 12.0, max: 18.0, typical: 13.5 },
    carLoanRate: { min: 9.5, max: 13.0, typical: 10.5 },
    processingFee: '0.35-1.0% of loan amount (min ₹10,000) for home loans. Higher for self-employed and Unnati affordable-segment loans (up to 1.5%).',
    prepaymentPolicy: 'Zero prepayment charges on floating-rate individual home loans. Fixed-rate loans attract 2% on outstanding principal if prepaid from non-own-source funds.',
    marketContext: 'PNB Housing Finance, promoted by Punjab National Bank (which retains ~28% stake post-dilution), was incorporated in 1988 and is among India\'s top-5 HFCs with an AUM of approximately ₹65,000 crore as of FY26. After Carlyle Group exited its stake in 2023, the company has been led by MD & CEO Girish Kousgi (since 2022) with a strategy pivot toward self-employed and affordable housing segments under the "Roshni" affordable vertical and "Unnati" mass-affluent vertical. PNBHFL operates through 300+ branches across 20 states, with strongest penetration in North and West India.',
    uniqueAngle: 'PNB Housing Finance is the only large HFC actively rebuilding its self-employed underwriting muscle after the 2018-2021 NBFC crisis, with a credit-scoring model designed for non-salaried mass-affluent borrowers that traditional banks reject. The "Roshni" vertical pushes ticket sizes as low as ₹8 lakh into Tier-3 markets.',
    productHighlights: [
      'Unnati Home Loan: for self-employed and mass-affluent',
      'Roshni Affordable Home Loan: ticket sizes ₹5-50 lakh in Tier-3 markets',
      'Plot + Construction Composite Loan',
      'Home Loan Balance Transfer with Top-up',
      'Non-Resident Indian (NRI) Home Loan'
    ],
    faqs: [
      {
        q: 'What makes PNB Housing Finance different from PNB the bank?',
        a: 'PNB Housing is a separately listed HFC where Punjab National Bank holds ~28% as the promoter. It is not a division of the bank. PNBHFL is regulated by RBI/NHB as a housing finance company, has its own board and management, and prices loans 25-75 bps above PNB the bank. The advantage is faster sanctions, longer tenure (up to 30 years), and willingness to underwrite self-employed and informal-income borrowers that PNB the bank may decline.'
      },
      {
        q: 'Who should choose PNB Housing Finance over a regular bank?',
        a: 'Self-employed professionals, small business owners, and mass-affluent borrowers in Tier-2/3 cities who need ₹20 lakh-₹2 crore home loans and have non-standard income documentation are PNBHFL\'s sweet spot. The Roshni vertical also serves first-time affordable-housing borrowers with ticket sizes as low as ₹5 lakh.'
      },
      {
        q: 'Is PNB Housing Finance financially safe after the Carlyle exit?',
        a: 'Yes. PNBHFL completed a ₹2,500 crore rights issue in 2023 that fully recapitalized its balance sheet, brought GNPA below 1.5%, and earned a credit rating upgrade. It carries AA+ ratings from CRISIL, CARE, and ICRA, has PNB (a PSU bank) as its anchor shareholder, and is regulated by RBI. The Carlyle exit was a private-equity lifecycle event, not a distress sale.'
      }
    ],
    metaKeywords: ['PNB Housing Finance EMI calculator', 'PNBHFL home loan rate 2026', 'PNB Housing Unnati eligibility', 'Roshni affordable home loan'],
  },
  {
    slug: 'indiabulls-housing',
    bankName: 'Sammaan Capital (Indiabulls Housing)',
    fullName: 'Sammaan Capital Limited (formerly Indiabulls Housing Finance)',
    emoji: '🏘️',
    hqLocation: 'Gurugram, Haryana',
    homeLoanRate: { min: 9.75, max: 14.50, typical: 10.50 },
    personalLoanRate: { min: 12.0, max: 18.0, typical: 13.5 },
    carLoanRate: { min: 9.5, max: 13.0, typical: 10.5 },
    processingFee: '0.5-1.5% of loan amount (min ₹10,000) for retail home loans. Construction-finance and LAP attract 1-2%.',
    prepaymentPolicy: 'Zero foreclosure on floating-rate individual home loans per RBI/NHB norms. 2-4% on fixed-rate loans and corporate developer loans.',
    marketContext: 'Sammaan Capital, the rebranded entity of Indiabulls Housing Finance, was renamed in 2024 as part of a strategic reset under the new management led by Gagan Banga. Originally founded in 2005 as a high-growth wholesale-and-retail HFC, the company peaked at an AUM of over ₹1.3 lakh crore before the 2019 ILFS/DHFL contagion exposed its over-reliance on wholesale developer lending. Post-restructuring, the loan book has been actively deleveraged to approximately ₹70,000 crore, with the mix now tilted toward retail home loans and away from corporate developer exposure. The company is listed on BSE/NSE and has undergone significant board restructuring and capital infusion.',
    uniqueAngle: 'Sammaan Capital (Indiabulls Housing) is a turnaround HFC with a deliberately smaller, retail-focused book post-2019 stress. Borrowers benefit from aggressive pricing as the company rebuilds market share, but should compare against larger HFCs given the legacy stress narrative.',
    productHighlights: [
      'Sammaan Home Loan (formerly Indiabulls Home Loan)',
      'Loan Against Property (LAP)',
      'Home Loan Balance Transfer',
      'NRI Home Loan',
      'Plot Loan'
    ],
    faqs: [
      {
        q: 'Is Sammaan Capital the same as Indiabulls Housing Finance?',
        a: 'Yes. Sammaan Capital is the new corporate name adopted in 2024 by the entity formerly known as Indiabulls Housing Finance Limited. The PAN, listing, and legal identity remain the same; only the brand has been changed as part of management\'s post-restructuring repositioning. Existing Indiabulls home loan customers are now Sammaan Capital customers with no change to loan terms.'
      },
      {
        q: 'Who is Sammaan Capital best suited for as a home loan borrower?',
        a: 'Sammaan Capital today is best for mass-affluent salaried and self-employed borrowers in Tier-1/Tier-2 metros looking for ₹25 lakh-₹2 crore tickets, who value faster sanction speed and are comfortable with an HFC rebuilding its retail franchise. Borrowers seeking the lowest possible rate should still benchmark against SBI, HDFC Bank, and LIC Housing.'
      },
      {
        q: 'Is Sammaan Capital safe given the past Indiabulls stress?',
        a: 'Sammaan Capital has materially deleveraged since 2019, brought down its wholesale developer book, raised fresh capital, and maintains AA-/A+ credit ratings (lower than top-tier HFCs but stable). It is regulated by RBI/NHB and listed on BSE/NSE. Customer home loans remain fully secured by property mortgage regardless of HFC-level credit views. Solvency risk does not transfer to retail borrowers, but the company\'s rate-card may be higher than peers as a reflection of its rating.'
      }
    ],
    metaKeywords: ['Sammaan Capital EMI calculator', 'Indiabulls Housing home loan 2026', 'Sammaan home loan rate', 'Indiabulls rebrand Sammaan'],
  },
  {
    slug: 'aavas',
    bankName: 'Aavas Financiers',
    fullName: 'Aavas Financiers Limited',
    emoji: '🏘️',
    hqLocation: 'Jaipur, Rajasthan',
    homeLoanRate: { min: 10.50, max: 16.00, typical: 12.00 },
    personalLoanRate: { min: 12.0, max: 18.0, typical: 13.5 },
    carLoanRate: { min: 9.5, max: 13.0, typical: 10.5 },
    processingFee: '1.0-2.0% of loan amount (min ₹5,000) for affordable home loans. LAP processing 1.5-2.5%.',
    prepaymentPolicy: 'Zero foreclosure charges on floating-rate individual home loans (RBI mandated). 4% on fixed-rate loans if prepaid from non-own-source funds.',
    marketContext: 'Aavas Financiers, founded in 2011 (originally as AU Housing Finance before AU SFB acquired the small-finance-bank license and spun off the HFC), is one of India\'s leading affordable-housing-focused HFCs. Headquartered in Jaipur, Aavas operates through 380+ branches concentrated in Rajasthan, Madhya Pradesh, Gujarat, Maharashtra, and select northern/central states, with an AUM of approximately ₹16,000 crore. The average ticket size is just ₹9-10 lakh, and over 60% of borrowers are self-employed or in the informal economy. Listed on BSE/NSE since October 2018, Aavas is backed by Kedaara Capital and Partners Group as anchor investors and carries AA ratings.',
    uniqueAngle: 'Aavas Financiers is one of the most discipline-driven affordable-housing HFCs, with a 100% in-house sourcing model (no DSAs), industry-leading GNPA below 1.1%, and the ability to underwrite informal-income borrowers using cash-flow-based assessment instead of formal income proofs.',
    productHighlights: [
      'Home Loan for Self-Employed (Informal Income)',
      'Home Loan for Salaried',
      'Home Improvement / Extension Loan',
      'Plot + Self-Construction Composite Loan',
      'Loan Against Property (LAP)'
    ],
    faqs: [
      {
        q: 'How is Aavas Financiers different from a commercial bank or large HFC?',
        a: 'Aavas exclusively serves the affordable-housing segment with average ticket sizes of ₹9-10 lakh, far below the ₹30 lakh+ that mainstream banks and large HFCs prefer. Aavas underwrites self-employed and informal-income borrowers (small shopkeepers, contractors, farmers, dairy owners) using cash-flow assessment, document-light processes, and branch-visit-based personal discussion. Rates are 250-400 bps higher than mainstream banks, reflecting the credit and operational cost of this segment.'
      },
      {
        q: 'Who should choose Aavas Financiers for a home loan?',
        a: 'Aavas is ideal for self-employed informal-sector borrowers in Tier-3 towns and rural India of Rajasthan, MP, Gujarat, and Maharashtra, with ticket sizes of ₹5-25 lakh, who cannot easily document income via ITR/Form 16. First-time home buyers under the Pradhan Mantri Awas Yojana (PMAY) credit-linked subsidy scheme are also a natural fit.'
      },
      {
        q: 'Is Aavas Financiers safe and well-rated?',
        a: 'Yes. Aavas carries AA/AA- ratings from CARE, ICRA, and CRISIL, has been profitably listed on BSE/NSE since 2018, and maintains a GNPA below 1.1% (best-in-class for affordable HFCs). Backed by Kedaara Capital and Partners Group as significant shareholders, Aavas is regulated by RBI/NHB and has consistently raised debt from banks, NCDs, and NHB refinance lines.'
      }
    ],
    metaKeywords: ['Aavas Financiers EMI calculator', 'Aavas home loan rate 2026', 'affordable home loan Rajasthan', 'Aavas self-employed home loan'],
  },
  {
    slug: 'aptus',
    bankName: 'Aptus Value Housing Finance',
    fullName: 'Aptus Value Housing Finance India Limited',
    emoji: '🏘️',
    hqLocation: 'Chennai, Tamil Nadu',
    homeLoanRate: { min: 11.00, max: 16.50, typical: 12.50 },
    personalLoanRate: { min: 12.0, max: 18.0, typical: 13.5 },
    carLoanRate: { min: 9.5, max: 13.0, typical: 10.5 },
    processingFee: '1.0-2.0% of loan amount (min ₹3,500) for affordable home loans. Insurance and legal/technical charges separate.',
    prepaymentPolicy: 'Zero foreclosure on floating-rate individual home loans (RBI mandated). 4% on fixed-rate loans prepaid from non-own-source funds within 3 years.',
    marketContext: 'Aptus Value Housing Finance, founded in 2009 by Anand Mahindra-associated and WestBridge Capital-backed promoters, is a leading South India-focused affordable-housing HFC. Listed on BSE/NSE in August 2021, Aptus operates ~280 branches concentrated in Tamil Nadu, Andhra Pradesh, Karnataka, and Telangana, with an AUM of approximately ₹8,000 crore as of FY26. Average ticket size is ₹8-9 lakh, with over 70% of borrowers being self-employed in the informal economy, small farmers, daily-wage earners, and small business owners. Aptus carries AA- ratings and has consistently been among the most profitable HFCs in India by return-on-assets (RoA 7-8%).',
    uniqueAngle: 'Aptus Value Housing is among the highest-RoA affordable HFCs in India (7-8%) due to its branch-led, deep-rural South India model where formal-sector competitors do not operate. Its informal-income underwriting is calibrated for borrowers earning ₹15,000-40,000 per month in cash.',
    productHighlights: [
      'Aptus Home Loan (Self-Employed Affordable)',
      'Aptus Home Loan (Salaried)',
      'Home Improvement Loan',
      'Loan Against Property (LAP)',
      'Insurance-Linked Home Loan Package'
    ],
    faqs: [
      {
        q: 'How is Aptus different from a commercial bank or PSU home loan?',
        a: 'Aptus serves a borrower segment that banks cannot economically underwrite, self-employed informal-economy households in Tier-3 South Indian towns with monthly cash income of ₹15,000-40,000 and no formal income documents. Aptus uses field-based personal discussion, neighbour and reference verification, and cash-flow assessment instead of ITR-based underwriting. Loan tickets are typically ₹5-15 lakh, and rates are 300-500 bps higher than banks to compensate for credit and operational cost.'
      },
      {
        q: 'Who is the ideal Aptus borrower?',
        a: 'Aptus is ideal for first-time home buyers in semi-urban and rural Tamil Nadu, Andhra Pradesh, Karnataka, and Telangana, with informal cash incomes of ₹15,000-50,000 per month, seeking ticket sizes of ₹5-20 lakh. PMAY-eligible borrowers benefit from the 6.5% credit-linked subsidy on the first ₹6 lakh of the loan.'
      },
      {
        q: 'Is Aptus Value Housing Finance safe and credit-rated?',
        a: 'Yes. Aptus carries AA- ratings from ICRA and CARE, has been listed on BSE/NSE since August 2021, and maintains one of the highest capital adequacy ratios in the HFC industry (above 70%). Backed by WestBridge Capital and Westbridge AIF, regulated by RBI/NHB, and consistently profitable with industry-best RoA, Aptus has a clean credit track record with GNPA below 1.5%.'
      }
    ],
    metaKeywords: ['Aptus home loan EMI calculator', 'Aptus Value Housing rate 2026', 'affordable home loan Tamil Nadu', 'Aptus self-employed home loan'],
  },
  {
    slug: 'india-shelter',
    bankName: 'India Shelter Finance',
    fullName: 'India Shelter Finance Corporation Limited',
    emoji: '🏘️',
    hqLocation: 'Gurugram, Haryana',
    homeLoanRate: { min: 11.50, max: 17.00, typical: 13.00 },
    personalLoanRate: { min: 12.0, max: 18.0, typical: 13.5 },
    carLoanRate: { min: 9.5, max: 13.0, typical: 10.5 },
    processingFee: '1.5-2.5% of loan amount (min ₹4,000) for affordable home loans. LAP attracts 2.0-3.0%.',
    prepaymentPolicy: 'Zero foreclosure on floating-rate individual home loans (RBI mandated). 4% on fixed-rate loans prepaid from non-own-source funds.',
    marketContext: 'India Shelter Finance, founded in 1998 and re-promoted by WestBridge Capital and Nexus Venture Partners in 2010, is a Gurugram-headquartered affordable-housing HFC focused on the self-employed informal-sector segment. The company completed its IPO in December 2023 and now has an AUM of approximately ₹6,500 crore across 240+ branches in 15 states, with strongest presence in Rajasthan, Maharashtra, Madhya Pradesh, and Gujarat. Average ticket size is ₹10-11 lakh, and over 70% of borrowers are first-time formal borrowers without prior banking credit history. India Shelter carries A+ to AA- ratings and emphasises a fully in-house, branch-led sourcing model.',
    uniqueAngle: 'India Shelter Finance specialises in lending to self-employed informal-sector first-time borrowers with thin or no credit bureau history, a segment most banks and even larger HFCs avoid. Its underwriting combines cash-flow assessment with social-collateral verification (neighbour, community, customer references).',
    productHighlights: [
      'Self-Employed Home Loan',
      'Salaried Home Loan',
      'Home Improvement & Extension Loan',
      'Loan Against Property (LAP)',
      'Home Construction Loan'
    ],
    faqs: [
      {
        q: 'How is India Shelter different from a commercial bank home loan?',
        a: 'India Shelter exclusively serves self-employed informal-sector borrowers with monthly incomes of ₹15,000-50,000 and often zero credit bureau history, a borrower profile commercial banks cannot economically underwrite. India Shelter uses field-based personal discussion, document-light processes, and neighbourhood verification instead of ITR/payslip-based underwriting. Loan tickets average ₹10 lakh, tenures up to 20 years, and rates 350-500 bps above banks to reflect credit and operational cost.'
      },
      {
        q: 'Who is the ideal India Shelter borrower?',
        a: 'First-time home buyers in Tier-2/Tier-3 towns of North and West India who are self-employed in the informal economy (shop owners, kirana store owners, small contractors, tailors, electricians, drivers), with monthly incomes of ₹15,000-50,000 and seeking ticket sizes of ₹5-25 lakh. PMAY credit-linked subsidy is widely availed by India Shelter customers.'
      },
      {
        q: 'Is India Shelter Finance safe and well-rated?',
        a: 'Yes. India Shelter carries AA-/A+ ratings from ICRA and CARE, has been listed on BSE/NSE since December 2023, and is backed by WestBridge Capital and Nexus Venture Partners as long-term anchor investors. GNPA is maintained below 1.5%, capital adequacy is above 60%, and the company has consistently been profitable. It is regulated by RBI/NHB and has access to NHB refinance lines.'
      }
    ],
    metaKeywords: ['India Shelter EMI calculator', 'India Shelter home loan rate 2026', 'affordable home loan self-employed', 'India Shelter Finance IPO'],
  },
  {
    slug: 'repco-home',
    bankName: 'Repco Home Finance',
    fullName: 'Repco Home Finance Limited',
    emoji: '🏘️',
    hqLocation: 'Chennai, Tamil Nadu',
    homeLoanRate: { min: 10.50, max: 14.50, typical: 11.50 },
    personalLoanRate: { min: 12.0, max: 18.0, typical: 13.5 },
    carLoanRate: { min: 9.5, max: 13.0, typical: 10.5 },
    processingFee: '0.5-1.5% of loan amount (min ₹3,500) for home loans. LAP attracts 1.5-2.0%.',
    prepaymentPolicy: 'Zero foreclosure charges on floating-rate individual home loans (RBI mandated). 2% on fixed-rate loans prepaid from non-own-source funds.',
    marketContext: 'Repco Home Finance, incorporated in 2000, is promoted by the Repatriates Cooperative Finance and Development Bank Ltd (Repco Bank), a government-promoted entity originally established to support Sri Lankan repatriates. Headquartered in Chennai, Repco operates ~180 branches concentrated in Tamil Nadu, Karnataka, Andhra Pradesh, Telangana, Kerala, and Maharashtra, with an AUM of approximately ₹14,000 crore as of FY26. Repco focuses on affordable and mid-segment home loans with average ticket sizes of ₹13-15 lakh, and over 55% of borrowers are self-employed. The company is listed on BSE/NSE since April 2013 and carries AA- ratings.',
    uniqueAngle: 'Repco Home Finance is among the few HFCs with quasi-government promoter backing (Repco Bank, set up under a Government of India initiative for Sri Lankan repatriates) and a deep South India distribution moat built over 25 years. Pricing is tighter than pure affordable HFCs because the book skews toward mid-segment borrowers.',
    productHighlights: [
      'Repco Home Loan (Self-Employed)',
      'Repco Home Loan (Salaried)',
      'Repco Plot Loan',
      'Loan Against Property (LAP)',
      'Home Improvement Loan'
    ],
    faqs: [
      {
        q: 'How is Repco Home Finance different from a commercial bank?',
        a: 'Repco is a dedicated HFC regulated by RBI/NHB and cannot offer current/savings accounts or non-housing products. Its specialty is mid-segment home loans (₹10-30 lakh) to self-employed South Indian borrowers, with deeper informal-income underwriting flexibility than banks. The quasi-government promoter (Repco Bank, originally a Sri Lankan-repatriate cooperative bank backed by GoI) adds institutional comfort while keeping rates competitive.'
      },
      {
        q: 'Who should choose Repco Home Finance for a home loan?',
        a: 'Self-employed and salaried borrowers in Tier-2/Tier-3 towns of Tamil Nadu, Karnataka, Andhra Pradesh, Telangana, and Kerala seeking ticket sizes of ₹10-40 lakh are Repco\'s core segment. Borrowers seeking the convenience of a long-established South India HFC with branch-based service often prefer Repco over north-India-focused affordable HFCs.'
      },
      {
        q: 'Is Repco Home Finance safe and well-rated?',
        a: 'Yes. Repco carries AA-/A+ ratings from CARE and ICRA, has been listed on BSE/NSE since 2013, and is promoted by Repco Bank (a quasi-government cooperative bank). GNPA is maintained at 3-4% (slightly elevated due to mid-segment self-employed exposure), capital adequacy is above 30%, and the company has been consistently profitable. It is regulated by RBI/NHB and has been a long-standing recipient of NHB refinance.'
      }
    ],
    metaKeywords: ['Repco Home Finance EMI calculator', 'Repco home loan rate 2026', 'South India home loan HFC', 'Repco self-employed home loan'],
  },
  {
    slug: 'manappuram-home',
    bankName: 'Manappuram Home Finance',
    fullName: 'Manappuram Home Finance Limited',
    emoji: '🏘️',
    hqLocation: 'Valapad, Thrissur, Kerala',
    homeLoanRate: { min: 10.50, max: 16.00, typical: 12.00 },
    personalLoanRate: { min: 12.0, max: 18.0, typical: 13.5 },
    carLoanRate: { min: 9.5, max: 13.0, typical: 10.5 },
    processingFee: '1.0-2.0% of loan amount (min ₹3,500) for affordable home loans. LAP processing 1.5-2.5%.',
    prepaymentPolicy: 'Zero foreclosure on floating-rate individual home loans (RBI mandated). 4% on fixed-rate loans prepaid from non-own-source funds.',
    marketContext: 'Manappuram Home Finance, incorporated in 2010, is a wholly-owned subsidiary of Manappuram Finance Limited, one of India\'s largest gold-loan NBFCs founded by VP Nandakumar. Headquartered in Thrissur, Kerala, Manappuram Home Finance leverages its parent\'s gold-loan branch network (5,000+ touchpoints) for affordable-housing customer acquisition and cross-sell. The HFC operates with an AUM in the ₹1,500-2,000 crore range and focuses on self-employed informal-sector borrowers in Kerala, Tamil Nadu, Andhra Pradesh, and select North Indian states, with average ticket sizes of ₹8-12 lakh.',
    uniqueAngle: 'Manappuram Home Finance uniquely cross-sells affordable home loans to its parent Manappuram Finance\'s existing 5 million+ gold-loan customer base, a built-in distribution moat where gold-loan repayment behaviour serves as a proxy credit score for borrowers without formal bureau history.',
    productHighlights: [
      'Affordable Home Loan (Self-Employed)',
      'Salaried Home Loan',
      'Home Construction Loan',
      'Home Improvement Loan',
      'Loan Against Property (LAP)'
    ],
    faqs: [
      {
        q: 'How is Manappuram Home Finance different from a bank home loan?',
        a: 'Manappuram Home Finance is a dedicated affordable-housing HFC subsidiary of Manappuram Finance (a gold-loan NBFC). It targets self-employed informal-economy borrowers with ticket sizes of ₹5-20 lakh in South India and select Hindi-belt states, a segment banks cannot economically underwrite. The unique edge: many borrowers already have a gold-loan track record with Manappuram, which serves as alternate credit data.'
      },
      {
        q: 'Who is the ideal Manappuram Home Finance borrower?',
        a: 'Existing Manappuram gold-loan customers and other self-employed informal-sector households in Kerala, Tamil Nadu, Andhra Pradesh, and select Northern states, with monthly incomes of ₹15,000-50,000 and seeking ticket sizes of ₹5-20 lakh, are the natural fit. First-time home buyers without formal credit bureau history especially benefit.'
      },
      {
        q: 'Is Manappuram Home Finance safe given it is a smaller HFC?',
        a: 'Manappuram Home Finance is wholly owned by Manappuram Finance Limited, a publicly listed (BSE/NSE) and AA-rated NBFC with a 28+ year track record. The HFC subsidiary carries AA- ratings from CARE/CRISIL, is regulated by RBI/NHB, and benefits from parent-group liquidity support. Home loan customer security is fully backed by property mortgage regardless of HFC size.'
      }
    ],
    metaKeywords: ['Manappuram Home Finance EMI calculator', 'Manappuram home loan rate 2026', 'gold loan home loan cross sell', 'Manappuram affordable home loan'],
  },
  {
    slug: 'muthoot-homefin',
    bankName: 'Muthoot Homefin',
    fullName: 'Muthoot Homefin (India) Limited',
    emoji: '🏘️',
    hqLocation: 'Mumbai, Maharashtra',
    homeLoanRate: { min: 10.50, max: 15.50, typical: 12.00 },
    personalLoanRate: { min: 12.0, max: 18.0, typical: 13.5 },
    carLoanRate: { min: 9.5, max: 13.0, typical: 10.5 },
    processingFee: '1.0-2.0% of loan amount (min ₹3,500) for home loans. LAP attracts 1.5-2.5%.',
    prepaymentPolicy: 'Zero foreclosure on floating-rate individual home loans (RBI mandated). 4% on fixed-rate loans prepaid from non-own-source funds within 3 years.',
    marketContext: 'Muthoot Homefin (India), incorporated in 2011, is a wholly-owned housing-finance subsidiary of Muthoot Finance Limited, India\'s largest gold-loan NBFC promoted by the M.G. George Muthoot family. The HFC has an AUM of approximately ₹2,000 crore, operating through a mix of own branches and cross-leverage of Muthoot Finance\'s 5,000+ gold-loan branch network. Muthoot Homefin focuses on affordable-housing borrowers in Kerala, Tamil Nadu, Maharashtra, Gujarat, and select North Indian states, with average ticket sizes of ₹8-12 lakh and a self-employed informal-sector borrower mix.',
    uniqueAngle: 'Muthoot Homefin leverages parent Muthoot Finance\'s 130-year brand and 5,000-branch gold-loan distribution to cross-sell affordable home loans, with gold-loan repayment track record serving as alternate credit underwriting for thin-file borrowers.',
    productHighlights: [
      'Affordable Home Loan (Self-Employed)',
      'Salaried Home Loan',
      'Home Construction Loan',
      'Plot Loan',
      'Loan Against Property (LAP)'
    ],
    faqs: [
      {
        q: 'How is Muthoot Homefin different from a bank or large HFC?',
        a: 'Muthoot Homefin is a small but focused affordable-housing HFC under Muthoot Finance (a 130-year-old AA-rated gold-loan NBFC). It targets self-employed informal-sector borrowers in South India and select Hindi-belt states with ticket sizes of ₹5-20 lakh, a segment banks and large HFCs cannot economically reach. Gold-loan customer cross-sell and brand familiarity in South India are its core distribution edge.'
      },
      {
        q: 'Who is the ideal Muthoot Homefin borrower?',
        a: 'Existing Muthoot Finance gold-loan customers and other self-employed informal-sector households in Kerala, Tamil Nadu, Maharashtra, and Gujarat, seeking ticket sizes of ₹5-20 lakh and comfortable with the Muthoot brand. First-time home buyers without formal credit bureau history are a key segment.'
      },
      {
        q: 'Is Muthoot Homefin safe given its small size?',
        a: 'Muthoot Homefin is wholly owned by Muthoot Finance Limited, a BSE/NSE-listed and AA-/AA+ rated NBFC with one of the longest credit track records in Indian financial services (130+ years across the Muthoot group). The HFC carries A+/AA- credit ratings, is regulated by RBI/NHB, and benefits from parent-group liquidity. Home loans are fully secured by property mortgage.'
      }
    ],
    metaKeywords: ['Muthoot Homefin EMI calculator', 'Muthoot home loan rate 2026', 'gold loan customer home loan', 'Muthoot affordable housing'],
  },
  {
    slug: 'iifl-home',
    bankName: 'IIFL Home Loans',
    fullName: 'IIFL Home Finance Limited',
    emoji: '🏘️',
    hqLocation: 'Gurugram, Haryana',
    homeLoanRate: { min: 9.50, max: 14.50, typical: 10.50 },
    personalLoanRate: { min: 12.0, max: 18.0, typical: 13.5 },
    carLoanRate: { min: 9.5, max: 13.0, typical: 10.5 },
    processingFee: '0.5-1.5% of loan amount (min ₹5,000) for home loans. Affordable Swaraj loans and LAP can attract 1.5-2.5%.',
    prepaymentPolicy: 'Zero foreclosure on floating-rate individual home loans (RBI mandated). 2-4% on fixed-rate and corporate loans.',
    marketContext: 'IIFL Home Finance, a subsidiary of IIFL Finance Limited (part of the IIFL Group founded by Nirmal Jain), is one of India\'s leading mid-sized HFCs with an AUM of approximately ₹35,000 crore as of FY26. The company operates through 380+ branches and serves a hybrid mix of mass-affluent home loans (₹25 lakh-₹2 crore tickets) in metros and Tier-1 cities, plus an affordable-housing vertical called Swaraj that targets self-employed informal-sector borrowers with ticket sizes of ₹8-15 lakh. IIFL Home Finance is held majority by IIFL Finance with strategic investment from Abu Dhabi Investment Authority (ADIA), and carries AA ratings.',
    uniqueAngle: 'IIFL Home Finance operates a unique two-vertical model, a mainstream mass-affluent home-loan book competing with banks on prime borrowers, plus the Swaraj affordable-housing vertical for informal-sector self-employed borrowers, giving it scale economies that pure affordable HFCs lack.',
    productHighlights: [
      'IIFL Home Loan (Salaried/Self-Employed Mass-Affluent)',
      'IIFL Swaraj Affordable Home Loan',
      'Loan Against Property (LAP)',
      'Home Loan Balance Transfer with Top-Up',
      'Plot Loan + Construction Loan'
    ],
    faqs: [
      {
        q: 'How is IIFL Home Finance different from a commercial bank?',
        a: 'IIFL Home Finance is a dedicated HFC regulated by RBI/NHB. It competes with banks on mass-affluent home loans (₹25 lakh-₹2 crore) but also serves affordable-housing borrowers via its Swaraj vertical (₹8-15 lakh tickets), a segment banks cannot economically underwrite. Sanction TAT is typically faster than banks, and informal-income underwriting is more flexible. Rates are 50-100 bps above SBI/HDFC Bank on prime profiles.'
      },
      {
        q: 'Who is the ideal IIFL Home Finance borrower?',
        a: 'Two distinct profiles: (a) mass-affluent salaried and self-employed borrowers in metros and Tier-1 cities seeking ₹25 lakh-₹2 crore home loans with faster sanction than banks, and (b) Swaraj vertical, self-employed informal-sector borrowers in Tier-2/Tier-3 towns seeking ₹5-20 lakh affordable home loans.'
      },
      {
        q: 'Is IIFL Home Finance safe and well-rated?',
        a: 'Yes. IIFL Home Finance carries AA ratings from CRISIL, ICRA, and CARE. It is majority-owned by IIFL Finance Limited (BSE/NSE listed) with a significant strategic stake held by Abu Dhabi Investment Authority (ADIA), one of the world\'s largest sovereign wealth funds. The HFC is regulated by RBI/NHB, maintains GNPA below 2%, and has consistently raised debt via NCDs, NHB refinance, and bank lines.'
      }
    ],
    metaKeywords: ['IIFL Home Finance EMI calculator', 'IIFL home loan rate 2026', 'IIFL Swaraj affordable home loan', 'IIFL Home Finance ADIA'],
  },
  {
    slug: 'edelweiss-housing',
    bankName: 'Edelweiss Housing Finance',
    fullName: 'Edelweiss Housing Finance Limited',
    emoji: '🏘️',
    hqLocation: 'Mumbai, Maharashtra',
    homeLoanRate: { min: 10.25, max: 15.00, typical: 11.50 },
    personalLoanRate: { min: 12.0, max: 18.0, typical: 13.5 },
    carLoanRate: { min: 9.5, max: 13.0, typical: 10.5 },
    processingFee: '1.0-2.0% of loan amount (min ₹5,000) for home loans. LAP attracts 1.5-2.5%.',
    prepaymentPolicy: 'Zero foreclosure on floating-rate individual home loans (RBI mandated). 2-4% on fixed-rate and non-individual loans.',
    marketContext: 'Edelweiss Housing Finance, incorporated in 2008, is a subsidiary of Nuvama Wealth Management and the broader Edelweiss group founded by Rashesh Shah. Following the Edelweiss group\'s post-2019 strategic restructuring (which included demergers of asset management, wealth management, and life insurance businesses), Edelweiss Housing Finance has been deliberately operating as a smaller, more focused HFC with an AUM of approximately ₹3,000 crore. The company focuses on mass-affluent self-employed and salaried borrowers in metros and Tier-1 cities, with average ticket sizes of ₹30-50 lakh, and carries A+/AA- ratings.',
    uniqueAngle: 'Edelweiss Housing Finance is a deliberately small, prime-borrower-focused HFC post the Edelweiss group restructuring, with a niche in self-employed mass-affluent borrowers in Mumbai, Delhi-NCR, Bengaluru, and Pune who value relationship-based underwriting over price.',
    productHighlights: [
      'Edelweiss Home Loan (Salaried/Self-Employed)',
      'Loan Against Property (LAP)',
      'Home Loan Balance Transfer with Top-Up',
      'NRI Home Loan',
      'Plot + Construction Composite Loan'
    ],
    faqs: [
      {
        q: 'How is Edelweiss Housing Finance different from a bank home loan?',
        a: 'Edelweiss Housing Finance is a focused, mid-sized HFC regulated by RBI/NHB that emphasises relationship-driven underwriting for mass-affluent self-employed borrowers in metros. Unlike banks, it can flex on documentation, accept varied income structures (LLP, partnership, professional practice), and offer faster sanctions for ₹30 lakh-₹2 crore tickets. Rates are typically 75-150 bps above SBI/HDFC Bank on equivalent profiles.'
      },
      {
        q: 'Who should choose Edelweiss Housing Finance?',
        a: 'Mass-affluent self-employed professionals (doctors, CAs, lawyers, consultants), business owners, and salaried professionals in Mumbai, Delhi-NCR, Bengaluru, and Pune seeking ₹30 lakh-₹2 crore home loans, who value relationship-based service and faster sanctions over the absolute lowest rate.'
      },
      {
        q: 'Is Edelweiss Housing Finance safe given the Edelweiss group restructuring?',
        a: 'Edelweiss Housing Finance carries A+/AA- ratings and remained well-capitalized through the broader Edelweiss group\'s 2019-2023 strategic restructuring (which was a deliberate demerger of businesses, not a distress event). It is regulated by RBI/NHB, GNPA is maintained below 3%, and home loan customer security is fully backed by property mortgage. Borrowers seeking the highest possible HFC credit rating should compare against AAA-rated peers (Bajaj Housing, LIC Housing).'
      }
    ],
    metaKeywords: ['Edelweiss Housing Finance EMI calculator', 'Edelweiss home loan rate 2026', 'self-employed mass affluent home loan', 'Edelweiss HFC'],
  },
  {
    slug: 'mahindra-rural-housing',
    bankName: 'Mahindra Rural Housing Finance',
    fullName: 'Mahindra Rural Housing Finance Limited',
    emoji: '🏘️',
    hqLocation: 'Mumbai, Maharashtra',
    homeLoanRate: { min: 11.50, max: 18.00, typical: 13.00 },
    personalLoanRate: { min: 12.0, max: 18.0, typical: 13.5 },
    carLoanRate: { min: 9.5, max: 13.0, typical: 10.5 },
    processingFee: '1.5-2.5% of loan amount (min ₹2,500) for rural home loans. Generally higher for first-cycle informal borrowers.',
    prepaymentPolicy: 'Zero foreclosure on floating-rate individual home loans (RBI mandated). 4% on fixed-rate loans prepaid from non-own-source funds.',
    marketContext: 'Mahindra Rural Housing Finance, incorporated in 2007, is a subsidiary of Mahindra & Mahindra Financial Services Limited (Mahindra Finance), itself part of the Mahindra Group founded by the Mahindra family. The company has an AUM of approximately ₹13,000 crore and is India\'s largest rural-focused HFC, operating through Mahindra Finance\'s 1,300+ branch network across deep rural India. The borrower mix is dominated by self-employed informal-sector rural households, small farmers, dairy owners, kirana shop owners, tractor-finance customers cross-sold home loans, with average ticket sizes of ₹3-7 lakh.',
    uniqueAngle: 'Mahindra Rural Housing Finance is the only large HFC purpose-built for deep rural India, leveraging Mahindra Finance\'s 1,300+ branch tractor and SUV finance network to underwrite home loans for rural households with no formal income documents and average tickets as small as ₹3-5 lakh.',
    productHighlights: [
      'Rural Home Loan (Self-Construction)',
      'Rural Home Improvement Loan',
      'Rural Home Extension Loan',
      'Plot Purchase Loan',
      'Loan Against Property (LAP) - Rural'
    ],
    faqs: [
      {
        q: 'How is Mahindra Rural Housing Finance different from a bank home loan?',
        a: 'MRHFL is purpose-built for rural India, borrowers who live in villages and small towns, have informal cash income, no ITR or payslip, and need ₹3-10 lakh ticket sizes for self-construction or home improvement on inherited land. Banks cannot economically underwrite this segment. MRHFL uses field-based personal discussion, agricultural-cash-flow assessment, neighbour and panchayat-level reference checks, and tractor-finance repayment history (via Mahindra Finance) as alternate credit data. Rates are 400-700 bps above bank rates to reflect rural credit and operational cost.'
      },
      {
        q: 'Who is the ideal Mahindra Rural Housing borrower?',
        a: 'Rural Indian households, small and marginal farmers, dairy and livestock owners, village shopkeepers, small contractors, with monthly incomes of ₹8,000-30,000 (often seasonal), inherited or self-owned village land, and a need for ₹3-10 lakh for new construction, home extension, or improvement. Many are existing Mahindra tractor or SUV finance customers cross-sold home loans.'
      },
      {
        q: 'Is Mahindra Rural Housing Finance safe and credit-rated?',
        a: 'Yes. Mahindra Rural Housing Finance is a subsidiary of Mahindra Finance (BSE/NSE listed, AAA-rated by India Ratings and CRISIL on long-term debt) and part of the Mahindra Group. MRHFL itself carries AA+/AAA-equivalent ratings via parent support. It is regulated by RBI/NHB, has consistently received NHB refinance, and operates with adequate capital. GNPA tends to be higher than urban HFCs (4-6%) due to rural seasonality but is well-provisioned.'
      }
    ],
    metaKeywords: ['Mahindra Rural Housing EMI calculator', 'rural home loan rate 2026', 'MRHFL village home loan', 'Mahindra Finance home loan'],
  },
  {
    slug: 'reliance-home',
    bankName: 'Reliance Home Finance',
    fullName: 'Reliance Home Finance Limited (under Authum Investment)',
    emoji: '🏘️',
    hqLocation: 'Mumbai, Maharashtra',
    homeLoanRate: { min: 11.00, max: 16.00, typical: 13.00 },
    personalLoanRate: { min: 12.0, max: 18.0, typical: 13.5 },
    carLoanRate: { min: 9.5, max: 13.0, typical: 10.5 },
    processingFee: 'Variable, generally 1-2% of loan amount for restructured/legacy book servicing. New lending is minimal as of 2026.',
    prepaymentPolicy: 'Zero foreclosure on floating-rate individual home loans (RBI mandated) for existing legacy customers. Fixed-rate loans subject to original sanction terms.',
    marketContext: 'Reliance Home Finance, incorporated in 2008 as part of the erstwhile Anil Ambani-led Reliance Capital group, faced severe financial stress from 2019 onwards along with the broader Reliance Capital insolvency. After a multi-year resolution process under the RBI-supervised IBC framework, Reliance Capital and its subsidiaries (including Reliance Home Finance) were acquired by Authum Investment & Infrastructure Limited in 2024 as part of a comprehensive resolution plan. The legacy home loan book has been significantly written down and restructured, with new lending currently minimal as the resolved entity focuses on legacy-book recovery and management transition. Borrowers should treat this entity with caution and verify the status of any new lending offerings.',
    uniqueAngle: 'Reliance Home Finance is a post-resolution HFC under new ownership (Authum Investment) following the Anil Ambani-led Reliance Capital insolvency. New lending is minimal as of 2026, the entity primarily services its legacy restructured book. Borrowers seeking fresh home loans should evaluate other HFCs first.',
    productHighlights: [
      'Legacy Home Loan Servicing (existing customers)',
      'Restructured Loan Account Management',
      'Loan Against Property (legacy book)',
      'Construction Finance (legacy)',
      'NRI Home Loan (legacy)'
    ],
    faqs: [
      {
        q: 'Is Reliance Home Finance still operational in 2026?',
        a: 'Reliance Home Finance is now under the ownership of Authum Investment & Infrastructure Limited following the 2024 conclusion of the IBC resolution process for the erstwhile Anil Ambani-led Reliance Capital group. The entity primarily services its legacy restructured loan book, new home loan lending is minimal as of 2026 while the resolved entity focuses on recovery and operational transition. Borrowers seeking fresh home loans should approach mainstream HFCs or banks instead.'
      },
      {
        q: 'I am an existing Reliance Home Finance borrower: what should I do?',
        a: 'Existing borrowers continue to make EMI payments on the original loan terms (or post-restructuring revised terms) through the resolved entity now controlled by Authum Investment. Property mortgage and loan documentation remain legally valid. Borrowers eligible for floating-rate prepayment can foreclose without penalty per RBI mandate. Many existing borrowers are also choosing to balance-transfer to mainstream HFCs/banks for better service and rates.'
      },
      {
        q: 'How does Reliance Home Finance compare to other HFCs today?',
        a: 'Reliance Home Finance today is a resolution-phase entity and is not actively competing for new home loan business at scale. Borrowers seeking fresh home loans in 2026 are far better served by mainstream HFCs (LIC Housing, Bajaj Housing, Tata Capital Housing, PNB Housing) or banks (SBI, HDFC Bank, ICICI). The legacy Reliance Home Finance situation is a useful reminder to evaluate HFC credit ratings and promoter quality before borrowing.'
      }
    ],
    metaKeywords: ['Reliance Home Finance EMI calculator', 'Reliance Home Finance Authum 2026', 'RHFL legacy home loan', 'Reliance Home Finance resolution'],
  },
  {
    slug: 'tata-capital-housing',
    bankName: 'Tata Capital Housing Finance',
    fullName: 'Tata Capital Housing Finance Limited',
    emoji: '🏘️',
    hqLocation: 'Mumbai, Maharashtra',
    homeLoanRate: { min: 8.50, max: 13.50, typical: 8.95 },
    personalLoanRate: { min: 12.0, max: 18.0, typical: 13.5 },
    carLoanRate: { min: 9.5, max: 13.0, typical: 10.5 },
    processingFee: '0.25-1.0% of loan amount (min ₹5,000) for home loans. Festive waivers common for prime salaried profiles.',
    prepaymentPolicy: 'Zero foreclosure charges on floating-rate individual home loans (RBI mandated). 2-4% on fixed-rate home loans, LAP, and corporate loans.',
    marketContext: 'Tata Capital Housing Finance, incorporated in 2008, is a wholly-owned housing-finance subsidiary of Tata Capital Limited, the financial services arm of the Tata Group founded under Tata Sons. The company has an AUM of approximately ₹40,000 crore as of FY26 and is one of the largest mass-affluent HFCs in India, focused on prime salaried and self-employed borrowers in metros and Tier-1 cities. Tata Capital Housing Finance is rated AAA by CRISIL, ICRA, and CARE on the strength of the Tata Group parentage and conservative underwriting. Tata Capital itself is preparing for a much-anticipated IPO in 2025-2026 (post the RBI Upper-Layer NBFC mandate), which will further strengthen its parent capital base.',
    uniqueAngle: 'Tata Capital Housing Finance combines AAA ratings, Tata Group parentage (one of India\'s most trusted business houses), and prime-borrower-focused underwriting to offer rates that match or beat large private banks, with an upcoming Tata Capital IPO further strengthening institutional comfort.',
    productHighlights: [
      'Tata Capital Home Loan (Salaried/Self-Employed)',
      'Home Loan Balance Transfer with Top-Up',
      'Loan Against Property (LAP)',
      'Plot Loan + Construction Loan',
      'NRI Home Loan'
    ],
    faqs: [
      {
        q: 'How is Tata Capital Housing Finance different from a commercial bank?',
        a: 'Tata Capital Housing Finance is a dedicated AAA-rated HFC regulated by RBI/NHB, fully owned by Tata Capital (the financial services arm of the Tata Group). Unlike banks, it specializes only in housing finance and LAP, no savings accounts, credit cards, or other products, but offers prime-borrower rates that match or beat the largest private banks. The Tata Group parentage provides institutional trust, and underwriting flexibility on self-employed mass-affluent borrowers is often better than banks.'
      },
      {
        q: 'Who is the ideal Tata Capital Housing Finance borrower?',
        a: 'Prime salaried professionals at top corporates (CIBIL 750+) and self-employed mass-affluent borrowers (doctors, CAs, lawyers, business owners) in metros and Tier-1 cities, seeking ₹30 lakh-₹5 crore home loans. Borrowers who value the Tata brand for the largest financial commitment of their lives, alongside competitive pricing, are a natural fit.'
      },
      {
        q: 'Is Tata Capital Housing Finance safe and well-rated?',
        a: 'Yes. Tata Capital Housing Finance carries AAA ratings from CRISIL, ICRA, and CARE, the highest possible. It is wholly owned by Tata Capital Limited (in turn owned by Tata Sons), and the broader Tata Group is one of the most trusted business houses in India with 155+ years of history. Tata Capital is also classified as an RBI Upper-Layer NBFC, requires a mandatory listing, and is preparing for a 2025-2026 IPO that will further strengthen its capital base.'
      }
    ],
    metaKeywords: ['Tata Capital Housing Finance EMI calculator', 'Tata home loan rate 2026', 'TCHFL home loan eligibility', 'Tata Capital IPO HFC'],
  },
  {
    slug: 'bajaj-housing-finance',
    bankName: 'Bajaj Housing Finance',
    fullName: 'Bajaj Housing Finance Limited',
    emoji: '🏘️',
    hqLocation: 'Pune, Maharashtra',
    homeLoanRate: { min: 8.50, max: 12.50, typical: 9.40 },
    personalLoanRate: { min: 11.00, max: 24.00, typical: 14.50 },
    carLoanRate: { min: 9.50, max: 15.00, typical: 11.25 },
    processingFee: "0.5% of loan amount (capped at Rs. 25000)",
    prepaymentPolicy: "Zero foreclosure charges on floating-rate home loans per RBI guidelines. 2-5% charges on fixed-rate, vehicle, and personal loans in early tenure, reducing over time.",
    marketContext: 'Bajaj Housing Finance is the dedicated mortgage arm of the Bajaj Finserv group, and its September 2024 IPO became one of India\'s most oversubscribed listings of the year. The HFC offers some of the most competitive home loan rates in the market (starting near SBI levels), digital-first processing, and aggressive top-up loans. It targets prime salaried customers, self-employed professionals, and high-ticket borrowers in metro markets.',
    uniqueAngle: 'Bajaj Housing Finance is the dedicated mortgage arm of the Bajaj Finserv group, and its September 2024 IPO became one of India\'s most oversubscribed listings of the year. The HFC offers some of the most competitive home loan rates in the market (starting near SBI levels), digital-first processing, and aggressive top-up loans. It targets prime salaried customers, self-employed professionals, and high-ticket borrowers in metro markets.',
    productHighlights: ['salaried professionals', 'self-employed professionals', 'high-ticket home loans', 'balance transfer customers'],
    faqs: [
      { q: 'Who should apply for a Bajaj Housing Finance home loan?', a: 'Bajaj Housing Finance is best suited for salaried professionals at MNCs/listed companies and self-employed professionals (doctors, CAs, architects) with a credit score above 750 looking for loans above Rs. 30 lakh. Their digital process and competitive rates often match or beat large PSU banks.' },
      { q: 'How does Bajaj Housing Finance compare to HDFC/SBI?', a: 'Bajaj Housing typically offers rates within 10-25 basis points of SBI/HDFC for prime customers, with faster digital approvals (often 3-5 days vs 7-10 days) but slightly higher processing fees. For balance transfers, Bajaj is often more aggressive on rate negotiation.' },
      { q: 'What is the eligibility criteria for Bajaj Housing Finance?', a: 'Salaried applicants need minimum age 23, monthly income Rs. 30,000+, and 3 years of work experience. Self-employed need 5 years business vintage and ITRs. CIBIL score of 725+ is preferred for best rates. Maximum loan tenure is 32 years.' },
      { q: 'What is Bajaj Housing Finance prepayment policy?', a: 'For floating rate home loans, there are zero prepayment and foreclosure charges as per RBI guidelines. Fixed rate loans attract 2-4% foreclosure charges. Partial prepayments can be made anytime through the app without penalty.' },
    ],
    metaKeywords: ['bajaj housing finance home loan', 'bajaj housing emi calculator', 'bajaj housing rate 2026', 'bajaj housing IPO', 'bajaj housing finance eligibility'],
  },
  {
    slug: 'shriram-finance',
    bankName: 'Shriram Finance',
    fullName: 'Shriram Finance Limited',
    emoji: '🚛',
    hqLocation: 'Chennai, Tamil Nadu',
    homeLoanRate: { min: 11.00, max: 16.50, typical: 13.00 },
    personalLoanRate: { min: 12.00, max: 26.00, typical: 16.00 },
    carLoanRate: { min: 9.50, max: 18.00, typical: 12.50 },
    processingFee: "2.0% of loan amount (capped at Rs. 35000)",
    prepaymentPolicy: "Zero foreclosure charges on floating-rate home loans per RBI guidelines. 2-5% charges on fixed-rate, vehicle, and personal loans in early tenure, reducing over time.",
    marketContext: 'Shriram Finance was formed by the 2022 merger of Shriram Transport Finance and Shriram City Union Finance, creating India\'s largest retail NBFC with AUM exceeding Rs. 2.3 lakh crore. It dominates the used commercial vehicle, two-wheeler, and self-employed segment in semi-urban and rural India. Its risk-based pricing serves customers who often struggle to get loans from traditional banks.',
    uniqueAngle: 'Shriram Finance was formed by the 2022 merger of Shriram Transport Finance and Shriram City Union Finance, creating India\'s largest retail NBFC with AUM exceeding Rs. 2.3 lakh crore. It dominates the used commercial vehicle, two-wheeler, and self-employed segment in semi-urban and rural India. Its risk-based pricing serves customers who often struggle to get loans from traditional banks.',
    productHighlights: ['used commercial vehicle owners', 'small business owners', 'self-employed in tier-2/3 cities', 'two-wheeler buyers'],
    faqs: [
      { q: 'Who should apply for a Shriram Finance loan?', a: 'Shriram Finance is ideal for self-employed individuals, small fleet operators, used vehicle buyers, and customers in tier-2/3 cities who lack formal income documentation. Their underwriting evaluates cash flows over credit scores, making them accessible to first-time borrowers.' },
      { q: 'How does Shriram Finance differ from banks?', a: 'Unlike banks, Shriram specializes in informal-sector lending with relationship-based underwriting. Rates are 200-400 basis points higher than banks but approval is far easier for self-employed without GST/ITR. They lead the used CV financing market with 25%+ share.' },
      { q: 'What is the eligibility for Shriram Finance home and vehicle loans?', a: 'For vehicle loans, age 21-65, minimum 2 years stable income, and valid driving license/RC are required. For home loans, salaried need Rs. 25,000+ monthly income, self-employed need 3 years business vintage. CIBIL above 650 is preferred but cash-flow-based approvals exist.' },
      { q: 'What is the processing time at Shriram Finance?', a: 'Vehicle loans are typically disbursed in 24-48 hours after document submission at branch. Home loans take 5-10 working days. Field officers visit applicants for in-person verification, especially in rural and semi-urban locations.' },
    ],
    metaKeywords: ['shriram finance loan', 'shriram emi calculator', 'shriram commercial vehicle loan', 'shriram finance rate 2026', 'shriram two wheeler loan'],
  },
  {
    slug: 'cholamandalam',
    bankName: 'Cholamandalam',
    fullName: 'Cholamandalam Investment and Finance Company Limited',
    emoji: '🏦',
    hqLocation: 'Chennai, Tamil Nadu',
    homeLoanRate: { min: 9.50, max: 14.50, typical: 11.50 },
    personalLoanRate: { min: 12.50, max: 24.00, typical: 15.50 },
    carLoanRate: { min: 9.00, max: 16.00, typical: 11.50 },
    processingFee: "1.5% of loan amount (capped at Rs. 30000)",
    prepaymentPolicy: "Zero foreclosure charges on floating-rate home loans per RBI guidelines. 2-5% charges on fixed-rate, vehicle, and personal loans in early tenure, reducing over time.",
    marketContext: 'Cholamandalam Investment and Finance (Chola) is the financial services flagship of the Murugappa Group, with AUM crossing Rs. 1.5 lakh crore in FY24. It has expanded aggressively from its core vehicle finance business into home loans, LAP, SME loans, and consumer loans. Chola is known for strong asset quality and tier-2/3 city penetration.',
    uniqueAngle: 'Cholamandalam Investment and Finance (Chola) is the financial services flagship of the Murugappa Group, with AUM crossing Rs. 1.5 lakh crore in FY24. It has expanded aggressively from its core vehicle finance business into home loans, LAP, SME loans, and consumer loans. Chola is known for strong asset quality and tier-2/3 city penetration.',
    productHighlights: ['vehicle finance customers', 'self-employed', 'LAP borrowers', 'SME owners'],
    faqs: [
      { q: 'Who should apply for a Cholamandalam loan?', a: 'Chola is best for self-employed individuals, small business owners, and vehicle buyers in tier-2/3 cities. Their underwriting is more flexible than banks for non-ITR customers, and they offer competitive rates for used vehicle and LAP segments.' },
      { q: 'How does Cholamandalam compare to banks?', a: 'Chola charges 100-250 basis points higher than top banks but offers faster approval (3-5 days vs 7-10 days) and accepts informal income proofs. Their vehicle finance arm is among India\'s top 3, with strong dealer relationships ensuring quick disbursal.' },
      { q: 'What is the eligibility for Cholamandalam loans?', a: 'Minimum age 21, maximum 65 at loan maturity. Salaried need Rs. 25,000+ monthly income; self-employed need 2-3 years business vintage. CIBIL above 700 preferred. For home loans, property documents and 20% down payment are mandatory.' },
      { q: 'What is Chola\'s prepayment policy?', a: 'Floating rate home loans have zero prepayment charges as per RBI rules. Vehicle and personal loans attract 3-5% foreclosure charges in the first 12 months, reducing thereafter. Partial prepayments allowed without penalty after 6 EMIs.' },
    ],
    metaKeywords: ['cholamandalam loan', 'chola finance emi calculator', 'chola home loan rate', 'cholamandalam vehicle loan', 'chola murugappa loan'],
  },
  {
    slug: 'mahindra-finance',
    bankName: 'Mahindra Finance',
    fullName: 'Mahindra & Mahindra Financial Services Limited',
    emoji: '🚜',
    hqLocation: 'Mumbai, Maharashtra',
    homeLoanRate: { min: 10.50, max: 15.50, typical: 12.50 },
    personalLoanRate: { min: 13.00, max: 24.00, typical: 16.50 },
    carLoanRate: { min: 9.25, max: 16.00, typical: 11.75 },
    processingFee: "1.5% of loan amount (capped at Rs. 30000)",
    prepaymentPolicy: "Zero foreclosure charges on floating-rate home loans per RBI guidelines. 2-5% charges on fixed-rate, vehicle, and personal loans in early tenure, reducing over time.",
    marketContext: 'Mahindra & Mahindra Financial Services is the rural NBFC arm of the Mahindra Group, with the deepest village-level reach among Indian financiers, present in over 3.85 lakh villages. It dominates tractor and farm equipment financing alongside auto, UV, and SME loans. The company is pivoting to digital-led underwriting under its "Transformation 2025" strategy.',
    uniqueAngle: 'Mahindra & Mahindra Financial Services is the rural NBFC arm of the Mahindra Group, with the deepest village-level reach among Indian financiers, present in over 3.85 lakh villages. It dominates tractor and farm equipment financing alongside auto, UV, and SME loans. The company is pivoting to digital-led underwriting under its "Transformation 2025" strategy.',
    productHighlights: ['rural and semi-urban customers', 'farmers and tractor buyers', 'UV/SUV buyers', 'small business owners'],
    faqs: [
      { q: 'Who should apply for a Mahindra Finance loan?', a: 'Mahindra Finance is the leading lender for rural and semi-urban customers, especially farmers buying tractors, families buying SUVs/UVs (Bolero, Scorpio, Thar), and small business owners. They serve customers without formal income documentation through cash-flow-based underwriting.' },
      { q: 'How does Mahindra Finance compare to banks?', a: 'Rates are 150-350 basis points higher than banks, but Mahindra Finance offers unmatched rural reach, with field officers in remote talukas. They are often the only formal lender in villages where banks have no presence, with door-step service and flexible repayment matched to harvest cycles.' },
      { q: 'What is the eligibility for Mahindra Finance loans?', a: 'Age 21-65, minimum income varies by product (tractor loans accept agricultural income with land records). Salaried need Rs. 20,000+ monthly. CIBIL above 650 preferred but first-time borrowers without credit history are also financed based on local references and assets.' },
      { q: 'What is the processing time at Mahindra Finance?', a: 'Tractor and vehicle loans typically disbursed in 24-72 hours after field verification. SME and home loans take 5-10 days. Most processing happens at branch level with quick local approval authority for amounts under Rs. 25 lakh.' },
    ],
    metaKeywords: ['mahindra finance loan', 'mahindra finance emi calculator', 'mahindra tractor loan', 'mahindra rural loan', 'mahindra finance rate 2026'],
  },
  {
    slug: 'muthoot-finance',
    bankName: 'Muthoot Finance',
    fullName: 'Muthoot Finance Limited',
    emoji: '💰',
    hqLocation: 'Kochi, Kerala',
    homeLoanRate: { min: 11.00, max: 16.00, typical: 13.00 },
    personalLoanRate: { min: 14.00, max: 26.00, typical: 18.00 },
    carLoanRate: { min: 11.00, max: 18.00, typical: 13.50 },
    processingFee: "1.0% of loan amount (capped at Rs. 15000)",
    prepaymentPolicy: "Zero foreclosure charges on floating-rate home loans per RBI guidelines. 2-5% charges on fixed-rate, vehicle, and personal loans in early tenure, reducing over time.",
    marketContext: 'Muthoot Finance is India\'s largest gold loan NBFC with AUM exceeding Rs. 75,000 crore and the most extensive branch network among gold financiers. Beyond gold loans, it has diversified into housing finance (via Muthoot Homefin), microfinance (Belstar), and personal loans. It serves customers who need fast liquidity against gold ornaments.',
    uniqueAngle: 'Muthoot Finance is India\'s largest gold loan NBFC with AUM exceeding Rs. 75,000 crore and the most extensive branch network among gold financiers. Beyond gold loans, it has diversified into housing finance (via Muthoot Homefin), microfinance (Belstar), and personal loans. It serves customers who need fast liquidity against gold ornaments.',
    productHighlights: ['gold loan borrowers', 'small business owners needing fast cash', 'self-employed', 'first-time borrowers'],
    faqs: [
      { q: 'Who should apply for a Muthoot Finance loan?', a: 'Muthoot Finance is best for anyone needing fast, collateralized cash through gold loans (disbursed in 30 minutes), small business owners with cash-flow needs, and customers in tier-2/3 cities. For home loans, it serves the affordable housing segment via Muthoot Homefin.' },
      { q: 'How does Muthoot compare to banks for gold loans?', a: 'Muthoot offers higher loan-to-value (up to 75% per RBI cap) and disbursal in 30 minutes versus 1-2 days at banks. Rates are similar to bank gold loans (around 9-24% depending on scheme) but with stronger evening/weekend availability and no income proof needed.' },
      { q: 'What is the eligibility for Muthoot loans?', a: 'For gold loans, only ID proof and gold ornaments needed - no income proof, no credit score check. For home loans, age 21-60, minimum Rs. 15,000 monthly income, and standard property documents. Self-employed accepted with bank statements or business proofs.' },
      { q: 'What happens if I cannot repay a Muthoot gold loan?', a: 'Muthoot sends multiple reminders and offers tenure extension or interest payment options before any auction. As per RBI norms, gold can only be auctioned after 90+ days of default with proper notices. Customers can repossess pledged gold by paying outstanding dues anytime before auction.' },
    ],
    metaKeywords: ['muthoot finance loan', 'muthoot gold loan emi calculator', 'muthoot home loan rate', 'muthoot finance branch', 'muthoot gold loan 2026'],
  },
  {
    slug: 'manappuram',
    bankName: 'Manappuram Finance',
    fullName: 'Manappuram Finance Limited',
    emoji: '🪙',
    hqLocation: 'Thrissur, Kerala',
    homeLoanRate: { min: 11.50, max: 16.50, typical: 13.50 },
    personalLoanRate: { min: 14.00, max: 26.00, typical: 18.00 },
    carLoanRate: { min: 11.00, max: 18.00, typical: 13.75 },
    processingFee: "1.0% of loan amount (capped at Rs. 15000)",
    prepaymentPolicy: "Zero foreclosure charges on floating-rate home loans per RBI guidelines. 2-5% charges on fixed-rate, vehicle, and personal loans in early tenure, reducing over time.",
    marketContext: 'Manappuram Finance is India\'s second-largest gold loan NBFC after Muthoot, with diversified businesses spanning microfinance (Asirvad Microfinance), housing finance (Manappuram Home Finance), and vehicle loans. The Thrissur-headquartered NBFC has been pushing digital gold loans with online disbursal, doorstep gold pickup, and lower-LTV short-tenure schemes.',
    uniqueAngle: 'Manappuram Finance is India\'s second-largest gold loan NBFC after Muthoot, with diversified businesses spanning microfinance (Asirvad Microfinance), housing finance (Manappuram Home Finance), and vehicle loans. The Thrissur-headquartered NBFC has been pushing digital gold loans with online disbursal, doorstep gold pickup, and lower-LTV short-tenure schemes.',
    productHighlights: ['gold loan borrowers', 'micro-entrepreneurs', 'self-employed in tier-2/3 cities', 'small home loan borrowers'],
    faqs: [
      { q: 'Who should apply for a Manappuram loan?', a: 'Manappuram is ideal for customers needing quick gold loans (online or doorstep), micro-entrepreneurs (via Asirvad), and affordable housing borrowers in semi-urban areas. Their digital gold loan via app is convenient for repeat customers.' },
      { q: 'How does Manappuram compare to Muthoot?', a: 'Both are gold loan leaders with similar rates (9-24%) and 30-minute disbursal. Manappuram has stronger digital presence with online gold loan and doorstep pickup service, while Muthoot has larger physical branch network. Manappuram\'s diversification into microfinance is also more aggressive.' },
      { q: 'What is the eligibility for Manappuram loans?', a: 'Gold loans require only ID proof and gold (18-22 carat) - no income, no credit score. For home and vehicle loans, age 21-65, minimum Rs. 15,000 income, and standard documents. Microfinance loans (via Asirvad) target women in self-help groups.' },
      { q: 'What is Manappuram\'s processing time?', a: 'Gold loans are disbursed in under 30 minutes at branches and within 2 hours via online channel. Doorstep gold pickup adds 2-4 hours. Home and vehicle loans take 5-10 working days depending on documentation completeness.' },
    ],
    metaKeywords: ['manappuram gold loan', 'manappuram emi calculator', 'manappuram finance rate 2026', 'manappuram online gold loan', 'manappuram home loan'],
  },
  {
    slug: 'five-star-finance',
    bankName: 'Five Star Finance',
    fullName: 'Five Star Business Finance Limited',
    emoji: '⭐',
    hqLocation: 'Chennai, Tamil Nadu',
    homeLoanRate: { min: 16.00, max: 24.00, typical: 19.00 },
    personalLoanRate: { min: 16.00, max: 26.00, typical: 20.00 },
    carLoanRate: { min: 16.00, max: 24.00, typical: 19.00 },
    processingFee: "2.5% of loan amount (capped at Rs. 25000)",
    prepaymentPolicy: "Zero foreclosure charges on floating-rate home loans per RBI guidelines. 2-5% charges on fixed-rate, vehicle, and personal loans in early tenure, reducing over time.",
    marketContext: 'Five Star Business Finance is a niche NBFC that lends exclusively to small business owners and self-employed in tier-3/4 cities, with average ticket size of Rs. 3-5 lakh secured by self-occupied residential property. Post its 2022 IPO, it has scaled to AUM over Rs. 9,000 crore with industry-leading NIMs of 17%+, serving customers banks consider too small or informal.',
    uniqueAngle: 'Five Star Business Finance is a niche NBFC that lends exclusively to small business owners and self-employed in tier-3/4 cities, with average ticket size of Rs. 3-5 lakh secured by self-occupied residential property. Post its 2022 IPO, it has scaled to AUM over Rs. 9,000 crore with industry-leading NIMs of 17%+, serving customers banks consider too small or informal.',
    productHighlights: ['small business owners', 'self-employed in tier-3/4 cities', 'kirana store owners', 'micro-enterprise borrowers'],
    faqs: [
      { q: 'Who should apply for a Five Star Finance loan?', a: 'Five Star Finance is purpose-built for small business owners (kirana, dairy, vegetable vendors, small manufacturers) in tier-3/4 cities and semi-urban areas with annual turnover Rs. 5-50 lakh. They serve customers who lack formal documentation or credit history but own residential property.' },
      { q: 'How does Five Star compare to banks and large NBFCs?', a: 'Rates are significantly higher (16-24%) than banks (9-12%) and even big NBFCs (12-15%) because Five Star targets unbanked, informal-sector micro-enterprises that no traditional lender will serve. Their underwriting is based on physical site visit, cash flow assessment, and local references over CIBIL or ITRs.' },
      { q: 'What is the eligibility for Five Star Finance?', a: 'Age 25-65, minimum 3 years in same business, ownership of self-occupied residential property as collateral, and stable cash flows visible from physical verification. Loan amounts range Rs. 1-25 lakh against property value, with maximum LTV of 50%.' },
      { q: 'What is the processing time at Five Star Finance?', a: 'Loans typically take 7-15 working days due to mandatory physical site visit, property valuation, and reference checks. Each loan involves at least 2 branch officer visits to applicant\'s business and home before sanction.' },
    ],
    metaKeywords: ['five star business finance', 'five star finance emi calculator', 'five star NBFC small business loan', 'five star finance IPO', 'small business loan tier 3'],
  },
  {
    slug: 'ujjivan-sfb',
    bankName: 'Ujjivan SFB',
    fullName: 'Ujjivan Small Finance Bank Limited',
    emoji: '🌱',
    hqLocation: 'Bengaluru, Karnataka',
    homeLoanRate: { min: 10.00, max: 14.50, typical: 11.75 },
    personalLoanRate: { min: 14.00, max: 24.00, typical: 17.00 },
    carLoanRate: { min: 11.00, max: 16.00, typical: 13.00 },
    processingFee: "1.5% of loan amount (capped at Rs. 25000)",
    prepaymentPolicy: "Zero foreclosure charges on floating-rate home loans per RBI guidelines. 2-5% charges on fixed-rate, vehicle, and personal loans in early tenure, reducing over time.",
    marketContext: 'Ujjivan Small Finance Bank evolved from Ujjivan Financial Services microfinance NBFC, completing its reverse merger in 2024 to become a unified entity. With 80%+ of assets in microfinance, MSE, and affordable housing, it serves the financially underserved across 326 districts. Recent expansion into retail liabilities and gold loans is diversifying the asset book.',
    uniqueAngle: 'Ujjivan Small Finance Bank evolved from Ujjivan Financial Services microfinance NBFC, completing its reverse merger in 2024 to become a unified entity. With 80%+ of assets in microfinance, MSE, and affordable housing, it serves the financially underserved across 326 districts. Recent expansion into retail liabilities and gold loans is diversifying the asset book.',
    productHighlights: ['women micro-entrepreneurs', 'affordable housing borrowers', 'small business owners', 'rural and semi-urban savers'],
    faqs: [
      { q: 'Who should apply for an Ujjivan SFB loan?', a: 'Ujjivan SFB is best for women micro-entrepreneurs needing group or individual microfinance loans, affordable housing borrowers (loans Rs. 2-25 lakh), and MSE owners. It also accepts deposits with competitive FD rates (often 50-100 basis points higher than large banks).' },
      { q: 'How does Ujjivan SFB compare to traditional banks?', a: 'Ujjivan SFB targets customer segments banks ignore - microfinance, affordable housing, and rural MSEs. Home loan rates are 50-150 basis points higher than top banks but accessible to customers without formal income proof. Deposit rates are notably higher than large banks.' },
      { q: 'What is the eligibility at Ujjivan SFB?', a: 'For microfinance, women members of joint liability groups with stable cash flow. For home loans, age 21-65, minimum Rs. 15,000 monthly income, and 20% down payment. CIBIL above 650 preferred but first-time borrowers with stable income are also approved.' },
      { q: 'What is Ujjivan SFB\'s prepayment policy?', a: 'Floating rate home loans have zero prepayment charges per RBI norms. MSE and personal loans have 2-4% foreclosure charges in initial years. Microfinance loans (under JLG model) typically have no prepayment penalty due to short tenure (12-24 months).' },
    ],
    metaKeywords: ['ujjivan sfb loan', 'ujjivan small finance bank emi calculator', 'ujjivan microfinance loan', 'ujjivan home loan rate', 'ujjivan FD rate'],
  },
  {
    slug: 'equitas-sfb',
    bankName: 'Equitas SFB',
    fullName: 'Equitas Small Finance Bank Limited',
    emoji: '⚖️',
    hqLocation: 'Chennai, Tamil Nadu',
    homeLoanRate: { min: 9.75, max: 14.00, typical: 11.50 },
    personalLoanRate: { min: 13.50, max: 24.00, typical: 16.50 },
    carLoanRate: { min: 10.50, max: 16.50, typical: 12.75 },
    processingFee: "1.5% of loan amount (capped at Rs. 25000)",
    prepaymentPolicy: "Zero foreclosure charges on floating-rate home loans per RBI guidelines. 2-5% charges on fixed-rate, vehicle, and personal loans in early tenure, reducing over time.",
    marketContext: 'Equitas Small Finance Bank completed its reverse merger with parent Equitas Holdings in 2023, simplifying its structure. It serves micro and small businesses, affordable housing borrowers, used commercial vehicle owners, and microfinance customers across 18 states. Equitas is known for its strong governance, technology adoption, and diversified loan book.',
    uniqueAngle: 'Equitas Small Finance Bank completed its reverse merger with parent Equitas Holdings in 2023, simplifying its structure. It serves micro and small businesses, affordable housing borrowers, used commercial vehicle owners, and microfinance customers across 18 states. Equitas is known for its strong governance, technology adoption, and diversified loan book.',
    productHighlights: ['used commercial vehicle buyers', 'affordable housing borrowers', 'small business owners', 'microfinance clients'],
    faqs: [
      { q: 'Who should apply for an Equitas SFB loan?', a: 'Equitas SFB is ideal for used commercial vehicle buyers (where they hold meaningful market share), small business owners needing working capital, affordable housing borrowers (Rs. 5-30 lakh range), and women microfinance customers. Deposit rates are also higher than large banks.' },
      { q: 'How does Equitas SFB compare to traditional banks?', a: 'Equitas serves segments large banks find too risky or small - used CV, micro-LAP, and affordable housing in tier-2/3 cities. Lending rates are 100-250 basis points higher than top banks but deposit rates are 50-150 basis points better, making it a good choice for both borrowers and savers.' },
      { q: 'What is the eligibility for Equitas SFB loans?', a: 'Age 21-65, minimum income varies by product. Used CV loans need valid commercial license and vehicle in operating condition. Home loans need 20% down payment and standard documents. Self-employed accepted with bank statements or business proofs for 2+ years.' },
      { q: 'What is Equitas SFB\'s processing time?', a: 'Vehicle and personal loans typically disbursed in 3-7 days. Home loans take 7-15 days due to property verification. Microfinance loans (group model) processed within 5 days of group formation and training completion.' },
    ],
    metaKeywords: ['equitas sfb loan', 'equitas small finance bank emi', 'equitas used CV loan', 'equitas home loan rate', 'equitas FD rate 2026'],
  },
  {
    slug: 'au-sfb',
    bankName: 'AU Small Finance Bank',
    fullName: 'AU Small Finance Bank Limited',
    emoji: '🏦',
    hqLocation: 'Jaipur, Rajasthan',
    homeLoanRate: { min: 9.00, max: 13.50, typical: 10.50 },
    personalLoanRate: { min: 12.50, max: 24.00, typical: 15.50 },
    carLoanRate: { min: 9.25, max: 15.50, typical: 11.25 },
    processingFee: "1.0% of loan amount (capped at Rs. 25000)",
    prepaymentPolicy: "Zero foreclosure charges on floating-rate home loans per RBI guidelines. 2-5% charges on fixed-rate, vehicle, and personal loans in early tenure, reducing over time.",
    marketContext: 'AU Small Finance Bank is India\'s largest SFB by AUM (over Rs. 1 lakh crore post-Fincare merger in 2024), evolving from a vehicle finance NBFC founded in 1996. With strong retail liabilities, credit cards (in partnership with networks), and a diversified asset book spanning vehicle, home, MSE, and gold loans, AU is increasingly positioned more like a universal bank than a typical SFB.',
    uniqueAngle: 'AU Small Finance Bank is India\'s largest SFB by AUM (over Rs. 1 lakh crore post-Fincare merger in 2024), evolving from a vehicle finance NBFC founded in 1996. With strong retail liabilities, credit cards (in partnership with networks), and a diversified asset book spanning vehicle, home, MSE, and gold loans, AU is increasingly positioned more like a universal bank than a typical SFB.',
    productHighlights: ['vehicle loan customers', 'home loan borrowers', 'MSE owners', 'savers seeking higher FD rates'],
    faqs: [
      { q: 'Who should apply for an AU Small Finance Bank loan?', a: 'AU SFB is suited for vehicle buyers (their legacy strength), affordable housing borrowers, MSE owners, and credit card users seeking competitive cashback. With the 2024 Fincare merger, microfinance and gold loans are now also strong offerings. Savers benefit from FD rates 50-100 bps higher than large banks.' },
      { q: 'How does AU SFB compare to large private banks?', a: 'AU SFB rates are now within 25-75 basis points of HDFC/ICICI for prime customers, while offering higher savings and FD rates. Its credit card portfolio and digital banking are competitive. The main difference is geographic concentration in Rajasthan, Gujarat, Maharashtra, and Madhya Pradesh.' },
      { q: 'What is the eligibility for AU SFB loans?', a: 'Age 21-65 (70 for some products), minimum Rs. 25,000 monthly income for salaried, 2-3 years business vintage for self-employed. CIBIL above 700 preferred for best rates. Loan-to-value capped at 80% for home loans, 85% for vehicle loans.' },
      { q: 'What is AU SFB\'s prepayment policy?', a: 'Floating rate home loans have zero prepayment charges as per RBI guidelines. Vehicle loans attract 4-5% foreclosure charges in the first year, reducing to 2% after 24 months. Personal loans have 4% foreclosure charges with no partial prepayment penalty after 6 EMIs.' },
    ],
    metaKeywords: ['au small finance bank loan', 'au sfb emi calculator', 'au bank home loan rate', 'au bank credit card', 'au sfb fincare merger'],
  },
  {
    slug: 'saraswat-bank',
    bankName: 'Saraswat Bank',
    fullName: 'Saraswat Co-operative Bank Limited',
    emoji: '🏛️',
    hqLocation: 'Mumbai, Maharashtra',
    homeLoanRate: { min: 8.60, max: 11.50, typical: 9.25 },
    personalLoanRate: { min: 11.50, max: 18.00, typical: 14.00 },
    carLoanRate: { min: 9.00, max: 13.50, typical: 10.50 },
    processingFee: "0.5% of loan amount (capped at Rs. 15000)",
    prepaymentPolicy: "Zero foreclosure charges on floating-rate home loans per RBI guidelines. 2-5% charges on fixed-rate, vehicle, and personal loans in early tenure, reducing over time.",
    marketContext: 'Saraswat Co-operative Bank is India\'s largest urban cooperative bank with over a century of operations and a balance sheet exceeding Rs. 80,000 crore. Regulated by both the RBI and the Maharashtra State Cooperative Societies Act, it serves members and customers primarily across Maharashtra, Goa, Gujarat, Karnataka, and Madhya Pradesh. Its home loan rates are competitive with PSU banks.',
    uniqueAngle: 'Saraswat Co-operative Bank is India\'s largest urban cooperative bank with over a century of operations and a balance sheet exceeding Rs. 80,000 crore. Regulated by both the RBI and the Maharashtra State Cooperative Societies Act, it serves members and customers primarily across Maharashtra, Goa, Gujarat, Karnataka, and Madhya Pradesh. Its home loan rates are competitive with PSU banks.',
    productHighlights: ['Maharashtra and Goa residents', 'home loan borrowers', 'salaried professionals', 'small business owners'],
    faqs: [
      { q: 'Who should apply for a Saraswat Bank loan?', a: 'Saraswat Bank is well-suited for residents of Maharashtra, Goa, Gujarat, Karnataka, and Madhya Pradesh seeking competitive home loans, vehicle loans, or business banking. Members benefit from preferential rates and dividends. Their long-standing local reputation is particularly valuable for property buyers in Mumbai-Pune corridor.' },
      { q: 'How does Saraswat Bank compare to nationalized banks?', a: 'Saraswat\'s home loan rates are typically within 10-25 basis points of SBI/BoB, while offering more personalized service due to smaller branch footprint. Deposits are insured up to Rs. 5 lakh per depositor under DICGC, same as commercial banks. They are regulated by RBI plus state cooperative law.' },
      { q: 'What is the eligibility for Saraswat Bank loans?', a: 'Age 21-65, minimum Rs. 25,000 monthly income for salaried, 3 years business vintage for self-employed. Property must be located in their service area (primarily Maharashtra, Goa, and adjoining states). CIBIL above 700 preferred. Becoming a nominal member is required for borrowers.' },
      { q: 'Is Saraswat Bank safe?', a: 'Yes, Saraswat Bank is one of India\'s strongest urban cooperative banks, rated AA+ by CRISIL, regulated by both RBI and the Maharashtra Cooperative Societies Act. Deposits are insured up to Rs. 5 lakh per depositor by DICGC. The bank has a 100+ year history with no payment defaults.' },
    ],
    metaKeywords: ['saraswat bank home loan', 'saraswat cooperative bank emi calculator', 'saraswat bank rate 2026', 'saraswat bank Mumbai', 'urban cooperative bank loan'],
  },
  {
    slug: 'cosmos-bank',
    bankName: 'Cosmos Bank',
    fullName: 'Cosmos Co-operative Bank Limited',
    emoji: '🌐',
    hqLocation: 'Pune, Maharashtra',
    homeLoanRate: { min: 8.75, max: 12.00, typical: 9.50 },
    personalLoanRate: { min: 12.00, max: 18.50, typical: 14.50 },
    carLoanRate: { min: 9.25, max: 13.75, typical: 10.75 },
    processingFee: "0.5% of loan amount (capped at Rs. 15000)",
    prepaymentPolicy: "Zero foreclosure charges on floating-rate home loans per RBI guidelines. 2-5% charges on fixed-rate, vehicle, and personal loans in early tenure, reducing over time.",
    marketContext: 'Cosmos Co-operative Bank is one of India\'s oldest urban cooperative banks, headquartered in Pune with over 118 years of operations. Regulated by RBI and the Maharashtra State Cooperative Societies Act, it has multi-state scheduled bank status with branches across 7 states. Its home and SME loans are competitive with mid-sized private banks, with a strong franchise in western Maharashtra.',
    uniqueAngle: 'Cosmos Co-operative Bank is one of India\'s oldest urban cooperative banks, headquartered in Pune with over 118 years of operations. Regulated by RBI and the Maharashtra State Cooperative Societies Act, it has multi-state scheduled bank status with branches across 7 states. Its home and SME loans are competitive with mid-sized private banks, with a strong franchise in western Maharashtra.',
    productHighlights: ['Pune and western Maharashtra residents', 'home loan borrowers', 'SME owners', 'traditional savers'],
    faqs: [
      { q: 'Who should apply for a Cosmos Bank loan?', a: 'Cosmos Bank is ideal for residents of Pune, western Maharashtra, and adjoining states seeking home loans, SME loans, or vehicle finance. The bank\'s deep community ties in Pune make it a trusted choice for property buyers and small business owners in the region.' },
      { q: 'How does Cosmos Bank compare to nationalized banks?', a: 'Cosmos offers home loan rates within 25-50 basis points of SBI/BoB with more personalized service. As a scheduled multi-state cooperative bank, it is regulated by RBI plus the state Cooperative Societies Act. Deposits are DICGC-insured up to Rs. 5 lakh, same as commercial banks.' },
      { q: 'What is the eligibility for Cosmos Bank loans?', a: 'Age 21-65, minimum Rs. 25,000 monthly income for salaried, 3 years business vintage for self-employed. Property must be in their service area (mostly Maharashtra, Karnataka, Madhya Pradesh, Gujarat, Andhra Pradesh, Telangana, Delhi). Nominal membership required for borrowers.' },
      { q: 'Is Cosmos Bank safe to deposit money?', a: 'Yes, Cosmos Co-operative Bank holds multi-state scheduled bank status, regulated by RBI and the Maharashtra State Cooperative Societies Act. Deposits are insured up to Rs. 5 lakh per depositor by DICGC. The bank has over a century of operations and stable financial ratios.' },
    ],
    metaKeywords: ['cosmos bank loan', 'cosmos cooperative bank emi', 'cosmos bank Pune home loan', 'cosmos bank rate 2026', 'multi state cooperative bank'],
  },
  {
    slug: 'shamrao-vithal',
    bankName: 'SVC Bank',
    fullName: 'Shamrao Vithal Co-operative Bank Limited',
    emoji: '🏘️',
    hqLocation: 'Mumbai, Maharashtra',
    homeLoanRate: { min: 8.70, max: 11.75, typical: 9.40 },
    personalLoanRate: { min: 11.75, max: 18.00, typical: 14.25 },
    carLoanRate: { min: 9.10, max: 13.50, typical: 10.60 },
    processingFee: "0.5% of loan amount (capped at Rs. 15000)",
    prepaymentPolicy: "Zero foreclosure charges on floating-rate home loans per RBI guidelines. 2-5% charges on fixed-rate, vehicle, and personal loans in early tenure, reducing over time.",
    marketContext: 'SVC Co-operative Bank (formerly Shamrao Vithal Co-operative Bank) is among India\'s oldest urban cooperative banks with a 118-year history, headquartered in Mumbai. With multi-state scheduled bank status, it serves customers across Maharashtra, Karnataka, Goa, Gujarat, and other states. Known for prudent management, strong asset quality, and competitive home loan rates that rival private banks.',
    uniqueAngle: 'SVC Co-operative Bank (formerly Shamrao Vithal Co-operative Bank) is among India\'s oldest urban cooperative banks with a 118-year history, headquartered in Mumbai. With multi-state scheduled bank status, it serves customers across Maharashtra, Karnataka, Goa, Gujarat, and other states. Known for prudent management, strong asset quality, and competitive home loan rates that rival private banks.',
    productHighlights: ['Mumbai and Maharashtra residents', 'home loan borrowers', 'SME owners', 'NRI customers from Konkan region'],
    faqs: [
      { q: 'Who should apply for an SVC Bank loan?', a: 'SVC Bank is best for residents of Mumbai, Maharashtra, Karnataka, and Goa seeking home loans, vehicle loans, or SME finance. The bank has a strong reputation in the Konkan community and serves NRIs from Karnataka coastal districts. Rates are competitive with mid-sized private banks.' },
      { q: 'How does SVC Bank compare to private banks?', a: 'SVC home loan rates are typically within 25 basis points of HDFC/ICICI while offering more personalized service. As a scheduled multi-state cooperative bank, it is regulated by RBI plus state law. Deposits are DICGC-insured up to Rs. 5 lakh per depositor.' },
      { q: 'What is the eligibility for SVC Bank loans?', a: 'Age 21-65, minimum Rs. 25,000 monthly income for salaried, 3 years business vintage for self-employed. CIBIL above 700 preferred. Property must be in their service area. NRIs from coastal Karnataka and Konkan diaspora are particularly welcomed with dedicated NRI home loan products.' },
      { q: 'Is SVC Bank safe?', a: 'Yes, SVC Co-operative Bank is a scheduled multi-state cooperative bank regulated by RBI and the Maharashtra Cooperative Societies Act. Deposits are DICGC-insured up to Rs. 5 lakh per depositor. The bank has over a century of stable operations and consistent profitability.' },
    ],
    metaKeywords: ['svc bank home loan', 'shamrao vithal cooperative bank emi', 'svc bank Mumbai loan rate', 'svc bank NRI loan', 'svc cooperative bank 2026'],
  },
  {
    slug: 'paytm-payments-bank',
    bankName: 'Paytm Payments Bank',
    fullName: 'Paytm Payments Bank Limited',
    emoji: '💳',
    hqLocation: 'Noida, Uttar Pradesh',
    homeLoanRate: { min: 14.00, max: 24.00, typical: 18.00 },
    personalLoanRate: { min: 14.00, max: 24.00, typical: 18.00 },
    carLoanRate: { min: 14.00, max: 24.00, typical: 18.00 },
    processingFee: "Not applicable (Payments Bank, lending not permitted under RBI rules)",
    prepaymentPolicy: "Not applicable (Payments Bank cannot lend under RBI rules).",
    marketContext: 'Paytm Payments Bank received severe RBI restrictions in January 2024, halting most customer-facing services from March 2024 including new deposits, credits, and wallet top-ups. As a Payments Bank, it was always prohibited from lending under RBI guidelines and could only accept deposits up to Rs. 2 lakh per customer. Current customers should rely on the Paytm app for UPI and previously linked third-party loan products, not direct PPBL loans.',
    uniqueAngle: 'Paytm Payments Bank received severe RBI restrictions in January 2024, halting most customer-facing services from March 2024 including new deposits, credits, and wallet top-ups. As a Payments Bank, it was always prohibited from lending under RBI guidelines and could only accept deposits up to Rs. 2 lakh per customer. Current customers should rely on the Paytm app for UPI and previously linked third-party loan products, not direct PPBL loans.',
    productHighlights: ['existing wallet users (limited operations)', 'UPI payments (via Paytm app, not PPBL)', 'small savings (subject to RBI restrictions)'],
    faqs: [
      { q: 'Can I get a loan from Paytm Payments Bank?', a: 'No. Payments Banks in India are statutorily prohibited from lending - they can only accept deposits up to Rs. 2 lakh per customer and offer payments/remittance services. Loans on the Paytm app are sourced through partner NBFCs and banks, not from Paytm Payments Bank itself.' },
      { q: 'What is the current status of Paytm Payments Bank?', a: 'In January 2024, the RBI imposed severe restrictions on PPBL, stopping new customer onboarding, new deposits, wallet top-ups, and FASTag recharges from March 15, 2024. Existing customers can withdraw balances but cannot add new funds. Many wallet and UPI services have been migrated to partner banks via Paytm app.' },
      { q: 'Who should use Paytm Payments Bank?', a: 'Given the RBI restrictions, new users should not open accounts. Existing customers should plan to migrate wallets, FASTag, and UPI to other providers. The Paytm app itself continues to work for UPI and partner-bank services, but PPBL as a banking entity is operating with major restrictions.' },
      { q: 'Is my money safe in Paytm Payments Bank?', a: 'Deposits up to Rs. 5 lakh per customer are insured by DICGC. Customers can withdraw their balances anytime even with the RBI restrictions. However, with services curtailed, most customers are migrating to other banks for active use.' },
    ],
    metaKeywords: ['paytm payments bank RBI restriction', 'paytm payments bank status 2026', 'paytm payments bank loan', 'paytm wallet migration', 'paytm bank closure'],
  },
  {
    slug: 'airtel-payments-bank',
    bankName: 'Airtel Payments Bank',
    fullName: 'Airtel Payments Bank Limited',
    emoji: '📱',
    hqLocation: 'New Delhi',
    homeLoanRate: { min: 14.00, max: 24.00, typical: 18.00 },
    personalLoanRate: { min: 14.00, max: 24.00, typical: 18.00 },
    carLoanRate: { min: 14.00, max: 24.00, typical: 18.00 },
    processingFee: "Not applicable (Payments Bank, lending not permitted under RBI rules)",
    prepaymentPolicy: "Not applicable (Payments Bank cannot lend under RBI rules).",
    marketContext: 'Airtel Payments Bank is India\'s largest Payments Bank by customer count, leveraging Bharti Airtel\'s massive rural retailer network of over 5 lakh banking points. As a Payments Bank, it cannot lend directly under RBI rules but offers savings accounts (up to Rs. 2 lakh), DBT credits, AePS withdrawals, and bill payments. Its rural reach makes it a key player in financial inclusion, especially for unbanked DBT beneficiaries.',
    uniqueAngle: 'Airtel Payments Bank is India\'s largest Payments Bank by customer count, leveraging Bharti Airtel\'s massive rural retailer network of over 5 lakh banking points. As a Payments Bank, it cannot lend directly under RBI rules but offers savings accounts (up to Rs. 2 lakh), DBT credits, AePS withdrawals, and bill payments. Its rural reach makes it a key player in financial inclusion, especially for unbanked DBT beneficiaries.',
    productHighlights: ['rural and unbanked customers', 'DBT subsidy beneficiaries', 'small savers', 'migrant workers needing remittances'],
    faqs: [
      { q: 'Can I get a loan from Airtel Payments Bank?', a: 'No. Payments Banks are statutorily prohibited from lending under RBI guidelines. They can only accept deposits up to Rs. 2 lakh per customer and offer payments services. Any loans offered through Airtel\'s ecosystem are sourced from partner NBFCs and banks, not from Airtel Payments Bank.' },
      { q: 'Who should use Airtel Payments Bank?', a: 'Airtel Payments Bank is ideal for rural customers, DBT subsidy beneficiaries, migrant workers, and anyone needing a basic savings account near home. With 5+ lakh banking points (mostly Airtel retail outlets), it offers cash withdrawal, deposit, and bill payment far closer than traditional bank branches.' },
      { q: 'What services does Airtel Payments Bank offer?', a: 'Savings accounts (max Rs. 2 lakh balance), DBT direct credit, AePS withdrawals at agent points, utility bill payments, mobile recharges, money transfer, FASTag, and partner-based insurance and investment products. Customers earn interest of 2.5-7% on savings depending on balance slabs.' },
      { q: 'Is Airtel Payments Bank safe?', a: 'Yes. Airtel Payments Bank is RBI-licensed and regulated. Deposits up to Rs. 5 lakh per customer are insured by DICGC. The bank has strong parentage (Bharti Airtel + Kotak Mahindra Bank originally) and is among the few profitable Payments Banks in India.' },
    ],
    metaKeywords: ['airtel payments bank account', 'airtel payments bank loan', 'airtel bank rural', 'airtel payments bank interest rate', 'airtel payments bank DBT'],
  },
];

export function getBankBySlug(slug: string): BankData | undefined {
  return emiBanks.find((b) => b.slug === slug);
}
