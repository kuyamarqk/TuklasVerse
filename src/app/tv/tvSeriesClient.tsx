'use client';

import { useState, useEffect, useCallback } from 'react';
import Section from '@/component/Section';
import MovieGrid from '@/component/MovieGrid';
import { ContentCardType } from '@/src/types';
import PaginationWrapper from '@/component/PaginationWrapper';
import { mapToContentCard, TmdbTv } from '@/lib/map-content';
import { multiSearch, getTmdbTvGenres } from '@/lib/tmdb-api';
import FilterBar from '@/component/FilterBar';

interface TvSeriesClientProps {
  initialTV: TmdbTv[]; 
  initialPopular: TmdbTv[];
  initialTotalPages: number;
  genres: { id: number; name: string }[];
}

export default function TvSeriesClient({
  initialTV,
  initialPopular,
  initialTotalPages,
  genres,
}: TvSeriesClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeGenre, setActiveGenre] = useState<string | null>(null);
  
  const [trendingTV, setTrendingTV] = useState<ContentCardType[]>(mapToContentCard(initialTV));
  const [popularTV, setPopularTV] = useState<ContentCardType[]>(mapToContentCard(initialPopular));
  
  const [searchResults, setSearchResults] = useState<ContentCardType[] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [isLoading, setIsLoading] = useState(false);

  // Optimized Fetcher
  const fetchData = useCallback(async (page: number, genreId: string | null) => {
    setIsLoading(true);
    try {
      if (genreId) {
        // Fetch genre-specific data
        const data = await getTmdbTvGenres();
        if (data && data.results) {
          setSearchResults(mapToContentCard(data.results));
          setTotalPages(Math.min(data.total_pages || 1, 500));
        }
      } else {
        // Reset to default trending/popular view
        // Note: Make sure your /api/tv route is working correctly!
        const [trendingRes, popularRes] = await Promise.all([
          fetch(`/api/tv?type=trending&page=${page}`).then(res => res.json()),
          fetch(`/api/tv?type=popular&page=${page}`).then(res => res.json())
        ]);

        setTrendingTV(mapToContentCard(trendingRes.results || []));
        setPopularTV(mapToContentCard(popularRes.results || []));
        setTotalPages(Math.min(popularRes.total_pages || 1, 500));
        setSearchResults(null);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults(null);
      setSearchQuery('');
      return;
    }
    setIsLoading(true);
    setSearchQuery(query);
    setActiveGenre(null); // Clear genre when searching
    try {
      const data = await multiSearch(query);
      setSearchResults(mapToContentCard(data.results || []));
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenreSelect = (genreId: string) => {
    setCurrentPage(1);
    setSearchQuery('');
    setActiveGenre(genreId || null);
    // Let the useEffect handle the actual fetching based on activeGenre state
  };

  useEffect(() => {
    if (currentPage !== 1 || activeGenre !== null) {
      fetchData(currentPage, activeGenre);
    }
  }, [currentPage, activeGenre, fetchData]);

  return (
    <div className="space-y-6">
      <div className="mt-6">
        <FilterBar 
          genres={genres} 
          onSearch={handleSearch}
          onSelectGenre={handleGenreSelect}
        />
      </div>

      <main className="pb-20">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#FF8A65]"></div>
          </div>
        ) : searchResults !== null ? (
          <Section title={searchQuery ? `Results for "${searchQuery}"` : "Filtered Series"}>
            <MovieGrid popular={searchResults} trending={[]} />
          </Section>
        ) : (
          <>
            <Section title="Trending Now">
               <MovieGrid popular={[]} trending={trendingTV} />
            </Section>
            
            <Section title="Popular TV Series">
               <MovieGrid popular={popularTV} trending={[]} />
            </Section>

            <div className="mt-10">
              <PaginationWrapper
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}