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
} from "@/lib/tmdb";

export default async function HomePage() {
  // Parallel backend data loading via Promise.all
  const [trending, popularMovies, popularTV, topRated] = await Promise.all([
    getTrending("all", "week"),
    getPopularMovies(),
    getPopularTV(),
    getTopRatedMovies(),
  ]);

  // Safely grab the very first item as the background hero spotlight item
  const hero = trending.results[0];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-zinc-100">
      {/* Sticky Premium Blurring Glass Navigation Header */}
      <Navbar />

      <main className="pt-14">
        {/* Full-bleed Hero Banner Panel (Stays wide and immersive) */}
        {hero && <HeroBanner media={hero} />}

        {/* ✨ Content Sliders Rows Container with Responsive Side Margins */}
        <div className="py-8 space-y-2 px-4 sm:px-8 md:px-12 lg:px-16 max-w-480 mx-auto">
          {/* Slices item indexes safely to prevent duplicating the Hero card inside the row */}
          <WatchHistoryRow />
          <MediaRow
            title="Trending this week"
            items={trending.results.slice(1, 15)}
          />
          
          <MediaRow
            title="Popular movies"
            items={popularMovies.results.slice(0, 15)}
            mediaType="movie"
          />
          
          <MediaRow
            title="Popular TV shows"
            items={popularTV.results.slice(0, 15)}
            mediaType="tv"
          />
          
          <MediaRow
            title="Top rated movies"
            items={topRated.results.slice(0, 15)}
            mediaType="movie"
          />
        </div>
      </main>
    </div>
  );
}