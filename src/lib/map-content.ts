import { getTmdbImageUrl } from '@/lib/tmdb-api';
import { ContentCardType } from '@/src/types';

// ====================================================================
// ⭐ NEW: Type Definitions for Raw TMDB Data
// ====================================================================

// Interface for a raw Movie object from the TMDB API list/search endpoint
export interface TmdbMovie {
  id: number;
  title: string; // Used for movies
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  // Add other properties if you use them (e.g., genre_ids)
}


// ====================================================================
// ⭐ FIXED FUNCTIONS
// ====================================================================

// ⭐ FIX LINE 4: Use TmdbMovie[] instead of any[]
export function mapMovies(results: TmdbMovie[]): ContentCardType[] {
  return results.map((movie) => {
    const posterUrl = getTmdbImageUrl(movie.poster_path);
    return {
      id: movie.id,
      title: movie.title ?? 'Untitled',
      imageUrl: posterUrl, // ✅ now matches interface
      posterUrl,           // ✅ added this line
      releaseDate: movie.release_date ?? 'N/A',
      overview: '',        // ✅ add overview if available
      genre: 'Unknown',
      year: movie.release_date?.slice(0, 4) ?? 'N/A',
      type: 'movie',
      score: movie.vote_average,
    };
  });
}

// ⭐ FIX LINE 15: Use TmdbTv[] instead of any[]
export function mapTv(results: TmdbTv[]): ContentCardType[] {
  return results.map((tv) => {
    const posterUrl = getTmdbImageUrl(tv.poster_path);
    return {
      id: tv.id,
      title: tv.name ?? 'Untitled',
      imageUrl: posterUrl,
      posterUrl,
      releaseDate: tv.first_air_date ?? 'N/A',
      overview: '',        // ✅ add overview if available
      genre: 'Unknown',
      year: tv.first_air_date?.slice(0, 4) ?? 'N/A',
      type: 'tv',
      score: tv.vote_average,
    };
  });
}

export interface TmdbTv {
  id: number;
  name: string;
  poster_path: string | null;
  first_air_date: string;
  overview: string;
  vote_average: number;
  // ... other properties
}

// 2. Ensure RelatedTvResponse is EXPORTED
export interface RelatedTvResponse {
  page: number;
  results: TmdbTv[];
  total_pages: number;
  total_results: number;
}

export interface RelatedMovieResponse { // ⭐ THIS IS THE MISSING EXPORT
  page: number;
  results: TmdbMovie[]; // Uses the TmdbMovie interface
  total_pages: number;
  total_results: number;
}