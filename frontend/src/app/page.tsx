"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import {
  ArrowLeft,
  ArrowUpLeft,
  Clapperboard,
  Play,
  Radio,
  ShieldCheck,
  Trophy,
  Tv,
} from "lucide-react";

const features = [
  {
    icon: Tv,
    title: "التلفزيون المباشر",
    description: "استكشف القنوات التلفزيونية المضافة إلى مكتبتك عند تسجيل الدخول.",
    accent: "text-sky-300",
  },
  {
    icon: Trophy,
    title: "مركز كرة القدم",
    description: "تابع معلومات المباريات والبطولات وروابط المشاهدة الرسمية المتاحة.",
    accent: "text-emerald-300",
  },
  {
    icon: Clapperboard,
    title: "الأفلام والمسلسلات",
    description: "مكتبة ترفيهية منظمة، مع متابعة المشاهدة والمفضلة للحسابات المسجلة.",
    accent: "text-violet-300",
  },
];

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(user?.role === "admin" ? "/admin" : "/home");
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading || isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07111f]" aria-live="polite">
        <div className="flex items-center gap-3 text-slate-300">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />
          جاري تجهيز دبوان لايف...
        </div>
      </main>
    );
  }

  return (
    <main dir="rtl" className="min-h-screen overflow-hidden bg-[#07111f] text-white">
      <div className="pointer-events-none fixed inset-0" aria-hidden="true">
        <div className="absolute -top-48 right-[-8rem] h-[34rem] w-[34rem] rounded-full bg-blue-500/10 blur-[110px]" />
        <div className="absolute bottom-[-16rem] left-[-8rem] h-[34rem] w-[34rem] rounded-full bg-emerald-400/10 blur-[110px]" />
      </div>

      <header className="relative z-10 border-b border-white/10 bg-[#07111f]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="دبوان لايف - الرئيسية">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-300/10 text-emerald-300">
              <Play size={21} fill="currentColor" />
            </span>
            <span>
              <span className="block text-lg font-extrabold tracking-wide">دبوان لايف</span>
              <span className="block text-[10px] font-semibold tracking-[0.22em] text-slate-400">DEBWAN LIVE</span>
            </span>
          </Link>

          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-bold text-slate-100 transition hover:border-emerald-300/50 hover:bg-white/5"
          >
            تسجيل الدخول
            <ArrowLeft size={16} />
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto grid min-h-[570px] max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/[0.07] px-4 py-2 text-xs font-semibold text-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.8)]" />
            منصتك الترفيهية الرقمية
          </div>

          <h1 className="max-w-3xl text-4xl font-black leading-[1.35] tracking-tight sm:text-5xl lg:text-6xl">
            عالم المشاهدة
            <span className="mt-2 block bg-gradient-to-l from-emerald-200 via-sky-200 to-white bg-clip-text text-transparent">
              يبدأ من هنا
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            أهلاً بك في دبوان لايف؛ واجهة موحدة لاستكشاف القنوات والمحتوى الترفيهي
            ومتابعة عالم كرة القدم، مع توجيهك إلى مصادر المشاهدة الرسمية عندما تكون متاحة.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-3 rounded-xl bg-emerald-300 px-6 py-3.5 text-sm font-extrabold text-[#062018] shadow-lg shadow-emerald-900/20 transition hover:-translate-y-0.5 hover:bg-emerald-200"
            >
              <Play size={17} fill="currentColor" />
              ادخل إلى المنصة
              <ArrowUpLeft size={17} />
            </Link>
            <a
              href="#explore"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/[0.08]"
            >
              اكتشف المزايا
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-xs text-slate-400">
            <span className="inline-flex items-center gap-2"><ShieldCheck size={15} className="text-emerald-300" /> مصادر مشاهدة موضحة</span>
            <span className="inline-flex items-center gap-2"><Radio size={15} className="text-sky-300" /> تجربة موحدة</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg">
          <div className="absolute inset-8 rounded-[2rem] bg-emerald-300/10 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#152a43] via-[#102238] to-[#0b1727] p-5 shadow-2xl shadow-black/40 sm:p-7">
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <div>
                <p className="text-xs font-semibold text-slate-400">DEBWAN LIVE</p>
                <p className="mt-1 text-lg font-extrabold">مركز الترفيه</p>
              </div>
              <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-[11px] font-bold text-emerald-200">مرحباً بك</span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="col-span-2 flex min-h-40 flex-col justify-between rounded-2xl border border-emerald-200/15 bg-gradient-to-br from-emerald-400/20 to-sky-400/5 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-200/15 text-emerald-200"><Radio size={23} /></div>
                <div>
                  <p className="text-xl font-extrabold">شاهد واستكشف</p>
                  <p className="mt-1 text-xs text-slate-300">قنوات ومصادر رسمية ومحتوى متنوع</p>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <Trophy className="mb-5 text-emerald-300" size={25} />
                <p className="font-bold">كرة القدم</p>
                <p className="mt-1 text-xs text-slate-400">المباريات والبطولات</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <Clapperboard className="mb-5 text-violet-300" size={25} />
                <p className="font-bold">ترفيه</p>
                <p className="mt-1 text-xs text-slate-400">أفلام ومسلسلات</p>
              </div>
            </div>
            <p className="mt-5 text-center text-[11px] leading-6 text-slate-500">
              المحتوى الفعلي يتوقف على المصادر والقنوات التي يضيفها مدير المنصة.
            </p>
          </div>
        </div>
      </section>

      <section id="explore" className="relative z-10 border-t border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="mb-8">
            <p className="text-xs font-bold tracking-[0.2em] text-emerald-300">EXPLORE DEBWAN</p>
            <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl">كل ما تحتاجه في مكان واحد</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
              ادخل بحسابك للوصول إلى المكتبة والميزات الشخصية. لا يلزم تسجيل الدخول لاستكشاف هذه الصفحة التعريفية.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {features.map(({ icon: Icon, title, description, accent }) => (
              <article key={title} className="rounded-2xl border border-white/10 bg-[#101e30]/80 p-6 transition hover:-translate-y-1 hover:border-emerald-200/25">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.06]">
                  <Icon size={25} className={accent} />
                </span>
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
