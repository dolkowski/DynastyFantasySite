import { notFound } from 'next/navigation';
import { TeamDetail } from '@/components/TeamDetail';
import { getLeagueSnapshot, getTeamById } from '@/lib/fantasyApi';

export async function generateStaticParams() {
  const { standings } = await getLeagueSnapshot();
  return standings.map((team) => ({ teamId: team.id }));
}

export async function generateMetadata({ params }: { params: { teamId: string } }) {
  const team = await getTeamById(params.teamId);

  return {
    title: team ? `${team.name} | Dynasty Fantasy HQ` : 'Team Not Found | Dynasty Fantasy HQ'
  };
}

export default async function TeamDetailPage({ params }: { params: { teamId: string } }) {
  const team = await getTeamById(params.teamId);

  if (!team) {
    notFound();
  }

  return <TeamDetail team={team} />;
}
