/**
 * Generate OG image PNG from the source SVG.
 * Usage: node scripts/generate-og-png.js
 *
 * Output: public/og-default.png (1200×630)
 * Run this whenever you change og-default.svg.
 */
import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const svgPath = path.join(projectRoot, 'public', 'og-default.svg');
const pngPath = path.join(projectRoot, 'public', 'og-default.png');

if (!fs.existsSync(svgPath)) {
  console.error(`❌ Source SVG not found at ${svgPath}`);
  process.exit(1);
}

const svg = fs.readFileSync(svgPath, 'utf-8');

const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1200 },
  font: {
    loadSystemFonts: true,
    defaultFontFamily: 'Inter',
  },
  background: '#fafafa',
});

const pngBuffer = resvg.render().asPng();
fs.writeFileSync(pngPath, pngBuffer);

const sizeKB = (pngBuffer.length / 1024).toFixed(1);
console.log(`✅ Generated public/og-default.png (${sizeKB} KB, 1200×630)`);
