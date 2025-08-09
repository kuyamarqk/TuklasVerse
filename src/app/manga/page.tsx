// src/app/anime/page.tsx
'use client'; // This is a Client Component

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ContentCard from 'components/ContentCard'; // ⭐ Ensure ContentCard is imported ⭐
import FilterBar from 'components/FilterBar';

// Import API functions and types
import { getTopAnime, JikanAnimeResult, getJikanImageUrl } from 'lib/jikan-api';
import { ContentCardType } from 'types';

export default function AnimeListPage() {
  const [animeContent, setAnimeContent] = useState<ContentCardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // States for FilterBar (will primarily redirect to search for actual filtering)
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [sortBy, setSortBy] = useState('Recently Added');

  useEffect(() => {
    async function fetchAnime() {
      setLoading(true);
      setError(null);
      try {
        const data = await getTopAnime();
        if (data && data.data) {
          const mappedAnime = data.data.map((anime: JikanAnimeResult) => {
            const year = anime.aired.from ? new Date(anime.aired.from).getFullYear().toString() : 'N/A';
            const genres = anime.genres.map(g => g.name).join(', ') || 'N/A';
            let contentType: ContentCardType['type'];
            switch (anime.type) {
              case 'TV': case 'Movie': case 'OVA': case 'ONA': case 'Special':
                contentType = 'anime'; break;
              default: contentType = 'anime'; // Fallback to anime type
            }
            return {
              id: anime.mal_id,
              title: anime.title,
              imageUrl: getJikanImageUrl(anime.images),
              genre: genres,
              year: year,
              type: contentType,
              score: anime.score || undefined,
              episodes: anime.episodes || undefined,
            } as ContentCardType;
          });
          setAnimeContent(mappedAnime);
        } else {
          console.warn('No anime data or invalid structure received from Jikan API.');
          setAnimeContent([]);
        }
      } catch (err) {
        console.error('Failed to fetch anime:', err);
        setError('Failed to load anime. Please try again later.');
        setAnimeContent([]); // Ensure state is empty on error
      } finally {
        setLoading(false);
      }
    }
    fetchAnime();
  }, []); // Empty dependency array means this runs once on mount

  // Handles search initiated from this page's FilterBar (will redirect to /search)
  const handleSearchSubmit = (term: string) => {
    if (term.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(term.trim())}`;
    }
  };

  // Dummy handlers for FilterBar's filterType and sortBy on this page
  // These would typically be used to filter/sort the 'animeContent' state directly
  // if you wanted to implement client-side filtering on this page.
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
          Loading popular anime...
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
        <div className="mb-6 text-sm text-gray-400">
          <Link href="/" className="hover:underline">Home</Link> &gt;
          <span> Anime</span> {/* Corrected breadcrumb */}
        </div>

        <h1 className="text-3xl font-bold text-[#FBE9E7] mb-8">Popular Anime</h1> {/* Corrected title */}

        <FilterBar
          onSearch={handleSearchSubmit}
          onFilterTypeChange={handleFilterTypeChange}
          onSortByChange={handleSortByChange}
          currentSearchTerm={searchTerm}
          currentFilterType={filterType}
          currentSortBy={sortBy}
        />

        {animeContent.length > 0 ? (
          // ⭐ Reinstated the grid layout here ⭐
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {animeContent.map((anime) => (
              <ContentCard key={anime.id} card={anime} />
            ))}
          </div>
        ) : (
          <div className="bg-[#3E2723] p-6 rounded-lg shadow-md text-gray-400 text-center">
            No popular anime found.
          </div>
        )}
      </main>
    </div>
  );
}