"use client";

import FootballSectionLayout from "@/components/football/football-section-layout";
import { ArrowUpLeft, Clock3, ExternalLink, Play, Radio, ShieldCheck, Trophy } from "lucide-react";

const STREAM_DESTINATIONS = [
  { label: "البث الأول", href: "https://19.pinkshooters.com/bein-sports-hd-1/", detail: "وجهة المشاهدة الأولى", image: "/branding/stream-1.svg" },
  { label: "البث الثاني", href: "https://syriashdab.com/", detail: "مباريات اليوم والمشاهدة", image: "/branding/stream-2.svg" },
  { label: "البث الثالث", href: "https://koora.watch/", detail: "كورة لايف", image: "/branding/stream-3.svg" },
  { label: "البث الرابع", href: "https://ostora-live.com/", detail: "الأسطورة لايف", image: "/branding/stream-4.svg" },
];

const TODAY_MATCHES = [
  { competition: "دوري الأمم الأوروبية", home: "النرويج", away: "ويلز", time: "8:00 مساءً", links: ["https://buff.ly/6wVGDF1", "https://buff.ly/K1QuNmv"] },
  { competition: "دوري الأمم الأوروبية", home: "البرتغال", away: "الدنمارك", time: "10:45 مساءً", links: ["https://buff.ly/FBl6UU4", "https://buff.ly/jfy9Hbb"] },
  { competition: "دوري الأمم الأوروبية", home: "السويد", away: "البوسنة والهرسك", time: "10:45 مساءً", links: ["https://buff.ly/Sr5jlk6", "https://buff.ly/kvgaNUZ"] },
  { competition: "تصفيات أمم أفريقيا", home: "الجزائر", away: "توغو", time: "10:00 مساءً", links: ["https://buff.ly/2ZCBS5C", "https://buff.ly/2RqEzKd"] },
];

