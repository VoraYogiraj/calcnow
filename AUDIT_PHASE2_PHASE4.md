PHASE 2 + PHASE 4 AUDIT — CALCULATOR COMPONENTS
Directory: D:\Projects\calctube\src\components\calculators/
Files read fully (14): BmiCalculator.tsx, EmiCalculator.tsx, MortgageCalculator.tsx, SipCalculator.tsx, FdCalculator.tsx, CompoundInterestCalculator.tsx, GstCalculator.tsx, PercentageCalculator.tsx, ScientificCalculator.tsx, AgeCalculator.tsx, CurrencyConverter.tsx, BudgetCalculator.tsx, TdeeCalculator.tsx, IncomeTaxIndiaCalculator.tsx
Status: NO FILES MODIFIED. Read-only audit.
Date: 2026-10-21

=== 1. BmiCalculator.tsx ===
Path: D:\Projects\calctube\src\components\calculators\BmiCalculator.tsx (175 lines)
Inputs: heightCm/weightKg (metric, number); feet/inches/lbs (imperial, number); unit toggle.
Formula: BMI = weightKg / (heightM^2) (line 18)
Outputs: bmi, category, bgColor, textColor, description, position (lines 12-13, 46-48)
Validation: heightM<=0 || weightKg<=0 -> placeholder (line 15-17); input min/max set (line 88, 95, 107, 113, 122).
External data: None.
Defects: Line 16 forces category='Normal' on invalid input (misleading UX); otherwise correct.

=== 2. EmiCalculator.tsx ===
Path: D:\Projects\calctube\src\components\calculators\EmiCalculator.tsx (138 lines)
Inputs: principal (number), rate (annual %), years (select 1-30).
Formula: Standard EMI (line 27-28); zero-rate/zero-month handled (lines 23, 24-26).
Outputs: emi, totalInterest, totalPaid (line 21-29); derived percentages (line 37-38).
Validation: Input ranges; zero cases handled.
External: None.
Defects: None critical; minor floating-point rounding possible for totalInterest.

=== 3. MortgageCalculator.tsx ===
Path: D:\Projects\calctube\src\components\calculators\MortgageCalculator.tsx (742 lines)
Inputs: loanAmount, homeValue, interestRate, loanTerm, propertyTaxRate, insuranceRate, hoaFee, pmiRatePct, extraPayment, biweekly, currency props.
Formula: PI standard amortization (58-60); schedule iteratively (62-75); LTV/PMI logic (191-196); extra/biweekly (200-210); yearly summary (213-230).
Outputs: monthlyPayment, totalInterest, totalPaid, schedule[], totalMonthly, yearlySummary, extraSavings, breakdown.
Validation: URL params parsed safely (144-155); rate=0/numPayments=0 handled (53-56); balance capped at 0 (line 73); loop cap (line 98).
External: Uses currency library (currency.ts) for formatting; no direct network fetch.
Defects: Amortization balance may not reach exactly 0 due to float accumulation (mitigated by Math.max(0, balance) line 73); URL params unvalidated ranges (low risk).

=== 4. SipCalculator.tsx ===
Path: D:\Projects\calctube\src\components\calculators\SipCalculator.tsx (164 lines)
Inputs: monthlyAmount, annualReturn, years, stepUpPct.
Formula: Monthly compound (28-30); step-up annually (line 39).
Outputs: maturity value, invested, returns, chart data.
Validation: min/max on inputs; years >=1.
External: None.
Defects: None critical.

=== 5. FdCalculator.tsx ===
Path: D:\Projects\calctube\src\components\calculators\FdCalculator.tsx (124 lines)
Inputs: principal, rate, tenureMonths, compound (4|12|1).
Formula: maturity = P*(1+r/n)^(n*t) (line 24); t = tenureMonths/12.
Outputs: maturity, principal, interest.
Validation: Input ranges; compound enum.
External: None.
Defects: None.

=== 6. CompoundInterestCalculator.tsx ===
Path: D:\Projects\calctube\src\components\calculators\CompoundInterestCalculator.tsx (242 lines)
Inputs: principal, rate, years, monthlyContribution, freq (1,2,4,12,365).
Formula: Per period: balance += contrib*(12/n); balance *= 1+r/n (76-82).
Outputs: final balance, contributed, interest, yearly chart.
Validation: Input ranges; freq enum.
External: Uses currency library (currency.ts) for formatting and currency selection.
Defects: Daily frequency (365) with max 60 years yields ~21900 iterations — acceptable for client-side but could cause brief lag.

=== 7. GstCalculator.tsx ===
Path: D:\Projects\calctube\src\components\calculators\GstCalculator.tsx (147 lines)
Inputs: amount, rate, mode ('exclusive'|'inclusive').
Formula: Exclusive: gst=amount*rate/100; total=amount+gst. Inclusive: net=amount*100/(100+rate); gst=total-net (14-27). Split CGST/SGST/IGST (30-32).
Outputs: netAmount, gstAmount, totalAmount, split values.
Validation: min/max; rate max 100.
External: None.
Defects: None.

