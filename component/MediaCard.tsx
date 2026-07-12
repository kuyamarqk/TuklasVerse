// src/components/MediaCard.tsx
import Link from "next/link";
import Image from "next/image";
import { Media, MediaType, getPosterUrl, getTitle, getYear } from "@/lib/tmdb";
import { Star } from "lucide-react";

type MediaCardProps = {
  media: Media;
  mediaType?: MediaType;
};

export default function MediaCard({ media, mediaType }: MediaCardProps) {
  // 1. Determine resolved media type safely (handling rows with explicitly defined type vs trending rows)
  const resolvedType = mediaType || (media.media_type === "tv" ? "tv" : "movie");
  
  // 2. Safely capture title, poster path image, and release year from TMDB utilities
  const title = getTitle(media);
  const posterUrl = getPosterUrl(media.poster_path, "w500");
  const year = getYear(media);

  return (
    <Link
      href={`/media/${resolvedType}/${media.id}`}
      className="group block w-36 sm:w-44 lg:w-48 transition-all duration-300"
    >
      {/* Aspect Ratio Image Container Box */}
      <div className="relative aspect-2/3 w-full rounded-xl overflow-hidden bg-white/5 border border-white/5 shadow-md group-hover:shadow-violet-500/10 group-hover:border-violet-500/20 transition-all duration-300 group-hover:scale-[1.03]">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={title}
            fill
            sizes="(max-w-640px) 144px, (max-w-1024px) 176px, 192px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          /* High-quality styled Fallback Placeholder UI for broken/missing posters */
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-linear-to-b from-zinc-900 to-[#0a0a0f] text-white/30">
            <span className="text-xs font-semibold tracking-tight line-clamp-3 mb-1 text-white/50">
              {title}
            </span>
            <span className="text-[10px] text-white/20 uppercase tracking-widest font-mono">
              No Poster
            </span>
          </div>
        )}

        {/* Hover Gradient Overlay with Quick Details Layer */}
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400 mb-0.5">
            <Star size={11} fill="currentColor" />
            <span>{media.vote_average ? media.vote_average.toFixed(1) : "N/A"}</span>
          </div>
          <p className="text-[10px] font-medium text-violet-400 uppercase tracking-wider">
            {resolvedType === "tv" ? "TV Series" : "Movie"}
          </p>
        </div>
      </div>

      {/* Media Typography Descriptions Below Poster */}
      <div className="mt-2.5 px-0.5 space-y-0.5 select-none">
        <h3 className="text-sm font-medium text-white/80 group-hover:text-violet-400 transition-colors truncate tracking-tight">
          {title}
        </h3>
        <p className="text-xs text-white/40 font-medium">
          {year ? year : "N/A"}
        </p>
      </div>
    </Link>
  );
}