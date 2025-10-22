// src/app/tv-series/page.tsx (This is the file you originally provided, now refactored)

import Hero from '@/component/Hero';
import TvSeriesClient from './tvSeriesClient';

import {
  getHeroBackdrop,
  getTrendingTvSeries,
  getPopularTvSeries,
  getTmdbTvGenres,
} from '@/lib/tmdb-api';
// We no longer need mapTv here, as it's done in the client component,
// but we keep the type imports if mapTv is defined in a separate file.

export default async function TvSeries() {
  const page = 1; // Initial page is always 1 for the server

  // Fetch all data on the server
  const hero = await getHeroBackdrop('tv');
  const trendingRaw = await getTrendingTvSeries('day', page);
  const popularRaw = await getPopularTvSeries(page);
  const genresData = await getTmdbTvGenres();
  
  // No need to map the data here; pass raw data (or map it in the client component)
  const initialTotalPages = Math.max(trendingRaw.total_pages, popularRaw.total_pages);
  
  return (
    <main className="font-sans bg-[#121212] text-[#FBE9E7] min-h-screen">
      {/* 1. Hero is Static/Server-Rendered */}
      <Hero
        backdropUrl={hero.backdropUrl}
        title={hero.title}
        overview={hero.overview}
        id={hero.id}
        type={hero.type}
      />

      {/* 2. Pass all fetched data as props to the client component */}
      <TvSeriesClient
        initialTrending={trendingRaw.results}
        initialPopular={popularRaw.results}
        initialTotalPages={initialTotalPages}
        genres={genresData.genres}
      />
    </main>
  );
}