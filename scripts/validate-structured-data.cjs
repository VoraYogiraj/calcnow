const fs = require('fs');
const seoFile = 'src/lib/seo.ts';
if (!fs.existsSync(seoFile)) { console.error('FAIL: ' + seoFile); process.exit(1); }
const c = fs.readFileSync(seoFile, 'utf8');
const required = [
  'buildOrganizationSchema','buildEditorialTeamSchema','buildSpeakableSchema',
  'buildHowToSchema','buildWebsiteSchema','buildCalculatorSchema','buildBreadcrumbSchema','buildFAQSchema','SITE','slashPath','CalculatorMeta'
];
const missing = required.filter(x => !c.includes(x));
if (missing.length) { console.error('FAIL: missing exports:', missing.join(', ')); process.exit(1); }
console.log('PASS: structured-data exports verified:', required.length, 'items');
console.log('NOTE: Full Schema.org / Google validation requires live URL or external tool (P2-01 pending authorization/deploy).');
