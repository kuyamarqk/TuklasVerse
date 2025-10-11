import { NextRequest } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { tvId: string; seasonNumber: string } }) {
  const { tvId, seasonNumber } = params;

  const res = await fetch(`https://api.themoviedb.org/3/tv/${tvId}/season/${seasonNumber}?api_key=${process.env.TMDB_API_KEY}`);
  const data = await res.json();

  return Response.json({ episodes: data.episodes });
}
