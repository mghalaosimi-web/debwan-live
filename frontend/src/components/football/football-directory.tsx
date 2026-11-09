"use client";

import { useCallback, useEffect, useState } from "react";
import { Search, ShieldCheck, Users, UserRound, RefreshCw } from "lucide-react";

type Team = {
  team_id: string; name: string; abbreviation?: string; short_name?: string;
  city?: string; country?: string; league?: string | null; team_type?: string;
  gender?: string; active?: boolean;
  venue?: { name?: string; city?: string; country?: string } | null;
};
type Player = {
  player_id: string; name: string; first_name?: string; last_name?: string;
  league?: string; team?: { team_id?: string; name?: string; abbreviation?: string } | null;
  position?: string; jersey_number?: string; nationality?: string;
  birth_date?: string; height_cm?: number; roster_status?: string;
};
type Mode = "teams" | "players";
const leagues = [
  ["", "كل البطولات"],
  ["epl", "الدوري الإنجليزي"],
  ["laliga", "الدوري الإسباني"],
  ["bundesliga", "الدوري الألماني"],
  ["seriea", "الدوري الإيطالي"],
  ["ligue1", "الدوري الفرنسي"],
  ["ucl", "دوري أبطال أوروبا"],
  ["uel", "الدوري الأوروبي"],
  ["saudiproleague", "دوري روشن السعودي"],
  ["mls", "الدوري الأمريكي"],
  ["championship", "دوري البطولة الإنجليزية"],
  ["leagueone", "الدوري الإنجليزي الدرجة الأولى"],
  ["leaguetwo", "الدوري الإنجليزي الدرجة الثانية"],
  ["scottishpremiership", "الدوري الاسكتلندي"],
  ["laliga2", "الدوري الإسباني الدرجة الثانية"],
  ["bundesliga2", "الدوري الألماني الدرجة الثانية"],
  ["serieb", "الدوري الإيطالي الدرجة الثانية"],
  ["ligue2", "الدوري الفرنسي الدرجة الثانية"],
  ["eredivisie", "الدوري الهولندي"],
  ["primeiraliga", "الدوري البرتغالي"],
  ["superlig", "الدوري التركي"],
  ["belgianproleague", "الدوري البلجيكي"],
  ["greeksuperleague", "الدوري اليوناني"],
  ["austrianbundesliga", "الدوري النمساوي"],
  ["danishsuperliga", "الدوري الدنماركي"],
  ["allsvenskan", "الدوري السويدي"],
  ["eliteserien", "الدوري النرويجي"],
  ["rpl", "الدوري الروسي"],
  ["uecl", "دوري المؤتمر الأوروبي"],
  ["brasileirao", "الدوري البرازيلي"],
  ["libertadores", "كوبا ليبرتادوريس"],
  ["sudamericana", "كوبا سود أمريكانا"],
  ["uslc", "دوري USL"],
  ["csl", "الدوري الصيني"],
  ["isl", "الدوري الهندي"],
  ["aleague", "الدوري الأسترالي"],
  ["acl", "دوري أبطال آسيا"],
  ["cafcl", "دوري أبطال أفريقيا"],
  ["ligamx", "الدوري المكسيكي"],
  ["ligaprofesional", "الدوري الأرجنتيني"],
  ["j1league", "الدوري الياباني"],
  ["facup", "كأس الاتحاد الإنجليزي"],
  ["eflcup", "كأس الرابطة الإنجليزية"],
  ["copadelrey", "كأس ملك إسبانيا"],
  ["dfbpokal", "كأس ألمانيا"],
  ["coppaitalia", "كأس إيطاليا"],
  ["coupedefrance", "كأس فرنسا"],
  ["usopencup", "كأس الولايات المتحدة"],
  ["leaguescup", "كأس الدوريات"],
  ["concacafcc", "دوري أبطال الكونكاكاف"],
  ["clubworldcup", "كأس العالم للأندية"],
  ["wsl", "الدوري الإنجليزي للسيدات"],
  ["ligaf", "الدوري الفرنسي للسيدات"],
  ["premiereligue", "الدوري الممتاز"],
  ["aleaguewomen", "الدوري الأسترالي للسيدات"],
  ["nsl", "الدوري الوطني للسيدات"],
  ["uslsuperleague", "دوري USL الممتاز للسيدات"],
  ["uwcl", "دوري أبطال أوروبا للسيدات"],
  ["worldcup", "كأس العالم"],
  ["wcqeurope", "تصفيات كأس العالم أوروبا"],
  ["wcqsouthamerica", "تصفيات كأس العالم أمريكا الجنوبية"],
  ["wcqnorthamerica", "تصفيات كأس العالم أمريكا الشمالية"],
  ["wcqasia", "تصفيات كأس العالم آسيا"],
  ["wcqafrica", "تصفيات كأس العالم أفريقيا"],
  ["nationsleague", "دوري الأمم"],
  ["euro", "بطولة أمم أوروبا"],
  ["euroqualifying", "تصفيات أمم أوروبا"],
  ["copaamerica", "كوبا أمريكا"],
  ["afcon", "كأس أمم أفريقيا"],
  ["asiancup", "كأس آسيا"],
  ["goldcup", "الكأس الذهبية"],
  ["concacafnationsleague", "دوري أمم الكونكاكاف"],
  ["friendlies", "مباريات ودية"],
  ["womensworldcup", "كأس العالم للسيدات"],
  ["womenseuro", "أمم أوروبا للسيدات"],
];
const positions: Record<string, string> = { G: "حارس مرمى", D: "دفاع", M: "وسط", F: "هجوم" };

