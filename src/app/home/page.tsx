// src/app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import ContentCategoryRow from 'components/ContentCategoryRow';
import FilterBar from 'components/FilterBar';

// Import all necessary API functions and types
import {
  getPopularMovies,
  getPopularTvSeries,
  getTrending,
  getTmdbImageUrl,
  TmdbTrendingResult,
  TmdbMovieResult,
  TmdbTvSeriesResult,
} from 'lib/tmdb-api';
import {
  getTopAnime,
  getTopManga,
  getJikanImageUrl,
  JikanAnimeResult,
  JikanMangaResult,
} from 'lib/jikan-api';

import { ContentCardType } from 'types';

export default function HomePage() {
  const router = useRouter();

  // States for fetched raw data
  const [popularMoviesContent, setPopularMoviesContent] = useState<ContentCardType[]>([]);
  const [popularTvSeriesContent, setPopularTvSeriesContent] = useState<ContentCardType[]>([]);
  const [popularAnimeContent, setPopularAnimeContent] = useState<ContentCardType[]>([]);
  const [popularMangaContent, setPopularMangaContent] = useState<ContentCardType[]>([]);
  const [featuredContent, setFeaturedContent] = useState<TmdbTrendingResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        // Fetch featured content (trending)
        const trendingData = await getTrending('all', 'day');
        if (trendingData && trendingData.results && trendingData.results.length > 0) {
          setFeaturedContent(trendingData.results[0]);
        } else {
          console.warn('No trending content found for the hero section.');
          setFeaturedContent(null);
        }

        // Fetch popular movies
        const moviesData = await getPopularMovies();
        if (moviesData && moviesData.results) {
          const mappedMovies = moviesData.results.map((movie: TmdbMovieResult) => ({
            id: movie.id,
            title: movie.title,
            imageUrl: getTmdbImageUrl(movie.poster_path),
            genre: 'Movie',
            year: movie.release_date ? new Date(movie.release_date).getFullYear().toString() : 'N/A',
            type: 'movie',
            score: movie.vote_average,
          })) as ContentCardType[];
          setPopularMoviesContent(mappedMovies);
        } else {
          console.warn('No results or invalid data structure for popular movies.');
          setPopularMoviesContent([]);
        }

        // Fetch popular TV series
        const tvSeriesData = await getPopularTvSeries();
        if (tvSeriesData && tvSeriesData.results) {
          const mappedTvSeries = tvSeriesData.results.map((tvSeries: TmdbTvSeriesResult) => ({
            id: tvSeries.id,
            title: tvSeries.name,
            imageUrl: getTmdbImageUrl(tvSeries.poster_path),
            genre: 'TV Series',
            year: tvSeries.first_air_date ? new Date(tvSeries.first_air_date).getFullYear().toString() : 'N/A',
            type: 'tv-series',
            score: tvSeries.vote_average,
          })) as ContentCardType[];
          setPopularTvSeriesContent(mappedTvSeries);
        } else {
          console.warn('No results or invalid data structure for popular TV series.');
          setPopularTvSeriesContent([]);
        }

        // Fetch Popular Anime from Jikan API
        const animeData = await getTopAnime();
        if (animeData && animeData.data) {
          const mappedAnime = animeData.data.map((anime: JikanAnimeResult) => {
            const year = anime.aired.from ? new Date(anime.aired.from).getFullYear().toString() : 'N/A';
            const genres = anime.genres.map(g => g.name).join(', ') || 'N/A';
            let contentType: ContentCardType['type'];
            switch (anime.type) {
              case 'TV': case 'Movie': case 'OVA': case 'ONA': case 'Special':
                contentType = 'anime'; break;
              default: contentType = 'anime';
            }
            return {
              id: anime.mal_id, title: anime.title, imageUrl: getJikanImageUrl(anime.images),
              genre: genres, year: year, type: contentType, score: anime.score || undefined,
              episodes: anime.episodes || undefined,
            } as ContentCardType;
          });
          setPopularAnimeContent(mappedAnime);
        } else {
          console.warn('No results or invalid data structure for top anime.');
          setPopularAnimeContent([]);
        }

        // Fetch Popular Manga from Jikan API
        const mangaData = await getTopManga();
        if (mangaData && mangaData.data) {
          const mappedManga = mangaData.data.map((manga: JikanMangaResult) => {
            const year = manga.published.from ? new Date(manga.published.from).getFullYear().toString() : 'N/A';
            const genres = manga.genres.map(g => g.name).join(', ') || 'N/A';
            return {
              id: manga.mal_id, title: manga.title, imageUrl: getJikanImageUrl(manga.images),
              genre: genres, year: year, type: 'manga', score: manga.score || undefined,
              chapters: manga.chapters || undefined, volumes: manga.volumes || undefined,
            } as ContentCardType;
          });
          setPopularMangaContent(mappedManga);
        } else {
          console.warn('No results or invalid data structure for top manga.');
          setPopularMangaContent([]);
        }

      } catch (err) {
        console.error('Failed to fetch content from APIs:', err);
        setError('Failed to load content. Please check your API keys and internet connection.');
        // Ensure all content states are empty arrays on error
        setPopularMoviesContent([]);
        setPopularTvSeriesContent([]);
        setPopularAnimeContent([]);
        setPopularMangaContent([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []); // Empty dependency array means this runs once on mount


  const handleSearch = (term: string) => {
    if (term.trim()) {
      router.push(`/search?q=${encodeURIComponent(term.trim())}`);
    }
  };

  // Dummy handlers for filterType and sortBy - they don't do anything on homepage
  const handleFilterTypeChange = (type: string) => {};
  const handleSortByChange = (sort: string) => {};

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center text-[#FBE9E7] text-xl">Loading content...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-400 text-xl">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <FilterBar
        onSearch={handleSearch}
        onFilterTypeChange={handleFilterTypeChange}
        onSortByChange={handleSortByChange}
        // No currentSearchTerm, currentFilterType, currentSortBy needed for homepage's FilterBar
      />

      {/* Dynamic Hero Section */}
      <div className="bg-[#212121] rounded-lg shadow-lg overflow-hidden mb-8">
        {featuredContent ? (
          <div className="relative w-full h-64 sm:h-80 md:h-96">
            <Image
              src={getTmdbImageUrl(featuredContent.backdrop_path, 'original')}
              alt={featuredContent.title || featuredContent.name || "Featured Content"}
              fill
              className="object-cover object-center brightness-50"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#212121] to-transparent flex items-end p-6">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#FBE9E7] mb-2 drop-shadow-lg">
                  {featuredContent.title || featuredContent.name}
                </h2>
                <p className="text-lg text-gray-300 drop-shadow">
                  {featuredContent.media_type === 'movie' ? 'Movie' : 'TV Series'} |{' '}
                  {(featuredContent.release_date || featuredContent.first_air_date) ?
                    new Date(featuredContent.release_date || featuredContent.first_air_date!).getFullYear().toString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-64 sm:h-80 md:h-96 flex items-center justify-center bg-gray-800 text-gray-400 text-center">
            <p>{error || 'No featured content available.'}</p>
          </div>
        )}
      </div>

      {/* Render the original categories for the homepage */}
      {popularAnimeContent.length > 0 && (
        <ContentCategoryRow title="Popular Anime (from Jikan)" cards={popularAnimeContent} />
      )}
      {popularTvSeriesContent.length > 0 && (
        <ContentCategoryRow title="Popular TV Series (from TMDB)" cards={popularTvSeriesContent} />
      )}
      {popularMoviesContent.length > 0 && (
        <ContentCategoryRow title="Popular Movies (from TMDB)" cards={popularMoviesContent} />
      )}
      {popularMangaContent.length > 0 && (
        <ContentCategoryRow title="Popular Manga (from Jikan)" cards={popularMangaContent} />
      )}
    </div>
  );
}