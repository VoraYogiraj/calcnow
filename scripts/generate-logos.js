/**
 * Generate the full favicon + app-icon suite from public/logo-mark.svg.
 * Output: public/{favicon-16,32,96,...,apple-touch-icon,android-chrome-192,512,logo}.png
 *
 * Usage: node scripts/generate-logos.js
 *        npm run logos
 *
 * Run whenever you change public/logo-mark.svg.
 */
import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const sourceSvg = path.join(projectRoot, 'public', 'logo-mark.svg');
const outDir = path.join(projectRoot, 'public');

if (!fs.existsSync(sourceSvg)) {
  console.error(`❌ Source SVG not found at ${sourceSvg}`);
  process.exit(1);
}

const svg = fs.readFileSync(sourceSvg, 'utf-8');

/**
 * Each entry: filename → pixel width (height matches because the source is square).
 * Naming follows the de-facto-standard pattern that favicon generators (RealFaviconGenerator,
 * Inkscape, RealFaviconGenerator) and the Web App Manifest spec use.
 */
const targets = [
  // Browser tabs / OS tray icons
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon-96x96.png', size: 96 },

  // iOS Safari "Add to Home Screen" (180×180 is the modern single-size recommendation)
  { name: 'apple-touch-icon.png', size: 180 },

  // Android Chrome / PWA manifest icons
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },

  // Microsoft Windows tile
  { name: 'mstile-150x150.png', size: 150 },

  // schema.org Organization logo — needs to be square + at least 112px;
  // 512×512 is the canonical "company logo" raster for rich results.
  { name: 'logo.png', size: 512 },

  // Open Graph alt that some scrapers fall back to
  { name: 'logo-1200.png', size: 1200 },
];

console.log(`📐 Rendering ${targets.length} sizes from logo-mark.svg…`);

for (const { name, size } of targets) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: size },
    background: 'transparent',
  });
  const png = resvg.render().asPng();
  const outPath = path.join(outDir, name);
  fs.writeFileSync(outPath, png);
  const kb = (png.length / 1024).toFixed(1);
  console.log(`  ✓ ${name.padEnd(34)} ${String(size).padStart(4)}px  ${kb.padStart(6)} KB`);
}

console.log('\n✅ All logo assets generated.');
console.log('Don\'t forget to commit the new PNG files in public/ along with logo-mark.svg.');
