import { getTvDetails, getPopularTvSeries } from '@/lib/tmdb-api';
import TvClient from './TvClient';

interface TvPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ s?: string; e?: string }>;
}

export default async function TvPage(props: TvPageProps) {
  const { id } = await props.params;
  const searchParams = await props.searchParams;

  const tvId = Number(id);
  if (!id || isNaN(tvId)) {
    return <main className="text-center py-20 text-red-500">Invalid TV ID.</main>;
  }

  // Fetch data on the server
  const tv = await getTvDetails(tvId);
  const relatedResponse = await getPopularTvSeries(1);

  // Pass data to the Client Component
  return (
    <TvClient 
      tv={tv} 
      related={relatedResponse.results || []} 
      season={Number(searchParams.s || 1)} 
      episode={Number(searchParams.e || 1)} 
    />
  );
}