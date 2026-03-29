// src/app/tv-series/TvSeriesClient.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import Section from '@/component/Section';
import FilterWrapper from '@/component/FilterWrapper';
import MovieGrid from '@/component/MovieGrid';
import PaginationWrapper from '@/component/PaginationWrapper';

import { mapToContentCard, TmdbTv } from '@/lib/map-content';

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
  const [trendingTV, setTrendingTV] = useState(mapToContentCard(initialTrending));
  const [popularTV, setPopularTV] = useState(mapToContentCard(initialPopular));
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [isLoading, setIsLoading] = useState(false);

  // Function to fetch data based on filters/pagination (runs client-side)
const fetchData = useCallback(async (page: number) => {
  setIsLoading(true);
  try {
    // 1. Call your INTERNAL API (which has access to the key)
    const [trendingRes, popularRes] = await Promise.all([
      fetch(`/api/tv?type=trending&page=${page}`).then(res => res.json()),
      fetch(`/api/tv?type=popular&page=${page}`).then(res => res.json())
    ]);

    // 2. Map the results just like before
    if (trendingRes.results && popularRes.results) {
      setTrendingTV(mapToContentCard(trendingRes.results));
      setPopularTV(mapToContentCard(popularRes.results));
      setTotalPages(Math.min(popularRes.total_pages, 500));
    }
  } catch (error) {
    console.error('Failed to fetch data:', error);
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
          onGenreChange={handleGenreChange} activeGenre={null}          
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
  onPageChange={(page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }}
/>
      </Section>
    </>
  );
}