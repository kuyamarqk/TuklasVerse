'use client';

import { getTmdbImageUrl } from '@/lib/tmdb-api';
import ContentCard from '@/component/ContentCard';
import Section from '@/component/Section';
import VideoPlayer from '@/component/VideoPlayer';

// Reuse the interfaces you defined
interface PopularTvItem {
  id: number;
  name: string;
  poster_path: string | null;
  first_air_date: string;
  overview: string;
}

interface DetailedTv {
  id: number;
  name: string;
  first_air_date: string;
  number_of_seasons: number;
  number_of_episodes: number;
  overview: string;
  genres: { id: number; name: string }[];
}

interface TvClientProps {
  tv: DetailedTv;
  related: PopularTvItem[];
  season: number;
  episode: number;
}

export default function TvClient({ tv, related, season, episode }: TvClientProps) {
  return (
    <main className="font-sans bg-[#121212] text-[#FBE9E7] min-h-screen px-4 sm:px-8 py-8">
      {/* Watch Now Section */}
      <Section title={`Watching: ${tv.name}`}>
        <VideoPlayer 
          id={tv.id} 
          type="tv" 
          season={season} 
          episode={episode} 
        />
        <p className="mt-4 text-sm text-[#FF8A65] font-medium">
          Season {season}, Episode {episode}
        </p>
      </Section>

      {/* TV Details Section */}
      <Section title="Series Details">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-4">
            <h1 className="text-2xl font-bold">{tv.name}</h1>
            <p className="text-sm text-[#BCAAA4]">
              {tv.first_air_date?.slice(0, 4)} • {tv.number_of_seasons} Seasons • {tv.number_of_episodes} Episodes
            </p>
            <div className="flex flex-wrap gap-2">
              {tv.genres?.map((genre) => (
                <span key={genre.id} className="px-3 py-1 rounded-full bg-[#1a1a1a] text-sm border border-[#333]">
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-2">Overview</h2>
            <p className="text-[#BCAAA4] leading-relaxed">{tv.overview}</p>
          </div>
        </div>
      </Section>

      {/* Related TV Shows Section */}
      <Section title="Related Series" href="/tv">
        <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
          {related.slice(0, 10).map((item) => (
            <ContentCard
              key={item.id}
              card={{
                id: item.id,
                title: item.name,
                imageUrl: getTmdbImageUrl(item.poster_path),
                posterUrl: getTmdbImageUrl(item.poster_path),
                releaseDate: item.first_air_date,
                overview: item.overview,
                genre: tv.genres?.[0]?.name || "Unknown",
                year: item.first_air_date?.slice(0, 4) || "N/A",
                type: "tv",
              }}
            />
          ))}
        </div>
      </Section>
    </main>
  );
}