import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ tvId: string; seasonNumber: string }> }
): Promise<Response> {
  const { tvId, seasonNumber } = await context.params;

  // 1. Get your API Key from .env.local
  // Old line: const TMDB_API_KEY = process.env.TMDB_API_KEY;
// New line:
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  if (!TMDB_API_KEY) {
    return NextResponse.json({ error: "API Key missing" }, { status: 500 });
  }

  try {
    // 2. Fetch the actual season data from TMDB
    const url = `https://api.themoviedb.org/3/tv/${tvId}/season/${seasonNumber}?api_key=${TMDB_API_KEY}&language=en-US`;
    
    const res = await fetch(url, {
      next: { revalidate: 3600 } // Optional: Cache for 1 hour
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch from TMDB" }, { status: res.status });
    }

    const data = await res.json();

    if (data.episodes && Array.isArray(data.episodes)) {
  data.episodes.reverse();
}

    // 3. Return the actual data (which includes the 'episodes' array)
    return NextResponse.json(data);
  } catch (error) {
  console.error("Season API Error:", error); // Now the variable is "used"
  return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
}
}