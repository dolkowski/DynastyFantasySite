import { PowerRankings } from '@/components/PowerRankings';
import { getLeagueSnapshot } from '@/lib/fantasyApi';

export const metadata = {
  title: 'Power Rankings | Dynasty Fantasy HQ'
};

export default async function PowerRankingsPage() {
  const { powerRankings } = await getLeagueSnapshot();

  return (
    <section className="space-y-4">
      <h1 className="section-title">Power Rankings</h1>
      <PowerRankings rankings={powerRankings} showAll />
    </section>
  );
}
