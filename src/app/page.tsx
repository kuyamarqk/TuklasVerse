import Hero from "@/component/Hero";
import ContentRow from "@/component/ContentRow";
import Section from "@/component/Section";
import FilterWrapper from "@/component/FilterWrapper";

import {
  getHeroBackdrop,
  getTrendingMovies,
  getPopularMovies,
  getTrendingTvSeries,
  getPopularTvSeries,
  getTmdbMovieGenres,
} from "@/lib/tmdb-api";

import { mapMovies } from "@/lib/map-content";
const type = Math.random() > 0.5 ? 'movie' : 'tv';
const hero = await getHeroBackdrop(type);
const genresData = await getTmdbMovieGenres();
const trendingMovieRaw = await getTrendingMovies("day", 1);
const trendingMovies = mapMovies(trendingMovieRaw.results);
const popularMovieRaw = await getPopularMovies(1);
const popularMovies = mapMovies(popularMovieRaw.results);
const trendingTvRaw = await getTrendingTvSeries("day", 1);
const trendingTv = mapMovies(trendingTvRaw.results);
const popularTvRaw = await getPopularTvSeries(1);
const popularTV = mapMovies(popularTvRaw.results);

export default function Home() {
  return (
    <main className="font-sans bg-[#121212] text-[#FBE9E7] min-h-screen flex flex-col   sm:px-8 ">
      {/* Hero Section with Filter */}
      <div className="relative">
        <Hero
          backdropUrl={hero.backdropUrl}
          title={hero.title}
          overview={hero.overview}
          id={hero.id}
          type={hero.type}
        />

        {/* Floating Filter Bar */}
        
      </div>
	  <div className="mt-6">
          <FilterWrapper genres={genresData.genres} />
        </div>

      {/* Content Sections */}
      <Section title="Trending Movies" href="/movie?filter=trending">
        <div className=" ">
          <ContentRow items={trendingMovies} />
        </div>
      </Section>

      <Section title="Popular Movies" href="/movie?filter=popular">
        <div className="">
          <ContentRow items={popularMovies} />
        </div>
      </Section>

      <Section title="Trending TV" href="/tv?filter=trending">
        <div className="">
          <ContentRow items={trendingTv} />
        </div>
      </Section>

      <Section title="Popular TV" href="/tv?filter=popular">
        <div className="">
          <ContentRow items={popularTV} />
        </div>
      </Section>
    </main>
  );
}
