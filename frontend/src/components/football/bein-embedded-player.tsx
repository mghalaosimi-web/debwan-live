"use client";

import { ExternalLink, Radio } from "lucide-react";

// نضمّن صفحة المصدر نفسها، لا رابط مشغّلها الداخلي الذي يرفض طلبات التضمين المباشر.
// هذا يحافظ على أزرار تبديل السيرفرات/القنوات والتحكم والتحديث كما يعرضها المصدر.
const SOURCE_PAGE_URL = "https://19.pinkshooters.com/bein-sports-hd-1/";

export default function BeINEmbeddedPlayer() {
  return (
    <section dir="rtl" className="space-y-4 rounded-3xl border border-dark-700 bg-dark-800 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-widest text-emerald-300">SOURCE PLAYER · CHANNEL SWITCHER</p>
          <h2 className="mt-1 flex items-center gap-2 text-xl font-bold text-dark-100">
            <Radio size={20} className="text-emerald-300" />
            beIN SPORTS HD 1 — واجهة المشاهدة وتبديل القنوات
          </h2>
          <p className="mt-1 text-sm text-dark-400">
            عرض صفحة المشغّل الأصلية داخل دبوان لايف للحفاظ على أزرار القنوات والسيرفرات والتحديث والتحكم كما هي.
          </p>
        </div>
        <a href={SOURCE_PAGE_URL} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-dark-600 px-3 py-2 text-sm text-dark-200 transition hover:bg-dark-700">
          فتح المصدر في نافذة مستقلة <ExternalLink size={15} />
        </a>
      </div>

      <div className="overflow-hidden rounded-2xl border border-dark-700 bg-white">
        <iframe
          title="واجهة المشاهدة الأصلية مع مبدّل قنوات beIN SPORTS"
          src={SOURCE_PAGE_URL}
          className="block w-full border-0 bg-white"
          style={{ height: "min(1100px, 82vh)", minHeight: "680px" }}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          loading="eager"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      <p className="text-xs leading-6 text-dark-400">
        يتم تحميل الواجهة من صفحة المصدر نفسها؛ لذلك ظهورها وتشغيل الفيديو داخل الإطار يعتمدان على سماح المصدر بالتضمين في المتصفح. لا نستخرج رابط البث ولا نتجاوز حماية أو قيود المصدر.
      </p>
    </section>
  );
}
