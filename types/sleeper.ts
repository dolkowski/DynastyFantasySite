export interface SleeperLeague {
  league_id: string;
  name: string;
  season: string;
  sport: string;
  total_rosters: number;
  status: string;
  avatar?: string | null;
  previous_league_id?: string;
  settings?: Record<string, number | string | null>;
  scoring_settings?: Record<string, number>;
  roster_positions?: string[];
  metadata?: Record<string, string>;
}

export interface SleeperUser {
  user_id: string;
  username?: string | null;
  display_name?: string | null;
  avatar?: string | null;
  metadata?: Record<string, string>;
}

export interface SleeperRosterSettings {
  wins?: number;
  losses?: number;
  ties?: number;
  fpts?: number;
  fpts_decimal?: number;
  fpts_against?: number;
  fpts_against_decimal?: number;
  [key: string]: number | string | undefined;
}

export interface SleeperRoster {
  roster_id: number;
  owner_id: string | null;
  players: string[] | null;
  starters: string[];
  reserve?: string[];
  taxi?: string[];
  keepers?: string[];
  settings: SleeperRosterSettings;
  metadata?: Record<string, string>;
}

export interface SleeperMatchup {
  matchup_id: number;
  roster_id: number;
  points: number;
  players?: string[];
  starters?: string[];
  custom_points?: Record<string, number | null>;
}

export interface SleeperTransaction {
  transaction_id: string;
  status: 'complete' | 'failed' | 'pending' | string;
  type: 'trade' | 'waiver' | 'free_agent' | 'commissioner' | string;
  roster_ids: number[];
  creator: string;
  created: number;
  status_updated?: number;
  adds?: Record<string, number>;
  drops?: Record<string, number>;
  drafts?: Array<Record<string, unknown>>;
  settings?: Record<string, unknown>;
  metadata?: Record<string, string>;
}

export interface SleeperTradedPick {
  season: string;
  round: number;
  roster_id: number;
  owner_id: number;
  previous_owner_id: number;
}

export interface SleeperNFLState {
  season: string;
  season_type: string;
  week: number;
  leg: number;
  league_season: string;
  previous_season: string;
  display_week: number;
}

export interface LeagueTeam {
  rosterId: number;
  ownerId: string | null;
  teamName: string;
  displayName: string;
  username: string;
  avatar: string | null;
  wins: number;
  losses: number;
  ties: number;
  pointsFor: number;
  pointsAgainst: number;
  starterPlayerIds: string[];
  benchPlayerIds: string[];
  allPlayerIds: string[];
}

export interface LeagueWeeklyMatchup {
  matchupId: number;
  teams: LeagueTeam[];
  isComplete: boolean;
}

export type NormalizedLeagueTeam = LeagueTeam;
