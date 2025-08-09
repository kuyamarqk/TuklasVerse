// src/app/movie/[id]/page.tsx
// This component remains a Server Component (no "use client")

import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';

// Using alias imports
import RelatedContent from 'components/RelatedContent';
import CommentsSection from 'components/CommentsSection';

// Import TMDB API functions and types
import {
  getMovieDetailsTmdb,
  getMovieRecommendationsTmdb,
  getTmdbImageUrl,
  getTmdbMovieGenres,
  getTmdbGenreNames,
  TmdbGenre,
  TmdbMovieResult
} from 'lib/tmdb-api';
import { ContentCardType } from 'types';

// Interfaces (can be moved to src/types.ts for global use)
interface Comment {
  id: string;
  userId: string;
  userName: string;
  avatarUrl?: string;
  timestamp: string;
  content: string;
}

interface MovieDetailData {
  id: number;
  title: string;
  description: string;
  genres: string[];
  status: string;
  runtime: string;
  releaseDate: string;
  director: string;
  score: number;
  posterImageUrl: string;
  bannerImageUrl: string;
  relatedContent: ContentCardType[];
  comments: Comment[];
}

interface MovieDetailPageProps {
  params: {
    id: string; // The dynamic segment from the URL
  };
}

// Generate dynamic metadata for the movie page
export async function generateMetadata({ params }: MovieDetailPageProps): Promise<Metadata> {
    const movieId = parseInt(params.id, 10);
    let movieTitle = 'Movie Details';
    try {
        const movieDetails = await getMovieDetailsTmdb(movieId);
        movieTitle = movieDetails.title;
    } catch (error) {
        console.error(`Failed to fetch metadata for movie ID ${movieId}:`, error);
    }

    return {
        title: `${movieTitle} - TuklasVerse`,
        description: `Detailed information about the movie ${movieTitle}, including synopsis, cast, and more.`,
    };
}


