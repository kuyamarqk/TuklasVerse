// app/api/genres/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getGenres, MediaType } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = (searchParams.get("type") as MediaType) || "movie";

  if (type !== "movie" && type !== "tv") {
    return NextResponse.json(
      { error: "Invalid type parameter", genres: [] },
      { status: 400 }
    );
  }

  try {
    const genres = await getGenres(type);
    return NextResponse.json({ genres });
  } catch (err) {
    console.error("Failed to fetch genres:", err);
    return NextResponse.json(
      { error: "Failed to fetch genres", genres: [] },
      { status: 500 }
    );
  }
}