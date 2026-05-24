"use client";

import { useState, useCallback, useRef } from "react";
import { Search } from "lucide-react";
import Navbar from "@/component/Navbar";
import MediaCard from "@/component/MediaCard";
import { SearchResult, MediaType } from "@/lib/tmdb";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  /* ---------------------------
      DEBOUNCE REFS
  ---------------------------- */
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  /* ---------------------------
      SEARCH FUNCTION
  ---------------------------- */
  const handleSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }

    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);

    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(q)}`,
        { signal: controller.signal }
      );

      const data = await res.json();

      const filtered: SearchResult[] = (data.results ?? []).filter(
        (item: SearchResult) =>
          item.media_type !== "person" && item.poster_path
      );

      setResults(filtered);
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") {
        console.error(err.message);
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  /* ---------------------------
      INPUT HANDLER
  ---------------------------- */
  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      handleSearch(val);
    }, 400);
  };

  /* ---------------------------
      UI
  ---------------------------- */
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-zinc-100">
      <Navbar />

      {/* Increased top padding and outer container max-width for cleaner margins */}
      <main className="pt-28 pb-16 px-8 max-w-6xl mx-auto">
        
        {/* SEARCH BAR CONTAINER (Added extra bottom margin) */}
        <div className="relative max-w-xl mx-auto mb-16">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
          />

          <input
            type="text"
            value={query}
            onChange={onInput}
            autoFocus
            placeholder="Search movies, TV shows..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-base text-white placeholder:text-white/30 focus:border-violet-500 outline-none transition-colors shadow-lg shadow-black/20"
          />
        </div>

        {/* LOADING ANIMATION ACCENT */}
        {loading && (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* RESULTS DISPATCH BLOCKS */}
        {!loading && results.length > 0 && (
          <>
            {/* Expanded tracking separation layout */}
            <p className="text-xs text-white/40 uppercase tracking-widest font-semibold mb-6 select-none">
              {results.length} results found for &quot;{query}&quot;
            </p>

            {/* ⭐ FIXED GRID: 2 columns on mobile, 3 on small tablets, and strictly 5 columns on desktop screens */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-6 gap-y-10 justify-items-center">
              {results.map((item) => (
                <MediaCard
                  key={`${item.id}-${item.media_type}`}
                  media={item}
                  mediaType={item.media_type as MediaType}
                />
              ))}
            </div>
          </>
        )}

        {/* SEARCH TERM YIELDED NO RECORDS */}
        {!loading && query && results.length === 0 && (
          <p className="text-center text-white/30 text-sm py-24 tracking-wide">
            No results found for &quot;{query}&quot;. Try another title.
          </p>
        )}

        {/* EMPTY BASE INITIAL LANDING STATE */}
        {!query && (
          <p className="text-center text-white/20 text-xs uppercase tracking-widest font-medium py-32">
            Start typing to scan through movies and TV shows
          </p>
        )}
      </main>
    </div>
  );
}