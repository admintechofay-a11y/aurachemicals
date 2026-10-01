const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const routes = [
  { name: 'Home', path: '/' },
  { name: 'About Us', path: '/about-us' },
  { name: 'Our Mission', path: '/our-mission' },
  { name: 'Products Catalog', path: '/products' },
  { name: 'Product Detail (Aceclofenac)', path: '/products/detail/aceclofenac' },
  { name: 'Industries', path: '/industries' },
  { name: 'Services (Inspection & QA)', path: '/services' },
  { name: 'Request a Quote (RFQ)', path: '/get-a-quote' },
  { name: 'Contact', path: '/contact' },
  { name: 'Privacy Policy', path: '/privacy-policy' },
];

async function runAxeAudit() {
  console.log('Launching Edge for axe-core accessibility audit...');
  const browser = await chromium.launch({ channel: 'msedge' });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const results = [];

  for (const r of routes) {
    const url = `http://localhost:4173${r.path}`;
    console.log(`Auditing ${r.name} (${url})...`);
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Inject axe-core
    await page.addScriptTag({ url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.9.1/axe.min.js' });
    const axeResults = await page.evaluate(async () => {
      // @ts-ignore
      return await window.axe.run();
    });

    const violations = axeResults.violations.map(v => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      help: v.help,
      helpUrl: v.helpUrl,
      nodesCount: v.nodes.length,
      sampleTarget: v.nodes[0] ? v.nodes[0].target.join(', ') : '',
      sampleHtml: v.nodes[0] ? v.nodes[0].html.substring(0, 120) : '',
    }));

    results.push({
      route: r.name,
      path: r.path,
      passes: axeResults.passes.length,
      violationsCount: violations.length,
      violations,
    });
  }

  await browser.close();

  fs.writeFileSync(
    path.join(__dirname, '..', 'docs', 'redesign', 'axe_baseline.json'),
    JSON.stringify(results, null, 2)
  );

  console.log('Axe audit complete! Summary:');
  for (const res of results) {
    console.log(`- ${res.route}: ${res.violationsCount} violations (${res.passes} checks passed)`);
    for (const v of res.violations) {
      console.log(`    [${v.impact ? v.impact.toUpperCase() : 'UNKNOWN'}] ${v.id}: ${v.description} (${v.nodesCount} nodes)`);
    }
  }
}

runAxeAudit().catch(err => {
  console.error('Axe audit failed:', err);
  process.exit(1);
});
