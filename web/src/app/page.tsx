"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6 px-4 text-center">
        <div className="flex items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
            K
          </div>
          <span className="text-2xl font-bold tracking-tight">KagajAI</span>
        </div>

        <div className="max-w-md space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            AI-Powered Documents
          </h1>
          <p className="text-lg text-muted-foreground">
            Generate government documents, legal papers, and official forms for
            Nepal — fast, accurate, and in Nepali.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/login"
            className={cn(buttonVariants({ size: "lg" }))}
          >
            Login
          </Link>
          <Link
            href="/register"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
