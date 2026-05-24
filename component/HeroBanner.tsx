import Image from "next/image";
import Link from "next/link";
import { Play, Info } from "lucide-react";
import { Media, MediaType, getBackdropUrl, getTitle, getYear } from "@/lib/tmdb";

type Props = {
  media: Media;
  mediaType?: MediaType;
};

export default function HeroBanner({ media, mediaType }: Props) {
  const type = mediaType || media.media_type || "movie";
  const backdrop = getBackdropUrl(media.backdrop_path);
  const title = getTitle(media);
  const year = getYear(media);

  return (
    <div className="relative h-[55vh] min-h-90 w-full overflow-hidden">
      {backdrop && (
        <Image
          src={backdrop}
          alt={title}
          fill
          priority
          className="object-cover object-top"
          sizes="100vw"
        />
      )}

      <div className="absolute inset-0 bg-linear-to-r from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0f] via-transparent to-transparent" />

      <div className="absolute bottom-0 left-0 p-6 max-w-lg">
        <p className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-2">
          {year} · {type === "tv" ? "TV Series" : "Movie"}
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-3">
          {title}
        </h1>
        {media.overview && (
          <p className="text-sm text-white/60 line-clamp-2 mb-5">
            {media.overview}
          </p>
        )}

        <div className="flex gap-3">
          <Link
            href={`/media/${type}/${media.id}`}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-xl text-sm font-bold hover:bg-white/90 transition-colors"
          >
            <Play size={15} className="fill-black" />
            Watch now
          </Link>
          <Link
            href={`/media/${type}/${media.id}`}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/10 border border-white/10 rounded-xl text-sm font-semibold hover:bg-white/15 transition-colors"
          >
            <Info size={15} />
            More info
          </Link>
        </div>
      </div>
    </div>
  );
}