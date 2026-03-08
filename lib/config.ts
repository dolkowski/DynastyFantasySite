export class AppConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AppConfigError';
  }
}

/**
 * Central league-id resolver.
 * Server should provide SLEEPER_LEAGUE_ID; client code may use NEXT_PUBLIC_SLEEPER_LEAGUE_ID.
 */
export function getLeagueId(): string {
  const leagueId = process.env.SLEEPER_LEAGUE_ID ?? process.env.NEXT_PUBLIC_SLEEPER_LEAGUE_ID;

  if (!leagueId?.trim()) {
    const message = 'Missing league configuration. Set SLEEPER_LEAGUE_ID (or NEXT_PUBLIC_SLEEPER_LEAGUE_ID).';
    console.warn('[config] %s', message);
    throw new AppConfigError(message);
  }

  return leagueId.trim();
}
