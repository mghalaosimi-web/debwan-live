"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays, Trophy, Table2, Users, Award, GitBranch, Tv, Home, ChevronLeft,
} from "lucide-react";

const items = [
  { href: "/football", label: "الرئيسية", icon: Home },
  { href: "/football/matches", label: "المباريات", icon: CalendarDays },
  { href: "/football/competitions", label: "البطولات", icon: Trophy },
  { href: "/football/standings", label: "الترتيب", icon: Table2 },
  { href: "/football/teams", label: "الأندية واللاعبون", icon: Users },
  { href: "/football/scorers", label: "الهدافون", icon: Award },
  { href: "/football/bracket", label: "الكؤوس", icon: GitBranch },
  { href: "/football/watch", label: "المشاهدة", icon: Tv },
];

export default function FootballSectionLayout({
  title, eyebrow, description, children,
}: {
  title: string;
  eyebrow?: string;
  description?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <main dir="rtl" className="relative mx-auto max-w-[1360px] space-y-5">
      <header className="rounded-2xl border border-white/[0.08] bg-[#0d1c2e] px-4 py-5 sm:px-6 sm:py-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="mb-2 text-[10px] font-black tracking-[0.16em] text-emerald-300">{eyebrow || "DEBWAN LIVE · FOOTBALL"}</p>
            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">{title}</h1>
            {description && <p className="mt-2 max-w-3xl text-xs leading-6 text-slate-400 sm:text-sm">{description}</p>}
          </div>
          <Link href="/football/matches" className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl bg-emerald-300 px-3.5 py-2.5 text-xs font-black text-[#06251c] transition hover:bg-emerald-200">
            جدول المباريات <ChevronLeft size={15}/>
          </Link>
        </div>
      </header>

      <nav aria-label="أقسام مركز كرة القدم" className="sticky top-[72px] z-30 -mx-1 flex gap-1.5 overflow-x-auto border-y border-white/[0.07] bg-[#091522]/95 px-1 py-2 backdrop-blur-xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === "/football" ? pathname === href : pathname === href || pathname.startsWith(href + "/");
          return (
            <Link key={href} href={href} aria-current={active ? "page" : undefined}
              className={`inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-lg px-3 text-[11px] font-bold transition sm:px-3.5 ${active ? "bg-emerald-300 text-[#06251c]" : "text-slate-400 hover:bg-white/[0.06] hover:text-white"}`}>
              <Icon size={14}/>{label}
            </Link>
          );
        })}
      </nav>

      <section className="min-w-0">{children}</section>
    </main>
  );
}
