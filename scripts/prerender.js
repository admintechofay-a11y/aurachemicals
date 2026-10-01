const path = require('path');
const fs = require('fs');
const playwrightPath = path.join(__dirname, '..', 'frontend', 'node_modules', 'playwright');
const { chromium } = require(playwrightPath);

const DIST_DIR = path.join(__dirname, '..', 'frontend', 'dist');

// Read sitemap to get all canonical URLs
function extractRoutesFromSitemap() {
  const sitemapPath = path.join(__dirname, '..', 'frontend', 'public', 'sitemap.xml');
  const xml = fs.readFileSync(sitemapPath, 'utf8');
  const matches = [...xml.matchAll(/<loc>https:\/\/aurachemicals\.in([^<]*)<\/loc>/g)];
  const routes = matches.map(m => m[1] || '/').filter(r => r !== '/design-system');
  return [...new Set(routes)];
}

async function prerenderAll() {
  console.log('--- AURA CHEMICALS: SSG BUILD-TIME PRERENDER PIPELINE ---');
  const routes = extractRoutesFromSitemap();
  console.log(`Discovered ${routes.length} canonical routes from sitemap to prerender.\n`);

  if (!fs.existsSync(DIST_DIR)) {
    console.error(`Dist directory ${DIST_DIR} not found. Please run npm run build first.`);
    process.exit(1);
  }

  const browser = await chromium.launch({ channel: 'msedge' });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });

  const CONCURRENCY = 6;
  let completed = 0;
  const startTime = Date.now();

  async function renderRoute(route) {
    const page = await context.newPage();
    const url = `http://localhost:4173${route}`;
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForFunction(() => !document.querySelector('.skeleton-loader'), { timeout: 4000 }).catch(() => {});
      await page.waitForTimeout(100);

      // Extract fully rendered HTML
      const html = await page.content();

      // Determine output file path
      let outPath;
      if (route === '/' || route === '') {
        outPath = path.join(DIST_DIR, 'index.html');
      } else {
        const cleanRoute = route.startsWith('/') ? route.slice(1) : route;
        const targetDir = path.join(DIST_DIR, cleanRoute);
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }
        outPath = path.join(targetDir, 'index.html');
      }

      fs.writeFileSync(outPath, html, 'utf8');
      completed++;
      if (completed % 25 === 0 || completed === routes.length) {
        console.log(`[${completed}/${routes.length}] Prerendered: ${route}`);
      }
    } catch (err) {
      console.error(`❌ Failed to prerender ${route}:`, err.message);
    } finally {
      await page.close();
    }
  }

  // Process in worker batches
  const queue = [...routes];
  const workers = Array(CONCURRENCY).fill(0).map(async () => {
    while (queue.length > 0) {
      const route = queue.shift();
      if (route) await renderRoute(route);
    }
  });

  await Promise.all(workers);
  await browser.close();

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n✅ SSG Prerendering complete! ${completed} static HTML pages generated in ${durationSec}s.`);
}

prerenderAll().catch(err => {
  console.error('Prerender pipeline failed:', err);
  process.exit(1);
});
