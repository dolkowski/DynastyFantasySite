import {
  NormalizedLeagueTeam,
  SleeperLeague,
  SleeperMatchup,
  SleeperNFLState,
  SleeperRoster,
  SleeperTransaction,
  SleeperTradedPick,
  SleeperUser
} from '@/types/sleeper';

const DEFAULT_BASE_URL = 'https://api.sleeper.app/v1';

export class SleeperApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly endpoint?: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'SleeperApiError';
  }
}

function getBaseUrl(): string {
  return (process.env.SLEEPER_API_BASE_URL ?? DEFAULT_BASE_URL).replace(/\/$/, '');
}

async function sleeperFetch<T>(path: string): Promise<T> {
  const endpoint = `${getBaseUrl()}${path}`;
  let response: Response;

  try {
    response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      },
      next: { revalidate: 60 }
    });
  } catch (error) {
    throw new SleeperApiError('Network error while contacting Sleeper API.', undefined, endpoint, error);
  }

  if (!response.ok) {
    throw new SleeperApiError(`Sleeper API request failed with status ${response.status}.`, response.status, endpoint);
  }

  try {
    return (await response.json()) as T;
  } catch (error) {
    throw new SleeperApiError('Invalid JSON response from Sleeper API.', response.status, endpoint, error);
  }
}

function assertLeagueId(leagueId: string): void {
  if (!leagueId?.trim()) {
    throw new SleeperApiError('A valid leagueId is required.');
  }
}

function assertWeek(week: number): void {
  if (!Number.isInteger(week) || week <= 0) {
    throw new SleeperApiError('Week must be a positive integer.');
  }
}

export async function getLeague(leagueId: string): Promise<SleeperLeague> {
  assertLeagueId(leagueId);
  return sleeperFetch<SleeperLeague>(`/league/${leagueId}`);
}

export async function getLeagueUsers(leagueId: string): Promise<SleeperUser[]> {
  assertLeagueId(leagueId);
  return sleeperFetch<SleeperUser[]>(`/league/${leagueId}/users`);
}

export async function getLeagueRosters(leagueId: string): Promise<SleeperRoster[]> {
  assertLeagueId(leagueId);
  return sleeperFetch<SleeperRoster[]>(`/league/${leagueId}/rosters`);
}

export async function getLeagueMatchups(leagueId: string, week: number): Promise<SleeperMatchup[]> {
  assertLeagueId(leagueId);
  assertWeek(week);
  return sleeperFetch<SleeperMatchup[]>(`/league/${leagueId}/matchups/${week}`);
}

export async function getLeagueTransactions(leagueId: string, week: number): Promise<SleeperTransaction[]> {
  assertLeagueId(leagueId);
  assertWeek(week);
  return sleeperFetch<SleeperTransaction[]>(`/league/${leagueId}/transactions/${week}`);
}

export async function getLeagueTradedPicks(leagueId: string): Promise<SleeperTradedPick[]> {
  assertLeagueId(leagueId);
  return sleeperFetch<SleeperTradedPick[]>(`/league/${leagueId}/traded_picks`);
}

export async function getNFLState(): Promise<SleeperNFLState> {
  return sleeperFetch<SleeperNFLState>('/state/nfl');
}

export function normalizeLeagueTeams(users: SleeperUser[], rosters: SleeperRoster[]): NormalizedLeagueTeam[] {
  const userMap = new Map(users.map((user) => [user.user_id, user]));

  return rosters.map((roster) => {
    const owner = roster.owner_id ? userMap.get(roster.owner_id) : undefined;
    const displayName = owner?.display_name ?? owner?.metadata?.team_name ?? `Roster ${roster.roster_id}`;

    return {
      rosterId: roster.roster_id,
      ownerId: roster.owner_id,
      displayName,
      username: owner?.username ?? 'Unknown Manager',
      avatar: owner?.avatar ?? null,
      wins: Number(roster.settings?.wins ?? 0),
      losses: Number(roster.settings?.losses ?? 0),
      ties: Number(roster.settings?.ties ?? 0),
      pointsFor: Number(`${roster.settings?.fpts ?? 0}.${roster.settings?.fpts_decimal ?? 0}`),
      pointsAgainst: Number(`${roster.settings?.fpts_against ?? 0}.${roster.settings?.fpts_against_decimal ?? 0}`),
      starters: roster.starters ?? [],
      players: roster.players ?? []
    };
  });
}

export async function getNormalizedLeagueTeams(leagueId: string): Promise<NormalizedLeagueTeam[]> {
  const [users, rosters] = await Promise.all([getLeagueUsers(leagueId), getLeagueRosters(leagueId)]);
  return normalizeLeagueTeams(users, rosters);
}

export const SLEEPER_LEAGUE_ID = '1312605770595995648';
