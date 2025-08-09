'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Components
import VidSrcEmbed from 'components/VidSrcEmbed';
import EpisodeList from 'components/EpisodeList'; // For TV series
import AnimeEpisodeList from 'components/AnimeEpisodeList'; // For Anime
import AnimePlayer from 'components/AnimePlayer';

// TMDB API Imports
import { getMovieDetailsTmdb, getTvSeriesDetailsTmdb, getTvSeriesSeasonDetailsTmdb } from 'lib/tmdb-api';
import type { Episode, Season, TvSeriesDetailData, MovieDetailData } from 'types';

// Anime API Imports
import { getAnimeDetailsJikan } from 'lib/jikan-api';
import { getConsumetEpisodeStreamingLinks } from 'lib/consumet-api';

type ContentType = 'movie' | 'tv' | 'anime';

export default function WatchPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const contentType = (searchParams.get('contentType') ?? 'movie') as ContentType;
  const seasonParam = searchParams.get('season');
  const episodeParam = searchParams.get('episode');
  const animeEpisodeIdParam = searchParams.get('animeEpisodeId');

  const [movie, setMovie] = useState<MovieDetailData | null>(null);
  const [tv, setTv] = useState<TvSeriesDetailData | null>(null);
  const [anime, setAnime] = useState<any | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<number | null>(seasonParam ? parseInt(seasonParam) : null);
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(episodeParam ? parseInt(episodeParam) : null);
  const [selectedAnimeEpisodeId, setSelectedAnimeEpisodeId] = useState<string | null>(animeEpisodeIdParam);

  const [animeVideoUrl, setAnimeVideoUrl] = useState<string | null>(null);

  // Effect to load content details (Movie, TV, or Anime)
useEffect(() => {
  const loadContent = async () => {
    try {
      if (contentType === 'movie') {
        const data = await getMovieDetailsTmdb(Number(params.id));
        setMovie(data);
      } else if (contentType === 'tv') {
        const data = await getTvSeriesDetailsTmdb(Number(params.id));

        // Map TMDB response to your expected TvSeriesDetailData shape
        const mappedData: TvSeriesDetailData = {
          id: data.id,
          title: data.name,
          description: data.overview,
          firstAirDate: data.first_air_date,
          lastAirDate: data.last_air_date || null,
          genres: data.genres ? data.genres.map(g => g.name) : [],
          status: data.status || 'Unknown',
          numberOfEpisodes: data.number_of_episodes || 0,
          numberOfSeasons: data.number_of_seasons || 0,
          seasons: data.seasons?.map(season => ({
            air_date: season.air_date || null,
            episode_count: season.episode_count,
            id: season.id,
            name: season.name,
            overview: season.overview,
            poster_path: season.poster_path || null,
            season_number: season.season_number,
            vote_average: season.vote_average,
          })) || [],
        };

        setTv(mappedData);

        const defaultSeason = seasonParam
          ? parseInt(seasonParam)
          : mappedData.seasons?.[0]?.season_number ?? 1;

        setSelectedSeason(defaultSeason);
      } else if (contentType === 'anime') {
        const response = await getAnimeDetailsJikan(Number(params.id));
        if (response && typeof response === 'object' && 'data' in response) {
          setAnime(response.data);
        } else {
          setAnime(response);
        }
      }
    } catch (err) {
      console.error('Failed to load content:', err);
      // optionally set error state here
    }
  };

  loadContent();
}, [params.id, contentType, seasonParam]);




  // Effect to load TV episodes
  useEffect(() => {
  if (tv && selectedSeason != null) {
    const loadEpisodes = async () => {
      const seasonDetails = await getTvSeriesSeasonDetailsTmdb(tv.id, selectedSeason);

      // Convert any null air_date to undefined to satisfy the Episode type
      const sanitizedEpisodes = (seasonDetails.episodes || []).map(ep => ({
        ...ep,
        air_date: ep.air_date === null ? undefined : ep.air_date,
      }));

      setEpisodes(sanitizedEpisodes);

      if (!selectedEpisode && sanitizedEpisodes.length > 0) {
        setSelectedEpisode(sanitizedEpisodes[0].episode_number);
      }
    };
    loadEpisodes();
  }
}, [tv, selectedSeason]);


  // Effect to load anime streaming URL
  useEffect(() => {
    if (contentType === 'anime' && selectedAnimeEpisodeId) {
      const fetchAnimeVideo = async () => {
        const streamingLinks = await getConsumetEpisodeStreamingLinks(selectedAnimeEpisodeId);
        // Find the highest quality link
        const highQualityLink = streamingLinks.find(link => link.quality === '1080p' || link.quality === '720p');
        setAnimeVideoUrl(highQualityLink ? highQualityLink.url : streamingLinks[0]?.url || null);
      };
      fetchAnimeVideo();
    }
  }, [selectedAnimeEpisodeId, contentType]);


  const handleSelectEpisode = (episodeNum: number) => {
    setSelectedEpisode(episodeNum);
  };
  
  const handleSelectAnimeEpisode = (episodeId: string) => {
    setSelectedAnimeEpisodeId(episodeId);
  };

 const title = contentType === 'movie' ? movie?.title : (contentType === 'tv' ? tv?.title : anime?.title);
  const description = contentType === 'movie' ? movie?.overview : (contentType === 'tv' ? tv?.description : anime?.synopsis);


  return (
    <main className="min-h-screen bg-black text-white p-4">
      <div className="mb-4 text-sm">
        <Link href="/" className="text-gray-400">Home</Link> /&nbsp;
        {title && <span className="text-gray-300">{title}</span>}
      </div>

      {/* Conditional Video Player */}
      {contentType === 'anime' ? (
        <AnimePlayer videoUrl={animeVideoUrl} />
      ) : (
        <VidSrcEmbed
          tmdbId={params.id}
          contentType={contentType}
          season={selectedSeason ?? undefined}
          episode={selectedEpisode ?? undefined}
        />
      )}

      {/* Conditional Episode Selector */}
      {contentType === 'tv' && tv && (
        <div className="mt-6">
          <EpisodeList
            seriesId={tv.id}
            seasons={tv.seasons as Season[]}
            currentEpisode={selectedEpisode}
            onSelectEpisode={handleSelectEpisode}
          />
        </div>
      )}

      {/* Episode Selector for Anime */}
      {contentType === 'anime' && anime && (
        <div className="mt-6">
          <AnimeEpisodeList
      animeId={anime.mal_id}
      episodes={animeEpisodes}
      currentEpisodeId={selectedAnimeEpisodeId}
      onSelectEpisode={handleSelectAnimeEpisode}
    />
        </div>
      )}

      {/* Description */}
      <section className="mt-8 max-w-4xl text-gray-300">
        <h2 className="text-2xl font-semibold mb-2">{title}</h2>
        <p>{description}</p>
      </section>
    </main>
  );
}