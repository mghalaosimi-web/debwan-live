"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarClock, CircleAlert, ExternalLink, Goal, ShieldAlert } from "lucide-react";

type Incident = { time?: number | string; type?: string; side?: string; player?: string; home_score?: number; away_score?: number };
type Stat = { label?: string; home?: number | string; away?: number | string; home_pct?: number; away_pct?: number; suffix?: string };
type H2H = { summary?: { team1_wins?: number; team2_wins?: number; draws?: number; meetings?: number }; matches?: Array<{ home?: string; away?: string; home_score?: number | string; away_score?: number | string; time?: string; competition?: string }> };
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

type LineupPlayer = { name?: string; player?: string; player_name?: string; number?: number | string; jersey_number?: number | string; position?: string; role?: string; photo?: string; image?: string; picture?: string; avatar?: string; slug?: string; captain?: boolean; [key: string]: unknown };
function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
}
function playerList(value: unknown): LineupPlayer[] {
  if (Array.isArray(value)) return value.filter((item): item is LineupPlayer => Boolean(item) && typeof item === "object");
  const record = asRecord(value);
  if (!record) return [];
  for (const key of ["players", "lineup", "starting", "starters", "starting_xi", "startingXI"]) {
    if (Array.isArray(record[key])) return (record[key] as unknown[]).filter((item): item is LineupPlayer => Boolean(item) && typeof item === "object");
  }
  return [];
}
function LineupTeam({ name, value }: { name: string; value: unknown }) {
  const record = asRecord(value);
  const starters = playerList(value);
  const substitutes = playerList(record?.substitutes ?? record?.bench);
  const formation = typeof record?.formation === "string" ? record.formation : typeof record?.system === "string" ? record.system : null;
  const renderPlayer = (player: LineupPlayer, index: number) => {
    const playerName = String(player.name || player.player_name || player.player || "لاعب");
    const photo = [player.photo, player.image, player.picture, player.avatar].find((item): item is string => typeof item === "string" && /^https?:\/\//.test(item));
    return <li key={String(player.slug || playerName) + index} className="flex min-w-0 items-center gap-2.5 rounded-xl border border-dark-700/80 bg-dark-900/70 px-3 py-2">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-dark-700 text-[11px] font-black text-dark-200">{photo ? <img src={photo} alt="" loading="lazy" className="h-full w-full object-cover"/> : player.number || player.jersey_number || "•"}</span>
      <span className="min-w-0 flex-1"><span className="block truncate text-xs font-bold text-dark-100">{playerName}{player.captain ? " (C)" : ""}</span><span className="mt-0.5 block truncate text-[10px] text-dark-500">{String(player.position || player.role || "مركز غير محدد")}</span></span>
      {(player.number || player.jersey_number) && <span className="text-[10px] font-bold tabular-nums text-dark-400">{player.number || player.jersey_number}</span>}
    </li>;
  };
  return <article className="min-w-0 rounded-2xl border border-dark-700 bg-dark-800 p-4 sm:p-5">
    <div className="mb-4 flex items-center justify-between gap-3"><h3 className="font-black text-dark-100">{name}</h3>{formation && <span className="rounded-lg bg-emerald-400/10 px-2.5 py-1 text-[11px] font-black text-emerald-300">{formation}</span>}</div>
    {starters.length ? <><p className="mb-2 text-[10px] font-bold text-emerald-300">التشكيلة الأساسية · {starters.length}</p><ol className="grid gap-2 sm:grid-cols-2">{starters.map(renderPlayer)}</ol></> : <p className="rounded-xl bg-dark-900 p-3 text-xs text-dark-400">التشكيلة الأساسية لم تُعلن أو لا يوفرها المصدر لهذه المباراة.</p>}
    {substitutes.length > 0 && <><p className="mb-2 mt-5 text-[10px] font-bold text-dark-400">البدلاء · {substitutes.length}</p><ol className="grid gap-2 sm:grid-cols-2">{substitutes.map(renderPlayer)}</ol></>}
  </article>;
}
function LineupsPanel({ lineups, home, away }: { lineups: unknown; home: string; away: string }) {
  const root = asRecord(lineups);
  const homeData = root?.home ?? root?.home_team ?? root?.team1 ?? root?.localteam;
  const awayData = root?.away ?? root?.away_team ?? root?.team2 ?? root?.visitorteam;
  const hasStructuredTeams = Boolean(homeData || awayData);
  if (!lineups) return <section className="rounded-2xl border border-dark-700 bg-dark-800 p-5"><h2 className="text-lg font-bold text-dark-100">التشكيلات</h2><p className="mt-2 text-sm text-dark-400">لم يعلن مزود البيانات التشكيلات لهذه المباراة بعد. ستظهر هنا عند توفرها رسمياً.</p></section>;
  if (!hasStructuredTeams) return <section className="rounded-2xl border border-dark-700 bg-dark-800 p-5"><h2 className="text-lg font-bold text-dark-100">التشكيلات</h2><p className="mt-2 text-sm text-dark-400">وصلت بيانات تشكيلات من المصدر، لكن بنيتها لا تسمح بعرض أسماء اللاعبين بشكل موثوق. لن نعرض بيانات تخمينية.</p></section>;
  return <section className="space-y-3"><div><h2 className="text-lg font-black text-dark-100">تشكيلات الفريقين</h2><p className="mt-1 text-xs text-dark-500">التشكيلة الرسمية والبدلاء حسب ما يعلنه مزود بيانات المباراة.</p></div><div className="grid gap-3 lg:grid-cols-2"><LineupTeam name={home} value={homeData}/><LineupTeam name={away} value={awayData}/></div></section>;
}
\nexport default function FootballMatchDetail({ slug }: { slug: string }) {
  const [match, setMatch] = useState<Match | null>(null);
  const [h2h, setH2h] = useState<H2H | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    fetch(`/api/football/match?slug=${encodeURIComponent(slug)}`, { headers: { Accept: "application/json" } })
      .then(async (r) => { const p = await r.json(); if (!r.ok || !p.success) throw new Error(p.message || "تعذر تحميل المباراة."); return p; })
      .then((p) => { if (active) { setMatch(p.match as Match); setH2h(p.h2h as H2H | null); } })
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
        {h2h && (
          <section className="rounded-2xl border border-dark-700 bg-dark-800 p-5">
            <h2 className="text-lg font-bold text-dark-100">المواجهات المباشرة السابقة</h2>
            {h2h.summary && <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 text-center"><div className="rounded-xl bg-dark-900 p-3"><b className="block text-xl text-white">{h2h.summary.team1_wins ?? 0}</b><span className="text-[11px] text-dark-400">فوز {match.home}</span></div><div className="rounded-xl bg-dark-900 p-3"><b className="block text-xl text-white">{h2h.summary.draws ?? 0}</b><span className="text-[11px] text-dark-400">تعادل</span></div><div className="rounded-xl bg-dark-900 p-3"><b className="block text-xl text-white">{h2h.summary.team2_wins ?? 0}</b><span className="text-[11px] text-dark-400">فوز {match.away}</span></div><div className="rounded-xl bg-dark-900 p-3"><b className="block text-xl text-white">{h2h.summary.meetings ?? 0}</b><span className="text-[11px] text-dark-400">مواجهة</span></div></div>}
            {h2h.matches?.length ? <div className="mt-4 space-y-2">{h2h.matches.map((game,i)=><div key={i} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-dark-900 px-3 py-2 text-xs"><span className="text-dark-300">{game.home} — {game.away}</span><b className="text-white">{game.home_score ?? "—"} : {game.away_score ?? "—"}</b><span className="text-dark-500">{game.competition || ""}</span></div>)}</div> : null}
          </section>
        )}
        <LineupsPanel lineups={match.lineups} home={match.home} away={match.away} />
        <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-xs text-dark-500">بيانات المباراة من SportScore وقد تختلف تفاصيل الأحداث والتشكيلات حسب التغطية.</p>{match.url && <a href={`https://sportscore.com${match.url}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-semibold text-primary-300">المصدر الأصلي <ExternalLink size={13}/></a>}</div>
        <a href="https://sportscore.com/" rel="dofollow" target="_blank" className="inline-flex rounded-md border border-dark-600 bg-dark-900 px-3 py-1.5 text-xs font-semibold text-dark-300">Powered by SportScore</a>
       </>}
    </main>
  );
}
