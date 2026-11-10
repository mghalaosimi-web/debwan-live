import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 900;
const ALLOWED = new Set(["uefa-champions-league","uefa-europa-league","uefa-conference-league","fifa-world-cup","fa-cup","efl-cup","copa-del-rey","dfb-pokal","coppa-italia","coupe-de-france","copa-america","afcon","asiancup","gold-cup","concacaf-champions-cup","club-world-cup"]);
export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("competition") || "uefa-champions-league";
  if (!ALLOWED.has(slug)) return NextResponse.json({success:false,code:"INVALID_COMPETITION",message:"البطولة المختارة غير مدعومة في مسار الكؤوس."},{status:400});
  try {
    const params = new URLSearchParams({sport:"football",slug});
    const response = await fetch(`https://sportscore.com/api/widget/bracket/?${params.toString()}`,{headers:{Accept:"application/json"},next:{revalidate:900},signal:AbortSignal.timeout(12000)});
    if(!response.ok) return NextResponse.json({success:false,code:"PROVIDER_UNAVAILABLE",message:"تعذر جلب مسار البطولة حالياً."},{status:502});
    const payload = await response.json() as {competition?:string;competition_logo?:string;rounds?:unknown[];error?:string};
    if(payload.error || !Array.isArray(payload.rounds)) return NextResponse.json({success:false,code:"BRACKET_UNAVAILABLE",message:payload.error||"لا يتوفر مسار لهذه البطولة حالياً."},{status:404});
    return NextResponse.json({success:true,provider:"SportScore",competition:payload.competition||slug,competitionLogo:payload.competition_logo||null,rounds:payload.rounds},{headers:{"Cache-Control":"public, s-maxage=900, stale-while-revalidate=1800"}});
  } catch { return NextResponse.json({success:false,code:"PROVIDER_UNAVAILABLE",message:"تعذر الاتصال بمزود بيانات الكؤوس."},{status:502}); }
}
