// src/app/page.tsx
import Navbar from "@/component/Navbar";
import HeroBanner from "@/component/HeroBanner";
import MediaRow from "@/component/MediaRow";
import WatchHistoryRow from "@/component/WatchHistoryRow";
import {
  getTrending,
  getPopularMovies,
  getPopularTV,
  getTopRatedMovies,
  getTopRatedTV,
  Media,
} from "@/lib/tmdb";

export default async function HomePage() {
  let trendingResults: Media[] = [];
  let popularMoviesResults: Media[] = [];
  let popularTVResults: Media[] = [];
  let topRatedMoviesResults: Media[] = [];
  let topRatedTVResults: Media[] = [];

  try {
    // Parallel backend data loading via Promise.all with error fallback protection
    const [trending, popularMovies, popularTV, topRatedMovies, topRatedTV] = await Promise.all([
      getTrending("all", "week"),
      getPopularMovies(),
      getPopularTV(),
      getTopRatedMovies(),
      getTopRatedTV(),
    ]);

    trendingResults = trending?.results || [];
    popularMoviesResults = popularMovies?.results || [];
    popularTVResults = popularTV?.results || [];
    topRatedMoviesResults = topRatedMovies?.results || [];
    topRatedTVResults = topRatedTV?.results || [];
  } catch (error) {
    console.error("Failed to fetch homepage catalog feeds from TMDB:", error);
  }

  // Safely grab the very first item as the background hero spotlight item
  const hero = trendingResults[0];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-zinc-100">
      {/* Sticky Premium Blurring Glass Navigation Header */}
      <Navbar />

      <main className="pt-14">
        {/* Full-bleed Hero Banner Panel */}
        {hero && <HeroBanner media={hero} />}

        {/* Content Sliders Rows Container with Responsive Side Margins */}
        <div className="py-8 space-y-6 px-4 sm:px-8 md:px-12 lg:px-16 max-w-480 mx-auto">
          <WatchHistoryRow />
          
          {trendingResults.length > 1 && (
            <MediaRow
              title="Trending this week"
              items={trendingResults.slice(1, 15)}
            />
          )}
          
          {popularMoviesResults.length > 0 && (
            <MediaRow
              title="Popular movies"
              items={popularMoviesResults.slice(0, 15)}
              mediaType="movie"
            />
          )}
          
          {popularTVResults.length > 0 && (
            <MediaRow
              title="Popular TV shows"
              items={popularTVResults.slice(0, 15)}
              mediaType="tv"
            />
          )}
          
          {topRatedMoviesResults.length > 0 && (
            <MediaRow
              title="Top rated movies"
              items={topRatedMoviesResults.slice(0, 15)}
              mediaType="movie"
            />
          )}

          {topRatedTVResults.length > 0 && (
            <MediaRow
              title="Top rated TV shows"
              items={topRatedTVResults.slice(0, 15)}
              mediaType="tv"
            />
          )}
        </div>
      </main>
    </div>
  );
}