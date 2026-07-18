// app/search/page.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Flame } from "lucide-react";
import Navbar from "@/component/Navbar";
import MediaCard from "@/component/MediaCard";
import GenreGrid from "@/component/GenreGrid";
import MediaRow from "@/component/MediaRow";
import { SearchResult, MediaType, Media, slugifyGenre } from "@/lib/tmdb";

// Keep a clean fallback suggestion search string array
const TRENDING_SUGGESTIONS = ["Superman", "The Odyssey", "Squid Game", "Moana"];

interface Genre {
  id: number;
  name: string;
}

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  /* --------------------------------------------------------------------------
      DYNAMIC STATE HOOKS (Media Items + Real-Time Genres)
  -------------------------------------------------------------------------- */
  const [trendingMovies, setTrendingMovies] = useState<Media[]>([]);
  const [trendingTV, setTrendingTV] = useState<Media[]>([]);
  const [movieGenres, setMovieGenres] = useState<Genre[]>([]);
  const [tvGenres, setTvGenres] = useState<Genre[]>([]);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  /* --------------------------------------------------------------------------
      FETCH ALL DASHBOARD ASSETS DYNAMICALLY
  -------------------------------------------------------------------------- */
  useEffect(() => {
    async function loadDashboardContent() {
      try {
        // Fetch trending content streams and genre configurations in parallel
        const [movieRes, tvRes, movieGenresRes, tvGenresRes] = await Promise.all([
          fetch("/api/trending?type=movie"),
          fetch("/api/trending?type=tv"),
          fetch("/api/genres?type=movie"),
          fetch("/api/genres?type=tv"),
        ]);

        if (movieRes.ok) {
          const data = await movieRes.json();
          setTrendingMovies((data.results ?? []).slice(0, 10));
        }
        if (tvRes.ok) {
          const data = await tvRes.json();
          setTrendingTV((data.results ?? []).slice(0, 10));
        }
        
        // Dynamically store the raw TMDB genres (slicing to avoid overloading layout rows)
        if (movieGenresRes.ok) {
          const data = await movieGenresRes.json();
          setMovieGenres((data.genres ?? []).slice(0, 8));
        }
        if (tvGenresRes.ok) {
          const data = await tvGenresRes.json();
          setTvGenres((data.genres ?? []).slice(0, 8));
        }
      } catch (err) {
        console.error("Dynamic dashboard hydration pipeline failed:", err);
      }
    }

    loadDashboardContent();
  }, []);

  /* --------------------------------------------------------------------------
      SEARCH ACTIONS & INPUT HANDLERS
  -------------------------------------------------------------------------- */
  const handleSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    if (abortRef.current) abortRef.current.abort();

    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
        signal: controller.signal,
      });
      const data = await res.json();
      const filtered = (data.results ?? []).filter(
        (item: SearchResult) => item.media_type !== "person" && item.poster_path
      );
      setResults(filtered);
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") console.error(err.message);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, []);

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => handleSearch(val), 400);
  };

  const handlePresetSearch = (term: string) => {
    setQuery(term);
    handleSearch(term);
  };

  // Genre clicks navigate to the real discover-by-genre page instead of
  // running a keyword text search on the genre's name.
  const handleGenreClick = (genreName: string, mediaType: MediaType) => {
    const slug = slugifyGenre(genreName);
    router.push(`/genre/${slug}/${mediaType}`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-zinc-100">
      <Navbar />

      <main className="pt-28 pb-16 px-4 md:px-8 max-w-7xl mx-auto selection:bg-violet-500/30">
        
        {/* SEARCH BAR CONTAINER */}
        <div className="relative max-w-xl mx-auto mb-16 group px-4 sm:px-0">
          <Search size={18} className="absolute left-8 sm:left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-violet-400 transition-colors" />
          <input
            type="text"
            value={query}
            onChange={onInput}
            autoFocus
            placeholder="Search movies, TV shows..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-12 py-3.5 text-base text-white focus:border-violet-500 focus:bg-white/[0.07] outline-none transition-all shadow-lg"
          />
          {query && (
            <button onClick={() => { setQuery(""); setResults([]); }} className="absolute right-8 sm:right-4 top-1/2 -translate-y-1/2 p-1 text-white/30 hover:text-white rounded-lg transition-all cursor-pointer">
              <X size={16} />
            </button>
          )}
        </div>

        {loading && (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* SEARCH OUTPUT PANEL */}
        {!loading && results.length > 0 && (
          <div className="animate-in fade-in-0 duration-500 px-4">
            <p className="text-xs text-white/40 uppercase tracking-widest font-semibold mb-6 select-none">
              {results.length} results found for &quot;{query}&quot;
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-10 justify-items-center">
              {results.map((item) => (
                <MediaCard key={`${item.id}-${item.media_type}`} media={item} mediaType={item.media_type as MediaType} />
              ))}
            </div>
          </div>
        )}

        {/* DEFAULT COMPREHENSIVE INTERACTIVE LANDING PANEL */}
        {!loading && !query && (
          <div id="genres" className="space-y-14 animate-in fade-in slide-in-from-bottom-4 duration-500 scroll-mt-24">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start px-6">
              
              {/* TRENDING LABELS MODULE */}
              <div className="lg:col-span-1">
                <div className="flex items-center gap-2 mb-2 text-sm font-semibold tracking-wide text-amber-400 uppercase select-none">
                  <Flame size={16} className="text-amber-500 animate-pulse" />
                  <span>Trending Now</span>
                </div>
                <hr className="border-white/10 mb-4" />
                <div className="flex flex-col gap-1">
                  {TRENDING_SUGGESTIONS.map((title) => (
                    <button key={title} onClick={() => handlePresetSearch(title)} className="text-left text-zinc-400 hover:text-violet-400 text-base transition-colors py-2 font-medium group flex items-center justify-between cursor-pointer border-b border-white/2">
                      <span>{title}</span>
                      <span className="text-xs text-white/0 group-hover:text-violet-400/60 transition-all transform translate-x-2 group-hover:translate-x-0">Search →</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* DYNAMIC MOVIE GENRES PANEL */}
              <div className="lg:col-span-2">
                {movieGenres.length > 0 ? (
                  <GenreGrid
                    title="🎬 Browse Movies"
                    mediaType="movie"
                    genres={movieGenres}
                    onGenreClick={(name) => handleGenreClick(name, "movie")}
                  />
                ) : (
                  <div className="h-32 bg-white/5 animate-pulse rounded-2xl" />
                )}
              </div>
            </div>

            {trendingMovies.length > 0 && (
              <MediaRow title="Trending Movies This Week" items={trendingMovies} mediaType="movie" />
            )}

            {/* DYNAMIC TV GENRES PANEL */}
            <div className="px-6">
              {tvGenres.length > 0 ? (
                <GenreGrid
                  title="📺 Browse TV Shows"
                  mediaType="tv"
                  genres={tvGenres}
                  onGenreClick={(name) => handleGenreClick(name, "tv")}
                />
              ) : (
                <div className="h-32 bg-white/5 animate-pulse rounded-2xl" />
              )}
            </div>

            {trendingTV.length > 0 && (
              <MediaRow title="Popular Shows on Air" items={trendingTV} mediaType="tv" />
            )}
          </div>
        )}
      </main>
    </div>
  );
}