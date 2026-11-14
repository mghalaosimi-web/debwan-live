"use client";

import FootballSectionLayout from "@/components/football/football-section-layout";
import { ArrowUpLeft, ExternalLink, Play, Radio, ShieldCheck, Trophy } from "lucide-react";

const STREAM_DESTINATIONS = [
  { label: "البث الأول", href: "https://19.pinkshooters.com/bein-sports-hd-1/", detail: "وجهة المشاهدة الأولى", image: "/branding/stream-1.svg" },
  { label: "البث الثاني", href: "https://syriashdab.com/", detail: "مباريات اليوم والمشاهدة", image: "/branding/stream-2.svg" },
  { label: "البث الثالث", href: "https://koora.watch/", detail: "كورة لايف", image: "/branding/stream-3.svg" },
  { label: "البث الرابع", href: "https://ostora-live.com/", detail: "الأسطورة لايف", image: "/branding/stream-4.svg" },
];

export default function FootballWatchPage() {
  return (
    <FootballSectionLayout
      title="المشاهدة المباشرة"
      eyebrow="DEBWAN LIVE"
      description="اختر مصدر المشاهدة المناسب من خيارات دبوان لايف."
    >
      <main className="space-y-6">
        <section className="relative isolate overflow-hidden rounded-3xl border border-emerald-300/20 bg-[#071b18] shadow-xl">
          <img src="/branding/football-promo.svg" alt="شاهد المباريات عبر دبوان لايف" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-l from-[#06111f]/95 via-[#06111f]/55 to-transparent" />
          <div className="relative z-10 flex min-h-[280px] flex-col justify-center p-6 sm:min-h-[340px] sm:p-10">
            <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200/30 bg-[#07111f]/60 px-3 py-1.5 text-xs font-bold text-emerald-100 backdrop-blur">
              <Trophy size={15} /> DEBWAN LIVE FOOTBALL
            </div>
            <h2 className="max-w-2xl text-3xl font-black leading-tight text-white sm:text-5xl">شاهد المباريات عبر دبوان لايف</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-200 sm:text-base">
              وجهتك لمتابعة كرة القدم؛ اختر أحد مصادر المشاهدة المتاحة وانتقل إليه مباشرة.
            </p>
            <a href="#stream-options" className="mt-6 inline-flex min-h-11 w-fit items-center gap-2 rounded-xl bg-emerald-300 px-5 py-3 text-sm font-black text-[#06251c] transition hover:bg-emerald-200">
              استعرض خيارات البث <ArrowUpLeft size={17} />
            </a>
          </div>
        </section>

        <section id="stream-options" aria-label="خيارات المشاهدة">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-xs font-bold tracking-wider text-emerald-300">WATCH OPTIONS</p>
              <h2 className="mt-1 text-xl font-black text-white">اختر البث الذي يناسبك</h2>
            </div>
            <span className="text-xs text-slate-400">4 خيارات للمشاهدة</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {STREAM_DESTINATIONS.map((stream, index) => (
              <article key={stream.label} className="group overflow-hidden rounded-2xl border border-white/10 bg-[#0d1a2a] transition hover:-translate-y-1 hover:border-emerald-300/30">
                <div className="relative aspect-[16/8] overflow-hidden bg-[#07111f]">
                  <img src={stream.image} alt={`صورة ترويجية لـ ${stream.label} في دبوان لايف`} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-[#06111f]/80 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur">
                    <Radio size={13} className="text-emerald-300" /> ${stream.label}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 p-4 sm:p-5">
                  <div className="min-w-0">
                    <h3 className="text-lg font-black text-white">${stream.label}</h3>
                    <p className="mt-1 text-sm text-slate-400">${stream.detail}</p>
                    <p className="mt-2 text-[11px] text-slate-500">يفتح في موقع المصدر الخارجي</p>
                  </div>
                  <a href={stream.href} target="_blank" rel="noopener noreferrer" aria-label={`فتح ${stream.label}`} className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-emerald-300 px-4 py-3 text-xs font-black text-[#06251c] transition hover:bg-emerald-200">
                    <Play size={15} fill="currentColor" /> مشاهدة <ExternalLink size={14} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="relative isolate overflow-hidden rounded-2xl border border-sky-300/15 bg-[#101e30]">
          <img src="/branding/developer-banner.svg" alt="بانر تطوير دبوان لايف" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-75" />
          <div className="absolute inset-0 bg-gradient-to-l from-[#07111f]/95 via-[#07111f]/75 to-[#07111f]/25" />
          <div className="relative flex items-center gap-4 p-5 sm:p-7">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-sky-200/20 bg-sky-300/10 text-sky-200"><ShieldCheck size={24} /></span>
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] text-sky-200">DEVELOPER NOTE</p>
              <h2 className="mt-1 text-lg font-black text-white sm:text-xl">دبوان لايف — تجربة تتطور باستمرار</h2>
              <p className="mt-1 text-xs leading-6 text-slate-300 sm:text-sm">تصميم وتطوير المنصة بهدف جمع متابعة المباريات وخيارات المشاهدة في واجهة واحدة.</p>
            </div>
          </div>
        </section>

        <p className="rounded-xl border border-amber-200/15 bg-amber-200/[0.04] p-4 text-xs leading-7 text-slate-300">
          تنويه: الصور والبطاقات هنا ترويجية لتنظيم خيارات المشاهدة، ولا تعني أن البث متصل أو متاح حالياً. روابط البث تفتح مواقع خارجية، وتشغيل الفيديو والصوت وجودة المشاهدة وتوفرها تخضع للمصدر الخارجي.
        </p>
      </main>
    </FootballSectionLayout>
  );
}
