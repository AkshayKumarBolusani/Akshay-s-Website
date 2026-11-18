import Link from "next/link";

export default function NotFound() {
  return (
    <main className="gutter grid min-h-[100svh] place-items-center text-center">
      <div>
        <p className="eyebrow">Error · page not found</p>
        <h1 className="glitch display-xl mt-4 text-[38vw] leading-[0.8] text-accent sm:text-[26vw]" data-text="404">
          404
        </h1>
        <p className="mx-auto mt-6 max-w-md text-lg text-fg/75">
          This page wandered off. Even the particles couldn&apos;t find it.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="rounded-full bg-accent px-7 py-3.5 font-display font-bold text-ink transition-transform hover:scale-105">
            Take me home
          </Link>
          <Link href="/work" className="rounded-full border border-border px-7 py-3.5 font-display font-bold transition-colors hover:border-accent hover:text-accent">
            See the work
          </Link>
        </div>
      </div>
    </main>
  );
}
