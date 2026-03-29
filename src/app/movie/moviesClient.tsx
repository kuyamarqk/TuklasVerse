'use client';

import { useState, useEffect, useCallback } from 'react';
import Section from '@/component/Section';
import FilterWrapper from '@/component/FilterWrapper';
import MovieGrid from '@/component/MovieGrid';
import PaginationWrapper from '@/component/PaginationWrapper';
import { mapToContentCard, TmdbMovie } from '@/lib/map-content';
import { ContentCardType } from '@/src/types';

interface MovieClientProps {
  initialTrending: TmdbMovie[];
  initialPopular: TmdbMovie[];
  initialTotalPages: number;
  genres: { id: number; name: string }[];
}

export default function MovieClient({
  initialTrending,
  initialPopular,
  initialTotalPages,
  genres,
}: MovieClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeGenre, setActiveGenre] = useState<string | null>(null);
  const [trendingMovie, setTrendingMovie] = useState<ContentCardType[]>(mapToContentCard(initialTrending));
  const [popularMovie, setPopularMovie] = useState<ContentCardType[]>(mapToContentCard(initialPopular));
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async (page: number, genreName: string | null) => {
    setIsLoading(true);
    try {
      // Find ID from name for the API call
      const genreObj = genres.find(g => g.name === genreName);
      const genreQuery = genreObj ? `&genre=${genreObj.id}` : '';
      
      const [trendingRes, popularRes] = await Promise.all([
        fetch(`/api/movies?type=trending&page=${page}${genreQuery}`).then(res => res.json()),
        fetch(`/api/movies?type=popular&page=${page}${genreQuery}`).then(res => res.json())
      ]);

      setTrendingMovie(mapToContentCard(trendingRes.results || []));
      setPopularMovie(mapToContentCard(popularRes.results || []));
      setTotalPages(Math.min(popularRes.total_pages || 500, 500));
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [genres]);

  useEffect(() => {
    if (currentPage !== 1 || activeGenre !== null) {
      fetchData(currentPage, activeGenre);
    }
  }, [currentPage, activeGenre, fetchData]);

  const handleGenreChange = (genre: string) => {
    setActiveGenre(prev => prev === genre ? null : genre);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className="mt-6">
        <FilterWrapper
          genres={genres}
          activeGenre={activeGenre}
          onGenreChange={handleGenreChange}
        />
      </div>

      <Section title={activeGenre ? `${activeGenre} (Page ${currentPage})` : `Browse (Page ${currentPage})`}>
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#FFAB91]"></div>
          </div>
        ) : (
          <MovieGrid popular={popularMovie} trending={trendingMovie} />
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