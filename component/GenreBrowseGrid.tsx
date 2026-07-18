// component/GenreBrowseGrid.tsx
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { getGenres, slugifyGenre, MediaType } from "@/lib/tmdb";

type GenreBrowseGridProps = {
  mediaType?: MediaType;
};

// A curated set of accent colors cycled across the genre pills so the grid
// doesn't look flat — purely decorative, no meaning tied to specific genres.
const ACCENTS = [
  "hover:border-violet-500/40 hover:bg-violet-500/10",
  "hover:border-rose-500/40 hover:bg-rose-500/10",
  "hover:border-amber-500/40 hover:bg-amber-500/10",
  "hover:border-emerald-500/40 hover:bg-emerald-500/10",
  "hover:border-sky-500/40 hover:bg-sky-500/10",
  "hover:border-fuchsia-500/40 hover:bg-fuchsia-500/10",
];

export default async function GenreBrowseGrid({ mediaType = "movie" }: GenreBrowseGridProps) {
  let genres;
  try {
    genres = await getGenres(mediaType);
  } catch (err) {
    console.error("Failed to load genres:", err);
    return null;
  }

  if (!genres || genres.length === 0) return null;

  return (
    <section className="mb-10">
      <div className="mb-4 px-6">
        <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest">
          Browse by Genre
        </h2>
      </div>

      <div className="px-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {/* Special Anime shortcut — distinct styling since it's not a real TMDB genre */}
        <Link
          href="/anime"
          className="flex items-center justify-center gap-1.5 text-center px-4 py-4 rounded-xl bg-pink-500/10 border border-pink-500/20 text-sm font-semibold text-pink-300 hover:bg-pink-500/20 hover:border-pink-500/40 hover:text-pink-200 transition-all duration-200"
        >
          <Sparkles size={14} />
          Anime
        </Link>

        {genres.map((genre, idx) => (
          <Link
            key={genre.id}
            href={`/genre/${slugifyGenre(genre.name)}/${mediaType}`}
            className={`flex items-center justify-center text-center px-4 py-4 rounded-xl bg-white/5 border border-white/5 text-sm font-semibold text-white/70 hover:text-white transition-all duration-200 ${ACCENTS[idx % ACCENTS.length]}`}
          >
            {genre.name}
          </Link>
        ))}
      </div>
    </section>
  );
}