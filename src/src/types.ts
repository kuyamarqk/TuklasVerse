export type ContentCardTypeType = 'movie' | 'tv';

export interface ContentCardType {
  id: number;
  title: string;
  imageUrl: string;
  posterUrl: string;
  releaseDate:string;
  overview:string;
  genre: string;
  year: string;
  type: ContentCardTypeType;
  score?: number;

}
export interface TmdbTv {
  id: number;
  name: string;
  poster_path: string | null;
  first_air_date: string;
  overview: string;
  vote_average: number;
}

export interface RelatedTvResponse {
  page: number;
  results: TmdbTv[]; // Uses the TmdbTv interface
  total_pages: number;
  total_results: number;
}
