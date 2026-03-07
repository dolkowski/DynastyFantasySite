import { mockLeagueData } from '@/data/mockLeagueData';
import { LeagueSnapshot, TeamProfile } from '@/lib/types';

const API_BASE_URL = process.env.FANTASY_API_BASE_URL;
const API_KEY = process.env.FANTASY_API_KEY;

async function fetchFromProvider<T>(path: string): Promise<T | null> {
  if (!API_BASE_URL || !API_KEY) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      next: { revalidate: 300 }
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function getLeagueSnapshot(): Promise<LeagueSnapshot> {
  const remote = await fetchFromProvider<LeagueSnapshot>('/league/snapshot');
  return remote ?? mockLeagueData;
}

export async function getTeamById(teamId: string): Promise<TeamProfile | undefined> {
  const remote = await fetchFromProvider<TeamProfile>(`/teams/${teamId}`);
  if (remote) {
    return remote;
  }

  return mockLeagueData.teamProfiles.find((team) => team.id === teamId);
}
