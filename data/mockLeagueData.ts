import { LeagueSnapshot } from '@/lib/types';

export const mockLeagueData: LeagueSnapshot = {
  summary: {
    leagueName: 'Dynasty Legends League',
    season: 2026,
    currentWeek: 7,
    totalTeams: 12,
    headline: 'Playoff race tightening as contenders surge into midseason form.'
  },
  currentWeek: 7,
  standings: [
    { id: 'ironclad', name: 'Ironclad Wolves', manager: 'A. Rivera', wins: 6, losses: 1, pointsFor: 891.4, pointsAgainst: 742.8, streak: 'W4' },
    { id: 'gridiron', name: 'Gridiron Guild', manager: 'M. Johnson', wins: 5, losses: 2, pointsFor: 857.6, pointsAgainst: 801.1, streak: 'W2' },
    { id: 'dynasty', name: 'Dynasty Signal', manager: 'R. Kim', wins: 5, losses: 2, pointsFor: 844.2, pointsAgainst: 779.5, streak: 'L1' },
    { id: 'blitz', name: 'Blitz Bureau', manager: 'C. Patel', wins: 4, losses: 3, pointsFor: 832.9, pointsAgainst: 829.2, streak: 'W1' },
    { id: 'renegades', name: 'Fourth Down Renegades', manager: 'T. Lee', wins: 4, losses: 3, pointsFor: 807.5, pointsAgainst: 790.3, streak: 'W3' },
    { id: 'thunder', name: 'Sunday Thunder', manager: 'J. Baker', wins: 3, losses: 4, pointsFor: 801.7, pointsAgainst: 814.8, streak: 'L2' },
    { id: 'tailgate', name: 'Tailgate Titans', manager: 'D. Miller', wins: 3, losses: 4, pointsFor: 798.3, pointsAgainst: 809.6, streak: 'W1' },
    { id: 'airraid', name: 'Air Raid Union', manager: 'P. Nguyen', wins: 3, losses: 4, pointsFor: 785.3, pointsAgainst: 793.2, streak: 'L1' },
    { id: 'neon', name: 'Neon Endzone', manager: 'S. Brooks', wins: 2, losses: 5, pointsFor: 772.4, pointsAgainst: 830.1, streak: 'L3' },
    { id: 'huddle', name: 'Huddle House', manager: 'B. Scott', wins: 2, losses: 5, pointsFor: 751.5, pointsAgainst: 825.4, streak: 'W1' },
    { id: 'safeties', name: 'Two Safeties', manager: 'N. Davis', wins: 2, losses: 5, pointsFor: 744.9, pointsAgainst: 849.3, streak: 'L2' },
    { id: 'redzone', name: 'Red Zone Syndicate', manager: 'K. Turner', wins: 1, losses: 6, pointsFor: 716.8, pointsAgainst: 861.2, streak: 'L5' }
  ],
  weeklyMatchups: [
    {
      id: 'm1',
      homeTeamId: 'ironclad',
      awayTeamId: 'gridiron',
      homeTeamName: 'Ironclad Wolves',
      awayTeamName: 'Gridiron Guild',
      homeProjection: 127.6,
      awayProjection: 124.1,
      kickoffLabel: 'Sun 1:00 PM ET'
    },
    {
      id: 'm2',
      homeTeamId: 'dynasty',
      awayTeamId: 'renegades',
      homeTeamName: 'Dynasty Signal',
      awayTeamName: 'Fourth Down Renegades',
      homeProjection: 119.3,
      awayProjection: 118.9,
      kickoffLabel: 'Sun 4:25 PM ET'
    },
    {
      id: 'm3',
      homeTeamId: 'thunder',
      awayTeamId: 'tailgate',
      homeTeamName: 'Sunday Thunder',
      awayTeamName: 'Tailgate Titans',
      homeProjection: 111.8,
      awayProjection: 113.2,
      kickoffLabel: 'Mon 8:15 PM ET'
    }
  ],
  powerRankings: [
    { rank: 1, teamId: 'ironclad', teamName: 'Ironclad Wolves', trend: 'steady', note: 'Elite consistency with top scoring floor.' },
    { rank: 2, teamId: 'gridiron', teamName: 'Gridiron Guild', trend: 'up', note: 'Back-to-back dominant performances.' },
    { rank: 3, teamId: 'dynasty', teamName: 'Dynasty Signal', trend: 'down', note: 'Still explosive but turnover concerns are rising.' },
    { rank: 4, teamId: 'renegades', teamName: 'Fourth Down Renegades', trend: 'up', note: 'Three straight wins and improving depth.' },
    { rank: 5, teamId: 'blitz', teamName: 'Blitz Bureau', trend: 'steady', note: 'Reliable starters, but thin bench upside.' },
    { rank: 6, teamId: 'tailgate', teamName: 'Tailgate Titans', trend: 'up', note: 'Strong waiver pickups changed trajectory.' },
    { rank: 7, teamId: 'thunder', teamName: 'Sunday Thunder', trend: 'down', note: 'Needs WR production to rebound.' },
    { rank: 8, teamId: 'airraid', teamName: 'Air Raid Union', trend: 'steady', note: 'Balanced lineup yet lacking a weekly ceiling.' },
    { rank: 9, teamId: 'huddle', teamName: 'Huddle House', trend: 'up', note: 'Breakout rookie RB fueling optimism.' },
    { rank: 10, teamId: 'neon', teamName: 'Neon Endzone', trend: 'down', note: 'Injury wave is hurting lineup stability.' },
    { rank: 11, teamId: 'safeties', teamName: 'Two Safeties', trend: 'steady', note: 'Close losses suggest better days ahead.' },
    { rank: 12, teamId: 'redzone', teamName: 'Red Zone Syndicate', trend: 'down', note: 'Urgent trade moves needed before deadline.' }
  ],
  teamProfiles: [
    {
      id: 'ironclad',
      name: 'Ironclad Wolves',
      manager: 'A. Rivera',
      wins: 6,
      losses: 1,
      pointsFor: 891.4,
      pointsAgainst: 742.8,
      streak: 'W4',
      division: 'North',
      rosterHighlights: ['QB averaging 27.4 PPG', 'RB duo ranks top-5 in red zone touches', 'Defense leads league in sacks'],
      nextOpponent: 'Gridiron Guild'
    },
    {
      id: 'gridiron',
      name: 'Gridiron Guild',
      manager: 'M. Johnson',
      wins: 5,
      losses: 2,
      pointsFor: 857.6,
      pointsAgainst: 801.1,
      streak: 'W2',
      division: 'North',
      rosterHighlights: ['WR1 has 4 straight 20+ outings', 'Top TE in target share', 'Kicker averaging 9.1 PPG'],
      nextOpponent: 'Ironclad Wolves'
    },
    {
      id: 'dynasty',
      name: 'Dynasty Signal',
      manager: 'R. Kim',
      wins: 5,
      losses: 2,
      pointsFor: 844.2,
      pointsAgainst: 779.5,
      streak: 'L1',
      division: 'South',
      rosterHighlights: ['Pass-heavy attack with highest yards per game', 'Three RBs with weekly flex value', 'Bench depth improving'],
      nextOpponent: 'Fourth Down Renegades'
    }
  ]
};
