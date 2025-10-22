// src/app/api/season/[tvId]/[seasonNumber]/route.ts (FINAL FIX)
import { NextRequest, NextResponse } from 'next/server';

// Delete the ContextProps interface

export async function GET(
  request: NextRequest, 
  // ⭐ Use in-line destructuring and typing for the params object
  { params }: { params: { tvId: string; seasonNumber: string } } 
): Promise<Response> {
    const { tvId, seasonNumber } = params;

    // --- Add your TMDB API Fetch logic here ---
    // Example:
    // const TMDB_API_KEY = process.env.TMDB_API_KEY;
    // const url = `https://api.themoviedb.org/3/tv/${tvId}/season/${seasonNumber}?api_key=${TMDB_API_KEY}`;
    
    // ... fetch and error handling logic ...

    return NextResponse.json({ tvId, seasonNumber, message: 'Data fetched successfully' });
}