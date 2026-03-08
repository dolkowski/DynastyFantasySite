export type LeagueSummary = {
  leagueName: string;
  season: number;
  currentWeek: number;
  totalTeams: number;
  headline: string;
};

export type TeamRecord = {
  id: string;
  name: string;
  manager: string;
  wins: number;
  losses: number;
  pointsFor: number;
  pointsAgainst: number;
  streak: string;
};

export type Matchup = {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeTeamName: string;
  awayTeamName: string;
  homeProjection: number;
  awayProjection: number;
  kickoffLabel: string;
};

export type Ranking = {
  rank: number;
  rosterId: string;
  teamName: string;
  trend: 'up' | 'down' | 'steady';
  note: string;
};

export type TeamProfile = TeamRecord & {
  division: string;
  rosterHighlights: string[];
  nextOpponent: string;
};

export type LeagueSnapshot = {
  summary: LeagueSummary;
  currentWeek: number;
  standings: TeamRecord[];
  weeklyMatchups: Matchup[];
  powerRankings: Ranking[];
  teamProfiles: TeamProfile[];
};
