// src/app/movie/page.tsx
'use client'; // This is a Client Component

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ContentCard from 'components/ContentCard';
import FilterBar from 'components/FilterBar';

// Import TMDB API functions and types
import { getPopularMovies, getTmdbImageUrl, TmdbMovieResult } from 'lib/tmdb-api';
import { ContentCardType } from 'types'; // Ensure your ContentCardType is correctly defined here

export default function MovieListPage() {
  const [moviesContent, setMoviesContent] = useState<ContentCardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // States for FilterBar (will primarily redirect to search for actual filtering)
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [sortBy, setSortBy] = useState('Popularity'); // Default sort for movies

  useEffect(() => {
    async function fetchMovies() {
      setLoading(true);
      setError(null);
      try {
        const data = await getPopularMovies(); // Fetch popular movies from TMDB
        if (data && data.results) {
          const mappedMovies = data.results.map((movie: TmdbMovieResult) => {
            const year = movie.release_date ? new Date(movie.release_date).getFullYear().toString() : 'N/A';
            // TMDB genres are numbers, you'd typically resolve them to names using a genre list API call
            // For simplicity here, we'll just say "Movie" or a generic placeholder.
            // In a real app, you'd fetch genre list and map IDs to names.
            const genreName = 'Movie'; // Simplified: assume type 'Movie' for genre
            
            return {
              id: movie.id,
              title: movie.title,
              imageUrl: getTmdbImageUrl(movie.poster_path),
              genre: genreName, // Placeholder for actual genre names
              year: year,
              type: 'movie', // Explicitly set type
              score: movie.vote_average || undefined,
            } as ContentCardType;
          });
          setMoviesContent(mappedMovies);
        } else {
          console.warn('No movie data or invalid structure received from TMDB API.');
          setMoviesContent([]);
        }
      } catch (err) {
        console.error('Failed to fetch movies:', err);
        setError('Failed to load movies. Please check your API keys and internet connection.');
        setMoviesContent([]); // Ensure state is empty on error
      } finally {
        setLoading(false);
      }
    }
    fetchMovies();
  }, []); // Empty dependency array means this runs once on mount

  // Handles search initiated from this page's FilterBar (will redirect to /search)
  const handleSearchSubmit = (term: string) => {
    if (term.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(term.trim())}`;
    }
  };

  // Dummy handlers for FilterBar's filterType and sortBy on this page
  const handleFilterTypeChange = (type: string) => {
    setFilterType(type);
    // Add client-side filtering logic here if needed, or trigger new API call
  };

  const handleSortByChange = (sort: string) => {
    setSortBy(sort);
    // Add client-side sorting logic here if needed, or trigger new API call
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#1a1a1a]">
        <main className="flex-grow container mx-auto py-8 px-4 text-[#FBE9E7] text-center text-xl">
          Loading popular movies...
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-[#1a1a1a]">
        <main className="flex-grow container mx-auto py-8 px-4 text-red-400 text-center text-xl">
          {error}
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#1a1a1a]">
      <main className="flex-grow container mx-auto py-8 px-4 text-[#FBE9E7]">
        {/* Breadcrumbs */}
        <div className="mb-6 text-sm text-gray-400">
          <Link href="/" className="hover:underline">Home</Link> &gt;
          <span> Movies</span>
        </div>

        <h1 className="text-3xl font-bold text-[#FBE9E7] mb-8">Popular Movies</h1>

        <FilterBar
          onSearch={handleSearchSubmit}
          onFilterTypeChange={handleFilterTypeChange}
          onSortByChange={handleSortByChange}
          currentSearchTerm={searchTerm}
          currentFilterType={filterType}
          currentSortBy={sortBy}
        />

        {moviesContent.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {moviesContent.map((movie) => (
              <ContentCard key={movie.id} card={movie} />
            ))}
          </div>
        ) : (
          <div className="bg-[#3E2723] p-6 rounded-lg shadow-md text-gray-400 text-center">
            No popular movies found.
          </div>
        )}
      </main>
    </div>
  );
}