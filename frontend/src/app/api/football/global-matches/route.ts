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

  const params = new URLSearchParams({ sport: "football", date, limit: "200" });
  if (status) params.set("status", status);
  if (competition) params.set("competition", competition);
  if (team) params.set("team", team);

  try {
    const response = await fetch(`https://sportscore.com/api/v1/fixtures/?${params.toString()}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(12000),
    });
    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          code: response.status === 429 ? "PROVIDER_RATE_LIMIT" : "PROVIDER_REQUEST_FAILED",
          message: response.status === 429 ? "تم بلوغ حد الطلبات لدى مزود النتائج." : "تعذر جلب المباريات العالمية حالياً.",
        },
        { status: response.status === 429 ? 429 : 502, headers: { "Cache-Control": "no-store" } }
      );
    }

    const payload = await response.json() as { sport?: string; date?: string; count?: number; matches?: ProviderMatch[] };
    if (!Array.isArray(payload.matches)) {
      return NextResponse.json(
        { success: false, code: "INVALID_PROVIDER_RESPONSE", message: "استجابة مزود المباريات غير صالحة." },
        { status: 502 }
      );
    }

    const matches = payload.matches
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
  } catch {
    return NextResponse.json(
      { success: false, code: "PROVIDER_UNAVAILABLE", message: "تعذر الاتصال بمزود النتائج العالمية." },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    );
  }
}
