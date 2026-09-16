#!/usr/bin/env node
// Orchestrator — runs the full batch pipeline against one or more tmp files.
//
// Usage:
//   node scripts/batch/run.cjs --type=country --file=.tmp-countries4.ts
//   node scripts/batch/run.cjs --batch=batch4.json     # multi-file batch
//
// Steps per file:
//   1. lint (auto-fix mode)
//   2. extend currencies if needed (currency type only)
//   3. insert into target data file
//   4. quick syntax check (eval the data file via tsx/ts-node? — skip, rely on build)
//
// Final step: build + report new page count

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const args = Object.fromEntries(process.argv.slice(2).map(a => {
  const [k, v] = a.replace(/^--/, '').split('=');
  return [k, v ?? true];
}));

let jobs = [];

if (args.batch) {
  jobs = JSON.parse(fs.readFileSync(args.batch, 'utf8'));
} else if (args.type && args.file) {
  jobs = [{ type: args.type, file: args.file }];
} else {
  console.error('Usage: node scripts/batch/run.cjs --type=<type> --file=<tmp.ts>');
  console.error('   or: node scripts/batch/run.cjs --batch=<batch.json>');
  process.exit(2);
}

function run(cmd) {
  console.log(`\n$ ${cmd}`);
  try {
    const out = execSync(cmd, { stdio: 'pipe', encoding: 'utf8' });
    process.stdout.write(out);
    return { code: 0, out };
  } catch (e) {
    process.stdout.write(e.stdout || '');
    process.stderr.write(e.stderr || '');
    return { code: e.status ?? 1, out: e.stdout || '' };
  }
}

let totalInserted = 0;

for (const job of jobs) {
  console.log(`\n=== Job: ${job.type} <- ${job.file} ===`);

  // Step 1: lint with auto-fix
  let r = run(`node scripts/batch/lint.cjs ${job.type} ${job.file} --fix`);
  if (r.code !== 0) {
    // Check if currencies need extending
    const missingMatch = r.out.match(/extend-currencies\.cjs ([A-Z\s]+)/);
    if (job.type === 'currency' && missingMatch) {
      const codes = missingMatch[1].trim().split(/\s+/);
      console.log(`\n→ Auto-extending currencies: ${codes.join(' ')}`);
      run(`node scripts/batch/extend-currencies.cjs ${codes.join(' ')}`);
      // Re-lint
      r = run(`node scripts/batch/lint.cjs ${job.type} ${job.file} --fix`);
    }
    if (r.code !== 0) {
      console.error(`❌ Lint failed for ${job.file} — fix manually and retry.`);
      process.exit(1);
    }
  }

  // Step 2: insert
  r = run(`node scripts/batch/insert.cjs ${job.type} ${job.file}`);
  if (r.code !== 0) {
    console.error(`❌ Insert failed for ${job.file}.`);
    process.exit(1);
  }
  const match = r.out.match(/Inserted (\d+) entries/);
  if (match) totalInserted += Number(match[1]);
}

console.log(`\n=== ${totalInserted} entries inserted across ${jobs.length} jobs ===`);
console.log('\n→ Running build...');
const buildResult = run('npm run build');
if (buildResult.code !== 0) {
  console.error('❌ Build failed. Inspect the data files and re-run build manually.');
  process.exit(1);
}

console.log('\n✅ Pipeline complete. Deploy with: npx wrangler pages deploy dist --project-name=calctube --branch=main --commit-dirty=true');
