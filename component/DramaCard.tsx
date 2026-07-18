// component/DramaCard.tsx
import Link from "next/link";
import Image from "next/image";
import { Flame } from "lucide-react";
import type { DramaItem } from "@/lib/dramabox";

type DramaCardProps = {
  drama: DramaItem;
};

export default function DramaCard({ drama }: DramaCardProps) {
  return (
    <Link
      href={`/bingehin/${drama.bookId}`}
      className="group block w-36 sm:w-44 lg:w-48 transition-transform duration-300 ease-out"
    >
      <div className="relative aspect-2/3 w-full rounded-xl overflow-hidden bg-white/5 border border-white/5 shadow-md group-hover:shadow-[0_0_25px_rgba(124,58,237,0.25)] group-hover:border-violet-500/30 transition-all duration-300 ease-out group-hover:scale-[1.03] group-hover:-translate-y-1.5">

        {drama.hotCode && (
          <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-zinc-950/70 backdrop-blur-md border border-white/10">
            <Flame size={10} className="text-orange-400 fill-orange-400" />
            <span className="text-[10px] font-bold text-white/90">{drama.hotCode}</span>
          </div>
        )}

        {drama.coverUrl ? (
          <Image
            src={drama.coverUrl}
            alt={drama.title}
            fill
            sizes="(max-w-640px) 144px, (max-w-1024px) 176px, 192px"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-linear-to-b from-zinc-900 to-[#0a0a0f] text-white/30">
            <span className="text-xs font-semibold tracking-tight line-clamp-3 mb-1 text-white/50">{drama.title}</span>
            <span className="text-[10px] text-white/20 uppercase tracking-widest font-mono">No Cover</span>
          </div>
        )}

        {/* Hover Details Panel */}
        <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
          <div className="flex items-center gap-1 text-[11px] font-bold text-white/70 mb-0.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75 ease-out">
            <span>{drama.episodeCount} Episodes</span>
          </div>
          {drama.tags[0] && (
            <p className="text-[10px] font-bold text-violet-400 uppercase tracking-widest transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-100 ease-out truncate">
              {drama.tags[0].name}
            </p>
          )}
        </div>
      </div>

      {/* Title Details Lower Deck */}
      <div className="mt-2.5 px-0.5 space-y-0.5 select-none transform transition-transform duration-300 ease-out group-hover:-translate-y-0.5">
        <h3 className="text-sm font-semibold text-white/80 group-hover:text-violet-400 transition-colors truncate tracking-tight">
          {drama.title}
        </h3>
        <p className="text-xs text-white/40 font-medium truncate">
          {drama.cast || "Short Drama"}
        </p>
      </div>
    </Link>
  );
}