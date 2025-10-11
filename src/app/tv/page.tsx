import Hero from '@/component/Hero';
import Section from '@/component/Section';
import FilterWrapper from '@/component/FilterWrapper';
import MovieGrid from '@/component/MovieGrid';
import PaginationWrapper from '@/component/Pagination';

import {
  getHeroBackdrop,
  getTrendingTvSeries,
  getPopularTvSeries,
  getTmdbTvGenres,
} from '@/lib/tmdb-api';
import { mapTv } from '@/lib/map-content';

export default async function TvSeries() {
  const page = 1;

  const hero = await getHeroBackdrop('tv'); 
  const trendingRaw = await getTrendingTvSeries('day', page);
  const popularRaw = await getPopularTvSeries(page);
  const genresData = await getTmdbTvGenres();

  const trendingTV = mapTv(trendingRaw.results);
  const popularTV = mapTv(popularRaw.results);
  const totalPages = Math.max(trendingRaw.total_pages, popularRaw.total_pages);

  return (
    <main className="font-sans bg-[#121212] text-[#FBE9E7] min-h-screen">
      <Hero
        backdropUrl={hero.backdropUrl}
        title={hero.title}
        overview={hero.overview}
        id={hero.id}
        type={hero.type}
      />

      <div className="mt-6">
        <FilterWrapper genres={genresData.genres} />
      </div>

      <Section title="Browse TV Series" >
        <MovieGrid popular={popularTV} trending={trendingTV} />
        <PaginationWrapper currentPage={page} totalPages={totalPages} />
      </Section>
    </main>
  );
}
