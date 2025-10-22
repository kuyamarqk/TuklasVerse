// app/movie/[id]/page.tsx

import { getMovieDetails, getPopularMovies, getTmdbImageUrl } from '@/lib/tmdb-api';
import ContentCard from '@/component/ContentCard';
import Section from '@/component/Section';
import VideoPlayer from '@/component/VideoPlayer';


interface PopularMovieItem {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  overview: string;
  // Include any other properties you might use from the API response
}


interface PopularMoviesResponse {
  page: number;
  results: PopularMovieItem[];
  total_pages: number;
  total_results: number;
}

interface DetailedMovie {
  id: number;
  title: string;
  release_date: string;
  runtime: number;
  overview: string;
  genres: { id: number; name: string }[];
  // Add other properties if your getMovieDetails function returns them
}

interface MoviePageProps {
  params: { id: string };
}

export default async function MoviePage(props: MoviePageProps) {
  const { id } = props.params; // Changed 'await props.params' to 'props.params' as props.params is not a promise in App Router dynamic routes

  if (!id || isNaN(Number(id))) {
    return (
      <main className="text-center py-20 text-red-500">
        Invalid movie ID.
      </main>
    );
  }

  // Cast the movie result to the detailed interface
  const movie: DetailedMovie = await getMovieDetails(id);
  
  // Cast the related movies result to the response interface
  const related: PopularMoviesResponse = await getPopularMovies(1);

  return (
    <main className="font-sans bg-[#121212] text-[#FBE9E7] min-h-screen px-4 sm:px-8 py-8">
      {/* Watch Now Section */}
      <Section title="Watch Now">
        <div className="w-full aspect-video rounded-md overflow-hidden bg-[#1a1a1a]">
          {/* Ensure VideoPlayer type supports 'movie' and movie.id is available */}
          <VideoPlayer id={movie.id} type="movie" />
        </div>
      </Section>

      {/* Movie Details Section */}
      <Section title="Movie Details">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Info */}
          <div className="md:col-span-1 space-y-4">
            <h1 className="text-2xl font-bold">{movie.title}</h1>
            <p className="text-sm text-[#BCAAA4]">
              {/* Added optional chaining (?) for safer access */}
              {movie.release_date?.slice(0, 4)} • {movie.runtime} min
            </p>
            <div className="flex flex-wrap gap-2">
              {/* Type is explicitly defined for map callback (already correct) */}
              {movie.genres?.map((genre: { id: number; name: string }) => (
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
          {/* ⭐ FIX APPLIED: item is now implicitly typed as PopularMovieItem */}
          {related.results?.slice(0, 10).map((item) => (
            <ContentCard
  key={item.id}
  card={{
    id: item.id,
    title: item.title,
    imageUrl: getTmdbImageUrl(item.poster_path), // ✅ added
    posterUrl: getTmdbImageUrl(item.poster_path), // ✅ kept for consistency
    releaseDate: item.release_date,
    overview: item.overview,
    genre: movie.genres?.[0]?.name || "Unknown", // ✅ added fallback genre
    year: item.release_date?.slice(0, 4) || "N/A", // ✅ derived from release date
    type: "movie",
  }}
            />
          ))}
        </div>
      </Section>
    </main>
  );
}