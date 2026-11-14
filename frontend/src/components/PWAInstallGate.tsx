"use client";

import { useEffect, useState } from "react";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export default function PWAInstallGate() {
  const [ready, setReady] = useState(false);
  const [promptEvent, setPromptEvent] = useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [message, setMessage] = useState("");
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const standalone = () =>
      window.matchMedia("(display-mode: standalone)").matches ||
      window.matchMedia("(display-mode: fullscreen)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;

    if (standalone()) {
      setInstalled(true);
      setReady(true);
    }

    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as InstallPromptEvent);
      setReady(true);
    };
    const onInstalled = () => {
      setInstalled(true);
      setPromptEvent(null);
      setMessage("تم تثبيت دبوان لايف بنجاح. جارٍ فتح التطبيق…");
      setReady(true);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Installation remains available even if service-worker registration fails.
      });
    }

    setReady(true);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function installApp() {
    if (!promptEvent) {
      setShowHelp(true);
      setMessage("استخدم خيار «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية» من قائمة المتصفح، ثم افتح دبوان لايف من أيقونته.");
      return;
    }

    try {
      await promptEvent.prompt();
      const choice = await promptEvent.userChoice;
      setPromptEvent(null);
      if (choice.outcome === "accepted") {
        setMessage("وافقت على التثبيت. أكمل خطوة التثبيت في نافذة المتصفح ثم افتح التطبيق من أيقونته.");
      } else {
        setMessage("لم يتم التثبيت. لن يُفتح محتوى الموقع قبل تثبيت التطبيق.");
      }
    } catch {
      setMessage("تعذر فتح نافذة التثبيت. افتح قائمة المتصفح واختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية».");
      setShowHelp(true);
    }
  }

  if (!ready || installed) return null;

  return (
    <div dir="rtl" className="fixed inset-0 z-[99999] flex min-h-[100dvh] items-center justify-center overflow-y-auto bg-[#050d18] px-4 py-8 text-white">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-emerald-400/15 blur-[100px]" />
        <div className="absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-sky-500/15 blur-[100px]" />
      </div>
      <section className="relative w-full max-w-md rounded-[2rem] border border-white/10 bg-[#0c1a2b]/95 p-7 text-center shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-9">
        <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-[1.8rem] border border-emerald-200/40 bg-gradient-to-br from-emerald-300 via-sky-500 to-blue-900 p-1 shadow-xl shadow-emerald-950/40">
          <img src="/branding/debwan-app-icon.svg" alt="شعار دبوان لايف" className="h-full w-full rounded-[1.45rem]" />
        </div>
        <p className="mt-6 text-xs font-bold tracking-[0.28em] text-emerald-200">DEBWAN LIVE</p>
        <h1 className="mt-3 text-3xl font-black">ثبّت تطبيق دبوان لايف</h1>
        <p className="mt-4 text-sm leading-8 text-slate-300">
          للحصول على تجربة مستقرة وسريعة، ثبّت دبوان لايف على جهازك. بعد التثبيت افتح التطبيق من أيقونته للوصول إلى المنصة.
        </p>
        <button onClick={installApp} className="mt-7 flex w-full items-center justify-center gap-3 rounded-2xl bg-emerald-300 px-5 py-4 text-base font-black text-[#062018] shadow-lg shadow-emerald-950/30 transition hover:bg-emerald-200 active:scale-[0.99]">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v12m0 0 4-4m-4 4-4-4" /><path d="M5 16v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3" />
          </svg>
          تثبيت التطبيق
        </button>
        {message && <p role="status" className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-xs leading-6 text-slate-200">{message}</p>}
        {showHelp && (
          <div className="mt-4 rounded-xl border border-sky-200/15 bg-sky-300/[0.07] p-4 text-right text-xs leading-7 text-slate-200">
            <p className="font-bold text-sky-100">طريقة التثبيت اليدوي</p>
            <p>• Android: افتح قائمة المتصفح (⋮) ثم اختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية».</p>
            <p>• iPhone وiPad: اضغط «مشاركة» في Safari ثم «إضافة إلى الشاشة الرئيسية».</p>
            <p>• الكمبيوتر: استخدم رمز التثبيت بجوار شريط العنوان، أو خيار تثبيت الصفحة من قائمة المتصفح.</p>
            <p className="mt-2 text-slate-400">بعد التثبيت، افتح التطبيق من الأيقونة. لا يمكن للمتصفح تأكيد التثبيت اليدوي من داخل الصفحة في بعض الأجهزة.</p>
          </div>
        )}
        <p className="mt-6 text-[11px] leading-6 text-slate-500">التثبيت مطلوب قبل الدخول إلى محتوى المنصة. إذا لم تظهر نافذة التثبيت، اتبع التعليمات أعلاه.</p>
      </section>
    </div>
  );
}
