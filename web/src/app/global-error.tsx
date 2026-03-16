"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-[oklch(0.98_0.005_80)] px-4 font-sans">
        <h1 className="text-2xl font-bold tracking-tight text-[oklch(0.18_0.02_50)]">
          Something went wrong
        </h1>
        <p className="mt-2 text-[oklch(0.50_0.01_50)]">
          An unexpected error occurred.
        </p>
        <button
          onClick={reset}
          className="mt-6 inline-flex h-10 items-center rounded-md bg-[oklch(0.35_0.15_250)] px-4 text-[15px] font-semibold text-white transition-colors duration-150 hover:bg-[oklch(0.30_0.15_250)]"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
