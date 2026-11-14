"use client";

import FootballSectionLayout from "@/components/football/football-section-layout";
import { ArrowUpLeft, ExternalLink, Play, Radio, Trophy } from "lucide-react";

const STREAM_DESTINATIONS = [
  { label: "البث الأول", href: "https://19.pinkshooters.com/bein-sports-hd-1/", detail: "وجهة المشاهدة الأولى" },
  { label: "البث الثاني", href: "https://syriashdab.com/", detail: "مباريات اليوم والمشاهدة" },
  { label: "البث الثالث", href: "https://koora.watch/", detail: "كورة لايف" },
  { label: "البث الرابع", href: "https://ostora-live.com/", detail: "الأسطورة لايف" },
];

export default function FootballWatchPage() {
  return (
    <FootballSectionLayout
      title="المشاهدة المباشرة"
      eyebrow="DEBWAN LIVE"
      description="اختر أحد خيارات المشاهدة الخارجية المتاحة لمتابعة المباراة."
    >
      <main className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-dark-700 bg-[#071b18] p-6 shadow-xl sm:p-9">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_20%,rgba(16,185,129,0.28),transparent_48%),linear-gradient(115deg,#061411_0%,#0b2921_52%,#071a17_100%)]" />
          <div className="relative z-10 flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-right">
            <div className="max-w-xl">
              <div className="mb-3 flex items-center justify-center gap-2 text-emerald-300 sm:justify-start">
                <Trophy size={18} />
                <span className="text-sm font-bold">DEBWAN LIVE</span>
              </div>
              <h2 className="text-3xl font-black tracking-tight text-white sm:text-5xl">
                شاهد المباراة مباشرة
              </h2>
              <p className="mt-3 text-sm leading-7 text-emerald-50/70 sm:text-base">
                اختر البث المناسب. سيتم فتح وجهة المشاهدة في نافذة جديدة.
              </p>
            </div>
            <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full border border-emerald-200/20 bg-emerald-300/10 text-emerald-100 shadow-[0_0_70px_rgba(16,185,129,0.16)] sm:h-36 sm:w-36">
              <Radio size={68} strokeWidth={1.1} />
            </div>
          </div>
        </section>

        <section aria-label="خيارات المشاهدة" className="grid gap-4 sm:grid-cols-2">
          {STREAM_DESTINATIONS.map((stream, index) => (
            <a
              key={stream.label}
              href={stream.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-28 items-center justify-between gap-4 rounded-2xl border border-dark-700 bg-dark-800/70 p-5 transition hover:-translate-y-0.5 hover:border-emerald-500/50 hover:bg-dark-800"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300">
                  <Play size={21} fill="currentColor" />
                </span>
                <span>
                  <span className="block text-lg font-black text-white">{stream.label}</span>
                  <span className="mt-1 block text-sm text-dark-300">{stream.detail}</span>
                </span>
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-300">
                <ExternalLink size={16} />
                <span className="hidden sm:inline">مشاهدة</span>
                <ArrowUpLeft size={17} />
              </span>
            </a>
          ))}
        </section>

        <p className="rounded-xl border border-dark-700 bg-dark-900/50 p-4 text-sm leading-7 text-dark-300">
          هذه روابط انتقال إلى مواقع خارجية وليست بثاً مستضافاً داخل دبوان لايف. تشغيل الفيديو والصوت
          وجودة البث تعتمد على المصدر الخارجي، وقد تختلف الإتاحة من مباراة إلى أخرى.
        </p>
      </main>
    </FootballSectionLayout>
  );
}
