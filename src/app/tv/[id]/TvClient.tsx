// src/app/tv/[id]/TvClient.tsx
'use client';

import { useState } from 'react';
import Section from '@/component/Section';
import VideoPlayer from '@/component/VideoPlayer';
import SeasonList from '@/component/SeasonList';
import ContentCard from '@/component/ContentCard';
import { getTmdbImageUrl } from '@/lib/tmdb-api';

// ====================================================================
// ⭐ NEW: Type Definitions for Props
// ====================================================================

// 1. Interface for the main TV Show Details object (from the 'tv' prop)
interface TvDetails {
  id: number;
  name: string;
  first_air_date: string;
  episode_run_time?: number[]; // Optional array of run times
  overview: string;
  genres?: { id: number; name: string }[];
  seasons: {
    id: number;
    season_number: number;
    // Add other season properties if needed
  }[];
  // Add other properties used in your component (like poster_path, etc.)
}

// 2. Interface for a single Related TV Show item
interface RelatedTvItem {
  id: number;
  name: string; // TMDB uses 'name' for TV series titles
  poster_path: string | null;
  first_air_date: string;
  overview: string;
}

// 3. Interface for the entire Related TV Series API response
interface RelatedTvResponse {
  page: number;
  results: RelatedTvItem[];
  total_pages: number;
  total_results: number;
}

// ====================================================================
// ⭐ UPDATED: Component Props and Mapping Function
// ====================================================================

export default function TvClient({
  tv, // ⭐ Replaced 'any' with TvDetails
  related, // ⭐ Replaced 'any' with RelatedTvResponse
}: {
  tv: TvDetails;
  related: RelatedTvResponse;
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
              {/* Type assertion is no longer needed here, but kept for safety */}
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
          {/* ⭐ FIX APPLIED: Removed ': any' - 'item' is now implicitly RelatedTvItem */}
          {related.results?.slice(0, 10).map((item) => (
            <ContentCard
              key={item.id}
              card={{
                id: item.id,
                title: item.name, // Use 'name' for TV series
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