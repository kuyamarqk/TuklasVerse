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

  const handleRemove = async (item: WatchlistItem) => {
    await removeFromWatchlist(supabase, item.tmdb_id, item.media_type);
    setItems((prev) => prev.filter((i) => i.id !== item.id));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />

      <main className="pt-20 px-6 max-w-5xl mx-auto">
        <h1 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Bookmark size={18} className="text-violet-400" />
          My list
        </h1>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="text-center py-20">
            <p className="text-white/30 text-sm mb-3">Your list is empty</p>
            <Link
              href="/"
              className="text-violet-400 text-sm hover:text-violet-300 transition-colors"
            >
              Browse movies and shows
            </Link>
          </div>
        )}

        {!loading && items.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4">
            {items.map((item) => {
              const poster = getPosterUrl(item.poster_path, "w342");
              return (
                <div key={item.id} className="group relative">
                  <Link href={`/media/${item.media_type}/${item.tmdb_id}`}>
                    <div className="aspect-2/3 rounded-xl overflow-hidden bg-white/5 border border-white/5 group-hover:border-violet-500/50 transition-colors">
                      {poster ? (
                        <Image
                          src={poster}
                          alt={item.title}
                          fill
                          sizes="160px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/20 text-xs p-2 text-center">
                          {item.title}
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-medium text-white/80 truncate mt-2">
                      {item.title}
                    </p>
                    <p className="text-[10px] text-white/30 uppercase tracking-wide mt-0.5">
                      {item.media_type === "tv" ? "TV" : "Film"}
                    </p>
                  </Link>

                  <button
                    onClick={() => handleRemove(item)}
                    className="absolute top-2 left-2 p-1.5 bg-black/60 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}