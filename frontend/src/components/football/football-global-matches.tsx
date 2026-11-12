"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, Clock3, ExternalLink, Radio, RefreshCw, Search, ShieldCheck } from "lucide-react";

type GlobalMatch = {
  home: string; away: string; homeLogo: string | null; awayLogo: string | null;
  homeScore: number | string | null; awayScore: number | string | null;
  status: string; statusText: string | null; kickoff: string;
  competition: string; competitionLogo: string | null; sourceUrl: string | null;
};
type Filter = "all" | "live" | "upcoming" | "finished";

function todayInYemen() {
  const parts = new Intl.DateTimeFormat("en", { timeZone: "Asia/Aden", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}
function kickoffLabel(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "موعد غير متاح";
  return new Intl.DateTimeFormat("ar-YE", { timeZone: "Asia/Aden", hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" }).format(date);
}
function statusLabel(match: GlobalMatch) {
  if (["live", "in_progress"].includes(match.status)) return "مباشرة";
  if (["finished", "final"].includes(match.status)) return "انتهت";
  if (["postponed", "delayed"].includes(match.status)) return "مؤجلة";
  if (["cancelled", "canceled"].includes(match.status)) return "أُلغيت";
  return match.statusText || "قادمة";
}
function TeamMark({ name, logo }: { name: string; logo: string | null }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-dark-700 bg-dark-900/80 p-1">
        {logo && !failed ? <img src={logo} alt="" loading="lazy" onError={() => setFailed(true)} className="h-full w-full object-contain" /> : <span className="text-xs font-black text-dark-300">{name.slice(0, 2)}</span>}
      </div>
      <span className="line-clamp-2 min-w-0 text-sm font-bold leading-5 text-dark-100">{name}</span>
    </div>
  );
}
function detailHref(sourceUrl: string | null) {
  if (!sourceUrl) return null;
  try {
    const parts = new URL(sourceUrl).pathname.split("/").filter(Boolean);
    return parts[0] === "football" && parts[1] === "match" && parts[2] ? `/football/match/${parts[2]}` : null;
  } catch { return null; }
}

export default function FootballGlobalMatches() {
  const [date, setDate] = useState(todayInYemen);
  const [filter, setFilter] = useState<Filter>("all");
  const [teamInput, setTeamInput] = useState("");
  const [competitionInput, setCompetitionInput] = useState("");
  const [teamFilter, setTeamFilter] = useState("");
  const [competitionFilter, setCompetitionFilter] = useState("");
  const [matches, setMatches] = useState<GlobalMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);

  const load = useCallback(async (silent = false) => {
    if (silent) setRefreshing(true); else setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ date });
      if (teamFilter) params.set("team", teamFilter);
      if (competitionFilter) params.set("competition", competitionFilter);
      const response = await fetch(`/api/football/global-matches?${params.toString()}`, { headers: { Accept: "application/json" }, cache: "no-store" });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.message || "تعذر تحميل المباريات.");
      setMatches(Array.isArray(payload.matches) ? payload.matches : []);
      setFetchedAt(payload.fetchedAt || null);
    } catch (err) {
      setMatches([]);
      setError(err instanceof Error ? err.message : "حدث خطأ أثناء تحميل المباريات.");
    } finally { setLoading(false); setRefreshing(false); }
  }, [date, teamFilter, competitionFilter]);

  useEffect(() => {
    void load();
    const interval = window.setInterval(() => void load(true), filter === "live" ? 60000 : 300000);
    return () => window.clearInterval(interval);
  }, [load, filter]);

  const filtered = useMemo(() => matches.filter((match) => {
    if (filter === "live") return ["live", "in_progress"].includes(match.status);
    if (filter === "finished") return ["finished", "final"].includes(match.status);
    if (filter === "upcoming") return ["upcoming", "scheduled", "postponed", "delayed"].includes(match.status);
    return true;
  }).sort((a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime()), [matches, filter]);

  const tabs: { id: Filter; label: string; count?: number }[] = [
    { id: "all", label: "الكل", count: matches.length },
    { id: "live", label: "مباشر", count: matches.filter((m) => ["live", "in_progress"].includes(m.status)).length },
    { id: "upcoming", label: "قادمة" },
    { id: "finished", label: "انتهت" },
  ];

  return (
    <section dir="rtl" className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3 rounded-2xl border border-dark-700 bg-dark-800/70 p-4 sm:p-5">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 text-[11px] font-bold tracking-wider text-emerald-300"><ShieldCheck size={14}/> بيانات المباريات من مزود النتائج</div>
          <h2 className="text-xl font-black text-dark-100 sm:text-2xl">مركز المباريات</h2>
          <p className="mt-1 text-xs leading-5 text-dark-400">الدوريات الخمسة الكبرى ودوري روشن وأهم البطولات الأوروبية.</p>
        </div>
        <button type="button" onClick={() => void load(true)} disabled={loading || refreshing} className="inline-flex items-center gap-2 rounded-xl border border-dark-600 bg-dark-900 px-3.5 py-2.5 text-xs font-bold text-dark-200 transition hover:border-emerald-400/40 hover:text-white disabled:opacity-50">
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""}/> تحديث النتائج
        </button>
      </header>

      <div className="grid gap-3 rounded-2xl border border-dark-700 bg-dark-800 p-3 sm:grid-cols-[auto_1fr] sm:items-center sm:p-4">
        <label className="flex min-h-11 items-center gap-2 rounded-xl border border-dark-700 bg-dark-900 px-3">
          <CalendarDays size={16} className="text-emerald-300"/>
          <span className="sr-only">تاريخ المباريات</span>
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="min-w-0 flex-1 bg-transparent py-2 text-sm text-dark-100 outline-none [color-scheme:dark]"/>
        </label>
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="تصفية المباريات">
          {tabs.map((tab) => <button key={tab.id} type="button" role="tab" aria-selected={filter === tab.id} onClick={() => setFilter(tab.id)} className={`rounded-xl px-3.5 py-2.5 text-xs font-bold transition ${filter === tab.id ? "bg-emerald-400 text-[#06251c]" : "border border-dark-700 bg-dark-900 text-dark-300 hover:bg-dark-700"}`}>{tab.label}{tab.count !== undefined ? ` · ${tab.count}` : ""}</button>)}
        </div>
      </div>

      <details className="group rounded-2xl border border-dark-700 bg-dark-800">
        <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-xs font-bold text-dark-200 marker:hidden"><Search size={15} className="text-emerald-300"/> بحث وتصفية حسب الفريق أو البطولة<span className="mr-auto text-[10px] text-dark-500 group-open:hidden">فتح</span><span className="mr-auto hidden text-[10px] text-dark-500 group-open:inline">إغلاق</span></summary>
        <form onSubmit={(event) => { event.preventDefault(); setTeamFilter(teamInput.trim()); setCompetitionFilter(competitionInput.trim()); }} className="grid gap-2 border-t border-dark-700 p-3 sm:grid-cols-[1fr_1fr_auto]">
          <input value={teamInput} onChange={(event) => setTeamInput(event.target.value)} placeholder="اسم الفريق" className="min-w-0 rounded-xl border border-dark-700 bg-dark-900 px-3 py-3 text-sm text-dark-100 outline-none placeholder:text-dark-500"/>
          <input value={competitionInput} onChange={(event) => setCompetitionInput(event.target.value)} placeholder="اسم البطولة" className="min-w-0 rounded-xl border border-dark-700 bg-dark-900 px-3 py-3 text-sm text-dark-100 outline-none placeholder:text-dark-500"/>
          <button type="submit" className="rounded-xl bg-emerald-400 px-4 py-3 text-xs font-black text-[#06251c]">تطبيق البحث</button>
        </form>
      </details>

      {error ? <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-5 text-sm text-red-200">{error}</div> :
       loading ? <div className="rounded-2xl border border-dark-700 bg-dark-800 p-10 text-center text-sm text-dark-300">جارٍ جلب المباريات الفعلية من مزود النتائج...</div> :
       filtered.length === 0 ? <div className="rounded-2xl border border-dark-700 bg-dark-800 p-10 text-center"><Radio size={26} className="mx-auto text-dark-500"/><p className="mt-3 font-bold text-dark-200">لا توجد مباريات لهذا الاختيار</p><p className="mt-1 text-xs text-dark-400">غيّر التاريخ أو نوع المباريات لعرض نتائج أخرى.</p></div> :
       <div className="grid gap-3 xl:grid-cols-2">
        {filtered.map((match, index) => {
          const hasScore = match.homeScore !== null && match.awayScore !== null;
          const isLive = ["live", "in_progress"].includes(match.status);
          const isFinished = ["finished", "final"].includes(match.status);
          const href = detailHref(match.sourceUrl);
          return (
            <article key={`${match.competition}-${match.kickoff}-${match.home}-${index}`} className="overflow-hidden rounded-2xl border border-dark-700 bg-dark-800 transition hover:border-dark-500">
              <div className="flex items-center justify-between gap-2 border-b border-dark-700 bg-dark-900/45 px-4 py-3">
                <div className="flex min-w-0 items-center gap-2">
                  {match.competitionLogo && <img src={match.competitionLogo} alt="" loading="lazy" className="h-5 w-5 shrink-0 object-contain"/>}
                  <p className="truncate text-xs font-bold text-dark-300">{match.competition}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black ${isLive ? "bg-red-500/15 text-red-300" : isFinished ? "bg-dark-700 text-dark-300" : "bg-emerald-400/10 text-emerald-300"}`}>{isLive && <span className="ml-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-red-400"/>}{statusLabel(match)}</span>
              </div>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 py-5 sm:px-5">
                <TeamMark name={match.home} logo={match.homeLogo}/>
                <div className="min-w-[76px] text-center">
                  <p className={`text-2xl font-black tabular-nums ${hasScore ? "text-white" : "text-dark-500"}`}>{hasScore ? `${match.homeScore} : ${match.awayScore}` : "VS"}</p>
                  <p className="mt-1.5 inline-flex items-center gap-1 text-[10px] text-dark-400"><Clock3 size={11}/>{kickoffLabel(match.kickoff)}</p>
                </div>
                <div className="flex justify-end"><TeamMark name={match.away} logo={match.awayLogo}/></div>
              </div>
              {href && <div className="flex justify-end border-t border-dark-700 px-4 py-2.5"><Link href={href} className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 transition hover:text-emerald-200">تفاصيل المباراة والتشكيلة <ExternalLink size={13}/></Link></div>}
            </article>
          );
        })}
       </div>}
      <footer className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-dark-500">
        <span>تُحدّث المباريات المباشرة كل دقيقة، وبقية النتائج كل خمس دقائق.</span>
        {fetchedAt && <span>آخر تحديث: {new Intl.DateTimeFormat("ar-YE", { timeZone: "Asia/Aden", hour: "2-digit", minute: "2-digit" }).format(new Date(fetchedAt))} · SportScore</span>}
      </footer>
    </section>
  );
}
