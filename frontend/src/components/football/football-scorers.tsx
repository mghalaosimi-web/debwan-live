"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Award, RefreshCw } from "lucide-react";

type Scorer = { rank: number; player: string; player_logo?: string; player_slug: string; team: string; team_logo?: string; goals: number; assists: number; matches: number; minutes: number; rating?: number };
const competitions = [
  ["english-premier-league","الدوري الإنجليزي"], ["saudi-professional-league","دوري روشن السعودي"],
  ["uefa-champions-league","دوري أبطال أوروبا"], ["uefa-europa-league","الدوري الأوروبي"],
  ["fifa-world-cup","كأس العالم"], ["spanish-la-liga","الدوري الإسباني"],
  ["german-bundesliga","الدوري الألماني"], ["italian-serie-a","الدوري الإيطالي"],
  ["french-ligue-1","الدوري الفرنسي"], ["eredivisie","الدوري الهولندي"],
  ["portuguese-liga","الدوري البرتغالي"], ["brazilian-serie-a","الدوري البرازيلي"],
  ["major-league-soccer","الدوري الأمريكي"],
];

export default function FootballScorers() {
  const [competition, setCompetition] = useState("english-premier-league");
  const [stat, setStat] = useState<"goals" | "assists">("goals");
  const [rows, setRows] = useState<Scorer[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const params = new URLSearchParams({ competition, stat, limit: "20" });
      const response = await fetch(`/api/football/scorers?${params.toString()}`, { headers: { Accept: "application/json" } });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.message || "تعذر تحميل الإحصائيات.");
      setRows(Array.isArray(payload.scorers) ? payload.scorers : []);
      setTitle(payload.competition || "");
    } catch (err) { setRows([]); setError(err instanceof Error ? err.message : "حدث خطأ أثناء تحميل الإحصائيات."); }
    finally { setLoading(false); }
  }, [competition, stat]);

  useEffect(() => { void load(); }, [load]);

  return (
    <section dir="rtl" className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><p className="text-xs font-semibold tracking-widest text-primary-400">TOP SCORERS & ASSISTS</p><h2 className="mt-1 text-2xl font-bold text-dark-100">الهدافون وصنّاع الأهداف</h2><p className="mt-1 text-sm text-dark-400">ترتيب إحصائي حسب البطولة المختارة</p></div>
        <button type="button" onClick={() => void load()} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-dark-600 px-3 py-2 text-sm text-dark-200 disabled:opacity-50"><RefreshCw size={15} className={loading ? "animate-spin" : ""}/> تحديث</button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <select value={competition} onChange={(e) => setCompetition(e.target.value)} className="rounded-xl border border-dark-700 bg-dark-800 px-3 py-3 text-sm text-dark-100">{competitions.map(([id,label]) => <option key={id} value={id} className="bg-dark-900">{label}</option>)}</select>
        <div className="flex gap-2 rounded-xl border border-dark-700 bg-dark-800 p-1">
          <button type="button" onClick={() => setStat("goals")} className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold ${stat === "goals" ? "bg-primary-500 text-white" : "text-dark-300"}`}>الهدافون</button>
          <button type="button" onClick={() => setStat("assists")} className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold ${stat === "assists" ? "bg-primary-500 text-white" : "text-dark-300"}`}>التمريرات الحاسمة</button>
        </div>
      </div>
      {error ? <div className="rounded-xl border border-red-500/20 bg-red-500/[0.06] p-4 text-sm text-red-200">{error}</div> : loading ? <div className="rounded-xl border border-dark-700 bg-dark-800 p-8 text-center text-sm text-dark-300">جارٍ تحميل الترتيب...</div> : rows.length === 0 ? <div className="rounded-xl border border-dark-700 bg-dark-800 p-8 text-center text-sm text-dark-300">لا تتوفر سجلات لهذه البطولة حالياً.</div> :
        <div className="overflow-x-auto rounded-2xl border border-dark-700 bg-dark-800">
          <div className="border-b border-dark-700 px-4 py-3 text-sm font-bold text-dark-100">{title}</div>
          <table className="w-full min-w-[560px] text-sm"><thead className="bg-dark-900/80 text-xs text-dark-400"><tr><th className="px-3 py-3 text-right">#</th><th className="px-3 py-3 text-right">اللاعب</th><th className="px-3 py-3 text-right">النادي</th><th className="px-3 py-3">{stat === "goals" ? "الأهداف" : "الصناعة"}</th><th className="px-3 py-3">المباريات</th><th className="px-3 py-3">الدقائق</th></tr></thead><tbody>{rows.map((row) => <tr key={row.player_slug} className="border-t border-dark-700/80 text-dark-200"><td className="px-3 py-3 font-bold text-dark-400">{row.rank}</td><td className="px-3 py-3"><div className="flex items-center gap-2">{row.player_logo ? <img src={row.player_logo} alt="" loading="lazy" className="h-8 w-8 rounded-full object-contain"/> : <span className="flex h-8 w-8 items-center justify-center rounded-full bg-dark-700"><Award size={15}/></span>}<Link href={`/football/player/${row.player_slug}`} className="font-semibold text-dark-100 hover:text-primary-300">{row.player}</Link></div></td><td className="px-3 py-3"><div className="flex items-center gap-2">{row.team_logo && <img src={row.team_logo} alt="" loading="lazy" className="h-5 w-5 object-contain"/>}{row.team}</div></td><td className="px-3 py-3 text-center font-extrabold text-white">{stat === "goals" ? row.goals : row.assists}</td><td className="px-3 py-3 text-center">{row.matches}</td><td className="px-3 py-3 text-center">{row.minutes}</td></tr>)}</tbody></table>
        </div>
      }
      <p className="text-[11px] text-dark-500">إحصائيات مقدمة من SportScore. قد تختلف البطولات المتاحة وفق الموسم وبيانات المزود.</p>
    </section>
  );
}
