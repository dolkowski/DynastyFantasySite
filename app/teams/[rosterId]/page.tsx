import { notFound } from 'next/navigation';
import {
  buildStandings,
  getLeagueTransactions,
  getNFLState,
  getNormalizedLeagueTeams,
  SLEEPER_LEAGUE_ID,
  SleeperApiError
} from '@/lib/sleeper';
import { getLeagueSnapshot } from '@/lib/fantasyApi';

export async function generateStaticParams() {
  try {
    const teams = await getNormalizedLeagueTeams(SLEEPER_LEAGUE_ID);
    return teams.map((team) => ({ rosterId: String(team.rosterId) }));
  } catch {
    const snapshot = await getLeagueSnapshot();
    return snapshot.standings.map((team) => ({ rosterId: team.id }));
  }
}

export async function generateMetadata({ params }: { params: { rosterId: string } }) {
  try {
    const teams = await getNormalizedLeagueTeams(SLEEPER_LEAGUE_ID);
    const team = teams.find((entry) => String(entry.rosterId) === params.rosterId);
    return {
      title: team ? `${team.teamName} | Dynasty Fantasy HQ` : 'Team Not Found | Dynasty Fantasy HQ'
    };
  } catch {
    return {
      title: 'Team Details | Dynasty Fantasy HQ'
    };
  }
}

function formatTransaction(transaction: Awaited<ReturnType<typeof getLeagueTransactions>>[number]) {
  const adds = Object.keys(transaction.adds ?? {}).length;
  const drops = Object.keys(transaction.drops ?? {}).length;

  return {
    id: transaction.transaction_id,
    type: transaction.type.replace('_', ' ').toUpperCase(),
    timestamp: new Date(transaction.created).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }),
    summary: `${adds} add${adds === 1 ? '' : 's'} • ${drops} drop${drops === 1 ? '' : 's'}`
  };
}

export default async function TeamPage({ params }: { params: { rosterId: string } }) {
  const rosterId = Number(params.rosterId);

  if (!Number.isFinite(rosterId)) {
    notFound();
  }

  let week = 1;
  let allTeams = await getNormalizedLeagueTeams(SLEEPER_LEAGUE_ID);
  let team = allTeams.find((entry) => entry.rosterId === rosterId);
  let transactions = [] as Awaited<ReturnType<typeof getLeagueTransactions>>;

  try {
    const state = await getNFLState();
    week = state.week;
    const weekTransactions = await getLeagueTransactions(SLEEPER_LEAGUE_ID, week);
    transactions = weekTransactions.filter((txn) => txn.roster_ids.includes(rosterId));
  } catch (error) {
    if (!(error instanceof SleeperApiError)) {
      throw error;
    }
  }

  if (!team) {
    const snapshot = await getLeagueSnapshot();
    const fallback = snapshot.standings.find((entry) => entry.id === params.rosterId);

    if (!fallback) {
      notFound();
    }

    return (
      <section className="space-y-4">
        <div className="card">
          <h1 className="text-3xl font-bold text-white">{fallback.name}</h1>
          <p className="text-slate-300">Owner: {fallback.manager}</p>
          <p className="mt-2 text-sm text-slate-300">
            Record: {fallback.wins}-{fallback.losses} • PF: {fallback.pointsFor.toFixed(1)} • PA: {fallback.pointsAgainst.toFixed(1)}
          </p>
        </div>
        <div className="card">
          <h2 className="text-lg font-semibold text-white">Team Outlook</h2>
          <p className="mt-2 text-slate-300">
            AI Outlook Placeholder: Full roster data is currently unavailable. This team remains in the race based on recent performance trends.
          </p>
        </div>
      </section>
    );
  }

  const standings = buildStandings(allTeams);
  const rank = standings.findIndex((entry) => entry.rosterId === rosterId) + 1;
  const formattedTransactions = transactions.slice(0, 8).map(formatTransaction);
  const relatedNews = [
    `${team.teamName} enters Week ${week} at ${team.wins}-${team.losses}-${team.ties} and currently ranks #${rank}.`,
    `${team.teamName} has scored ${team.pointsFor.toFixed(2)} points while allowing ${team.pointsAgainst.toFixed(2)}.`,
    `Roster watch: ${team.starterPlayerIds.length} starters and ${team.benchPlayerIds.length} bench players are currently active.`
  ];

  return (
    <section className="space-y-4">
      <div className="card space-y-2">
        <h1 className="text-3xl font-bold text-white">{team.teamName}</h1>
        <p className="text-slate-300">Owner: {team.displayName}</p>
        <div className="flex flex-wrap gap-3 text-sm text-slate-300">
          <p>Record: {team.wins}-{team.losses}-{team.ties}</p>
          <p>Standings Position: #{rank}</p>
          <p>Points For: {team.pointsFor.toFixed(2)}</p>
          <p>Points Against: {team.pointsAgainst.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="card">
          <h2 className="text-lg font-semibold text-white">Starters</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            {team.starterPlayerIds.length > 0 ? (
              team.starterPlayerIds.map((playerId) => (
                <li key={playerId} className="rounded border border-slate-800 bg-slate-950/50 px-3 py-2">
                  {playerId}
                </li>
              ))
            ) : (
              <li className="text-slate-400">No starters available.</li>
            )}
          </ul>
        </article>

        <article className="card">
          <h2 className="text-lg font-semibold text-white">Bench</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            {team.benchPlayerIds.length > 0 ? (
              team.benchPlayerIds.map((playerId) => (
                <li key={playerId} className="rounded border border-slate-800 bg-slate-950/50 px-3 py-2">
                  {playerId}
                </li>
              ))
            ) : (
              <li className="text-slate-400">No bench players available.</li>
            )}
          </ul>
        </article>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <article className="card xl:col-span-2">
          <h2 className="text-lg font-semibold text-white">Recent Transactions</h2>
          <div className="mt-3 space-y-2">
            {formattedTransactions.length > 0 ? (
              formattedTransactions.map((transaction) => (
                <div key={transaction.id} className="rounded border border-slate-800 bg-slate-950/50 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-white">{transaction.type}</p>
                    <p className="text-xs text-slate-400">{transaction.timestamp}</p>
                  </div>
                  <p className="mt-1 text-sm text-slate-300">{transaction.summary}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-300">No recent transactions involving this roster in Week {week}.</p>
            )}
          </div>
        </article>

        <article className="card">
          <h2 className="text-lg font-semibold text-white">Team Outlook</h2>
          <p className="mt-3 text-sm text-slate-300">
            AI Outlook Placeholder: This panel will provide a model-generated projection of playoff odds, lineup volatility, and trade recommendations.
          </p>
        </article>
      </div>

      <article className="card">
        <h2 className="text-lg font-semibold text-white">Related NFL News</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-300">
          {relatedNews.map((item) => (
            <li key={item} className="rounded border border-slate-800 bg-slate-950/50 px-3 py-2">
              {item}
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
