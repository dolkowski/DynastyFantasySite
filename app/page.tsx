import { LeagueHero } from '@/components/LeagueHero';
import { MatchupList } from '@/components/MatchupList';
import { StandingsTable } from '@/components/StandingsTable';
import { PowerRankings } from '@/components/PowerRankings';
import { getLeagueSnapshot } from '@/lib/fantasyApi';

export default async function HomePage() {
  const snapshot = await getLeagueSnapshot();

  return (
    <div className="space-y-6">
      <LeagueHero summary={snapshot.summary} />
      <section className="grid gap-6 lg:grid-cols-2">
        <StandingsTable standings={snapshot.standings.slice(0, 6)} title="Top Standings" />
        <MatchupList matchups={snapshot.weeklyMatchups} title="This Week's Spotlight" />
      </section>
      <PowerRankings rankings={snapshot.powerRankings.slice(0, 5)} />
    </div>
  );
}
