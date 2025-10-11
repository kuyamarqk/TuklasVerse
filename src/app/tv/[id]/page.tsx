import { getTvDetails, getPopularTvSeries } from '@/lib/tmdb-api';
import TvClient from './TvClient';

export default async function TvPage(props: { params: { id: string } }) {
  const params = await props.params; // ✅ Await the params object
  const tvId = parseInt(params.id);  // ✅ Now safe to use

  const tv = await getTvDetails(tvId);
  const related = await getPopularTvSeries(1);

  return <TvClient tv={tv} related={related} />;
}

