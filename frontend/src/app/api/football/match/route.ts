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
    return NextResponse.json({ success: true, provider: "SportScore", match: payload.match, updated: payload.updated || new Date().toISOString() }, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
    });
  } catch {
    return NextResponse.json({ success: false, code: "PROVIDER_UNAVAILABLE", message: "تعذر الاتصال بمزود تفاصيل المباريات." }, { status: 502 });
  }
}
