import Link from "next/link";

export default function NotFound() {
  return (
    <main dir="rtl" lang="ar" className="flex min-h-screen items-center justify-center bg-[#07111f] px-4 text-white">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0c1a2b] p-8 text-center shadow-2xl">
        <p className="mb-3 text-6xl font-black tracking-tight text-slate-200">404</p>
        <h1 className="text-2xl font-bold">الصفحة غير موجودة</h1>
        <p className="mt-3 text-sm leading-7 text-slate-400">
          الرابط الذي فتحته غير صحيح أو أن الصفحة نُقلت. يمكنك العودة إلى الصفحة الرئيسية ومتابعة التصفح.
        </p>
        <Link href="/" className="mt-7 inline-flex items-center justify-center rounded-xl bg-emerald-300 px-6 py-3 font-bold text-[#062018] transition hover:bg-emerald-200">
          العودة إلى الرئيسية
        </Link>
      </section>
    </main>
  );
}
