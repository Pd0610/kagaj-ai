"use client";

export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        Something went wrong
      </h1>
      <p className="mt-2 text-muted-foreground">
        An error occurred while loading this page.
      </p>
      <button
        onClick={reset}
        className="mt-6 inline-flex h-10 items-center rounded-md bg-primary px-4 text-[15px] font-semibold text-primary-foreground transition-colors duration-150 hover:bg-primary-hover"
      >
        Try again
      </button>
    </div>
  );
}
