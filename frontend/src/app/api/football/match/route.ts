import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 60;

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug") || "";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+){1,20}$/.test(slug) || slug.length > 140) {
    return NextResponse.json({ success: false, code: "INVALID_MATCH_SLUG", message: "معرّف المباراة غير صالح." }, { status: 400 });
  }
  try {
    const params = new URLSearchParams({ sport: "football", slug });
    const response = await fetch(`https://sportscore.com/api/widget/match/?${params.toString()}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(12000),
    });
    if (response.status === 404) return NextResponse.json({ success: false, code: "MATCH_NOT_FOUND", message: "لم يعثر مزود البيانات على هذه المباراة." }, { status: 404 });
    if (!response.ok) return NextResponse.json({ success: false, code: response.status === 429 ? "PROVIDER_RATE_LIMIT" : "PROVIDER_UNAVAILABLE", message: "تعذر جلب تفاصيل المباراة حالياً." }, { status: 502 });
    const payload = await response.json() as { match?: Record<string, unknown>; updated?: string; error?: string };
    if (!payload.match || payload.error) return NextResponse.json({ success: false, code: "MATCH_NOT_FOUND", message: payload.error || "تفاصيل المباراة غير متاحة." }, { status: 404 });

    let h2h: Record<string, unknown> | null = null;
    const home = typeof payload.match.home === "string" ? payload.match.home : "";
    const away = typeof payload.match.away === "string" ? payload.match.away : "";
    if (home && away) {
      try {
        const searchTeam = async (name: string) => {
          const q = new URLSearchParams({ sport: "football", q: name, limit: "20" });
          const r = await fetch(`https://sportscore.com/api/v1/search/?${q.toString()}`, { headers: { Accept: "application/json" }, next: { revalidate: 900 }, signal: AbortSignal.timeout(8000) });
          if (!r.ok) return null;
          const data = await r.json() as { teams?: Array<{ name?: string; slug?: string }> };
          return data.teams?.find((team) => team.name?.trim().toLowerCase() === name.trim().toLowerCase())?.slug || null;
        };
        const [homeSlug, awaySlug] = await Promise.all([searchTeam(home), searchTeam(away)]);
        if (homeSlug && awaySlug) {
          const h2hParams = new URLSearchParams({ sport: "football", team1: homeSlug, team2: awaySlug, limit: "10" });
          const h2hResponse = await fetch(`https://sportscore.com/api/v1/h2h/?${h2hParams.toString()}`, { headers: { Accept: "application/json" }, next: { revalidate: 900 }, signal: AbortSignal.timeout(8000) });
          if (h2hResponse.ok) h2h = await h2hResponse.json() as Record<string, unknown>;
        }
      } catch {
        h2h = null;
      }
    }
    return NextResponse.json({ success: true, provider: "SportScore", match: payload.match, h2h, updated: payload.updated || new Date().toISOString() }, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
    });
  } catch {
    return NextResponse.json({ success: false, code: "PROVIDER_UNAVAILABLE", message: "تعذر الاتصال بمزود تفاصيل المباريات." }, { status: 502 });
  }
}
