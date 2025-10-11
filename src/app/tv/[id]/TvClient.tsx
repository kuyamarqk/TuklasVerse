'use client';

import { useState } from 'react';
import Section from '@/component/Section';
import VideoPlayer from '@/component/VideoPlayer';
import SeasonList from '@/component/SeasonList';
import ContentCard from '@/component/ContentCard';
import { getTmdbImageUrl } from '@/lib/tmdb-api';

export default function TvClient({
  tv,
  related,
}: {
  tv: any;
  related: any;
}) {
  const [selectedEpisode, setSelectedEpisode] = useState<{
    season: number;
    episode: number;
  } | null>(null);

  return (
    <main className="font-sans bg-[#121212] text-[#FBE9E7] min-h-screen px-4 sm:px-8 py-8">
      {/* Central Video Player */}
      <Section title="Watch Now">
        <div className="w-full aspect-video rounded-md overflow-hidden bg-[#1a1a1a]">
          <VideoPlayer
            id={tv.id}
            type="tv"
            season={selectedEpisode?.season}
            episode={selectedEpisode?.episode}
          />
        </div>
      </Section>

      {/* Series Details */}
      <Section title="Series Details">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-4">
            <h1 className="text-2xl font-bold">{tv.name}</h1>
            <p className="text-sm text-[#BCAAA4]">
              {tv.first_air_date?.slice(0, 4)} • {tv.episode_run_time?.[0] ?? 'N/A'} min/ep
            </p>
            <div className="flex flex-wrap gap-2">
              {tv.genres?.map((genre: { id: number; name: string }) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 rounded-full bg-[#1a1a1a] text-sm border border-[#333]"
                >
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

      {/* Seasons */}
      <Section title="Seasons">
        <SeasonList seasons={tv.seasons} tvId={tv.id} onSelectEpisode={setSelectedEpisode} />
      </Section>

      {/* Related TV Series */}
      <Section title="Related TV Series" href="/tv-series?filter=popular">
        <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
          {related.results?.slice(0, 10).map((item: any) => (
            <ContentCard
              key={item.id}
              card={{
                id: item.id,
                title: item.name,
                posterUrl: getTmdbImageUrl(item.poster_path),
                releaseDate: item.first_air_date,
                overview: item.overview,
                type: 'tv',
              }}
            />
          ))}
        </div>
      </Section>
    </main>
  );
}
