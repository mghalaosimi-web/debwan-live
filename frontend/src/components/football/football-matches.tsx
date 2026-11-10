"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarDays, Clock3, RefreshCw, Trophy } from "lucide-react";

type Match = {
  id: string;
  league: string;
  season: string | null;
  round: string | null;
  date: string | null;
  kickoff: string;
  status: string;
  home: { id: string | null; name: string; abbreviation: string | null };
  away: { id: string | null; name: string; abbreviation: string | null };
  homeScore: number | null;
  awayScore: number | null;
  venue: string | null;
  updatedAt: string | null;
};

type Filter = "all" | "live" | "upcoming" | "finished";

const competitionGroups = [
  {
    "label": "إنجلترا",
    "items": [
      [
        "epl",
        "الدوري الإنجليزي الممتاز"
      ],
      [
        "championship",
        "التشامبيونشيب"
      ],
      [
        "leagueone",
        "League One"
      ],
      [
        "leaguetwo",
        "League Two"
      ],
      [
        "facup",
        "كأس الاتحاد الإنجليزي"
      ],
      [
        "eflcup",
        "كأس الرابطة الإنجليزية"
      ]
    ]
  },
  {
    "label": "أوروبا — الدوريات",
    "items": [
      [
        "laliga",
        "الدوري الإسباني"
      ],
      [
        "laliga2",
        "الدرجة الثانية الإسبانية"
      ],
      [
        "bundesliga",
        "الدوري الألماني"
      ],
      [
        "bundesliga2",
        "الدرجة الثانية الألمانية"
      ],
      [
        "seriea",
        "الدوري الإيطالي"
      ],
      [
        "serieb",
        "الدرجة الثانية الإيطالية"
      ],
      [
        "ligue1",
        "الدوري الفرنسي"
      ],
      [
        "ligue2",
        "الدرجة الثانية الفرنسية"
      ],
      [
        "eredivisie",
        "الدوري الهولندي"
      ],
      [
        "primeiraliga",
        "الدوري البرتغالي"
      ],
      [
        "superlig",
        "الدوري التركي"
      ],
      [
        "belgianproleague",
        "الدوري البلجيكي"
      ],
      [
        "greeksuperleague",
        "الدوري اليوناني"
      ],
      [
        "austrianbundesliga",
        "الدوري النمساوي"
      ],
      [
        "danishsuperliga",
        "الدوري الدنماركي"
      ],
      [
        "scottishpremiership",
        "الدوري الاسكتلندي"
      ],
      [
        "allsvenskan",
        "الدوري السويدي"
      ],
      [
        "eliteserien",
        "الدوري النرويجي"
      ],
      [
        "rpl",
        "الدوري الروسي"
      ]
    ]
  },
  {
    "label": "البطولات الأوروبية",
    "items": [
      [
        "ucl",
        "دوري أبطال أوروبا"
      ],
      [
        "uel",
        "الدوري الأوروبي"
      ],
      [
        "uecl",
        "دوري المؤتمر الأوروبي"
      ],
    ]
  },
  {
    "label": "آسيا والشرق الأوسط",
    "items": [
      [
        "saudiproleague",
        "دوري روشن السعودي"
      ],
      [
        "acl",
        "دوري أبطال آسيا"
      ],
      [
        "csl",
        "الدوري الصيني"
      ],
      [
        "isl",
        "الدوري الهندي"
      ],
      [
        "j1league",
        "الدوري الياباني"
      ],
      [
        "aleague",
        "الدوري الأسترالي"
      ]
    ]
  },
  {
    "label": "أفريقيا",
    "items": [
      [
        "cafcl",
        "دوري أبطال أفريقيا"
      ],
      [
        "afcon",
        "كأس أمم أفريقيا"
      ]
    ]
  },
  {
    "label": "الأمريكتان",
    "items": [
      [
        "mls",
        "الدوري الأمريكي MLS"
      ],
      [
        "uslc",
        "دوري USL"
      ],
      [
        "brasileirao",
        "الدوري البرازيلي"
      ],
      [
        "ligaprofesional",
        "الدوري الأرجنتيني"
      ],
      [
        "ligamx",
        "الدوري المكسيكي"
      ],
      [
        "libertadores",
        "كأس ليبرتادوريس"
      ],
      [
        "sudamericana",
        "كأس سود أمريكانا"
      ],
      [
        "leaguescup",
        "كأس الدوريات"
      ],
      [
        "concacafcc",
        "دوري أبطال الكونكاكاف"
      ],
      [
        "usopencup",
        "كأس الولايات المتحدة"
      ]
    ]
  },
  {
    "label": "الكؤوس المحلية",
    "items": [
      [
        "copadelrey",
        "كأس ملك إسبانيا"
      ],
      [
        "dfbpokal",
        "كأس ألمانيا"
      ],
      [
        "coppaitalia",
        "كأس إيطاليا"
      ],
      [
        "coupedefrance",
        "كأس فرنسا"
      ]
    ]
  },
  {
    "label": "المنتخبات والبطولات الدولية",
    "items": [
      [
        "worldcup",
        "كأس العالم"
      ],
      [
        "wcqeurope",
        "تصفيات أوروبا لكأس العالم"
      ],
      [
        "wcqsouthamerica",
        "تصفيات أمريكا الجنوبية"
      ],
      [
        "wcqnorthamerica",
        "تصفيات أمريكا الشمالية"
      ],
      [
        "wcqasia",
        "تصفيات آسيا"
      ],
      [
        "wcqafrica",
        "تصفيات أفريقيا"
      ],
      [
        "nationsleague",
        "دوري الأمم"
      ],
      [
        "euro",
        "كأس أمم أوروبا"
      ],
      [
        "euroqualifying",
        "تصفيات أمم أوروبا"
      ],
      [
        "copaamerica",
        "كوبا أمريكا"
      ],
      [
        "asiancup",
        "كأس آسيا"
      ],
      [
        "goldcup",
        "الكأس الذهبية"
      ],
      [
        "concacafnationsleague",
        "دوري أمم الكونكاكاف"
      ],
      [
        "friendlies",
        "مباريات ودية"
      ],
      [
        "clubworldcup",
        "كأس العالم للأندية"
      ]
    ]
  },
  {
    "label": "كرة القدم النسائية",
    "items": [
      [
        "wsl",
        "الدوري الإنجليزي للسيدات"
      ],
      [
        "ligaf",
        "الدوري الإسباني للسيدات"
      ],
      [
        "premiereligue",
        "الدوري الفرنسي للسيدات"
      ],
      [
        "aleaguewomen",
        "الدوري الأسترالي للسيدات"
      ],
      [
        "nsl",
        "الدوري الوطني للسيدات"
      ],
      [
        "uslsuperleague",
        "دوري USL للسيدات"
      ],
      [
        "uwcl",
        "دوري أبطال أوروبا للسيدات"
      ],
      [
        "womensworldcup",
        "كأس العالم للسيدات"
      ],
      [
        "womenseuro",
        "أمم أوروبا للسيدات"
      ]
    ]
  }
] as const;

