// src/app/api/search/route.ts
import { NextRequest, NextResponse } from "next/server";

type TMDBRawItem = Record<string, unknown>;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const type = searchParams.get("type") || "multi"; // multi, movie, or tv

  if (!query.trim()) {
    return NextResponse.json({ results: [] });
  }

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
    },
  };

  try {
    // 💡 CHECK: If the query is an ID number, use TMDB Discover instead of plain search
    const isGenreId = /^\d+$/.test(query);

    let url = `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`;

    if (isGenreId) {
      // If a numeric ID is passed, filter using discover endpoint
      const discoverType = type === "tv" ? "tv" : "movie";
      url = `https://api.themoviedb.org/3/discover/${discoverType}?with_genres=${query}&include_adult=false&language=en-US&sort_by=popularity.desc&page=1`;
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`TMDB responded with a status of ${response.status}`);
    }

    const data = await response.json();

    // If using discover, manually inject media_type since TMDB's discover response omits it
    if (isGenreId && data.results) {
      data.results = data.results.map((item: TMDBRawItem) => ({
        ...item,
        media_type: type === "tv" ? "tv" : "movie"
      }));
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Search API Routing Error:", error);
    return NextResponse.json({ error: "Failed to parse search request" }, { status: 500 });
  }
}