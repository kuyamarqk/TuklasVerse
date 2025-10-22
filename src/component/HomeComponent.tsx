// src/app/HomeClient.tsx
'use client';

import { useState, useCallback } from 'react';
import Section from '@/component/Section';
import FilterWrapper from '@/component/FilterWrapper';
import MovieGrid from '@/component/MovieGrid';
import PaginationWrapper from '@/component/PaginationWrapper';

import { mapMovies, TmdbMovie, RelatedMovieResponse } from '@/lib/map-content'; 
// Assuming mapMovies, TmdbMovie, and RelatedMovieResponse are exported from here

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
  // All state and handlers live here (in the Client Component)
  const [currentPage, setCurrentPage] = useState(1);
  const [activeGenre, setActiveGenre] = useState<string | null>(null);
  const [trendingMovies, setTrendingMovies] = useState(mapMovies(initialTrending));
  const [popularMovies, setPopularMovies] = useState(mapMovies(initialPopular));
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [isLoading, setIsLoading] = useState(false);

  // ⭐ THE FIX: The event handler is defined IN the Client Component
  const handleGenreChange = useCallback((genre: string) => {
    // This handler will be passed to FilterWrapper
    setActiveGenre(genre); 
    setCurrentPage(1);
    // You'd typically trigger fetchData here
    // fetchData(1, genre); 
    console.log('Selected genre:', genre);
  }, []);
  


  return (
    <>
      <div className="mt-6">
        <FilterWrapper
          genres={genres}
          // ⭐ The function is now passed from a Client Component to another Client Component
          onGenreChange={handleGenreChange}
          
        />
      </div>

      <Section title="Trending Movies">
        <MovieGrid popular={popularMovies} trending={trendingMovies} />
        <PaginationWrapper currentPage={currentPage} totalPages={totalPages}  />
      </Section>
    </>
  );
}