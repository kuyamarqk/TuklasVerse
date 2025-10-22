// src/app/tv-series/TvSeriesClient.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import Section from '@/component/Section';
import FilterWrapper from '@/component/FilterWrapper';
import MovieGrid from '@/component/MovieGrid';
import PaginationWrapper from '@/component/PaginationWrapper';

import {
  getTrendingTvSeries,
  getPopularTvSeries,
} from '@/lib/tmdb-api';
import { mapTv, RelatedTvResponse, TmdbTv } from '@/lib/map-content'; // Assuming you define the necessary types here

// Define the interface for the props passed from the server
interface TvSeriesClientProps {
  initialTrending: TmdbTv[];
  initialPopular: TmdbTv[];
  initialTotalPages: number;
  genres: { id: number; name: string }[];
}

export default function TvSeriesClient({
  initialTrending,
  initialPopular,
  initialTotalPages,
  genres,
}: TvSeriesClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeGenre, setActiveGenre] = useState<string | null>(null);
  const [trendingTV, setTrendingTV] = useState(mapTv(initialTrending));
  const [popularTV, setPopularTV] = useState(mapTv(initialPopular));
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [isLoading, setIsLoading] = useState(false);

  // Function to fetch data based on filters/pagination (runs client-side)
  const fetchData = useCallback(async (page: number) => {
    setIsLoading(true);
    try {
      // NOTE: You'll need a different API function here that handles genre filtering.
      // For now, we'll just refetch the popular and trending lists for the new page.

      const trendingRaw: RelatedTvResponse = await getTrendingTvSeries('day', page);
      const popularRaw: RelatedTvResponse = await getPopularTvSeries(page);

      setTrendingTV(mapTv(trendingRaw.results));
      setPopularTV(mapTv(popularRaw.results));
      setTotalPages(Math.max(trendingRaw.total_pages, popularRaw.total_pages));
      setCurrentPage(page);
    } catch (error) {
      console.error('Failed to fetch filtered data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Effect to re-fetch when currentPage or activeGenre changes
  useEffect(() => {
    // Only re-fetch if not on the initial page load (page 1)
    if (currentPage !== 1 || activeGenre !== null) {
      fetchData(currentPage);
    }
  }, [currentPage, activeGenre, fetchData]);

  const handleGenreChange = (genre: string) => {
    setActiveGenre(genre === activeGenre ? null : genre); // Toggle genre
    setCurrentPage(1); // Reset page on filter change
  };



  return (
    <>
      <div className="mt-6">
        <FilterWrapper
          genres={genres}
          onGenreChange={handleGenreChange}
          
        />
      </div>

      <Section title={`Browse TV Series (Page ${currentPage})`} >
        {isLoading ? (
          <div className="text-center text-[#FFAB91] py-10">Loading series...</div>
        ) : (
          <MovieGrid popular={popularTV} trending={trendingTV} />
        )}
        <PaginationWrapper
          currentPage={currentPage}
          totalPages={totalPages}
          
        />
      </Section>
    </>
  );
}