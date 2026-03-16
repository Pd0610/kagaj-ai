#!/usr/bin/env node

import puppeteer from "puppeteer";
import { readFileSync } from "fs";

const outputPath = process.argv[2];
if (!outputPath) {
  console.error("Usage: html-to-pdf.mjs <output-path>");
  process.exit(1);
}

// Read HTML from stdin
const html = readFileSync("/dev/stdin", "utf-8");

const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

try {
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  await page.pdf({
    path: outputPath,
    format: "A4",
    printBackground: true,
    margin: {
      top: "20mm",
      right: "15mm",
      bottom: "20mm",
      left: "15mm",
    },
  });
} finally {
  await browser.close();
}
