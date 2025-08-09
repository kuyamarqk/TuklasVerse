// --- Configuration ---
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

// --- Generic TMDB Fetch Helper ---
const fetchTmdb = async <T>(endpoint: string): Promise<T> => {
  if (!API_KEY) {
    throw new Error('TMDB API Key is missing. Please set NEXT_PUBLIC_TMDB_API_KEY.');
  }

  const url = `${BASE_URL}${endpoint}?api_key=${API_KEY}`;
  const res = await fetch(url, { next: { revalidate: 3600 } }); // Revalidate every hour

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(`TMDB fetch failed: ${res.status} - ${errorData.status_message || 'Unknown error'}`);
  }

  return res.json();
};

// --- Image Utility ---
export const getTmdbImageUrl = (path: string | null, size: string = 'w500'): string => {
  return path ? `${IMAGE_BASE_URL}${size}${path}` : '/placeholders/default-poster.jpg';
};

// ==========================================================
// 🟢 TYPES (For Movies, TV Series, Seasons, Genres, etc.)
// ==========================================================

// --- General Response Wrapper ---
interface TmdbResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

// --- Movies ---
export interface TmdbMovieResult {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  overview: string;
  backdrop_path: string | null;
}

export interface TmdbMovieDetails {
  id: number;
  title: string;
  overview: string;
  genres: { id: number; name: string }[];
  status: string;
  runtime: number | null;
  release_date: string;
  vote_average: number;
  poster_path: string | null;
  backdrop_path: string | null;
  credits?: {
    crew: { job: string; name: string }[];
  };
}

// --- TV Series ---
export interface TmdbTvSeriesResult {
  id: number;
  name: string;
  poster_path: string | null;
  first_air_date: string;
  vote_average: number;
  genre_ids: number[];
  overview: string;
  backdrop_path: string | null;
}

export interface TmdbTvSeriesDetails {
  id: number;
  name: string;
  overview: string;
  genres: { id: number; name: string }[];
  status: string;
  first_air_date: string;
  last_air_date: string | null;
  number_of_episodes: number;
  number_of_seasons: number;
  episode_run_time: number[];
  vote_average: number;
  poster_path: string | null;
  backdrop_path: string | null;
  created_by: { id: number; name: string; gender: number; profile_path: string | null }[];
  networks: { id: number; logo_path: string | null; name: string; origin_country: string }[];
  seasons: {
    air_date: string | null;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path: string | null;
    season_number: number;
    vote_average: number;
  }[];
}

export interface TmdbSeasonDetails {
  _id: string;
  air_date: string | null;
  name: string;
  overview: string;
  id: number;
  poster_path: string | null;
  season_number: number;
  vote_average: number;
  episodes: {
    id: number;
    name: string;
    overview: string;
    episode_number: number;
    season_number: number;
    still_path: string | null;
    air_date: string | null;
    vote_average: number;
  }[];
}

// --- Genres ---
export interface TmdbGenre {
  id: number;
  name: string;
}

interface TmdbGenreListResponse {
  genres: TmdbGenre[];
}

// --- Trending Items (can be movie or TV) ---
export interface TmdbTrendingResult {
  id: number;
  media_type: 'movie' | 'tv';
  title?: string;
  name?: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  genre_ids: number[];
  overview: string;
  backdrop_path: string | null;
}

// --- Video Types ---
export interface TmdbVideo {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: 'YouTube' | 'Vimeo';
  size: number;
  type: string;
  official: boolean;
  published_at: string;
  id: string;
}

export interface TmdbVideosResponse {
  id: number;
  results: TmdbVideo[];
}

// ==========================================================
// 🟢 API FUNCTIONS
// ==========================================================

// --- Movies ---
export const getPopularMovies = async () => fetchTmdb<TmdbResponse<TmdbMovieResult>>('/movie/popular');
export const getMovieDetailsTmdb = async (id: number) => fetchTmdb<TmdbMovieDetails>(`/movie/${id}`);
export const getMovieRecommendationsTmdb = async (id: number) => fetchTmdb<TmdbResponse<TmdbMovieResult>>(`/movie/${id}/recommendations`);
export const getMovieVideosTmdb = async (id: number) => fetchTmdb<TmdbVideosResponse>(`/movie/${id}/videos`);

// --- TV Series ---
export const getPopularTvSeries = async () => fetchTmdb<TmdbResponse<TmdbTvSeriesResult>>('/tv/popular');
export const getTvSeriesDetailsTmdb = async (id: number) => fetchTmdb<TmdbTvSeriesDetails>(`/tv/${id}`);
export const getTvSeriesRecommendationsTmdb = async (id: number) => fetchTmdb<TmdbResponse<TmdbTvSeriesResult>>(`/tv/${id}/recommendations`);
export const getTvSeriesSeasonDetailsTmdb = async (seriesId: number, seasonNumber: number) => fetchTmdb<TmdbSeasonDetails>(`/tv/${seriesId}/season/${seasonNumber}`);
export const getTvSeriesVideosTmdb = async (seriesId: number) => fetchTmdb<TmdbVideosResponse>(`/tv/${seriesId}/videos`);

// --- Trending ---
export const getTrending = async () => fetchTmdb<TmdbResponse<TmdbTrendingResult>>('/trending/all/week');

// --- Genres ---
let tmdbMovieGenres: TmdbGenre[] = [];
let tmdbTvGenres: TmdbGenre[] = [];

export const getTmdbMovieGenres = async (): Promise<TmdbGenre[]> => {
  if (tmdbMovieGenres.length) return tmdbMovieGenres;
  const data = await fetchTmdb<TmdbGenreListResponse>('/genre/movie/list');
  tmdbMovieGenres = data.genres;
  return tmdbMovieGenres;
};

export const getTmdbTvGenres = async (): Promise<TmdbGenre[]> => {
  if (tmdbTvGenres.length) return tmdbTvGenres;
  const data = await fetchTmdb<TmdbGenreListResponse>('/genre/tv/list');
  tmdbTvGenres = data.genres;
  return tmdbTvGenres;
};

// Converts an array of genre IDs into readable names
export const getTmdbGenreNames = (genreIds: number[], allGenres: TmdbGenre[]): string[] => {
  if (!allGenres.length) return ['N/A'];
  const names = genreIds.map(id => allGenres.find(g => g.id === id)?.name).filter(Boolean) as string[];
  return names.length ? names : ['N/A'];
};
