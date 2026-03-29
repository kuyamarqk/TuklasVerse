// app/movie/[id]/page.tsx

import { getMovieDetails, getPopularMovies, getTmdbImageUrl } from '@/lib/tmdb-api';
import ContentCard from '@/component/ContentCard';
import Section from '@/component/Section';
import VideoPlayer from '@/component/VideoPlayer';

// --- Interfaces ---

interface PopularMovieItem {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  overview: string;
}

interface PopularMoviesResponse {
  results: PopularMovieItem[];
}

interface DetailedMovie {
  id: number;
  title: string;
  release_date: string;
  runtime: number;
  overview: string;
  genres: { id: number; name: string }[];
}

// Next.js 15 requirement: params is a Promise
interface MoviePageProps {
  params: Promise<{ id: string }>;
}

export default async function MoviePage(props: MoviePageProps) {
  // 1. Await params (CRITICAL for Next.js 15)
  const { id } = await props.params;

  // 2. Validate ID
  if (!id || isNaN(Number(id))) {
    return (
      <main className="text-center py-20 text-red-500">
        Invalid movie ID.
      </main>
    );
  }

  // 3. Fetch Data
  const movie: DetailedMovie = await getMovieDetails(id);
  const related: PopularMoviesResponse = await getPopularMovies(1);

  return (
    <main className="font-sans bg-[#121212] text-[#FBE9E7] min-h-screen px-4 sm:px-8 py-8">
      {/* Watch Now Section */}
      <Section title="Watch Now">
        <VideoPlayer id={movie.id} type="movie" />
        
      </Section>

      {/* Movie Details Section */}
      <Section title="Movie Details">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Info */}
          <div className="md:col-span-1 space-y-4">
            <h1 className="text-2xl font-bold">{movie.title}</h1>
            <p className="text-sm text-[#BCAAA4]">
              {movie.release_date?.slice(0, 4)} • {movie.runtime} min
            </p>
            <div className="flex flex-wrap gap-2">
              {movie.genres?.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 rounded-full bg-[#1a1a1a] text-sm border border-[#333]"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          </div>

          {/* Overview */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-2">Overview</h2>
            <p className="text-[#BCAAA4] leading-relaxed">{movie.overview}</p>
          </div>
        </div>
      </Section>

      {/* Related Movies Section */}
      <Section title="Related Movies" href="/movie?filter=popular">
        <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
          {related.results?.slice(0, 10).map((item) => (
            <ContentCard
              key={item.id}
              card={{
                id: item.id,
                title: item.title,
                imageUrl: getTmdbImageUrl(item.poster_path),
                posterUrl: getTmdbImageUrl(item.poster_path),
                releaseDate: item.release_date,
                overview: item.overview,
                genre: movie.genres?.[0]?.name || "Unknown",
                year: item.release_date?.slice(0, 4) || "N/A",
                type: "movie",
              }}
            />
          ))}
        </div>
      </Section>
    </main>
  );
}