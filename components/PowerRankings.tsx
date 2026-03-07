import Link from 'next/link';
import { Ranking } from '@/lib/types';

const trendIcon = {
  up: '▲',
  down: '▼',
  steady: '■'
};

export function PowerRankings({ rankings, showAll = false }: { rankings: Ranking[]; showAll?: boolean }) {
  return (
    <section className="card">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Power Rankings</h2>
        {!showAll && (
          <Link href="/power-rankings" className="text-sm font-medium text-accent hover:underline">
            View all
          </Link>
        )}
      </div>
      <ol className="space-y-2">
        {rankings.map((item) => (
          <li key={item.teamId} className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-white">
                  {item.rank}.{' '}
                  <Link href={`/teams/${item.teamId}`} className="hover:text-accent">
                    {item.teamName}
                  </Link>
                </p>
                <p className="mt-1 text-sm text-slate-400">{item.note}</p>
              </div>
              <p className="text-sm font-bold text-slate-300">
                {trendIcon[item.trend]} {item.trend}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
