"use client";
import FootballSectionLayout from "@/components/football/football-section-layout";
import FootballInlinePlayer from "@/components/football/football-inline-player";
import BeINEmbeddedPlayer from "@/components/football/bein-embedded-player";
import { ExternalLink, Radio, ShieldCheck, SatelliteDish, Tv, Trophy } from "lucide-react";
const sources = [
 { name:"ثمانية", subtitle:"البطولات السعودية والمباريات المتاحة", href:"https://app.thmanyah.com/", access:"التوفر حسب الحقوق والمنطقة", note:"تحقق من توفر المباراة في اليمن قبل المشاهدة.", icon:Trophy },
 { name:"beIN SPORTS", subtitle:"القنوات والخدمات الرسمية من beIN", href:"https://connect.bein.com/", access:"قنوات مجانية ومدفوعة حسب الخدمة", note:"وجود قنوات مجانية لا يعني أن جميع القنوات والمباريات مجانية.", icon:Tv },
 { name:"TOD", subtitle:"منصة beIN للمشاهدة الرياضية", href:"https://www.tod.tv/", access:"اشتراك مدفوع", note:"تحقق من الباقة والحقوق المتاحة في بلدك.", icon:Tv },
 { name:"قنوات الكأس", subtitle:"القنوات الرياضية القطرية وجدول البث", href:"https://www.alkass.net/tvguide", access:"حسب القناة وحقوق البث", note:"يعرض الموقع الرسمي جدول البرامج وروابط البث المتاحة.", icon:Radio },
 { name:"FIFA+ عبر DAZN", subtitle:"مباريات مختارة وإعادات وملخصات", href:"https://www.dazn.com/fifaplus", access:"مجاني في المناطق المدعومة وقد يتطلب حساباً", note:"يتغير توفر المحتوى حسب البلد وحقوق البث.", icon:Radio },
];
export default function FootballWatchPage() {
 return <FootballSectionLayout title="مصادر المشاهدة" eyebrow="WATCH & STREAMING" description="المشغلات ومصادر المشاهدة في صفحة مستقلة.">
  <div className="space-y-6">
   <section className="space-y-3"><h2 className="text-lg font-black text-white">المشغلات</h2><FootballInlinePlayer /><BeINEmbeddedPlayer /></section>
   <section className="space-y-4"><h2 className="text-lg font-black text-white">مصادر المشاهدة الرسمية</h2><div className="grid gap-4 lg:grid-cols-2">
    {sources.map(({name,subtitle,href,access,note,icon:Icon})=><article key={name} className="rounded-2xl border border-dark-700 bg-dark-800 p-5">
     <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-dark-900 text-emerald-300"><Icon size={22}/></span><div><h3 className="font-black text-white">{name}</h3><p className="text-xs text-dark-400">{subtitle}</p></div></div>
     <p className="mt-4 text-sm font-bold text-emerald-300">{access}</p><p className="mt-2 text-xs leading-6 text-dark-400">{note}</p>
     <a href={href} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-xl border border-dark-600 px-4 py-2.5 text-sm font-bold text-dark-100 hover:bg-dark-700">افتح المصدر الرسمي <ExternalLink size={15}/></a>
    </article>)}
   </div></section>
   <section className="rounded-2xl border border-dark-700 bg-dark-800 p-5"><div className="flex items-center gap-2 text-emerald-300"><SatelliteDish size={21}/><h2 className="font-black text-white">معلومات استقبال قنوات ثمانية الفضائية</h2></div>
    <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
     <div className="rounded-xl bg-dark-900 p-3"><p className="text-dark-400">التردد</p><b className="mt-1 block text-white">11919 MHz</b></div>
     <div className="rounded-xl bg-dark-900 p-3"><p className="text-dark-400">الاستقطاب</p><b className="mt-1 block text-white">أفقي H</b></div>
     <div className="rounded-xl bg-dark-900 p-3"><p className="text-dark-400">معدل الترميز</p><b className="mt-1 block text-white">27500</b></div>
     <div className="rounded-xl bg-dark-900 p-3"><p className="text-dark-400">القمر</p><b className="mt-1 block text-white">Badr 8 · 26°E</b></div>
    </div><p className="mt-3 text-xs leading-6 text-dark-400">هذه بيانات استقبال فضائي وليست رابط بث عبر الإنترنت.</p>
   </section>
   <div className="flex items-start gap-3 rounded-2xl border border-dark-700 bg-dark-900 p-4 text-xs leading-6 text-dark-400"><ShieldCheck className="mt-0.5 shrink-0 text-emerald-300" size={19}/><p>يُفعّل المشغل الداخلي فقط للمصادر التي تسمح صراحةً بالتضمين وإعادة التوزيع. روابط المصادر الرسمية تفتح على مواقع مزودي الخدمة.</p></div>
  </div>
 </FootballSectionLayout>;
}
