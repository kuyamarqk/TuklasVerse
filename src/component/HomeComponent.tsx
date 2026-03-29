'use client';

import { useState } from 'react';
import Section from '@/component/Section';
import ContentCard from '@/component/ContentCard'; // Fixed import path to use @ alias
import FilterBar from '@/component/FilterBar';
import { mapToContentCard, TmdbMovie, TmdbTv } from '@/lib/map-content';
import { ContentCardType } from '@/src/types';
import { multiSearch, getTmdbMovieGenres } from '@/lib/tmdb-api';

interface HomeClientProps {
  initialPopular: TmdbMovie[]; 
  initialTV: TmdbTv[]; 
  genres: { id: number; name: string }[];
}

export default function HomeClient({ initialPopular, initialTV, genres }: HomeClientProps) {
  // --- State Management ---
  const [movies, setMovies] = useState<ContentCardType[]>(mapToContentCard(initialPopular));
  const [tvShows, setTvShows] = useState<ContentCardType[]>(mapToContentCard(initialTV));
  
  // searchResults is null when browsing default home, and an array when searching/filtering
  const [searchResults, setSearchResults] = useState<ContentCardType[] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // --- Logic Handlers ---

  /**
   * 1. Handle Genre Selection
   * Converts the string genreId to a Number for the API and updates the view.
   */
  const handleGenreSelect = async (genreId: string) => {
    if (!genreId) {
      // User cleared the filter: Reset to initial server-side data
      setSearchResults(null);
      setSearchQuery('');
      setMovies(mapToContentCard(initialPopular));
      setTvShows(mapToContentCard(initialTV));
      return;
    }

    setIsLoading(true);
    setSearchQuery(''); // Clear the search text if a genre is picked
    try {
      const data = await getTmdbMovieGenres();
      
      if (data && data.results) {
        setSearchResults(mapToContentCard(data.results));
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Genre fetch failed:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 2. Handle Search
   * Triggers the multi-search API and displays the results.
   */
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults(null);
      setSearchQuery('');
      return;
    }

    setIsLoading(true);
    setSearchQuery(query);
    try {
      const data = await multiSearch(query);
      
      if (data && data.results) {
        setSearchResults(mapToContentCard(data.results));
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Search and Filter Section */}
      <div className="mt-6">
        <FilterBar 
          genres={genres} 
          onSearch={handleSearch}
          onSelectGenre={handleGenreSelect}
        />
      </div>

      {/* Main Content Area */}
      <main>
        {searchResults !== null ? (
          /* VIEW A: Search Results or Filtered Genre Results */
          <Section title={searchQuery ? `Results for "${searchQuery}"` : "Filtered Results"}>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {searchResults.length > 0 ? (
                searchResults.map((item) => (
                  <ContentCard key={`${item.type}-${item.id}`} card={item} />
                ))
              ) : (
                <p className="col-span-full text-center py-20 text-[#BCAAA4]">
                  No matching movies or series found.
                </p>
              )}
            </div>
          </Section>
        ) : (
          /* VIEW B: Default Home Dashboard */
          <div className="space-y-12">
            <Section title="Popular Movies" href="/movie">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {movies.slice(0, 10).map((item) => (
                  <ContentCard key={`movie-${item.id}`} card={item} />
                ))}
              </div>
            </Section>

            <Section title="Popular TV Series" href="/tv">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {tvShows.slice(0, 10).map((item) => (
                  <ContentCard key={`tv-${item.id}`} card={item} />
                ))}
              </div>
            </Section>
          </div>
        )}
      </main>

      {/* Global Loading Spinner Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
           <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-[#FF8A65] border-r-2 "></div>
              <p className="text-[#FF8A65] font-medium animate-pulse">Loading TuklasVerse...</p>
           </div>
        </div>
      )}
    </div>
  );
}