import Link from "next/link";
import {
  FileTextIcon,
  ShieldCheckIcon,
  ZapIcon,
} from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left panel — branding + value props */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[520px] flex-col justify-between bg-primary p-10 text-primary-foreground">
        <div>
          <Link href="/" className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-white/20 text-lg font-bold backdrop-blur-sm">
              K
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight">KagajAI</span>
              <span className="block text-xs text-white/70">
                Smart Document Platform
              </span>
            </div>
          </Link>
        </div>

        <div className="space-y-8">
          <h2 className="text-2xl font-bold leading-snug tracking-tight">
            Generate government documents
            <br />
            in minutes, not hours.
          </h2>

          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
                <ZapIcon className="size-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">AI-Powered Generation</p>
                <p className="text-sm text-white/70">
                  Board resolutions, AGM notices, annual returns — generated
                  instantly with AI.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
                <FileTextIcon className="size-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">Nepal-Ready Templates</p>
                <p className="text-sm text-white/70">
                  Compliant with OCR Nepal requirements. English &amp; Nepali
                  bilingual output.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
                <ShieldCheckIcon className="size-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">Built for CA Firms</p>
                <p className="text-sm text-white/70">
                  Manage 50–200 companies. Auto-fill company data across all
                  documents.
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-white/50">
          &copy; {new Date().getFullYear()} KagajAI. All rights reserved.
        </p>
      </div>

      {/* Right panel — form area */}
      <div className="flex flex-1 flex-col items-center justify-center bg-background px-6 py-10">
        {/* Mobile logo (hidden on desktop since left panel shows it) */}
        <div className="mb-8 flex items-center gap-3 lg:hidden">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground text-lg font-bold">
              K
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight">KagajAI</span>
              <span className="block text-xs text-muted-foreground">
                Smart Document Platform
              </span>
            </div>
          </Link>
        </div>

        <div className="w-full max-w-[400px]">{children}</div>
      </div>
    </div>
  );
}
