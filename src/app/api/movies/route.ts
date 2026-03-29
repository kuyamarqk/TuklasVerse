import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // 1. Get the new search query parameter
  const query = searchParams.get("query"); 
  
  const page = searchParams.get("page") || "1";
  const type = searchParams.get("type") || "popular";
  const genreId = searchParams.get("genre");
 // Old line: const TMDB_API_KEY = process.env.TMDB_API_KEY;
// New line:
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  let url = "";

  // 2. Prioritize Search if a query exists
  if (query && query.trim() !== "") {
    url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`;
  } 
  // 3. Fallback to Genre Filtering
  else if (genreId && genreId !== "null") {
    url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&page=${page}&with_genres=${genreId}`;
  } 
  // 4. Fallback to Trending
  else if (type === "trending") {
    url = `https://api.themoviedb.org/3/trending/movie/day?api_key=${TMDB_API_KEY}&page=${page}`;
  } 
  // 5. Default to Popular
  else {
    url = `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`;
  }

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("TMDB API response error");
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}