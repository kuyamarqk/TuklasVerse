'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import ContentCategoryRow from 'components/ContentCategoryRow';
import FilterBar from 'components/FilterBar';

import {
  searchMultiTmdb,
  getTmdbImageUrl,
  TmdbSearchResult,
} from 'lib/tmdb-api';
import {
  searchAnimeJikan,
  searchMangaJikan,
  getJikanImageUrl,
  JikanAnimeResult,
  JikanMangaResult,
} from 'lib/jikan-api';

import { ContentCardType } from 'types';

export default function SearchResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentQuery = searchParams.get('q') || '';
  const filterParam = searchParams.get('filter') || 'All';
  const sortParam = searchParams.get('sort') || 'Recently Added';

  const [filterType, setFilterType] = useState(filterParam);
  const [sortBy, setSortBy] = useState(sortParam);
  const [searchTerm, setSearchTerm] = useState(currentQuery);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [tmdbSearchResults, setTmdbSearchResults] = useState<TmdbSearchResult[]>([]);
  const [animeSearchResults, setAnimeSearchResults] = useState<JikanAnimeResult[]>([]);
  const [mangaSearchResults, setMangaSearchResults] = useState<JikanMangaResult[]>([]);

  useEffect(() => {
    async function fetchSearchResults() {
      if (!currentQuery) {
        setLoading(false);
        setTmdbSearchResults([]);
        setAnimeSearchResults([]);
        setMangaSearchResults([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const [tmdbRes, animeRes, mangaRes] = await Promise.allSettled([
          searchMultiTmdb(currentQuery),
          searchAnimeJikan(currentQuery),
          searchMangaJikan(currentQuery),
        ]);

        if (tmdbRes.status === 'fulfilled' && tmdbRes.value?.results) {
          setTmdbSearchResults(tmdbRes.value.results.filter(item => item.media_type !== 'person'));
        } else {
          console.error('TMDB Error:', tmdbRes.reason);
          setTmdbSearchResults([]);
        }

        if (animeRes.status === 'fulfilled' && animeRes.value?.data) {
          setAnimeSearchResults(animeRes.value.data);
        } else {
          console.error('Anime Error:', animeRes.reason);
          setAnimeSearchResults([]);
        }

        if (mangaRes.status === 'fulfilled' && mangaRes.value?.data) {
          setMangaSearchResults(mangaRes.value.data);
        } else {
          console.error('Manga Error:', mangaRes.reason);
          setMangaSearchResults([]);
        }

        if (
          tmdbRes.status === 'rejected' &&
          animeRes.status === 'rejected' &&
          mangaRes.status === 'rejected'
        ) {
          setError('Failed to load search results from all sources.');
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred.');
        setTmdbSearchResults([]);
        setAnimeSearchResults([]);
        setMangaSearchResults([]);
      } finally {
        setLoading(false);
      }
    }

    fetchSearchResults();
  }, [currentQuery]);

  useEffect(() => {
    setSearchTerm(currentQuery);
    setFilterType(filterParam);
    setSortBy(sortParam);
  }, [currentQuery, filterParam, sortParam]);

  const handleFilterTypeChange = (type: string) => {
    setFilterType(type);
    router.replace(`/search?q=${encodeURIComponent(searchTerm)}&filter=${encodeURIComponent(type)}&sort=${encodeURIComponent(sortBy)}`);
  };

  const handleSortByChange = (sort: string) => {
    setSortBy(sort);
    router.replace(`/search?q=${encodeURIComponent(searchTerm)}&filter=${encodeURIComponent(filterType)}&sort=${encodeURIComponent(sort)}`);
  };

  const handleSearchSubmitFromFilterBar = (term: string) => {
    if (term.trim() && term.trim() !== currentQuery) {
      router.push(`/search?q=${encodeURIComponent(term.trim())}&filter=${encodeURIComponent(filterType)}&sort=${encodeURIComponent(sortBy)}`);
    }
  };

  const filteredAndSortedResults = useMemo(() => {
    let combined: ContentCardType[] = [];

    const mappedTmdb = tmdbSearchResults.map(item => ({
      id: `${item.id}`,
      title: item.title || item.name || 'Untitled',
      imageUrl: getTmdbImageUrl(item.poster_path),
      genre: item.media_type === 'movie' ? 'Movie' : 'TV Series',
      year: (item.release_date || item.first_air_date) ? new Date(item.release_date || item.first_air_date!).getFullYear().toString() : 'N/A',
      type: item.media_type === 'movie' ? 'movie' : 'tv-series',
      score: item.vote_average,
    }));
    combined.push(...mappedTmdb);

    const mappedAnime = animeSearchResults.map(anime => {
      const year = anime.aired.from ? new Date(anime.aired.from).getFullYear().toString() : 'N/A';
      const genres = anime.genres.map(g => g.name).join(', ') || 'N/A';
      return {
        id: `anime-${anime.mal_id}`,
        title: anime.title,
        imageUrl: getJikanImageUrl(anime.images),
        genre: genres,
        year,
        type: 'anime',
        score: anime.score || undefined,
        episodes: anime.episodes || undefined,
      } as ContentCardType;
    });
    combined.push(...mappedAnime);

    const mappedManga = mangaSearchResults.map(manga => {
      const year = manga.published.from ? new Date(manga.published.from).getFullYear().toString() : 'N/A';
      const genres = manga.genres.map(g => g.name).join(', ') || 'N/A';
      return {
        id: `manga-${manga.mal_id}`,
        title: manga.title,
        imageUrl: getJikanImageUrl(manga.images),
        genre: genres,
        year,
        type: 'manga',
        score: manga.score || undefined,
        chapters: manga.chapters || undefined,
        volumes: manga.volumes || undefined,
      } as ContentCardType;
    });
    combined.push(...mappedManga);

    // Apply filtering
    if (filterType !== 'All') {
      combined = combined.filter(card => {
        const normalizedType = card.type === 'tv-series' ? 'TV Series'
                              : card.type === 'movie' ? 'Movie'
                              : card.type === 'anime' ? 'Anime'
                              : card.type === 'manga' ? 'Manga' : '';
        return normalizedType === filterType;
      });
    }

    // Sorting
    combined.sort((a, b) => {
      switch (sortBy) {
        case 'Recently Added':
          return parseInt(b.year || '0') - parseInt(a.year || '0');
        case 'Popularity':
          return (b.score || 0) - (a.score || 0);
        case 'A-Z':
          return a.title.localeCompare(b.title);
        case 'Z-A':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    return combined;
  }, [tmdbSearchResults, animeSearchResults, mangaSearchResults, filterType, sortBy]);

  if (!currentQuery) {
    return (
      <div className="container mx-auto px-4 py-8">
        <FilterBar
          onSearch={handleSearchSubmitFromFilterBar}
          onFilterTypeChange={handleFilterTypeChange}
          onSortByChange={handleSortByChange}
          currentSearchTerm={searchTerm}
          currentFilterType={filterType}
          currentSortBy={sortBy}
        />
        <p className="text-center text-gray-400 text-xl">Please enter a search term in the bar above.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <FilterBar
          onSearch={handleSearchSubmitFromFilterBar}
          onFilterTypeChange={handleFilterTypeChange}
          onSortByChange={handleSortByChange}
          currentSearchTerm={searchTerm}
          currentFilterType={filterType}
          currentSortBy={sortBy}
        />
        <p className="text-center text-[#FBE9E7] text-xl">Loading search results for "{currentQuery}"...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <FilterBar
          onSearch={handleSearchSubmitFromFilterBar}
          onFilterTypeChange={handleFilterTypeChange}
          onSortByChange={handleSortByChange}
          currentSearchTerm={searchTerm}
          currentFilterType={filterType}
          currentSortBy={sortBy}
        />
        <p className="text-center text-red-400 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <FilterBar
        onSearch={handleSearchSubmitFromFilterBar}
        onFilterTypeChange={handleFilterTypeChange}
        onSortByChange={handleSortByChange}
        currentSearchTerm={searchTerm}
        currentFilterType={filterType}
        currentSortBy={sortBy}
      />
      <h1 className="text-3xl font-bold text-[#FBE9E7] mb-6">
        Search Results for "{currentQuery}"
      </h1>

      {filteredAndSortedResults.length > 0 ? (
        <ContentCategoryRow
          title={`(${filteredAndSortedResults.length} results)`}
          cards={filteredAndSortedResults.map(card => ({
            ...card,
            id: `${card.type}-${card.id}`, // Ensure unique key downstream
          }))}
        />
      ) : (
        <p className="text-gray-400 text-center text-lg">
          No results found for "{currentQuery}" with the current filters.
        </p>
      )}
    </div>
  );
}
