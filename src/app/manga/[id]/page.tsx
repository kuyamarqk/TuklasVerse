// src/app/anime/[id]/page.tsx
// This component remains a Server Component (no "use client")

import Image from 'next/image';
import Link from 'next/link';

// Using alias imports as per your setup
import EpisodeList from 'components/EpisodeList';
import RelatedContent from 'components/RelatedContent';
import CommentsSection from 'components/CommentsSection';

// Define the Comment interface (can be here or in a shared types file)
interface Comment {
  id: string;
  userId: string;
  userName: string;
  avatarUrl?: string;
  timestamp: string;
  content: string;
}

// Define the Episode interface (can be here or in a shared types file)
interface Episode {
  episodeNumber: number;
  title: string;
  duration?: string;
  releaseDate?: string;
  id: number;
}

// Define RelatedContentItem (can be here or in a shared types file)
interface RelatedContentItem {
  id: number;
  title: string;
  imageUrl: string;
  genre: string;
  year: string;
  type: 'anime' | 'movie' | 'tv-series' | 'manga' | 'blog';
}

// Update AnimeDetailData to include comments and related content
interface AnimeDetailData {
  id: number;
  title: string;
  description: string;
  genres: string[];
  status: string;
  episodesCount: number;
  aired: string;
  studio: string;
  score: number;
  posterImageUrl: string;
  bannerImageUrl: string;
  episodes: Episode[];
  relatedContent: RelatedContentItem[];
  comments: Comment[];
}

// Mock database/API call function (remains the same)
const getAnimeById = (id: number): AnimeDetailData | undefined => {
  const dummyAnimeData: AnimeDetailData[] = [
    {
      id: 1,
      title: 'Attack on Titan Season 4 Part 3',
      description: 'The war for Paradis continues. With Eren Jaeger leading the Rumbling, the fate of the world hangs in the balance. Will the Survey Corps be able to stop him?',
      genres: ['Action', 'Military', 'Mystery', 'Super Power', 'Drama', 'Fantasy', 'Shounen'],
      status: 'Completed',
      episodesCount: 28,
      aired: 'Dec 7, 2020 to Nov 4, 2023',
      studio: 'MAPPA',
      score: 9.0,
      posterImageUrl: '/placeholders/anime-aot-detail.jpg',
      bannerImageUrl: '/placeholders/anime-aot-banner.jpg',
      episodes: [
        { id: 1, episodeNumber: 1, title: 'The Other Side of the Sea', duration: '24 min', releaseDate: 'Dec 7, 2020' },
        { id: 2, episodeNumber: 2, title: 'Midnight Train', duration: '24 min', releaseDate: 'Dec 14, 2020' },
        { id: 3, episodeNumber: 3, title: 'The Door of Hope', duration: '24 min', releaseDate: 'Dec 21, 2020' },
        { id: 4, episodeNumber: 4, title: 'From One Hand to Another', duration: '24 min', releaseDate: 'Dec 28, 2020' },
        { id: 5, episodeNumber: 5, title: 'Declaration of War', duration: '24 min', releaseDate: 'Jan 10, 2021' },
        { id: 6, episodeNumber: 6, title: 'The War Hammer Titan', duration: '24 min', releaseDate: 'Jan 17, 2021' },
      ],
      relatedContent: [
        {
          id: 101,
          title: 'Jujutsu Kaisen Season 2',
          imageUrl: '/placeholders/anime-jujutsukaisen.jpg',
          genre: 'Action, Supernatural',
          year: '2023',
          type: 'anime',
        },
        {
          id: 102,
          title: 'Chainsaw Man Vol. 1',
          imageUrl: '/placeholders/manga-chainsawman.jpg',
          genre: 'Action, Horror',
          year: '2020',
          type: 'manga',
        },
        {
          id: 103,
          title: 'Spider-Man: Across the Spider-Verse',
          imageUrl: '/placeholders/movie-spiderman.jpg',
          genre: 'Animation, Action',
          year: '2023',
          type: 'movie',
        },
        {
          id: 104,
          title: 'Squid Game',
          imageUrl: '/placeholders/tvseries-squidgame.jpg',
          genre: 'Thriller, Drama',
          year: '2021',
          type: 'tv-series',
        },
        {
          id: 105,
          title: 'Berserk Vol. 1',
          imageUrl: '/placeholders/manga-berserk.jpg',
          genre: 'Dark Fantasy, Adventure',
          year: '1990',
          type: 'manga',
        },
      ],
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
        {
          id: 'c3',
          userId: 'user-003',
          userName: 'CriticGamer',
          avatarUrl: '/placeholders/avatar-3.jpg',
          timestamp: '2025-07-22T08:15:00Z',
          content: 'A bit rushed at the end for my taste, but overall a solid experience. Will rewatch for sure.',
        },
      ],
    },
  ];
  return dummyAnimeData.find(anime => anime.id === id);
};

