// Full-site SEO audit over dist/
// Reports: title/meta dupes, length issues, missing tags, multi-H1, missing canonical, missing schema, alt-text gaps
const fs = require('fs');
const path = require('path');

const DIST = path.resolve(__dirname, '..', 'dist');

// Walk all .html files
const htmlFiles = [];
function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) walk(p);
    else if (f.endsWith('.html')) htmlFiles.push(p);
  }
}
walk(DIST);
console.log(`Scanning ${htmlFiles.length} HTML files...\n`);

const titles = new Map();        // title -> [urls]
const metas = new Map();         // meta description -> [urls]
const issues = {
  missingTitle: [],
  titleTooShort: [],   // < 30 chars
  titleTooLong: [],    // > 60 chars
  duplicateTitle: [],
  missingMeta: [],
  metaTooShort: [],    // < 80 chars
  metaTooLong: [],     // > 160 chars
  duplicateMeta: [],
  missingCanonical: [],
  missingH1: [],
  multipleH1: [],
  missingSchema: [],
  imageWithoutAlt: [], // <img without alt OR alt=""
  insecureLinks: [],   // http:// links (not https)
};

const stats = {
  total: htmlFiles.length,
  withSchema: 0,
  withFAQSchema: 0,
  withBreadcrumb: 0,
};

for (const file of htmlFiles) {
  const url = '/' + path.relative(DIST, file).replace(/\\/g, '/').replace(/\/index\.html$/, '/').replace(/\.html$/, '/');
  const html = fs.readFileSync(file, 'utf-8');

  // Title
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : null;
  if (!title) issues.missingTitle.push(url);
  else {
    if (title.length < 30) issues.titleTooShort.push({ url, title, len: title.length });
    if (title.length > 60) issues.titleTooLong.push({ url, title, len: title.length });
    if (!titles.has(title)) titles.set(title, []);
    titles.get(title).push(url);
  }

  // Meta description (match content delimiter — apostrophes inside double-quoted content are valid HTML)
  const metaMatch = html.match(/<meta\s+name=["']description["']\s+content="([^"]*)"/i)
                 || html.match(/<meta\s+name=["']description["']\s+content='([^']*)'/i);
  const meta = metaMatch ? metaMatch[1].trim() : null;
  if (!meta) issues.missingMeta.push(url);
  else {
    if (meta.length < 80) issues.metaTooShort.push({ url, meta: meta.slice(0, 80), len: meta.length });
    if (meta.length > 160) issues.metaTooLong.push({ url, meta: meta.slice(0, 80), len: meta.length });
    if (!metas.has(meta)) metas.set(meta, []);
    metas.get(meta).push(url);
  }

  // Canonical
  if (!/<link\s+rel=["']canonical["']\s+href=/i.test(html)) issues.missingCanonical.push(url);

  // H1
  const h1Matches = [...html.matchAll(/<h1\b[^>]*>/gi)];
  if (h1Matches.length === 0) issues.missingH1.push(url);
  else if (h1Matches.length > 1) issues.multipleH1.push({ url, count: h1Matches.length });

  // Schema
  const jsonLdMatches = html.match(/<script\s+type=["']application\/ld\+json["']/gi);
  if (!jsonLdMatches) issues.missingSchema.push(url);
  else {
    stats.withSchema++;
    if (/"@type"\s*:\s*"FAQPage"/.test(html)) stats.withFAQSchema++;
    if (/"@type"\s*:\s*"BreadcrumbList"/.test(html)) stats.withBreadcrumb++;
  }

  // Images without alt (or empty alt — except decorative which should be deliberate)
  const imgs = [...html.matchAll(/<img\b[^>]*>/gi)];
  for (const img of imgs) {
    const tag = img[0];
    if (!/\balt=/i.test(tag)) issues.imageWithoutAlt.push({ url, img: tag.slice(0, 80) });
  }

  // Insecure links (http:// in href, excluding fragment / mailto / tel)
  const insecureMatches = [...html.matchAll(/href=["'](http:\/\/[^"']+)["']/gi)];
  for (const m of insecureMatches) {
    if (!m[1].includes('w3.org') && !m[1].includes('schema.org')) {
      issues.insecureLinks.push({ url, href: m[1] });
    }
  }
}

// Find duplicate titles + metas (more than 1 URL with same value)
for (const [title, urls] of titles.entries()) {
  if (urls.length > 1) issues.duplicateTitle.push({ title, count: urls.length, urls: urls.slice(0, 3) });
}
for (const [meta, urls] of metas.entries()) {
  if (urls.length > 1) issues.duplicateMeta.push({ meta: meta.slice(0, 80), count: urls.length, urls: urls.slice(0, 3) });
}

// REPORT
console.log('=== SEO AUDIT REPORT ===\n');
console.log(`Total pages:           ${stats.total}`);
console.log(`Pages with schema:     ${stats.withSchema} (${((stats.withSchema/stats.total)*100).toFixed(1)}%)`);
console.log(`Pages with FAQ schema: ${stats.withFAQSchema}`);
console.log(`Pages with breadcrumb: ${stats.withBreadcrumb}`);
console.log('');

const sections = [
  ['Missing title',       issues.missingTitle.length,    issues.missingTitle.slice(0, 5)],
  ['Title too short (<30)', issues.titleTooShort.length, issues.titleTooShort.slice(0, 5)],
  ['Title too long (>60)',  issues.titleTooLong.length,  issues.titleTooLong.slice(0, 5)],
  ['Duplicate titles',     issues.duplicateTitle.length, issues.duplicateTitle.slice(0, 5)],
  ['Missing meta description', issues.missingMeta.length, issues.missingMeta.slice(0, 5)],
  ['Meta too short (<80)',  issues.metaTooShort.length,  issues.metaTooShort.slice(0, 5)],
  ['Meta too long (>160)',  issues.metaTooLong.length,   issues.metaTooLong.slice(0, 5)],
  ['Duplicate meta description', issues.duplicateMeta.length, issues.duplicateMeta.slice(0, 5)],
  ['Missing canonical',     issues.missingCanonical.length, issues.missingCanonical.slice(0, 5)],
  ['Missing H1',            issues.missingH1.length,     issues.missingH1.slice(0, 5)],
  ['Multiple H1s',          issues.multipleH1.length,    issues.multipleH1.slice(0, 5)],
  ['Missing schema',        issues.missingSchema.length, issues.missingSchema.slice(0, 5)],
  ['Image without alt',     issues.imageWithoutAlt.length, issues.imageWithoutAlt.slice(0, 5)],
  ['Insecure (http://) links', issues.insecureLinks.length, issues.insecureLinks.slice(0, 5)],
];

for (const [label, count, examples] of sections) {
  const severity = count === 0 ? '✅' : (count > 50 ? '🔴' : count > 10 ? '🟡' : '🟢');
  console.log(`${severity} ${label}: ${count}`);
  if (count > 0) {
    for (const ex of examples) {
      console.log('   ', typeof ex === 'string' ? ex : JSON.stringify(ex).slice(0, 140));
    }
  }
}

// Dump full lists to JSON for fix scripts
fs.writeFileSync(path.resolve(__dirname, '..', 'logs', 'seo-audit-report.json'), JSON.stringify(issues, null, 2));
console.log('\nFull report written to logs/seo-audit-report.json');
