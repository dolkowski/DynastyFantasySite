export interface NewsArticle {
  title: string;
  summary: string;
  url: string;
  publishedAt: string;
  source: string;
  tags: string[];
}

export interface NewsProvider {
  getLatestArticles(options?: { limit?: number }): Promise<NewsArticle[]>;
}

export interface FantasyRosterPlayer {
  id: string;
  fullName: string;
  nflTeam?: string;
  aliases?: string[];
}

export interface FantasyRosterProfile {
  rosterId: string | number;
  teamName: string;
  players: FantasyRosterPlayer[];
}

export interface RelevanceScoreBreakdown {
  totalScore: number;
  titlePlayerMentions: number;
  summaryPlayerMentions: number;
  titleTeamMentions: number;
  summaryTeamMentions: number;
  recencyScore: number;
}

export interface RelevantNewsArticle {
  article: NewsArticle;
  score: RelevanceScoreBreakdown;
}

const TITLE_PLAYER_WEIGHT = 25;
const SUMMARY_PLAYER_WEIGHT = 10;
const TITLE_TEAM_WEIGHT = 6;
const SUMMARY_TEAM_WEIGHT = 3;
const MAX_RECENCY_SCORE = 8;

function normalize(input: string): string {
  return input.toLowerCase();
}

function safeDate(input: string): Date | null {
  const parsed = new Date(input);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function countPhraseMatches(text: string, phrase: string): number {
  const normalizedText = normalize(text);
  const normalizedPhrase = normalize(phrase).trim();

  if (!normalizedPhrase) {
    return 0;
  }

  let count = 0;
  let startIndex = 0;

  while (true) {
    const found = normalizedText.indexOf(normalizedPhrase, startIndex);
    if (found === -1) {
      return count;
    }

    count += 1;
    startIndex = found + normalizedPhrase.length;
  }
}

function scoreArticleRecency(publishedAt: string): number {
  const publishedDate = safeDate(publishedAt);
  if (!publishedDate) {
    return 0;
  }

  const ageHours = Math.max(0, (Date.now() - publishedDate.getTime()) / 36e5);

  if (ageHours <= 6) {
    return MAX_RECENCY_SCORE;
  }

  if (ageHours <= 24) {
    return 6;
  }

  if (ageHours <= 72) {
    return 3;
  }

  return 1;
}

function getPlayerNameCandidates(player: FantasyRosterPlayer): string[] {
  const names = [player.fullName, ...(player.aliases ?? [])];
  return names.filter((name) => name.trim().length > 0);
}

function scoreArticleAgainstRoster(article: NewsArticle, roster: FantasyRosterProfile): RelevanceScoreBreakdown {
  const title = article.title ?? '';
  const summary = article.summary ?? '';

  let titlePlayerMentions = 0;
  let summaryPlayerMentions = 0;
  let titleTeamMentions = 0;
  let summaryTeamMentions = 0;

  for (const player of roster.players) {
    const playerNames = getPlayerNameCandidates(player);
    for (const playerName of playerNames) {
      titlePlayerMentions += countPhraseMatches(title, playerName);
      summaryPlayerMentions += countPhraseMatches(summary, playerName);
    }

    if (player.nflTeam) {
      titleTeamMentions += countPhraseMatches(title, player.nflTeam);
      summaryTeamMentions += countPhraseMatches(summary, player.nflTeam);
    }
  }

  const recencyScore = scoreArticleRecency(article.publishedAt);

  const totalScore =
    titlePlayerMentions * TITLE_PLAYER_WEIGHT +
    summaryPlayerMentions * SUMMARY_PLAYER_WEIGHT +
    titleTeamMentions * TITLE_TEAM_WEIGHT +
    summaryTeamMentions * SUMMARY_TEAM_WEIGHT +
    recencyScore;

  return {
    totalScore,
    titlePlayerMentions,
    summaryPlayerMentions,
    titleTeamMentions,
    summaryTeamMentions,
    recencyScore
  };
}

export function getTopRelevantArticlesForRoster(
  articles: NewsArticle[],
  roster: FantasyRosterProfile,
  limit = 5
): RelevantNewsArticle[] {
  const ranked = articles
    .map((article) => ({
      article,
      score: scoreArticleAgainstRoster(article, roster)
    }))
    .filter((entry) => entry.score.totalScore > 0)
    .sort((a, b) => {
      if (b.score.totalScore !== a.score.totalScore) {
        return b.score.totalScore - a.score.totalScore;
      }

      return (safeDate(b.article.publishedAt)?.getTime() ?? 0) - (safeDate(a.article.publishedAt)?.getTime() ?? 0);
    });

  return ranked.slice(0, limit);
}

export async function getTopRelevantArticlesByTeam(
  provider: NewsProvider,
  rosters: FantasyRosterProfile[],
  options?: { articleLimit?: number; perTeamLimit?: number }
): Promise<Record<string, RelevantNewsArticle[]>> {
  const allArticles = await provider.getLatestArticles({ limit: options?.articleLimit });
  const perTeamLimit = options?.perTeamLimit ?? 5;

  const result: Record<string, RelevantNewsArticle[]> = {};

  for (const roster of rosters) {
    result[String(roster.rosterId)] = getTopRelevantArticlesForRoster(allArticles, roster, perTeamLimit);
  }

  return result;
}

export function createStaticNewsProvider(articles: NewsArticle[]): NewsProvider {
  return {
    async getLatestArticles() {
      return articles;
    }
  };
}