const competitions = competitionGroups.flatMap((group) => group.items.map(([id, name]) => ({ id, name })));

function getTodayInYemen() {
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
    day: "numeric",
    month: "short",
  }).format(date);
}

function statusLabel(status: string) {
  switch (status) {
    case "in_progress":
      return "جارية";
    case "final":
      return "انتهت";
    case "postponed":
      return "مؤجلة";
    case "canceled":
      return "أُلغيت";
    case "suspended":
      return "متوقفة";
    case "delayed":
      return "متأخرة";
    default:
      return "قادمة";
  }
}

export default function FootballMatches() {
  const [league, setLeague] = useState("saudiproleague");
  const [date, setDate] = useState(getTodayInYemen);
  const [team, setTeam] = useState("");
  const [season, setSeason] = useState("");
  const [appliedTeam, setAppliedTeam] = useState("");
  const [appliedSeason, setAppliedSeason] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [configured, setConfigured] = useState(true);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);

  const loadMatches = useCallback(async (silent = false) => {
    if (silent) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ league });
      if (date) params.set("date", date);
      if (appliedTeam.trim()) params.set("team", appliedTeam.trim());
      if (appliedSeason) params.set("season", appliedSeason);
      const response = await fetch(`/api/football/matches?${params.toString()}`, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      const payload = await response.json();

      if (!response.ok || !payload.success) {
        if (payload.code === "FOOTBALL_PROVIDER_NOT_CONFIGURED") {
          setConfigured(false);
        }
        throw new Error(payload.message || "تعذر تحميل المباريات.");
      }

      setConfigured(true);
      setMatches(Array.isArray(payload.matches) ? payload.matches : []);
      setFetchedAt(payload.fetchedAt || null);
    } catch (err) {
      setMatches([]);
      setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [league, date, appliedTeam, appliedSeason]);

  useEffect(() => {
    void loadMatches();
    const interval = window.setInterval(() => void loadMatches(true), 300000);
    return () => window.clearInterval(interval);
  }, [loadMatches]);

  const filteredMatches = useMemo(() => matches.filter((match) => {
    if (filter === "live") return match.status === "in_progress";
    if (filter === "upcoming") return match.status === "scheduled" || match.status === "delayed";
    if (filter === "finished") return match.status === "final";
    return true;
  }), [matches, filter]);

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: "الكل" },
    { id: "live", label: "مباشر" },
    { id: "upcoming", label: "قادمة" },
    { id: "finished", label: "انتهت" },
  ];

  return (
    <section className="space-y-4" dir="rtl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-widest text-primary-400">FIXTURES & RESULTS</p>
          <h2 className="mt-1 text-2xl font-bold text-dark-100">المباريات والنتائج</h2>
          <p className="mt-1 text-sm text-dark-400">تغطية 74 بطولة ومسابقات للرجال والسيدات — بتوقيت اليمن</p>
        </div>
        <button
          type="button"
          onClick={() => void loadMatches(true)}
          disabled={loading || refreshing}
          className="inline-flex items-center gap-2 rounded-xl border border-dark-600 px-3 py-2 text-sm text-dark-200 transition hover:bg-dark-700 disabled:opacity-50"
        >
          <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
          تحديث
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
        <label className="flex items-center gap-3 rounded-xl border border-dark-700 bg-dark-800 px-3 py-2">
          <Trophy size={18} className="shrink-0 text-primary-300" />
          <span className="sr-only">البطولة</span>
          <select
            value={league}
            onChange={(event) => setLeague(event.target.value)}
            className="min-w-0 flex-1 bg-transparent py-1 text-sm text-dark-100 outline-none"
          >
            {competitionGroups.map((group) => (
              <optgroup key={group.label} label={group.label} className="bg-dark-900">
                {group.items.map(([id, name]) => (
                  <option key={id} value={id}>{name}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-3 rounded-xl border border-dark-700 bg-dark-800 px-3 py-2">
          <CalendarDays size={18} className="shrink-0 text-primary-300" />
          <span className="sr-only">تاريخ المباريات</span>
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="min-w-0 bg-transparent py-1 text-sm text-dark-100 outline-none [color-scheme:dark]"
          />
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="rounded-xl border border-dark-700 bg-dark-800 px-3 py-2">
          <span className="mb-1 block text-xs text-dark-400">الفريق (اختياري)</span>
          <input
            type="text"
            value={team}
            onChange={(event) => setTeam(event.target.value)}
            placeholder="اسم الفريق أو رمزه مثل ARS"
            className="w-full bg-transparent py-1 text-sm text-dark-100 outline-none"
          />
        </label>
        <label className="rounded-xl border border-dark-700 bg-dark-800 px-3 py-2">
          <span className="mb-1 block text-xs text-dark-400">الموسم (اختياري)</span>
          <input
            type="number"
            min="2000"
            max="2100"
            value={season}
            onChange={(event) => setSeason(event.target.value)}
            placeholder="مثال: 2026"
            className="w-full bg-transparent py-1 text-sm text-dark-100 outline-none"
          />
        </label>
        <button
          type="button"
          onClick={() => { setAppliedTeam(team); setAppliedSeason(season); }}
          className="sm:col-span-2 justify-self-start rounded-xl bg-primary-500 px-4 py-2 text-sm font-bold text-white hover:bg-primary-400"
        >
          تطبيق بحث الفريق والموسم
        </button>
      </div>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="تصفية المباريات">
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={filter === item.id}
            onClick={() => setFilter(item.id)}
            className={`rounded-full px-4 py-2 text-sm transition ${
              filter === item.id
                ? "bg-primary-500 text-white"
                : "border border-dark-700 bg-dark-800 text-dark-300 hover:bg-dark-700"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {!configured && error ? (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/[0.06] p-5">
          <h3 className="font-bold text-amber-200">ربط مزود المباريات يحتاج مفتاحاً مجانياً</h3>
          <p className="mt-2 text-sm leading-6 text-dark-200">{error}</p>
          <p className="mt-2 text-sm leading-6 text-dark-300">
            أنشئ مفتاحاً من API Ninjas ثم أضف المتغير <code className="rounded bg-dark-900 px-1.5 py-0.5 text-amber-200">API_NINJAS_KEY</code> إلى بيئة خادم Next.js في بيئة النشر. لا تضع المفتاح في كود الواجهة أو متغير يبدأ بـ NEXT_PUBLIC_.
          </p>
          <a
            href="https://api-ninjas.com/register"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex rounded-lg bg-amber-400 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-amber-300"
          >
            الحصول على مفتاح مجاني
          </a>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/[0.06] p-4 text-sm text-red-200">{error}</div>
      ) : loading ? (
        <div className="rounded-xl border border-dark-700 bg-dark-800 p-8 text-center text-sm text-dark-300">جارٍ تحميل المباريات...</div>
      ) : filteredMatches.length === 0 ? (
        <div className="rounded-xl border border-dark-700 bg-dark-800 p-8 text-center">
          <CalendarDays className="mx-auto text-dark-500" size={28} />
          <p className="mt-3 font-semibold text-dark-200">لا توجد مباريات ضمن هذا الاختيار</p>
          <p className="mt-1 text-sm text-dark-400">غيّر التاريخ أو البطولة أو الفريق أو الموسم لعرض مباريات أخرى.</p>
        </div>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {filteredMatches.map((match) => {
            const hasScore = match.homeScore !== null && match.awayScore !== null;
            const isLive = match.status === "in_progress";
            return (
              <article key={match.id} className="rounded-2xl border border-dark-700 bg-dark-800 p-4">
                <div className="flex items-center justify-between gap-3 border-b border-dark-700 pb-3">
                  <div className="min-w-0">
                    <p className="truncate text-xs text-dark-400">{competitions.find((item) => item.id === league)?.name}</p>
                    {match.round && <p className="mt-1 truncate text-xs text-dark-500">{match.round}</p>}
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    isLive ? "bg-red-500/15 text-red-300" :
                    match.status === "final" ? "bg-dark-700 text-dark-300" :
                    "bg-primary-500/10 text-primary-300"
                  }`}>
                    {isLive ? "● " : ""}{statusLabel(match.status)}
                  </span>
                </div>

                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 py-5">
                  <div className="text-center">
                    <p className="break-words text-sm font-bold text-dark-100">{match.home.name}</p>
                    {match.home.abbreviation && <p className="mt-1 text-xs text-dark-500">{match.home.abbreviation}</p>}
                  </div>
                  <div className="min-w-[76px] text-center">
                    {hasScore ? (
                      <p className="text-2xl font-extrabold tabular-nums text-white">{match.homeScore} : {match.awayScore}</p>
                    ) : (
                      <p className="text-sm font-bold text-dark-300">VS</p>
                    )}
                    {isLive && !hasScore && <p className="mt-1 text-[10px] text-amber-300">النتيجة الحية غير متاحة في الخطة المجانية</p>}
                  </div>
                  <div className="text-center">
                    <p className="break-words text-sm font-bold text-dark-100">{match.away.name}</p>
                    {match.away.abbreviation && <p className="mt-1 text-xs text-dark-500">{match.away.abbreviation}</p>}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-dark-700 pt-3 text-xs text-dark-400">
                  <span className="inline-flex items-center gap-1.5"><Clock3 size={13} />{formatKickoff(match.kickoff)}</span>
                  {match.venue && <span className="truncate">{match.venue}</span>}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-dark-500">
        <span>المصدر: API Ninjas · تحديث تلقائي كل 30 دقيقة</span>
        {fetchedAt && <span>آخر جلب: {new Intl.DateTimeFormat("ar-YE", { timeZone: "Asia/Aden", hour: "2-digit", minute: "2-digit" }).format(new Date(fetchedAt))}</span>}
      </div>
      <p className="text-[11px] leading-5 text-dark-500">
        ملاحظة: الخطة المجانية توفر حالة المباراة والنتيجة النهائية بعد انتهائها؛ النتيجة أثناء اللعب والدقيقة والأحداث الحية تتطلب خطة مدفوعة لدى مزود البيانات.
      </p>
    </section>
  );
}
