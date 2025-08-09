// src/components/AnimeEpisodeList.tsx
"use client";

import React from "react";

interface AnimeEpisode {
  id: number;
  name: string;
  episode_number: number;
  overview?: string;
}

interface AnimeEpisodeListProps {
  episodes: AnimeEpisode[];
  animeId: number;
  currentEpisodeId?: string | null;
  onSelectEpisode?: (episodeId: string) => void;
}

const AnimeEpisodeList: React.FC<AnimeEpisodeListProps> = ({
  episodes,
  animeId,
  currentEpisodeId,
  onSelectEpisode,
}) => {
  if (!episodes || episodes.length === 0) {
    return <div className="text-gray-400">No episodes available.</div>;
  }

  return (
    <div className="bg-[#3E2723] p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-xl font-semibold mb-4 text-[#FBE9E7]">Episodes</h3>
      <ul className="space-y-3 max-h-[400px] overflow-y-auto">
        {episodes.map((episode) => {
          const isSelected = currentEpisodeId === episode.id.toString();
          return (
            <li key={episode.id}>
              <button
                onClick={() => onSelectEpisode && onSelectEpisode(episode.id.toString())}
                className={`block w-full text-left p-3 rounded-md transition-colors duration-200
                  ${isSelected ? 'bg-[#FFD54F] text-black' : 'bg-[#4E342E] text-[#FBE9E7] hover:bg-[#5D4037]'}`}
              >
                <p className="font-semibold">
                  Episode {episode.episode_number}: {episode.name}
                </p>
                {episode.overview && (
                  <p className="text-sm text-gray-300 line-clamp-2 mt-1">{episode.overview}</p>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default AnimeEpisodeList;
