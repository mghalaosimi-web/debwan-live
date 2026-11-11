"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import {
  Menu, X, Play, Home, Tv, Trophy, Film, BookOpen,
  CalendarDays, Heart, History, Compass, ChevronLeft,
} from "lucide-react";
import GlobalSearch from "@/components/ui/global-search";

const navItems = [
  { href: "/home", key: "nav.home", label: "الرئيسية", icon: Home },
  { href: "/channels", key: "nav.channels", label: "القنوات", icon: Tv },
  { href: "/football", key: "nav.football", label: "كرة القدم", icon: Trophy },
  { href: "/vod", key: "nav.vod", label: "الأفلام", icon: Film },
  { href: "/series", key: "nav.series", label: "المسلسلات", icon: BookOpen },
  { href: "/guide", key: "nav.guide", label: "دليل البرامج", icon: CalendarDays },
  { href: "/favorites", key: "nav.favorites", label: "المفضلة", icon: Heart },
  { href: "/history", key: "nav.history", label: "سجل المشاهدة", icon: History },
];

function isActivePath(pathname: string, href: string) {
  return href === "/home" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => setMobileMenuOpen(false), [pathname]);

  return (
    <div dir="rtl" className="flex min-h-screen flex-col bg-dark-950 text-dark-100">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:right-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-primary-600 focus:px-4 focus:py-3 focus:text-white">
        {t("common.skipToContent")}
      </a>

      <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-dark-950/90 shadow-lg shadow-black/10 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3 xl:gap-7">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 text-dark-200 transition hover:bg-white/5 md:hidden"
              aria-label={mobileMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-menu"
            >
              {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
            </button>

            <Link href="/home" className="group flex shrink-0 items-center gap-2.5" aria-label="دبوان لايف - الرئيسية">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-300 to-emerald-500 text-slate-950 shadow-lg shadow-emerald-950/30 transition group-hover:scale-105">
                <Play size={18} fill="currentColor" />
              </span>
              <span className="hidden sm:block">
                <span className="block text-base font-black tracking-tight text-white">دبوان لايف</span>
                <span className="block text-[9px] font-bold tracking-[0.2em] text-dark-400">DEBWAN LIVE</span>
              </span>
            </Link>

            <nav className="hidden items-center gap-1 md:flex" aria-label="التنقل الرئيسي">
              {navItems.map((item) => {
                const active = isActivePath(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-xl px-2.5 py-2.5 text-[13px] font-semibold transition xl:px-3",
                      active
                        ? "bg-emerald-400/10 text-emerald-300 ring-1 ring-inset ring-emerald-300/15"
                        : "text-dark-300 hover:bg-white/[0.05] hover:text-white"
                    )}
                  >
                    <item.icon size={15} />
                    <span>{item.key === "nav.football" ? item.label : t(item.key, item.label)}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="hidden sm:block"><GlobalSearch /></div>
            <Link href="/channels" className="hidden items-center gap-2 rounded-xl bg-emerald-400 px-3.5 py-2.5 text-xs font-extrabold text-slate-950 transition hover:bg-emerald-300 lg:inline-flex">
              <Tv size={15} /> ابدأ المشاهدة <ChevronLeft size={14} />
            </Link>
            <div className="sm:hidden"><GlobalSearch /></div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div id="mobile-nav-menu" className="border-t border-white/10 bg-dark-950/98 px-4 pb-4 pt-3 shadow-2xl md:hidden">
            <nav className="grid grid-cols-2 gap-2" aria-label="قائمة الهاتف">
              {navItems.map((item) => {
                const active = isActivePath(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-12 items-center gap-2.5 rounded-xl border px-3 py-2.5 text-sm font-semibold transition",
                      active ? "border-emerald-300/25 bg-emerald-300/10 text-emerald-200" : "border-white/[0.07] bg-white/[0.025] text-dark-200 hover:bg-white/[0.06]"
                    )}
                  >
                    <item.icon size={17} />
                    {item.key === "nav.football" ? item.label : t(item.key, item.label)}
                  </Link>
                );
              })}
            </nav>
            <p className="mt-3 text-center text-[11px] text-dark-500">تصفح الأقسام متاح دون تسجيل دخول</p>
          </div>
        )}
      </header>

      <main id="main-content" className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {children}
      </main>

      <footer className="mt-auto border-t border-white/[0.07] bg-dark-950/70">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-4 py-5 text-xs text-dark-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span>© {new Date().getFullYear()} دبوان لايف — DEBWAN LIVE</span>
          <span>مصادر المحتوى وحقوق المشاهدة تخضع للناقل والبلد</span>
        </div>
      </footer>
    </div>
  );
}
