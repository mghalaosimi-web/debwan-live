import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 3600;

const ALLOWED_LEAGUES = new Set([
  "epl","laliga","bundesliga","seriea","ligue1","ucl","uel","mls","championship",
  "leagueone","leaguetwo","scottishpremiership","laliga2","bundesliga2","serieb","ligue2",
  "eredivisie","primeiraliga","superlig","belgianproleague","greeksuperleague",
  "austrianbundesliga","danishsuperliga","allsvenskan","eliteserien","rpl","uecl",
  "brasileirao","libertadores","sudamericana","uslc","saudiproleague","csl","isl",
  "aleague","acl","cafcl","ligamx","ligaprofesional","j1league","facup","eflcup",
  "copadelrey","dfbpokal","coppaitalia","coupedefrance","usopencup","leaguescup",
  "concacafcc","clubworldcup","wsl","ligaf","premiereligue","aleaguewomen","nsl",
  "uslsuperleague","uwcl","worldcup","wcqeurope","wcqsouthamerica","wcqnorthamerica",
  "wcqasia","wcqafrica","nationsleague","euro","euroqualifying","copaamerica","afcon",
  "asiancup","goldcup","concacafnationsleague","friendlies","womensworldcup","womenseuro",
]);

function validText(value: string | null, max = 100) {
  return !value || (value.trim().length <= max && !/[<>]/.test(value));
}

export async function GET(request: NextRequest) {
  const apiKey = process.env.API_NINJAS_KEY;
  if (!apiKey) {
    return NextResponse.json({ success: false, code: "FOOTBALL_PROVIDER_NOT_CONFIGURED", message: "مزود بيانات كرة القدم غير مهيأ." }, { status: 503 });
  }

  const search = request.nextUrl.searchParams;
  const type = search.get("type") || "teams";
  const league = search.get("league");
  const team = search.get("team")?.trim();
  const name = search.get("name")?.trim();
  const playerId = search.get("player_id")?.trim();
  const active = search.get("active");
  const position = search.get("position");
  const offset = search.get("offset") || "0";

  if (!["teams", "players"].includes(type)) {
    return NextResponse.json({ success: false, code: "INVALID_TYPE", message: "نوع الدليل غير صالح." }, { status: 400 });
  }
  if (league && !ALLOWED_LEAGUES.has(league)) {
    return NextResponse.json({ success: false, code: "UNSUPPORTED_LEAGUE", message: "البطولة غير مدعومة." }, { status: 400 });
  }
  if (!validText(team) || !validText(name) || !validText(playerId) ||
      (position && !["G", "D", "M", "F"].includes(position)) ||
      !/^\\d{1,4}$/.test(offset) || Number(offset) > 5000 ||
      (active && !["true", "false"].includes(active))) {
    return NextResponse.json({ success: false, code: "INVALID_FILTER", message: "أحد معايير البحث غير صالح." }, { status: 400 });
  }
  if (type === "players" && !league && !playerId && !(team || name)) {
    return NextResponse.json({ success: false, code: "SEARCH_REQUIRED", message: "اختر بطولة أو ابحث باسم لاعب أو فريق." }, { status: 400 });
  }

  const params = new URLSearchParams();
  if (league) params.set("league", league);
  if (type === "teams") {
    if (team) params.set("team", team);
    if (active) params.set("active", active);
  } else {
    if (team) params.set("team", team);
    if (name) params.set("name", name);
    if (playerId) params.set("player_id", playerId);
    if (position) params.set("position", position);
    if (offset !== "0") params.set("offset", offset);
  }

  try {
    const endpoint = type === "teams" ? "soccerclubs" : "soccerplayers";
    const response = await fetch(`https://api.api-ninjas.com/v1/${endpoint}?${params.toString()}`, {
      headers: { "X-Api-Key": apiKey, Accept: "application/json" },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(12000),
    });
    if (!response.ok) {
      return NextResponse.json({
        success: false,
        code: response.status === 429 ? "PROVIDER_RATE_LIMIT" : "PROVIDER_REQUEST_FAILED",
        message: response.status === 429 ? "تم بلوغ حد الطلبات لدى مزود البيانات. حاول لاحقاً." : "تعذر جلب بيانات الدليل حالياً.",
      }, { status: 502, headers: { "Cache-Control": "no-store" } });
    }
    const data: unknown = await response.json();
    if (!Array.isArray(data)) {
      return NextResponse.json({ success: false, code: "INVALID_PROVIDER_RESPONSE", message: "استجابة مزود البيانات غير صالحة." }, { status: 502 });
    }
    return NextResponse.json(
      { success: true, type, provider: "API Ninjas", count: data.length, fetchedAt: new Date().toISOString(), data },
      { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" } }
    );
  } catch {
    return NextResponse.json({ success: false, code: "PROVIDER_UNAVAILABLE", message: "تعذر الاتصال بمزود بيانات كرة القدم." }, { status: 502, headers: { "Cache-Control": "no-store" } });
  }
}