const MovieDetailPage = async ({ params }: MovieDetailPageProps) => {
  const movieId = parseInt(params.id, 10);
  let movie: MovieDetailData | undefined;
  let allTmdbMovieGenres: TmdbGenre[] = [];

  try {
    const [tmdbDetails, tmdbRecommendations, movieGenres] = await Promise.all([
      getMovieDetailsTmdb(movieId),
      getMovieRecommendationsTmdb(movieId),
      getTmdbMovieGenres()
    ]);

    allTmdbMovieGenres = movieGenres;

    const director = tmdbDetails.credits?.crew.find(
      (person) => person.job === 'Director'
    )?.name || 'N/A';

    movie = {
      id: tmdbDetails.id,
      title: tmdbDetails.title,
      description: tmdbDetails.overview,
      genres: getTmdbGenreNames(tmdbDetails.genres.map(g => g.id), allTmdbMovieGenres),
      status: tmdbDetails.status,
      runtime: tmdbDetails.runtime ? `${tmdbDetails.runtime} min` : 'N/A',
      releaseDate: tmdbDetails.release_date,
      director: director,
      score: tmdbDetails.vote_average || 0,
      posterImageUrl: getTmdbImageUrl(tmdbDetails.poster_path),
      bannerImageUrl: getTmdbImageUrl(tmdbDetails.backdrop_path, 'w1280'),
      relatedContent: tmdbRecommendations.results.slice(0, 10).map((rec: TmdbMovieResult) => ({
        id: rec.id,
        title: rec.title,
        imageUrl: getTmdbImageUrl(rec.poster_path),
        genre: getTmdbGenreNames(rec.genre_ids, allTmdbMovieGenres).join(', '),
        year: rec.release_date ? new Date(rec.release_date).getFullYear().toString() : 'N/A',
        type: 'movie',
        score: rec.vote_average || undefined,
      })),
      comments: [
        {
          id: 'mov_c1',
          userId: 'user-001',
          userName: 'MovieBuff',
          avatarUrl: '/placeholders/avatar-1.jpg',
          timestamp: '2025-07-20T10:30:00Z',
          content: 'Amazing movie! Highly recommend it to everyone.',
        },
        {
          id: 'mov_c2',
          userId: 'user-002',
          userName: 'FilmFanatic',
          avatarUrl: '/placeholders/avatar-2.jpg',
          timestamp: '2025-07-21T14:00:00Z',
          content: 'The cinematography was stunning and the plot kept me on the edge of my seat!',
        },
      ],
    };
  } catch (error) {
    console.error("Failed to fetch movie details:", error);
    movie = undefined;
  }

  const mockIsLoggedIn = true;
  const mockCurrentUserName = "John Doe";
  const mockCurrentUserAvatarUrl = "/placeholders/user-avatar.jpg";


  if (!movie) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-[#FBE9E7] bg-[#3E2723]">
        <p className="text-xl">Movie not found or failed to load data.</p>
        <Link href="/" className="mt-4 text-[#2196F3] hover:underline">Go back home</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#212121]">
      <main className="flex-grow container mx-auto py-8 px-4 text-[#FBE9E7]">
        {/* Breadcrumbs */}
        <div className="mb-6 text-sm text-gray-400">
          <Link href="/" className="hover:underline">Home</Link> &gt;
          <Link href="/movie" className="hover:underline"> Movies</Link> &gt;
          <span> {movie.title}</span>
        </div>

        {/* Banner Image */}
        <div className="relative w-full h-80 rounded-lg overflow-hidden mb-8">
          {movie.bannerImageUrl && (
            <Image
              src={movie.bannerImageUrl}
              alt={`${movie.title} Banner`}
              fill
              className="object-cover object-center"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#212121] via-transparent to-transparent"></div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* LEFT COLUMN: Details */}
          <div className="md:w-1/4 flex-shrink-0">
            <div className="relative w-full h-80 rounded-lg overflow-hidden shadow-lg mb-6">
              {movie.posterImageUrl && (
                <Image
                  src={movie.posterImageUrl}
                  alt={`${movie.title} Poster`}
                  fill
                  className="object-cover object-center"
                  priority
                />
              )}
            </div>
            <div className="bg-[#3E2723] p-4 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-2">{movie.title}</h2>
              <a
                href={`/watch/${movie.id}?contentType=movie`}
                className="inline-block w-full py-3 mb-2 text-center bg-[#FF4500] text-white rounded-md font-bold text-lg hover:bg-[#E63900] transition-colors duration-200"
              >
                Watch Now
              </a>
              <button className="mt-2 w-full py-2 bg-[#2196F3] text-[#FBE9E7] rounded-md hover:bg-[#1A7BC2] transition-colors duration-200">
                Add to Watchlist
              </button>
              <p className="text-lg mt-4 mb-1">Score: <span className="text-[#FFD54F]">{movie.score.toFixed(1)}</span></p>
              <p className="text-sm text-gray-300">Runtime: {movie.runtime}</p>
              <p className="text-sm text-gray-300">Status: {movie.status}</p>
              <p className="text-sm text-gray-300">Release Date: {movie.releaseDate}</p>
              <p className="text-sm text-gray-300">Director: {movie.director}</p>
              <p className="text-sm text-gray-300 mt-2">Genres: {movie.genres.join(', ')}</p>
            </div>
          </div>

          {/* Right Column: Synopsis, Related, Comments */}
          <div className="md:w-3/4">
            <div className="bg-[#3E2723] p-6 rounded-lg shadow-md mb-8">
              <h3 className="text-xl font-semibold mb-4">Synopsis</h3>
              <p className="text-gray-200 leading-relaxed">
                {movie.description}
              </p>
            </div>

            {/* RelatedContent component */}
            {movie.relatedContent && movie.relatedContent.length > 0 && (
              <RelatedContent title="More Like This" content={movie.relatedContent} />
            )}

            {/* CommentsSection component */}
            <CommentsSection
              contentId={movie.id}
              initialComments={movie.comments}
              isLoggedIn={mockIsLoggedIn}
              currentUserName={mockCurrentUserName}
              currentUserAvatarUrl={mockCurrentUserAvatarUrl}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MovieDetailPage;