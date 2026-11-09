import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 300;

const ALLOWED_LEAGUES = new Set([
  "epl",
  "laliga",
  "bundesliga",
  "seriea",
  "ligue1",
  "ucl",
  "uel",
  "mls",
  "championship",
  "leagueone",
  "leaguetwo",
  "scottishpremiership",
  "laliga2",
  "bundesliga2",
  "serieb",
  "ligue2",
  "eredivisie",
  "primeiraliga",
  "superlig",
  "belgianproleague",
  "greeksuperleague",
  "austrianbundesliga",
  "danishsuperliga",
  "allsvenskan",
  "eliteserien",
  "rpl",
  "uecl",
  "brasileirao",
  "libertadores",
  "sudamericana",
  "uslc",
  "saudiproleague",
  "csl",
  "isl",
  "aleague",
  "acl",
  "cafcl",
  "ligamx",
  "ligaprofesional",
  "j1league",
  "facup",
  "eflcup",
  "copadelrey",
  "dfbpokal",
  "coppaitalia",
  "coupedefrance",
  "usopencup",
  "leaguescup",
  "concacafcc",
  "clubworldcup",
  "wsl",
  "ligaf",
  "premiereligue",
  "aleaguewomen",
  "nsl",
  "uslsuperleague",
  "uwcl",
  "worldcup",
  "wcqeurope",
  "wcqsouthamerica",
  "wcqnorthamerica",
  "wcqasia",
  "wcqafrica",
  "nationsleague",
  "euro",
  "euroqualifying",
  "copaamerica",
  "afcon",
  "asiancup",
  "goldcup",
  "concacafnationsleague",
  "friendlies",
  "womensworldcup",
  "womenseuro",
]);

type ProviderTeam = {
  team_id?: string;
  name?: string;
  abbreviation?: string;
};

type ProviderMatch = {
  game_id?: string;
  league?: string;
  season_label?: string;
  round?: string | null;
  date?: string;
  start_time?: string;
  status?: string;
  home_team?: ProviderTeam;
  away_team?: ProviderTeam;
  home_score?: number | null;
  away_score?: number | null;
  venue?: { name?: string; city?: string; country?: string } | null;
  updated_at?: string;
};

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export async function GET(request: NextRequest) {
  const apiKey = process.env.API_NINJAS_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        success: false,
        code: "FOOTBALL_PROVIDER_NOT_CONFIGURED",
        message: "لم يتم إعداد مزود بيانات المباريات بعد. أضف API_NINJAS_KEY إلى متغيرات بيئة خادم الويب.",
      },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }

  const search = request.nextUrl.searchParams;
  const league = (search.get("league") || "epl").toLowerCase();
  const date = search.get("date");
  const team = search.get("team")?.trim();
  const season = search.get("season");
  const status = search.get("status");
  const offset = search.get("offset");

  if (!ALLOWED_LEAGUES.has(league)) {
    return NextResponse.json(
      { success: false, code: "UNSUPPORTED_LEAGUE", message: "البطولة المطلوبة غير مدعومة." },
      { status: 400 }
    );
  }

  if (team && (team.length > 100 || /[<>]/.test(team))) {
    return NextResponse.json(
      { success: false, code: "INVALID_TEAM", message: "اسم الفريق غير صالح." },
      { status: 400 }
    );
  }

  if (season && !/^20\\d{2}$/.test(season)) {
    return NextResponse.json(
      { success: false, code: "INVALID_SEASON", message: "الموسم يجب أن يكون سنة من أربعة أرقام." },
      { status: 400 }
    );
  }

  const allowedStatuses = new Set(["scheduled", "in_progress", "final", "postponed", "canceled", "suspended", "delayed"]);
  if (status && !allowedStatuses.has(status)) {
    return NextResponse.json(
      { success: false, code: "INVALID_STATUS", message: "حالة المباراة غير صالحة." },
      { status: 400 }
    );
  }

  if (offset && (!/^\\d+$/.test(offset) || Number(offset) > 5000)) {
    return NextResponse.json(
      { success: false, code: "INVALID_OFFSET", message: "قيمة ترقيم النتائج غير صالحة." },
      { status: 400 }
    );
  }

  if (date && !isValidDate(date)) {
    return NextResponse.json(
      { success: false, code: "INVALID_DATE", message: "صيغة التاريخ يجب أن تكون YYYY-MM-DD." },
      { status: 400 }
    );
  }

  const params = new URLSearchParams({ league });
  if (date) params.set("date", date);
  if (team) params.set("team", team);
  if (season) params.set("season", season);
  if (status) params.set("status", status);
  if (offset) params.set("offset", offset);

  try {
    const response = await fetch(
      `https://api.api-ninjas.com/v1/soccermatches?${params.toString()}`,
      {
        method: "GET",
        headers: { "X-Api-Key": apiKey, Accept: "application/json" },
        next: { revalidate: 300 },
        signal: AbortSignal.timeout(12000),
      }
    );

    if (!response.ok) {
      const status = response.status === 429 ? 429 : response.status === 401 || response.status === 403 ? 502 : 502;
      return NextResponse.json(
        {
          success: false,
          code: response.status === 429 ? "PROVIDER_RATE_LIMIT" : "PROVIDER_REQUEST_FAILED",
          message:
            response.status === 429
              ? "وصلنا إلى حد الطلبات لدى مزود البيانات. حاول لاحقاً."
              : "تعذر جلب بيانات المباريات من المزود حالياً.",
        },
        { status, headers: { "Cache-Control": "no-store" } }
      );
    }

    const payload: unknown = await response.json();
    if (!Array.isArray(payload)) {
      return NextResponse.json(
        { success: false, code: "INVALID_PROVIDER_RESPONSE", message: "استجابة مزود البيانات غير صالحة." },
        { status: 502 }
      );
    }

    const matches = (payload as ProviderMatch[])
      .filter((match) =>
        Boolean(
          match.game_id &&
            match.home_team?.name &&
            match.away_team?.name &&
            match.start_time &&
            match.status
        )
      )
      .map((match) => ({
        id: match.game_id as string,
        league: match.league || league,
        season: match.season_label || null,
        round: match.round || null,
        date: match.date || null,
        kickoff: match.start_time as string,
        status: match.status as string,
        home: {
          id: match.home_team?.team_id || null,
          name: match.home_team?.name as string,
          abbreviation: match.home_team?.abbreviation || null,
        },
        away: {
          id: match.away_team?.team_id || null,
          name: match.away_team?.name as string,
          abbreviation: match.away_team?.abbreviation || null,
        },
        // On the free plan the provider withholds in-progress scores.
        homeScore: typeof match.home_score === "number" ? match.home_score : null,
        awayScore: typeof match.away_score === "number" ? match.away_score : null,
        venue: match.venue?.name || null,
        updatedAt: match.updated_at || null,
      }));

    return NextResponse.json(
      {
        success: true,
        provider: "API Ninjas",
        league,
        date: date || null,
        fetchedAt: new Date().toISOString(),
        matches,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        code: "PROVIDER_UNAVAILABLE",
        message: "تعذر الاتصال بمزود بيانات المباريات. تحقق من الاتصال وحاول مجدداً.",
      },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    );
  }
}
