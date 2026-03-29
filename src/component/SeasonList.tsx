'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getTmdbImageUrl } from '@/lib/tmdb-api';

// ====================================================================
// ⭐ Type Definitions
// ====================================================================

interface Episode {
  id: number;
  episode_number: number;
  name: string;
  overview: string;
  still_path: string | null;
}

interface Season {
  season_number: number;
  name: string;
  episode_count: number;
  overview: string;
  poster_path: string | null;
}

interface SeasonListProps {
  seasons: Season[];
  tvId: number;
  onSelectEpisode: (data: { season: number; episode: number }) => void;
}

// ====================================================================
// 🌟 Component
// ====================================================================

export default function SeasonList({ seasons, tvId, onSelectEpisode }: SeasonListProps) {
  // Initialize with the first season number
  const [selectedSeason, setSelectedSeason] = useState<number>(seasons[0]?.season_number || 1);
  const [episodes, setEpisodes] = useState<Record<number, Episode[]>>({});
  const [loading, setLoading] = useState(false);

const fetchEpisodes = async (seasonNumber: number) => {
    // If we already have the episodes for this season, don't fetch again
    if (episodes[seasonNumber]) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/season/${tvId}/${seasonNumber}`);
      const data = await res.json();
      
      // Update the dictionary: { 1: [ep1, ep2], 2: [ep1, ep2] }
      setEpisodes((prev) => ({ ...prev, [seasonNumber]: data.episodes }));
    } catch (error) {
      console.error("Error fetching episodes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEpisodes(selectedSeason);
  }, [selectedSeason]);

 const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSeason(parseInt(e.target.value));
  };

  return (
    <div className="space-y-6">
      {/* 1. Fixed Select Structure */}
      <select 
        className="bg-[#1a1a1a] text-white rounded-md p-4 border border-[#333] w-full cursor-pointer"
        value={selectedSeason}
        onChange={handleSelectChange}
      >
        {seasons.map((season) => (
          <option key={season.season_number} value={season.season_number}>
            {season.name} — {season.episode_count} Episodes
          </option>
        ))}
      </select>

      {/* 2. Episode List Display */}
     <div className="bg-[#1a1a1a] rounded-md border border-[#333] overflow-hidden">
        {loading && !episodes[selectedSeason] ? (
          <div className="p-8 text-center text-[#BCAAA4] animate-pulse">
            Loading episodes...
          </div>
        ) : (
          <ul className="divide-y divide-[#333]">
            {/* Grab the array for the currently selected season key */}
            {episodes[selectedSeason]?.map((ep) => (
              <li key={ep.id} className="p-4 hover:bg-[#252525] transition-colors group">
                <div className="flex gap-4 items-start">
                  {/* Episode Thumbnail */}
                  <div className="relative w-32 h-20 sm:w-48 sm:h-28 flex-shrink-0 bg-[#2a2a2a] rounded overflow-hidden">
                    {ep.still_path ? (
                      <Image
                        src={getTmdbImageUrl(ep.still_path)}
                        alt={ep.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-xs text-gray-500">No Image</div>
                    )}
                  </div>

                  {/* Episode Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm sm:text-base font-bold text-[#FBE9E7] truncate">
                      {ep.episode_number}. {ep.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#BCAAA4] line-clamp-2 mt-1 mb-2">
                      {ep.overview || "No description available."}
                    </p>
                    <button
                      onClick={() => onSelectEpisode({ season: selectedSeason, episode: ep.episode_number })}
                      className="text-xs font-bold text-[#FFAB91] uppercase tracking-wider hover:text-white transition-colors"
                    >
                      ▶ Play Episode
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}