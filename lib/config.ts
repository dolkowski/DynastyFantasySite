export class AppConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AppConfigError';
  }
}

export function getLeagueId(): string {
  const leagueId = process.env.SLEEPER_LEAGUE_ID ?? process.env.NEXT_PUBLIC_SLEEPER_LEAGUE_ID;

  if (!leagueId?.trim()) {
    throw new AppConfigError('Missing league configuration. Set SLEEPER_LEAGUE_ID (or NEXT_PUBLIC_SLEEPER_LEAGUE_ID).');
  }

  return leagueId.trim();
}
