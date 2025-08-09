// lib/consumet-api.ts

export interface StreamingLink {
  url: string;
  quality?: string;
  provider: string;
  isM3U8?: boolean;
}

export interface ReadingLink {
  url: string;
  provider: string;
  language?: string;
}

/**
 * Fetch streaming links for a given anime episode from Consumet API.
 * @param episodeId - The ID of the anime episode.
 * @returns An array of StreamingLink objects.
 */
export async function getConsumetEpisodeStreamingLinks(episodeId: string): Promise<StreamingLink[]> {
  try {
    const res = await fetch(`https://api.consumet.org/anime/episode/${episodeId}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch anime episode streaming links for episodeId: ${episodeId}`);
    }

    const data = await res.json();

    if (!data.sources || !Array.isArray(data.sources)) {
      return [];
    }

    return data.sources.map((source: any) => ({
      url: source.url,
      quality: source.quality,
      provider: source.provider,
      isM3U8: source.isM3U8 ?? false,
    }));
  } catch (error) {
    console.error('getConsumetEpisodeStreamingLinks error:', error);
    return [];
  }
}

/**
 * Fetch reading links (pages) for a manga/manhwa chapter from Consumet API.
 * @param chapterId - The ID of the manga/manhwa chapter.
 * @returns An array of ReadingLink objects.
 */
export async function getConsumetMangaChapterLinks(chapterId: string): Promise<ReadingLink[]> {
  try {
    const res = await fetch(`https://api.consumet.org/manga/chapter/${chapterId}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch manga chapter links for chapterId: ${chapterId}`);
    }

    const data = await res.json();

    if (!data.pages || !Array.isArray(data.pages)) {
      return [];
    }

    // Assuming pages is an array of image URLs for the chapter
    return data.pages.map((pageUrl: string) => ({
      url: pageUrl,
      provider: 'Consumet',
    }));
  } catch (error) {
    console.error('getConsumetMangaChapterLinks error:', error);
    return [];
  }
}
