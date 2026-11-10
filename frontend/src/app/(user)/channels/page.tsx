"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Radio, ShieldCheck, Tv } from "lucide-react";
import { useTranslation } from "react-i18next";
import { userAPI } from "@/lib/api";
import type { ChannelList, Category } from "@/lib/types";
import { useToast } from "@/context/toast-context";
import Pagination from "@/components/ui/pagination";
import SearchInput from "@/components/ui/search-input";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { LIVE_CHANNELS_POLL_INTERVAL_MS } from "@/lib/constants";
import { getChannelUrl } from "@/lib/routes";

const PER_PAGE = 24;

const officialLiveSources = [
  {
    name: "قناة الجزيرة",
    description: "البث الحي لقناة الجزيرة، مع قنوات الجزيرة الآن والجزيرة مباشر والجزيرة الوثائقية من صفحة الناقل الرسمية.",
    category: "أخبار عربية",
    href: "https://www.aljazeera.net/video/live/",
    accent: "border-amber-400/25",
  },
  {
    name: "قناة العربية",
    description: "البث المباشر الرسمي لقناة العربية عبر موقعها.",
    category: "أخبار عربية",
    href: "https://www.alarabiya.net/live-stream",
    accent: "border-sky-400/25",
  },
  {
    name: "سكاي نيوز عربية",
    description: "صفحة البث المباشر الرسمية لقناة سكاي نيوز عربية.",
    category: "أخبار عربية",
    href: "https://www.skynewsarabia.com/livestream-%D8%A7%D9%84%D8%A8%D8%AB-%D8%A7%D9%84%D9%85%D8%A8%D8%A7%D8%B4%D8%B1",
    accent: "border-cyan-400/25",
  },
  {
    name: "منصات الشرق",
    description: "بوابة البث المباشر الرسمية لقنوات الشرق، وتشمل الشرق للأخبار والشرق Bloomberg وقنوات وثائقية وثقافية وراديو الشرق.",
    category: "أخبار ومنوعات",
    href: "https://now.asharq.com/live/",
    accent: "border-violet-400/25",
  },
];

