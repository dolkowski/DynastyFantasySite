import Link from 'next/link';
import { StandingsTable } from '@/components/StandingsTable';
import { getLeagueId } from '@/lib/config';
import { getLeagueSnapshot } from '@/lib/fantasyApi';
import {
  buildStandings,
  buildWeeklyMatchups,
  getLeagueMatchups,
  getLeagueTransactions,
  getNFLState,
  getNormalizedLeagueTeams,
  selectFeaturedMatchup
} from '@/lib/sleeper';

function toTransactionSummary(transaction: Awaited<ReturnType<typeof getLeagueTransactions>>[number]) {
  const addCount = Object.keys(transaction.adds ?? {}).length;
  const dropCount = Object.keys(transaction.drops ?? {}).length;

  return {
    id: transaction.transaction_id,
    type: transaction.type.replace('_', ' ').toUpperCase(),
    status: transaction.status.toUpperCase(),
    created: new Date(transaction.created).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }),
    moveSummary: `${addCount} add${addCount === 1 ? '' : 's'} • ${dropCount} drop${dropCount === 1 ? '' : 's'}`
  };
}

export default async function HomePage() {
  try {
    const leagueId = getLeagueId();
    const snapshot = await getLeagueSnapshot();
    const nflState = await getNFLState();
    const liveWeek = nflState.week;

    const [leagueTransactions, leagueTeams, weekMatchups] = await Promise.all([
      getLeagueTransactions(leagueId, liveWeek),
      getNormalizedLeagueTeams(leagueId),
      getLeagueMatchups(leagueId, liveWeek)
    ]);

    const allTeams = buildStandings(leagueTeams);
    const featured = selectFeaturedMatchup(buildWeeklyMatchups(weekMatchups, leagueTeams), allTeams);
    const topStandings = snapshot.standings.slice(0, 5);
    const latestTransactions = leagueTransactions.slice(0, 5).map(toTransactionSummary);

    const newsItems = [
      `${snapshot.standings[0]?.name ?? 'League leaders'} remains on top of the table at ${snapshot.standings[0]?.wins ?? 0}-${snapshot.standings[0]?.losses ?? 0}.`,
      featured
        ? `${featured.teams[0].teamName} and ${featured.teams[1].teamName} headline Week ${liveWeek} with elite season production.`
        : `Matchup board is being finalized for Week ${liveWeek}.`,
      `${latestTransactions.length} roster move${latestTransactions.length === 1 ? '' : 's'} recorded so far in Week ${liveWeek}.`
    ];

    return (
      <div className="space-y-6">
        <section className="card border-slate-700 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-accent">League Headquarters</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-white md:text-4xl">{snapshot.summary.leagueName}</h2>
              <p className="mt-2 text-slate-300">{snapshot.summary.season} Season Coverage</p>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-950/70 px-4 py-3 text-right">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Current Week</p>
              <p className="mt-1 text-3xl font-extrabold text-white">{liveWeek}</p>
            </div>
          </div>
        </section>

        <section className="card border-slate-700 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-accent">Featured Matchup</p>
          {featured ? (
            <>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {featured.teams.map((team) => (
                  <article key={team.rosterId} className="rounded-xl border border-slate-700 bg-black/25 p-4">
                    <p className="text-lg font-bold text-white">{team.teamName}</p>
                    <p className="text-sm text-slate-300">Record: {team.wins}-{team.losses}-{team.ties}</p>
                    <p className="text-sm text-slate-300">Points For: {team.pointsFor.toFixed(2)}</p>
                  </article>
                ))}
              </div>
              <p className="mt-4 rounded-lg border border-slate-700 bg-slate-950/60 p-3 text-sm text-slate-300">{featured.blurb}</p>
            </>
          ) : (
            <p className="mt-3 text-sm text-slate-300">No matchup data available yet for Week {liveWeek}.</p>
          )}
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <StandingsTable standings={topStandings} title="Top 5 Standings" />
          </div>
          <article className="card">
            <h3 className="text-lg font-semibold text-white">Latest News</h3>
            <ul className="mt-4 space-y-3">
              {newsItems.map((item) => (
                <li key={item} className="rounded-lg border border-slate-800 bg-slate-950/50 p-3 text-sm text-slate-300">
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="card">
            <h3 className="text-lg font-semibold text-white">Latest Transactions</h3>
            <div className="mt-3 space-y-2">
              {latestTransactions.length > 0 ? (
                latestTransactions.map((transaction) => (
                  <div key={transaction.id} className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-white">{transaction.type}</p>
                      <p className="text-xs font-semibold text-accent">{transaction.status}</p>
                    </div>
                    <p className="mt-1 text-sm text-slate-300">{transaction.moveSummary}</p>
                    <p className="mt-1 text-xs text-slate-500">{transaction.created}</p>
                  </div>
                ))
              ) : (
                <p className="rounded-lg border border-slate-800 bg-slate-950/50 p-3 text-sm text-slate-300">
                  No transactions have posted for Week {liveWeek} yet.
                </p>
              )}
            </div>
          </article>

          <section className="card">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Team Directory</h3>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Quick Links</p>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {allTeams.map((team) => (
                <Link
                  key={team.rosterId}
                  href={`/teams/${team.rosterId}`}
                  className="rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-accent hover:text-white"
                >
                  {team.teamName}
                </Link>
              ))}
            </div>
          </section>
        </section>
      </div>
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load league homepage.';
    return (
      <section className="card">
        <h1 className="section-title">League Homepage Unavailable</h1>
        <p className="mt-2 text-slate-300">{message}</p>
      </section>
    );
  }
}
