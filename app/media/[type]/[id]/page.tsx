import { notFound } from "next/navigation";
import Image from "next/image";
import Navbar from "@/component/Navbar";
import MediaRow from "@/component/MediaRow";
import WatchlistButton from "@/component/WatchlistButton";
import VideoPlayer, { SeasonDetail } from "@/component/VideoPlayer";
import { Metadata } from "next";
import {
  getMediaDetail,
  getRecommendations,
  getBackdropUrl,
  getPosterUrl,
  getTitle,
  getYear,
  MediaType,
} from "@/lib/tmdb";
import { Star, Clock, Tv } from "lucide-react";

// Strong Next.js Page Context types
interface PageProps {
  params: Promise<{
    type: string;
    id: string;
  }>;
  searchParams: Promise<{
    season?: string;
    episode?: string;
  }>;
}
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const mediaType = resolvedParams.type as MediaType;
  const tmdbId = Number(resolvedParams.id);
  
  try {
    const detail = await getMediaDetail(mediaType, tmdbId);
    return {
      title: `${detail.title || detail.name} - TuklasVerse`,
      description: detail.overview ? `${detail.overview.slice(0, 150)}...` : "Watch free streaming media movies and tv programs.",
      openGraph: {
        images: [detail.backdrop_path ? `https://image.tmdb.org/t/p/w1280${detail.backdrop_path}` : ''],
      },
    };
  } catch {
    return { title: "Watch Media - TuklasVerse" };
  }
}

export default async function MediaDetailPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const type = resolvedParams.type;
  const id = resolvedParams.id;

  if (type !== "movie" && type !== "tv") notFound();

  const mediaType = type as MediaType;
  const tmdbId = Number(id);

  const currentSeason = Number(resolvedSearchParams.season || "1");
  const currentEpisode = Number(resolvedSearchParams.episode || "1");

  // ⭐ These run strictly on the secure backend server now! No leaked API Tokens.
  let detail;
  let recommendations;
  try {
    [detail, recommendations] = await Promise.all([
      getMediaDetail(mediaType, tmdbId),
      getRecommendations(mediaType, tmdbId),
    ]);
  } catch (err) {
    console.error("Failed to load TMDB metrics on server:", err);
    return notFound();
  }

  if (!detail) return notFound();

  const backdrop = getBackdropUrl(detail.backdrop_path);
  const poster = getPosterUrl(detail.poster_path, "w500");
  const title = getTitle(detail);
  const year = getYear(detail);
  const trailer = detail.videos?.results.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-zinc-100">
      <Navbar />

      <main className="pt-16 pb-12">
        {/* PLAYER WRAPPER BOX */}
        {/* Note: The client side VideoPlayer handles its own theater sizing independently inside */}
        <div className="w-full bg-black/40 border-b border-white/5 py-6">
          <VideoPlayer
            tmdbId={tmdbId}
            mediaType={mediaType}
            title={title}
            backdrop={backdrop}
            season={currentSeason}
            episode={currentEpisode}
            seasonsData={"seasons" in detail ? (detail.seasons as SeasonDetail[]) : undefined}
          />
        </div>

        {/* Info Detail Layout Layer */}
        <div className="max-w-5xl mx-auto px-6 mt-10 relative z-10">
          <div className="flex flex-col sm:flex-row gap-8 mb-12">
            {poster && (
              <div className="hidden sm:block shrink-0 w-44 aspect-2/3 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <Image src={poster} alt={title} width={176} height={264} className="object-cover w-full h-full" />
              </div>
            )}

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-xs text-violet-400 font-bold uppercase tracking-widest bg-violet-500/10 px-2.5 py-1 rounded-md">
                  {mediaType === "tv" ? "TV Series" : "Movie"}
                </span>
                {detail.genres?.slice(0, 3).map((g) => (
                  <span key={g.id} className="text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-white/60">
                    {g.name}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2 text-white">{title}</h1>

              <div className="flex items-center gap-4 text-sm text-white/40 mb-5">
                {year && <span className="font-medium">{year}</span>}
                {detail.runtime && <span className="flex items-center gap-1.5"><Clock size={14} /> {detail.runtime}m</span>}
                {detail.number_of_seasons && <span className="flex items-center gap-1.5"><Tv size={14} /> {detail.number_of_seasons} seasons</span>}
                {detail.vote_average > 0 && (
                  <span className="flex items-center gap-1.5 bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded font-semibold">
                    <Star size={13} className="fill-amber-400" /> {detail.vote_average.toFixed(1)}
                  </span>
                )}
              </div>

              {detail.tagline && <p className="text-sm text-white/40 italic mb-3">&ldquo;{detail.tagline}&rdquo;</p>}
              <p className="text-base text-white/70 leading-relaxed mb-6 max-w-2xl">{detail.overview}</p>

             <WatchlistButton tmdbId={tmdbId} mediaType={mediaType} title={title} posterPath={detail.poster_path} />
            </div>
          </div>

          {/* Trailer Viewport */}
          {trailer && (
            <div className="mb-12 border-t border-white/5 pt-8">
              <h2 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4">Official Trailer</h2>
              <div className="aspect-video rounded-xl overflow-hidden bg-white/5 max-w-xl border border-white/10">
                <iframe src={`https://www.youtube.com/embed/${trailer.key}`} className="w-full h-full" allowFullScreen title={`${title} trailer`} />
              </div>
            </div>
          )}
        </div>

        {/* Recommendations Carousels */}
        {recommendations?.results && recommendations.results.length > 0 && (
          <div className="max-w-5xl mx-auto mt-4 border-t border-white/5 pt-8 px-6">
            <MediaRow title="You might also like" items={recommendations.results.slice(0, 15)} mediaType={mediaType} />
          </div>
        )}
      </main>
    </div>
  );
}