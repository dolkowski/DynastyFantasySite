export default function TeamLoading() {
  return (
    <section className="space-y-4" aria-busy="true" aria-live="polite">
      <div className="card h-28 animate-pulse bg-slate-900/80" />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card h-56 animate-pulse bg-slate-900/80" />
        <div className="card h-56 animate-pulse bg-slate-900/80" />
      </div>
      <div className="card h-48 animate-pulse bg-slate-900/80" />
    </section>
  );
}
