// src/components/MediaCard.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Media, MediaType, getPosterUrl, getTitle, getYear } from "@/lib/tmdb";
import { Star, Bookmark, BookmarkCheck } from "lucide-react";
import { useSupabase } from "@/lib/supabase/client";
import { isInWatchlist, addToWatchlist, removeFromWatchlist } from "@/lib/watchlist";

type MediaCardProps = {
  media: Media;
  mediaType?: MediaType;
};

export default function MediaCard({ media, mediaType }: MediaCardProps) {
  const supabase = useSupabase();
  const [saved, setSaved] = useState(false);
  const [loadingWatchlist, setLoadingWatchlist] = useState(true);

  const resolvedType = mediaType || (media.media_type === "tv" ? "tv" : "movie");
  const title = getTitle(media);
  const posterUrl = getPosterUrl(media.poster_path, "w500");
  const year = getYear(media);

  // Sync bookmark indicators dynamically 
  useEffect(() => {
    let isMounted = true;
    const fetchStatus = async () => {
      try {
        const exist = await isInWatchlist(supabase, media.id, resolvedType);
        if (isMounted) setSaved(exist);
      } catch (err) {
        console.error("Failed to parse card bookmark state:", err);
      } finally {
        if (isMounted) setLoadingWatchlist(false);
      }
    };
    fetchStatus();
    return () => { isMounted = false; };
  }, [supabase, media.id, resolvedType]);

  // Handle saving items directly on catalog panels
  const handleWatchlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (loadingWatchlist) return;

    setLoadingWatchlist(true);
    try {
      if (saved) {
        await removeFromWatchlist(supabase, media.id, resolvedType);
        setSaved(false);
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          alert("Please sign in to add items to your watchlist!");
          return;
        }
        await addToWatchlist(supabase, {
          user_id: user.id,
          tmdb_id: media.id,
          media_type: resolvedType,
          title,
          poster_path: media.poster_path,
        });
        setSaved(true);
      }
    } catch (err) {
      console.error("Card action intercept failure:", err);
    } finally {
      setLoadingWatchlist(false);
    }
  };

  return (
    <Link
      href={`/media/${resolvedType}/${media.id}`}
      className="group block w-36 sm:w-44 lg:w-48 transition-transform duration-300 ease-out"
    >
      <div className="relative aspect-2/3 w-full rounded-xl overflow-hidden bg-white/5 border border-white/5 shadow-md group-hover:shadow-[0_0_25px_rgba(124,58,237,0.25)] group-hover:border-violet-500/30 transition-all duration-300 ease-out group-hover:scale-[1.03] group-hover:-translate-y-1.5">
        
        {/* ✨ QUICK SAVE OVERLAY BOOKMARK BUTTON */}
        <button
          onClick={handleWatchlistToggle}
          disabled={loadingWatchlist}
          title={saved ? "Remove from watchlist" : "Add to watchlist"}
          className={`absolute top-2.5 right-2.5 z-30 p-2 rounded-xl backdrop-blur-md border transition-all duration-300 transform cursor-pointer ${
            saved 
              ? "bg-violet-600 border-violet-500 text-white opacity-100 scale-100 shadow-lg shadow-violet-600/30"
              : "bg-zinc-950/70 border-white/10 text-zinc-400 opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 hover:bg-zinc-900 hover:text-white"
          }`}
        >
          {saved ? <BookmarkCheck size={13} className="fill-white/10" /> : <Bookmark size={13} />}
        </button>

        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={title}
            fill
            sizes="(max-w-640px) 144px, (max-w-1024px) 176px, 192px"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-linear-to-b from-zinc-900 to-[#0a0a0f] text-white/30">
            <span className="text-xs font-semibold tracking-tight line-clamp-3 mb-1 text-white/50">{title}</span>
            <span className="text-[10px] text-white/20 uppercase tracking-widest font-mono">No Poster</span>
          </div>
        )}

        {/* Hover Details Panel */}
        <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400 mb-0.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75 ease-out">
            <Star size={11} fill="currentColor" />
            <span>{media.vote_average ? media.vote_average.toFixed(1) : "N/A"}</span>
          </div>
          <p className="text-[10px] font-bold text-violet-400 uppercase tracking-widest transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-100 ease-out">
            {resolvedType === "tv" ? "TV Series" : "Movie"}
          </p>
        </div>
      </div>

      {/* Title Details Lower Deck */}
      <div className="mt-2.5 px-0.5 space-y-0.5 select-none transform transition-transform duration-300 ease-out group-hover:-translate-y-0.5">
        <h3 className="text-sm font-semibold text-white/80 group-hover:text-violet-400 transition-colors truncate tracking-tight">
          {title}
        </h3>
        <p className="text-xs text-white/40 font-medium">
          {year ? year : "N/A"}
        </p>
      </div>
    </Link>
  );
}