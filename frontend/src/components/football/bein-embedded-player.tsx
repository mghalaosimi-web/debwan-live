"use client";

// رابط المشغّل الداخلي الذي تحقّقنا من تشغيله داخل متصفح فعلي.
// لا نحمّل صفحة المقال/المصدر الخارجية حتى لا تظهر ترويساتها أو قوائمها.
const PLAYER_URL = "https://19.shootinggames1.com/albaplayer/bein-sports-hd-1/";

export default function BeINEmbeddedPlayer() {
  return (
    <section id="bein-player" aria-label="مشغل beIN SPORTS HD 1" className="w-full overflow-hidden rounded-2xl border border-dark-700 bg-black">
      <div className="relative aspect-video w-full">
        <iframe
          title="beIN SPORTS HD 1"
          src={PLAYER_URL}
          className="absolute inset-0 h-full w-full border-0 bg-black"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          loading="eager"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </section>
  );
}
