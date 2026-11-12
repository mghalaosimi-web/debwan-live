"use client";

import Link from "next/link";
import { CalendarDays, Trophy, Table2, Users, Award, GitBranch, Tv, ArrowLeft } from "lucide-react";
import FootballSectionLayout from "@/components/football/football-section-layout";

const sections = [
  { href: "/football/matches", title: "مباريات اليوم", description: "المباريات المباشرة والقادمة والنتائج النهائية.", icon: CalendarDays, tone: "text-emerald-300" },
  { href: "/football/competitions", title: "البطولات", description: "مباريات الدوريات الخمسة الكبرى ودوري روشن والبطولات الأوروبية.", icon: Trophy, tone: "text-sky-300" },
  { href: "/football/standings", title: "ترتيب الدوريات", description: "جداول الترتيب والنقاط والإحصائيات لكل دوري.", icon: Table2, tone: "text-violet-300" },
  { href: "/football/teams", title: "الأندية واللاعبون", description: "ابحث عن الأندية واللاعبين ضمن البطولات المعتمدة.", icon: Users, tone: "text-amber-300" },
  { href: "/football/scorers", title: "الهدافون", description: "ترتيب الهدافين وصنّاع الأهداف.", icon: Award, tone: "text-rose-300" },
  { href: "/football/bracket", title: "الأدوار الإقصائية", description: "مسارات المواجهات ومراحل خروج المغلوب.", icon: GitBranch, tone: "text-cyan-300" },
  { href: "/football/watch", title: "مصادر المشاهدة", description: "المشغلات ومصادر البث الرسمية ومعلومات توفرها.", icon: Tv, tone: "text-fuchsia-300" },
];

export default function FootballPage() {
  return (
    <FootballSectionLayout title="مركز كرة القدم" eyebrow="DEBWAN LIVE · FOOTBALL" description="كل قسم في صفحة مستقلة لتصل إلى ما تريد بسرعة. اختر القسم من البطاقات أو من شريط التنقل، وستبقى بقية الأقسام منفصلة ومنظمة.">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {sections.map(({ href, title, description, icon: Icon, tone }) => (
          <Link key={href} href={href} className="group rounded-2xl border border-dark-700 bg-dark-800 p-5 transition hover:-translate-y-0.5 hover:border-emerald-400/40 hover:bg-dark-700/80">
            <div className="flex items-center justify-between">
              <span className={`flex h-12 w-12 items-center justify-center rounded-xl bg-dark-900 ${tone}`}><Icon size={24} /></span>
              <ArrowLeft className="text-dark-400 transition group-hover:-translate-x-1 group-hover:text-emerald-300" size={19} />
            </div>
            <h2 className="mt-5 text-lg font-black text-white">{title}</h2>
            <p className="mt-2 min-h-12 text-sm leading-6 text-dark-300">{description}</p>
            <span className="mt-4 inline-flex text-xs font-bold text-emerald-300">افتح القسم</span>
          </Link>
        ))}
      </div>
    </FootballSectionLayout>
  );
}
