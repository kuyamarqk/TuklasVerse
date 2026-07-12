"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Bookmark } from "lucide-react";
import Navbar from "@/component/Navbar";
import { useSupabase } from "@/lib/supabase/client";
import { getWatchlist, removeFromWatchlist, WatchlistItem } from "@/lib/watchlist";
import { getPosterUrl } from "@/lib/tmdb";

export default function WatchlistPage() {
  const supabase = useSupabase();
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWatchlist(supabase)
      .then(setItems)
      .finally(() => setLoading(false));
  }, [supabase]);

  const handleRemove = async (e: React.MouseEvent, item: WatchlistItem) => {
    // 💡 Prevent the click from triggering the Link wrapper component underneath
    e.preventDefault();
    e.stopPropagation();
    
    await removeFromWatchlist(supabase, item.tmdb_id, item.media_type);
    setItems((prev) => prev.filter((i) => i.id !== item.id));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-zinc-100">
      <Navbar />

      <main className="pt-24 px-6 max-w-7xl mx-auto selection:bg-violet-500/30">
        
        {/* INTERFACE WATCHLIST TITLE */}
        <header className="mb-10 border-b border-white/5 pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight bg-linear-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent flex items-center gap-3">
              <Bookmark size={28} className="text-violet-500 fill-violet-500/10" />
              My List
            </h1>
            <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wider font-semibold">
              Saved Media Profiles • {items.length} {items.length === 1 ? 'Item' : 'Items'}
            </p>
          </div>
        </header>

        {/* LOADING INDICATOR SKELETON */}
        {loading && (
          <div className="flex justify-center py-40">
            <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* EMPTY STATE BLOCK */}
        {!loading && items.length === 0 && (
          <div className="text-center py-32 border border-dashed border-white/5 rounded-2xl bg-white/1">
            <p className="text-white/30 text-sm mb-4">Your personalized media list is currently empty.</p>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-violet-600/10 transition-all cursor-pointer"
            >
              Browse Movies & Shows
            </Link>
          </div>
        )}

        {/* RESPONSIVE RENDERING ENGINE GRID */}
        {!loading && items.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4">
            {items.map((item) => {
              const poster = getPosterUrl(item.poster_path, "w342");
              return (
                <div key={item.id} className="group block relative w-full transition-transform duration-300 ease-out">
                  
                  <Link href={`/media/${item.media_type}/${item.tmdb_id}`} className="no-underline">
                    
                    {/* ✨ Aspect Ratio Box: Matches the precise layout engine of MediaCard */}
                    <div className="relative aspect-2/3 w-full rounded-xl overflow-hidden bg-white/5 border border-white/5 shadow-md group-hover:shadow-[0_0_25px_rgba(124,58,237,0.25)] group-hover:border-violet-500/30 transition-all duration-300 ease-out group-hover:scale-[1.03] group-hover:-translate-y-1.5">
                      {poster ? (
                        <Image
                          src={poster}
                          alt={item.title}
                          fill
                          sizes="(max-w-640px) 144px, (max-w-1024px) 176px, 192px"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-linear-to-b from-zinc-900 to-[#0a0a0f] text-white/30">
                          <span className="text-xs font-semibold tracking-tight line-clamp-3 mb-1 text-white/50">
                            {item.title}
                          </span>
                        </div>
                      )}

                      {/* Pure Shadow Gradient Underlay for Card Balance */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* ✨ REFINED TRASH BUTTON: Tucked into the top right, matching standard design semantics */}
                      <button
                        onClick={(e) => handleRemove(e, item)}
                        title="Remove from list"
                        className="absolute top-2.5 right-2.5 z-20 p-2 bg-zinc-950/80 backdrop-blur-md border border-white/10 rounded-xl text-zinc-400 opacity-0 group-hover:opacity-100 transition-all duration-200 transform -translate-y-1 group-hover:translate-y-0 hover:bg-red-500 hover:text-white hover:border-red-400 shadow-xl cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    {/* Media Typography Descriptions Below Poster */}
                    <div className="mt-2.5 px-0.5 space-y-0.5 select-none transform transition-transform duration-300 ease-out group-hover:-translate-y-0.5">
                      <h3 className="text-sm font-semibold text-white/80 group-hover:text-violet-400 transition-colors truncate tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-xs text-white/40 font-medium uppercase tracking-wider">
                        {item.media_type === "tv" ? "TV Series" : "Movie"}
                      </p>
                    </div>

                  </Link>

                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}