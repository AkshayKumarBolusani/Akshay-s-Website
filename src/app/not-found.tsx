import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-[100svh] place-items-center px-5 text-center">
      <div>
        <p className="section-label">404 · Lost in space</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight sm:text-7xl">
          This star <span className="gradient-text">drifted away</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted">
          The page you were looking for isn&apos;t in this universe.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-fg px-7 py-3.5 text-sm font-semibold text-bg transition-transform hover:scale-105"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
