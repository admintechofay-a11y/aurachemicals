const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'docs', 'redesign', 'screenshots', 'baseline');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const routes = [
  { name: 'home', path: '/' },
  { name: 'about', path: '/about-us' },
  { name: 'mission', path: '/our-mission' },
  { name: 'products', path: '/products' },
  { name: 'product_detail', path: '/products/detail/aceclofenac' },
  { name: 'industries', path: '/industries' },
  { name: 'services', path: '/services' },
  { name: 'quote', path: '/get-a-quote' },
  { name: 'contact', path: '/contact' },
  { name: 'privacy', path: '/privacy-policy' },
];

const viewports = [
  { name: '1440', size: '1440,900' },
  { name: '820', size: '820,1180' },
  { name: '390', size: '390,844' },
];

console.log('Starting full baseline screenshot capture across 10 routes and 3 viewports (30 captures)...');

for (const route of routes) {
  for (const vp of viewports) {
    const filename = `${route.name}_${vp.name}.png`;
    const targetFile = path.join(outDir, filename);
    const url = `http://localhost:4173${route.path}`;
    console.log(`Capturing ${filename} (${url} @ ${vp.size})...`);
    try {
      const cmd = `npx playwright screenshot --channel msedge --viewport-size "${vp.size}" --full-page --wait-for-timeout 1000 "${url}" "${targetFile}"`;
      execSync(cmd, { stdio: 'inherit' });
    } catch (e) {
      console.error(`Failed to capture ${filename}:`, e.message);
    }
  }
}

console.log('Baseline screenshot capture complete! Saved to docs/redesign/screenshots/baseline/');
