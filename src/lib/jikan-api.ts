// ==========================================================
// 🌐 Jikan API Configuration
// ==========================================================

const JIKAN_BASE_URL = process.env.NEXT_PUBLIC_JIKAN_API_URL || 'https://api.jikan.moe/v4';

// ==========================================================
// 🧠 Jikan Types (Anime, Manga, Search, etc.)
// ==========================================================

// --- Anime Result (used in top list, search, etc.)
export interface JikanAnimeResult {
  mal_id: number;
  title: string;
  images: {
    jpg: { image_url: string; large_image_url: string };
    webp: { image_url: string; large_image_url: string };
  };
  genres: { mal_id: number; type: string; name: string; url: string }[];
  aired: { from: string | null; to: string | null };
  score?: number;
  episodes?: number;
  type: string;
  synopsis?: string;
}

// --- Manga Result (used in top list, search, etc.)
export interface JikanMangaResult {
  mal_id: number;
  title: string;
  images: {
    jpg: { image_url: string; large_image_url: string };
    webp: { image_url: string; large_image_url: string };
  };
  genres: { mal_id: number; type: string; name: string; url: string }[];
  published: { from: string | null; to: string | null };
  score?: number;
  chapters?: number;
  volumes?: number;
  type: string;
  synopsis?: string;
}

// --- Search Result (extends AnimeResult, optionally includes manga fields)
export interface JikanSearchResult extends JikanAnimeResult {
  published?: { from: string | null; to: string | null };
  chapters?: number;
  volumes?: number;
  themes?: { mal_id: number; type: string; name: string; url: string }[];
}

// --- Full Anime Details
export interface JikanAnimeDetailsResult {
  mal_id: number;
  title: string;
  images: {
    jpg: { image_url: string; large_image_url: string };
    webp: { image_url: string; large_image_url: string };
  };
  synopsis: string;
  genres: { mal_id: number; type: string; name: string; url: string }[];
  status: string;
  episodes: number | null;
  aired: { from: string | null; to: string | null; string: string };
  studios: { mal_id: number; type: string; name: string; url: string }[];
  score: number | null;
  type: string;
  relations: {
    relation: string;
    entry: {
      mal_id: number;
      type: string;
      name: string;
      url: string;
    }[];
  }[];
}

// --- Recommendation Entry
export interface JikanAnimeRecommendation {
  entry: {
    mal_id: number;
    title: string;
    images: {
      jpg: { image_url: string; small_image_url: string };
    };
  };
  votes: number;
}

// --- General Response Types
interface JikanResponse<T> {
  data: T;
  pagination?: any;
}

interface JikanListResponse<T> {
  data: T[];
  pagination?: any;
}

// ==========================================================
// 🔧 Utility Functions
// ==========================================================

/**
 * Generic fetcher for Jikan API endpoints
 */
const fetchJikan = async <T>(endpoint: string): Promise<T> => {
  const url = `${JIKAN_BASE_URL}${endpoint}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(`Failed to fetch from Jikan: ${res.status} ${res.statusText} - ${errorData.message || 'Unknown error'}`);
  }

  return res.json();
};

/**
 * Extract the best image from the Jikan image object
 */
export const getJikanImageUrl = (images: JikanAnimeResult['images']): string => {
  return images?.jpg?.large_image_url || '/placeholders/default-poster.jpg';
};

// ==========================================================
// 🔍 API Calls: Anime, Manga, Search, Recommendations
// ==========================================================

/**
 * Get top-ranked anime
 */
export const getTopAnime = async (): Promise<JikanListResponse<JikanAnimeResult>> => {
  return fetchJikan<JikanListResponse<JikanAnimeResult>>('/top/anime');
};

/**
 * Get top-ranked manga
 */
export const getTopManga = async (): Promise<JikanListResponse<JikanMangaResult>> => {
  return fetchJikan<JikanListResponse<JikanMangaResult>>('/top/manga');
};

/**
 * Search anime by keyword
 */
export const searchMultiJikan = async (query: string): Promise<JikanListResponse<JikanSearchResult>> => {
  return fetchJikan<JikanListResponse<JikanSearchResult>>(`/search/anime?q=${encodeURIComponent(query)}`);
};

/**
 * Get full anime details (includes synopsis, studio, genres, relations, etc.)
 */
export async function getAnimeDetailsJikan(id: number) {
  const res = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
  if (!res.ok) throw new Error('Failed to fetch');
  const json = await res.json();
  return json;  // json includes { data: {...} }
}

/**
 * Get anime recommendations (suggested similar anime by community votes)
 */
export const getAnimeRecommendationsJikan = async (id: number): Promise<JikanListResponse<JikanAnimeRecommendation>> => {
  return fetchJikan<JikanListResponse<JikanAnimeRecommendation>>(`/anime/${id}/recommendations`);
};