export default function FootballWatchPage() {
  return (
    <FootballSectionLayout
      title="المشاهدة المباشرة"
      eyebrow="DEBWAN LIVE"
      description="اختر مصدر المشاهدة المناسب من خيارات دبوان لايف."
    >
      <main className="space-y-6">
        <section className="relative isolate overflow-hidden rounded-3xl border border-emerald-300/20 bg-[#071b18] shadow-xl">
          <img src="/branding/football-promo.svg" alt="شاهد المباريات عبر دبوان لايف" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-l from-[#06111f]/95 via-[#06111f]/55 to-transparent" />
          <div className="relative z-10 flex min-h-[280px] flex-col justify-center p-6 sm:min-h-[340px] sm:p-10">
            <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200/30 bg-[#07111f]/60 px-3 py-1.5 text-xs font-bold text-emerald-100 backdrop-blur">
              <Trophy size={15} /> DEBWAN LIVE FOOTBALL
            </div>
            <h2 className="max-w-2xl text-3xl font-black leading-tight text-white sm:text-5xl">شاهد المباريات عبر دبوان لايف</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-200 sm:text-base">
              وجهتك لمتابعة كرة القدم؛ اختر أحد مصادر المشاهدة المتاحة وانتقل إليه مباشرة.
            </p>
            <a href="#stream-options" className="mt-6 inline-flex min-h-11 w-fit items-center gap-2 rounded-xl bg-emerald-300 px-5 py-3 text-sm font-black text-[#06251c] transition hover:bg-emerald-200">
              استعرض خيارات البث <ArrowUpLeft size={17} />
            </a>
          </div>
        </section>

        <section id="stream-options" aria-label="خيارات المشاهدة">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-xs font-bold tracking-wider text-emerald-300">WATCH OPTIONS</p>
              <h2 className="mt-1 text-xl font-black text-white">اختر البث الذي يناسبك</h2>
            </div>
            <span className="text-xs text-slate-400">4 خيارات للمشاهدة</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {STREAM_DESTINATIONS.map((stream, index) => (
              <article key={stream.label} className="group overflow-hidden rounded-2xl border border-white/10 bg-[#0d1a2a] transition hover:-translate-y-1 hover:border-emerald-300/30">
                <div className="relative aspect-[16/8] overflow-hidden bg-[#07111f]">
                  <img src={stream.image} alt={`صورة ترويجية لـ ${stream.label} في دبوان لايف`} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-[#06111f]/80 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur">
                    <Radio size={13} className="text-emerald-300" /> ${stream.label}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 p-4 sm:p-5">
                  <div className="min-w-0">
                    <h3 className="text-lg font-black text-white">${stream.label}</h3>
                    <p className="mt-1 text-sm text-slate-400">${stream.detail}</p>
                    <p className="mt-2 text-[11px] text-slate-500">يفتح في موقع المصدر الخارجي</p>
                  </div>
                  <a href={stream.href} target="_blank" rel="noopener noreferrer" aria-label={`فتح ${stream.label}`} className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-emerald-300 px-4 py-3 text-xs font-black text-[#06251c] transition hover:bg-emerald-200">
                    <Play size={15} fill="currentColor" /> مشاهدة <ExternalLink size={14} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="today-match-links" aria-labelledby="today-match-links-title" className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-xs font-bold tracking-wider text-emerald-300">MATCH WATCH LINKS</p>
              <h2 id="today-match-links-title" className="mt-1 text-xl font-black text-white">مباريات اليوم — روابط إضافية</h2>
              <p className="mt-1 text-xs leading-6 text-slate-400">روابط المباريات المضافة بجانب مصادر المشاهدة أعلاه، بتوقيت اليمن.</p>
            </div>
            <span className="text-xs text-slate-400">4 مباريات · رابطان لكل مباراة</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {TODAY_MATCHES.map((match) => (
              <article key={match.home + match.away} className="rounded-2xl border border-white/10 bg-[#0d1a2a] p-4 sm:p-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-emerald-300/10 px-2.5 py-1 text-[11px] font-bold text-emerald-200">{match.competition}</span>
                  <span className="inline-flex shrink-0 items-center gap-1 text-xs text-slate-300"><Clock3 size={13}/>{match.time}</span>
                </div>
                <div className="my-5 grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-center">
                  <h3 className="break-words text-sm font-black text-white sm:text-base">{match.home}</h3>
                  <span className="rounded-lg bg-white/[0.07] px-3 py-1.5 text-[11px] font-black text-slate-400">VS</span>
                  <h3 className="break-words text-sm font-black text-white sm:text-base">{match.away}</h3>
                </div>
                <div className="grid grid-cols-2 gap-2 border-t border-white/[0.08] pt-3">
                  {match.links.map((href, index) => (
                    <a key={href} href={href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-emerald-300 px-2 py-2.5 text-xs font-black text-[#06251c] transition hover:bg-emerald-200">
                      رابط المشاهدة {index + 1}<ExternalLink size={13}/>
                    </a>
                  ))}
                </div>
              </article>
            ))}
          </div>
          <p className="text-[11px] leading-6 text-slate-500">روابط خارجية مختصرة أُضيفت كما وردت؛ قد يتغير توفرها أو محتواها لدى المصدر الخارجي.</p>
        </section>

        <section className="relative isolate overflow-hidden rounded-2xl border border-sky-300/15 bg-[#101e30]">
          <img src="/branding/developer-banner.svg" alt="بانر تطوير دبوان لايف" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-75" />
          <div className="absolute inset-0 bg-gradient-to-l from-[#07111f]/95 via-[#07111f]/75 to-[#07111f]/25" />
          <div className="relative flex items-center gap-4 p-5 sm:p-7">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-sky-200/20 bg-sky-300/10 text-sky-200"><ShieldCheck size={24} /></span>
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] text-sky-200">DEVELOPER NOTE</p>
              <h2 className="mt-1 text-lg font-black text-white sm:text-xl">دبوان لايف — تجربة تتطور باستمرار</h2>
              <p className="mt-1 text-xs leading-6 text-slate-300 sm:text-sm">تصميم وتطوير المنصة بهدف جمع متابعة المباريات وخيارات المشاهدة في واجهة واحدة.</p>
            </div>
          </div>
        </section>

        <section className="relative isolate overflow-hidden rounded-3xl border border-emerald-300/15 bg-[#0b1828] p-5 sm:p-8">
          <div className="pointer-events-none absolute -left-20 -top-24 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="relative">
            <p className="text-[10px] font-bold tracking-[0.24em] text-emerald-300">ABOUT THE FOUNDER & DEVELOPER</p>
            <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">محمد غالب العصيمي</h2>
            <p className="mt-1 text-sm font-bold text-emerald-200">M.GH.AL · Full-Stack Developer · Software Engineer · IT Student</p>

            <div className="mt-6 space-y-4 text-sm leading-8 text-slate-300">
              <p>
                محمد غالب العصيمي، المعروف بهوية <strong className="text-white">M.GH.AL</strong>، مطور برمجيات شامل ومهتم بهندسة البرمجيات وبناء المنتجات الرقمية، وطالب تقنية معلومات في كلية المنار للعلوم والتكنولوجيا في اليمن. يركز على تحويل الأفكار والاحتياجات الواقعية إلى حلول برمجية عملية، من خلال الجمع بين هندسة الواجهات الأمامية، وتطوير الأنظمة الخلفية، وتصميم قواعد البيانات، وبناء واجهات API، وتحسين تجربة المستخدم.
              </p>
              <p>
                يهتم ببناء تطبيقات ويب متكاملة وأنظمة إدارية ومشاريع تقنية قابلة للتوسع والصيانة، مع عناية خاصة بتنظيم بنية المشروع، ووضوح تجربة الاستخدام، ودعم الواجهات العربية واتجاه الكتابة من اليمين إلى اليسار. ويعمل على تطوير مهاراته باستمرار من خلال المشاريع التطبيقية والتعلم التقني والتجربة العملية.
              </p>
              <p>
                تشمل مجالات عمله وتعلمه JavaScript وTypeScript وPython وDart وC#، وتطوير الواجهات باستخدام React وNext.js وTailwind CSS، وتطوير الخلفية باستخدام Node.js وواجهات REST وPrisma، والعمل مع PostgreSQL وPostGIS وSQLite وFirebase وSupabase، إلى جانب Flutter وأدوات Git وGitHub وDocker وVercel وTurborepo.
              </p>
              <p>
                ومن المشاريع المدرجة في ملفه العام: <strong className="text-white">دبوان لايف</strong> لتجربة رياضية وترفيهية موحدة، وWAYNAH لمنصة الاستكشاف والمعلومات المحلية، وHumanity System لإدارة الإجراءات والمعلومات المؤسسية، وYemen AI Platform لتطبيقات الذكاء الاصطناعي والبحث في المستندات، وM.GH.AL Content OS لسير عمل المحتوى العربي، وCipherSphere للتعلم التفاعلي في التشفير، وFocusFlow للإنتاجية، ومشاريع أنظمة الجداول الأكاديمية.
              </p>
              <p>
                ويضم سجله المهني والتعليمي المنشور اعتماد OpenJS Node.js Application Developer (JSNAD)، إلى جانب سجلات وشهادات تعليمية من Cisco Networking Academy وEdraak وورش EMC Shiraa. يمكن الاطلاع على روابط الملف العام وسجلات الاعتمادات من خلال الروابط أدناه.
              </p>
              <p className="text-slate-400">
                في دبوان لايف، يتولى تطوير تجربة المنصة وتنظيم أقسامها وواجهاتها، والعمل على تقديم تجربة واضحة لمتابعة كرة القدم والوصول إلى خيارات المشاهدة، مع مواصلة تحسين المنتج وتطويره.
              </p>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <a href="https://mghalaosimi-web.vercel.app/" target="_blank" rel="noopener noreferrer" className="flex min-h-14 items-center justify-between gap-3 rounded-xl border border-emerald-300/30 bg-emerald-300/10 px-4 py-3 text-sm font-black text-emerald-100 transition hover:bg-emerald-300/15">
                <span><span className="block">الموقع الرسمي والسيرة الرقمية</span><span className="mt-1 block text-[11px] font-normal text-emerald-100/70">mghalaosimi-web.vercel.app</span></span><ExternalLink size={17} />
              </a>
              <a href="https://github.com/mghalaosimi-web" target="_blank" rel="noopener noreferrer" className="flex min-h-14 items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white transition hover:bg-white/[0.08]">
                GitHub · المشاريع والأعمال البرمجية <ExternalLink size={16} />
              </a>
              <a href="https://www.linkedin.com/in/mohammed-alaosimi-038155443/" target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white transition hover:bg-white/[0.08]">
                LinkedIn · الملف المهني <ExternalLink size={16} />
              </a>
              <a href="https://www.credly.com/users/mohammed-ghaleb-al-aosimi" target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white transition hover:bg-white/[0.08]">
                Credly · الاعتمادات والشارات <ExternalLink size={16} />
              </a>
              <a href="https://www.tiktok.com/@m.gh.al.2006" target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white transition hover:bg-white/[0.08]">
                TikTok · الحساب الشخصي <ExternalLink size={16} />
              </a>
            </div>
            <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-6 text-slate-500">
              M.GH.AL — بناء البرمجيات بهدف واضح، ودقة في التنفيذ، وتعلم وتطوير مستمران.
            </p>
          </div>
        </section>
      </main>
    </FootballSectionLayout>
  );
}
