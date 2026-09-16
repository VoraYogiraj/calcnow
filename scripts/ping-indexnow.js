/**
 * Ping IndexNow with all URLs from the sitemap.
 * Auto-pings Bing, Yandex, Seznam, Naver on every deploy.
 *
 * Usage: node scripts/ping-indexnow.js
 *        npm run indexnow
 *        (Or auto-run via postbuild — wired in package.json)
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');

const INDEXNOW_KEY = '074ef616d2534c558a1e7b9ee84fd1fc';
const HOST = 'calctube.com';
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;

async function main() {
  // Read sitemap from dist
  const sitemapPath = resolve(projectRoot, 'dist', 'sitemap-0.xml');
  let sitemapXml;
  try {
    sitemapXml = readFileSync(sitemapPath, 'utf-8');
  } catch (e) {
    console.warn('⚠️  sitemap-0.xml not found — skipping IndexNow ping (build still succeeds).');
    return; // Exit 0 — never fail the build over a missing sitemap
  }

  const urls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  console.log(`📍 Found ${urls.length} URLs in sitemap`);

  if (urls.length === 0) {
    console.warn('⚠️  No URLs found in sitemap — skipping IndexNow ping.');
    return;
  }

  const payload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };

  // Ping the general IndexNow endpoint (fans out to Bing/Yandex/Seznam/Naver)
  const endpoints = [
    { name: 'IndexNow (general)', url: 'https://api.indexnow.org/IndexNow' },
    { name: 'Bing', url: 'https://www.bing.com/IndexNow' },
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetch(ep.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(payload),
      });
      if (res.ok || res.status === 202) {
        console.log(`✅ ${ep.name}: ${res.status} ${res.statusText} (${urls.length} URLs submitted)`);
      } else {
        console.warn(`⚠️  ${ep.name}: ${res.status} ${res.statusText}`);
      }
    } catch (err) {
      console.error(`❌ ${ep.name}: ${err.message}`);
    }
  }
}

main();
