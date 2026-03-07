import { TeamProfile } from '@/lib/types';

export function TeamDetail({ team }: { team: TeamProfile }) {
  return (
    <section className="space-y-4">
      <div className="card">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{team.division} Division</p>
        <h1 className="mt-2 text-3xl font-bold text-white">{team.name}</h1>
        <p className="text-slate-300">Managed by {team.manager}</p>

        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          <Stat label="Record" value={`${team.wins}-${team.losses}`} />
          <Stat label="Points For" value={team.pointsFor.toFixed(1)} />
          <Stat label="Points Against" value={team.pointsAgainst.toFixed(1)} />
          <Stat label="Streak" value={team.streak} />
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-white">Roster Highlights</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          {team.rosterHighlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-white">Next Opponent</h2>
        <p className="mt-2 text-slate-300">{team.nextOpponent}</p>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
      <p className="text-xs uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-1 text-xl font-semibold text-white">{value}</p>
    </div>
  );
}
