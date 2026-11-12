"use client";

import { ExternalLink, Radio } from "lucide-react";

const PLAYER_URL = "https://1.shootinggames1.com/albaplayer/bein-sports-hd-1/?serv=0";
const SOURCE_PAGE_URL = "https://19.pinkshooters.com/bein-sports-hd-1/";

export default function BeINEmbeddedPlayer() {
  return (
    <section dir="rtl" className="space-y-4 rounded-3xl border border-dark-700 bg-dark-800 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-widest text-emerald-300">EXTERNAL EMBED PLAYER</p>
          <h2 className="mt-1 flex items-center gap-2 text-xl font-bold text-dark-100">
            <Radio size={20} className="text-emerald-300" />
            beIN SPORTS HD 1
          </h2>
          <p className="mt-1 text-sm text-dark-400">
            مشغّل مضمّن من صفحة المصدر، ويظل تشغيله خاضعاً لإتاحة مزوّد المشغّل.
          </p>
        </div>
        <a href={SOURCE_PAGE_URL} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-dark-600 px-3 py-2 text-sm text-dark-200 transition hover:bg-dark-700">
          فتح صفحة المصدر <ExternalLink size={15} />
        </a>
      </div>
      <div className="relative aspect-video overflow-hidden rounded-2xl border border-dark-700 bg-black">
        <iframe
          title="beIN SPORTS HD 1 embedded player"
          src={PLAYER_URL}
          className="absolute inset-0 h-full w-full border-0"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      <p className="text-xs leading-6 text-dark-400">
        إذا رفض مزوّد المشغّل التضمين أو ظهرت رسالة منع الوصول، استخدم رابط صفحة المصدر أعلاه أو اطلب رابط تضمين مخصصاً. لا يتم استخراج رابط البث أو تجاوز أي حماية.
      </p>
    </section>
  );
}
