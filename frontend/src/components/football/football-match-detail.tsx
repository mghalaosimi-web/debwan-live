"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarClock, CircleAlert, ExternalLink, Goal, ShieldAlert } from "lucide-react";

type Incident = { time?: number | string; type?: string; side?: string; player?: string; home_score?: number; away_score?: number };
type Stat = { label?: string; home?: number | string; away?: number | string; home_pct?: number; away_pct?: number; suffix?: string };
type Match = {
  home: string; away: string; home_logo?: string; away_logo?: string;
  home_score?: number | string | null; away_score?: number | string | null;
  home_ht_score?: number | string | null; away_ht_score?: number | string | null;
  status?: string; status_text?: string; time?: string; competition?: string;
  competition_logo?: string; live_minute?: number | null; incidents?: Incident[];
  stats?: Stat[]; lineups?: unknown; url?: string;
};
function timeLabel(value?: string) {
  if (!value) return "موعد غير متاح";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "موعد غير متاح" : new Intl.DateTimeFormat("ar-YE", { timeZone: "Asia/Aden", dateStyle: "full", timeStyle: "short" }).format(date);
}
export default function FootballMatchDetail({ slug }: { slug: string }) {
  const [match, setMatch] = useState<Match | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    fetch(`/api/football/match?slug=${encodeURIComponent(slug)}`, { headers: { Accept: "application/json" } })
      .then(async (r) => { const p = await r.json(); if (!r.ok || !p.success) throw new Error(p.message || "تعذر تحميل المباراة."); return p; })
      .then((p) => { if (active) setMatch(p.match as Match); })
      .catch((e) => { if (active) setError(e instanceof Error ? e.message : "حدث خطأ."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [slug]);
  return (
    <main dir="rtl" className="mx-auto max-w-5xl space-y-5">
      <Link href="/football" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-300"><ArrowRight size={16}/> العودة لمركز كرة القدم</Link>
      {loading ? <div className="rounded-2xl border border-dark-700 bg-dark-800 p-10 text-center text-dark-300">جارٍ تحميل تفاصيل المباراة...</div> :
       error || !match ? <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-5 text-red-200">{error || "المباراة غير متاحة."}</div> : <>
        <section className="rounded-3xl border border-dark-700 bg-gradient-to-br from-[#172B4D] to-dark-900 p-6 sm:p-8">
          <div className="flex items-center justify-center gap-2 text-xs text-slate-300">{match.competition_logo && <img src={match.competition_logo} alt="" className="h-5 w-5 object-contain"/>}{match.competition || "مباراة كرة قدم"}</div>
          <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div className="text-center"><img src={match.home_logo || ""} alt="" className="mx-auto h-16 w-16 object-contain"/><h1 className="mt-3 text-base font-extrabold text-white sm:text-xl">{match.home}</h1></div>
            <div className="text-center"><p className="text-3xl font-black tabular-nums text-white sm:text-5xl">{match.home_score ?? "—"} : {match.away_score ?? "—"}</p><p className="mt-2 text-xs font-semibold text-emerald-300">{match.status === "live" || match.status === "in_progress" ? (match.live_minute ? `الدقيقة ${match.live_minute}` : "مباشرة الآن") : match.status_text || match.status || "—"}</p></div>
            <div className="text-center"><img src={match.away_logo || ""} alt="" className="mx-auto h-16 w-16 object-contain"/><h2 className="mt-3 text-base font-extrabold text-white sm:text-xl">{match.away}</h2></div>
          </div>
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-300"><CalendarClock size={15}/>{timeLabel(match.time)}</div>
          {match.home_ht_score !== null && match.home_ht_score !== undefined && <p className="mt-2 text-center text-xs text-slate-400">نتيجة الشوط الأول: {match.home_ht_score} - {match.away_ht_score ?? "—"}</p>}
        </section>
        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-dark-700 bg-dark-800 p-5">
            <h2 className="flex items-center gap-2 text-lg font-bold text-dark-100"><Goal size={19} className="text-emerald-300"/> أحداث المباراة</h2>
            {match.incidents?.length ? <ol className="mt-4 space-y-3">{match.incidents.map((item, i) => <li key={i} className="flex items-center gap-3 border-b border-dark-700 pb-3 text-sm"><span className="w-12 shrink-0 rounded-lg bg-dark-700 px-2 py-1 text-center text-xs font-bold text-dark-200">{item.time ?? "—"}′</span><span className="min-w-0 flex-1 text-dark-200">{item.type || "حدث"}{item.player ? ` · ${item.player}` : ""}<span className="mr-2 text-xs text-dark-500">{item.side === "home" ? match.home : item.side === "away" ? match.away : ""}</span></span>{item.home_score !== undefined && <b className="text-dark-100">{item.home_score} - {item.away_score}</b>}</li>)}</ol> : <p className="mt-4 text-sm text-dark-400">لا توجد أحداث مسجلة حالياً. قد تظهر التفاصيل بعد بدء المباراة أو تحديث المزود.</p>}
          </article>
          <article className="rounded-2xl border border-dark-700 bg-dark-800 p-5">
            <h2 className="flex items-center gap-2 text-lg font-bold text-dark-100"><ShieldAlert size={19} className="text-primary-300"/> إحصائيات المباراة</h2>
            {match.stats?.length ? <div className="mt-4 space-y-4">{match.stats.map((s,i)=><div key={i}><div className="mb-2 flex justify-between gap-3 text-xs text-dark-200"><b>{s.home ?? 0}{s.suffix || ""}</b><span className="text-dark-400">{s.label || "إحصائية"}</span><b>{s.away ?? 0}{s.suffix || ""}</b></div><div className="flex h-2 overflow-hidden rounded-full bg-dark-700"><span className="bg-primary-400" style={{width:`${Math.max(0,Math.min(100,s.home_pct ?? 50))}%`}}/><span className="bg-emerald-400" style={{width:`${Math.max(0,Math.min(100,s.away_pct ?? 50))}%`}}/></div></div>)}</div> : <p className="mt-4 text-sm text-dark-400">الإحصائيات التفصيلية غير متاحة لهذه المباراة حتى الآن.</p>}
          </article>
        </section>
        <section className="rounded-2xl border border-dark-700 bg-dark-800 p-5">
          <h2 className="text-lg font-bold text-dark-100">التشكيلات</h2>
          {match.lineups ? <pre className="mt-3 overflow-x-auto whitespace-pre-wrap text-xs text-dark-300">{JSON.stringify(match.lineups,null,2)}</pre> : <p className="mt-2 text-sm text-dark-400">لم يعلن مزود البيانات التشكيلات لهذه المباراة بعد.</p>}
        </section>
        <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-xs text-dark-500">بيانات المباراة من SportScore وقد تختلف تفاصيل الأحداث والتشكيلات حسب التغطية.</p>{match.url && <a href={`https://sportscore.com${match.url}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-semibold text-primary-300">المصدر الأصلي <ExternalLink size={13}/></a>}</div>
        <a href="https://sportscore.com/" rel="dofollow" target="_blank" className="inline-flex rounded-md border border-dark-600 bg-dark-900 px-3 py-1.5 text-xs font-semibold text-dark-300">Powered by SportScore</a>
       </>}
    </main>
  );
}
