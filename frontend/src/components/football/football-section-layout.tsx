"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Trophy, Table2, Users, Award, GitBranch, Tv, Home } from "lucide-react";

const items = [
  { href: "/football", label: "الرئيسية", icon: Home },
  { href: "/football/matches", label: "مباريات اليوم", icon: CalendarDays },
  { href: "/football/competitions", label: "البطولات", icon: Trophy },
  { href: "/football/standings", label: "ترتيب الدوريات", icon: Table2 },
  { href: "/football/teams", label: "الأندية واللاعبون", icon: Users },
  { href: "/football/scorers", label: "الهدافون", icon: Award },
  { href: "/football/bracket", label: "الأدوار الإقصائية", icon: GitBranch },
  { href: "/football/watch", label: "مصادر المشاهدة", icon: Tv },
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
    <main dir="rtl" className="space-y-6">
      <header className="rounded-3xl border border-dark-700 bg-gradient-to-br from-[#172B4D] via-[#1d3559] to-dark-900 p-5 sm:p-7">
        <p className="text-xs font-extrabold tracking-widest text-emerald-300">{eyebrow || "دبوان لايف · مركز كرة القدم"}</p>
        <h1 className="mt-2 text-2xl font-black text-white sm:text-3xl">{title}</h1>
        {description && <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">{description}</p>}
      </header>
      <nav aria-label="أقسام مركز كرة القدم" className="flex gap-2 overflow-x-auto rounded-2xl border border-dark-700 bg-dark-900/90 p-2">
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === "/football" ? pathname === href : pathname === href || pathname.startsWith(href + "/");
          return (
            <Link key={href} href={href} aria-current={active ? "page" : undefined}
              className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-bold transition ${active ? "bg-emerald-400 text-slate-950" : "border border-white/[0.07] bg-white/[0.035] text-dark-200 hover:bg-white/10 hover:text-white"}`}>
              <Icon size={15} />{label}
            </Link>
          );
        })}
      </nav>
      <section className="min-w-0">{children}</section>
    </main>
  );
}
