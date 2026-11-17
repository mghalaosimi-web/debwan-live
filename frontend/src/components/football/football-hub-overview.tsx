"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, Clock3, Radio, RefreshCw, Trophy } from "lucide-react";

type HubMatch = {
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
};

type MatchPayload = {
  success?: boolean;
  message?: string;
  matches?: HubMatch[];
  fetchedAt?: string;
};

function yemenDate() {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Asia/Aden",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function formatKickoff(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "موعد غير متاح";
  return new Intl.DateTimeFormat("ar-YE", {
    timeZone: "Asia/Aden",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function matchGroup(status: string): "live" | "upcoming" | "finished" | "other" {
  const value = status.toLowerCase();
  if (["live", "in_progress", "inprogress", "1h", "2h", "ht"].includes(value)) return "live";
  if (["finished", "final", "ft", "after_extra_time", "after_penalties"].includes(value)) return "finished";
  if (["upcoming", "scheduled", "not_started", "ns", "timed"].includes(value)) return "upcoming";
  return "other";
}

function MatchTeam({ name, logo }: { name: string; logo: string | null }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="flex min-w-0 flex-col items-center gap-2 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-dark-700 bg-dark-900/80 p-1.5">
        {logo && !failed ? (
          <img src={logo} alt="" loading="lazy" onError={() => setFailed(true)} className="h-full w-full object-contain" />
        ) : (
          <span className="text-xs font-black text-dark-300">{name.slice(0, 2)}</span>
        )}
      </div>
      <span className="line-clamp-2 min-h-9 text-xs font-bold leading-5 text-dark-100">{name}</span>
    </div>
  );
}

export default function FootballHubOverview() {
  const [matches, setMatches] = useState<HubMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);

  const load = useCallback(async (silent = false) => {
    if (silent) setRefreshing(true);
    else setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/football/global-matches?date=${yemenDate()}`, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      const payload = (await response.json()) as MatchPayload;
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "تعذر تحميل ملخص المباريات الآن.");
      }
      setMatches(Array.isArray(payload.matches) ? payload.matches : []);
      setFetchedAt(payload.fetchedAt || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ أثناء تحميل المباريات.");
      setMatches([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const interval = window.setInterval(() => void load(true), 60000);
    return () => window.clearInterval(interval);
  }, [load]);

  const orderedMatches = useMemo(() => {
    const priority = (status: string) => {
      const group = matchGroup(status);
      return group === "live" ? 0 : group === "upcoming" ? 1 : group === "finished" ? 2 : 3;
    };
    return [...matches]
      .sort((a, b) => priority(a.status) - priority(b.status) || new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime())
      .slice(0, 6);
  }, [matches]);

  const liveCount = matches.filter((match) => matchGroup(match.status) === "live").length;
  const upcomingCount = matches.filter((match) => matchGroup(match.status) === "upcoming").length;

  return (
    <section dir="rtl" className="mb-6 space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3 rounded-2xl border border-dark-700 bg-dark-800/80 p-4 sm:p-5">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 text-[11px] font-bold tracking-wide text-emerald-300">
            <Radio size={14} /> تحديث تلقائي · بيانات المباريات
          </div>
          <h2 className="text-xl font-black text-dark-100 sm:text-2xl">ملخص مباريات اليوم</h2>
          <p className="mt-1 text-xs text-dark-400">مباريات البطولات الكبرى بتوقيت اليمن، وفق البيانات المتاحة من مزود النتائج.</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => void load(true)} disabled={loading || refreshing} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-dark-600 bg-dark-900 px-3 py-2 text-xs font-bold text-dark-200 transition hover:border-emerald-400/40 disabled:opacity-50">
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} /> تحديث
          </button>
          <Link href="/football/matches" className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-emerald-400 px-3 py-2 text-xs font-black text-[#06251c] transition hover:bg-emerald-300">
            كل المباريات <CalendarDays size={14} />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-dark-700 bg-dark-800 px-4 py-3">
          <p className="text-[11px] text-dark-400">إجمالي مباريات اليوم</p>
          <p className="mt-1 text-2xl font-black tabular-nums text-white">{loading ? "—" : matches.length}</p>
        </div>
        <div className="rounded-xl border border-dark-700 bg-dark-800 px-4 py-3">
          <p className="text-[11px] text-dark-400">مباريات مباشرة</p>
          <p className="mt-1 text-2xl font-black tabular-nums text-rose-300">{loading ? "—" : liveCount}</p>
        </div>
        <div className="col-span-2 rounded-xl border border-dark-700 bg-dark-800 px-4 py-3 sm:col-span-1">
          <p className="text-[11px] text-dark-400">مباريات قادمة</p>
          <p className="mt-1 text-2xl font-black tabular-nums text-emerald-300">{loading ? "—" : upcomingCount}</p>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] p-5">
          <p className="text-sm font-bold text-amber-200">تعذر جلب المباريات</p>
          <p className="mt-1 text-xs leading-6 text-dark-300">{error}</p>
          <button type="button" onClick={() => void load()} className="mt-3 rounded-lg border border-amber-300/30 px-3 py-2 text-xs font-bold text-amber-100">إعادة المحاولة</button>
        </div>
      ) : loading ? (
        <div className="rounded-2xl border border-dark-700 bg-dark-800 p-8 text-center text-sm text-dark-300">جارٍ تحميل مباريات اليوم من مزود النتائج...</div>
      ) : orderedMatches.length === 0 ? (
        <div className="rounded-2xl border border-dark-700 bg-dark-800 p-8 text-center">
          <Trophy size={25} className="mx-auto text-dark-500" />
          <p className="mt-3 text-sm font-bold text-dark-200">لا توجد مباريات متاحة لهذا اليوم</p>
          <p className="mt-1 text-xs text-dark-400">يمكنك اختيار تاريخ آخر من جدول المباريات.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {orderedMatches.map((match, index) => {
            const group = matchGroup(match.status);
            const hasScore = match.homeScore !== null && match.awayScore !== null;
            const statusText = group === "live" ? "مباشرة" : group === "finished" ? "انتهت" : group === "upcoming" ? "قادمة" : match.statusText || "حالة المباراة";
            return (
              <article key={`${match.competition}-${match.kickoff}-${match.home}-${index}`} className="overflow-hidden rounded-2xl border border-dark-700 bg-dark-800">
                <div className="flex min-h-11 items-center justify-between gap-2 border-b border-dark-700 bg-dark-900/50 px-3 py-2.5">
                  <div className="flex min-w-0 items-center gap-2">
                    {match.competitionLogo && <img src={match.competitionLogo} alt="" loading="lazy" className="h-5 w-5 shrink-0 object-contain" />}
                    <span className="truncate text-[11px] font-bold text-dark-300">{match.competition}</span>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-black ${group === "live" ? "bg-rose-500/15 text-rose-300" : group === "finished" ? "bg-dark-700 text-dark-300" : "bg-emerald-400/10 text-emerald-300"}`}>
                    {group === "live" ? "● " : ""}{statusText}
                  </span>
                </div>
                <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-2 px-3 py-4">
                  <MatchTeam name={match.home} logo={match.homeLogo} />
                  <div className="min-w-[66px] pt-3 text-center">
                    <p className={`text-xl font-black tabular-nums ${hasScore ? "text-white" : "text-dark-400"}`}>{hasScore ? `${match.homeScore} - ${match.awayScore}` : "VS"}</p>
                    <p className="mt-2 inline-flex items-center gap-1 text-[10px] text-dark-400"><Clock3 size={11} />{formatKickoff(match.kickoff)}</p>
                  </div>
                  <MatchTeam name={match.away} logo={match.awayLogo} />
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-dark-500">
        <span>المصدر: SportScore · تحديث تلقائي كل دقيقة</span>
        {fetchedAt && <span>آخر تحديث: {new Intl.DateTimeFormat("ar-YE", { timeZone: "Asia/Aden", hour: "2-digit", minute: "2-digit" }).format(new Date(fetchedAt))}</span>}
      </div>
    </section>
  );
}
