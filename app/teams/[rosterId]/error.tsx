'use client';

export default function TeamError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="card space-y-3 text-center">
      <h1 className="text-2xl font-bold text-white">Unable to load team details</h1>
      <p className="text-slate-300">We hit an issue while loading this roster page. Please try again.</p>
      <button
        type="button"
        onClick={reset}
        className="rounded-md border border-accent px-4 py-2 text-sm font-semibold text-accent transition hover:bg-accent hover:text-white"
      >
        Retry
      </button>
    </section>
  );
}
