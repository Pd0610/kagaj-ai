import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <h1 className="text-6xl font-bold tracking-tight text-primary">404</h1>
      <p className="mt-3 text-lg text-muted-foreground">
        This page doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex h-10 items-center rounded-md bg-primary px-4 text-[15px] font-semibold text-primary-foreground transition-colors duration-150 hover:bg-primary-hover"
      >
        Go home
      </Link>
    </div>
  );
}
