// src/components/WatchHistoryRow.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { History, X } from "lucide-react";
import { useSupabase } from "@/lib/supabase/client";
import { getWatchHistory, WatchlistItem } from "@/lib/watchlist";
import { getPosterUrl } from "@/lib/tmdb";

export default function WatchHistoryRow() {
  const supabase = useSupabase();
  const [historyItems, setHistoryItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return; // Guard for guests

      const data = await getWatchHistory(supabase, 14); // Grab the last 14 items
      setHistoryItems(data);
    } catch (err) {
      console.error("Error loading watch history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [supabase]);

  // Optional: Function to clear a single item from watch history directly from the row
  const handleClearSingle = async (e: React.MouseEvent, item: WatchlistItem) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await supabase
        .from("watch_history")
        .delete()
        .eq("id", item.id);
        
      setHistoryItems((prev) => prev.filter((i) => i.id !== item.id));
    } catch (err) {
      console.error("Failed to remove history item:", err);
    }
  };

  if (loading || historyItems.length === 0) return null;

  return (
    <section className="space-y-4 py-4 select-none">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <History size={18} className="text-violet-400 animate-pulse" />
          <h2 className="text-lg font-bold tracking-tight text-white/90">
            Continue Watching
          </h2>
        </div>
      </div>

      {/* Horizontal Scroll Layout Container */}
      <div className="flex gap-4 overflow-x-auto pb-4 pt-1 px-1 scrollbar-hide no-scrollbar snap-x snap-mandatory scroll-smooth">
        {historyItems.map((item) => {
          const posterUrl = getPosterUrl(item.poster_path, "w342");

          return (
            <Link
              key={item.id}
              href={`/media/${item.media_type}/${item.tmdb_id}`}
              className="group relative block w-28 sm:w-36 shrink-0 snap-start transition-transform duration-300 ease-out"
            >
              {/* Premium Aspect Box with the signature Violet Glow Aura & Translate Lift */}
              <div className="relative aspect-2/3 w-full rounded-xl overflow-hidden bg-white/5 border border-white/5 shadow-md group-hover:shadow-[0_0_20px_rgba(124,58,237,0.2)] group-hover:border-violet-500/30 transition-all duration-300 ease-out group-hover:scale-[1.03] group-hover:-translate-y-1.5">
                
                {/* Clear Item Cross Button Overlay */}
                <button
                  onClick={(e) => handleClearSingle(e, item)}
                  title="Remove from history"
                  className="absolute top-2 right-2 z-30 p-1.5 bg-zinc-950/80 backdrop-blur-md border border-white/10 text-zinc-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 transform -translate-y-1 group-hover:translate-y-0 hover:bg-red-500 hover:text-white hover:border-red-400 shadow-md cursor-pointer"
                >
                  <X size={10} />
                </button>

                {posterUrl ? (
                  <Image
                    src={posterUrl}
                    alt={item.title}
                    fill
                    sizes="(max-w-640px) 112px, 144px"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center p-3 text-center bg-linear-to-b from-zinc-900 to-[#0a0a0f] text-white/20 text-[10px] font-semibold line-clamp-3">
                    {item.title}
                  </div>
                )}

                {/* Bottom shading for structural balance */}
                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Text Meta Container */}
              <div className="mt-2 px-0.5 space-y-0.5 transform transition-transform duration-300 ease-out group-hover:-translate-y-0.5">
                <h3 className="text-xs font-semibold text-white/80 group-hover:text-violet-400 transition-colors truncate tracking-tight">
                  {item.title}
                </h3>
                <p className="text-[10px] text-white/30 uppercase font-medium tracking-wider">
                  {item.media_type === "tv" ? "TV Series" : "Movie"}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}