// src/types/index.ts

export type ContentCardTypeType = 'anime' | 'movie' | 'tv-series' | 'manga' | 'blog' | 'project';

export interface ContentCardType {
  id: number;
  title: string;
  imageUrl: string;
  genre: string;
  year: string;
  type: ContentCardTypeType;
  score?: number;
  episodes?: number;
  chapters?: number;
  volumes?: number;
  projectLink?: string;
}

export interface Episode {
  id: number;
  name: string;
  episode_number: number;
  overview?: string;
  air_date?: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  avatarUrl?: string;
  timestamp: string;
  content: string;
}

export interface DropdownOption {
  label: string;
  value: string;
}

export interface AnimeDetailData {
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
  relatedContent: ContentCardType[];
  comments: Comment[];
}

export interface WatchContentData {
  id: number;
  title: string;
  parentTitle?: string;
  contentType: 'episode' | 'movie';
  contentNumber?: number;
  videoUrl: string;
}

export interface Season {
  id: number;
  name: string;
  season_number: number;
  overview: string | null;
  air_date: string | null;
  poster_path: string | null;
  episode_count: number;
}

export interface TvSeriesDetailData {
  id: number;
  title: string;
  description: string;
  genres: string[];
  status: string;
  firstAirDate: string;
  lastAirDate: string | null;
  numberOfEpisodes: number;
  numberOfSeasons: number;
  episodeRunTime: string;
  creators: string[];
  score: number;
  posterImageUrl: string;
  bannerImageUrl: string;
  seasons: Season[];
  relatedContent: ContentCardType[];
  comments: Comment[];
}

export interface MovieDetailData {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  runtime: number | null;
  vote_average: number;
  genres: { id: number; name: string }[];
  status?: string;
  tagline?: string;
  original_language?: string;
  spoken_languages?: { iso_639_1: string; name: string }[];
  production_companies?: { id: number; name: string }[];
}

export interface DetailPageProps {
  params: {
    id: string;
  };
}
export interface AnimeDetailPageProps {
  params: {
    id: string;
  };
}

export interface EpisodeListProps {
  episodes: Episode[];
}
