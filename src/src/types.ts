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
