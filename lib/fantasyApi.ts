import { getLeagueId } from '@/lib/config';
import {
  buildStandings,
  buildWeeklyMatchups,
  getLeague,
  getLeagueMatchups,
  getNFLState,
  getNormalizedLeagueTeams
} from '@/lib/sleeper';
import { LeagueSnapshot, TeamProfile } from '@/lib/types';

export async function getLeagueSnapshot(): Promise<LeagueSnapshot> {
  const leagueId = getLeagueId();
  console.log('Loading Sleeper League:', leagueId);

  const [league, nflState, teams] = await Promise.all([
    getLeague(leagueId),
    getNFLState(),
    getNormalizedLeagueTeams(leagueId)
  ]);

  const currentWeek = nflState.week;
  const rawMatchups = await getLeagueMatchups(leagueId, currentWeek);
  const standings = buildStandings(teams);
  const weeklyMatchups = buildWeeklyMatchups(rawMatchups, teams);

  return {
    summary: {
      leagueName: league.name,
      season: Number(league.season),
      currentWeek,
      totalTeams: league.total_rosters,
      headline: `Live update for week ${currentWeek} in ${league.name}.`
    },
    currentWeek,
    standings: standings.map((team) => ({
      id: String(team.rosterId),
      name: team.teamName,
      manager: team.displayName,
      wins: team.wins,
      losses: team.losses,
      pointsFor: team.pointsFor,
      pointsAgainst: team.pointsAgainst,
      streak: team.ties > 0 ? `T${team.ties}` : '-'
    })),
    weeklyMatchups: weeklyMatchups
      .filter((matchup) => matchup.teams.length === 2)
      .map((matchup) => ({
        id: String(matchup.matchupId),
        homeTeamId: String(matchup.teams[1].rosterId),
        awayTeamId: String(matchup.teams[0].rosterId),
        homeTeamName: matchup.teams[1].teamName,
        awayTeamName: matchup.teams[0].teamName,
        homeProjection: matchup.teams[1].pointsFor,
        awayProjection: matchup.teams[0].pointsFor,
        kickoffLabel: `Week ${currentWeek}`
      })),
    powerRankings: standings.map((team, index) => ({
      rank: index + 1,
      rosterId: String(team.rosterId),
      teamName: team.teamName,
      trend: 'steady' as const,
      note: `${team.wins}-${team.losses}${team.ties ? `-${team.ties}` : ''} record with ${team.pointsFor.toFixed(2)} PF.`
    })),
    teamProfiles: standings.map((team) => ({
      id: String(team.rosterId),
      name: team.teamName,
      manager: team.displayName,
      wins: team.wins,
      losses: team.losses,
      pointsFor: team.pointsFor,
      pointsAgainst: team.pointsAgainst,
      streak: team.ties > 0 ? `T${team.ties}` : '-',
      division: 'Sleeper League',
      rosterHighlights: [
        `${team.starterPlayerIds.length} starters configured`,
        `${team.benchPlayerIds.length} bench players`,
        `${team.allPlayerIds.length} total rostered players`
      ],
      nextOpponent: 'TBD'
    }))
  };
}

export async function getTeamByRosterId(rosterId: string): Promise<TeamProfile | undefined> {
  const { teamProfiles } = await getLeagueSnapshot();
  return teamProfiles.find((team) => team.id === rosterId);
}
