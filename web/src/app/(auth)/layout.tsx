"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AuthProvider } from "@/contexts/auth-context";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="relative flex min-h-screen flex-col bg-background px-4 pt-12 pb-8 md:pt-20">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 -z-10 h-96 w-96 rounded-full bg-primary-subtle opacity-30 blur-3xl" />
        <div className="absolute bottom-0 left-0 -z-10 h-72 w-72 rounded-full bg-gold/5 opacity-40 blur-3xl" />

        {/* Back link */}
        <div className="mx-auto w-full max-w-sm">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>

        {/* Form card */}
        <div className="mx-auto w-full max-w-sm">{children}</div>

        {/* Footer */}
        <p className="mt-auto pt-8 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} KagajAI. All rights reserved.
        </p>
      </div>
    </AuthProvider>
  );
}
