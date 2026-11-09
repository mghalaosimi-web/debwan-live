"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarDays, Clock3, ExternalLink, Radio, RefreshCw } from "lucide-react";

type GlobalMatch = {
  home: string;
  away: string;
  homeLogo: string | null;
  awayLogo: string | null;
  homeScore: number | string | null;
  awayScore: number | string | null;
  status: string;
  statusText: string | null;
  kickoff: string;
  competition: string;
  competitionLogo: string | null;
  sourceUrl: string | null;
};

type Filter = "all" | "live" | "upcoming" | "finished";

function todayInYemen() {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Asia/Aden",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function kickoffLabel(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "موعد غير متاح";
  return new Intl.DateTimeFormat("ar-YE", {
    timeZone: "Asia/Aden",
    hour: "2-digit",
    minute: "2-digit",
    day: "numeric",
    month: "short",
  }).format(date);
}

function statusLabel(match: GlobalMatch) {
  if (match.status === "live" || match.status === "in_progress") return "مباشرة الآن";
  if (match.status === "finished" || match.status === "finished") return "انتهت";
  if (match.status === "postponed") return "مؤجلة";
  if (match.status === "cancelled" || match.status === "canceled") return "أُلغيت";
  return match.statusText || "قادمة";
}

function TeamMark({ name, logo }: { name: string; logo: string | null }) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-2 text-center">
      {logo ? (
        <img src={logo} alt="" loading="lazy" className="h-10 w-10 object-contain" />
      ) : (
        <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-dark-700 text-xs font-bold text-dark-300">
          {name.slice(0, 2).toUpperCase()}
        </span>
      )}
      <span className="line-clamp-2 break-words text-sm font-bold text-dark-100">{name}</span>
    </div>
  );
}