export default function FootballDirectory() {
  const [mode, setMode] = useState<Mode>("teams");
  const [league, setLeague] = useState("epl");
  const [query, setQuery] = useState("");
  const [teamQuery, setTeamQuery] = useState("");
  const [items, setItems] = useState<(Team | Player)[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const load = useCallback(async () => {
    if (mode === "players" && !query.trim() && !teamQuery.trim()) {
      setError("أدخل اسم لاعب أو اسم النادي لعرض قائمة اللاعبين.");
      setItems([]); setSearched(false); return;
    }
    setLoading(true); setError("");
    try {
      const params = new URLSearchParams({ type: mode });
      if (league) params.set("league", league);
      if (query.trim()) params.set(mode === "teams" ? "team" : "name", query.trim());
      if (mode === "players" && teamQuery.trim()) params.set("team", teamQuery.trim());
      if (mode === "teams") params.set("active", "true");
      const response = await fetch(`/api/football/directory?${params.toString()}`, { headers: { Accept: "application/json" } });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.message || "تعذر تحميل الدليل.");
      setItems(Array.isArray(payload.data) ? payload.data : []);
      setSearched(true);
    } catch (err) {
      setItems([]); setError(err instanceof Error ? err.message : "حدث خطأ أثناء البحث.");
    } finally { setLoading(false); }
  }, [mode, league, query, teamQuery]);

  useEffect(() => { void load(); }, [load]);

  return (
    <section dir="rtl" className="space-y-4">
      <div>
        <p className="text-xs font-semibold tracking-widest text-primary-400">CLUBS & PLAYERS</p>
        <h2 className="mt-1 text-2xl font-bold text-dark-100">دليل الأندية واللاعبين</h2>
        <p className="mt-1 text-sm text-dark-400">ابحث عن الأندية وقوائم اللاعبين وبياناتهم الأساسية من مزود البيانات.</p>
      </div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="نوع الدليل">
        <button type="button" onClick={() => { setMode("teams"); setQuery(""); setTeamQuery(""); }} aria-pressed={mode === "teams"} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold ${mode === "teams" ? "bg-primary-500 text-white" : "border border-dark-700 bg-dark-800 text-dark-300"}`}><Users size={16}/> الأندية</button>
        <button type="button" onClick={() => { setMode("players"); setQuery(""); setTeamQuery(""); }} aria-pressed={mode === "players"} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold ${mode === "players" ? "bg-primary-500 text-white" : "border border-dark-700 bg-dark-800 text-dark-300"}`}><UserRound size={16}/> اللاعبون</button>
      </div>
      <div className="grid gap-3 md:grid-cols-[1fr_1.4fr_auto]">
        <select value={league} onChange={(e) => setLeague(e.target.value)} className="rounded-xl border border-dark-700 bg-dark-800 px-3 py-3 text-sm text-dark-100">
          {leagues.map(([id, label]) => <option key={id} value={id} className="bg-dark-900">{label}</option>)}
        </select>
        <label className="flex items-center gap-2 rounded-xl border border-dark-700 bg-dark-800 px-3">
          <Search size={17} className="text-dark-400"/>
          <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") void load(); }} placeholder={mode === "teams" ? "ابحث باسم النادي أو اختصاره" : "ابحث باسم اللاعب"} className="min-w-0 flex-1 bg-transparent py-3 text-sm text-dark-100 outline-none"/>
        </label>
        <button type="button" onClick={() => void load()} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 py-3 text-sm font-bold text-white disabled:opacity-50"><RefreshCw size={15} className={loading ? "animate-spin" : ""}/> بحث</button>
      </div>
      {mode === "players" && <label className="flex items-center gap-2 rounded-xl border border-dark-700 bg-dark-800 px-3"><Users size={17} className="text-dark-400"/><input value={teamQuery} onChange={(e) => setTeamQuery(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") void load(); }} placeholder="اختياري: اسم النادي لعرض قائمته" className="min-w-0 flex-1 bg-transparent py-3 text-sm text-dark-100 outline-none"/></label>}
      {error ? <div className="rounded-xl border border-red-500/20 bg-red-500/[0.06] p-4 text-sm text-red-200">{error}</div> : loading ? <div className="rounded-xl border border-dark-700 bg-dark-800 p-8 text-center text-sm text-dark-300">جارٍ تحميل البيانات...</div> : items.length === 0 ? <div className="rounded-xl border border-dark-700 bg-dark-800 p-8 text-center text-sm text-dark-300">{searched ? "لا توجد نتائج لهذا البحث." : "ابدأ البحث لعرض البيانات."}</div> :
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {mode === "teams" ? (items as Team[]).map((team) => (
            <article key={team.team_id} className="rounded-2xl border border-dark-700 bg-dark-800 p-4">
              <div className="flex items-start justify-between gap-2"><div><h3 className="font-bold text-dark-100">{team.name}</h3><p className="mt-1 text-xs text-dark-400">{team.short_name || team.abbreviation || team.team_id}</p></div><ShieldCheck size={18} className="text-emerald-400"/></div>
              <div className="mt-4 space-y-1 text-xs text-dark-300"><p>{team.country || "بلد غير محدد"}{team.city ? ` · ${team.city}` : ""}</p><p>{team.venue?.name || "الملعب غير مسجل"}</p><p>{team.team_type === "national" ? "منتخب وطني" : "نادي"} · {team.gender === "women" ? "سيدات" : "رجال"}</p></div>
            </article>
          )) : (items as Player[]).map((player) => (
            <article key={player.player_id} className="rounded-2xl border border-dark-700 bg-dark-800 p-4">
              <div className="flex items-start justify-between gap-2"><div><h3 className="font-bold text-dark-100">{player.name}</h3><p className="mt-1 text-xs text-dark-400">{player.team?.name || "دون نادٍ مسجل"}</p></div><span className="rounded-lg bg-dark-700 px-2 py-1 text-xs font-bold text-primary-300">{player.jersey_number || "—"}</span></div>
              <div className="mt-4 space-y-1 text-xs text-dark-300"><p>{positions[player.position || ""] || "مركز غير محدد"} · {player.nationality || "الجنسية غير مسجلة"}</p><p>{player.birth_date ? `تاريخ الميلاد: ${player.birth_date}` : "تاريخ الميلاد غير متاح"}</p><p>{player.roster_status === "active" ? "ضمن القائمة الحالية" : player.roster_status || "حالة القائمة غير محددة"}</p></div>
            </article>
          ))}
        </div>
      }
      <p className="text-[11px] text-dark-500">بيانات الأندية واللاعبين مقدمة من API Ninjas؛ قوائم اللاعبين تتطلب البحث باسم لاعب أو نادٍ.</p>
    </section>
  );
}
