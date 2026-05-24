// src/app/api/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { searchMedia } from "@/lib/tmdb";

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get("q");
    
    if (!q || !q.trim()) {
      return NextResponse.json({ results: [], total_pages: 0, total_results: 0 });
    }

    // ⭐ Leverage your existing clean TMDB fetch utility function
    const data = await searchMedia(q);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("API search route error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}