interface AnimeDetailPageProps {
  params: {
    id: string; // The dynamic segment from the URL
  };
}

const AnimeDetailPage: React.FC<AnimeDetailPageProps> = ({ params }) => {
  const animeId = parseInt(params.id, 10);
  const anime = getAnimeById(animeId);

  // Mock isLoggedIn state for demonstration
  const mockIsLoggedIn = true;
  const mockCurrentUserName = "John Doe";
  const mockCurrentUserAvatarUrl = "/placeholders/user-avatar.jpg";

  if (!anime) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-[#FBE9E7] bg-[#3E2723]">
        <p className="text-xl">Anime not found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#212121]">
      <main className="flex-grow container mx-auto py-8 px-4 text-[#FBE9E7]">
        {/* Breadcrumbs */}
        <div className="mb-6 text-sm text-gray-400">
          <Link href="/" className="hover:underline">Home</Link> &gt;
          <Link href="/anime" className="hover:underline"> Anime</Link> &gt;
          <span> {anime.title}</span>
        </div>

        {/* Banner Image */}
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
          <div className="absolute inset-0 bg-gradient-to-t from-[#212121] via-transparent to-transparent"></div>
        </div>

        {/* Main Content Area: Left Column (Details) and Right Column (Synopsis, Episodes, Related, Comments) */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* ⭐ LEFT COLUMN: Details - REINSTATED ⭐ */}
          <div className="md:w-1/4 flex-shrink-0">
            <div className="relative w-full h-80 rounded-lg overflow-hidden shadow-lg mb-6">
              {anime.posterImageUrl && (
                <Image
                  src={anime.posterImageUrl}
                  alt={`${anime.title} Poster`}
                  fill
                  className="object-cover object-center"
                />
              )}
            </div>
            <div className="bg-[#3E2723] p-4 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-2">{anime.title}</h2>
              <p className="text-lg mb-1">Score: <span className="text-[#FFD54F]">{anime.score}</span></p>
              <p className="text-sm text-gray-300">Episodes: {anime.episodesCount}</p>
              <p className="text-sm text-gray-300">Status: {anime.status}</p>
              <p className="text-sm text-gray-300">Aired: {anime.aired}</p>
              <p className="text-sm text-gray-300">Studio: {anime.studio}</p>
              <p className="text-sm text-gray-300 mt-2">Genres: {anime.genres.join(', ')}</p>
              <button className="mt-4 w-full py-2 bg-[#2196F3] text-[#FBE9E7] rounded-md hover:bg-[#1A7BC2] transition-colors duration-200">
                Add to Watchlist
              </button>
            </div>
          </div>

          {/* Right Column: Synopsis, Episodes, Related, Comments */}
          <div className="md:w-3/4">
            <div className="bg-[#3E2723] p-6 rounded-lg shadow-md mb-8">
              <h3 className="text-xl font-semibold mb-4">Synopsis</h3>
              <p className="text-gray-200 leading-relaxed">
                {anime.description}
              </p>
            </div>

            {/* EpisodeList component */}
            {anime.episodes && anime.episodes.length > 0 && (
              <EpisodeList episodes={anime.episodes} />
            )}

            {/* RelatedContent component */}
            {anime.relatedContent && anime.relatedContent.length > 0 && (
              <RelatedContent title="More Like This" content={anime.relatedContent} />
            )}

            {/* CommentsSection component */}
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
      {/* Header and Footer are handled by layout.tsx */}
    </div>
  );
};

export default AnimeDetailPage;