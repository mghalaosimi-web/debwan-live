"use client";

import FootballSectionLayout from "@/components/football/football-section-layout";
import { ArrowUpLeft, Play, Radio, Trophy } from "lucide-react";

const SOURCE_URL = "https://syriashdab.com/";

export default function FootballWatchPage() {
  return (
    <FootballSectionLayout
      title="المشاهدة المباشرة"
      eyebrow="DEBWAN LIVE"
      description="اختر وجهة المشاهدة وانتقل إلى مباريات اليوم مباشرة."
    >
      <main className="space-y-5">
        <a
          href={SOURCE_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="انتقل إلى المشاهدة المباشرة"
          className="group relative block min-h-[340px] overflow-hidden rounded-3xl border border-dark-700 bg-[#071b18] shadow-xl transition duration-300 hover:-translate-y-1 hover:border-emerald-500/50"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_20%,rgba(16,185,129,0.28),transparent_48%),linear-gradient(115deg,#061411_0%,#0b2921_52%,#071a17_100%)]" />
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -right-20 top-8 h-72 w-72 rounded-full border border-emerald-200/60" />
            <div className="absolute -right-8 top-20 h-48 w-48 rounded-full border border-emerald-200/50" />
            <div className="absolute bottom-[-140px] left-[-30px] h-80 w-80 rounded-full border-[2px] border-emerald-200/40" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 border-t border-emerald-100/20 bg-[linear-gradient(90deg,transparent_49.8%,rgba(255,255,255,0.13)_50%,transparent_50.2%)]" />
          </div>

          <div className="relative z-10 flex min-h-[340px] flex-col justify-between p-6 sm:p-9">
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-red-400/30 bg-red-500/10 px-3 py-1.5 text-xs font-black text-red-200">
                <span className="h-2 w-2 animate-pulse rounded-full bg-red-400" />
                مباريات اليوم
              </span>
              <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-xs font-bold text-white/70">
                DEBWAN LIVE
              </span>
            </div>

            <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-end sm:justify-between sm:text-right">
              <div className="max-w-xl">
                <div className="mb-3 flex items-center justify-center gap-2 text-emerald-300 sm:justify-start">
                  <Trophy size={18} />
                  <span className="text-sm font-bold">المشاهدة المباشرة</span>
                </div>
                <h2 className="text-3xl font-black tracking-tight text-white sm:text-5xl">
                  شاهد مباريات اليوم
                </h2>
                <p className="mt-3 text-sm leading-7 text-emerald-50/70 sm:text-base">
                  انتقل لمتابعة مباريات اليوم والبث المباشر.
                </p>
                <span className="mt-6 inline-flex items-center gap-3 rounded-xl bg-emerald-400 px-6 py-3.5 text-sm font-black text-[#062019] shadow-lg shadow-emerald-950/30 transition group-hover:bg-emerald-300">
                  <Play size={17} fill="currentColor" />
                  شاهد المباريات الآن
                  <ArrowUpLeft size={18} />
                </span>
              </div>

              <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full border border-emerald-200/20 bg-emerald-300/10 text-emerald-100 shadow-[0_0_70px_rgba(16,185,129,0.16)] sm:h-44 sm:w-44">
                <Radio size={76} strokeWidth={1.1} className="transition duration-300 group-hover:scale-110 sm:h-24 sm:w-24" />
              </div>
            </div>
          </div>
        </a>

        <div className="flex justify-center">
          <a
            href={SOURCE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full max-w-xl items-center justify-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-6 py-4 text-base font-black text-emerald-300 transition hover:border-emerald-400/60 hover:bg-emerald-500/20"
          >
            <Play size={19} fill="currentColor" />
            الانتقال إلى المشاهدة مباشرة
            <ArrowUpLeft size={19} />
          </a>
        </div>
      </main>
    </FootballSectionLayout>
  );
}
