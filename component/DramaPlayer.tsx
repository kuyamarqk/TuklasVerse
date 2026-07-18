// component/DramaPlayer.tsx
"use client";

import { useState } from "react";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import type { DramaEpisode } from "@/lib/dramabox";

type DramaPlayerProps = {
  bookId: string;
  title: string;
  initialEpisodes: DramaEpisode[];
};

export default function DramaPlayer({ bookId, title, initialEpisodes }: DramaPlayerProps) {
  const [episodes] = useState<DramaEpisode[]>(initialEpisodes);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasClickedPlay, setHasClickedPlay] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(
    initialEpisodes[0]?.qualities[0]?.url ?? null
  );
  const [loadingStream, setLoadingStream] = useState(false);
  const [streamError, setStreamError] = useState(false);

  const activeEpisode = episodes[activeIndex];

  const loadEpisode = async (index: number) => {
    setActiveIndex(index);
    setHasClickedPlay(false);
    setStreamError(false);

    const episode = episodes[index];
    const existingUrl = episode?.qualities?.[0]?.url;

    if (existingUrl) {
      // Episode list already came with a playable URL — no extra call needed.
      setVideoUrl(existingUrl);
      return;
    }

    // Fallback: fetch this specific episode's stream URL on demand.
    setLoadingStream(true);
    try {
      const res = await fetch(
        `/api/dramabox/stream?bookId=${encodeURIComponent(bookId)}&episode=${index + 1}`
      );
      if (!res.ok) {
        setStreamError(true);
        setVideoUrl(null);
        return;
      }
      const data: DramaEpisode = await res.json();
      setVideoUrl(data.qualities?.[0]?.url ?? null);
    } catch {
      setStreamError(true);
      setVideoUrl(null);
    } finally {
      setLoadingStream(false);
    }
  };

  const goToEpisode = (index: number) => {
    if (index < 0 || index >= episodes.length) return;
    loadEpisode(index);
  };

  return (
    <div className="max-w-md mx-auto px-4">
      {/* Vertical aspect player — short dramas are shot vertically */}
      <div className="relative aspect-9/16 w-full max-h-[80vh] mx-auto overflow-hidden bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl">
        {!hasClickedPlay ? (
          <button
            onClick={() => setHasClickedPlay(true)}
            className="absolute inset-0 w-full h-full flex flex-col items-center justify-center gap-3 bg-linear-to-b from-zinc-900 to-black cursor-pointer"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-violet-600 hover:bg-violet-500 text-white rounded-full transition-transform hover:scale-110 shadow-xl shadow-violet-600/30">
              <Play size={28} className="fill-white translate-x-0.5" />
            </div>
            <p className="text-sm font-bold text-white/80 uppercase tracking-wide px-6 text-center">
              {activeEpisode?.name || `Episode ${activeIndex + 1}`}
            </p>
          </button>
        ) : loadingStream ? (
          <div className="absolute inset-0 flex items-center justify-center text-white/40 text-sm">
            Loading episode...
          </div>
        ) : streamError || !videoUrl ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center px-6">
            <p className="text-white/50 text-sm">
              Couldn&apos;t load this episode right now.
            </p>
            <button
              onClick={() => loadEpisode(activeIndex)}
              className="text-xs font-semibold text-violet-400 hover:text-violet-300"
            >
              Try again
            </button>
          </div>
        ) : (
          <video
            key={videoUrl}
            src={videoUrl}
            controls
            autoPlay
            playsInline
            className="w-full h-full object-contain bg-black"
          />
        )}
      </div>

      {/* Prev / Next episode controls */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => goToEpisode(activeIndex - 1)}
          disabled={activeIndex === 0}
          className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
        >
          <ChevronLeft size={16} />
          Prev
        </button>

        <span className="text-xs font-bold text-white/40 uppercase tracking-widest">
          {activeIndex + 1} / {episodes.length}
        </span>

        <button
          onClick={() => goToEpisode(activeIndex + 1)}
          disabled={activeIndex === episodes.length - 1}
          className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Episode grid selector */}
      <div className="mt-6">
        <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">
          Episodes
        </h3>
        <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-64 overflow-y-auto pr-1">
          {episodes.map((ep, idx) => (
            <button
              key={ep.chapterId}
              onClick={() => loadEpisode(idx)}
              className={`py-2.5 px-1 text-center rounded-lg font-bold text-xs border transition-all cursor-pointer ${
                idx === activeIndex
                  ? "bg-violet-600 border-violet-500 text-white shadow-md shadow-violet-600/30"
                  : "bg-zinc-900/50 border-white/5 text-zinc-400 hover:bg-zinc-900 hover:text-white hover:border-white/15"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}