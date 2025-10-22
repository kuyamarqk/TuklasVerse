// src/app/tv/[id]/SeasonList.tsx (Corrected)
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getTmdbImageUrl } from '@/lib/tmdb-api';
import VideoPlayer from './VideoPlayer';

// ====================================================================
// ⭐ NEW: Type Definitions for Episodes
// ====================================================================

interface Episode {
  id: number;
  episode_number: number;
  name: string;
  overview: string;
  still_path: string | null;
  // Add any other properties your component uses from the episode object
}

// ----------------------------------------------------------------------

export default function SeasonList({
  seasons,
  tvId,
}: {
  seasons: {
    season_number: number;
    name: string;
    episode_count: number;
    overview: string;
    poster_path: string | null;
  }[];
  tvId: number;
  // NOTE: If you had an onSelectEpisode prop, it would be added here:
  // onSelectEpisode: (data: { season: number; episode: number } | null) => void;
}) {
  const [expandedSeason, setExpandedSeason] = useState<number | null>(null);
  
  // ⭐ FIX LINE 22: Replace any[] with Episode[]
  const [episodes, setEpisodes] = useState<Record<number, Episode[]>>({}); 
  
  const [activeEpisode, setActiveEpisode] = useState<{ season: number; episode: number } | null>(null);

  const handleToggle = async (seasonNumber: number) => {
    if (expandedSeason === seasonNumber) {
      setExpandedSeason(null);
      return;
    }

    if (!episodes[seasonNumber]) {
      // NOTE: Assuming your API route returns an object like { episodes: [Episode, ...] }
      const data: { episodes: Episode[] } = await fetch(`/api/season/${tvId}/${seasonNumber}`).then(res => res.json());
      setEpisodes((prev) => ({ ...prev, [seasonNumber]: data.episodes }));
    }

    setExpandedSeason(seasonNumber);
  };

  return (
    <div className="space-y-6">
      {seasons.map((season) => (
        <div key={season.season_number} className="bg-[#1a1a1a] rounded-md p-4 border border-[#333]">
          <div className="flex gap-4 items-start">
            {season.poster_path && (
              <Image
                src={getTmdbImageUrl(season.poster_path)}
                alt={season.name}
                width={100}
                height={150}
                className="rounded-md object-cover"
              />
            )}
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{season.name}</h3>
              <p className="text-sm text-[#BCAAA4] mb-2">{season.episode_count} episodes</p>
              <p className="text-sm text-[#BCAAA4]">{season.overview}</p>
              <button
                onClick={() => handleToggle(season.season_number)}
                className="mt-2 text-sm text-[#FFAB91] hover:text-[#FF7043] transition"
              >
                {expandedSeason === season.season_number ? 'Hide Episodes' : 'View Episodes'}
              </button>
            </div>
          </div>

          {/* Episode List */}
          {expandedSeason === season.season_number && episodes[season.season_number] && (
            <ul className="mt-4 space-y-4 text-sm text-[#FBE9E7]">
              {/* ⭐ FIX LINE 69: Removed : any, now implicitly typed as Episode */}
              {episodes[season.season_number].map((ep) => (
                <li key={ep.id} className="border-b border-[#333] pb-4">
                  <div className="flex gap-4 items-start">
                    {ep.still_path && (
                      <Image
                        src={getTmdbImageUrl(ep.still_path)}
                        alt={ep.name}
                        width={160}
                        height={90}
                        className="rounded-md object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <strong>Episode {ep.episode_number}: {ep.name}</strong>
                      <p className="text-[#BCAAA4]">{ep.overview}</p>
                      <button
                        onClick={() => setActiveEpisode({ season: season.season_number, episode: ep.episode_number })}
                        className="mt-2 text-sm text-[#FFAB91] hover:text-[#FF7043] transition"
                      >
                        ▶ Watch
                      </button>
                    </div>
                  </div>

                  {/* Inline Video Player */}
                  {activeEpisode?.season === season.season_number && activeEpisode?.episode === ep.episode_number && (
                    <div className="mt-4">
                      <VideoPlayer id={tvId} type="tv" season={season.season_number} episode={ep.episode_number} />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}