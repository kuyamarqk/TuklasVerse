"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Play, Server, Maximize2, Minimize2, FastForward } from "lucide-react";
import Image from "next/image";

export type SeasonDetail = {
  id: number;
  name: string;
  episode_count: number;
  season_number: number;
};

type VideoPlayerProps = {
  tmdbId: number;
  mediaType: "movie" | "tv";
  title: string;
  backdrop: string | null;
  season: number;
  episode: number;
  seasonsData?: SeasonDetail[];
};

const SERVERS = [
  { id: "vidsrc_cc", name: "Server 1 (CC)" },
  { id: "vidsrc_pro", name: "Server 2 (Pro)" },
  { id: "vidapi", name: "Server 3 (Club)" },
  { id: "smashy", name: "Server 4 (Smashy)" },
  { id: "ployan", name: "Server 5 (Ployan)" },
];

export default function VideoPlayer({
  tmdbId,
  mediaType,
  title,
  backdrop,
  season,
  episode,
  seasonsData,
}: VideoPlayerProps) {
  
  const pathname = usePathname();
  const [hasClickedPlay, setHasClickedPlay] = useState(false);
  const [activeServer, setActiveServer] = useState("vidsrc_cc");
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [activeSeasonTab, setActiveSeasonTab] = useState(season);
  const [localSeason, setLocalSeason] = useState(season);
  const [localEpisode, setLocalEpisode] = useState(episode);

  const validSeasons = seasonsData?.filter((s) => s.season_number > 0) || [];
  const selectedSeasonData = validSeasons.find((s) => s.season_number === activeSeasonTab);
  const totalEpisodes = selectedSeasonData ? selectedSeasonData.episode_count : 24;

  const getVideoSrc = () => {
    if (mediaType === "movie") {
      switch (activeServer) {
        case "vidsrc_pro": return `https://vidsrc.pro/embed/movie/${tmdbId}`;
        case "vidapi": return `https://vidapi.club/embed/movie/${tmdbId}`;
        case "smashy": return `https://embed.smashystream.xyz/playere.php?tmdb=${tmdbId}`;
        case "ployan": return `https://ployan.me/embed/movie/${tmdbId}`;
        case "vidsrc_cc":
        default: return `https://vidsrc.to/embed/movie/${tmdbId}`;
      }
    } else {
      switch (activeServer) {
        case "vidsrc_pro": return `https://vidsrc.pro/embed/tv/${tmdbId}/${localSeason}/${localEpisode}`;
        case "vidapi": return `https://vidapi.club/embed/tv/${tmdbId}/${localSeason}/${localEpisode}`;
        case "smashy": return `https://embed.smashystream.xyz/playere.php?tmdb=${tmdbId}&season=${localSeason}&episode=${localEpisode}`;
        case "ployan": return `https://ployan.me/embed/tv/${tmdbId}/${localSeason}/${localEpisode}`;
        case "vidsrc_cc":
        default: return `https://vidsrc.to/embed/tv/${tmdbId}/${localSeason}/${localEpisode}`;
      }
    }
  };

  const handleSelectionChange = (newSeason: number, newEpisode: number) => {
    setHasClickedPlay(false); 
    setLocalEpisode(newEpisode);
    setLocalSeason(newSeason);
    setActiveSeasonTab(newSeason); 

    const newUrl = `${pathname}?season=${newSeason}&episode=${newEpisode}`;
    window.history.pushState({ ...window.history.state, as: newUrl, url: newUrl }, "", newUrl);
    
    setTimeout(() => setHasClickedPlay(true), 50);
  };

  const handleNextEpisode = () => {
    if (mediaType !== "tv") return;

    const activeRunningSeasonData = validSeasons.find((s) => s.season_number === localSeason);
    const maxEpisodesInSeason = activeRunningSeasonData ? activeRunningSeasonData.episode_count : 24;

    if (localEpisode < maxEpisodesInSeason) {
      handleSelectionChange(localSeason, localEpisode + 1);
    } else {
      const nextSeasonNumber = localSeason + 1;
      const nextSeasonExists = validSeasons.some((s) => s.season_number === nextSeasonNumber);

      if (nextSeasonExists) {
        handleSelectionChange(nextSeasonNumber, 1);
      } else {
        alert("🎉 You have finished the final episode of the final season!");
      }
    }
  };

  useEffect(() => {
    const handleVideoMessage = (event: MessageEvent) => {
      if (typeof event.data === "string" && (event.data.includes("vidsrc_ended") || event.data.includes("video_ended"))) {
        handleNextEpisode();
      } else if (event.data?.event === "ended" || event.data?.type === "MEDIA_ENDED" || event.data === "ended") {
        handleNextEpisode();
      }
    };

    window.addEventListener("message", handleVideoMessage);
    return () => window.removeEventListener("message", handleVideoMessage);
  }, [localSeason, localEpisode, validSeasons]);

  return (
    /* ⭐ FIXED: Changed 'p-0!' to '!p-0' to keep compilation parser happy */
    <div className={`mx-auto px-4 sm:px-6 transition-all duration-300 ${isTheaterMode ? "max-w-none w-full !p-0" : "max-w-5xl"}`}>
      
      {/* ASPECT VIDEO WRAPPER FRAME */}
      <div className={`relative aspect-video w-full overflow-hidden bg-zinc-950 border border-white/10 shadow-2xl transition-all duration-300 ${isTheaterMode ? "rounded-none border-x-0" : "rounded-2xl"}`}>
        {!hasClickedPlay ? (
          <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-4 text-center">
            {backdrop ? (
              <Image
                src={backdrop}
                alt={title}
                fill
                priority
                sizes="(max-w: 1280px) 100vw, 1280px"
                className="object-cover opacity-30 blur-[2px]"
              />
            ) : (
              <div className="absolute inset-0 bg-zinc-900" />
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            <button
              onClick={() => setHasClickedPlay(true)}
              className="relative z-10 flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-violet-600 hover:bg-violet-500 text-white rounded-full transition-transform hover:scale-110 active:scale-95 shadow-xl shadow-violet-600/30 cursor-pointer"
            >
              <Play size={32} className="fill-white translate-x-0.5" />
            </button>
            <p className="relative z-10 mt-4 font-bold text-sm sm:text-base tracking-wide text-white/90 uppercase">
              {mediaType === "tv" ? `Play Season ${localSeason}, Episode ${localEpisode}` : "Click to Play Movie"}
            </p>
          </div>
        ) : (
          <iframe
            src={getVideoSrc()}
            className="w-full h-full bg-black overflow-hidden"
            allowFullScreen
            referrerPolicy="origin"
          />
        )}
      </div>

      {/* SERVER SWITCHER & CONTROL BAR */}
      <div className={`mt-4 p-4 bg-white/5 border border-white/5 flex flex-col md:flex-row gap-4 justify-between md:items-center ${isTheaterMode ? "mx-4 rounded-xl" : "rounded-xl"}`}>
        <div className="flex flex-wrap items-center justify-between w-full md:w-auto gap-4">
          <div className="flex items-center gap-2 text-zinc-400 font-semibold text-sm">
            <Server size={16} className="text-violet-400" />
            <span>Switch Streaming Server:</span>
          </div>
          
          {mediaType === "tv" && (
            <button
              onClick={handleNextEpisode}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-violet-600/20 text-violet-300 hover:bg-violet-600 hover:text-white border border-violet-500/30 transition-all cursor-pointer shadow-md"
              title="Skip to Next Episode"
            >
              <FastForward size={14} />
              <span>Next Episode</span>
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 justify-between md:justify-end w-full md:w-auto">
          <div className="flex flex-wrap gap-1.5">
            {SERVERS.map((srv) => (
              <button
                key={srv.id}
                onClick={() => {
                  setHasClickedPlay(false);
                  setActiveServer(srv.id);
                  setTimeout(() => setHasClickedPlay(true), 50);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                  activeServer === srv.id
                    ? "bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-600/20"
                    : "bg-zinc-900 border-white/10 text-zinc-400 hover:text-white hover:border-white/20"
                }`}
              >
                {srv.name}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsTheaterMode(!isTheaterMode)}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-white/10 bg-zinc-900 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            {isTheaterMode ? (
              <>
                <Minimize2 size={14} /> <span>Normal View</span>
              </>
            ) : (
              <>
                <Maximize2 size={14} /> <span>Theater Mode</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* TV EPISODE SELECTION MAP */}
      {mediaType === "tv" && validSeasons.length > 0 && (
        <div className={`mt-6 border-t border-white/5 pt-6 ${isTheaterMode ? "px-4" : ""}`}>
          <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide border-b border-white/5">
            {validSeasons.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSeasonTab(s.season_number)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border shrink-0 transition-all cursor-pointer ${
                  activeSeasonTab === s.season_number
                    ? "bg-zinc-100 border-white text-zinc-950"
                    : "bg-transparent border-white/10 text-zinc-400 hover:text-white hover:border-white/20"
                }`}
              >
                Season {s.season_number}
              </button>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {Array.from({ length: totalEpisodes }, (_, i) => i + 1).map((epNum) => {
              const isCurrentPlaying = localSeason === activeSeasonTab && localEpisode === epNum;
              return (
                <button
                  key={epNum}
                  onClick={() => handleSelectionChange(activeSeasonTab, epNum)}
                  className={`py-3 px-2 text-center rounded-xl font-bold border transition-all cursor-pointer flex flex-col justify-center items-center gap-0.5 ${
                    isCurrentPlaying
                      ? "bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-600/30 ring-1 ring-violet-400/50"
                      : "bg-zinc-900/50 border-white/5 text-zinc-400 hover:bg-zinc-900 hover:text-white hover:border-white/15"
                  }`}
                >
                  <span className="text-[10px] opacity-60 uppercase tracking-tight font-medium">Ep</span>
                  <span className="text-sm font-extrabold">{epNum}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}