export default function ChannelsPage() {
  const toast = useToast();
  const { t } = useTranslation();
  const toastRef = useRef(toast);
  toastRef.current = toast;
  const isMountedRef = useRef(true);

  const [channels, setChannels] = useState<ChannelList[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [liveChannelIds, setLiveChannelIds] = useState<Set<number>>(new Set());

  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await userAPI.getCategories("live");
      if (isMountedRef.current && data.data) setCategories(data.data);
    } catch {
      if (isMountedRef.current) toastRef.current.error(t("common.errorLoadingCategories"));
    }
  }, [t]);

  const fetchChannels = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await userAPI.getChannels(page, PER_PAGE, search || undefined, selectedCategory);
      if (isMountedRef.current) {
        setChannels(data.data || []);
        setTotalPages(data.meta.pages);
      }
    } catch {
      if (isMountedRef.current) toastRef.current.error(t("channels.errorLoadingChannels"));
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [page, selectedCategory, search, t]);

  const fetchLiveChannels = useCallback(async () => {
    try {
      const { data } = await userAPI.getLiveChannels();
      if (isMountedRef.current) setLiveChannelIds(new Set(data.data?.live_channel_ids || []));
    } catch (err) {
      if (isMountedRef.current) console.warn("Failed to fetch live channels:", err);
    }
  }, []);

  useEffect(() => { void fetchCategories(); }, [fetchCategories]);
  useEffect(() => { void fetchChannels(); }, [fetchChannels]);
  useEffect(() => {
    void fetchLiveChannels();
    const interval = setInterval(() => void fetchLiveChannels(), LIVE_CHANNELS_POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchLiveChannels]);

  useEffect(() => {
    document.title = `${t("nav.channels")} | DEBWAN LIVE`;
    return () => { isMountedRef.current = false; };
  }, [t]);

  const handleCategoryChange = useCallback((categoryId: number | undefined) => {
    setSelectedCategory(categoryId);
    setPage(1);
  }, []);

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  return (
    <div dir="rtl" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-widest text-primary-400">LIVE TV</p>
          <h1 className="mt-1 text-2xl font-bold text-dark-100">{t("channels.title")}</h1>
          <p className="mt-1 text-sm text-dark-400">القنوات المتاحة داخل مكتبتنا، ومصادر البث الرسمية التي يمكنك فتحها الآن.</p>
        </div>
        <div className="w-full sm:w-64">
          <SearchInput value={search} onChange={handleSearch} placeholder={t("channels.searchPlaceholder")} />
        </div>
      </div>

      {categories.length > 0 && (
        <div>
          <select
            value={selectedCategory ?? ""}
            onChange={(e) => handleCategoryChange(e.target.value ? Number(e.target.value) : undefined)}
            className="input-field w-full sm:w-72 text-sm cursor-pointer"
          >
            <option value="">{t("channels.allCategories")}</option>
            {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
        </div>
      )}

      {loading ? (
        <LoadingSpinner text={t("channels.loadingChannels")} />
      ) : channels.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {channels.map((channel) => (
              <Link
                key={channel.id}
                href={getChannelUrl(channel.id)}
                className="block rounded-xl border border-dark-700 bg-dark-800 p-4 transition-colors hover:border-primary-500/50"
                aria-label={`Watch channel: ${channel.name}`}
              >
                <div className="flex items-center gap-4">
                  <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-dark-700">
                    {channel.logo_url ? (
                      <Image src={channel.logo_url} alt={`Logo for ${channel.name}`} fill sizes="64px" className="object-contain" />
                    ) : <Tv size={28} className="text-dark-500" aria-hidden="true" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate font-semibold text-dark-100">{channel.name}</h3>
                      {liveChannelIds.has(channel.id) && (
                        <span className="flex shrink-0 items-center gap-1" aria-label="Channel is currently live">
                          <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" aria-hidden="true" />
                          <span className="text-[10px] font-bold uppercase text-red-400">{t("channels.live")}</span>
                        </span>
                      )}
                    </div>
                    {channel.category && <p className="truncate text-sm text-dark-400">{channel.category.name}</p>}
                    {channel.channel_number !== null && (
                      <span className="mt-1 inline-block rounded-full bg-dark-700 px-2 py-0.5 text-xs text-dark-300">
                        {t("channels.channelNumber")} {channel.channel_number}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8"><Pagination page={page} totalPages={totalPages} onPageChange={setPage} /></div>
        </>
      ) : (
        <section className="space-y-5">
          <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.05] p-4">
            <div className="flex items-center gap-2 font-bold text-amber-200">
              <ShieldCheck size={18} /> مكتبة القنوات الداخلية قيد التجهيز
            </div>
            <p className="mt-2 text-sm leading-7 text-dark-300">
              لم نضف بعد روابط بث قابلة للتشغيل داخل مشغل دبوان لايف. حتى لا نعرض قنوات وهمية، وفرنا هنا مصادر رسمية يمكن فتحها مباشرة، وسنضيف المشغل الداخلي للقنوات التي تسمح شروط أصحابها بالتضمين.
            </p>
          </div>
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Radio size={20} className="text-emerald-300" />
              <h2 className="text-xl font-bold text-dark-100">مصادر بث رسمية متاحة</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {officialLiveSources.map((source) => (
                <article key={source.name} className={`rounded-2xl border ${source.accent} bg-dark-800 p-5`}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-dark-700 px-3 py-1 text-xs text-dark-300">{source.category}</span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-300"><span className="h-2 w-2 rounded-full bg-emerald-400" /> مصدر رسمي</span>
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-dark-100">{source.name}</h3>
                  <p className="mt-2 min-h-14 text-sm leading-7 text-dark-300">{source.description}</p>
                  <a
                    href={source.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-primary-400"
                  >
                    افتح البث الرسمي <ExternalLink size={16} />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
