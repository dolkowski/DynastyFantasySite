import { MatchupList } from '@/components/MatchupList';
import { getLeagueSnapshot } from '@/lib/fantasyApi';

export const metadata = {
  title: 'Weekly Matchups | Dynasty Fantasy HQ'
};

export default async function MatchupsPage() {
  try {
    const { weeklyMatchups, currentWeek } = await getLeagueSnapshot();

    return (
      <section className="space-y-4">
        <h1 className="section-title">Week {currentWeek} Matchups</h1>
        <MatchupList matchups={weeklyMatchups} />
      </section>
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load matchups.';
    return (
      <section className="card">
        <h1 className="section-title">Weekly Matchups</h1>
        <p className="mt-2 text-slate-300">{message}</p>
      </section>
    );
  }
}
