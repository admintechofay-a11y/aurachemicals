const path = require('path');
const { chromium } = require(path.join(__dirname, '..', 'frontend', 'node_modules', 'playwright'));
const fs = require('fs');

const outDir = path.join(__dirname, '..', 'docs', 'redesign', 'screenshots', 'redesign');
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
  { name: 'terms', path: '/terms' },
  { name: 'design_system', path: '/design-system' },
  { name: 'not_found', path: '/non-existent-page' },
];

const viewports = [
  { name: '1440', width: 1440, height: 900 },
  { name: '820', width: 820, height: 1180 },
  { name: '390', width: 390, height: 844 },
];

async function captureRedesign() {
  console.log(`Starting redesign screenshots capture across ${routes.length} routes and 3 viewports (${routes.length * 3} captures)...`);
  const browser = await chromium.launch({ channel: 'msedge' });
  const context = await browser.newContext();
  const page = await context.newPage();

  for (const vp of viewports) {
    console.log(`\n--- Viewport: ${vp.name} (${vp.width}x${vp.height}) ---`);
    await page.setViewportSize({ width: vp.width, height: vp.height });

    for (const r of routes) {
      const filename = `${r.name}_${vp.name}.png`;
      const targetPath = path.join(outDir, filename);

      if (fs.existsSync(targetPath)) {
        console.log(`- Skipping already captured ${filename}`);
        continue;
      }

      const url = `http://localhost:4173${r.path}`;
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await page.waitForTimeout(600);
        await page.screenshot({ path: targetPath, fullPage: true });
        console.log(`✓ Captured ${filename}`);
      } catch (err) {
        console.error(`✗ Error capturing ${filename}:`, err.message);
      }
    }
  }

  await browser.close();
  console.log(`\nRedesign screenshot capture complete! Files saved in docs/redesign/screenshots/redesign/`);
}

captureRedesign().catch(err => {
  console.error('Fatal error in capture script:', err);
  process.exit(1);
});
