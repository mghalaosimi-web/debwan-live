"use client";

import { useEffect, useRef, useState } from "react";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export default function PWAInstallGate() {
  const promptRef = useRef<InstallPromptEvent | null>(null);
  const [promptAvailable, setPromptAvailable] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [message, setMessage] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const isAndroid = typeof navigator !== "undefined" && /Android/i.test(navigator.userAgent);

  useEffect(() => {
    const isStandalone = () =>
      window.matchMedia("(display-mode: standalone)").matches ||
      window.matchMedia("(display-mode: fullscreen)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;

    if (isStandalone()) setInstalled(true);

    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      promptRef.current = event as InstallPromptEvent;
      setPromptAvailable(true);
    };

    const onInstalled = () => {
      promptRef.current = null;
      setPromptAvailable(false);
      setInstalled(true);
      setMessage("تم تثبيت دبوان لايف بنجاح.");
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
        // PWA installation prompt can still work if service-worker registration fails.
      });
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  function installApp() {
    const event = promptRef.current;

    // Invoke prompt synchronously in the click handler to preserve browser user activation.
    if (event) {
      promptRef.current = null;
      setPromptAvailable(false);
      setMessage("");
      setShowHelp(false);

      void (async () => {
        try {
          const choicePromise = event.userChoice;
          await event.prompt();
          const choice = await choicePromise;
          if (choice.outcome === "accepted") {
            setMessage("تم قبول طلب التثبيت. أكمل التأكيد في نافذة المتصفح.");
          } else {
            setMessage("تم إلغاء التثبيت. يمكنك الضغط على الزر مجدداً إذا أتاح المتصفح نافذة التثبيت.");
          }
        } catch {
          setMessage("لم يتمكن المتصفح من فتح نافذة التثبيت. استخدم خيار تثبيت التطبيق من قائمة المتصفح.");
          setShowHelp(true);
        }
      })();
      return;
    }

    setShowHelp(true);
    setMessage(
      isAndroid
        ? "التثبيت المباشر غير متاح في المتصفح الحالي الآن. افتح الموقع في Google Chrome، ثم اختر «تثبيت التطبيق» من قائمة المتصفح."
        : "التثبيت المباشر غير متاح في هذا المتصفح. استخدم خيار تثبيت التطبيق من قائمة المتصفح."
    );
  }

  if (installed) return null;

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
          اضغط الزر لفتح نافذة تثبيت دبوان لايف مباشرةً عندما يدعم المتصفح ذلك، ثم وافق على التثبيت.
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
            <p>• افتح دبوان لايف باستخدام Google Chrome على أندرويد.</p>
            <p>• افتح قائمة Chrome (⋮) واختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية».</p>
            <p className="mt-2 text-slate-400">قد لا يعرض المتصفح نافذة التثبيت إذا كان التطبيق مثبتاً مسبقاً أو لم تتحقق شروط التثبيت.</p>
          </div>
        )}
        <p className="mt-6 text-[11px] leading-6 text-slate-500">إكمال التثبيت يتطلب موافقتك في نافذة المتصفح.</p>
      </section>
    </div>
  );
}
