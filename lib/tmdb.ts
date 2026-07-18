// src/lib/tmdb.ts

const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE = process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE;

if (!IMAGE_BASE) {
  throw new Error("Missing NEXT_PUBLIC_TMDB_IMAGE_BASE");
}

const headers = {
  Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
  "Content-Type": "application/json",
};

async function tmdbFetch<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers,
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    const errorBody = await res.text();
    console.error("TMDB ERROR RESPONSE:", errorBody);
    throw new Error(
      `TMDB fetch failed ${endpoint} - ${res.status}: ${errorBody}`
    );
  }

  return res.json();
}

// ⭐ TYPE DEFINITIONS
export type MediaType = "movie" | "tv";
export type TrendingMediaType = "movie" | "tv" | "all"; // Fixes trending types

export type Media = {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: MediaType | "person"; // Accommodates multi-search or trending results safely
  genre_ids?: number[];
};

export type MediaDetail = Media & {
  genres: { id: number; name: string }[];
  runtime?: number;
  number_of_seasons?: number;
  number_of_episodes?: number;
  status: string;
  tagline?: string;
  videos?: {
    results: {
      key: string;
      site: string;
      type: string;
      official: boolean;
    }[];
  };
  credits?: {
    cast: {
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }[];
  };
};

export type TMDBResponse<T> = {
  results: T[];
  total_pages: number;
  total_results: number;
};

export type Genre = {
  id: number;
  name: string;
};

// ⭐ UTILITY HELPER FUNCTIONS
export function getPosterUrl(path: string | null, size = "w500") {
  if (!path) return null;
  return `${IMAGE_BASE}/${size}${path}`;
}

export function getBackdropUrl(path: string | null, size = "w1280") {
  if (!path) return null;
  return `${IMAGE_BASE}/${size}${path}`;
}

export function getTitle(media: Media) {
  return media.title || media.name || "Untitled";
}

export function getYear(media: Media) {
  const date = media.release_date || media.first_air_date;
  return date ? new Date(date).getFullYear() : null;
}

// Converts a genre name into a URL-friendly slug shared across movie/TV,
// e.g. "Action & Adventure" -> "action-and-adventure", "Sci-Fi & Fantasy" -> "sci-fi-and-fantasy"
export function slugifyGenre(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ⭐ DATA FETCHING METHODS
export async function getTrending(
  type: TrendingMediaType = "all", // Uses the updated type definition
  window: "day" | "week" = "week"
) {
  return tmdbFetch<TMDBResponse<Media>>(
    `/trending/${type}/${window}`
  );
}

export async function getPopularMovies(page = 1) {
  return tmdbFetch<TMDBResponse<Media>>(
    `/movie/popular?page=${page}`
  );
}

export async function getPopularTV(page = 1) {
  return tmdbFetch<TMDBResponse<Media>>(
    `/tv/popular?page=${page}`
  );
}

export async function getTopRatedMovies(page = 1) {
  return tmdbFetch<TMDBResponse<Media>>(
    `/movie/top_rated?page=${page}`
  );
}

export async function getTopRatedTV(page = 1) {
  return tmdbFetch<TMDBResponse<Media>>(
    `/tv/top_rated?page=${page}`
  );
}

export async function getMediaDetail(type: MediaType, id: number) {
  return tmdbFetch<MediaDetail>(
    `/${type}/${id}?append_to_response=videos,credits`
  );
}

export async function getRecommendations(type: MediaType, id: number) {
  return tmdbFetch<TMDBResponse<Media>>(
    `/${type}/${id}/recommendations`
  );
}

export async function searchMedia(
  query: string,
  page = 1
): Promise<TMDBResponse<Media & { media_type?: string }>> {
  return tmdbFetch(
    `/search/multi?query=${encodeURIComponent(query)}&page=${page}&include_adult=false`
  );
}

export async function getGenres(type: MediaType) {
  const data = await tmdbFetch<{ genres: Genre[] }>(`/genre/${type}/list`);
  return data.genres;
}

export async function getGenreBySlug(type: MediaType, slug: string): Promise<Genre | null> {
  const genres = await getGenres(type);
  return genres.find((g) => slugifyGenre(g.name) === slug) ?? null;
}

export async function discoverByGenre(
  type: MediaType,
  genreId: number,
  page = 1
) {
  return tmdbFetch<TMDBResponse<Media>>(
    `/discover/${type}?with_genres=${genreId}&page=${page}&sort_by=popularity.desc`
  );
}

// TMDB doesn't have a dedicated "anime" genre — the common convention is
// Animation genre (id 16) combined with Japan as the origin country.
export async function discoverAnime(type: MediaType = "tv", page = 1) {
  return tmdbFetch<TMDBResponse<Media>>(
    `/discover/${type}?with_genres=16&with_origin_country=JP&page=${page}&sort_by=popularity.desc`
  );
}

export type SearchMediaType = "movie" | "tv" | "person";

export type SearchResult = Media & {
  media_type?: SearchMediaType;
};