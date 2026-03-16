"use client";

export default function AuthError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="rounded-lg border border-border bg-card p-6 text-center">
        <h1 className="text-lg font-semibold text-foreground">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          An error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="mt-4 inline-flex h-10 items-center rounded-md bg-primary px-4 text-[15px] font-semibold text-primary-foreground transition-colors duration-150 hover:bg-primary-hover"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
