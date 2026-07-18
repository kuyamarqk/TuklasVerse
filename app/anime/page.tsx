// src/app/anime/page.tsx
import Navbar from "@/component/Navbar";
import MediaCard from "@/component/MediaCard";
import Pagination from "@/component/Pagination";
import Breadcrumbs from "@/component/Breadcrumbs";
import { discoverAnime } from "@/lib/tmdb";
import { Metadata } from "next";
import { Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Anime - TuklasVerse",
  description: "Discover the best anime series on TuklasVerse.",
};

interface PageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function AnimePage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams.page || "1");

  let discoverResults;
  try {
    discoverResults = await discoverAnime("tv", currentPage);
  } catch (err) {
    console.error("Failed to load anime page data:", err);
    discoverResults = { results: [], total_pages: 1, total_results: 0 };
  }

  const items = discoverResults.results;
  const totalPages = Math.min(discoverResults.total_pages, 500);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-zinc-100">
      <Navbar />

      <main className="pt-28 pb-16 max-w-7xl mx-auto px-6">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Anime" }]} />

        <div className="mb-8">
          <span className="inline-flex items-center gap-1.5 text-xs text-pink-400 font-bold uppercase tracking-widest bg-pink-500/10 px-2.5 py-1 rounded-md">
            <Sparkles size={12} />
            Anime
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mt-3">
            Anime Series
          </h1>
        </div>

        {items.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
              {items.map((item) => (
                <MediaCard key={item.id} media={item} mediaType="tv" />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath="/anime"
            />
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-white/40 text-sm">No anime found right now.</p>
          </div>
        )}
      </main>
    </div>
  );
}