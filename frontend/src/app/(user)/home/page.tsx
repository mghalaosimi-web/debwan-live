"use client";

import Link from "next/link";
import {
  ArrowLeft, ArrowUpLeft, CalendarDays, CheckCircle2, Clapperboard,
  Compass, Heart, Play, Radio, ShieldCheck, Trophy, Tv, Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const sections = [
  {
    href: "/football",
    title: "مركز كرة القدم",
    description: "مباريات اليوم والنتائج والترتيب والهدافون وملفات الفرق واللاعبين.",
    icon: Trophy,
    accent: "from-emerald-400/20 to-teal-500/5",
    iconColor: "text-emerald-300",
    tag: "مركز البيانات الرياضية",
  },
  {
    href: "/channels",
    title: "القنوات المباشرة",
    description: "تصفح القنوات التي أضيفت إلى المكتبة ومصادر المشاهدة الرسمية.",
    icon: Tv,
    accent: "from-sky-400/20 to-blue-500/5",
    iconColor: "text-sky-300",
    tag: "قنوات ومصادر",
  },
  {
    href: "/vod",
    title: "الأفلام",
    description: "مكتبة الأفلام المتاحة عند إضافة المحتوى والتحقق من مصادره.",
    icon: Clapperboard,
    accent: "from-violet-400/20 to-purple-500/5",
    iconColor: "text-violet-300",
    tag: "مكتبة الفيديو",
  },
  {
    href: "/series",
    title: "المسلسلات",
    description: "تصفح المسلسلات والحلقات التي تتوفر لها بيانات ومصادر صالحة.",
    icon: Radio,
    accent: "from-amber-400/20 to-orange-500/5",
    iconColor: "text-amber-300",
    tag: "مكتبة الحلقات",
  },
];

const shortcuts = [
  { href: "/football", label: "مباريات كرة القدم", icon: CalendarDays },
  { href: "/favorites", label: "قائمة المفضلة", icon: Heart },
  { href: "/guide", label: "دليل البرامج", icon: Compass },
  { href: "/history", label: "سجل المشاهدة", icon: Play },
];

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div dir="rtl" className="space-y-8 sm:space-y-10">
      <section className="relative isolate overflow-hidden rounded-[28px] border border-white/10 bg-[#0d1c2b] shadow-2xl shadow-black/20">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-24 -top-32 h-96 w-96 rounded-full bg-emerald-400/15 blur-[100px]" />
          <div className="absolute -bottom-48 right-1/3 h-96 w-96 rounded-full bg-sky-500/10 blur-[110px]" />
          <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.18) 1px, transparent 1px)", backgroundSize: "42px 42px" }} />
        </div>

        <div className="relative grid gap-8 px-6 py-9 sm:px-9 sm:py-11 lg:grid-cols-[1fr_310px] lg:items-center lg:px-12 lg:py-14">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/[0.08] px-3.5 py-2 text-xs font-bold text-emerald-200">
              <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-50" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" /></span>
              DEBWAN LIVE <span className="text-emerald-100/40">•</span> منصتك في مكان واحد
            </div>
            <h1 className="text-3xl font-black leading-[1.35] tracking-tight text-white sm:text-4xl lg:text-5xl">
              {t("home.title", "كل ما تحب مشاهدته،")} 
              <span className="block bg-gradient-to-l from-emerald-200 via-teal-100 to-white bg-clip-text text-transparent">أقرب وأسهل</span>
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-8 text-slate-300 sm:text-base">
              تابع عالم كرة القدم، واستكشف القنوات والمحتوى الترفيهي من واجهة عربية موحدة. نوضح حالة المحتوى ومصدر المشاهدة، ولا نعرض الروابط غير المتحقق منها على أنها تعمل.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/football" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-300 px-5 py-3 text-sm font-extrabold text-slate-950 shadow-lg shadow-emerald-950/30 transition hover:-translate-y-0.5 hover:bg-emerald-200">
                <Trophy size={17} /> افتح مركز كرة القدم <ArrowLeft size={16} />
              </Link>
              <Link href="/channels" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white transition hover:bg-white/[0.09]">
                <Tv size={17} /> تصفح القنوات
              </Link>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-400">
              <span className="inline-flex items-center gap-2"><ShieldCheck size={15} className="text-emerald-300" /> مصادر مشاهدة موضحة</span>
              <span className="inline-flex items-center gap-2"><CheckCircle2 size={15} className="text-sky-300" /> تصفح دون تسجيل دخول</span>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="rounded-3xl border border-white/10 bg-slate-950/35 p-5 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div><p className="text-[10px] font-bold tracking-[0.2em] text-slate-500">YOUR SPACE</p><p className="mt-1 text-base font-extrabold text-white">اكتشف دبوان</p></div>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-300/10 text-emerald-200"><Compass size={21} /></span>
              </div>
              <div className="mt-4 space-y-2">
                {shortcuts.map(({ href, label, icon: Icon }) => (
                  <Link key={href} href={href} className="group flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-3 text-sm text-slate-200 transition hover:border-emerald-300/20 hover:bg-emerald-300/[0.06]">
                    <span className="flex items-center gap-3"><Icon size={17} className="text-emerald-200" />{label}</span>
                    <ArrowUpLeft size={15} className="text-slate-500 transition group-hover:-translate-x-1 group-hover:text-emerald-200" />
                  </Link>
                ))}
              </div>
              <p className="mt-4 text-center text-[11px] leading-5 text-slate-500">اختر القسم للوصول المباشر إلى محتواه</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-extrabold tracking-[0.18em] text-emerald-300">EXPLORE</p>
            <h2 className="mt-2 text-xl font-black text-white sm:text-2xl">{t("home.explore", "استكشف المنصة")}</h2>
            <p className="mt-1.5 text-sm text-slate-400">اختر وجهتك، وستجد أدواتها ومحتواها في صفحة مستقلة.</p>
          </div>
          <span className="hidden items-center gap-2 text-xs text-slate-500 sm:inline-flex"><Users size={15} /> تجربة مناسبة للهاتف والحاسوب</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {sections.map(({ href, title, description, icon: Icon, accent, iconColor, tag }) => (
            <Link key={href} href={href} className="group relative flex min-h-[220px] flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-dark-900/80 p-5 transition duration-200 hover:-translate-y-1 hover:border-emerald-300/25 hover:shadow-xl hover:shadow-black/20">
              <div aria-hidden="true" className={`pointer-events-none absolute -left-12 -top-12 h-36 w-36 rounded-full bg-gradient-to-br ${accent} blur-2xl transition group-hover:scale-125`} />
              <div className="relative flex items-start justify-between gap-3">
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.06] ring-1 ring-inset ring-white/[0.06] ${iconColor}`}><Icon size={24} /></span>
                <span className="rounded-full border border-white/[0.07] bg-black/10 px-2.5 py-1 text-[10px] font-semibold text-slate-400">{tag}</span>
              </div>
              <h3 className="relative mt-5 text-base font-extrabold text-white">{title}</h3>
              <p className="relative mt-2 flex-1 text-xs leading-7 text-slate-400 sm:text-sm">{description}</p>
              <span className="relative mt-4 inline-flex items-center gap-2 text-xs font-extrabold text-emerald-300">افتح القسم <ArrowLeft size={14} className="transition group-hover:-translate-x-1" /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center rounded-2xl border border-amber-200/15 bg-amber-200/[0.035] p-5 sm:p-6">
        <div>
          <div className="flex items-center gap-2 text-sm font-extrabold text-amber-100"><ShieldCheck size={17} /> شفافية توفر المحتوى</div>
          <p className="mt-2 max-w-4xl text-xs leading-7 text-slate-300 sm:text-sm">
            بعض الأقسام تعتمد على إضافة مصادر ومحتوى والتحقق من صلاحيتها. بيانات المباريات والنتائج لا تعني توفر بث فيديو للمباراة؛ رابط المشاهدة يظهر فقط عند وجود مصدر رسمي متاح.
          </p>
        </div>
        <Link href="/football#official-sources" className="inline-flex min-h-10 items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-amber-100/15 px-4 py-2.5 text-xs font-bold text-amber-100 transition hover:bg-amber-100/[0.06]">
          مصادر البث الرياضي <ArrowUpLeft size={14} />
        </Link>
      </section>
    </div>
  );
}
