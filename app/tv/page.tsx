// app/tv/page.tsx
import Link from "next/link";
import MediaCard from "@/component/MediaCard";
import Pagination from "@/component/Pagination";
import { getPopularTV, Media } from "@/lib/tmdb";

type PageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function TVCatalogPage({ searchParams }: PageProps) {
  // Extract and parse page numbers safely from Server runtime
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams.page) || 1;
  
  let tvShows: Media[] = []; 
  let totalPages = 500; // TMDB enforces a hard limit cap of 500 pages max for list distributions
  let errorMessage = "";

  try {
    /* 🍿 FIXED: Hooked into your native getPopularTV library helper 
       and forwarded the requested page index seamlessly. */
    const response = await getPopularTV(currentPage);
    
    tvShows = response?.results || [];
    if (response?.total_pages) {
      totalPages = Math.min(response.total_pages, 500);
    }
  } catch (error) {
    console.error("Failed to fetch TV catalog profiles:", error);
    errorMessage = "Could not sync collection metrics from TMDB pipelines.";
  }

  // Helper function to chunk the array into groups of exactly 5
  const chunkTVShows = (array: Media[], size: number) => {
    const chunked: Media[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunked.push(array.slice(i, i + size));
    }
    return chunked;
  };

  const tvRows = chunkTVShows(tvShows, 5);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-zinc-100 px-6 py-10 selection:bg-violet-500/30">
      
      {/* HEADER BREADCRUMB */}
      <div className="max-w-7xl mx-auto mb-6">
        <Link 
          href="/" 
          className="text-xs font-bold text-zinc-500 hover:text-violet-400 transition-colors uppercase tracking-widest no-underline"
        >
          ← Back to Explorer
        </Link>
      </div>

      {/* INTERFACE CATALOGUE TITLE */}
      <header className="max-w-7xl mx-auto mb-10 border-b border-white/5 pb-6">
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight bg-linear-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
          Explore TV Shows
        </h1>
        <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wider font-semibold">
          Live TMDB Collection Network • Page {currentPage}
        </p>
      </header>

      {/* RESPONSIVE RENDERING ENGINE GRID */}
      <main className="max-w-7xl mx-auto">
        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 mb-6">
            ⚠️ {errorMessage}
          </div>
        )}

        {tvShows.length === 0 && !errorMessage ? (
          <div className="text-center py-20 text-xs text-zinc-500">
            No media matches extracted from target servers.
          </div>
        ) : (
          <div className="space-y-6">
            {tvRows.map((row, rowIndex) => (
              <div 
                key={rowIndex} 
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
              >
                {row.map((item) => (
                  <div key={item.id} className="flex flex-col">
                    <MediaCard media={item} mediaType="tv" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* PAGINATION INTERACTIVE CONTROL STRIP */}
        {!errorMessage && tvShows.length > 0 && (
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            basePath="/tv" 
          />
        )}
      </main>

    </div>
  );
}