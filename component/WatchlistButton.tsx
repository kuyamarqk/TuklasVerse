"use client";

import { useEffect, useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useSupabase } from "@/lib/supabase/client";
import {
  addToWatchlist,
  removeFromWatchlist,
  isInWatchlist,
} from "@/lib/watchlist";
import type { MediaType } from "@/lib/tmdb";

type Props = {
  tmdbId: number;
  mediaType: MediaType; // ✅ now ONLY "movie" | "tv"
  title: string;
  posterPath: string | null;
};

export default function WatchlistButton({
  tmdbId,
  mediaType,
  title,
  posterPath,
}: Props) {
  const supabase = useSupabase();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const check = async () => {
      try {
        const exists = await isInWatchlist(
          supabase,
          tmdbId,
          mediaType
        );

        if (mounted) setSaved(exists);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    check();

    return () => {
      mounted = false;
    };
  }, [supabase, tmdbId, mediaType]);

  const toggle = async () => {
    if (loading) return;

    setLoading(true);

    try {
      if (saved) {
        await removeFromWatchlist(supabase, tmdbId, mediaType);
        setSaved(false);
      } else {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        await addToWatchlist(supabase, {
          user_id: user.id,
          tmdb_id: tmdbId,
          media_type: mediaType,
          title,
          poster_path: posterPath,
        });

        setSaved(true);
      }
    } catch (err) {
      console.error("Watchlist error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 ${
        saved
          ? "bg-violet-600 hover:bg-violet-500 text-white"
          : "bg-white/10 border border-white/10 hover:bg-white/15 text-white"
      }`}
    >
      {saved ? (
        <>
          <BookmarkCheck size={15} />
          Saved to my list
        </>
      ) : (
        <>
          <Bookmark size={15} />
          Add to my list
        </>
      )}
    </button>
  );
}