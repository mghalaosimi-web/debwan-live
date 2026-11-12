"use client";

import Link from "next/link";
import {
  CalendarDays, Trophy, Table2, Users, Award, GitBranch, Tv,
  ArrowLeft, Sparkles, ChevronLeft, ShieldCheck,
} from "lucide-react";
import FootballSectionLayout from "@/components/football/football-section-layout";

const sections = [
  { href: "/football/matches", title: "مباريات اليوم", description: "تابع جدول المواجهات والنتائج وحالة كل مباراة.", icon: CalendarDays, tag: "المواعيد والنتائج", tone: "text-emerald-300", glow: "from-emerald-400/15" },
  { href: "/football/competitions", title: "البطولات", description: "تصفح المسابقات والدوريات المعتمدة في دبوان لايف.", icon: Trophy, tag: "الدوريات والكؤوس", tone: "text-sky-300", glow: "from-sky-400/15" },
  { href: "/football/standings", title: "ترتيب الدوريات", description: "مراكز الفرق والنقاط وفارق الأهداف.", icon: Table2, tag: "الجداول والإحصائيات", tone: "text-violet-300", glow: "from-violet-400/15" },
  { href: "/football/teams", title: "الأندية واللاعبون", description: "انتقل إلى ملفات الأندية واللاعبين ومعلوماتهم.", icon: Users, tag: "دليل كرة القدم", tone: "text-amber-300", glow: "from-amber-400/15" },
  { href: "/football/scorers", title: "الهدافون", description: "تعرف على أبرز الهدافين وصنّاع الأهداف.", icon: Award, tag: "أرقام اللاعبين", tone: "text-rose-300", glow: "from-rose-400/15" },
  { href: "/football/bracket", title: "الأدوار الإقصائية", description: "تابع مسارات البطولة ومواجهات خروج المغلوب.", icon: GitBranch, tag: "طريق النهائي", tone: "text-cyan-300", glow: "from-cyan-400/15" },
  { href: "/football/watch", title: "المشاهدة", description: "مصادر المشاهدة والمشغلات المتاحة في مكان مستقل.", icon: Tv, tag: "دليل المشاهدة", tone: "text-fuchsia-300", glow: "from-fuchsia-400/15" },
];

export default function FootballPage() {
  return (
    <FootballSectionLayout
      title="كل كرة القدم في مكان واحد"
      eyebrow="DEBWAN LIVE · FOOTBALL CENTER"
      description="واجهة موحدة لمتابعة أهم المنافسات، مع فصل كل خدمة في صفحة مستقلة لتصل إلى المعلومة التي تريدها بسرعة."
    >
      <section className="relative mb-6 overflow-hidden rounded-[26px] border border-emerald-300/15 bg-gradient-to-l from-[#0c2a2a] via-[#102638] to-[#101d31] p-5 sm:p-7">
        <div className="pointer-events-none absolute -left-8 -top-12 h-56 w-56 rounded-full border border-white/[0.06]" />
        <div className="pointer-events-none absolute -left-1 -top-5 h-44 w-44 rounded-full border border-white/[0.06]" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold text-emerald-200"><Sparkles size={14} /> مركز المتابعة الكروية</div>
            <h2 className="text-xl font-black text-white sm:text-2xl">ابدأ من القسم الذي يهمك</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">المباريات، البطولات، الترتيب، الإحصائيات والمشاهدة — كل قسم مستقل وسهل الوصول.</p>
          </div>
          <Link href="/football/matches" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-emerald-100">
            استعرض المباريات <ChevronLeft size={17} />
          </Link>
        </div>
        <div className="relative mt-5 flex flex-wrap gap-2 border-t border-white/10 pt-4">
          {["الدوريات الخمسة الكبرى", "دوري روشن السعودي", "البطولات الأوروبية الكبرى"].map((item) => (
            <span key={item} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/10 px-3 py-1.5 text-[11px] font-semibold text-slate-200">
              <ShieldCheck size={12} className="text-emerald-300" />{item}
            </span>
          ))}
        </div>
      </section>

      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-black tracking-[0.18em] text-emerald-300">EXPLORE SECTIONS</p>
          <h2 className="mt-1 text-xl font-black text-white">أقسام مركز كرة القدم</h2>
        </div>
        <span className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1.5 text-[11px] font-bold text-slate-400">07 أقسام</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {sections.map(({ href, title, description, icon: Icon, tag, tone, glow }, index) => (
          <Link
            key={href}
            href={href}
            className="group relative isolate flex min-h-[190px] flex-col overflow-hidden rounded-[22px] border border-white/[0.08] bg-[#0d1a2a] p-5 transition duration-200 hover:-translate-y-1 hover:border-emerald-300/30 hover:shadow-[0_18px_45px_rgba(0,0,0,0.24)]"
          >
            <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${glow} to-transparent opacity-60 transition group-hover:opacity-100`} />
            <div className="flex items-start justify-between">
              <span className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.07] bg-[#071321]/70 ${tone}`}>
                <Icon size={22} strokeWidth={2} />
              </span>
              <span className="text-[11px] font-black tabular-nums text-slate-600">0{index + 1}</span>
            </div>
            <div className="mt-5 flex flex-1 items-end justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-slate-500">{tag}</span>
                <h3 className="mt-1 text-base font-black text-white">{title}</h3>
                <p className="mt-2 max-w-[290px] text-xs leading-6 text-slate-400">{description}</p>
              </div>
              <span className="mb-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-slate-400 transition group-hover:border-emerald-300/30 group-hover:bg-emerald-300 group-hover:text-[#06251c]">
                <ArrowLeft size={16} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </FootballSectionLayout>
  );
}
