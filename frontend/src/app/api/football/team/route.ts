import { NextRequest, NextResponse } from "next/server";
export const runtime="nodejs";
export const revalidate=300;
export async function GET(request:NextRequest){
 const slug=request.nextUrl.searchParams.get("slug")||"";
 if(!/^[a-z0-9]+(?:-[a-z0-9]+){1,20}$/.test(slug)||slug.length>100)return NextResponse.json({success:false,code:"INVALID_TEAM_SLUG",message:"معرّف الفريق غير صالح."},{status:400});
 try{
  const params=new URLSearchParams({sport:"football",slug,limit:"30"});
  const response=await fetch(`https://sportscore.com/api/widget/team/?${params.toString()}`,{headers:{Accept:"application/json"},next:{revalidate:300},signal:AbortSignal.timeout(12000)});
  if(response.status===404)return NextResponse.json({success:false,code:"TEAM_NOT_FOUND",message:"لم يعثر مزود البيانات على الفريق."},{status:404});
  if(!response.ok)return NextResponse.json({success:false,code:"PROVIDER_UNAVAILABLE",message:"تعذر جلب جدول الفريق."},{status:502});
  const payload=await response.json() as {team?:Record<string,unknown>;matches?:unknown[];error?:string};
  if(!payload.team)return NextResponse.json({success:false,code:"TEAM_NOT_FOUND",message:payload.error||"بيانات الفريق غير متاحة."},{status:404});
  return NextResponse.json({success:true,provider:"SportScore",team:payload.team,matches:Array.isArray(payload.matches)?payload.matches:[]},{headers:{"Cache-Control":"public, s-maxage=300, stale-while-revalidate=600"}});
 }catch{return NextResponse.json({success:false,code:"PROVIDER_UNAVAILABLE",message:"تعذر الاتصال بمزود بيانات الفرق."},{status:502});}
}
