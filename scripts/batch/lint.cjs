#!/usr/bin/env node
// Lint + auto-fix a .tmp-*.ts batch file before it's inserted into the data file.
//
// Usage:  node scripts/batch/lint.cjs <type> <tmp-file> [--fix]
//   type: country | city | currency | bank | citybank
//   --fix: write auto-fixed file back; otherwise dry-run.
//
// Exits 0 if clean (or fully auto-fixed), non-zero if blocking errors remain.

const fs = require('fs');
const path = require('path');
const { schemas, stripQ } = require('./schema.cjs');

const [, , type, tmpPath, ...flags] = process.argv;
const shouldFix = flags.includes('--fix');

if (!type || !tmpPath || !schemas[type]) {
  console.error('Usage: node scripts/batch/lint.cjs <country|city|currency|bank|citybank> <tmp-file> [--fix]');
  process.exit(2);
}

const schema = schemas[type];
const projectRoot = path.resolve(__dirname, '..', '..');
const absTmp = path.resolve(tmpPath);
let src = fs.readFileSync(absTmp, 'utf8');

const issues = []; // { sev: 'error'|'warn'|'fixed', entryIdx: number|null, msg }
function log(sev, idx, msg) { issues.push({ sev, entryIdx: idx, msg }); }

// 1. Strip preamble — any text before the first `{`
const firstBrace = src.indexOf('{');
if (firstBrace > 0) {
  const preamble = src.slice(0, firstBrace).trim();
  if (preamble.length > 0) {
    log('fixed', null, `Stripped preamble: "${preamble.slice(0, 80)}${preamble.length > 80 ? '...' : ''}"`);
    src = src.slice(firstBrace);
  }
}

// 2. Strip trailing chatter — anything after the final `},`
const lastClose = src.lastIndexOf('},');
if (lastClose !== -1 && lastClose < src.length - 2) {
  const trailing = src.slice(lastClose + 2).trim();
  if (trailing.length > 0 && !trailing.startsWith('//')) {
    log('fixed', null, `Stripped trailing: "${trailing.slice(0, 80)}"`);
    src = src.slice(0, lastClose + 2);
  }
}

// 3. Split into entry blocks. Entries are delimited by `^},$` at column 0 OR 2 (indent-agnostic).
const entryBlocks = [];
const re = /^(\s*\{[\s\S]*?\n\s*\}),?\s*$/gm;
let m;
let entryStart = 0;
// Simpler: split on `^},\s*$` then re-attach the `}` to each.
const parts = src.split(/^\},\s*$/m);
for (const p of parts) {
  const t = p.trim();
  if (t.length === 0) continue;
  // Re-attach closing },
  const block = t + '\n},';
  if (!block.includes('{')) continue;
  entryBlocks.push(block);
}

// 4. For each entry, check fields
const seenSlugs = new Set();
const fixedEntries = [];

function extractField(block, field) {
  // Match `field: value,` where value is until end-of-line balanced with quote/brace tracking
  // Simple approach: regex up to comma at end of value line. Works for primitive + simple objects.
  const lineRe = new RegExp(`^\\s+${field}:\\s*([^\\n]+?),?\\s*$`, 'm');
  const match = block.match(lineRe);
  return match ? match[1].replace(/,\s*$/, '').trim() : null;
}

function extractObjectField(block, field) {
  // For `field: { min: 8, max: 10, typical: 9 }`
  const re = new RegExp(`${field}:\\s*\\{([^}]*)\\}`);
  const match = block.match(re);
  if (!match) return null;
  const obj = {};
  for (const pair of match[1].split(',')) {
    const [k, v] = pair.split(':').map(s => s.trim());
    if (k && v !== undefined) obj[k] = Number(v) || v;
  }
  return obj;
}

for (let i = 0; i < entryBlocks.length; i++) {
  let block = entryBlocks[i];

  // Auto-fix common renames (legacy field names -> canonical)
  const renames = {
    trendNote: 'context',
    topAngle: schema.required.includes('uniqueAngle') ? 'uniqueAngle' : null,
    bestFor: schema.required.includes('productHighlights') ? 'productHighlights' : null,
  };
  for (const [oldName, newName] of Object.entries(renames)) {
    if (newName && new RegExp(`^\\s+${oldName}:`, 'm').test(block)) {
      block = block.replace(new RegExp(`(^\\s+)${oldName}:`, 'm'), `$1${newName}:`);
      log('fixed', i, `Renamed '${oldName}' -> '${newName}'`);
    }
  }

  // Drop forbidden fields (line-based)
  for (const forbiddenField of schema.forbidden) {
    const lineRe = new RegExp(`^\\s+${forbiddenField}:[^\\n]*\\n`, 'gm');
    if (lineRe.test(block)) {
      block = block.replace(lineRe, '');
      log('fixed', i, `Dropped forbidden field '${forbiddenField}'`);
    }
  }

  // Check required fields
  for (const field of schema.required) {
    const re = new RegExp(`(^\\s+|, )${field}:`, 'm');
    if (!re.test(block)) {
      log('error', i, `Missing required field '${field}'`);
    }
  }

  // Apply field rules
  for (const rule of schema.rules || []) {
    const val = extractField(block, rule.field);
    if (val === null) continue; // missing already flagged
    try {
      if (!rule.test(val)) {
        log('error', i, `${rule.field}=${val.slice(0, 40)} — ${rule.msg}`);
      }
    } catch (e) {
      log('error', i, `${rule.field} rule threw: ${e.message}`);
    }
  }

  // Apply nested object rules (e.g., bank rate objects)
  for (const rule of schema.nestedRules || []) {
    const obj = extractObjectField(block, rule.field);
    if (!obj) continue;
    for (const sub of rule.subfields) {
      const v = obj[sub];
      if (v === undefined) continue;
      if (!rule.test(v)) {
        log('error', i, `${rule.field}.${sub}=${v} — ${rule.msg}`);
      }
    }
  }

  // Track duplicate slugs within batch
  if (schema.slugField) {
    const slug = stripQ(extractField(block, schema.slugField) || '');
    if (slug) {
      if (seenSlugs.has(slug)) {
        log('error', i, `Duplicate slug '${slug}' within batch`);
      }
      seenSlugs.add(slug);
    }
  }

  fixedEntries.push(block);
}

