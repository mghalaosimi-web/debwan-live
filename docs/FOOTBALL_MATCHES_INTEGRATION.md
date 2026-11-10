# Football fixtures and results integration

## Provider

The football hub uses API Ninjas' Soccer Matches endpoint:
- Endpoint: https://api.api-ninjas.com/v1/soccermatches
- API reference: https://api-ninjas.com/api/football
- Server-side environment variable: `API_NINJAS_KEY`
- Free plan: current-season fixtures, results, tables and squads. It exposes in-progress status, but live score, match minute, period and live events are paid-plan fields. Final scores become available after the match ends.
- Free key registration: https://api-ninjas.com/register (provider states no credit card is required).

## Configuration

Set `API_NINJAS_KEY` in the frontend deployment's server environment (Vercel/Render, depending on the active deployment). Do not prefix it with `NEXT_PUBLIC_`; the key must remain server-side.

For local development, copy `frontend/.env.example` to `frontend/.env.local` and add the key.

## Implemented endpoint

`GET /api/football/matches?league=saudiproleague&date=YYYY-MM-DD`

- Validates league against a fixed allowlist.
- Validates the optional date.
- Keeps the API key on the server.
- Requests provider data with a 12-second timeout.
- Normalizes and filters match records before returning them.
- Caches successful data for 5 minutes.
- Returns explicit configuration/provider errors; it never fills missing data with fabricated fixtures.

## Current supported competitions

Saudi Pro League, Premier League, La Liga, Bundesliga, Serie A, Ligue 1, UEFA Champions League, Europa League, Conference League, CAF Champions League, AFC Champions League, Brasileirão, MLS, World Cup and AFCON.

## Product behavior and limitations

- The page defaults to Saudi Pro League and the current date in Asia/Aden.
- Visitors can select a competition and date, filter all/live/upcoming/finished, and manually refresh.
- Data refreshes every 5 minutes.
- Kickoff times are rendered in Asia/Aden.
- A live match without a score is shown as live with no score, because the provider's free tier does not expose live score values.
- A missing API key produces a configuration notice and registration link, not mock content.

## Rights and attribution

This integration consumes a licensed data API under its own terms. It is separate from broadcaster video rights. It does not embed, extract, proxy or redistribute any television stream.
