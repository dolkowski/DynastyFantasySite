import { PowerRankings } from '@/components/PowerRankings';
import { getLeagueSnapshot } from '@/lib/fantasyApi';

export const metadata = {
  title: 'Power Rankings | Dynasty Fantasy HQ'
};

export default async function PowerRankingsPage() {
  try {
    const { powerRankings } = await getLeagueSnapshot();

    return (
      <section className="space-y-4">
        <h1 className="section-title">Power Rankings</h1>
        <PowerRankings rankings={powerRankings} showAll />
      </section>
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load power rankings.';
    return (
      <section className="card">
        <h1 className="section-title">Power Rankings</h1>
        <p className="mt-2 text-slate-300">{message}</p>
      </section>
    );
  }
}