export default function FootballGlobalMatches() {
  const [date, setDate] = useState(todayInYemen);
  const [filter, setFilter] = useState<Filter>("all");
  const [matches, setMatches] = useState<GlobalMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);

  const load = useCallback(async (silent = false) => {
    if (silent) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ date });
      const response = await fetch(`/api/football/global-matches?${params.toString()}`, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.message || "تعذر تحميل مباريات اليوم.");
      setMatches(Array.isArray(payload.matches) ? payload.matches : []);
      setFetchedAt(payload.fetchedAt || null);
    } catch (err) {
      setMatches([]);
      setError(err instanceof Error ? err.message : "حدث خطأ أثناء تحميل المباريات.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [date]);

  useEffect(() => {
    void load();
    const interval = window.setInterval(() => void load(true), filter === "live" ? 60000 : 300000);
    return () => window.clearInterval(interval);
  }, [load, filter]);

  const filtered = useMemo(() => {
    return matches.filter((match) => {
      if (filter === "live") return match.status === "live" || match.status === "in_progress";
      if (filter === "finished") return match.status === "finished" || match.status === "final";
      if (filter === "upcoming") return match.status === "upcoming" || match.status === "scheduled" || match.status === "postponed" || match.status === "delayed";
      return true;
    }).sort((a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime());
  }, [matches, filter]);

  const tabs: { id: Filter; label: string }[] = [
    { id: "all", label: `كل المباريات (${matches.length})` },
    { id: "live", label: "مباشر" },
    { id: "upcoming", label: "قادمة" },
    { id: "finished", label: "انتهت" },
  ];

  return (
    <section dir="rtl" className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-widest text-primary-400">WORLDWIDE LIVE CENTRE</p>
          <h2 className="mt-1 text-2xl font-bold text-dark-100">مباريات كرة القدم حول العالم</h2>
          <p className="mt-1 text-sm text-dark-400">مباريات مباشرة ونتائج وجدول يومي من بطولات متعددة حول العالم</p>
        </div>
        <button type="button" onClick={() => void load(true)} disabled={loading || refreshing} className="inline-flex items-center gap-2 rounded-xl border border-dark-600 px-3 py-2 text-sm text-dark-200 transition hover:bg-dark-700 disabled:opacity-50">
          <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
          تحديث
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-3 rounded-xl border border-dark-700 bg-dark-800 px-3 py-2">
          <CalendarDays size={18} className="text-primary-300" />
          <span className="sr-only">تاريخ المباريات</span>
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="bg-transparent py-1 text-sm text-dark-100 outline-none [color-scheme:dark]" />
        </label>
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="تصفية المباريات">
          {tabs.map((tab) => (
            <button key={tab.id} type="button" role="tab" aria-selected={filter === tab.id} onClick={() => setFilter(tab.id)} className={`rounded-full px-3 py-2 text-xs transition ${filter === tab.id ? "bg-primary-500 text-white" : "border border-dark-700 bg-dark-800 text-dark-300 hover:bg-dark-700"}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/[0.06] p-4 text-sm text-red-200">{error}</div>
      ) : loading ? (
        <div className="rounded-xl border border-dark-700 bg-dark-800 p-8 text-center text-sm text-dark-300">جارٍ جلب المباريات من مختلف البطولات...</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dark-700 bg-dark-800 p-8 text-center">
          <Radio size={28} className="mx-auto text-dark-500" />
          <p className="mt-3 font-semibold text-dark-200">لا توجد مباريات في هذا التصنيف لهذا التاريخ</p>
          <p className="mt-1 text-sm text-dark-400">اختر تاريخاً آخر أو اعرض كل المباريات.</p>
        </div>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {filtered.map((match, index) => {
            const hasScore = match.homeScore !== null && match.awayScore !== null;
            const isLive = match.status === "live" || match.status === "in_progress";
            return (
              <article key={`${match.competition}-${match.kickoff}-${match.home}-${index}`} className="rounded-2xl border border-dark-700 bg-dark-800 p-4">
                <div className="flex items-center justify-between gap-3 border-b border-dark-700 pb-3">
                  <div className="flex min-w-0 items-center gap-2">
                    {match.competitionLogo && <img src={match.competitionLogo} alt="" loading="lazy" className="h-5 w-5 shrink-0 object-contain" />}
                    <p className="truncate text-xs font-semibold text-dark-300">{match.competition}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${isLive ? "bg-red-500/15 text-red-300" : match.status === "finished" ? "bg-dark-700 text-dark-300" : "bg-primary-500/10 text-primary-300"}`}>
                    {isLive && <span className="ml-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" />}
                    {statusLabel(match)}
                  </span>
                </div>
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 py-5">
                  <TeamMark name={match.home} logo={match.homeLogo} />
                  <div className="min-w-[64px] text-center">
                    {hasScore ? (
                      <p className="text-2xl font-extrabold tabular-nums text-white">{match.homeScore} : {match.awayScore}</p>
                    ) : (
                      <p className="text-sm font-bold text-dark-400">VS</p>
                    )}
                    <p className="mt-1 inline-flex items-center gap-1 text-[10px] text-dark-500"><Clock3 size={11} />{kickoffLabel(match.kickoff)}</p>
                  </div>
                  <TeamMark name={match.away} logo={match.awayLogo} />
                </div>
                {match.sourceUrl && (
                  <div className="border-t border-dark-700 pt-3 text-left">
                    <a href={match.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-primary-300 hover:text-primary-200">
                      تفاصيل المباراة <ExternalLink size={13} />
                    </a>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-dark-500">
        <span>البيانات تتحدث تلقائياً كل دقيقة عند اختيار المباريات المباشرة.</span>
        {fetchedAt && <span>آخر جلب: {new Intl.DateTimeFormat("ar-YE", { timeZone: "Asia/Aden", hour: "2-digit", minute: "2-digit" }).format(new Date(fetchedAt))}</span>}
      </div>
      <a href="https://sportscore.com/" rel="dofollow" title="Sports data by SportScore" target="_blank" className="inline-flex items-center rounded-md border border-dark-600 bg-dark-900 px-3 py-1.5 text-xs font-semibold text-dark-300 hover:text-white">
        Powered by SportScore
      </a>
    </section>
  );
}
