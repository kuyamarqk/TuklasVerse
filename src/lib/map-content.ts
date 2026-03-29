import { getTmdbImageUrl } from '@/lib/tmdb-api';
import { ContentCardType } from '@/src/types';

export interface TmdbMovie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  overview: string;
  vote_average: number;
}

export interface TmdbTv {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  overview: string;
  vote_average: number;
}

export interface RelatedMovieResponse {
  page: number;
  results: TmdbMovie[];
  total_pages: number;
}

export interface RelatedTvResponse {
  page: number;
  results: TmdbTv[];
  total_pages: number;
}



export function mapToContentCard(items: (TmdbMovie | TmdbTv)[] | undefined | null): ContentCardType[] {
  
  // 1. SAFETY CHECK: If items is undefined, null, or not an array, return an empty list.
  // This prevents the "Cannot read properties of undefined (reading 'map')" error.
  if (!items || !Array.isArray(items)) {
    return [];
  }

  return items.map((item) => {
    // Check if it's a movie by looking for 'title' OR 'release_date'
    const isMovie = 'title' in item || 'release_date' in item;
    
    const title = isMovie 
      ? (item as TmdbMovie).title 
      : (item as TmdbTv).name;
    
    const rawDate = isMovie 
      ? (item as TmdbMovie).release_date 
      : (item as TmdbTv).first_air_date;

    const posterUrl = getTmdbImageUrl(item.poster_path);

    return {
      id: item.id,
      title: title ?? 'Untitled',
      imageUrl: getTmdbImageUrl(item.backdrop_path) || posterUrl,
      posterUrl: posterUrl,
      releaseDate: rawDate ?? 'N/A',
      overview: item.overview || '',
      genre: isMovie ? 'Movie' : 'TV Series',
      year: rawDate ? rawDate.slice(0, 4) : 'N/A',
      type: isMovie ? 'movie' : 'tv',
      score: item.vote_average,
    };
  });

}