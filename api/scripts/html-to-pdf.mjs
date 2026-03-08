#!/usr/bin/env node
import puppeteer from 'puppeteer';
import { readFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';

const [,, htmlPath, outputPath] = process.argv;

if (!htmlPath || !outputPath) {
  console.error('Usage: html-to-pdf.mjs <input.html> <output.pdf>');
  process.exit(1);
}

// Find Chromium binary — check env, then common paths
function findChrome() {
  if (process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH)) {
    return process.env.CHROME_PATH;
  }
  const paths = [
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ];
  for (const p of paths) {
    if (existsSync(p)) return p;
  }
  // Try Playwright's download location
  try {
    const result = execSync('find /root/.npm/_npx -name chrome -path "*/chrome-linux/*" 2>/dev/null | head -1', { encoding: 'utf-8' }).trim();
    if (result && existsSync(result)) return result;
  } catch {}
  return null;
}

const chromePath = findChrome();
if (!chromePath) {
  console.error('No Chrome/Chromium binary found');
  process.exit(1);
}

const html = readFileSync(htmlPath, 'utf-8');

const browser = await puppeteer.launch({
  headless: true,
  executablePath: chromePath,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
});

const page = await browser.newPage();
await page.setContent(html, { waitUntil: 'networkidle0' });
await page.pdf({
  path: outputPath,
  format: 'A4',
  margin: { top: '15mm', right: '18mm', bottom: '15mm', left: '18mm' },
  printBackground: true,
});

await browser.close();
