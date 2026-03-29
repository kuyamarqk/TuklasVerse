import { NextRequest, NextResponse } from 'next/server';
import { getPopularTvSeries, getTrendingTvSeries } from '@/lib/tmdb-api';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const type = searchParams.get('type') || 'popular';

  try {
    let data;
    if (type === 'trending') {
      data = await getTrendingTvSeries('day', page);
    } else {
      data = await getPopularTvSeries(page);
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch from TMDB" }, { status: 500 });
  }
}