"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpLeft, Clapperboard, Play, Radio, ShieldCheck, Trophy, Tv } from "lucide-react";

const features = [
  { icon: Tv, title: "التلفزيون المباشر", description: "استكشف القنوات التلفزيونية المتاحة في مكتبة المنصة.", accent: "text-sky-300" },
  { icon: Trophy, title: "مركز كرة القدم", description: "تابع معلومات المباريات والبطولات وروابط المشاهدة الرسمية المتاحة.", accent: "text-emerald-300" },
  { icon: Clapperboard, title: "الأفلام والمسلسلات", description: "مكتبة ترفيهية منظمة للأفلام والمسلسلات.", accent: "text-violet-300" },
];

export default function Home() {
  return (
    <main dir="rtl" className="min-h-screen overflow-hidden bg-[#07111f] text-white">
      <div className="pointer-events-none fixed inset-0" aria-hidden="true">
        <div className="absolute -top-48 right-[-8rem] h-[34rem] w-[34rem] rounded-full bg-blue-500/10 blur-[110px]" />
        <div className="absolute bottom-[-16rem] left-[-8rem] h-[34rem] w-[34rem] rounded-full bg-emerald-400/10 blur-[110px]" />
      </div>

      <header className="relative z-10 border-b border-white/10 bg-[#07111f]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="دبوان لايف - الرئيسية">
            <span className="relative h-12 w-12 overflow-hidden rounded-2xl border border-emerald-200/50 bg-gradient-to-br from-emerald-300 via-sky-500 to-[#142c4a] p-[2px] shadow-lg shadow-emerald-950/30">
              <img src="https://raw.githubusercontent.com/mghalaosimi-web/debwan-live/main/public/branding/1794669075512.jpg" alt="" className="h-full w-full rounded-[14px] object-cover object-center" />
            </span>
            <span>
              <span className="block text-lg font-extrabold tracking-wide">دبوان لايف</span>
              <span className="block text-[10px] font-semibold tracking-[0.22em] text-slate-400">DEBWAN LIVE</span>
            </span>
          </Link>
          <Link href="/home" className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-bold text-slate-100 transition hover:border-emerald-300/50 hover:bg-white/5">
            ابدأ المشاهدة <ArrowLeft size={16} />
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto grid min-h-[570px] max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/[0.07] px-4 py-2 text-xs font-semibold text-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.8)]" />
            منصتك الرياضية والترفيهية
          </div>
          <h1 className="max-w-3xl text-4xl font-black leading-[1.35] tracking-tight sm:text-5xl lg:text-6xl">
            عالم المشاهدة
            <span className="mt-2 block bg-gradient-to-l from-emerald-200 via-sky-200 to-white bg-clip-text text-transparent">يبدأ من هنا</span>
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            أهلاً بك في دبوان لايف؛ وجهتك لمتابعة كرة القدم واستكشاف القنوات والمحتوى الترفيهي، ضمن تجربة موحدة بتصميم واضح وسهل الاستخدام.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/home" className="inline-flex items-center justify-center gap-3 rounded-xl bg-emerald-300 px-6 py-3.5 text-sm font-extrabold text-[#062018] shadow-lg shadow-emerald-900/20 transition hover:-translate-y-0.5 hover:bg-emerald-200">
              <Play size={17} fill="currentColor" /> ابدأ المشاهدة <ArrowUpLeft size={17} />
            </Link>
            <a href="#explore" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/[0.08]">اكتشف المزايا</a>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-xs text-slate-400">
            <span className="inline-flex items-center gap-2"><ShieldCheck size={15} className="text-emerald-300" /> تجربة منظمة وواضحة</span>
            <span className="inline-flex items-center gap-2"><Radio size={15} className="text-sky-300" /> متابعة من مكان واحد</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg">
          <div className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-br from-emerald-300/25 via-sky-500/15 to-blue-700/20 blur-2xl" />
          <div className="relative min-h-[460px] overflow-hidden rounded-[2rem] border border-white/15 bg-[#102238] shadow-2xl shadow-black/50 sm:min-h-[530px]">
            <img src="https://raw.githubusercontent.com/mghalaosimi-web/debwan-live/main/public/branding/1794669237125.jpg" alt="صورة مؤسس دبوان لايف" className="absolute inset-0 h-full w-full object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#06111f] via-[#07111f]/35 to-[#0b1c30]/10" />
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/15 via-transparent to-sky-500/20 mix-blend-screen" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200/30 bg-[#07111f]/55 px-3 py-1.5 text-[10px] font-bold tracking-[0.22em] text-emerald-100 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> DEBWAN LIVE
              </div>
              <h2 className="text-3xl font-black tracking-wide sm:text-4xl">دبوان لايف</h2>
              <p className="mt-2 max-w-sm text-sm leading-7 text-slate-200">كرة القدم، القنوات، والمحتوى الترفيهي — بهوية واحدة.</p>
              <div className="mt-5 h-px w-full bg-gradient-to-l from-emerald-200/80 via-sky-300/50 to-transparent" />
              <div className="mt-4 flex items-center justify-between text-[10px] font-semibold tracking-[0.18em] text-slate-300">
                <span>WATCH • FOLLOW • ENJOY</span><span className="text-emerald-200">EST. DEBWAN</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="explore" className="relative z-10 border-t border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="mb-8">
            <p className="text-xs font-bold tracking-[0.2em] text-emerald-300">EXPLORE DEBWAN</p>
            <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl">كل ما تحتاجه في مكان واحد</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">تصفح أقسام المنصة مباشرة وانتقل إلى المحتوى الذي تبحث عنه بسهولة.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {features.map(({ icon: Icon, title, description, accent }) => (
              <article key={title} className="rounded-2xl border border-white/10 bg-[#101e30]/80 p-6 transition hover:-translate-y-1 hover:border-emerald-200/25">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.06]"><Icon size={25} className={accent} /></span>
                <h3 className="mt-5 text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-400">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-7 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>© {new Date().getFullYear()} دبوان لايف — DEBWAN LIVE</span>
          <span>منصة مستقلة لتنظيم الوصول إلى المحتوى ومصادر المشاهدة</span>
        </div>
      </footer>
    </main>
  );
}
