"use client";

import Link from "next/link";
import FootballGlobalMatches from "@/components/football/football-global-matches";
import FootballInlinePlayer from "@/components/football/football-inline-player";
import BeINEmbeddedPlayer from "@/components/football/bein-embedded-player";
import FootballMatches from "@/components/football/football-matches";
import FootballStandings from "@/components/football/football-standings";
import FootballDirectory from "@/components/football/football-directory";
import FootballScorers from "@/components/football/football-scorers";
import FootballBracket from "@/components/football/football-bracket";
import {
  ArrowUpRight,
  CalendarDays,
  ExternalLink,
  Radio,
  SatelliteDish,
  ShieldCheck,
  Trophy,
  Tv,
} from "lucide-react";

const officialSources = [
  {
    name: "ثمانية",
    subtitle: "البطولات السعودية — دوري روشن، كأس الملك، السوبر، ودوري يلو",
    access: "مشاهدة مجانية للمباريات المتاحة",
    href: "https://app.thmanyah.com/",
    icon: Trophy,
    featured: true,
    note: "القنوات الفضائية الثلاث thmanyah.1 وthmanyah.2 وthmanyah.3 مجانية على عربسات بدر 8 (11919 أفقي، 27500)، وتغطية الإشارة تشمل اليمن. أما البث الرقمي فيخضع لحقوق البلد والخطة.",
  },
  {
    name: "beIN SPORTS",
    subtitle: "القناتان المجانيتان: beIN SPORTS و beIN SPORTS NEWS",
    access: "قنوات مفتوحة حسب إتاحة الناقل",
    href: "https://connect.bein.com/",
    icon: Tv,
    featured: false,
    note: "تؤكد beIN رسمياً وجود قناتين مجانيتين Free-to-Air، وتدرج اليمن ضمن مناطق beIN CONNECT؛ لا يعني ذلك أن قنواتها المدفوعة أو كل المباريات مجانية.",
  },
  {
    name: "TOD",
    subtitle: "منصة beIN للمشاهدة الرياضية والبطولات الكبرى",
    access: "اشتراك مدفوع",
    href: "https://www.tod.tv/",
    icon: Tv,
    featured: false,
    note: "منصة اشتراك تابعة لمجموعة beIN ومتاحة في أسواق MENA وتركيا. تحقق من توفر البطولة والباقة في اليمن قبل الاشتراك.",
  },
  {
    name: "قنوات الكأس",
    subtitle: "قنوات رياضية قطرية وجدول بث رسمي",
    access: "التوفر الرقمي حسب القناة والحقوق",
    href: "https://www.alkass.net/tvguide",
    icon: Radio,
    featured: false,
    note: "يعرض الموقع الرسمي جدول البرامج والمباريات وروابط البث المباشر. لا يعني ذلك أن كل مباراة متاحة عبر الإنترنت أو داخل اليمن.",
  },
  {
    name: "FIFA+ عبر DAZN",
    subtitle: "مباريات مباشرة مختارة، إعادات وملخصات من مسابقات مختلفة",
    access: "مجاني في المناطق المدعومة — قد يتطلب حساباً",
    href: "https://www.dazn.com/fifaplus",
    icon: Radio,
    featured: false,
    note: "انتقل محتوى FIFA+ إلى DAZN. يتغير توفر المباريات حسب البلد وحقوق البث، وقد يتطلب التسجيل؛ لا يعني ذلك أن كل البطولات متاحة مجاناً.",
  },
];

