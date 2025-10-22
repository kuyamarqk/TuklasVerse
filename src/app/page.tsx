// src/app/page.tsx (Server Component)

import Hero from '@/component/Hero';
import HomeClient from '@/component/HomeComponent'; // Import the new client component

import {
  getHeroBackdrop,
  getTrendingMovies,
  getPopularMovies,
  getTmdbMovieGenres,
} from '@/lib/tmdb-api';

// This is the root page, which MUST be a Server Component to use async/await
export default async function Home() {
  const page = 1;

  // 1. Fetch ALL data on the server
  const hero = await getHeroBackdrop('movie'); 
  const trendingRaw = await getTrendingMovies('day', page);
  const popularRaw = await getPopularMovies(page);
  const genresData = await getTmdbMovieGenres();

  const initialTotalPages = Math.max(trendingRaw.total_pages, popularRaw.total_pages);
  
  return (
    <main className="font-sans bg-[#121212] text-[#FBE9E7] min-h-screen">
      {/* Static/Hero content rendered on the server */}
      <Hero
        backdropUrl={hero.backdropUrl}
        title={hero.title}
        overview={hero.overview}
        id={hero.id}
        type={hero.type}
      />

      {/* 2. Pass only data (not functions) to the Client Component */}
      <HomeClient
        initialTrending={trendingRaw.results}
        initialPopular={popularRaw.results}
        initialTotalPages={initialTotalPages}
        genres={genresData.genres}
      />
    </main>
  );
}