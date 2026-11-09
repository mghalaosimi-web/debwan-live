import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 900;

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug") || "";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+){1,20}$/.test(slug) || slug.length > 100) {
    return NextResponse.json({ success: false, code: "INVALID_PLAYER_SLUG", message: "معرّف اللاعب غير صالح." }, { status: 400 });
  }
  try {
    const params = new URLSearchParams({ sport: "football", slug });
    const response = await fetch(`https://sportscore.com/api/widget/player/?${params.toString()}`, { headers: { Accept: "application/json" }, next: { revalidate: 900 }, signal: AbortSignal.timeout(12000) });
    if (response.status === 404) return NextResponse.json({ success: false, code: "PLAYER_NOT_FOUND", message: "لم يعثر مزود البيانات على اللاعب." }, { status: 404 });
    if (!response.ok) return NextResponse.json({ success: false, code: "PROVIDER_UNAVAILABLE", message: "تعذر جلب بيانات اللاعب." }, { status: 502 });
    const payload = await response.json() as { player?: Record<string, unknown>; stats?: Record<string, unknown>; error?: string };
    if (!payload.player) return NextResponse.json({ success: false, code: "PLAYER_NOT_FOUND", message: payload.error || "بيانات اللاعب غير متاحة." }, { status: 404 });
    return NextResponse.json({ success: true, provider: "SportScore", player: payload.player, stats: payload.stats || {} }, { headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800" } });
  } catch {
    return NextResponse.json({ success: false, code: "PROVIDER_UNAVAILABLE", message: "تعذر الاتصال بمزود بيانات اللاعبين." }, { status: 502 });
  }
}
