// src/app/tv-series/page.tsx
// This is a Server Component, no "use client" needed.
import React from 'react';
import { Metadata } from 'next';
import ContentCategoryRow from 'components/ContentCategoryRow';
import {
  getPopularTvSeries,
  getTmdbImageUrl,
  getTmdbTvGenres,
  getTmdbGenreNames,
  TmdbTvSeriesResult,
  TmdbGenre,
} from 'lib/tmdb-api';
import { ContentCardType } from 'types';

export const metadata: Metadata = {
  title: 'TV Series - TuklasVerse',
  description: 'Discover popular TV series, browse by genre, and find your next watch.',
};

const TVSeriesPage = async () => {
  let popularTvSeriesContent: ContentCardType[] = [];
  let allTmdbTvGenres: TmdbGenre[] = [];

  try {
    const [popularTvSeriesResponse, tvGenres] = await Promise.all([
      getPopularTvSeries(),
      getTmdbTvGenres(),
    ]);

    allTmdbTvGenres = tvGenres;

    popularTvSeriesContent = popularTvSeriesResponse.results.map((series: TmdbTvSeriesResult) => ({
      id: series.id,
      title: series.name,
      imageUrl: getTmdbImageUrl(series.poster_path),
      genre: getTmdbGenreNames(series.genre_ids, allTmdbTvGenres).join(', '),
      year: series.first_air_date ? new Date(series.first_air_date).getFullYear().toString() : 'N/A',
      type: 'tv-series',
      score: series.vote_average || undefined,
    })) as ContentCardType[];

  } catch (error) {
    console.error('Failed to fetch TV series data:', error);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-[#FBE9E7] bg-[#212121]">
        <p className="text-xl">Failed to load TV series content. Please check your API keys and internet connection.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#212121] text-[#FBE9E7] p-8">
      <h1 className="text-3xl font-bold mb-8">Popular TV Series</h1>

      {/* Fix: Use 'items' prop instead of 'content' if ContentCategoryRow expects that */}
      {popularTvSeriesContent.length > 0 ? (
        <ContentCategoryRow
          title="Most Popular"
          cards={popularTvSeriesContent}  // <-- correct prop name
/>
      ) : (
        <p className="text-center text-lg text-gray-400">No popular TV series found.</p>
      )}

      <div className="mt-12 text-center text-gray-400">
        <p>Explore more TV series categories coming soon!</p>
      </div>
    </div>
  );
};

export default TVSeriesPage;
