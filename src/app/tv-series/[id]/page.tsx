// src/app/tv-series/[id]/page.tsx
// This component remains a Server Component (no "use client")

import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';

// Using alias imports
import RelatedContent from 'components/RelatedContent';
import CommentsSection from 'components/CommentsSection';
import EpisodeList from 'components/EpisodeList'; // Import the new EpisodeList component

// Import TMDB API functions and types for TV Series
import {
  getTvSeriesDetailsTmdb,
  getTvSeriesRecommendationsTmdb,
  getTmdbTvGenres,
  getTmdbGenreNames,
  getTmdbImageUrl,
  TmdbTvSeriesResult,
  TmdbGenre,
} from 'lib/tmdb-api';

import {
  TvSeriesDetailData,
  DetailPageProps,
  ContentCardType,
  Comment,
} from 'types';

// Generate dynamic metadata for the TV series page
export async function generateMetadata({ params }: DetailPageProps): Promise<Metadata> {
  const seriesId = parseInt(params.id, 10);
  let seriesTitle = 'TV Series Details';

  try {
    const seriesDetails = await getTvSeriesDetailsTmdb(seriesId);
    seriesTitle = seriesDetails.name;
  } catch (error) {
    console.error(`Failed to fetch metadata for TV series ID ${seriesId}:`, error);
  }

  return {
    title: `${seriesTitle} - TuklasVerse`,
    description: `Detailed information about the TV series ${seriesTitle}, including synopsis, seasons, and more.`,
  };
}

