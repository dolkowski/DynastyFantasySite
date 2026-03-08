import {
  FeaturedMatchup,
  LeagueTeam,
  LeagueWeeklyMatchup,
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

/**
 * Shared GET helper for official Sleeper endpoints.
 * Docs: https://docs.sleeper.com/
 */
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
    console.warn('[sleeper] request failed: %s (%s)', path, endpoint);
    throw new SleeperApiError('Network error while contacting Sleeper API.', undefined, endpoint, error);
  }

  if (!response.ok) {
    console.warn('[sleeper] non-200 response: %s status=%s', endpoint, response.status);
    throw new SleeperApiError(`Sleeper API request failed with status ${response.status}.`, response.status, endpoint);
  }

  try {
    return (await response.json()) as T;
  } catch (error) {
    console.warn('[sleeper] invalid JSON payload from %s', endpoint);
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

function assertArray<T>(value: unknown, entity: string): asserts value is T[] {
  if (!Array.isArray(value)) {
    console.warn('[sleeper] unexpected payload for %s', entity);
    throw new SleeperApiError(`Unexpected Sleeper payload for ${entity}.`);
  }
}

function toFantasyPoints(whole?: number, decimal?: number): number {
  const safeWhole = Number(whole ?? 0);
  const safeDecimal = String(decimal ?? 0).padStart(2, '0');
  return Number.parseFloat(`${safeWhole}.${safeDecimal}`);
}

function resolveTeamName(user?: SleeperUser, roster?: SleeperRoster): string {
  const metadataTeamName = user?.metadata?.team_name ?? roster?.metadata?.team_name;
  return metadataTeamName ?? user?.display_name ?? user?.username ?? `Roster ${roster?.roster_id ?? 'Unknown'}`;
}

function getWinPct(team: LeagueTeam): number {
  const totalGames = team.wins + team.losses + team.ties;
  if (totalGames === 0) {
    return 0;
  }

  return (team.wins + team.ties * 0.5) / totalGames;
}

// GET /league/{league_id}
export async function getLeague(leagueId: string): Promise<SleeperLeague> {
  assertLeagueId(leagueId);
  const league = await sleeperFetch<SleeperLeague>(`/league/${leagueId}`);

  if (!league || typeof league !== 'object' || typeof league.league_id !== 'string') {
    console.warn('[sleeper] unexpected payload for league %s', leagueId);
    throw new SleeperApiError('Unexpected Sleeper payload for league.');
  }

  return league;
}

// GET /league/{league_id}/users
export async function getLeagueUsers(leagueId: string): Promise<SleeperUser[]> {
  assertLeagueId(leagueId);
  const users = await sleeperFetch<SleeperUser[]>(`/league/${leagueId}/users`);
  assertArray<SleeperUser>(users, 'league users');
  return users;
}

// GET /league/{league_id}/rosters
export async function getLeagueRosters(leagueId: string): Promise<SleeperRoster[]> {
  assertLeagueId(leagueId);
  const rosters = await sleeperFetch<SleeperRoster[]>(`/league/${leagueId}/rosters`);
  assertArray<SleeperRoster>(rosters, 'league rosters');
  return rosters;
}

// GET /league/{league_id}/matchups/{week}
export async function getLeagueMatchups(leagueId: string, week: number): Promise<SleeperMatchup[]> {
  assertLeagueId(leagueId);
  assertWeek(week);
  const matchups = await sleeperFetch<SleeperMatchup[]>(`/league/${leagueId}/matchups/${week}`);
  assertArray<SleeperMatchup>(matchups, 'league matchups');
  return matchups;
}

export async function getLeagueTransactions(leagueId: string, week: number): Promise<SleeperTransaction[]> {
  assertLeagueId(leagueId);
  assertWeek(week);
  const transactions = await sleeperFetch<SleeperTransaction[]>(`/league/${leagueId}/transactions/${week}`);
  assertArray<SleeperTransaction>(transactions, 'league transactions');
  return transactions;
}

export async function getLeagueTradedPicks(leagueId: string): Promise<SleeperTradedPick[]> {
  assertLeagueId(leagueId);
  const picks = await sleeperFetch<SleeperTradedPick[]>(`/league/${leagueId}/traded_picks`);
  assertArray<SleeperTradedPick>(picks, 'traded picks');
  return picks;
}

// GET /state/nfl
export async function getNFLState(): Promise<SleeperNFLState> {
  const state = await sleeperFetch<SleeperNFLState>('/state/nfl');

  if (!state || typeof state !== 'object' || typeof state.week !== 'number') {
    console.warn('[sleeper] unexpected payload for nfl state');
    throw new SleeperApiError('Unexpected Sleeper payload for NFL state.');
  }

  return state;
}

export function buildLeagueTeams(users: SleeperUser[], rosters: SleeperRoster[]): LeagueTeam[] {
  const userMap = new Map(users.map((user) => [user.user_id, user]));

  return rosters.map((roster) => {
    const owner = roster.owner_id ? userMap.get(roster.owner_id) : undefined;
    const starterPlayerIds = (roster.starters ?? []).filter(Boolean);
    const allPlayerIds = (roster.players ?? []).filter(Boolean);
    const starterSet = new Set(starterPlayerIds);

    return {
      rosterId: roster.roster_id,
      ownerId: roster.owner_id,
      teamName: resolveTeamName(owner, roster),
      displayName: owner?.display_name ?? owner?.username ?? `Roster ${roster.roster_id}`,
      username: owner?.username ?? 'Unknown Manager',
      avatar: owner?.avatar ?? null,
      wins: Number(roster.settings?.wins ?? 0),
      losses: Number(roster.settings?.losses ?? 0),
      ties: Number(roster.settings?.ties ?? 0),
      pointsFor: toFantasyPoints(roster.settings?.fpts, roster.settings?.fpts_decimal),
      pointsAgainst: toFantasyPoints(roster.settings?.fpts_against, roster.settings?.fpts_against_decimal),
      starterPlayerIds,
      benchPlayerIds: allPlayerIds.filter((playerId) => !starterSet.has(playerId)),
      allPlayerIds
    };
  });
}

export function buildStandings(leagueTeams: LeagueTeam[]): LeagueTeam[] {
  return [...leagueTeams].sort((a, b) => {
    if (b.wins !== a.wins) {
      return b.wins - a.wins;
    }

    if (b.pointsFor !== a.pointsFor) {
      return b.pointsFor - a.pointsFor;
    }

    return a.teamName.localeCompare(b.teamName);
  });
}

export function buildWeeklyMatchups(matchups: SleeperMatchup[], leagueTeams: LeagueTeam[]): LeagueWeeklyMatchup[] {
  const teamByRosterId = new Map(leagueTeams.map((team) => [team.rosterId, team]));
  const grouped = new Map<number, LeagueTeam[]>();

  for (const matchup of matchups) {
    const team = teamByRosterId.get(matchup.roster_id);
    if (!team) {
      continue;
    }

    const bucket = grouped.get(matchup.matchup_id) ?? [];
    bucket.push(team);
    grouped.set(matchup.matchup_id, bucket);
  }

  return [...grouped.entries()]
    .map(([matchupId, teams]) => ({
      matchupId,
      teams,
      isComplete: teams.length === 2
    }))
    .sort((a, b) => a.matchupId - b.matchupId);
}

export function selectFeaturedMatchup(matchups: LeagueWeeklyMatchup[], standings: LeagueTeam[]): FeaturedMatchup | null {
  const rankByRoster = new Map(standings.map((team, index) => [team.rosterId, index + 1]));

  let best: FeaturedMatchup | null = null;

  for (const matchup of matchups) {
    if (!matchup.isComplete || matchup.teams.length !== 2) {
      continue;
    }

    const [teamA, teamB] = matchup.teams as [LeagueTeam, LeagueTeam];
    const rankA = rankByRoster.get(teamA.rosterId) ?? standings.length;
    const rankB = rankByRoster.get(teamB.rosterId) ?? standings.length;

    const rankGap = Math.abs(rankA - rankB);
    const closenessScore = Math.max(0, standings.length - rankGap) * 3;
    const combinedPointsScore = (teamA.pointsFor + teamB.pointsFor) / 20;
    const bothAbove500Bonus = getWinPct(teamA) > 0.5 && getWinPct(teamB) > 0.5 ? 10 : 0;
    const score = closenessScore + combinedPointsScore + bothAbove500Bonus;

    const blurb = `AI Blurb Placeholder: ${teamA.teamName} and ${teamB.teamName} are separated by ${rankGap} spot${rankGap === 1 ? '' : 's'} in the standings and combine for ${(teamA.pointsFor + teamB.pointsFor).toFixed(2)} points-for, making this one of the week's most compelling matchups.`;

    if (!best || score > best.score) {
      best = {
        matchupId: matchup.matchupId,
        teams: [teamA, teamB],
        score,
        blurb
      };
    }
  }

  return best;
}

export async function getNormalizedLeagueTeams(leagueId: string): Promise<LeagueTeam[]> {
  const [users, rosters] = await Promise.all([getLeagueUsers(leagueId), getLeagueRosters(leagueId)]);
  return buildLeagueTeams(users, rosters);
}
