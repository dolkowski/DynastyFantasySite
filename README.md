# Dynasty Fantasy Site

A production-ready Next.js App Router project for a fantasy football league website with a sports-media inspired interface.

## Features

- Next.js 14 App Router with TypeScript
- Tailwind CSS styling
- Reusable league UI components
- Page structure for:
  - League homepage
  - Standings
  - Weekly matchups
  - Team detail pages
  - Power rankings
- API client layer in `lib/` with environment-variable based configuration
- Sleeper API client with typed endpoints and normalized team helper
- Vercel-ready deployment configuration

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy environment variables:

   ```bash
   cp .env.example .env.local
   ```

3. Update `.env.local` with your provider credentials:

   - `FANTASY_API_BASE_URL`
   - `FANTASY_API_KEY`
   - `SLEEPER_API_BASE_URL` (optional, defaults to `https://api.sleeper.app/v1`)
   - `NEXT_PUBLIC_SITE_NAME` (optional)

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

## Sleeper Client

- File: `lib/sleeper.ts`
- Types: `types/sleeper.ts`
- Website data pulls from `lib/config.ts` constant `LEAGUE_ID`: `1312905624287203328`

Available functions:

- `getLeague(leagueId)`
- `getLeagueUsers(leagueId)`
- `getLeagueRosters(leagueId)`
- `getLeagueMatchups(leagueId, week)`
- `getLeagueTransactions(leagueId, week)`
- `getLeagueTradedPicks(leagueId)`
- `getNFLState()`
- `buildLeagueTeams(users, rosters)`
- `buildStandings(leagueTeams)`
- `buildWeeklyMatchups(matchups, leagueTeams)`
- `getNormalizedLeagueTeams(leagueId)`


## News Relevance System

- Generic provider interface: `lib/news.ts` (`NewsProvider`)
- Article model: `title`, `summary`, `url`, `publishedAt`, `source`, `tags`
- Relevance scoring favors title mentions of rostered players, then summary mentions, then NFL team mentions
- Helpers:
  - `getTopRelevantArticlesForRoster(articles, roster, limit)`
  - `getTopRelevantArticlesByTeam(provider, rosters, options)`
  - `createStaticNewsProvider(articles)`

The system is provider-agnostic so any NFL news API can be plugged in by implementing `NewsProvider`.

## Project Structure

```text
app/
  page.tsx
  standings/page.tsx
  matchups/page.tsx
  teams/[rosterId]/page.tsx
  power-rankings/page.tsx
components/
  Header.tsx
  LeagueHero.tsx
  MatchupList.tsx
  PowerRankings.tsx
  StandingsTable.tsx
  TeamDetail.tsx
lib/
  fantasyApi.ts
  sleeper.ts
  types.ts
types/
  sleeper.ts
data/
  mockLeagueData.ts
```

## Deployment (Vercel)

1. Push this repository to GitHub.
2. Import the repo in Vercel.
3. Add environment variables from `.env.example` in Vercel project settings.
4. Deploy.

The included `vercel.json` marks the app as a Next.js framework project.
