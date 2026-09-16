# Batch pipeline — calctube programmatic SEO at scale

This directory contains the tooling for scaling calctube from hundreds to thousands of pages without losing 30+ min per batch to integration friction.

## The five entry types

| Type        | Target file                  | Page route                                           |
|-------------|------------------------------|------------------------------------------------------|
| `country`   | `src/data/mortgage-locales.ts` | `/finance/mortgage-calculator/[slug]/`               |
| `city`      | `src/data/india-cities.ts`     | `/finance/mortgage-calculator/cities/[slug]/`        |
| `currency`  | `src/data/currency-pairs.ts`   | `/conversions/currency/[slug]/`                      |
| `bank`      | `src/data/emi-banks.ts`        | `/finance/emi-calculator/[slug]/`                    |
| `citybank`  | `src/data/city-bank-grid.ts`   | `/finance/mortgage-calculator/cities/[city]/[bank]/` |

## End-to-end workflow per batch

1. **Fire agents in parallel** with prompts from `scripts/batch/prompts/<type>.md`. Each agent writes output to a `.tmp-<type>N.ts` file.
2. **Run the pipeline:** `node scripts/batch/run.cjs --type=<type> --file=.tmp-<type>N.ts` — lints (auto-fix), extends currencies if needed, inserts, builds.
3. **Deploy** if build is green: `CLOUDFLARE_API_TOKEN=... npx wrangler pages deploy dist --project-name=calctube --branch=main --commit-dirty=true`
4. **Spot-check** 5 random new pages in the browser.

## Scripts

### `lint.cjs <type> <tmp-file> [--fix]`

Validates a tmp file against the schema for that type. Catches all known agent drift modes:

- Preamble text before first `{`
- Trailing chatter after last `},`
- Multi-character emoji codes (e.g., `'LICHF'`)
- Zero rate values
- Wrong field names (auto-renames `topAngle` → `uniqueAngle`, `bestFor` → `productHighlights`, `trendNote` → `context`)
- Forbidden fields from other entry types (auto-drops)
- Bad slug prefixes (e.g., `home-loan-emi-calculator-trichy`)
- Slug duplicates within batch
- Slug collisions with existing data
- Missing required fields
- Unknown ISO 4217 codes in currency pairs (triggers `extend-currencies.cjs` hint)
- Unknown citySlug / bankSlug refs in citybank entries

With `--fix`, writes the corrected file back. Without `--fix`, runs as dry-run.

Exit code 0 = clean (or fully auto-fixed). Exit code 1 = blocking errors remain.

### `extend-currencies.cjs CODE1 CODE2 ...`

Auto-inserts new currency definitions into the `currencies` dict in `src/data/currency-pairs.ts`. Uses a static built-in dictionary of 60+ ISO 4217 codes. No paid APIs.

### `insert.cjs <type> <tmp-file>`

Inserts entries into the target data file at the helper-function marker. Indents to 2 spaces.

### `run.cjs --type=<type> --file=<tmp.ts>` or `--batch=<batch.json>`

Orchestrator. Runs lint → currency extend (if needed) → insert → build. Aborts on first failure.

`batch.json` format for multi-type runs:

```json
[
  { "type": "country", "file": ".tmp-countries5.ts" },
  { "type": "city",    "file": ".tmp-cities5.ts" },
  { "type": "currency","file": ".tmp-currencies5.ts" }
]
```

## Why this exists

Three rounds of agent fanout (50, 100, 100 pages) burned roughly 90 minutes of operator time on preventable fixes:

- Agent prepended `"I'll write the 20 entries..."` before the first `{` → build broke at the data file
- Agent used `emoji: 'LICHF'` instead of a single emoji char → invalid emoji string
- Agent set `personalLoanRate: { min: 0, max: 0, typical: 0 }` for HFCs that don't offer that product → divide-by-zero on the calc page
- Agent emitted `slug: 'home-loan-emi-calculator-trichy'` → broke `getStaticPaths` matching
- Agent used field names from a different entry type (`topAngle` instead of `uniqueAngle`, `bestFor` instead of `productHighlights`) → build broke
- Agent referenced a currency code (`JMD`, `XOF`, `RWF`) not yet in the `currencies` dict → undefined property access at build time
- Agent referenced `bankSlug: 'indian-overseas'` instead of the actual slug `'iob'` → city × bank page rendered with `bank` = undefined

The linter catches every one of these before they hit the build. The agent prompts in `prompts/` document them as forbidden so they shouldn't happen — but if they do, the linter auto-fixes the common ones.

## Speed target

| Step                  | Old (Round 3) | New (with this pipeline) |
|-----------------------|---------------|--------------------------|
| Agent fanout          | 15 min        | 15 min (unchanged)        |
| Read agent outputs    | 5 min         | 1 min                     |
| Fix preamble/emoji    | 8 min         | 0 (linter)               |
| Fix schema mismatch   | 12 min        | 0 (linter)               |
| Add currency codes    | 5 min         | 0 (extender)             |
| Insert + build        | 5 min         | 2 min (one-command)      |
| Deploy                | 1 min         | 1 min                    |
| **Total per 100 pages** | **~50 min** | **~20 min**              |

10K pages at the new pace ≈ 30 hours of pipeline runtime over multiple sessions.
