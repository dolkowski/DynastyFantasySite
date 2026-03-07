import Link from 'next/link';
import { Matchup } from '@/lib/types';

export function MatchupList({ matchups, title = 'Weekly Matchups' }: { matchups: Matchup[]; title?: string }) {
  return (
    <section className="card space-y-3">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      {matchups.map((matchup) => (
        <article key={matchup.id} className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
          <p className="mb-2 text-xs uppercase tracking-wider text-slate-400">{matchup.kickoffLabel}</p>
          <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-center">
            <div>
              <Link href={`/teams/${matchup.awayTeamId}`} className="font-semibold text-white hover:text-accent">
                {matchup.awayTeamName}
              </Link>
              <p className="text-sm text-slate-400">Proj. {matchup.awayProjection.toFixed(1)}</p>
            </div>
            <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-500">vs</p>
            <div className="text-left md:text-right">
              <Link href={`/teams/${matchup.homeTeamId}`} className="font-semibold text-white hover:text-accent">
                {matchup.homeTeamName}
              </Link>
              <p className="text-sm text-slate-400">Proj. {matchup.homeProjection.toFixed(1)}</p>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
