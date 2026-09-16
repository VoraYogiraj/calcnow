#!/usr/bin/env node
// Insert entries from a tmp file into the target data file, before the helper marker.
//
// Usage:  node scripts/batch/insert.cjs <type> <tmp-file>

const fs = require('fs');
const path = require('path');
const { schemas } = require('./schema.cjs');

const [, , type, tmpPath] = process.argv;
if (!type || !tmpPath || !schemas[type]) {
  console.error('Usage: node scripts/batch/insert.cjs <type> <tmp-file>');
  process.exit(2);
}

const schema = schemas[type];
const projectRoot = path.resolve(__dirname, '..', '..');
const targetFile = path.join(projectRoot, schema.targetFile);

const original = fs.readFileSync(targetFile, 'utf8');
const newEntries = fs.readFileSync(path.resolve(tmpPath), 'utf8').trim();
const idx = original.indexOf(schema.marker);
if (idx === -1) {
  console.error(`Marker not found in ${schema.targetFile}: ${JSON.stringify(schema.marker.slice(0, 40))}`);
  process.exit(1);
}
const before = original.slice(0, idx);
const after = original.slice(idx);
const indented = newEntries.split('\n').map(l => l.length ? '  ' + l : l).join('\n');
fs.writeFileSync(targetFile, before + indented + '\n' + after);

const count = (newEntries.match(/^{/gm) || []).length;
console.log(`✅ Inserted ${count} entries into ${schema.targetFile}`);
