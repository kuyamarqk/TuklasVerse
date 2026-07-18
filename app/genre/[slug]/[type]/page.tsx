// src/app/genre/[slug]/[type]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/component/Navbar";
import MediaCard from "@/component/MediaCard";
import Pagination from "@/component/Pagination";
import Breadcrumbs from "@/component/Breadcrumbs";
import { discoverByGenre, getGenreBySlug, MediaType } from "@/lib/tmdb";
import { Metadata } from "next";
import { Film, Tv } from "lucide-react";

interface PageProps {
  params: Promise<{
    slug: string;
    type: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const type = resolvedParams.type as MediaType;

  try {
    const genre = await getGenreBySlug(type, resolvedParams.slug);
    return {
      title: genre ? `${genre.name} ${type === "tv" ? "TV Series" : "Movies"} - TuklasVerse` : "Browse - TuklasVerse",
      description: genre
        ? `Discover the best ${genre.name.toLowerCase()} ${type === "tv" ? "TV series" : "movies"} on TuklasVerse.`
        : "Browse movies and TV series by genre on TuklasVerse.",
    };
  } catch {
    return { title: "Browse - TuklasVerse" };
  }
}

export default async function GenrePage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const { slug } = resolvedParams;
  const type = resolvedParams.type;
  const currentPage = Number(resolvedSearchParams.page || "1");

  if (type !== "movie" && type !== "tv") notFound();
  const mediaType = type as MediaType;

  // Check both sides so we can show/hide tabs based on which type actually
  // has this genre (e.g. "Kids" only exists for TV, not movies).
  let movieGenre;
  let tvGenre;
  try {
    [movieGenre, tvGenre] = await Promise.all([
      getGenreBySlug("movie", slug),
      getGenreBySlug("tv", slug),
    ]);
  } catch (err) {
    console.error("Failed to resolve genre slug:", err);
    return notFound();
  }

  const activeGenre = mediaType === "movie" ? movieGenre : tvGenre;
  if (!activeGenre) return notFound();

  let discoverResults;
  try {
    discoverResults = await discoverByGenre(mediaType, activeGenre.id, currentPage);
  } catch (err) {
    console.error("Failed to load genre discover results:", err);
    return notFound();
  }

  const items = discoverResults.results;
  const totalPages = Math.min(discoverResults.total_pages, 500);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-zinc-100">
      <Navbar />

      <main className="pt-28 pb-16 max-w-7xl mx-auto px-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: mediaType === "tv" ? "TV Series" : "Movies" },
            { label: activeGenre.name },
          ]}
        />

        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
            {activeGenre.name}
          </h1>

          {/* Movie / TV toggle tabs */}
          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/5">
            {movieGenre && (
              <Link
                href={`/genre/${slug}/movie`}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  mediaType === "movie"
                    ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                <Film size={14} />
                Movies
              </Link>
            )}
            {tvGenre && (
              <Link
                href={`/genre/${slug}/tv`}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  mediaType === "tv"
                    ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                <Tv size={14} />
                TV Series
              </Link>
            )}
          </div>
        </div>

        {items.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
              {items.map((item) => (
                <MediaCard key={item.id} media={item} mediaType={mediaType} />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath={`/genre/${slug}/${mediaType}`}
            />
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-white/40 text-sm">
              No {mediaType === "tv" ? "TV series" : "movies"} found in this genre.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}