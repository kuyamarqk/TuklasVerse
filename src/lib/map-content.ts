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



export function mapToContentCard(items: (TmdbMovie | TmdbTv)[]): ContentCardType[] {
  return items.map((item) => {
    const isMovie = 'title' in item;
    const title = isMovie ? item.title : item.name;
    
    // TMDB uses 'release_date' for movies and 'first_air_date' for TV
    const rawDate = isMovie ? item.release_date : item.first_air_date;
    const posterUrl = getTmdbImageUrl(item.poster_path);

    return {
      id: item.id,
      title: title ?? 'Untitled',
      imageUrl: getTmdbImageUrl(item.backdrop_path) || posterUrl,
      posterUrl: posterUrl,
      releaseDate: rawDate ?? 'N/A', // 
      overview: item.overview || '',
      genre: isMovie ? 'Movie' : 'TV Series',
      year: rawDate?.slice(0, 4) ?? 'N/A',
      type: isMovie ? 'movie' : 'tv',
      score: item.vote_average,
    };
  });
}