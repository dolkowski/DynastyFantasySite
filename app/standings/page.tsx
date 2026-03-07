import { StandingsTable } from '@/components/StandingsTable';
import { getLeagueSnapshot } from '@/lib/fantasyApi';

export const metadata = {
  title: 'Standings | Dynasty Fantasy HQ'
};

export default async function StandingsPage() {
  const { standings } = await getLeagueSnapshot();

  return (
    <section className="space-y-4">
      <h1 className="section-title">League Standings</h1>
      <StandingsTable standings={standings} />
    </section>
  );
}
