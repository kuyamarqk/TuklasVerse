'use client';

import { useState, useEffect, useCallback } from 'react';
import Section from '@/component/Section';
import FilterWrapper from '@/component/FilterWrapper';
import MovieGrid from '@/component/MovieGrid';
import PaginationWrapper from '@/component/PaginationWrapper';

import { mapToContentCard, TmdbMovie } from '@/lib/map-content';
import { ContentCardType } from '@/src/types';

interface HomeClientProps {
  initialTrending: TmdbMovie[];
  initialPopular: TmdbMovie[];
  initialTotalPages: number;
  genres: { id: number; name: string }[];
}

export default function HomeClient({
  initialTrending,
  initialPopular,
  initialTotalPages,
  genres,
}: HomeClientProps) {
  // --- State ---
  const [currentPage, setCurrentPage] = useState(1);
  const [activeGenre, setActiveGenre] = useState<string | null>(null);
  const [trendingMovies, setTrendingMovies] = useState<ContentCardType[]>(mapToContentCard(initialTrending));
  const [popularMovies, setPopularMovies] = useState<ContentCardType[]>(mapToContentCard(initialPopular));
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [isLoading, setIsLoading] = useState(false);

  // --- Data Fetching ---
  const fetchData = useCallback(async (page: number, genreName: string | null) => {
    setIsLoading(true);
    try {
      // Find the ID for the API call
      const genreObj = genres.find(g => g.name === genreName);
      const genreQuery = genreObj ? `&genre=${genreObj.id}` : '';
      
      const [trendingRes, popularRes] = await Promise.all([
        fetch(`/api/movies?type=trending&page=${page}${genreQuery}`).then(res => res.json()),
        fetch(`/api/movies?type=popular&page=${page}${genreQuery}`).then(res => res.json())
      ]);

      setTrendingMovies(mapToContentCard(trendingRes.results || []));
      setPopularMovies(mapToContentCard(popularRes.results || []));
      setTotalPages(Math.min(popularRes.total_pages || 500, 500));
    } catch (error) {
      console.error('Failed to update movies:', error);
    } finally {
      setIsLoading(false);
    }
  }, [genres]);

  // --- Handlers ---
  
  // FIXED: Added handlePageChange logic
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleGenreChange = useCallback((genre: string) => {
    // Toggle genre: if clicking same one, reset to null
    setActiveGenre(prev => (prev === genre ? null : genre));
    setCurrentPage(1); // Reset to page 1 on filter change
  }, []);

  // --- Side Effects ---
  useEffect(() => {
    // Only fetch if we are NOT on the initial server-side state
    if (currentPage !== 1 || activeGenre !== null) {
      fetchData(currentPage, activeGenre);
    }
  }, [currentPage, activeGenre, fetchData]);

  return (
    <>
      <div className="mt-6">
        <FilterWrapper
          genres={genres}
          activeGenre={activeGenre}
          onGenreChange={handleGenreChange}
        />
      </div>

      <Section title={activeGenre ? `Genre: ${activeGenre}` : "Trending Movies"}>
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#FFAB91]"></div>
          </div>
        ) : (
          <MovieGrid popular={popularMovies} trending={trendingMovies} />
        )}

        <PaginationWrapper
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange} 
        />
      </Section>
    </>
  );
}