const TvSeriesDetailPage = async ({ params }: DetailPageProps) => {
  const seriesId = parseInt(params.id, 10);
  let tvSeries: TvSeriesDetailData | undefined;
  let allTmdbTvGenres: TmdbGenre[] = [];

  try {
    const [tmdbDetails, tmdbRecommendations, tvGenres] = await Promise.all([
      getTvSeriesDetailsTmdb(seriesId),
      getTvSeriesRecommendationsTmdb(seriesId),
      getTmdbTvGenres(),
    ]);

    allTmdbTvGenres = tvGenres;

    tvSeries = {
      id: tmdbDetails.id,
      title: tmdbDetails.name,
      description: tmdbDetails.overview,
      genres: getTmdbGenreNames(tmdbDetails.genres.map(g => g.id), allTmdbTvGenres),
      status: tmdbDetails.status,
      firstAirDate: tmdbDetails.first_air_date,
      lastAirDate: tmdbDetails.last_air_date,
      numberOfEpisodes: tmdbDetails.number_of_episodes,
      numberOfSeasons: tmdbDetails.number_of_seasons,
      episodeRunTime:
        tmdbDetails.episode_run_time?.length > 0
          ? `${Math.min(...tmdbDetails.episode_run_time)}-${Math.max(...tmdbDetails.episode_run_time)} min`
          : 'N/A',
      creators: tmdbDetails.created_by.map(c => c.name),
      score: tmdbDetails.vote_average || 0,
      posterImageUrl: getTmdbImageUrl(tmdbDetails.poster_path),
      bannerImageUrl: getTmdbImageUrl(tmdbDetails.backdrop_path, 'w1280'),
      seasons: tmdbDetails.seasons,
      relatedContent: tmdbRecommendations.results.slice(0, 10).map((rec: TmdbTvSeriesResult) => ({
        id: rec.id,
        title: rec.name,
        imageUrl: getTmdbImageUrl(rec.poster_path),
        genre: getTmdbGenreNames(rec.genre_ids, allTmdbTvGenres).join(', '),
        year: rec.first_air_date ? new Date(rec.first_air_date).getFullYear().toString() : 'N/A',
        type: 'tv-series',
        score: rec.vote_average || undefined,
      })),
      comments: [
        {
          id: 'tv_c1',
          userId: 'user-003',
          userName: 'SeriesWatcher',
          avatarUrl: '/placeholders/avatar-3.jpg',
          timestamp: '2025-07-22T09:00:00Z',
          content: 'Binged the entire series in a weekend, absolutely hooked!',
        },
        {
          id: 'tv_c2',
          userId: 'user-004',
          userName: 'TvShowAddict',
          avatarUrl: '/placeholders/avatar-4.jpg',
          timestamp: '2025-07-23T16:45:00Z',
          content: 'The character development is superb!',
        },
      ] as Comment[],
    };
  } catch (error) {
    console.error('Failed to fetch TV series details:', error);
    tvSeries = undefined;
  }

  const mockIsLoggedIn = true;
  const mockCurrentUserName = 'Jane Doe';
  const mockCurrentUserAvatarUrl = '/placeholders/user-avatar-female.jpg';

  if (!tvSeries) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-[#FBE9E7] bg-[#3E2723]">
        <p className="text-xl">TV Series not found or failed to load data.</p>
        <Link href="/" className="mt-4 text-[#2196F3] hover:underline">
          Go back home
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#212121]">
      <main className="flex-grow container mx-auto py-8 px-4 text-[#FBE9E7]">
        {/* Breadcrumbs */}
        <div className="mb-6 text-sm text-gray-400">
          <Link href="/" className="hover:underline">
            Home
          </Link>{' '}
          &gt;
          <Link href="/tv-series" className="hover:underline">
            {' '}
            TV Series
          </Link>{' '}
          &gt; <span> {tvSeries.title}</span>
        </div>

        {/* Banner Image */}
        <div className="relative w-full h-80 rounded-lg overflow-hidden mb-8">
          {tvSeries.bannerImageUrl && (
            <Image
              src={tvSeries.bannerImageUrl}
              alt={`${tvSeries.title} Banner`}
              fill
              className="object-cover object-center"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#212121] via-transparent to-transparent"></div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* LEFT COLUMN */}
          <div className="md:w-1/4 flex-shrink-0">
            <div className="relative w-full h-80 rounded-lg overflow-hidden shadow-lg mb-6">
              {tvSeries.posterImageUrl && (
                <Image
                  src={tvSeries.posterImageUrl}
                  alt={`${tvSeries.title} Poster`}
                  fill
                  className="object-cover object-center"
                  priority
                />
              )}
            </div>
            <div className="bg-[#3E2723] p-4 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-2">{tvSeries.title}</h2>
              <p className="text-lg mb-1">
                Score: <span className="text-[#FFD54F]">{tvSeries.score.toFixed(1)}</span>
              </p>
              <p className="text-sm text-gray-300">Episodes: {tvSeries.numberOfEpisodes}</p>
              <p className="text-sm text-gray-300">Seasons: {tvSeries.numberOfSeasons}</p>
              <p className="text-sm text-gray-300">Runtime: {tvSeries.episodeRunTime}</p>
              <p className="text-sm text-gray-300">Status: {tvSeries.status}</p>
              <p className="text-sm text-gray-300">First Air Date: {tvSeries.firstAirDate}</p>
              {tvSeries.lastAirDate && <p className="text-sm text-gray-300">Last Air Date: {tvSeries.lastAirDate}</p>}
              <p className="text-sm text-gray-300">Creators: {tvSeries.creators.join(', ') || 'N/A'}</p>
              <p className="text-sm text-gray-300 mt-2">Genres: {tvSeries.genres.join(', ')}</p>
              <Link
                href={`/watch/${tvSeries.id}`}
                className="inline-block w-full py-3 mb-2 text-center bg-[#FF4500] text-white rounded-md font-bold text-lg hover:bg-[#E63900] transition-colors duration-200"
              >
                Watch now
              </Link>
              <button className="mt-4 w-full py-2 bg-[#2196F3] text-[#FBE9E7] rounded-md hover:bg-[#1A7BC2] transition-colors duration-200">
                Add to Watchlist
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="md:w-3/4">
            <div className="bg-[#3E2723] p-6 rounded-lg shadow-md mb-8">
              <h3 className="text-xl font-semibold mb-4">Synopsis</h3>
              <p className="text-gray-200 leading-relaxed">{tvSeries.description}</p>
            </div>

            {/* EpisodeList component */}
            {tvSeries.seasons && tvSeries.seasons.length > 0 && (
              <EpisodeList seriesId={tvSeries.id} seasons={tvSeries.seasons} />
            )}

            {/* RelatedContent component */}
            {tvSeries.relatedContent && tvSeries.relatedContent.length > 0 && (
              <RelatedContent title="More Like This" content={tvSeries.relatedContent} />
            )}

            {/* CommentsSection component */}
            <CommentsSection
              contentId={tvSeries.id}
              initialComments={tvSeries.comments}
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

export default TvSeriesDetailPage;
