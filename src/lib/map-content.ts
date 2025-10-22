import { getTmdbImageUrl } from '@/lib/tmdb-api';
import { ContentCardType } from '@/src/types';

// ====================================================================
// ⭐ NEW: Type Definitions for Raw TMDB Data
// ====================================================================

// Interface for a raw Movie object from the TMDB API list/search endpoint
interface TmdbMovie {
  id: number;
  title: string; // Used for movies
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  // Add other properties if you use them (e.g., genre_ids)
}

// Interface for a raw TV Show object from the TMDB API list/search endpoint
interface TmdbTv {
  id: number;
  name: string; // Used for TV shows
  poster_path: string | null;
  first_air_date: string;
  vote_average: number;
  // Add other properties if you use them (e.g., genre_ids)
}

// ====================================================================
// ⭐ FIXED FUNCTIONS
// ====================================================================

// ⭐ FIX LINE 4: Use TmdbMovie[] instead of any[]
export function mapMovies(results: TmdbMovie[]): ContentCardType[] {
  return results.map((movie) => ({
    id: movie.id,
    title: movie.title ?? 'Untitled',
    imageUrl: getTmdbImageUrl(movie.poster_path),
    genre: 'Unknown',
    year: movie.release_date?.slice(0, 4) ?? 'N/A',
    type: 'movie',
    score: movie.vote_average,
  }));
}

// ⭐ FIX LINE 15: Use TmdbTv[] instead of any[]
export function mapTv(results: TmdbTv[]): ContentCardType[] {
  return results.map((tv) => ({
    id: tv.id,
    title: tv.name ?? 'Untitled',
    imageUrl: getTmdbImageUrl(tv.poster_path),
    genre: 'Unknown',
    year: tv.first_air_date?.slice(0, 4) ?? 'N/A',
    type: 'tv',
    score: tv.vote_average,
  }));
}