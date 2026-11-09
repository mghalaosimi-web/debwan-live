import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 900;

const ALLOWED_LEAGUES = new Set([
  "epl","laliga","bundesliga","seriea","ligue1","ucl","uel","mls","championship",
  "leagueone","leaguetwo","scottishpremiership","laliga2","bundesliga2","serieb","ligue2",
  "eredivisie","primeiraliga","superlig","belgianproleague","greeksuperleague",
  "austrianbundesliga","danishsuperliga","allsvenskan","eliteserien","rpl","uecl",
  "brasileirao","libertadores","sudamericana","uslc","saudiproleague","csl","isl","aleague",
  "acl","cafcl","ligamx","ligaprofesional","j1league","facup","eflcup","copadelrey",
  "dfbpokal","coppaitalia","coupedefrance","usopencup","leaguescup","concacafcc",
  "clubworldcup","wsl","ligaf","premiereligue","aleaguewomen","nsl","uslsuperleague",
  "uwcl","worldcup","wcqeurope","wcqsouthamerica","wcqnorthamerica","wcqasia","wcqafrica",
  "nationsleague","euro","euroqualifying","copaamerica","afcon","asiancup","goldcup",
  "concacafnationsleague","friendlies","womensworldcup","womenseuro",
]);

function validSeason(value: string | null): boolean {
  return value === null || /^20\d{2}$/.test(value);
}

export async function GET(request: NextRequest) {
  const apiKey = process.env.API_NINJAS_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { success: false, code: "FOOTBALL_PROVIDER_NOT_CONFIGURED", message: "مزود بيانات كرة القدم غير مهيأ." },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }

  const search = request.nextUrl.searchParams;
  const league = (search.get("league") || "epl").toLowerCase();
  const season = search.get("season");
  const tournament = search.get("tournament");
  const conference = search.get("conference");

  if (!ALLOWED_LEAGUES.has(league)) {
    return NextResponse.json(
      { success: false, code: "UNSUPPORTED_LEAGUE", message: "البطولة المطلوبة غير مدعومة." },
      { status: 400 }
    );
  }
  if (!validSeason(season)) {
    return NextResponse.json(
      { success: false, code: "INVALID_SEASON", message: "الموسم يجب أن يكون سنة من أربعة أرقام." },
      { status: 400 }
    );
  }
  if (tournament && !["apertura", "clausura"].includes(tournament.toLowerCase())) {
    return NextResponse.json(
      { success: false, code: "INVALID_TOURNAMENT", message: "مرحلة البطولة غير صالحة." },
      { status: 400 }
    );
  }

  const params = new URLSearchParams({ league });
  if (season) params.set("season", season);
  if (tournament) params.set("tournament", tournament);
  if (conference) params.set("conference", conference);

  try {
    const response = await fetch(
      `https://api.api-ninjas.com/v1/soccerstandings?${params.toString()}`,
      {
        headers: { "X-Api-Key": apiKey, Accept: "application/json" },
        next: { revalidate: 900 },
        signal: AbortSignal.timeout(12000),
      }
    );
    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          code: response.status === 429 ? "PROVIDER_RATE_LIMIT" : "PROVIDER_REQUEST_FAILED",
          message: response.status === 429 ? "تم بلوغ حد الطلبات لدى مزود البيانات." : "تعذر تحميل جدول الترتيب حالياً.",
        },
        { status: response.status === 429 ? 429 : 502, headers: { "Cache-Control": "no-store" } }
      );
    }

    const payload: unknown = await response.json();
    if (!Array.isArray(payload)) {
      return NextResponse.json(
        { success: false, code: "INVALID_PROVIDER_RESPONSE", message: "استجابة جدول الترتيب غير صالحة." },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        provider: "API Ninjas",
        league,
        season: season || null,
        fetchedAt: new Date().toISOString(),
        standings: payload,
      },
      { headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800" } }
    );
  } catch {
    return NextResponse.json(
      { success: false, code: "PROVIDER_UNAVAILABLE", message: "تعذر الاتصال بمزود بيانات الترتيب." },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    );
  }
}
