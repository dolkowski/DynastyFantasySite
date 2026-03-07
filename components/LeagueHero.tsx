import { LeagueSummary } from '@/lib/types';

export function LeagueHero({ summary }: { summary: LeagueSummary }) {
  return (
    <section className="card bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950">
      <p className="text-sm uppercase tracking-[0.2em] text-accent">{summary.leagueName}</p>
      <h2 className="mt-2 text-3xl font-black tracking-tight text-white md:text-4xl">{summary.season} Season Coverage</h2>
      <p className="mt-3 max-w-3xl text-slate-300">{summary.headline}</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat label="Current Week" value={String(summary.currentWeek)} />
        <Stat label="Teams" value={String(summary.totalTeams)} />
        <Stat label="Live Storyline" value="Playoff Hunt" />
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-black/20 p-3">
      <p className="text-xs uppercase tracking-widest text-slate-400">{label}</p>
      <p className="mt-1 text-xl font-semibold text-white">{value}</p>
    </div>
  );
}
