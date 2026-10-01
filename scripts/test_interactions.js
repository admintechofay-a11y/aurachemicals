const path = require('path');
const playwrightPath = path.join(__dirname, '..', 'frontend', 'node_modules', 'playwright');
const { chromium } = require(playwrightPath);

async function testInteractions() {
  console.log('Testing interactive elements and console errors...');
  const browser = await chromium.launch({ channel: 'msedge' });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', err => {
    consoleErrors.push(err.message);
  });

  // 1. Test Home
  console.log('1. Loading Home page...');
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // 2. Test Command Palette
  console.log('2. Testing Command Palette (Cmd/Ctrl+K)...');
  await page.keyboard.press('Control+KeyK');
  await page.waitForTimeout(500);
  const paletteOpen = await page.$('.cmd-palette-backdrop');
  console.log(`   Command Palette opened: ${paletteOpen !== null ? 'YES' : 'NO'}`);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);

  // 3. Test Products Page
  console.log('3. Loading Products page...');
  await page.goto('http://localhost:4173/products', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Search input
  const searchInput = await page.$('input[type="search"], input[placeholder*="Search"]');
  if (searchInput) {
    await searchInput.fill('Paracetamol');
    await page.waitForTimeout(500);
    console.log('   Search input typed: Paracetamol');
  }

  // 4. Test Product Detail
  console.log('4. Loading Product Detail (Aceclofenac)...');
  await page.goto('http://localhost:4173/products/detail/aceclofenac', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Click Add to RFQ Basket
  const addToQuoteBtn = await page.$('button:has-text("Add to Quote"), button:has-text("RFQ Basket"), button:has-text("Add to RFQ")');
  if (addToQuoteBtn) {
    await addToQuoteBtn.click();
    await page.waitForTimeout(500);
    console.log('   Clicked Add to Quote/RFQ button');
  }

  // 5. Test RFQ Page
  console.log('5. Loading Quote Page (/get-a-quote)...');
  await page.goto('http://localhost:4173/get-a-quote', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // 6. Test Services
  console.log('6. Loading Services page...');
  await page.goto('http://localhost:4173/services', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // 7. Test Contact
  console.log('7. Loading Contact page...');
  await page.goto('http://localhost:4173/contact', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  await browser.close();

  console.log('\n--- CONSOLE ERROR AUDIT ---');
  if (consoleErrors.length === 0) {
    console.log('✅ ZERO console errors across all tested pages and user interactions!');
  } else {
    console.error(`❌ Found ${consoleErrors.length} console errors:`, consoleErrors);
    process.exit(1);
  }
}

testInteractions().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
