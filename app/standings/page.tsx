import { StandingsTable } from '@/components/StandingsTable';
import { getLeagueSnapshot } from '@/lib/fantasyApi';

export const metadata = {
  title: 'Standings | Dynasty Fantasy HQ'
};

export default async function StandingsPage() {
  try {
    const { standings } = await getLeagueSnapshot();

    return (
      <section className="space-y-4">
        <h1 className="section-title">League Standings</h1>
        <StandingsTable standings={standings} />
      </section>
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load standings.';
    return (
      <section className="card">
        <h1 className="section-title">League Standings</h1>
        <p className="mt-2 text-slate-300">{message}</p>
      </section>
    );
  }
}
