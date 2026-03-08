import { MatchupList } from '@/components/MatchupList';
import { getLeagueSnapshot } from '@/lib/fantasyApi';

export const metadata = {
  title: 'Weekly Matchups | Dynasty Fantasy HQ'
};

export default async function MatchupsPage() {
  const { weeklyMatchups, currentWeek } = await getLeagueSnapshot();

  return (
    <section className="space-y-4">
      <h1 className="section-title">Week {currentWeek} Matchups</h1>
      <MatchupList matchups={weeklyMatchups} />
    </section>
  );
}
