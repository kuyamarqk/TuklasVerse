"use client";

import { useState, useCallback, useRef } from "react";
import { Search, X } from "lucide-react";
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
      INPUT HANDLERS
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

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (abortRef.current) abortRef.current.abort();
    setLoading(false);
  };

  /* ---------------------------
      UI
  ---------------------------- */
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-zinc-100">
      <Navbar />

      <main className="pt-28 pb-16 px-8 max-w-7xl mx-auto selection:bg-violet-500/30">
        
        {/* SEARCH BAR CONTAINER */}
        <div className="relative max-w-xl mx-auto mb-16 group">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-violet-400 transition-colors"
          />

          <input
            type="text"
            value={query}
            onChange={onInput}
            autoFocus
            placeholder="Search movies, TV shows..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-12 py-3.5 text-base text-white placeholder:text-white/30 focus:border-violet-500 focus:bg-white/[0.07] outline-none transition-all shadow-lg shadow-black/20"
          />

          {/* ✨ Added interactive input reset button toggle */}
          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-white/30 hover:text-white rounded-lg hover:bg-white/10 transition-all cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* LOADING ANIMATION ACCENT */}
        {loading && (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* RESULTS DISPATCH BLOCKS */}
        {!loading && results.length > 0 && (
          <div className="animate-in fade-in-0 duration-500">
            <p className="text-xs text-white/40 uppercase tracking-widest font-semibold mb-6 select-none">
              {results.length} results found for &quot;{query}&quot;
            </p>

            {/* ✨ FIXED GRID: Fully responsive layout scaling to 6 columns on modern desktop widths */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-10 justify-items-center">
              {results.map((item) => (
                <MediaCard
                  key={`${item.id}-${item.media_type}`}
                  media={item}
                  mediaType={item.media_type as MediaType}
                />
              ))}
            </div>
          </div>
        )}

        {/* SEARCH TERM YIELDED NO RECORDS */}
        {!loading && query && results.length === 0 && (
          <p className="text-center text-white/30 text-sm py-24 tracking-wide animate-in fade-in duration-300">
            No results found for &quot;{query}&quot;. Try another title.
          </p>
        )}

        {/* EMPTY BASE INITIAL LANDING STATE */}
        {!query && (
          <p className="text-center text-white/20 text-xs uppercase tracking-widest font-medium py-32 select-none animate-in fade-in duration-300">
            Start typing to scan through movies and TV shows
          </p>
        )}
      </main>
    </div>
  );
}