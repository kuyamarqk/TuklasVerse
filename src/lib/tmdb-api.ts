// Old line: const TMDB_API_KEY = process.env.TMDB_API_KEY;
// New line:
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;


const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export interface TmdbMedia {
  id: number;
  title?: string;      // Used by Movies
  name?: string;       // Used by TV Shows
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  media_type?: 'movie' | 'tv' | 'person';
  release_date?: string;   // Used by Movies
  first_air_date?: string; // Used by TV Shows
  vote_average: number;
}

function fetchFromTmdb(endpoint: string, page = 1, extraParams = '') {
  if (!TMDB_API_KEY) {
    throw new Error('TMDB API key is missing.');
  }

  // Combine them into the URL string
  const url = `${TMDB_BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}&language=en-US&page=${page}${extraParams}`;

  return fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`TMDB fetch failed: ${res.status}`);
      }
      return res.json();
    })
    .catch((err) => {
      console.error('TMDB API error:', err);
      return { results: [] }; 
    });
}


export async function getTrendingMovies(timeWindow: 'day' | 'week', page = 1) {
  return fetchFromTmdb(`/trending/movie/${timeWindow}`, page);
}

export async function getPopularMovies(page = 1) {
  return fetchFromTmdb(`/movie/popular`, page);
}

export async function getMovieDetails(id: string) {
  return fetchFromTmdb(`/movie/${id}`);
}


export async function getTrendingTvSeries(timeWindow: 'day' | 'week', page = 1) {
  return fetchFromTmdb(`/trending/tv/${timeWindow}`, page);
}

export async function getPopularTvSeries(page = 1) {
  return fetchFromTmdb(`/tv/popular`, page);
}
export async function getTvDetails(id: number) {
  return fetchFromTmdb(`/tv/${id}`);
}

export async function getSeasonEpisodes(tvId: number, seasonNumber: number) {
  const res = await fetch(`https://api.themoviedb.org/3/tv/${tvId}/season/${seasonNumber}?api_key=${process.env.TMDB_API_KEY}`);
  return res.json();
}




export async function getTmdbMovieGenres() {
  try {
    const url = `${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`;
    const res = await fetch(url);
    const data = await res.json();
    return data; // Should return { genres: [...] }
  } catch (error) {
    console.error("Movie Genre fetch error:", error);
    return { genres: [] }; // Fallback to empty array to prevent .map() crashes
  }
}

export async function getTmdbTvGenres() {
  try {
    const url = `${TMDB_BASE_URL}/genre/tv/list?api_key=${TMDB_API_KEY}&language=en-US`;
    const res = await fetch(url);
    const data = await res.json();
    return data; // Returns { genres: [{ id: 18, name: "Drama" }, ...] }
  } catch (error) {
    console.error("TV Genre list error:", error);
    return { genres: [] }; 
  }
}
export function getTmdbImageUrl(path: string | null, size: 'w500' | 'original' = 'w500') {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : '/placeholders/default-poster.jpg';
}

export async function getHeroBackdrop(type: 'movie' | 'tv' = 'movie') {
    
    const data = await fetchFromTmdb(`/trending/${type}/day`, 1);
    console.log(data);

  if (!data || !Array.isArray(data.results)) {
    console.warn('TMDB hero fetch failed:', data);
    return {
      title: 'Featured Title',
      overview: 'No description available.',
      backdropUrl: '/placeholders/default-poster.jpg',
      id: 0,
      type,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const candidates = data.results.filter((item: { backdrop_path: any; }) => item.backdrop_path).slice(0, 5);
  const selected = candidates[Math.floor(Math.random() * candidates.length)];

  return {
    title: selected?.title || selected?.name || 'Featured Title',
    overview: selected?.overview ?? 'No description available.',
    backdropUrl: getTmdbImageUrl(selected?.backdrop_path, 'original'),
    id: selected?.id ?? 0,
    type,
  };
}


export async function multiSearch(query: string) {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/search/multi?query=${query}...`);
    const data = await res.json();
    return data; // ✨ You must return the data object
  } catch (error) {
    console.error(error);
    return { results: [] }; // ✨ Return a fallback so '.results' always exists
  }
}



