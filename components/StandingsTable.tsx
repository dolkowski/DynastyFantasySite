import Link from 'next/link';
import { TeamRecord } from '@/lib/types';

export function StandingsTable({ standings, title = 'Standings' }: { standings: TeamRecord[]; title?: string }) {
  return (
    <section className="card overflow-hidden">
      <h2 className="mb-3 text-lg font-semibold text-white">{title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-slate-800/70 text-left text-xs uppercase tracking-wider text-slate-300">
            <tr>
              <th className="px-3 py-2">#</th>
              <th className="px-3 py-2">Team</th>
              <th className="px-3 py-2">Manager</th>
              <th className="px-3 py-2">Record</th>
              <th className="px-3 py-2">PF</th>
              <th className="px-3 py-2">PA</th>
              <th className="px-3 py-2">Streak</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((team, index) => (
              <tr key={team.id} className="border-b border-slate-800 last:border-none">
                <td className="px-3 py-2 text-slate-300">{index + 1}</td>
                <td className="px-3 py-2 font-medium text-white">
                  <Link className="hover:text-accent" href={`/teams/${team.id}`}>
                    {team.name}
                  </Link>
                </td>
                <td className="px-3 py-2 text-slate-300">{team.manager}</td>
                <td className="px-3 py-2 text-slate-300">{team.wins}-{team.losses}</td>
                <td className="px-3 py-2 text-slate-300">{team.pointsFor.toFixed(1)}</td>
                <td className="px-3 py-2 text-slate-300">{team.pointsAgainst.toFixed(1)}</td>
                <td className="px-3 py-2 text-slate-300">{team.streak}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
