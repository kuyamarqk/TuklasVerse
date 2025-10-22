import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ tvId: string; seasonNumber: string }> }
): Promise<Response> {
  // ✅ Await the params because they're now a Promise
  const { tvId, seasonNumber } = await context.params;

  // --- Your TMDB API logic here ---
  // Example:
  // const TMDB_API_KEY = process.env.TMDB_API_KEY;
  // const url = `https://api.themoviedb.org/3/tv/${tvId}/season/${seasonNumber}?api_key=${TMDB_API_KEY}`;
  // const res = await fetch(url);
  // const data = await res.json();

  return NextResponse.json({
    tvId,
    seasonNumber,
    message: "Data fetched successfully",
  });
}
