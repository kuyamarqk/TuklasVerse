// src/app/page.tsx
import Hero from '@/component/Hero';
import HomeClient from '@/component/HomeComponent';

import {
  getHeroBackdrop,
  getTrendingMovies,
  getPopularMovies,
  getPopularTvSeries,
} from '@/lib/tmdb-api';

export default async function Home() {
  const page = 1;

  try {
    // 1. Fetch ALL data on the server with Promise.all for speed
    const [hero,, popularRaw, popularTVRaw] = await Promise.all([
      getHeroBackdrop('movie'),
      getTrendingMovies('day', page),
      getPopularMovies(page),
      getPopularTvSeries(page), // Add this call
      
    ]);

    // 2. Calculate total pages safely

    return (
      <main className="font-sans bg-[#121212] text-[#FBE9E7] min-h-screen">
        <Hero
          backdropUrl={hero?.backdropUrl || ''}
          title={hero?.title || 'Welcome to TuklasVerse'}
          overview={hero?.overview || ''}
          id={hero?.id}
          type={hero?.type}
        />

        <HomeClient
          // We pass .results and fallback to empty array [] to prevent .map() errors
          //initialTrending={trendingRaw?.results || []}
          initialPopular={popularRaw?.results || []}
          initialTV={popularTVRaw?.results || []} // Pass the TV data here
          genres={[]}          //initialTotalPages={initialTotalPages}
          
                />
      </main>
    );
  } catch (error) {
    console.error("Critical error loading Home Page:", error);
    return <div className="text-center py-20">Error loading movies. Please check your API key.</div>;
  }
}