=== 8. PercentageCalculator.tsx ===
Path: D:\Projects\calctube\src\components\calculators\PercentageCalculator.tsx (140 lines)
Inputs: mode ('of'|'is-percent-of'|'change'), number pairs.
Formula: 'of': pct/100*base; 'is-percent-of': whole===0?NaN:(part/whole)*100; 'change': from===0?NaN:((to-from)/abs(from))*100.
Outputs: value, label, direction indicator.
Validation: Zero-division guards (30,34); fmtNum handles non-finite (7-8).
External: None.
Defects: None.

=== 9. ScientificCalculator.tsx ===
Path: D:\Projects\calctube\src\components\calculators\ScientificCalculator.tsx (152 lines)
Inputs: expression string, deg/rad toggle.
Formula: Parser toJs() (5-16); whitelist ALLOWED_WORDS (18,25); new Function with restricted scope (43).
Outputs: preview value, error flag.
Validation: Regex check (line 25); factorial limits (line 35); non-finite rejected (line 45).
External: None.
Defects: Uses new Function() with strict whitelist — risk profile acceptable; no injection vulnerability detected.

=== 10. AgeCalculator.tsx ===
Path: D:\Projects\calctube\src\components\calculators\AgeCalculator.tsx (166 lines)
Inputs: dob (date string), asOf (date string, default today).
Formula: Year/month/day with borrow logic (35-47); totalDays from ms/86400000 (50); next birthday (55-60).
Outputs: years, months, days, totalDays, totalWeeks, totalHours, nextBirthdayDate, nextBirthdayDays, valid.
Validation: Empty/invalid dates return empty; asOf < dob returns empty; DOB max={today}.
External: None.
Defects: MINOR — end-of-month DOB day calculation can differ from strict calendar-anchored expectation (e.g., DOB 31 Jan to 30 Mar yields 27 days vs 30 days under an alternative calendar method). This is an ambiguity, not a major error.

=== 11. CurrencyConverter.tsx ===
Path: D:\Projects\calctube\src\components\calculators\CurrencyConverter.tsx (174 lines)
Inputs: Props (currency pair, rate, lastUpdated); state amount, direction.
Formula: amount * effectiveRate or / effectiveRate (56-59); effectiveRate = liveRate ?? rate (54).
Outputs: Converted value, common amounts table, direction toggle.
Validation: Fetch errors caught (50-51); rate validated >0 (43); amount min=0.
External: YES — fetch to open.er-api.com/v6/latest/${fromCode} (line 38). No API key.
Defects: No fetch timeout (minor reliability); URL constructed from props (controlled source); basic rate validation only.

=== 12. BudgetCalculator.tsx ===
Path: D:\Projects\calctube\src\components\calculators\BudgetCalculator.tsx (62 lines)
Inputs: income, needsPct, wantsPct.
Formula: savings = max(0, 100 - needs - wants); amounts = income * pct/100 (8, 12-15).
Outputs: 3 budget rows with percentages/amounts; warning if >100%.
Validation: min=0 max=100 via Math.min (34, 39); over-100 warning (56).
External: None.
Defects: None.

=== 13. TdeeCalculator.tsx ===
Path: D:\Projects\calctube\src\components\calculators\TdeeCalculator.tsx (283 lines)
Inputs: unit, sex, age, height, weight, activityIdx, goal.
Formula: BMR Mifflin-St Jeor (27-31); TDEE = round(BMR * multiplier) (57-60); goal = max(1200, TDEE + adjustment) (63-65); macros fixed ratios 30/25/45% (69-74).
Outputs: TDEE, goal target, BMR, macro grams, bar visualization.
Validation: Age 10-90; height/weight ranges; macro max(0, carbs).
External: None.
Defects: Unused variable `proteinKcal` line 69 (dead code, no functional impact).

=== 14. IncomeTaxIndiaCalculator.tsx ===
Path: D:\Projects\calctube\src\components\calculators\IncomeTaxIndiaCalculator.tsx (286 lines)
Inputs: grossIncome, ageGroup, 80C/80D/HRA/homeLoanInterest/NPS/extra, monthlyProfessionalTax prop, stateName prop.
Formula: New regime slabs + rebate <=12L + surcharge + 4% cess (28-54); old regime age-based slabs + rebate <=5L + surcharge + cess (59-98). Deductions capped (117-118).
Outputs: oldResult, newResult, recommendation ('old'/'new'), savings amount.
Validation: Deduction caps via Math.min (217-228); taxable = max(0, gross - deductions) (119, 132).
External: None.
Defects: None critical. Tax logic mirrors AdvanceTaxCalculator (consistent by design).

=== SUMMARY ===
Critical defects: 0
Notable defects / observations:
- BmiCalculator: Invalid-state label forced to 'Normal' (line 16) — misleading.
- AgeCalculator: End-of-month DOB day ambiguity (minor calendar difference).
- TdeeCalculator: Dead code variable `proteinKcal` (line 69).
- CurrencyConverter: No fetch timeout; uses external open.er-api.com (line 38).
- ScientificCalculator: `new Function()` with strict whitelist — acceptable risk.
- MortgageCalculator: Float accumulation in amortization (mitigated by Math.max(0,balance)).
External data usage: Only CurrencyConverter uses a network endpoint. All others are fully self-contained.
No files were modified during this audit.
