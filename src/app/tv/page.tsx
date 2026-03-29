import Hero from '@/component/Hero';
import TvSeriesClient from './tvSeriesClient';

import {
  getHeroBackdrop,
  getTrendingTvSeries,
  getPopularTvSeries,
  getTmdbTvGenres, // ADD THIS IMPORT
} from '@/lib/tmdb-api';

export default async function TvSeries() {
  const page = 1;

  // Fetch data on the server
  const hero = await getHeroBackdrop('tv');
  const trendingRaw = await getTrendingTvSeries('day', page);
  const popularRaw = await getPopularTvSeries(page);
  
  // FIX: Fetch the genre LIST, not series by genre
  const genresData = await getTmdbTvGenres(); 
  
  const initialTotalPages = Math.max(trendingRaw.total_pages || 0, popularRaw.total_pages || 0);
  
  return (
    <main className="font-sans bg-[#121212] text-[#FBE9E7] min-h-screen">
      <Hero
        backdropUrl={hero.backdropUrl}
        title={hero.title}
        overview={hero.overview}
        id={hero.id}
        type={hero.type}
      />

      <TvSeriesClient
        initialTV={trendingRaw.results || []}
        initialPopular={popularRaw.results || []}
        initialTotalPages={initialTotalPages}
        genres={genresData.genres || []} // This will now work
      />
    </main>
  );
}