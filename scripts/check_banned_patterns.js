const fs = require('fs');
const path = require('path');

const FRONTEND_SRC = path.join(__dirname, '..', 'frontend', 'src');

const BANNED_PATTERNS = [
  {
    name: 'Mock Data Import',
    regex: /from\s+['"][^'"]*mockData['"]/g,
    exclude: ['frontend/src/api/client.ts'],
    message: 'Production components must not import from mockData directly. Use api/client instead.',
  },
  {
    name: 'Lorem Ipsum Placeholder',
    regex: /lorem\s+ipsum/gi,
    exclude: [],
    message: 'Lorem ipsum placeholder text detected.',
  },
  {
    name: 'Fake Customer Count',
    regex: /thousands of (happy|satisfied) (customers|clients)/gi,
    exclude: [],
    message: 'Unverifiable client count claim detected.',
  },
  {
    name: 'Placeholder Logo PNGs',
    regex: /\/images\/[1-8]\.png/g,
    exclude: [],
    message: 'Mock client logo (1.png-8.png) detected.',
  },
  {
    name: 'Unverified Test Phone Number',
    regex: /\+91\s*7220000877/g,
    exclude: [],
    message: 'Deprecated phone number +91 7220000877 detected. Use official phone +91 97274 04415 or settings.',
  },
];

function scanDirectory(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      scanDirectory(filePath, fileList);
    } else if (/\.(tsx|ts|jsx|js|css)$/.test(file)) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

function runCheck() {
  console.log('--- AURA CHEMICALS: BANNED PATTERNS AUDIT ---');
  console.log(`Scanning directory: ${FRONTEND_SRC}\n`);

  const files = scanDirectory(FRONTEND_SRC);
  let violationCount = 0;

  for (const filePath of files) {
    const relPath = path.relative(path.join(__dirname, '..'), filePath).replace(/\\/g, '/');
    const content = fs.readFileSync(filePath, 'utf-8');

    for (const rule of BANNED_PATTERNS) {
      if (rule.exclude.some((ex) => relPath.includes(ex))) {
        continue;
      }

      const matches = content.match(rule.regex);
      if (matches) {
        console.error(`❌ [${rule.name}] Violation in ${relPath}:`);
        console.error(`   Message: ${rule.message}`);
        console.error(`   Matches found: ${matches.length} instance(s)\n`);
        violationCount += matches.length;
      }
    }
  }

  if (violationCount === 0) {
    console.log(`✅ All ${files.length} source files passed banned patterns audit with 0 violations!`);
    process.exit(0);
  } else {
    console.error(`❌ Total violations: ${violationCount}. Please resolve before launch.`);
    process.exit(1);
  }
}

runCheck();
