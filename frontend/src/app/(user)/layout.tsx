"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import GlobalSearch from "@/components/ui/global-search";

const brandIcon = "https://raw.githubusercontent.com/mghalaosimi-web/debwan-live/main/public/branding/1794669075512.jpg";
const navKeys = [
  { href: "/home", key: "nav.home" },
  { href: "/channels", key: "nav.channels" },
  { href: "/vod", key: "nav.vod" },
  { href: "/series", key: "nav.series" },
  { href: "/guide", key: "nav.guide" },
  { href: "/favorites", key: "nav.favorites" },
  { href: "/history", key: "nav.history" },
];

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => { setMobileMenuOpen(false); }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-[999] focus:p-4 focus:bg-primary-600 focus:text-white focus:rounded-br-lg">
        {t("common.skipToContent")}
      </a>
      <header className="bg-dark-900 border-b border-dark-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-dark-300 hover:text-dark-100 p-1 -ml-1" aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={mobileMenuOpen} aria-controls="mobile-nav-menu">
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <Link href="/home" className="flex items-center gap-2.5 text-xl font-bold text-primary-500" aria-label="دبوان لايف">
                <span className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-emerald-300 via-sky-500 to-blue-900 p-[2px] shadow-md shadow-emerald-950/30">
                  <img src={brandIcon} alt="" className="h-full w-full rounded-[10px] object-cover object-center" />
                </span>
                <span>DEBWAN LIVE</span>
              </Link>
              <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
                {navKeys.map((link) => {
                  const isActive = pathname.startsWith(link.href);
                  return <Link key={link.href} href={link.href} aria-current={isActive ? "page" : undefined} className={cn("px-3 py-2 rounded-lg text-sm transition-colors", isActive ? "bg-primary-600/20 text-primary-400" : "text-dark-300 hover:bg-dark-800 hover:text-dark-100")}>{t(link.key)}</Link>;
                })}
              </nav>
            </div>
            <div className="hidden md:flex items-center gap-4"><GlobalSearch /></div>
            <div className="md:hidden flex items-center gap-2"><GlobalSearch /></div>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-dark-700 bg-dark-900" id="mobile-nav-menu" role="navigation">
            <nav className="px-4 py-3 space-y-1" aria-label="Mobile navigation">
              {navKeys.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return <Link key={link.href} href={link.href} aria-current={isActive ? "page" : undefined} className={cn("block px-3 py-2.5 rounded-lg text-sm transition-colors", isActive ? "bg-primary-600/20 text-primary-400" : "text-dark-300 hover:bg-dark-800 hover:text-dark-100")}>{t(link.key)}</Link>;
              })}
            </nav>
            <div className="border-t border-dark-700 px-4 py-3 text-xs text-dark-500">تصفح مفتوح للجميع</div>
          </div>
        )}
      </header>
      <main className="flex-1" id="main-content"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</div></main>
    </div>
  );
}
