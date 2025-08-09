// src/app/anime/[id]/page.tsx
import Image from 'next/image';
import Link from 'next/link';

import AnimeEpisodeList from 'components/AnimeEpisodeList';  // <-- updated import
import RelatedContent from 'components/RelatedContent';
import CommentsSection from 'components/CommentsSection';

import {
  getAnimeDetailsJikan,
  getAnimeRecommendationsJikan,
  getJikanImageUrl,
  JikanAnimeRecommendation,
} from 'lib/jikan-api';

import type {
  AnimeDetailPageProps,
  AnimeDetailData,
} from 'types';

const AnimeDetailPage = async ({ params }: AnimeDetailPageProps) => {
  const animeId = parseInt(params.id, 10);
  let anime: AnimeDetailData | undefined;

  try {
    const [detailsRes, recsRes] = await Promise.all([
      getAnimeDetailsJikan(animeId),
      getAnimeRecommendationsJikan(animeId),
    ]);
    const jikanDetails = detailsRes.data;
    const jikanRecommendations = recsRes.data;

    anime = {
      id: jikanDetails.mal_id,
      title: jikanDetails.title,
      description: jikanDetails.synopsis,
      genres: jikanDetails.genres.map(g => g.name),
      status: jikanDetails.status,
      episodesCount: jikanDetails.episodes || 0,
      aired: jikanDetails.aired.string || 'N/A',
      studio: jikanDetails.studios.length > 0 ? jikanDetails.studios[0].name : 'N/A',
      score: jikanDetails.score || 0,
      posterImageUrl: getJikanImageUrl(jikanDetails.images),
      bannerImageUrl: jikanDetails.images.jpg.large_image_url,

      episodes: Array.from({ length: jikanDetails.episodes || 0 }).map((_, i) => ({
        id: (jikanDetails.mal_id * 1000) + i + 1,
        name: `Episode ${i + 1}`,          // <-- must be "name"
        episode_number: i + 1,             // <-- must be "episode_number"
        overview: '',                      // optional
        air_date: undefined,               // optional
      })),

      relatedContent: jikanRecommendations.slice(0, 10).map((rec: JikanAnimeRecommendation) => ({
        id: rec.entry.mal_id,
        title: rec.entry.title,
        imageUrl: rec.entry.images.jpg.small_image_url,
        genre: 'Anime',
        year: 'N/A',
        type: 'anime',
        score: undefined,
      })),

      comments: [
        {
          id: 'c1',
          userId: 'user-001',
          userName: 'AnimeFanatic',
          avatarUrl: '/placeholders/avatar-1.jpg',
          timestamp: '2025-07-20T10:00:00Z',
          content: 'Absolutely loved the final part! What an epic conclusion to an amazing series.',
        },
        {
          id: 'c2',
          userId: 'user-002',
          userName: 'MangaReader',
          avatarUrl: '/placeholders/avatar-2.jpg',
          timestamp: '2025-07-21T14:30:00Z',
          content: 'The animation was stunning, MAPPA did an incredible job. Highly recommended!',
        },
      ],
    };
  } catch (error) {
    console.error("Failed to fetch anime details:", error);
    anime = undefined;
  }

  const mockIsLoggedIn = true;
  const mockCurrentUserName = "John Doe";
  const mockCurrentUserAvatarUrl = "/placeholders/user-avatar.jpg";

  if (!anime) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-[#FBE9E7] bg-[#3E2723]">
        <p className="text-xl">Anime not found or failed to load data.</p>
        <Link href="/anime" className="mt-4 text-[#2196F3] hover:underline">Go back to Anime</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#212121]">
      <main className="flex-grow container mx-auto py-8 px-4 text-[#FBE9E7]">
        <div className="mb-6 text-sm text-gray-400">
          <Link href="/" className="hover:underline">Home</Link> &gt;
          <Link href="/anime" className="hover:underline"> Anime</Link> &gt;
          <span> {anime.title}</span>
        </div>

        <div className="relative w-full h-80 rounded-lg overflow-hidden mb-8">
          {anime.bannerImageUrl && (
            <Image
              src={anime.bannerImageUrl}
              alt={`${anime.title} Banner`}
              fill
              className="object-cover object-center"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#212121] via-transparent to-transparent" />
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/4 flex-shrink-0">
            <div className="relative w-full h-80 rounded-lg overflow-hidden shadow-lg mb-6">
              {anime.posterImageUrl && (
                <Image
                  src={anime.posterImageUrl}
                  alt={`${anime.title} Poster`}
                  fill
                  className="object-cover object-center"
                  priority
                />
              )}
            </div>
            <div className="bg-[#3E2723] p-4 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-2">{anime.title}</h2>
              <p className="text-lg mb-1">Score: <span className="text-[#FFD54F]">{anime.score.toFixed(1)}</span></p>
              <p className="text-sm text-gray-300">Episodes: {anime.episodesCount}</p>
              <p className="text-sm text-gray-300">Status: {anime.status}</p>
              <p className="text-sm text-gray-300">Aired: {anime.aired}</p>
              <p className="text-sm text-gray-300">Studio: {anime.studio || 'N/A'}</p>
              <p className="text-sm text-gray-300 mt-2">Genres: {anime.genres.join(', ')}</p>
              <Link href={`/watch/${anime.id}`} className="inline-block w-full py-3 mb-2 text-center bg-[#FF4500] text-white rounded-md font-bold text-lg hover:bg-[#E63900] transition-colors duration-200">
                Watch now
              </Link>
              <button className="mt-4 w-full py-2 bg-[#2196F3] text-[#FBE9E7] rounded-md hover:bg-[#1A7BC2] transition-colors duration-200">
                Add to Watchlist
              </button>
            </div>
          </div>

          <div className="md:w-3/4">
            <div className="bg-[#3E2723] p-6 rounded-lg shadow-md mb-8">
              <h3 className="text-xl font-semibold mb-4">Synopsis</h3>
              <p className="text-gray-200 leading-relaxed">{anime.description}</p>
            </div>

            {/* Use the AnimeEpisodeList here */}
            {anime.episodes.length > 0 && (
              <AnimeEpisodeList episodes={anime.episodes} animeId={anime.id} />
            )}

            {anime.relatedContent.length > 0 && (
              <RelatedContent title="More Like This" content={anime.relatedContent} />
            )}

            <CommentsSection
              contentId={anime.id}
              initialComments={anime.comments}
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

export default AnimeDetailPage;
