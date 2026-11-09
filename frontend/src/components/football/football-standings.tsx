"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw, Trophy } from "lucide-react";

type Standing = {
  team?: { team_id?: string; name?: string; abbreviation?: string };
  league_rank?: number;
  group_rank?: number;
  games_played?: number;
  wins?: number;
  draws?: number;
  losses?: number;
  goals_for?: number;
  goals_against?: number;
  goal_difference?: number;
  points?: number;
  qualification?: string;
  group?: string | null;
  conference?: string | null;
  tournament?: string | null;
};

const tableCompetitions = [
  { id: "saudiproleague", name: "دوري روشن السعودي" },
  { id: "epl", name: "الدوري الإنجليزي" },
  { id: "laliga", name: "الدوري الإسباني" },
  { id: "bundesliga", name: "الدوري الألماني" },
  { id: "seriea", name: "الدوري الإيطالي" },
  { id: "ligue1", name: "الدوري الفرنسي" },
  { id: "eredivisie", name: "الدوري الهولندي" },
  { id: "primeiraliga", name: "الدوري البرتغالي" },
  { id: "ucl", name: "دوري أبطال أوروبا" },
  { id: "uel", name: "الدوري الأوروبي" },
  { id: "brasileirao", name: "الدوري البرازيلي" },
  { id: "mls", name: "الدوري الأمريكي" },
];

export default function FootballStandings() {
  const [league, setLeague] = useState("saudiproleague");
  const [season, setSeason] = useState("");
  const [rows, setRows] = useState<Standing[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);

  const load = useCallback(async (silent = false) => {
    if (silent) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ league });
      if (season) params.set("season", season);
      const response = await fetch(`/api/football/standings?${params.toString()}`, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.message || "تعذر تحميل جدول الترتيب.");
      setRows(Array.isArray(payload.standings) ? payload.standings : []);
      setFetchedAt(payload.fetchedAt || null);
    } catch (err) {
      setRows([]);
      setError(err instanceof Error ? err.message : "حدث خطأ أثناء تحميل الترتيب.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [league, season]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <section dir="rtl" className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-widest text-primary-400">LEAGUE TABLES</p>
          <h2 className="mt-1 text-2xl font-bold text-dark-100">جداول الترتيب</h2>
          <p className="mt-1 text-sm text-dark-400">النقاط والمباريات وفارق الأهداف ومراكز التأهل — حسب بيانات البطولة</p>
        </div>
        <button
          type="button"
          onClick={() => void load(true)}
          disabled={loading || refreshing}
          className="inline-flex items-center gap-2 rounded-xl border border-dark-600 px-3 py-2 text-sm text-dark-200 hover:bg-dark-700 disabled:opacity-50"
        >
          <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
          تحديث الجدول
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex items-center gap-3 rounded-xl border border-dark-700 bg-dark-800 px-3 py-2">
          <Trophy size={18} className="text-primary-300" />
          <span className="sr-only">البطولة</span>
          <select value={league} onChange={(event) => setLeague(event.target.value)} className="min-w-0 flex-1 bg-transparent py-1 text-sm text-dark-100 outline-none">
            {tableCompetitions.map((item) => <option key={item.id} value={item.id} className="bg-dark-900">{item.name}</option>)}
          </select>
        </label>
        <label className="rounded-xl border border-dark-700 bg-dark-800 px-3 py-2">
          <span className="mb-1 block text-xs text-dark-400">الموسم (اختياري)</span>
          <input type="number" min="2000" max="2100" value={season} onChange={(event) => setSeason(event.target.value)} placeholder="الموسم الحالي تلقائياً" className="w-full bg-transparent py-1 text-sm text-dark-100 outline-none" />
        </label>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/[0.06] p-4 text-sm text-red-200">{error}</div>
      ) : loading ? (
        <div className="rounded-xl border border-dark-700 bg-dark-800 p-8 text-center text-sm text-dark-300">جارٍ تحميل جدول الترتيب...</div>
      ) : rows.length === 0 ? (
        <div className="rounded-xl border border-dark-700 bg-dark-800 p-8 text-center">
          <Trophy size={28} className="mx-auto text-dark-500" />
          <p className="mt-3 font-semibold text-dark-200">لا تتوفر بيانات ترتيب لهذا الاختيار</p>
          <p className="mt-1 text-sm text-dark-400">جرّب بطولة أخرى أو اترك الموسم فارغاً لعرض الموسم الحالي.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-dark-700 bg-dark-800">
          <table className="w-full min-w-[680px] text-sm">
            <thead className="bg-dark-900/80 text-xs text-dark-400">
              <tr>
                <th className="px-3 py-3 text-right">#</th>
                <th className="px-3 py-3 text-right">الفريق</th>
                <th className="px-2 py-3">لعب</th>
                <th className="px-2 py-3">فاز</th>
                <th className="px-2 py-3">تعادل</th>
                <th className="px-2 py-3">خسر</th>
                <th className="px-2 py-3">له</th>
                <th className="px-2 py-3">عليه</th>
                <th className="px-2 py-3">الفارق</th>
                <th className="px-3 py-3">النقاط</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.team?.team_id || `${row.team?.name || "team"}-${index}`} className="border-t border-dark-700/80 text-dark-200">
                  <td className="px-3 py-3 text-right font-semibold text-dark-400">{row.league_rank ?? row.group_rank ?? index + 1}</td>
                  <td className="px-3 py-3 text-right">
                    <span className="font-semibold text-dark-100">{row.team?.name || "فريق غير محدد"}</span>
                    {row.group && <span className="mr-2 text-[10px] text-dark-500">{row.group}</span>}
                    {row.qualification && <span className="mt-1 block text-[10px] text-emerald-300">{row.qualification}</span>}
                  </td>
                  <td className="px-2 py-3 text-center tabular-nums">{row.games_played ?? "—"}</td>
                  <td className="px-2 py-3 text-center tabular-nums">{row.wins ?? "—"}</td>
                  <td className="px-2 py-3 text-center tabular-nums">{row.draws ?? "—"}</td>
                  <td className="px-2 py-3 text-center tabular-nums">{row.losses ?? "—"}</td>
                  <td className="px-2 py-3 text-center tabular-nums">{row.goals_for ?? "—"}</td>
                  <td className="px-2 py-3 text-center tabular-nums">{row.goals_against ?? "—"}</td>
                  <td className="px-2 py-3 text-center tabular-nums">{row.goal_difference ?? "—"}</td>
                  <td className="px-3 py-3 text-center font-extrabold tabular-nums text-white">{row.points ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {fetchedAt && <p className="text-[11px] text-dark-500">آخر جلب: {new Intl.DateTimeFormat("ar-YE", { timeZone: "Asia/Aden", hour: "2-digit", minute: "2-digit" }).format(new Date(fetchedAt))} · API Ninjas</p>}
      <p className="text-[11px] leading-5 text-dark-500">الجداول تتحدث بعد انتهاء المباريات. تغطية المواسم السابقة قد تتطلب خطة مختلفة من مزود البيانات.</p>
    </section>
  );
}
