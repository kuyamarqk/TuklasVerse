// app/movie/[id]/page.tsx
import { getMovieDetails, getPopularMovies, getTmdbImageUrl } from '@/lib/tmdb-api';
import ContentCard from '@/component/ContentCard';
import Section from '@/component/Section';
import ReactPlayer from 'react-player';
import VideoPlayer from '@/component/VideoPlayer';

interface MoviePageProps {
  params: { id: string };
}

export default async function MoviePage(props: MoviePageProps) {
  const { id } = await props.params;

  if (!id || isNaN(Number(id))) {
    return (
      <main className="text-center py-20 text-red-500">
        Invalid movie ID.
      </main>
    );
  }

  const movie = await getMovieDetails(id);
  const related = await getPopularMovies(1);

  return (
    <main className="font-sans bg-[#121212] text-[#FBE9E7] min-h-screen px-4 sm:px-8 py-8">
      {/* Watch Now Section */}
      <Section title="Watch Now">
        <div className="w-full aspect-video rounded-md overflow-hidden bg-[#1a1a1a]">
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
              {movie.release_date?.slice(0, 4)} • {movie.runtime} min
            </p>
            <div className="flex flex-wrap gap-2">
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
          {related.results?.slice(0, 10).map((item: any) => (
            <ContentCard
              key={item.id}
              card={{
                id: item.id,
                title: item.title,
                posterUrl: getTmdbImageUrl(item.poster_path),
                releaseDate: item.release_date,
                overview: item.overview,
                type: 'movie',
              }}
            />
          ))}
        </div>
      </Section>
    </main>
  );
}
