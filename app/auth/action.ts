"use server";

import { getTrending, getBackdropUrl, getTitle } from "@/lib/tmdb";

export interface AuthBackdrop {
  url: string;
  title: string;
}

export async function getAuthBackdropAction(): Promise<AuthBackdrop | null> {
  try {
    // Fetch today's trending movies or all media from your lib
    const response = await getTrending("movie", "day");

    if (response.results && response.results.length > 0) {
      // Keep only results with a valid backdrop path
      const validMedia = response.results.filter((m) => m.backdrop_path);
      
      if (validMedia.length > 0) {
        const randomMedia = validMedia[Math.floor(Math.random() * validMedia.length)];
        
        // Pass "original" size for full screen display quality
        const backdropUrl = getBackdropUrl(randomMedia.backdrop_path, "original");
        const title = getTitle(randomMedia);

        if (backdropUrl) {
          return { url: backdropUrl, title };
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch server-side auth background:", error);
    return null;
  }
}