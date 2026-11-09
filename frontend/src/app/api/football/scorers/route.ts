import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 300;

const COMPETITIONS = new Set([
  "english-premier-league","saudi-professional-league","uefa-champions-league",
  "uefa-europa-league","fifa-world-cup","spanish-la-liga","german-bundesliga",
  "italian-serie-a","french-ligue-1","eredivisie","portuguese-liga",
  "brazilian-serie-a","major-league-soccer",
]);

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams;
  const competition = search.get("competition") || "english-premier-league";
  const stat = search.get("stat") || "goals";
  const limit = search.get("limit") || "20";
  if (!COMPETITIONS.has(competition) || !["goals", "assists"].includes(stat) || !/^\d{1,2}$/.test(limit) || Number(limit) < 1 || Number(limit) > 50) {
    return NextResponse.json({ success: false, code: "INVALID_FILTER", message: "اختيار البطولة أو نوع الإحصائية غير صالح." }, { status: 400 });
  }
  try {
    const params = new URLSearchParams({ sport: "football", slug: competition, stat, limit });
    const response = await fetch(`https://sportscore.com/api/widget/topscorers/?${params.toString()}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(12000),
    });
    if (!response.ok) return NextResponse.json({ success: false, code: "PROVIDER_UNAVAILABLE", message: "تعذر جلب ترتيب الهدافين حالياً." }, { status: 502 });
    const payload = await response.json() as { error?: string; competition?: string; competition_logo?: string; stat_type?: string; scorers?: unknown[] };
    if (payload.error || !Array.isArray(payload.scorers)) {
      return NextResponse.json({ success: false, code: "NO_SCORER_DATA", message: payload.error || "لا تتوفر بيانات الهدافين لهذه البطولة حالياً." }, { status: 404 });
    }
    return NextResponse.json({ success: true, provider: "SportScore", competition: payload.competition || competition, competitionLogo: payload.competition_logo || null, stat, scorers: payload.scorers, fetchedAt: new Date().toISOString() }, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  } catch {
    return NextResponse.json({ success: false, code: "PROVIDER_UNAVAILABLE", message: "تعذر الاتصال بمزود إحصائيات كرة القدم." }, { status: 502 });
  }
}
