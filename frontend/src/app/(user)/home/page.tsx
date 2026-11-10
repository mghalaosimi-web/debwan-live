"use client";

import Link from "next/link";
import { Film, Tv, BookOpen, Trophy, Radio, Play, Compass } from "lucide-react";
import { useTranslation } from "react-i18next";

const sections = [
  {
    href: "/channels",
    title: "القنوات المباشرة",
    description: "تصفح القنوات التلفزيونية المتاحة ومصادر بثها.",
    icon: Tv,
    accent: "text-sky-300",
  },
  {
    href: "/football",
    title: "مركز كرة القدم",
    description: "المباريات والبطولات ومصادر المشاهدة الرسمية.",
    icon: Trophy,
    accent: "text-emerald-300",
  },
  {
    href: "/vod",
    title: "الأفلام",
    description: "استكشف مكتبة الأفلام عند توفر المحتوى.",
    icon: Film,
    accent: "text-violet-300",
  },
  {
    href: "/series",
    title: "المسلسلات",
    description: "تصفح المسلسلات والحلقات المتاحة.",
    icon: BookOpen,
    accent: "text-amber-300",
  },
];

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div dir="rtl" className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-l from-[#12334a] via-[#10263c] to-[#101b2c] p-7 sm:p-10">
        <div className="pointer-events-none absolute -left-16 -top-20 h-64 w-64 rounded-full bg-emerald-300/10 blur-3xl" />
        <div className="relative max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200/20 bg-emerald-200/10 px-3 py-1.5 text-xs font-bold text-emerald-200">
            <Radio size={14} /> DEBWAN LIVE
          </div>
          <h1 className="text-3xl font-black text-white sm:text-4xl">{t("home.title")}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-8 text-slate-300 sm:text-base">
            بوابتك إلى القنوات المباشرة وكرة القدم والأفلام والمسلسلات. التصفح متاح الآن دون تسجيل دخول.
          </p>
          <Link
            href="/channels"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-300 px-5 py-3 text-sm font-extrabold text-slate-950 transition hover:bg-emerald-200"
          >
            <Play size={16} fill="currentColor" /> تصفح القنوات
          </Link>
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-white">{t("home.explore")}</h2>
            <p className="mt-1 text-sm text-slate-400">اختر القسم الذي تريد استكشافه</p>
          </div>
          <Compass className="text-emerald-300" size={24} />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {sections.map(({ href, title, description, icon: Icon, accent }) => (
            <Link
              key={href}
              href={href}
              className="group rounded-2xl border border-dark-700 bg-dark-800 p-5 transition hover:-translate-y-1 hover:border-primary-500/50"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5">
                <Icon size={25} className={accent} />
              </span>
              <h3 className="mt-5 font-bold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-400">{description}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-emerald-300">
                استكشف القسم <span aria-hidden="true">←</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-amber-200/15 bg-amber-200/[0.04] p-5">
        <p className="text-sm font-bold text-amber-100">تنبيه حول توفر المحتوى</p>
        <p className="mt-2 text-sm leading-7 text-slate-300">
          تظهر القنوات والمكتبات بعد إضافة مصادرها والتحقق من صلاحية تشغيلها. لن نعرض روابط وهمية أو مصادر بث غير موثوقة على أنها تعمل.
        </p>
      </section>
    </div>
  );
}
