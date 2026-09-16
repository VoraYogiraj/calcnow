/**
 * Indian state-specific data for income tax calculator pSEO pages.
 * Each state has unique Professional Tax slabs, cost-of-living context,
 * dominant industries, and HRA city tiers.
 */

export interface IndiaStateData {
  slug: string;
  name: string;
  capital: string;
  emoji: string;
  monthlyProfessionalTax: number;        // Typical monthly PT for ₹15L+ salary (₹2,500/yr max nationally)
  ptSlabsNote: string;                    // Brief description of PT slabs
  costOfLivingIndex: number;              // Mumbai = 100 baseline
  hraTier: 'metro' | 'non-metro';         // For HRA 50% vs 40% calc
  avgSalaryMid: number;                   // Typical mid-career salary (annual ₹)
  topIndustries: string[];
  marketContext: string;                  // 2-3 sentences on the state's economic profile
  taxNote: string;                        // State-specific tax info
  faqs: Array<{ q: string; a: string }>;
  metaKeywords: string[];
}

export const indiaStates: IndiaStateData[] = [
  {
    slug: 'maharashtra',
    name: 'Maharashtra',
    capital: 'Mumbai',
    emoji: '🏙️',
    monthlyProfessionalTax: 200,
    ptSlabsNote: 'Maharashtra PT: ₹175/mo for ₹7,500-10,000 income, ₹200/mo for ₹10,000+. Maximum ₹2,500/year (₹300 in Feb).',
    costOfLivingIndex: 100,
    hraTier: 'metro',
    avgSalaryMid: 1500000,
    topIndustries: ['Financial Services', 'IT/ITES', 'Media & Entertainment', 'Manufacturing', 'Pharmaceuticals'],
    marketContext: 'Maharashtra has India\'s largest state GDP (~$500B). Mumbai is the financial capital (RBI, BSE, NSE, all major banks HQ). Pune is the IT/manufacturing hub. The state contributes 14% of national GDP. Highest concentration of MNC head offices in India.',
    taxNote: 'Maharashtra has the highest absolute Professional Tax bills in India due to having the highest concentration of high-salary jobs. PT applies as ₹2,500/year (₹200/mo for 11 months, ₹300 in Feb). Mumbai\'s HRA tier-1 status allows 50% of basic salary as HRA exemption.',
    faqs: [
      {
        q: 'Is the cost of living in Mumbai justified by Maharashtra salaries?',
        a: 'Mumbai is India\'s most expensive city. Rent and groceries run 40-60% above other metros. But mid-career IT/finance roles pay ₹15-30 lakh (vs ₹10-20 lakh in Bangalore for the same role). The math nets out for senior IC and management roles; junior roles often see better real income in Pune or Hyderabad.',
      },
      {
        q: 'Are there state-specific tax breaks in Maharashtra?',
        a: 'No state-level income tax breaks (India has no state income tax). Maharashtra\'s only state taxes affecting salaried employees are Professional Tax (₹2,500/year max) and stamp duty on property purchases (5-7% varying by location). The state offers GST input credit benefits for businesses in IT parks (SEZs).',
      },
      {
        q: 'Which Maharashtra city is best for a tech job financially?',
        a: 'Pune wins on overall financial outcome for tech roles. Salaries are 5-10% below Mumbai but cost of living is 30-40% lower. Hinjawadi/Magarpatta/Kharadi corridors have the highest concentration of IT employers. Mumbai BKC remains better for pure finance roles where the salary premium exceeds the cost-of-living premium.',
      },
    ],
    metaKeywords: ['income tax calculator maharashtra', 'mumbai tax calculator', 'pune income tax', 'maharashtra professional tax'],
  },
  {
    slug: 'karnataka',
    name: 'Karnataka',
    capital: 'Bengaluru',
    emoji: '💻',
    monthlyProfessionalTax: 200,
    ptSlabsNote: 'Karnataka PT: ₹200/mo for income above ₹25,000/mo. Maximum ₹2,500/year. Self-employed pay annual lump sum.',
    costOfLivingIndex: 78,
    hraTier: 'metro',
    avgSalaryMid: 1800000,
    topIndustries: ['IT Services', 'Software Products', 'Biotechnology', 'Aerospace', 'R&D Captives'],
    marketContext: 'Karnataka, especially Bengaluru, is the Silicon Valley of India, accounting for over 35% of India\'s IT exports. Home to all major global tech captives (Microsoft, Google, Amazon, Adobe, Salesforce, Cisco) and India\'s biggest startup ecosystem.',
    taxNote: 'Karnataka follows the standard Professional Tax structure (₹2,500/year max). Bengaluru is HRA tier-1 metro (50% HRA exemption). The state offers SEZ benefits for IT parks (Electronic City, Whitefield, ORR) but these benefit employers, not employees.',
    faqs: [
      {
        q: 'Why are Bangalore IT salaries higher than other Indian cities?',
        a: 'Bengaluru hosts the largest concentration of tech employers in India, creating intense competitive pressure on salaries. Global captive centers (GCCs) pay 20-40% above domestic IT services rates. The talent density also means job-hopping yields the biggest salary jumps (typically 30-50% per move vs 20-30% elsewhere).',
      },
      {
        q: 'How does Bangalore weather and traffic affect financial decisions?',
        a: 'Traffic costs Bengaluru employees roughly 10-15 working days per year in commute time. Many tech employees now choose hybrid/remote roles AND live further from work (Doddaballapur, Devanahalli) where rent runs 50-70% less. The annual financial impact of choosing the right neighborhood can be ₹3-6 lakh in saved rent + commute costs.',
      },
      {
        q: 'Karnataka professional tax vs Maharashtra: which is cheaper?',
        a: 'Identical at the top. Both states cap at ₹2,500/year. Karnataka\'s PT slabs kick in at lower income thresholds, so freshers/junior employees pay slightly more. Senior employees pay the same maximum either way. The bigger financial difference is HRA: both are metro tier-1, so HRA exemption is 50% in both.',
      },
    ],
    metaKeywords: ['income tax calculator karnataka', 'bangalore tax calculator', 'bengaluru income tax', 'karnataka professional tax'],
  },
  {
    slug: 'tamil-nadu',
    name: 'Tamil Nadu',
    capital: 'Chennai',
    emoji: '🏭',
    monthlyProfessionalTax: 208,
    ptSlabsNote: 'Tamil Nadu PT: Half-yearly slabs. ₹1,250 every 6 months (~₹208/mo equivalent) for income above ₹75,000/half-year. Max ₹2,500/year.',
    costOfLivingIndex: 75,
    hraTier: 'metro',
    avgSalaryMid: 1400000,
    topIndustries: ['Automotive Manufacturing', 'IT Services', 'Textiles', 'Healthcare', 'Heavy Industries'],
    marketContext: 'Tamil Nadu is India\'s 2nd largest state economy and the most industrialized state by GDP per capita. Chennai is the "Detroit of India", hosting Hyundai, Ford, BMW, Renault-Nissan, Daimler. Coimbatore is a textile and engineering hub. Tier-2 cities like Tiruchirapalli and Madurai have growing IT presence.',
    taxNote: 'Tamil Nadu uses unique half-yearly PT collection (₹1,250 every 6 months, Sep and March) rather than monthly. Chennai is HRA tier-1 metro. Tamil Nadu offers e-stamp duty discounts on female buyers (1% subsidy), but this is property-purchase only, not income-tax related.',
    faqs: [
      {
        q: 'How is Tamil Nadu Professional Tax different from other states?',
        a: 'Tamil Nadu is one of the few Indian states that collects PT half-yearly (not monthly): ₹1,250 in September and ₹1,250 in March. The total annual liability matches the national cap of ₹2,500. This affects cash-flow planning but not total tax burden.',
      },
      {
        q: 'Why does Tamil Nadu have lower IT salaries than Bangalore?',
        a: 'Tamil Nadu (Chennai) IT salaries run 10-15% below Bangalore for equivalent roles. Reason: smaller GCC concentration, fewer pure-product startups, more services-export business. Manufacturing salaries (automotive, heavy industry) are competitive with peers. Cost of living in Chennai is 20-25% lower than Bangalore, which mostly evens out the wage gap.',
      },
      {
        q: 'Which Tamil Nadu city is best for an IT career financially?',
        a: 'Chennai remains the top choice, with the largest IT employer base (TCS, Cognizant, Infosys, Wipro all have major Chennai centers). Coimbatore is rising. TCS, Bosch, Infosys have expanded, and cost of living is 30% lower than Chennai. For Tamil-speaking talent, Coimbatore now offers better real income for mid-level roles than Chennai for many.',
      },
    ],
    metaKeywords: ['income tax calculator tamil nadu', 'chennai tax calculator', 'tamil nadu professional tax', 'coimbatore income tax'],
  },
  {
    slug: 'gujarat',
    name: 'Gujarat',
    capital: 'Gandhinagar',
    emoji: '🏛️',
    monthlyProfessionalTax: 200,
    ptSlabsNote: 'Gujarat PT: ₹200/mo for income ₹12,000+ monthly. Maximum ₹2,400/year (slightly below national cap).',
    costOfLivingIndex: 70,
    hraTier: 'non-metro',
    avgSalaryMid: 1200000,
    topIndustries: ['Petrochemicals', 'Diamond Polishing', 'Textiles', 'Pharmaceuticals', 'Manufacturing'],
    marketContext: 'Gujarat has India\'s highest manufacturing PMI consistently. Surat dominates diamond polishing (~80% of world\'s rough-to-polished diamonds). Ahmedabad has a strong pharma cluster (Zydus, Torrent). GIFT City (Gujarat International Finance Tec-City) is India\'s first International Financial Services Centre.',
    taxNote: 'Gujarat PT cap is ₹2,400/year (slightly less than national ₹2,500 max). HRA tier-2 (non-metro) applies to all Gujarat cities including Ahmedabad, meaning 40% HRA exemption (not 50%). GIFT City employees can enjoy tax holidays for certain capital gains under the IFSCA framework.',
    faqs: [
      {
        q: 'What is GIFT City and does it affect my tax?',
        a: 'GIFT City (Gujarat International Finance Tec-City) is India\'s first International Financial Services Centre. Companies operating there get a 10-year tax holiday. Salaried employees of GIFT City companies face standard Indian income tax rules, there\'s no personal tax benefit for being employed there (unlike Mauritius or Singapore FTZs).',
      },
      {
        q: 'Why does Gujarat have HRA tier-2 status when Ahmedabad is a major city?',
        a: 'HRA tier-1 status (50% exemption) is only granted to the four "metros": Delhi, Mumbai, Kolkata, Chennai. All other Indian cities including Bangalore, Hyderabad, Pune, Ahmedabad are technically tier-2 (40% exemption) per the Income Tax Act, although the IT department often informally treats Bangalore and Pune as metros. For Gujarat, the 40% calculation is standard.',
      },
      {
        q: 'Is Gujarat\'s professional tax cap really lower than other states?',
        a: 'Yes. Gujarat caps PT at ₹2,400/year (₹200/mo × 12) vs the national maximum allowed of ₹2,500. Most states (Maharashtra, Karnataka, Andhra) use the full ₹2,500 cap. The ₹100 difference is trivial but real. Gujarat slightly under-collects vs the national cap.',
      },
    ],
    metaKeywords: ['income tax calculator gujarat', 'ahmedabad tax calculator', 'gift city tax', 'gujarat professional tax', 'surat income tax'],
  },
  {
    slug: 'delhi',
    name: 'Delhi (NCT)',
    capital: 'New Delhi',
    emoji: '🏛️',
    monthlyProfessionalTax: 0,
    ptSlabsNote: 'Delhi does NOT levy Professional Tax, one of the few Indian states/UTs without state-level PT.',
    costOfLivingIndex: 88,
    hraTier: 'metro',
    avgSalaryMid: 1600000,
    topIndustries: ['Government Services', 'Professional Services', 'IT/ITES', 'Media', 'Hospitality'],
    marketContext: 'Delhi NCT is India\'s capital, hosting the central government, embassies, PSU headquarters, and major media organizations. The greater NCR (including Gurgaon and Noida) is the second-largest urban agglomeration after Mumbai. Gurgaon (Gurugram) hosts most MNC India HQs (Google, Microsoft, Genpact, Accenture).',
    taxNote: 'Delhi is ONE OF THE FEW Indian states/UTs that does not levy Professional Tax, saving you ₹2,500/year. Delhi is HRA tier-1 metro (50% exemption). Note: if you live in Delhi but work in Gurgaon (Haryana), your employer\'s state determines PT, not yours.',
    faqs: [
      {
        q: 'Does Delhi really have no Professional Tax?',
        a: 'Correct. Delhi NCT is one of the few Indian states/UTs (along with UP, Bihar, Punjab, Haryana, Rajasthan, J&K) that does not levy Professional Tax. If you\'re employed by a Delhi-registered company, you save ₹2,500/year vs employees in Maharashtra, Karnataka, or Tamil Nadu.',
      },
      {
        q: 'I live in Delhi but work in Gurgaon: which state\'s rules apply?',
        a: 'Your employer\'s state of incorporation determines PT, not your residence. Gurgaon is in Haryana, which also doesn\'t levy PT, so you\'re still PT-free. If you worked in Noida (Uttar Pradesh, no PT) you\'d also be fine. If you worked in a Maharashtra/Karnataka-registered company\'s Delhi office, that\'s a gray area, typically the employer follows the state of registration.',
      },
      {
        q: 'Is Delhi HRA at metro tier-1 (50%) for tax purposes?',
        a: 'Yes. Delhi is one of the four official Indian metros (with Mumbai, Chennai, Kolkata) under Section 10(13A). This means 50% of basic salary can be HRA-exempt (vs 40% in other cities). Combined with Delhi\'s lower-than-Mumbai cost of living, this is a quietly significant tax advantage for high earners.',
      },
    ],
    metaKeywords: ['income tax calculator delhi', 'delhi income tax', 'gurgaon tax calculator', 'noida income tax'],
  },
  {
    slug: 'uttar-pradesh',
    name: 'Uttar Pradesh',
    capital: 'Lucknow',
    emoji: '🌾',
    monthlyProfessionalTax: 0,
    ptSlabsNote: 'Uttar Pradesh does NOT levy Professional Tax, same as Delhi.',
    costOfLivingIndex: 55,
    hraTier: 'non-metro',
    avgSalaryMid: 900000,
    topIndustries: ['Agriculture', 'Sugar', 'Textiles', 'IT/ITES (Noida)', 'Manufacturing'],
    marketContext: 'Uttar Pradesh is India\'s most populous state (~240 million). Economy is split between rural agriculture (Mathura, Aligarh, Meerut) and urban services. Noida and Greater Noida are major IT/ITES hubs. Lucknow is the administrative and educational center. Kanpur is industrial. The state has seen recent infrastructure investment (Expressway, Jewar airport).',
    taxNote: 'UP does not levy Professional Tax, same advantage as Delhi. Noida-based tech employees are HRA tier-2 (40% exemption) even though they\'re in the NCR. This is a minor disadvantage vs Delhi-based peers who get 50% HRA exemption.',
    faqs: [
      {
        q: 'Why is Noida HRA tier-2 if it\'s in the NCR?',
        a: 'HRA tier-1 (50% exemption) is only legally granted to the four cities: Delhi, Mumbai, Chennai, Kolkata. The NCR designation is for urban planning purposes, not tax purposes. Noida and Gurgaon residents both face the 40% HRA exemption cap. This is a quiet ~₹50-80K/year tax difference for high-rent NCR employees vs Delhi residents.',
      },
      {
        q: 'Is Noida a better financial choice than Bangalore for an IT job?',
        a: 'For pure salary: Bangalore wins by 10-20%. For total compensation after cost of living: Noida wins for mid-career roles. Noida rents run 50-60% of Bangalore, and the no-PT + larger HRA bands roughly equal out the lower headline salary. Noida loses on weekend amenities and startup density.',
      },
      {
        q: 'How does Uttar Pradesh\'s low cost of living affect tax planning?',
        a: 'In Lucknow, Kanpur, and tier-2 UP cities, a ₹15 lakh salary stretches like ₹25 lakh in Mumbai. But tax is computed at national rates regardless of state, so your tax bill is identical to a Mumbai earner at the same gross. The real benefit is post-tax purchasing power, not lower tax.',
      },
    ],
    metaKeywords: ['income tax calculator uttar pradesh', 'noida tax calculator', 'lucknow income tax', 'up income tax'],
  },
  {
    slug: 'west-bengal',
    name: 'West Bengal',
    capital: 'Kolkata',
    emoji: '🌊',
    monthlyProfessionalTax: 200,
    ptSlabsNote: 'West Bengal PT: ₹150/mo for income ₹15,001-25,000; ₹200/mo for ₹25,001+. Maximum ₹2,500/year.',
    costOfLivingIndex: 70,
    hraTier: 'metro',
    avgSalaryMid: 1100000,
    topIndustries: ['Financial Services', 'IT/ITES', 'Engineering', 'Tea & Jute', 'Manufacturing'],
    marketContext: 'West Bengal is India\'s 6th largest state economy. Kolkata (the third metro) houses the regional HQ of major nationalized banks (SBI Kolkata Circle), eastern HQ of TCS/Wipro/Cognizant, and ITC Limited. Tea, jute, and engineering remain historically dominant. Salt Lake (Sector V) is the major IT cluster.',
    taxNote: 'Kolkata is one of the four official Indian metros (HRA tier-1, 50% exemption). West Bengal levies PT at ₹2,500/year max. The state has a slightly progressive PT (₹150/mo at lower income, ₹200 at higher). Most other states are flat-rate.',
    faqs: [
      {
        q: 'Is Kolkata still classified as a metro for HRA purposes?',
        a: 'Yes. Kolkata is one of the four officially-designated Indian metros (with Delhi, Mumbai, Chennai) under Section 10(13A) for HRA. Despite lower modern relevance in IT compared to Bangalore or Hyderabad, the legal metro status remains. Kolkata employees get 50% HRA exemption (vs 40% for Bangalore, Hyderabad, Pune, Ahmedabad).',
      },
      {
        q: 'Are West Bengal IT salaries competitive with other Indian cities?',
        a: 'West Bengal IT salaries run 15-25% below Bangalore for equivalent roles, partly due to lower GCC concentration, partly due to lower cost of living (which depresses local salary norms). The cost of living offset is significant: Kolkata rents and groceries run 50-60% of Bangalore. For mid-career employees, real income is comparable.',
      },
      {
        q: 'How does the West Bengal Professional Tax compare to neighbors?',
        a: 'West Bengal\'s PT is identical to Karnataka and Maharashtra at the top tier (₹2,500/year max). It\'s slightly more progressive than flat-rate states. Lower-income workers pay less PT. Neighboring Odisha and Bihar have no PT, slightly favoring those states for low/mid-income workers in border districts.',
      },
    ],
    metaKeywords: ['income tax calculator west bengal', 'kolkata tax calculator', 'west bengal professional tax', 'bengal income tax'],
  },
  {
    slug: 'telangana',
    name: 'Telangana',
    capital: 'Hyderabad',
    emoji: '🏗️',
    monthlyProfessionalTax: 200,
    ptSlabsNote: 'Telangana PT: ₹150/mo for income ₹15,001-20,000; ₹200/mo for ₹20,001+. Maximum ₹2,500/year.',
    costOfLivingIndex: 72,
    hraTier: 'non-metro',
    avgSalaryMid: 1700000,
    topIndustries: ['IT/ITES', 'Pharmaceuticals', 'Aerospace', 'Biotechnology', 'Financial Services'],
    marketContext: 'Telangana (split from Andhra Pradesh in 2014) has rapidly become India\'s 3rd-largest IT exporter. Hyderabad hosts the largest Microsoft campus outside Redmond, Amazon\'s biggest India campus, Google\'s second-largest India campus, and major pharma (Dr. Reddy\'s, Aurobindo, Hetero). HITEC City and Gachibowli are the major IT clusters.',
    taxNote: 'Telangana follows the standard PT structure (₹2,500/year max) but with a slightly progressive slab. Hyderabad is HRA tier-2 (40% exemption) despite being India\'s 4th-largest tech employer. This is a legal classification not commercial. State industrial policy aggressively subsidizes commercial real estate (HITEC City).',
    faqs: [
      {
        q: 'Hyderabad IT salaries vs Bangalore: which is better?',
        a: 'Hyderabad salaries are approximately 5-10% below Bangalore for equivalent roles. The compensation gap has narrowed dramatically in 2022-2026 as global firms (Microsoft, Google, Amazon) invested heavily in Hyderabad. Cost of living is 20-30% lower than Bangalore. For mid-career and senior roles, Hyderabad now offers higher real income than Bangalore.',
      },
      {
        q: 'Why is Hyderabad HRA tier-2 if it\'s a major IT hub?',
        a: 'HRA tier-1 (50% exemption) is legally granted only to Delhi, Mumbai, Chennai, and Kolkata under the Income Tax Act 10(13A). Hyderabad\'s status as a tech hub doesn\'t change its legal classification. This is a quiet ₹40K-80K/year tax disadvantage vs working in Mumbai or Delhi at the same salary.',
      },
      {
        q: 'How did the AP-Telangana split affect taxes?',
        a: 'The 2014 bifurcation didn\'t affect personal income tax (which is federal). Both states implemented similar PT structures post-split. The bigger commercial impact: Hyderabad retained the IT/pharma economy while Andhra Pradesh had to rebuild industrial infrastructure (Amaravati, Visakhapatnam). For salaried employees, the split was administratively transparent.',
      },
    ],
    metaKeywords: ['income tax calculator telangana', 'hyderabad tax calculator', 'telangana professional tax', 'hyderabad income tax'],
  },
  {
    slug: 'andhra-pradesh',
    name: 'Andhra Pradesh',
    capital: 'Amaravati',
    emoji: '🌾',
    monthlyProfessionalTax: 200,
    ptSlabsNote: 'Andhra Pradesh PT: ₹150/mo for ₹15,001-20,000 income; ₹200/mo for above. Maximum ₹2,500/year.',
    costOfLivingIndex: 60,
    hraTier: 'non-metro',
    avgSalaryMid: 1000000,
    topIndustries: ['Agriculture', 'Pharma', 'IT (Visakhapatnam)', 'Manufacturing', 'Port-based Trade'],
    marketContext: 'Post the 2014 Telangana split, Andhra Pradesh has invested heavily in rebuilding commercial centers. Visakhapatnam is the largest urban economy (port, steel, pharma). Tirupati and Vijayawada are growing tech-services hubs. The state offers aggressive tax incentives for SEZs and "Special Industrial Areas", but these benefit employers, not personal tax.',
    taxNote: 'AP follows the post-split PT structure (same as Telangana). All AP cities are HRA tier-2 (40% exemption), including Visakhapatnam, Tirupati, and Vijayawada. State has minimal personal-tax-relevant incentives beyond PT.',
    faqs: [
      {
        q: 'Is Visakhapatnam emerging as an IT alternative to Hyderabad?',
        a: 'Yes. Visakhapatnam (Vizag) has seen GCC investment from Wipro, Tech Mahindra, and Conduent. Salaries run 15-20% below Hyderabad but cost of living is 30-40% lower. For early-career employees seeking faster equity build-up via lower rent, Vizag offers strong real-income upside.',
      },
      {
        q: 'How does AP\'s industrial policy affect personal taxes?',
        a: 'Andhra Pradesh\'s state industrial policy provides employer-side benefits (capital subsidy, electricity tariff reduction, GST credit). None of these directly reduce personal income tax for employees. The indirect benefit is more local jobs at competitive salaries, but for tax purposes, AP employees face identical federal tax rates.',
      },
      {
        q: 'Andhra Pradesh PT vs Telangana PT: any difference?',
        a: 'The two states implemented near-identical PT structures post their 2014 split. Both cap at ₹2,500/year. The slab thresholds differ marginally (₹50-100 in monthly cutoff thresholds) but the practical tax burden for mid-to-high earners is identical at ₹200/month / ₹2,500 annual.',
      },
    ],
    metaKeywords: ['income tax calculator andhra pradesh', 'visakhapatnam tax calculator', 'ap professional tax', 'andhra income tax'],
  },
  {
    slug: 'rajasthan',
    name: 'Rajasthan',
    capital: 'Jaipur',
    emoji: '🏰',
    monthlyProfessionalTax: 0,
    ptSlabsNote: 'Rajasthan does NOT levy Professional Tax, same as Delhi, UP, Bihar, Punjab, Haryana.',
    costOfLivingIndex: 58,
    hraTier: 'non-metro',
    avgSalaryMid: 950000,
    topIndustries: ['Tourism & Hospitality', 'Textiles', 'Marble & Stone', 'Government Services', 'IT (Jaipur)'],
    marketContext: 'Rajasthan is India\'s largest state by area but mid-tier by economic output. Jaipur is the administrative and IT services capital (TCS, Infosys, Wipro have presence). Udaipur is a tourism heavyweight. The state has growing food-processing and renewable energy sectors. State industrial policy emphasizes textile clusters (Bhilwara, Sanganer).',
    taxNote: 'Rajasthan is among Indian states that do NOT levy Professional Tax, saving ₹2,500/year vs Maharashtra/Karnataka residents. All Rajasthan cities are HRA tier-2 (40% exemption).',
    faqs: [
      {
        q: 'Is Jaipur a viable IT career destination?',
        a: 'Yes for mid-career roles. Jaipur has TCS, Infosys, Wipro, and growing GCC presence (Genpact, Capgemini). Salaries run 25-30% below Bangalore but cost of living is 45-55% lower. The no-PT and lower-tier-2 cities (Jodhpur, Udaipur) make Rajasthan attractive for remote/hybrid IT workers.',
      },
      {
        q: 'Does Rajasthan offer any unique tax breaks?',
        a: 'Personal income tax: no state-level breaks (no state income tax in India). The PT exemption ₹2,500/year saving is the main personal tax advantage. State industrial policy has employer-side incentives for solar, textile, and food-processing units. These flow through to wages indirectly but don\'t reduce personal tax.',
      },
      {
        q: 'How does living in Jaipur compare financially to Delhi NCR?',
        a: 'Both states/UTs have no Professional Tax. Delhi has 50% HRA exemption (tier-1 metro); Jaipur has 40% (tier-2). For a ₹15 lakh salary: Delhi resident saves ~₹30K more on HRA, but Jaipur saves ~₹2-4 lakh on rent. Net: Jaipur wins on real income, Delhi wins on career mobility.',
      },
    ],
    metaKeywords: ['income tax calculator rajasthan', 'jaipur tax calculator', 'rajasthan professional tax', 'jaipur income tax'],
  },
  {
    slug: 'kerala',
    name: 'Kerala',
    capital: 'Thiruvananthapuram',
    emoji: '🌴',
    monthlyProfessionalTax: 208,
    ptSlabsNote: 'Kerala PT: Half-yearly slabs. ₹1,250 every 6 months for income above ₹50,001/half-year. Maximum ₹2,500/year.',
    costOfLivingIndex: 65,
    hraTier: 'non-metro',
    avgSalaryMid: 1100000,
    topIndustries: ['Remittances & Banking', 'Tourism', 'IT (Technopark, Infopark)', 'Spices & Agriculture', 'Healthcare'],
    marketContext: 'Kerala has India\'s highest human development index but mid-tier industrial output. The state\'s economy is heavily remittance-dependent (Gulf earnings ~30% of GSDP). Technopark (Thiruvananthapuram) and Infopark (Kochi) are the major IT clusters. Kerala has India\'s highest literacy rate and healthcare access.',
    taxNote: 'Kerala uses half-yearly PT collection (like Tamil Nadu): ₹1,250 in September and March. Cochin and Trivandrum are HRA tier-2 (40% exemption). The state has zero state-level income tax additions but mandates higher minimum wages than most states.',
    faqs: [
      {
        q: 'Why are Kerala IT salaries lower than other Indian states?',
        a: 'Kerala salaries run 20-30% below Bangalore for equivalent roles. Reasons: smaller IT employer base (Technopark + Infopark vs Electronic City + Whitefield + ORR), more locally-oriented economy (remittance + tourism), and lower commercial real estate density. Cost of living offset is significant. Kochi/Trivandrum rents run 40-50% of Bangalore.',
      },
      {
        q: 'How do Gulf remittances affect Kerala\'s tax landscape?',
        a: 'Personal income tax: NRI Kerala residents face Indian tax rates if Indian resident (180+ days). True non-residents are not taxed in India on foreign income. This creates a unique Kerala tax planning ecosystem. Many families optimize between India-based salary income and Gulf-based NRI status. Most middle-class Kerala families have at least one NRI earner.',
      },
      {
        q: 'Is the Kerala Professional Tax different in its mechanics?',
        a: 'Kerala (like Tamil Nadu) collects PT half-yearly (₹1,250 in September, ₹1,250 in March) rather than monthly. The annual total matches the ₹2,500 cap. This affects cash-flow timing but not total burden. Most Kerala employers handle this automatically through payroll.',
      },
    ],
    metaKeywords: ['income tax calculator kerala', 'kochi tax calculator', 'kerala professional tax', 'thiruvananthapuram tax'],
  },
  {
    slug: 'punjab',
    name: 'Punjab',
    capital: 'Chandigarh',
    emoji: '🌾',
    monthlyProfessionalTax: 200,
    ptSlabsNote: 'Punjab PT: ₹200/mo for income above ₹20,833/mo. Maximum ₹2,500/year. State implemented PT only in 2018.',
    costOfLivingIndex: 60,
    hraTier: 'non-metro',
    avgSalaryMid: 1000000,
    topIndustries: ['Agriculture', 'Food Processing', 'Textiles', 'Sports Goods (Jalandhar)', 'IT (Mohali)'],
    marketContext: 'Punjab\'s economy is heavily agrarian (wheat-rice belt) but with significant industrial pockets: Mohali for IT/Pharma, Ludhiana for textiles and bicycles, Jalandhar for sports goods. Chandigarh (a Union Territory) functions as the joint capital with Haryana and hosts much of Punjab\'s administrative employment.',
    taxNote: 'Punjab introduced Professional Tax in 2018, late compared to most southern states. PT cap is ₹2,500/year. Chandigarh (UT) does not levy PT. Many Punjab residents who work in Chandigarh save the ₹2,500/year. All Punjab cities are HRA tier-2.',
    faqs: [
      {
        q: 'I live in Punjab but work in Chandigarh: what about Professional Tax?',
        a: 'Chandigarh is a Union Territory and does NOT levy Professional Tax. If your employer is registered in Chandigarh, you pay no PT, even if you live in Mohali (Punjab) or Panchkula (Haryana). This is a quiet ₹2,500/year savings for many Tricity-area workers. Your employer\'s state of registration determines PT, not your residence.',
      },
      {
        q: 'How does Punjab\'s late PT implementation affect existing employees?',
        a: 'Punjab implemented PT only in 2018 (very late by Indian standards). Pre-2018 Punjab employees suddenly had a new ₹2,500/year tax liability. Some employers absorbed this; others passed it through. Current Punjab employees should verify with their payroll that PT is being deducted correctly (it\'s tax-deductible against income tax).',
      },
      {
        q: 'Are Punjab agricultural earnings tax-exempt?',
        a: 'Agricultural income is exempt from Indian central income tax (Article 270, Constitution). However, agricultural income is "aggregated" for rate purposes, meaning a farmer with ₹5L agricultural and ₹5L salary income is taxed on the ₹5L salary at the slab rate applicable to ₹10L total. Most middle-class Punjab agricultural families face this dynamic.',
      },
    ],
    metaKeywords: ['income tax calculator punjab', 'punjab professional tax', 'chandigarh tax calculator', 'mohali income tax'],
  },
  {
    slug: 'madhya-pradesh',
    name: 'Madhya Pradesh',
    capital: 'Bhopal',
    emoji: '🌳',
    monthlyProfessionalTax: 208,
    ptSlabsNote: 'Madhya Pradesh PT: ₹208/mo for income above ₹15,000. Annual ₹2,500 cap.',
    costOfLivingIndex: 55,
    hraTier: 'non-metro',
    avgSalaryMid: 800000,
    topIndustries: ['Agriculture', 'Textiles (Indore)', 'IT (Indore, Bhopal)', 'Manufacturing', 'Tourism'],
    marketContext: 'Madhya Pradesh is centrally located in India and has emerged as a logistics hub. Indore has been ranked India\'s cleanest city for consecutive years and has growing IT presence (TCS, Infosys, Cognizant). Bhopal hosts the administrative cluster. Jabalpur and Gwalior have industrial pockets.',
    taxNote: 'MP follows standard PT (₹2,500/year cap). All MP cities are HRA tier-2 (40% exemption). State industrial policy offers stamp duty waivers for new investments above ₹100 crore, relevant for businesses, not personal tax.',
    faqs: [
      {
        q: 'Is Indore emerging as a viable IT city?',
        a: 'Yes. Indore has seen significant IT investment in 2021-2026. TCS, Infosys, Persistent, and HCL all have meaningful Indore presence. Salaries run 20-25% below Bangalore but cost of living is 50% lower. For early-career employees and those preferring tier-2 city living, Indore offers strong real-income outcomes.',
      },
      {
        q: 'Why is MP\'s cost of living so low?',
        a: 'MP has the lowest urban cost-of-living index in major Indian states. Bhopal and Indore run roughly 50-55% of Mumbai costs. Reasons: lower commercial real estate density, abundant local food production, and limited international migration pressure on housing. Mid-career professionals can save 30-40% of post-tax income in MP cities vs metros.',
      },
      {
        q: 'Are there MP-specific tax advantages I should know about?',
        a: 'No state-level personal income tax breaks. The main MP financial advantages are: lower PT bills than most states (₹208/mo is on the lower end), much lower cost of living than metros, and aggressive state industrial subsidies that benefit MP-based businesses (not directly employees). For salaried workers, MP\'s tax burden is identical to other Indian states at the same income.',
      },
    ],
    metaKeywords: ['income tax calculator madhya pradesh', 'indore tax calculator', 'bhopal income tax', 'mp professional tax'],
  },
  {
    slug: 'haryana',
    name: 'Haryana',
    capital: 'Chandigarh',
    emoji: '🏢',
    monthlyProfessionalTax: 0,
    ptSlabsNote: 'Haryana does NOT levy Professional Tax, same as Delhi, UP, Bihar, Punjab, Rajasthan, J&K.',
    costOfLivingIndex: 75,
    hraTier: 'non-metro',
    avgSalaryMid: 1600000,
    topIndustries: ['IT/ITES (Gurgaon)', 'Automotive (Manesar, Bawal)', 'Pharma', 'Logistics', 'Financial Services'],
    marketContext: 'Haryana, particularly Gurgaon (now officially Gurugram), is one of India\'s premier corporate hubs. Gurgaon hosts the India HQ of Microsoft, Google, Adobe, Accenture, Genpact, McKinsey, BCG, Bain. Manesar and Bawal are automotive belts (Maruti Suzuki, Hero MotoCorp, Honda). Sonipat and Faridabad have manufacturing.',
    taxNote: 'Haryana is among the Indian states that do NOT levy Professional Tax, saving ₹2,500/year. Gurgaon is HRA tier-2 (40% exemption), a significant disadvantage vs Delhi-based peers (50%) at the same salary. This is a quiet ₹40-80K/year tax difference for high earners working in Gurgaon vs Delhi.',
    faqs: [
      {
        q: 'I live in Delhi but work in Gurgaon: best of both worlds?',
        a: 'Yes, somewhat. Gurgaon offers no PT (₹2,500 saved) and slightly higher salary norms than Delhi. Delhi residence (if Delhi-registered employer) gets 50% HRA exemption. The catch: if your employer is registered in Gurgaon (most are), the HRA is computed at 40%. Net effect depends on your specific rental and salary.',
      },
      {
        q: 'Why is Gurgaon HRA tier-2 despite being one of India\'s top corporate hubs?',
        a: 'HRA tier-1 (50% exemption) is legally granted only to Delhi, Mumbai, Chennai, Kolkata under Section 10(13A). Gurgaon\'s status as a corporate hub doesn\'t change its legal classification. For high earners, this is a real annual ₹50K-1L difference vs working in Delhi at the same gross salary.',
      },
      {
        q: 'Is the no-PT advantage in Haryana meaningful?',
        a: 'For most workers: a modest ₹2,500/year saving (~₹200/month). For high earners: meaningful when stacked with other benefits, combined with no state income tax (federal-only) and the Gurgaon employment density. Compared to a Mumbai-based peer at the same gross income, a Gurgaon employee saves ₹2,500 on PT but loses 10% HRA exemption, net negative for high earners.',
      },
    ],
    metaKeywords: ['income tax calculator haryana', 'gurgaon tax calculator', 'gurugram income tax', 'haryana professional tax'],
  },
  {
    slug: 'bihar',
    name: 'Bihar',
    capital: 'Patna',
    emoji: '🌾',
    monthlyProfessionalTax: 0,
    ptSlabsNote: 'Bihar does NOT levy Professional Tax, saving ₹2,500/year.',
    costOfLivingIndex: 50,
    hraTier: 'non-metro',
    avgSalaryMid: 700000,
    topIndustries: ['Agriculture', 'Government Services', 'Small-scale Manufacturing', 'Education', 'Remittances'],
    marketContext: 'Bihar is India\'s 3rd most populous state. The economy is predominantly agrarian with the highest dependence on remittances from migrant workers in other states. Patna is the administrative and educational center. Industrial development has been limited; the state is investing in IT corridors near Patna and aviation infrastructure.',
    taxNote: 'Bihar does NOT levy Professional Tax. All Bihar cities are HRA tier-2 (40% exemption). The state has the lowest cost of living among major Indian states, which significantly amplifies post-tax purchasing power.',
    faqs: [
      {
        q: 'Are there meaningful Bihar tax advantages?',
        a: 'Yes, no Professional Tax (₹2,500/year saving) plus India\'s lowest cost of living. For remote workers earning metro-level salaries but living in Bihar, post-tax purchasing power is roughly 1.8-2x what the same salary buys in Mumbai. This is the largest cost-of-living tax arbitrage in India.',
      },
      {
        q: 'How does Bihar\'s remittance economy affect tax planning?',
        a: 'A large number of Bihari families have workers in other Indian states (and Gulf). Salary earned in another Indian state is taxed where earned (federal tax is national, PT is state-of-employer). Gulf remittances are tax-exempt in India for NRIs (180+ days outside). Many Bihari families optimize between local agricultural exempt income, India migrant-worker income, and Gulf-NRI income.',
      },
      {
        q: 'Is remote work from Bihar tax-efficient?',
        a: 'Extremely. A ₹20 lakh remote IT salary in Bihar provides roughly the same lifestyle as ₹35-40 lakh in Mumbai. Tax burden is identical (federal rates) but purchasing power dramatically higher. Many post-COVID remote workers have relocated to tier-2/3 Bihar cities (Bhagalpur, Muzaffarpur, Gaya) for this exact reason.',
      },
    ],
    metaKeywords: ['income tax calculator bihar', 'patna tax calculator', 'bihar income tax', 'no professional tax bihar'],
  },
  {
    slug: 'odisha',
    name: 'Odisha',
    capital: 'Bhubaneswar',
    emoji: '🏖️',
    monthlyProfessionalTax: 200,
    ptSlabsNote: 'Odisha PT: ₹150/mo for income ₹13,001-25,000; ₹200/mo for ₹25,001+. Maximum ₹2,500/year.',
    costOfLivingIndex: 55,
    hraTier: 'non-metro',
    avgSalaryMid: 900000,
    topIndustries: ['Mining (Coal, Iron Ore, Bauxite)', 'Steel', 'IT/ITES (Bhubaneswar)', 'Heavy Industry', 'Tourism'],
    marketContext: 'Odisha is India\'s mineral capital, producing over 50% of India\'s aluminum, iron ore, and chromite. Major steel and aluminum plants (Tata Steel Kalinganagar, Vedanta, NALCO). Bhubaneswar is emerging as an IT services hub (Infosys, TCS, Wipro have campuses). The state has aggressive industrial investment incentives.',
    taxNote: 'Odisha follows the standard progressive PT structure (max ₹2,500/year). All Odisha cities are HRA tier-2 (40% exemption). The state offers Investment Promotion Package incentives for new manufacturing, relevant for employers, not individual tax.',
    faqs: [
      {
        q: 'Is Bhubaneswar competitive with Bangalore for IT careers?',
        a: 'For early-to-mid career: yes on real-income basis. Bhubaneswar salaries run 25-30% below Bangalore but cost of living is 55-65% lower. The KIIT/IIT ecosystem produces strong tech talent, attracting GCC investment. For senior career and equity-driven roles, Bangalore still wins due to startup density and exit opportunities.',
      },
      {
        q: 'Does Odisha\'s mining economy affect tax planning?',
        a: 'Direct salaries in mining/steel/aluminum face standard Indian federal tax. The state offers significant industrial incentives (SGST credit, capital subsidy) to companies, which flow through to employee wages indirectly. For PSU employees (Coal India, NMDC, NALCO), Defined Benefit Pensions and PF contributions are typically more generous than private sector.',
      },
      {
        q: 'How does Odisha PT compare to other eastern states?',
        a: 'Odisha collects PT (₹2,500/year max), unlike neighboring Bihar (no PT). West Bengal has similar PT structure to Odisha. Odisha\'s PT is progressive (₹150 at lower income, ₹200 at higher). For salaried employees above ₹25K/month, the burden is identical to Maharashtra and Karnataka at the top.',
      },
    ],
    metaKeywords: ['income tax calculator odisha', 'bhubaneswar tax calculator', 'odisha professional tax', 'orissa income tax'],
  },
];

export function getStateBySlug(slug: string): IndiaStateData | undefined {
  return indiaStates.find((s) => s.slug === slug);
}
