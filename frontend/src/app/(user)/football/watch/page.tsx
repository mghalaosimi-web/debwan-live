"use client";

import FootballSectionLayout from "@/components/football/football-section-layout";
import { ExternalLink, Radio } from "lucide-react";

const SOURCE_URL = "https://syriashdab.com/";

export default function FootballWatchPage() {
  return (
    <FootballSectionLayout
      title="دبوان لايف"
      eyebrow="LIVE FOOTBALL"
      description="المشاهدة المباشرة من داخل دبوان لايف."
    >
      <main className="space-y-4">
        <section className="overflow-hidden rounded-2xl border border-dark-700 bg-dark-900">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dark-700 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300">
                <Radio size={19} />
              </span>
              <div>
                <h2 className="font-black text-white">البث والمباريات المباشرة</h2>
                <p className="text-xs text-dark-400">واجهة المشاهدة المضمنة</p>
              </div>
            </div>
            <a
              href={SOURCE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-dark-600 px-3 py-2 text-xs font-bold text-dark-100 transition hover:bg-dark-800"
            >
              فتح في نافذة مستقلة <ExternalLink size={14} />
            </a>
          </div>
          <div className="relative h-[78vh] min-h-[620px] w-full bg-black">
            <iframe
              title="سوريا لايف - المشاهدة المباشرة"
              src={SOURCE_URL}
              className="absolute inset-0 h-full w-full border-0 bg-black"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>
        <p className="text-xs leading-6 text-dark-400">
          إذا منع الموقع المصدر عرضه داخل إطار، أو منع تشغيل الفيديو داخل التضمين،
          فلن يمكن إصلاح ذلك من واجهة دبوان لايف؛ عندها يظل زر الفتح المستقل متاحاً،
          ونحتاج إذناً أو رابط تضمين رسمي من مالك المصدر. لا يتم تجاوز حماية البث.
        </p>
      </main>
    </FootballSectionLayout>
  );
}
