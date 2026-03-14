import { NextRequest, NextResponse } from "next/server";
import { existsSync } from "fs";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium-min";

export const maxDuration = 60;

const LOCAL_CHROME_PATHS = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium-browser",
].filter(Boolean) as string[];

async function getBrowser() {
  const localChrome = LOCAL_CHROME_PATHS.find((p) => existsSync(p));

  if (localChrome) {
    return puppeteer.launch({
      executablePath: localChrome,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: true,
    });
  }

  const executablePath = await chromium.executablePath(
    "https://github.com/nichochar/chromium/releases/download/v131.0.0/chromium-v131.0.0-pack.tar"
  );

  return puppeteer.launch({
    executablePath,
    args: chromium.args,
    headless: true,
  });
}

interface PdfRequestBody {
  html?: string;
  pdf_config?: {
    margins?: { top?: number; right?: number; bottom?: number; left?: number };
    page_size?: string;
  };
}

const DEFAULT_MARGINS = { top: 25.4, right: 17.8, bottom: 17.8, left: 25.4 };

export async function POST(request: NextRequest) {
  const body = (await request.json()) as PdfRequestBody;
  const { html, pdf_config } = body;

  if (!html || typeof html !== "string") {
    return NextResponse.json(
      { error: "Missing or invalid `html` field" },
      { status: 400 }
    );
  }

  const margins = { ...DEFAULT_MARGINS, ...pdf_config?.margins };
  const pageSize = pdf_config?.page_size ?? "A4";

  let browser;
  try {
    browser = await getBrowser();
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({
      format: pageSize as "A4" | "Legal" | "Letter",
      printBackground: true,
      margin: {
        top: `${margins.top}mm`,
        right: `${margins.right}mm`,
        bottom: `${margins.bottom}mm`,
        left: `${margins.left}mm`,
      },
    });

    return new NextResponse(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=document.pdf",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("PDF generation failed:", message);
    return NextResponse.json(
      { error: "PDF generation failed", detail: message },
      { status: 500 }
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
