

import Hero from '@/component/Hero';

import {
  getHeroBackdrop,
  getTrendingMovies,
  getPopularMovies,
  getTmdbTvGenres,
} from '@/lib/tmdb-api';
import MovieClient from './moviesClient';

export default async function TvSeries() {
  const page = 1; // Initial page is always 1 for the server

  // Fetch all data on the server
  const hero = await getHeroBackdrop('movie');
  const trendingRaw = await getTrendingMovies('day', page);
  const popularRaw = await getPopularMovies(page);
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
      <MovieClient
        initialTrending={trendingRaw.results}
        initialPopular={popularRaw.results}
        initialTotalPages={initialTotalPages}
        genres={genresData.genres}
      />
    </main>
  );
}