"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays, Trophy, Table2, Users, Award, GitBranch, Tv, Home,
  ChevronLeft, CircleDot,
} from "lucide-react";

const items = [
  { href: "/football", label: "الرئيسية", icon: Home },
  { href: "/football/matches", label: "المباريات", icon: CalendarDays },
  { href: "/football/competitions", label: "البطولات", icon: Trophy },
  { href: "/football/standings", label: "الترتيب", icon: Table2 },
  { href: "/football/teams", label: "الأندية واللاعبون", icon: Users },
  { href: "/football/scorers", label: "الهدافون", icon: Award },
  { href: "/football/bracket", label: "الأدوار الإقصائية", icon: GitBranch },
  { href: "/football/watch", label: "المشاهدة", icon: Tv },
];

export default function FootballSectionLayout({
  title,
  eyebrow,
  description,
  children,
}: {
  title: string;
  eyebrow?: string;
  description?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <main dir="rtl" className="relative mx-auto max-w-[1360px] space-y-6 sm:space-y-8">
      <header className="relative isolate overflow-hidden rounded-[28px] border border-white/[0.09] bg-[#0d1c2e] px-5 py-7 shadow-[0_24px_70px_rgba(0,0,0,0.22)] sm:px-8 sm:py-9">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.18),transparent_48%),linear-gradient(120deg,rgba(14,36,56,0.2),rgba(5,15,28,0.9))]" />
        <div className="absolute -left-16 -top-24 -z-10 h-72 w-72 rounded-full border border-emerald-300/[0.08]" />
        <div className="absolute -left-5 -top-12 -z-10 h-52 w-52 rounded-full border border-emerald-300/[0.08]" />
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/[0.08] px-3 py-1.5 text-[10px] font-black tracking-[0.18em] text-emerald-200">
              <CircleDot size={12} /> {eyebrow || "DEBWAN LIVE · FOOTBALL"}
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">{title}</h1>
            {description && <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-[15px]">{description}</p>}
          </div>
          <Link href="/football/matches" className="inline-flex w-fit shrink-0 items-center gap-2 rounded-xl bg-emerald-300 px-4 py-3 text-xs font-black text-[#06251c] shadow-lg shadow-emerald-950/20 transition hover:-translate-y-0.5 hover:bg-emerald-200">
            جدول المباريات <ChevronLeft size={16} />
          </Link>
        </div>
      </header>

      <nav aria-label="أقسام مركز كرة القدم" className="sticky top-[78px] z-30 -mx-1 flex gap-2 overflow-x-auto rounded-2xl border border-white/[0.08] bg-[#091522]/95 p-2 shadow-xl shadow-black/10 backdrop-blur-xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === "/football" ? pathname === href : pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl px-3.5 text-xs font-extrabold transition sm:px-4 ${active
                ? "bg-emerald-300 text-[#06251c] shadow-md shadow-emerald-950/20"
                : "text-slate-300 hover:bg-white/[0.07] hover:text-white"}`}
            >
              <Icon size={15} strokeWidth={2.2} />{label}
            </Link>
          );
        })}
      </nav>

      <section className="min-w-0">{children}</section>
    </main>
  );
}