// 5. Check slug collisions against existing target file
if (schema.slugField && fs.existsSync(path.join(projectRoot, schema.targetFile))) {
  const existing = fs.readFileSync(path.join(projectRoot, schema.targetFile), 'utf8');
  const existingSlugs = new Set();
  const slugRe = new RegExp(`${schema.slugField}:\\s*'([^']+)'`, 'g');
  let mm;
  while ((mm = slugRe.exec(existing)) !== null) existingSlugs.add(mm[1]);

  for (const slug of seenSlugs) {
    if (existingSlugs.has(slug)) {
      // Find which entry it's in
      const idx = fixedEntries.findIndex(b => new RegExp(`${schema.slugField}:\\s*'${slug}'`).test(b));
      log('error', idx, `Slug '${slug}' already exists in ${schema.targetFile}`);
    }
  }
}

// 6. For citybank: check referential integrity
if (type === 'citybank') {
  const citiesSrc = fs.readFileSync(path.join(projectRoot, 'src/data/india-cities.ts'), 'utf8');
  const banksSrc = fs.readFileSync(path.join(projectRoot, 'src/data/emi-banks.ts'), 'utf8');
  const cityRe = /slug:\s*'([^']+)'/g;
  const bankRe = /slug:\s*'([^']+)'/g;
  const knownCities = new Set();
  const knownBanks = new Set();
  let mm;
  while ((mm = cityRe.exec(citiesSrc)) !== null) knownCities.add(mm[1]);
  while ((mm = bankRe.exec(banksSrc)) !== null) knownBanks.add(mm[1]);

  for (let i = 0; i < fixedEntries.length; i++) {
    const cs = stripQ(extractField(fixedEntries[i], 'citySlug') || '');
    const bs = stripQ(extractField(fixedEntries[i], 'bankSlug') || '');
    if (cs && !knownCities.has(cs)) log('error', i, `citySlug '${cs}' not found in india-cities.ts`);
    if (bs && !knownBanks.has(bs)) log('error', i, `bankSlug '${bs}' not found in emi-banks.ts`);
  }
}

// 7. For currency pairs: check that from/to codes exist in currencies dict
if (type === 'currency') {
  const currSrc = fs.readFileSync(path.join(projectRoot, 'src/data/currency-pairs.ts'), 'utf8');
  const dictMatch = currSrc.match(/currencies:\s*Record<string,\s*Currency>\s*=\s*\{([\s\S]*?)\n\};/);
  const known = new Set();
  if (dictMatch) {
    const codeRe = /^\s+([A-Z]{3}):\s*\{/gm;
    let mm;
    while ((mm = codeRe.exec(dictMatch[1])) !== null) known.add(mm[1]);
  }
  const missing = new Set();
  for (let i = 0; i < fixedEntries.length; i++) {
    const fromV = stripQ(extractField(fixedEntries[i], 'from') || '');
    const toV = stripQ(extractField(fixedEntries[i], 'to') || '');
    if (fromV && !known.has(fromV)) { log('error', i, `from='${fromV}' not in currencies dict`); missing.add(fromV); }
    if (toV && !known.has(toV)) { log('error', i, `to='${toV}' not in currencies dict`); missing.add(toV); }
  }
  if (missing.size > 0) {
    log('warn', null, `Run: node scripts/batch/extend-currencies.cjs ${[...missing].join(' ')}`);
  }
}

// 8. Reassemble fixed output
const fixedOutput = fixedEntries.join('\n') + '\n';

// Print report
const errors = issues.filter(i => i.sev === 'error');
const warns = issues.filter(i => i.sev === 'warn');
const fixed = issues.filter(i => i.sev === 'fixed');

console.log(`\n=== Lint report: ${type} batch (${entryBlocks.length} entries) ===`);
console.log(`  Auto-fixed: ${fixed.length}`);
console.log(`  Warnings:   ${warns.length}`);
console.log(`  Errors:     ${errors.length}`);

const grouped = {};
for (const i of issues) {
  const key = `[${i.sev}]${i.entryIdx !== null ? ` entry ${i.entryIdx}` : ''}`;
  if (!grouped[key]) grouped[key] = [];
  grouped[key].push(i.msg);
}
for (const [k, msgs] of Object.entries(grouped)) {
  console.log(`\n  ${k}`);
  for (const m of msgs.slice(0, 10)) console.log(`    - ${m}`);
  if (msgs.length > 10) console.log(`    ... and ${msgs.length - 10} more`);
}

if (shouldFix) {
  fs.writeFileSync(absTmp, fixedOutput);
  console.log(`\n✅ Wrote fixed file: ${absTmp}`);
}

process.exit(errors.length > 0 ? 1 : 0);
