import { getTmdbImageUrl } from '@/lib/tmdb-api';
import { ContentCardType } from '@/src/types';

export function mapMovies(results: any[]): ContentCardType[] {
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
export function mapTv(results: any[]): ContentCardType[] {
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