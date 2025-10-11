// app/movie/page.tsx
import Hero from '@/component/Hero';
import Section from '@/component/Section';
import FilterWrapper from '@/component/FilterWrapper';
import MovieGrid from '@/component/MovieGrid';
import PaginationWrapper from '@/component/Pagination';

import {
  getHeroBackdrop,
  getTrendingMovies,
  getPopularMovies,
  getTmdbMovieGenres,
} from '@/lib/tmdb-api';
import { mapMovies } from '@/lib/map-content';

interface PageProps {
  searchParams: { page?: string };
}

export default async function Movie({ searchParams }: PageProps) {
  const { page: rawPage } = await searchParams;
  const page = Math.max(Number(rawPage) || 1, 1);

  const [hero, trendingRaw, popularRaw, genresData] = await Promise.all([
    getHeroBackdrop('movie'),
    getTrendingMovies('day', page),
    getPopularMovies(page),
    getTmdbMovieGenres(),
  ]);

  const trendingMovies = mapMovies(trendingRaw.results);
  const popularMovies = mapMovies(popularRaw.results);
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

      <Section title="Browse Movies">
        <MovieGrid popular={popularMovies} trending={trendingMovies} />
        <PaginationWrapper currentPage={page} totalPages={totalPages} />
      </Section>
    </main>
  );
}