export default function FootballPage() {
  return (
    <main dir="rtl" className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-dark-700 bg-gradient-to-br from-[#172B4D] via-[#1d3559] to-dark-900 p-6 sm:p-9">
        <div className="absolute -left-12 -top-16 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="relative max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1 text-sm text-emerald-200">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            مركز كرة القدم
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            كرة القدم في دبوان لايف
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
            وجهتك لمتابعة القنوات الرياضية والمباريات والبطولات. نوصلك إلى البث
            المجاني الرسمي عندما يكون متاحاً، مع توضيح مصدر المشاهدة ونطاقه.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="https://app.thmanyah.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
            >
              <Radio size={18} />
              افتح منصة ثمانية الرسمية
              <ArrowUpRight size={16} />
            </a>
            <a
              href="#official-sources"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              استكشف مصادر البث
            </a>
          </div>
        </div>
      </section>

      <nav aria-label="التنقل داخل مركز كرة القدم" className="sticky top-[72px] z-30 -mx-4 flex gap-2 overflow-x-auto border-y border-white/[0.07] bg-dark-950/95 px-4 py-3 backdrop-blur-xl sm:mx-0 sm:rounded-2xl sm:border sm:px-3">
        {[
          ["#today-matches", "مباريات اليوم"],
          ["#competition-matches", "البطولات"],
          ["#league-standings", "الترتيب"],
          ["#club-directory", "الفرق واللاعبون"],
          ["#top-performers", "الهدافون"],
          ["#knockout-bracket", "الأدوار الإقصائية"],
          ["#official-sources", "مصادر المشاهدة"],
        ].map(([href, label]) => (
          <a key={href} href={href} className="shrink-0 rounded-xl border border-white/[0.08] bg-white/[0.035] px-3.5 py-2 text-xs font-bold text-dark-200 transition hover:border-emerald-300/25 hover:bg-emerald-300/10 hover:text-emerald-200">
            {label}
          </a>
        ))}
      </nav>

      <section id="match-player" className="scroll-mt-32"><FootballInlinePlayer /></section>
      <section id="bein-player" className="scroll-mt-32"><BeINEmbeddedPlayer /></section>

      <section id="today-matches" className="scroll-mt-32 space-y-3">
        <div className="flex items-center gap-3"><span className="h-7 w-1 rounded-full bg-emerald-300" /><div><p className="text-[10px] font-extrabold tracking-[0.18em] text-emerald-300">PRIORITY FIXTURES</p><h2 className="text-xl font-black text-white">أهم مباريات اليوم</h2></div></div>
        <FootballGlobalMatches />
      </section>

      <section id="competition-matches" className="scroll-mt-32 space-y-3">
        <div className="flex items-center gap-3"><span className="h-7 w-1 rounded-full bg-sky-300" /><div><p className="text-[10px] font-extrabold tracking-[0.18em] text-sky-300">COMPETITIONS</p><h2 className="text-xl font-black text-white">مباريات البطولات</h2></div></div>
        <FootballMatches />
      </section>

      <section id="league-standings" className="scroll-mt-32 space-y-3">
        <div className="flex items-center gap-3"><span className="h-7 w-1 rounded-full bg-violet-300" /><div><p className="text-[10px] font-extrabold tracking-[0.18em] text-violet-300">LEAGUE TABLES</p><h2 className="text-xl font-black text-white">ترتيب البطولات</h2></div></div>
        <FootballStandings />
      </section>

      <section id="club-directory" className="scroll-mt-32 space-y-3">
        <div className="flex items-center gap-3"><span className="h-7 w-1 rounded-full bg-amber-300" /><div><p className="text-[10px] font-extrabold tracking-[0.18em] text-amber-300">CLUBS & PLAYERS</p><h2 className="text-xl font-black text-white">دليل الأندية واللاعبين</h2></div></div>
        <FootballDirectory />
      </section>

      <section id="top-performers" className="scroll-mt-32 space-y-3">
        <div className="flex items-center gap-3"><span className="h-7 w-1 rounded-full bg-rose-300" /><div><p className="text-[10px] font-extrabold tracking-[0.18em] text-rose-300">TOP PERFORMERS</p><h2 className="text-xl font-black text-white">الهدافون وصنّاع اللعب</h2></div></div>
        <FootballScorers />
      </section>

      <section id="knockout-bracket" className="scroll-mt-32 space-y-3">
        <div className="flex items-center gap-3"><span className="h-7 w-1 rounded-full bg-cyan-300" /><div><p className="text-[10px] font-extrabold tracking-[0.18em] text-cyan-300">KNOCKOUT STAGE</p><h2 className="text-xl font-black text-white">مسارات الأدوار الإقصائية</h2></div></div>
        <FootballBracket />
      </section>

      <section id="official-sources" className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-widest text-primary-400">OFFICIAL STREAMING</p>
            <h2 className="mt-1 text-2xl font-bold text-dark-100">مصادر المشاهدة الرسمية</h2>
          </div>
          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
            روابط رسمية — التوفر حسب الحقوق
          </span>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {officialSources.map((source) => {
            const Icon = source.icon;
            return (
              <article
                key={source.name}
                className={`rounded-2xl border p-5 transition-colors ${
                  source.featured
                    ? "border-emerald-500/40 bg-emerald-500/[0.06]"
                    : "border-dark-700 bg-dark-800"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-dark-700 text-primary-300">
                    <Icon size={25} />
                  </div>
                  {source.featured && (
                    <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                      نقطة البداية
                    </span>
                  )}
                </div>
                <h3 className="mt-4 text-xl font-bold text-dark-100">{source.name}</h3>
                <p className="mt-2 min-h-12 text-sm leading-6 text-dark-300">{source.subtitle}</p>
                <p className="mt-3 text-sm font-semibold text-emerald-300">{source.access}</p>
                <p className="mt-3 text-xs leading-6 text-dark-400">{source.note}</p>
                <a
                  href={source.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primary-500/30 bg-primary-500/10 px-4 py-3 text-sm font-semibold text-primary-200 transition hover:bg-primary-500/20"
                >
                  المشاهدة من المصدر الرسمي
                  <ExternalLink size={16} />
                </a>
              </article>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-dark-700 bg-dark-800 p-5">
          <div className="flex items-center gap-3">
            <SatelliteDish className="text-primary-300" size={24} />
            <h2 className="text-lg font-bold text-dark-100">قنوات ثمانية الفضائية المجانية</h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-dark-300">
            القنوات ثمانية.1 وثمانية.2 وثمانية.3 متاحة مجاناً عبر عرب سات بدر 8،
            وتغطي الإشارة اليمن. هذه بيانات استقبال فضائي وليست رابط بث إنترنت.
          </p>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-dark-900 p-3"><dt className="text-dark-400">التردد</dt><dd className="mt-1 font-bold text-dark-100">11919 MHz</dd></div>
            <div className="rounded-lg bg-dark-900 p-3"><dt className="text-dark-400">الاستقطاب</dt><dd className="mt-1 font-bold text-dark-100">أفقي H</dd></div>
            <div className="rounded-lg bg-dark-900 p-3"><dt className="text-dark-400">معدل الترميز</dt><dd className="mt-1 font-bold text-dark-100">27500</dd></div>
            <div className="rounded-lg bg-dark-900 p-3"><dt className="text-dark-400">القمر</dt><dd className="mt-1 font-bold text-dark-100">Badr 8 — 26°E</dd></div>
          </dl>
          <a
            href="https://ask.thmanyah.com/النطاق-الجغرافي-لحقوق-البث"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-300 hover:text-primary-200"
          >
            تفاصيل التردد من ثمانية
            <ExternalLink size={15} />
          </a>
        </article>

        <article className="rounded-2xl border border-dark-700 bg-dark-800 p-5">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-emerald-300" size={24} />
            <h2 className="text-lg font-bold text-dark-100">كيف نعرض البث؟</h2>
          </div>
          <ul className="mt-3 space-y-3 text-sm leading-6 text-dark-300">
            <li>• نستخدم روابط المشاهدة الرسمية للناقل عندما لا يسمح بإعادة تضمين البث.</li>
            <li>• لا نخزن روابط خاصة أو مفاتيح DRM ولا نتجاوز الاشتراكات أو القيود الجغرافية.</li>
            <li>• سيُفعّل المشغل الداخلي فقط للمصادر التي تسمح صراحةً بالتضمين وإعادة التوزيع.</li>
            <li>• لا نعرض قناة على أنها تعمل مباشرة قبل التحقق من مصدرها وحالة تشغيلها.</li>
          </ul>
          <div className="mt-5 rounded-xl border border-dark-600 bg-dark-900/70 p-3 text-xs leading-6 text-dark-400">
            هذه النسخة تربط المشاهد بالمصادر الرسمية. تشغيل بث الناقل داخل مشغل دبوان لايف نفسه يحتاج تصريح تضمين أو توزيع من صاحب الحقوق.
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-dark-700 bg-dark-800 p-5">
        <div className="flex items-center gap-3">
          <CalendarDays size={22} className="text-primary-300" />
          <h2 className="text-lg font-bold text-dark-100">المباريات والنتائج والإحصاءات</h2>
        </div>
        <p className="mt-2 text-sm leading-6 text-dark-300">
          تعرض الأقسام أعلاه المباريات والنتائج والجداول والهدافين والبطولات وتفاصيل الفرق واللاعبين. تُحدّث بيانات المباريات كل خمس دقائق وفق استجابة مزود البيانات، وقد لا تتوفر نتيجة أو أحداث مباشرة لبعض المسابقات في الخطة المجانية. الفيديو مصدر مستقل ولا يُستنتج من بيانات النتيجة.
        </p>
        <Link href="/channels" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-300 hover:text-primary-200">
          تصفح القنوات المضافة إلى مكتبتك
          <ArrowUpRight size={16} />
        </Link>
      </section>
    </main>
  );
}
