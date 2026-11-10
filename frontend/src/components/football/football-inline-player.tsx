"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Hls from "hls.js";
import { Radio, RefreshCw, Tv } from "lucide-react";
import { userAPI } from "@/lib/api";
import type { Channel, ChannelList, Stream } from "@/lib/types";
import { resolveUrl } from "@/lib/utils";

const SPORTS_CHANNEL_PATTERN =
  /sport|football|soccer|رياض|كرو|كرة|bein|ssc|ثمانية|الكأس|الرياضية|أبوظبي|دبي/i;

function isSportsChannel(channel: ChannelList): boolean {
  return channel.is_active &&
    SPORTS_CHANNEL_PATTERN.test(`${channel.name} ${channel.category?.name || ""}`);
}

export default function FootballInlinePlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [channels, setChannels] = useState<ChannelList[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [channel, setChannel] = useState<Channel | null>(null);
  const [loadingChannels, setLoadingChannels] = useState(true);
  const [loadingChannel, setLoadingChannel] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [error, setError] = useState("");

  const loadChannels = useCallback(async () => {
    setLoadingChannels(true);
    setError("");
    try {
      const response = await userAPI.getChannels(1, 100);
      const all = Array.isArray(response.data.data) ? response.data.data : [];
      const sports = all.filter(isSportsChannel);
      setChannels(sports);
      setSelectedId((current) => current && sports.some((item) => item.id === current)
        ? current
        : sports[0]?.id ?? null);
    } catch {
      setChannels([]);
      setSelectedId(null);
      setError("تعذر تحميل القنوات الرياضية من مكتبة دبوان لايف.");
    } finally {
      setLoadingChannels(false);
    }
  }, []);

  useEffect(() => {
    void loadChannels();
  }, [loadChannels]);

  useEffect(() => {
    if (!selectedId) {
      setChannel(null);
      return;
    }
    let cancelled = false;
    setLoadingChannel(true);
    setPlayerReady(false);
    setError("");
    void userAPI.getChannel(selectedId)
      .then((response) => {
        if (!cancelled) setChannel(response.data.data);
      })
      .catch(() => {
        if (!cancelled) {
          setChannel(null);
          setError("تعذر تحميل بيانات القناة المختارة.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingChannel(false);
      });
    return () => { cancelled = true; };
  }, [selectedId]);

  const bestStream = useMemo<Stream | null>(() => {
    const active = channel?.streams?.filter((stream) => stream.is_active) || [];
    return active.sort((a, b) => b.priority - a.priority)
      .find((stream) => stream.stream_format === "hls") || null;
  }, [channel]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !bestStream) return;

    const source = resolveUrl(bestStream.url);
    setPlayerReady(false);
    setError("");

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        liveSyncDurationCount: 3,
        liveMaxLatencyDurationCount: 6,
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
      });
      hlsRef.current = hls;
      hls.loadSource(source);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setPlayerReady(true);
        void video.play().catch(() => setPlayerReady(true));
      });
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (!data.fatal) return;
        if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          hls.recoverMediaError();
          return;
        }
        setPlayerReady(false);
        setError("تعذر تشغيل البث. قد يكون المصدر متوقفاً أو لا يسمح بالاتصال من المتصفح.");
        hls.destroy();
        hlsRef.current = null;
      });
      return () => {
        hls.destroy();
        if (hlsRef.current === hls) hlsRef.current = null;
      };
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      const onReady = () => {
        setPlayerReady(true);
        void video.play().catch(() => setPlayerReady(true));
      };
      const onError = () => {
        setPlayerReady(false);
        setError("تعذر تشغيل مصدر البث في هذا المتصفح.");
      };
      video.src = source;
      video.addEventListener("loadedmetadata", onReady);
      video.addEventListener("error", onError);
      video.load();
      return () => {
        video.removeEventListener("loadedmetadata", onReady);
        video.removeEventListener("error", onError);
        video.pause();
        video.removeAttribute("src");
        video.load();
      };
    }

    setError("المتصفح لا يدعم تشغيل HLS.");
  }, [bestStream]);

  useEffect(() => () => {
    hlsRef.current?.destroy();
    hlsRef.current = null;
  }, []);

  return (
    <section dir="rtl" className="space-y-4 rounded-3xl border border-dark-700 bg-dark-800 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-widest text-emerald-300">LIVE SPORTS PLAYER</p>
          <h2 className="mt-1 flex items-center gap-2 text-xl font-bold text-dark-100">
            <Radio size={20} className="text-emerald-300" />
            المشاهدة داخل دبوان لايف
          </h2>
          <p className="mt-1 text-sm text-dark-400">
            مشغّل مباشر داخل الصفحة للقنوات الرياضية المضافة إلى مكتبة القنوات والمصرّح بتشغيلها.
          </p>
        </div>
        <button type="button" onClick={() => void loadChannels()} disabled={loadingChannels}
          className="inline-flex items-center gap-2 rounded-xl border border-dark-600 px-3 py-2 text-sm text-dark-200 hover:bg-dark-700 disabled:opacity-50">
          <RefreshCw size={15} className={loadingChannels ? "animate-spin" : ""} />
          تحديث القنوات
        </button>
      </div>

      {loadingChannels ? (
        <div className="rounded-2xl bg-dark-900 p-8 text-center text-sm text-dark-300">جارٍ تحميل القنوات الرياضية...</div>
      ) : channels.length === 0 ? (
        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.05] p-5">
          <div className="flex items-center gap-2 font-bold text-amber-200"><Tv size={18}/> لا توجد قناة رياضية مهيأة للمشغّل بعد</div>
          <p className="mt-2 text-sm leading-7 text-dark-300">
            سيظهر الفيديو هنا مباشرة بعد إضافة قناة رياضية برابط HLS صالح ومصرّح بتشغيله من لوحة إدارة القنوات. لا نعرض بثاً وهمياً أو رابطاً غير مختبر.
          </p>
        </div>
      ) : (
        <>
          <label className="block space-y-2">
            <span className="text-xs font-semibold text-dark-300">اختر القناة الرياضية</span>
            <select value={selectedId ?? ""} onChange={(event) => setSelectedId(Number(event.target.value))}
              className="w-full rounded-xl border border-dark-700 bg-dark-900 px-3 py-3 text-sm text-dark-100">
              {channels.map((item) => <option key={item.id} value={item.id}>{item.name}{item.category?.name ? ` — ${item.category.name}` : ""}</option>)}
            </select>
          </label>

          <div className="relative aspect-video overflow-hidden rounded-2xl bg-black">
            {(!bestStream || loadingChannel || !playerReady) && !error && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/80 p-4 text-center text-sm text-dark-300">
                {loadingChannel ? "جارٍ تحميل القناة..." : !bestStream ? "لا يوجد رابط HLS نشط لهذه القناة." : "جارٍ تهيئة مشغّل الفيديو..."}
              </div>
            )}
            {error && <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/90 p-6 text-center text-sm text-red-200">{error}</div>}
            <video ref={videoRef} controls playsInline autoPlay className="h-full w-full bg-black object-contain" />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-dark-400">
            <span>{channel?.name || "القناة المختارة"}</span>
            <span>{bestStream ? "HLS · مشغّل داخلي" : "لا يوجد بث نشط"}</span>
          </div>
        </>
      )}
      <p className="text-[11px] leading-5 text-dark-500">
        النتائج والإحصاءات تأتي من مزودي البيانات، أما الفيديو فيُشغّل من مصدر البث الفعلي المضاف إلى مكتبة القنوات؛ لا يحوّل مزود النتائج بيانات المباراة إلى بث فيديو.
      </p>
    </section>
  );
}
