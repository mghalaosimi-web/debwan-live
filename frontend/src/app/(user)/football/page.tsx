"use client";

import Link from "next/link";
import {
  CalendarDays, Trophy, Table2, Users, Award, GitBranch, Tv,
  ArrowLeft, ShieldCheck,
} from "lucide-react";
import FootballSectionLayout from "@/components/football/football-section-layout";

const sections = [
  { href: "/football/matches", title: "المباريات", description: "مواعيد اليوم والنتائج وحالة اللقاء.", icon: CalendarDays, tone: "text-emerald-300", tag: "مباشر والجدول" },
  { href: "/football/competitions", title: "البطولات", description: "المنافسات المحلية والأوروبية.", icon: Trophy, tone: "text-sky-300", tag: "الدوريات والكؤوس" },
  { href: "/football/standings", title: "الترتيب", description: "النقاط والمراكز وفارق الأهداف.", icon: Table2, tone: "text-violet-300", tag: "جداول الدوري" },
  { href: "/football/teams", title: "الأندية واللاعبون", description: "البحث في ملفات الفرق وقوائم اللاعبين.", icon: Users, tone: "text-amber-300", tag: "دليل الفرق" },
  { href: "/football/scorers", title: "الهدافون", description: "الأهداف والتمريرات الحاسمة.", icon: Award, tone: "text-rose-300", tag: "إحصائيات اللاعبين" },
  { href: "/football/bracket", title: "الأدوار الإقصائية", description: "المواجهات ومسارات الكؤوس.", icon: GitBranch, tone: "text-cyan-300", tag: "طريق النهائي" },
  { href: "/football/watch", title: "المشاهدة", description: "خيارات الانتقال إلى مصادر المشاهدة.", icon: Tv, tone: "text-fuchsia-300", tag: "مصادر خارجية" },
];

export default function FootballPage() {
  return (
    <FootballSectionLayout
      title="مركز كرة القدم"
      eyebrow="DEBWAN LIVE · FOOTBALL"
      description="المباريات والبطولات والإحصائيات في مساحة واحدة، بتنقل واضح وواجهة أخف."
    >
      <section className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.045] px-4 py-3.5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-300/10 text-emerald-200"><ShieldCheck size={19}/></span>
          <div><h2 className="text-sm font-extrabold text-white">اختر القسم الذي تريد متابعته</h2><p className="mt-1 text-xs text-slate-400">تُعرض البيانات حسب ما يوفره مزود كل خدمة.</p></div>
        </div>
        <Link href="/football/matches" className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl bg-emerald-300 px-4 py-2 text-xs font-black text-[#06251c] transition hover:bg-emerald-200">جدول المباريات <ArrowLeft size={14}/></Link>
      </section>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {sections.map(({ href, title, description, icon: Icon, tone, tag }) => (
          <Link key={href} href={href} className="group flex min-h-[142px] items-start gap-3 rounded-2xl border border-white/[0.08] bg-[#0d1a2a] p-4 transition hover:border-emerald-300/25 hover:bg-[#102238]">
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.055] ${tone}`}><Icon size={20}/></span>
            <span className="min-w-0 flex-1">
              <span className="block text-[10px] font-bold text-slate-500">{tag}</span>
              <span className="mt-1 block text-sm font-extrabold text-white">{title}</span>
              <span className="mt-1.5 block text-xs leading-6 text-slate-400">{description}</span>
            </span>
            <ArrowLeft size={15} className="mt-1 shrink-0 text-slate-500 transition group-hover:-translate-x-1 group-hover:text-emerald-200"/>
          </Link>
        ))}
      </div>
      <p className="mt-4 text-[11px] leading-6 text-slate-500">ملاحظة: بيانات النتائج والترتيب مستقلة عن توفر بث فيديو للمباراة. روابط المشاهدة الخارجية لا تمثل بثاً مستضافاً داخل دبوان لايف.</p>
    </FootballSectionLayout>
  );
}
