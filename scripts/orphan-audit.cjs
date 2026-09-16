// Find pages in dist/ that have ZERO inbound internal links from other pages
const fs = require('fs');
const path = require('path');
const DIST = path.resolve(__dirname, '..', 'dist');

const htmlFiles = [];
function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (f.endsWith('.html')) htmlFiles.push(p);
  }
}
walk(DIST);

const urlOf = (file) => '/' + path.relative(DIST, file).replace(/\\/g, '/').replace(/\/index\.html$/, '/').replace(/\.html$/, '/');

const allUrls = new Set(htmlFiles.map(urlOf));

// Build link map: url -> set of urls it links to
const inbound = new Map();   // target -> Set<source>
for (const url of allUrls) inbound.set(url, new Set());

const linkRe = /href=["'](\/[^"'#?]*)["']/g;

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf-8');
  const source = urlOf(file);
  const links = new Set();
  let m;
  while ((m = linkRe.exec(html)) !== null) {
    let href = m[1];
    // Normalize: ensure trailing slash for matching
    if (!href.endsWith('/') && !href.includes('.')) href += '/';
    links.add(href);
  }
  for (const target of links) {
    if (allUrls.has(target) && target !== source && inbound.has(target)) {
      inbound.get(target).add(source);
    }
  }
}

const orphans = [];
for (const [url, srcs] of inbound.entries()) {
  if (srcs.size === 0 && url !== '/') orphans.push(url);
}

console.log(`Scanned ${htmlFiles.length} pages.`);
console.log(`Orphan pages (no inbound internal links): ${orphans.length}`);
if (orphans.length > 0) {
  // Group by prefix
  const byPrefix = {};
  for (const u of orphans) {
    const p = u.match(/^(\/[a-z-]+(?:\/[a-z-]+)?)/);
    const key = p ? p[1] : u;
    if (!byPrefix[key]) byPrefix[key] = 0;
    byPrefix[key]++;
  }
  console.log('\nBy URL prefix:');
  for (const [k, n] of Object.entries(byPrefix).sort((a, b) => b[1] - a[1])) {
    console.log(' ', n.toString().padStart(4), k);
  }
  console.log('\nSample orphans:');
  for (const u of orphans.slice(0, 15)) console.log('  ', u);

  fs.writeFileSync(path.resolve(__dirname, '..', 'logs', 'orphan-pages.json'), JSON.stringify(orphans, null, 2));
}
