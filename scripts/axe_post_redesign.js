const path = require('path');
const fs = require('fs');
const playwrightPath = path.join(__dirname, '..', 'frontend', 'node_modules', 'playwright');
const { chromium } = require(playwrightPath);

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
  { name: 'Terms of Supply', path: '/terms' },
  { name: 'Design System Showcase', path: '/design-system' },
];

async function runPostRedesignAudit() {
  console.log('Launching Edge for post-redesign axe-core accessibility audit...');
  const browser = await chromium.launch({ channel: 'msedge' });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const results = [];
  let totalCritical = 0;
  let totalSerious = 0;

  for (const r of routes) {
    const url = `http://localhost:4173${r.path}`;
    console.log(`Auditing ${r.name} (${url})...`);
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Inject axe-core locally
    const axeMinPath = path.join(__dirname, '..', 'frontend', 'node_modules', 'axe-core', 'axe.min.js');
    await page.addScriptTag({ path: axeMinPath });
    const axeResults = await page.evaluate(async () => {
      // @ts-ignore
      return await window.axe.run();
    });

    const violations = axeResults.violations.map(v => {
      if (v.impact === 'critical') totalCritical += v.nodes.length;
      if (v.impact === 'serious') totalSerious += v.nodes.length;
      return {
        id: v.id,
        impact: v.impact,
        description: v.description,
        help: v.help,
        helpUrl: v.helpUrl,
        nodesCount: v.nodes.length,
        nodes: v.nodes.map(n => ({
          target: n.target.join(', '),
          html: n.html.substring(0, 150),
          failureSummary: n.failureSummary,
        })),
        sampleTarget: v.nodes[0] ? v.nodes[0].target.join(', ') : '',
        sampleHtml: v.nodes[0] ? v.nodes[0].html.substring(0, 120) : '',
      };
    });

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
    path.join(__dirname, '..', 'docs', 'redesign', 'axe_post_redesign.json'),
    JSON.stringify(results, null, 2)
  );

  console.log('\n--- AXE-CORE POST-REDESIGN ACCESSIBILITY REPORT ---');
  for (const res of results) {
    console.log(`- ${res.route}: ${res.violationsCount} violations (${res.passes} checks passed)`);
    for (const v of res.violations) {
      console.log(`    [${(v.impact || 'UNKNOWN').toUpperCase()}] ${v.id}: ${v.description} (${v.nodesCount} nodes)`);
    }
  }

  console.log(`\nSummary: Critical Violations: ${totalCritical}, Serious Violations: ${totalSerious}`);
}

runPostRedesignAudit().catch(err => {
  console.error('Post-redesign audit failed:', err);
  process.exit(1);
});
