'use client';

import { useState } from 'react';
import Section from '@/component/Section';
import ContentCard from '@/component/ContentCard';
import SeasonList from '@/component/SeasonList';
import { getTmdbImageUrl } from '@/lib/tmdb-api';
import VideoPlayer from '@/component/VideoPlayer';

// ====================================================================
// Type Definitions
// ====================================================================

interface TvDetails {
  id: number;
  name: string;
  first_air_date: string;
  episode_run_time?: number[];
  overview: string;
  genres?: { id: number; name: string }[];
  seasons: {
    season_number: number;
    name: string;
    episode_count: number;
    overview: string;
    poster_path: string | null;
  }[];
}

interface RelatedTvItem {
  id: number;
  name: string;
  poster_path: string | null;
  first_air_date: string;
  overview: string;
}

interface RelatedTvResponse {
  page: number;
  results: RelatedTvItem[];
  total_pages: number;
  total_results: number;
}

// ====================================================================
// Component
// ====================================================================

export default function TvClient({
  tv,
  related,
}: {
  tv: TvDetails;
  related: RelatedTvResponse;
}) {
  const [selectedEpisode, setSelectedEpisode] = useState<{ season: number; episode: number } | null>(null);

  return (
    <main className="relative font-sans bg-[#121212] text-[#FBE9E7] min-h-screen px-4 sm:px-8 py-8">
      {/* Series Details */}
      <Section title="Series Details">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-4">
            <h1 className="text-2xl font-bold">{tv.name}</h1>
            <p className="text-sm text-[#BCAAA4]">
              {tv.first_air_date?.slice(0, 4)} • {tv.episode_run_time?.[0] ?? 'N/A'} min/ep
            </p>
            <div className="flex flex-wrap gap-2">
              {tv.genres?.map((genre) => (
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
        <SeasonList
          seasons={tv.seasons}
          tvId={tv.id}
          onSelectEpisode={setSelectedEpisode}
        />
      </Section>

      {/* Related TV Series */}
      <Section title="Related TV Series" href="/tv-series?filter=popular">
        <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
          {related.results?.slice(0, 10).map((item) => {
            const posterUrl = getTmdbImageUrl(item.poster_path);
            return (
              <ContentCard
                key={item.id}
                card={{
                  id: item.id,
                  title: item.name ?? 'Untitled',
                  posterUrl,
                  imageUrl: posterUrl,
                  releaseDate: item.first_air_date ?? 'N/A',
                  overview: item.overview ?? '',
                  genre: 'Unknown',
                  year: item.first_air_date?.slice(0, 4) ?? 'N/A',
                  type: 'tv',
                }}
              />
            );
          })}
        </div>
      </Section>

      {/* Floating Mini Player */}
      {selectedEpisode && (
        <div className="fixed bottom-4 right-4 bg-[#1a1a1a] border border-[#333] rounded-xl shadow-lg overflow-hidden w-[360px] sm:w-[420px]">
          <div className="flex justify-between items-center p-2 border-b border-[#333]">
            <p className="text-sm text-[#FBE9E7]">
              S{selectedEpisode.season} • E{selectedEpisode.episode}
            </p>
            <button
              onClick={() => setSelectedEpisode(null)}
              className="text-[#FFAB91] hover:text-[#FF7043] text-xs"
            >
              ✕ Close
            </button>
          </div>
          <VideoPlayer
            id={tv.id}
            type="tv"
            season={selectedEpisode.season}
            episode={selectedEpisode.episode}
          />
        </div>
      )}
    </main>
  );
}
