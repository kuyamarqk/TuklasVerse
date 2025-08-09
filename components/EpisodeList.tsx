// src/components/EpisodeList.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Assuming you have these TMDB API types and functions
import { getTmdbImageUrl, getTvSeriesSeasonDetailsTmdb } from 'lib/tmdb-api';

// Interfaces (These can be moved to a shared 'types' file if preferred)
interface Episode {
  id: number;
  name: string;
  episode_number: number;
  season_number: number;
  air_date: string | null;
  overview: string;
  still_path: string | null;
  vote_average: number;
}

interface Season {
  id: number;
  name: string;
  season_number: number;
  overview: string | null;
  poster_path: string | null;
  episode_count: number;
}

interface EpisodeListProps {
  seriesId: number;
  seasons: Season[];
  currentEpisode?: number | null;
  onSelectEpisode?: (episodeNum: number) => void;
}

const EpisodeList: React.FC<EpisodeListProps> = ({
  seriesId,
  seasons,
  currentEpisode,
  onSelectEpisode,
}) => {
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Clear episodes and selected season when seriesId changes
  useEffect(() => {
    setEpisodes([]);
    setSelectedSeason(null);
  }, [seriesId]);

  const fetchEpisodesForSeason = async (seasonNumber: number) => {
    setLoadingEpisodes(true);
    setError(null);
    try {
      const data = await getTvSeriesSeasonDetailsTmdb(seriesId, seasonNumber);
      setEpisodes(data.episodes || []);
    } catch (err) {
      console.error(`Failed to fetch episodes for season ${seasonNumber}:`, err);
      setError('Failed to load episodes. Please try again.');
      setEpisodes([]);
    } finally {
      setLoadingEpisodes(false);
    }
  };

  const handleSeasonClick = (seasonNumber: number) => {
    if (selectedSeason === seasonNumber) {
      setSelectedSeason(null);
      setEpisodes([]);
    } else {
      setSelectedSeason(seasonNumber);
      fetchEpisodesForSeason(seasonNumber);
    }
  };

  if (!seasons || seasons.length === 0) {
    return <div className="text-gray-400">No season information available.</div>;
  }

  // Filter out the 'Season 0' special season if it exists
  const displaySeasons = seasons.filter(season => season.season_number !== 0);

  return (
    <div className="bg-[#3E2723] p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-xl font-semibold mb-4 text-[#FBE9E7]">Seasons & Episodes</h3>
      {displaySeasons
        .sort((a, b) => a.season_number - b.season_number)
        .map((season) => (
          <div key={season.id} className="mb-4 last:mb-0">
            <button
              onClick={() => handleSeasonClick(season.season_number)}
              className="flex justify-between items-center w-full bg-[#4E342E] hover:bg-[#5D4037] text-[#FBE9E7] p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
            >
              <span className="font-medium">
                Season {season.season_number} ({season.episode_count} Episodes)
              </span>
              <span>{selectedSeason === season.season_number ? '▲' : '▼'}</span>
            </button>
            {selectedSeason === season.season_number && (
              <div className="mt-3 ml-4 border-l border-gray-600 pl-4">
                {loadingEpisodes && <p className="text-gray-400">Loading episodes...</p>}
                {error && <p className="text-red-400">{error}</p>}
                {!loadingEpisodes && !error && episodes.length === 0 && (
                  <p className="text-gray-400">No episodes found for this season.</p>
                )}
                {!loadingEpisodes && !error && episodes.length > 0 && (
                  <ul className="space-y-3">
                    {episodes.map((episode) => (
                      <li
                        key={episode.id}
                        className={
                          episode.episode_number === currentEpisode
                            ? "bg-yellow-600 rounded-md"
                            : ""
                        }
                      >
                        <Link
                          href={`/watch/${seriesId}?contentType=tv&season=${episode.season_number}&episode=${episode.episode_number}`}
                          className="flex items-start gap-3 bg-[#42302A] p-3 rounded-md hover:bg-[#5D4037] transition-colors duration-200"
                          onClick={() => onSelectEpisode && onSelectEpisode(episode.episode_number)}
                        >
                          <div className="flex-shrink-0 w-24 h-14 relative rounded-md overflow-hidden">
                            <Image
                              src={getTmdbImageUrl(episode.still_path, 'w300')}
                              alt={`Episode ${episode.episode_number} still`}
                              fill
                              className="object-cover object-center"
                            />
                          </div>
                          <div className="flex-grow">
                            <p className="text-sm font-semibold text-[#FFD54F]">
                              E{episode.episode_number}: {episode.name}
                            </p>
                            <p className="text-xs text-gray-300">
                              Air Date: {episode.air_date || 'N/A'}
                            </p>
                            <p className="text-xs text-gray-400 line-clamp-2">
                              {episode.overview || 'No overview available.'}
                            </p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

export default EpisodeList;
