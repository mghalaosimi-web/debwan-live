import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 60;

type ProviderMatch = {
  home?: string;
  away?: string;
  home_logo?: string;
  away_logo?: string;
  home_score?: number | string | null;
  away_score?: number | string | null;
  status?: string;
  status_text?: string;
  time?: string;
  competition?: string;
  competition_logo?: string;
  url?: string;
};

function validDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams;
  const date = search.get("date") || new Date().toISOString().slice(0, 10);
  const status = search.get("status");
  const competition = search.get("competition")?.trim();
  const team = search.get("team")?.trim();

  if (!validDate(date)) {
    return NextResponse.json(
      { success: false, code: "INVALID_DATE", message: "صيغة التاريخ يجب أن تكون YYYY-MM-DD." },
      { status: 400 }
    );
  }
  if (status && !["live", "finished", "upcoming"].includes(status)) {
    return NextResponse.json(
      { success: false, code: "INVALID_STATUS", message: "حالة المباريات غير صالحة." },
      { status: 400 }
    );
  }
  if ((competition && (competition.length > 100 || /[<>]/.test(competition))) ||
      (team && (team.length > 100 || /[<>]/.test(team)))) {
    return NextResponse.json(
      { success: false, code: "INVALID_FILTER", message: "قيمة البحث غير صالحة." },
      { status: 400 }
    );
  }

  const requestedDate = new Date(`${date}T00:00:00.000Z`);
  const previousUtcDate = new Date(requestedDate.getTime() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const fetchDate = async (utcDate: string) => {
    const params = new URLSearchParams({ sport: "football", date: utcDate, limit: "200" });
    if (status) params.set("status", status);
    if (competition) params.set("competition", competition);
    if (team) params.set("team", team);
    const response = await fetch(`https://sportscore.com/api/v1/fixtures/?${params.toString()}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(12000),
    });
    if (!response.ok) {
      const error = new Error(response.status === 429 ? "RATE_LIMIT" : "UPSTREAM_ERROR");
      (error as Error & { status?: number }).status = response.status;
      throw error;
    }
    const payload = await response.json() as { matches?: ProviderMatch[] };
    if (!Array.isArray(payload.matches)) throw new Error("INVALID_PROVIDER_RESPONSE");
    return payload.matches;
  };

  try {
    // The viewer selects a Yemen calendar day (UTC+3), so include the previous UTC
    // day as well, then retain only kickoffs that fall on the requested Yemen date.
    const [previousMatches, currentMatches] = await Promise.all([
      fetchDate(previousUtcDate),
      fetchDate(date),
    ]);
    const localDateMatches = [...previousMatches, ...currentMatches].filter((match) => {
      if (!match.time) return false;
      const kickoffDate = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Aden",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date(match.time));
      return kickoffDate === date;
    });

    const matches = localDateMatches
      .filter((match) => Boolean(match.home && match.away && match.time && match.status))
      .map((match) => ({
        home: match.home as string,
        away: match.away as string,
        homeLogo: match.home_logo || null,
        awayLogo: match.away_logo || null,
        homeScore: match.home_score ?? null,
        awayScore: match.away_score ?? null,
        status: match.status as string,
        statusText: match.status_text || null,
        kickoff: match.time as string,
        competition: match.competition || "بطولة غير محددة",
        competitionLogo: match.competition_logo || null,
        sourceUrl: match.url && match.url.startsWith("/football/match/") ? `https://sportscore.com${match.url}` : null,
      }));

    return NextResponse.json(
      {
        success: true,
        provider: "SportScore",
        date,
        count: matches.length,
        fetchedAt: new Date().toISOString(),
        matches,
      },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" } }
    );
  } catch (error) {
    const statusCode = (error as Error & { status?: number }).status;
    return NextResponse.json(
      {
        success: false,
        code: statusCode === 429 ? "PROVIDER_RATE_LIMIT" : "PROVIDER_UNAVAILABLE",
        message: statusCode === 429 ? "تم بلوغ حد الطلبات لدى مزود النتائج." : "تعذر الاتصال بمزود النتائج العالمية.",
      },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    );
  }
}
