// lib/dramabox.ts

const DRAMABOX_BASE_URL = "https://api.sansekai.my.id/api/dramabox";

// ---------- Raw API response shapes (as returned by the Sansekai API) ----------

type RawTagV3 = {
  tagId: number;
  tagName: string;
  tagEnName?: string;
};

type RawRankVo = {
  rankType: number;
  hotCode: string;
  sort: number;
};

type RawDramaBoxItem = {
  bookId: string;
  bookName: string;
  coverWap: string;
  chapterCount: number;
  introduction: string;
  tags: string[];
  tagV3s: RawTagV3[];
  protagonist: string;
  rankVo?: RawRankVo;
  shelfTime: string;
  inLibrary: boolean;
};

type RawVideoPath = {
  quality: number;
  videoPath: string;
};

type RawCdn = {
  cdnDomain: string;
  videoPathList: RawVideoPath[];
};

type RawEpisode = {
  chapterId: string;
  chapterIndex: number;
  chapterName: string;
  cdnList: RawCdn[];
};

// ---------- Clean, app-facing types ----------

export type DramaTag = {
  id: number;
  name: string;
  nameEn?: string;
};

export type DramaItem = {
  bookId: string;
  title: string;
  coverUrl: string;
  episodeCount: number;
  synopsis: string;
  tags: DramaTag[];
  cast: string;
  hotCode?: string;
  inLibrary: boolean;
};

export type DramaEpisodeQuality = {
  quality: number;
  url: string;
};

export type DramaEpisode = {
  chapterId: string;
  index: number;
  name: string;
  qualities: DramaEpisodeQuality[];
};

// ---------- Mappers ----------

function mapDramaItem(raw: RawDramaBoxItem): DramaItem {
  return {
    bookId: raw.bookId,
    title: raw.bookName,
    coverUrl: raw.coverWap,
    episodeCount: raw.chapterCount,
    synopsis: raw.introduction,
    tags: (raw.tagV3s || []).map((t) => ({
      id: t.tagId,
      name: t.tagName,
      nameEn: t.tagEnName,
    })),
    cast: raw.protagonist?.trim() || "",
    hotCode: raw.rankVo?.hotCode,
    inLibrary: !!raw.inLibrary,
  };
}

function mapEpisode(raw: RawEpisode): DramaEpisode {
  // Flatten every CDN's quality list into one array, sorted highest quality first.
  const qualities: DramaEpisodeQuality[] = raw.cdnList.flatMap((cdn) =>
    cdn.videoPathList.map((v) => ({ quality: v.quality, url: v.videoPath }))
  );
  qualities.sort((a, b) => b.quality - a.quality);

  return {
    chapterId: raw.chapterId,
    index: raw.chapterIndex,
    name: raw.chapterName,
    qualities,
  };
}

// ---------- Fetch helpers ----------

// NOTE: this is an unofficial, community-run API wrapping DramaBox's own
// backend. It can go down, rate-limit, or change shape without notice —
// every function here fails soft (returns an empty array/null) rather than
// throwing, so a single flaky call doesn't take down a whole page.

async function fetchDramaList(endpoint: string): Promise<DramaItem[]> {
  try {
    const res = await fetch(`${DRAMABOX_BASE_URL}/${endpoint}`, {
      // Cache for 30 minutes — this data doesn't need to be real-time,
      // and it's polite to the free community-hosted API.
      next: { revalidate: 1800 },
    });

    if (!res.ok) {
      console.error(`DramaBox API error on /${endpoint}:`, res.status);
      return [];
    }

    const data: RawDramaBoxItem[] = await res.json();
    if (!Array.isArray(data)) return [];

    return data.map(mapDramaItem);
  } catch (err) {
    console.error(`Failed to fetch DramaBox /${endpoint}:`, err);
    return [];
  }
}

export async function getTrendingDramas(): Promise<DramaItem[]> {
  return fetchDramaList("trending");
}

export async function getLatestDramas(): Promise<DramaItem[]> {
  return fetchDramaList("latest");
}

export async function getForYouDramas(): Promise<DramaItem[]> {
  return fetchDramaList("foryou");
}

export async function searchDramas(query: string): Promise<DramaItem[]> {
  if (!query.trim()) return [];

  try {
    const res = await fetch(
      `${DRAMABOX_BASE_URL}/search?query=${encodeURIComponent(query)}`,
      { next: { revalidate: 600 } }
    );

    if (!res.ok) {
      console.error("DramaBox search error:", res.status);
      return [];
    }

    const data: RawDramaBoxItem[] = await res.json();
    if (!Array.isArray(data)) return [];

    return data.map(mapDramaItem);
  } catch (err) {
    console.error("Failed to search DramaBox:", err);
    return [];
  }
}

export async function getAllEpisodes(bookId: string): Promise<DramaEpisode[]> {
  try {
    const res = await fetch(
      `${DRAMABOX_BASE_URL}/allepisode?bookId=${encodeURIComponent(bookId)}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      console.error("DramaBox allepisode error:", res.status);
      return [];
    }

    const data: RawEpisode[] = await res.json();
    if (!Array.isArray(data)) return [];

    return data.map(mapEpisode).sort((a, b) => a.index - b.index);
  } catch (err) {
    console.error("Failed to fetch DramaBox episodes:", err);
    return [];
  }
}

// The /stream endpoint is explicitly rate-limited by the API itself,
// so this is intentionally NOT cached long-term — call it lazily,
// only when the user actually presses play on a specific episode.
export async function getEpisodeStream(
  bookId: string,
  episode: number
): Promise<DramaEpisode | null> {
  try {
    const res = await fetch(
      `${DRAMABOX_BASE_URL}/stream?bookId=${encodeURIComponent(bookId)}&episode=${episode}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      console.error("DramaBox stream error:", res.status);
      return null;
    }

    const data: RawEpisode = await res.json();
    if (!data?.chapterId) return null;

    return mapEpisode(data);
  } catch (err) {
    console.error("Failed to fetch DramaBox stream:", err);
    return null;
  }
}

// ---------- Small display helpers (mirrors your lib/tmdb.ts helper style) ----------

export function getBestQualityUrl(episode: DramaEpisode): string | null {
  return episode.qualities[0]?.url ?? null;
}

export function formatHotCode(hotCode?: string): string | null {
  return hotCode ?? null;
}

export async function getDramaByBookId(bookId: string): Promise<DramaItem | null> {
  const [trending, latest, forYou] = await Promise.all([
    getTrendingDramas(),
    getLatestDramas(),
    getForYouDramas(),
  ]);

  const allLists = [...trending, ...latest, ...forYou];
  return allLists.find((d) => d.bookId === bookId) ?? null;
}