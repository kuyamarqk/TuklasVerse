// app/api/trending/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getTrending, TrendingMediaType } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = (searchParams.get("type") as TrendingMediaType) || "all";

  try {
    const data = await getTrending(type, "week");
    return NextResponse.json(data);
  } catch (err) {
    console.error("Failed to fetch trending:", err);
    return NextResponse.json(
      { error: "Failed to fetch trending", results: [] },
      { status: 500 }
    );
  }
}